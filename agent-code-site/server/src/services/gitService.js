import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export class GitService {
  constructor(repoPath, worktreesBasePath) {
    this.repoPath = repoPath; // Main git repo (main-site)
    this.worktreesBasePath = worktreesBasePath || path.join(path.dirname(repoPath), 'worktrees');
  }

  /**
   * Create a new worktree for a user
   * @param {string} username - User's name
   * @returns {Promise<{branchName: string, worktreePath: string}>}
   */
  async createUserWorktree(username) {
    const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const branchName = `user-${sanitizedUsername}`;
    const worktreePath = path.join(this.worktreesBasePath, branchName);

    try {
      // Check if worktree already exists
      const worktrees = await this.listWorktrees();
      const existing = worktrees.find(w => w.branch === branchName);
      if (existing) {
        console.log(`User worktree already exists: ${branchName}`);
        const mainSitePath = path.join(existing.path, 'agent-code-site', 'main-site');
        return { branchName, worktreePath: mainSitePath };
      }

      // Create directory if it doesn't exist
      await fs.mkdir(this.worktreesBasePath, { recursive: true });

      // Create branch from main if it doesn't exist
      try {
        await this.execGit(`show-ref --verify refs/heads/${branchName}`);
        console.log(`Branch ${branchName} already exists, using it`);
      } catch {
        // Branch doesn't exist, create it from main
        await this.execGit(`branch ${branchName} main`);
        console.log(`Created branch: ${branchName}`);
      }

      // Create worktree
      await this.execGit(`worktree add ${worktreePath} ${branchName}`);

      console.log(`Created user worktree: ${branchName} at ${worktreePath}`);
      // Return path to the main-site directory within the worktree
      const mainSitePath = path.join(worktreePath, 'agent-code-site', 'main-site');
      return { branchName, worktreePath: mainSitePath };
    } catch (error) {
      throw new Error(`Failed to create user worktree: ${error.message}`);
    }
  }

  /**
   * Create a new worktree for a feature/chat session
   * @param {string} username - User's name
   * @param {string} featureSlug - URL-friendly feature description
   * @param {string} sessionId - Session ID
   * @returns {Promise<{branchName: string, worktreePath: string}>}
   */
  async createFeatureWorktree(username, featureSlug, sessionId) {
    const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const sanitizedFeature = featureSlug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const uniqueId = sessionId.slice(0, 8);
    const branchName = `feature-${sanitizedUsername}-${sanitizedFeature}-${uniqueId}`;
    const worktreePath = path.join(this.worktreesBasePath, branchName);

    try {
      // Create directory if it doesn't exist
      await fs.mkdir(this.worktreesBasePath, { recursive: true });

      // Create worktree from user's branch (or main if user branch doesn't exist)
      const userBranch = `user-${sanitizedUsername}`;
      let baseBranch = 'main';

      try {
        await this.execGit(`show-ref --verify refs/heads/${userBranch}`);
        baseBranch = userBranch;
        console.log(`Creating feature from user branch: ${userBranch}`);
      } catch {
        console.log(`User branch not found, creating feature from main`);
      }

      // Create worktree with new branch
      await this.execGit(`worktree add -b ${branchName} ${worktreePath} ${baseBranch}`);

      console.log(`Created feature worktree: ${branchName} at ${worktreePath}`);
      // Return path to the main-site directory within the worktree
      const mainSitePath = path.join(worktreePath, 'agent-code-site', 'main-site');
      return { branchName, worktreePath: mainSitePath };
    } catch (error) {
      throw new Error(`Failed to create feature worktree: ${error.message}`);
    }
  }

  /**
   * List all worktrees
   * @returns {Promise<Array<{path: string, branch: string, commit: string}>>}
   */
  async listWorktrees() {
    try {
      const { stdout } = await this.execGit('worktree list --porcelain');
      const worktrees = [];
      const lines = stdout.split('\n');

      let current = {};
      for (const line of lines) {
        if (line.startsWith('worktree ')) {
          if (current.path) worktrees.push(current);
          current = { path: line.substring(9) };
        } else if (line.startsWith('branch ')) {
          current.branch = line.substring(7).replace('refs/heads/', '');
        } else if (line.startsWith('HEAD ')) {
          current.commit = line.substring(5);
        }
      }
      if (current.path) worktrees.push(current);

      return worktrees;
    } catch (error) {
      throw new Error(`Failed to list worktrees: ${error.message}`);
    }
  }

  /**
   * Get worktree path for a branch
   * @param {string} branchName
   * @returns {Promise<string|null>}
   */
  async getWorktreePath(branchName) {
    const worktrees = await this.listWorktrees();
    const worktree = worktrees.find(w => w.branch === branchName);
    if (!worktree) return null;
    // Return path to the main-site directory within the worktree
    return path.join(worktree.path, 'agent-code-site', 'main-site');
  }

  /**
   * Remove a worktree
   * @param {string} branchName - Branch name
   */
  async removeWorktree(branchName) {
    try {
      // Get the actual worktree root path (not the main-site subdirectory)
      const worktrees = await this.listWorktrees();
      const worktree = worktrees.find(w => w.branch === branchName);

      if (!worktree) {
        console.log(`Worktree not found for branch: ${branchName}`);
        return false;
      }

      // Remove worktree (needs the root path, not the subdirectory)
      await this.execGit(`worktree remove ${worktree.path} --force`);

      // Delete branch
      await this.execGit(`branch -D ${branchName}`);

      console.log(`Removed worktree and branch: ${branchName}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to remove worktree: ${error.message}`);
    }
  }

  /**
   * Commit changes in a specific worktree
   * @param {string} worktreePath - Path to worktree
   * @param {string} message - Commit message
   * @param {string} username - User's name for commit attribution
   */
  async commitChanges(worktreePath, message, username) {
    try {
      // Stage all changes
      await this.execGitInPath('add .', worktreePath);

      // Check if there are changes to commit
      const { stdout: status } = await this.execGitInPath('status --porcelain', worktreePath);
      if (!status.trim()) {
        console.log('No changes to commit');
        return null;
      }

      // Commit with message
      const commitMessage = `${message}\n\nRequested-by: ${username}`;
      await this.execGitInPath(`commit -m "${commitMessage.replace(/"/g, '\\"')}"`, worktreePath);

      console.log(`Committed changes in ${worktreePath}: ${message}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to commit changes: ${error.message}`);
    }
  }

  /**
   * Merge a feature branch into user's branch
   * @param {string} featureBranch - Feature branch to merge
   * @param {string} targetBranch - Target branch (user's branch)
   */
  async mergeToUserBranch(featureBranch, targetBranch) {
    try {
      // Get the raw worktree path (not the subdirectory)
      const worktrees = await this.listWorktrees();
      const targetWorktree = worktrees.find(w => w.branch === targetBranch);

      if (!targetWorktree) {
        throw new Error(`Target worktree not found: ${targetBranch}`);
      }

      // Merge feature branch into target (must run in worktree root)
      await this.execGitInPath(`merge ${featureBranch} --no-ff -m "Apply feature: ${featureBranch}"`, targetWorktree.path);

      console.log(`Merged ${featureBranch} into ${targetBranch}`);
      return true;
    } catch (error) {
      // If merge fails, abort
      try {
        const worktrees = await this.listWorktrees();
        const targetWorktree = worktrees.find(w => w.branch === targetBranch);
        if (targetWorktree) {
          await this.execGitInPath('merge --abort', targetWorktree.path);
        }
      } catch {}

      throw new Error(`Failed to merge feature: ${error.message}`);
    }
  }

  /**
   * Merge a branch into main (admin approval)
   * @param {string} branchName - Branch to merge
   * @param {string} approvedBy - Admin who approved
   */
  async mergeToMain(branchName, approvedBy) {
    try {
      // Main worktree is the repo path
      await this.execGitInPath('checkout main', this.repoPath);

      // Pull latest only if origin exists
      try {
        await this.execGitInPath('remote get-url origin', this.repoPath);
        await this.execGitInPath('pull origin main', this.repoPath);
      } catch {
        console.log('No remote origin configured, skipping pull');
      }

      // Merge feature branch
      await this.execGitInPath(`merge ${branchName} --no-ff -m "Merge ${branchName} (approved by ${approvedBy})"`, this.repoPath);

      console.log(`Merged branch ${branchName} into main`);
      return true;
    } catch (error) {
      // If merge fails, abort
      try {
        await this.execGitInPath('merge --abort', this.repoPath);
      } catch {}

      throw new Error(`Failed to merge to main: ${error.message}`);
    }
  }

  /**
   * Sync user's branch with main (pull approved changes)
   * @param {string} userBranch - User's branch name
   */
  async syncWithMain(userBranch) {
    try {
      const userWorktree = await this.getWorktreePath(userBranch);
      if (!userWorktree) {
        throw new Error(`User worktree not found: ${userBranch}`);
      }

      // Merge main into user's branch
      await this.execGitInPath('merge main -m "Sync with main"', userWorktree);

      console.log(`Synced ${userBranch} with main`);
      return true;
    } catch (error) {
      // If merge fails, abort
      try {
        const userWorktree = await this.getWorktreePath(userBranch);
        if (userWorktree) {
          await this.execGitInPath('merge --abort', userWorktree);
        }
      } catch {}

      throw new Error(`Failed to sync with main: ${error.message}`);
    }
  }

  /**
   * Get current branch name for a worktree
   * @param {string} worktreePath
   * @returns {Promise<string>}
   */
  async getCurrentBranch(worktreePath = null) {
    try {
      const targetPath = worktreePath || this.repoPath;
      const { stdout } = await this.execGitInPath('branch --show-current', targetPath);
      return stdout.trim();
    } catch (error) {
      throw new Error(`Failed to get current branch: ${error.message}`);
    }
  }

  /**
   * Get diff between two branches
   * @param {string} baseBranch - Base branch
   * @param {string} compareBranch - Branch to compare
   * @returns {Promise<string>} - Diff output
   */
  async getDiff(baseBranch, compareBranch) {
    try {
      const { stdout } = await this.execGit(`diff ${baseBranch}...${compareBranch}`);
      return stdout;
    } catch (error) {
      throw new Error(`Failed to get diff: ${error.message}`);
    }
  }

  /**
   * Get list of changed files between branches
   * @param {string} baseBranch - Base branch
   * @param {string} compareBranch - Branch to compare
   * @returns {Promise<string[]>} - List of file paths
   */
  async getChangedFiles(baseBranch, compareBranch) {
    try {
      const { stdout } = await this.execGit(`diff --name-only ${baseBranch}...${compareBranch}`);
      return stdout
        .split('\n')
        .filter(f => f.trim().length > 0);
    } catch (error) {
      throw new Error(`Failed to get changed files: ${error.message}`);
    }
  }

  /**
   * Check if git repo is initialized
   */
  async isGitRepo() {
    try {
      await this.execGit('rev-parse --git-dir');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize git repo if not already initialized
   */
  async initRepo() {
    try {
      const isRepo = await this.isGitRepo();
      if (!isRepo) {
        await this.execGit('init');
        await this.execGit('add .');
        await this.execGit('commit -m "Initial commit"');
        console.log('Initialized git repository');
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to initialize repo: ${error.message}`);
    }
  }

  /**
   * Check if a branch is behind main
   */
  async isBranchBehindMain(branchName) {
    try {
      const worktreePath = await this.getWorktreePath(branchName);
      if (!worktreePath) {
        throw new Error(`Worktree not found for branch: ${branchName}`);
      }

      // Check how many commits behind main (local branch comparison)
      const result = await this.execGitInPath(`rev-list --count ${branchName}..main`, worktreePath);
      const commitsBehind = parseInt(result.stdout.trim());

      return commitsBehind > 0;
    } catch (error) {
      console.error('Error checking branch status:', error);
      return false;
    }
  }

  /**
   * Sync a branch with main
   */
  async syncBranchWithMain(branchName, force = false, checkOnly = false) {
    try {
      const worktreePath = await this.getWorktreePath(branchName);
      if (!worktreePath) {
        throw new Error(`Worktree not found for branch: ${branchName}`);
      }

      if (force && !checkOnly) {
        // Force reset to main (lose all local changes)
        await this.execGitInPath('reset --hard main', worktreePath);
        return { success: true, conflicts: false };
      }

      // Try to merge main into the branch (or just check for conflicts)
      try {
        await this.execGitInPath('merge main --no-edit --no-commit', worktreePath);

        // If checkOnly, reset to clean state (merge --abort may fail if no conflicts)
        if (checkOnly) {
          try {
            await this.execGitInPath('merge --abort', worktreePath);
          } catch {
            // If abort fails, reset the index instead
            await this.execGitInPath('reset --merge', worktreePath);
          }
        }

        return { success: true, conflicts: false };
      } catch (mergeError) {
        // Merge failed - check for conflicts
        try {
          const statusResult = await this.execGitInPath('status --short', worktreePath);
          const conflicts = statusResult.stdout.split('\n').filter(line => line.startsWith('UU') || line.startsWith('AA'));

          // Abort the merge
          await this.execGitInPath('merge --abort', worktreePath);

          // Get a summary of what will be lost
          const diffResult = await this.execGitInPath('diff main...HEAD --stat', worktreePath);
          const conflictsSummary = `Files with conflicts:\n${conflicts.map(c => c.substring(3)).join('\n')}\n\nChanges that will be lost:\n${diffResult.stdout}`;

          return {
            success: false,
            conflicts: true,
            conflictsSummary
          };
        } catch (statusError) {
          // Abort merge and return error
          try {
            await this.execGitInPath('merge --abort', worktreePath);
          } catch (e) {
            // Ignore abort errors
          }
          throw mergeError;
        }
      }
    } catch (error) {
      throw new Error(`Failed to sync branch: ${error.message}`);
    }
  }

  /**
   * Execute a git command in the main repo
   * @private
   */
  async execGit(command) {
    return await execAsync(`git ${command}`, {
      cwd: this.repoPath,
      timeout: 30000,
    });
  }

  /**
   * Execute a git command in a specific path (worktree)
   * @private
   */
  async execGitInPath(command, targetPath) {
    return await execAsync(`git ${command}`, {
      cwd: targetPath,
      timeout: 30000,
    });
  }
}
