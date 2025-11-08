import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export class GitService {
  constructor(repoPath) {
    this.repoPath = repoPath;
  }

  /**
   * Create a new feature branch for a user request
   * @param {string} username - User's name
   * @param {string} featureSlug - URL-friendly feature description
   * @returns {Promise<string>} - Branch name
   */
  async createFeatureBranch(username, featureSlug, sessionId = null) {
    const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const sanitizedFeature = featureSlug.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Add timestamp or session ID to make branch name unique
    const uniqueId = sessionId ? sessionId.slice(0, 8) : Date.now().toString().slice(-8);
    const branchName = `user-${sanitizedUsername}-${sanitizedFeature}-${uniqueId}`;

    try {
      // Ensure we're on main branch
      await this.execGit('checkout main');

      // Pull latest changes only if origin exists
      try {
        await this.execGit('remote get-url origin');
        await this.execGit('pull origin main');
      } catch {
        // No origin configured, skip pull (local repo only)
        console.log('No remote origin configured, skipping pull');
      }

      // Create and checkout new branch
      await this.execGit(`checkout -b ${branchName}`);

      console.log(`Created feature branch: ${branchName}`);
      return branchName;
    } catch (error) {
      throw new Error(`Failed to create feature branch: ${error.message}`);
    }
  }

  /**
   * Commit changes to current branch
   * @param {string} message - Commit message
   * @param {string} username - User's name for commit attribution
   */
  async commitChanges(message, username) {
    try {
      // Stage all changes
      await this.execGit('add .');

      // Check if there are changes to commit
      const { stdout: status } = await this.execGit('status --porcelain');
      if (!status.trim()) {
        console.log('No changes to commit');
        return null;
      }

      // Commit with message
      const commitMessage = `${message}\n\nRequested-by: ${username}`;
      await this.execGit(`commit -m "${commitMessage.replace(/"/g, '\\"')}"`);

      console.log(`Committed changes: ${message}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to commit changes: ${error.message}`);
    }
  }

  /**
   * Merge a feature branch into main
   * @param {string} branchName - Branch to merge
   * @param {string} approvedBy - Admin who approved
   */
  async mergeBranch(branchName, approvedBy) {
    try {
      // Checkout main
      await this.execGit('checkout main');

      // Pull latest only if origin exists
      try {
        await this.execGit('remote get-url origin');
        await this.execGit('pull origin main');
      } catch {
        // No origin configured, skip pull
        console.log('No remote origin configured, skipping pull');
      }

      // Merge feature branch
      await this.execGit(`merge ${branchName} --no-ff -m "Merge ${branchName} (approved by ${approvedBy})"`);

      console.log(`Merged branch ${branchName} into main`);
      return true;
    } catch (error) {
      // If merge fails, abort and return to main
      try {
        await this.execGit('merge --abort');
      } catch {}

      throw new Error(`Failed to merge branch: ${error.message}`);
    }
  }

  /**
   * Delete a feature branch
   * @param {string} branchName - Branch to delete
   */
  async deleteBranch(branchName) {
    try {
      // Ensure we're not on the branch we're deleting
      const { stdout: currentBranch } = await this.execGit('branch --show-current');
      if (currentBranch.trim() === branchName) {
        await this.execGit('checkout main');
      }

      // Delete branch
      await this.execGit(`branch -D ${branchName}`);

      console.log(`Deleted branch: ${branchName}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete branch: ${error.message}`);
    }
  }

  /**
   * Checkout a specific branch
   * @param {string} branchName - Branch to checkout
   */
  async checkoutBranch(branchName) {
    try {
      await this.execGit(`checkout ${branchName}`);
      console.log(`Checked out branch: ${branchName}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to checkout branch: ${error.message}`);
    }
  }

  /**
   * Get current branch name
   * @returns {Promise<string>}
   */
  async getCurrentBranch() {
    try {
      const { stdout } = await this.execGit('branch --show-current');
      return stdout.trim();
    } catch (error) {
      throw new Error(`Failed to get current branch: ${error.message}`);
    }
  }

  /**
   * Get list of all feature branches
   * @returns {Promise<string[]>}
   */
  async getFeatureBranches() {
    try {
      const { stdout } = await this.execGit('branch --list "user-*"');
      return stdout
        .split('\n')
        .map(b => b.trim().replace('* ', ''))
        .filter(b => b.length > 0);
    } catch (error) {
      throw new Error(`Failed to get feature branches: ${error.message}`);
    }
  }

  /**
   * Get diff between main and a branch
   * @param {string} branchName - Branch to compare
   * @returns {Promise<string>} - Diff output
   */
  async getDiff(branchName) {
    try {
      const { stdout } = await this.execGit(`diff main...${branchName}`);
      return stdout;
    } catch (error) {
      throw new Error(`Failed to get diff: ${error.message}`);
    }
  }

  /**
   * Get list of changed files in a branch
   * @param {string} branchName - Branch to check
   * @returns {Promise<string[]>} - List of file paths
   */
  async getChangedFiles(branchName) {
    try {
      const { stdout } = await this.execGit(`diff --name-only main...${branchName}`);
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
   * Execute a git command
   * @private
   */
  async execGit(command) {
    return await execAsync(`git ${command}`, {
      cwd: this.repoPath,
      timeout: 30000,
    });
  }
}
