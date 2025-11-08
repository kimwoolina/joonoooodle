import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { glob } from 'glob';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class FileService {
  constructor(basePath) {
    this.basePath = basePath;
    this.watcher = null;
  }

  /**
   * Read a file's contents
   */
  async readFile(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Write content to a file (creates directories if needed)
   */
  async writeFile(filePath, content) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(fullPath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Edit a file by replacing old_string with new_string
   */
  async editFile(filePath, oldString, newString) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      let content = await fs.readFile(fullPath, 'utf-8');

      if (!content.includes(oldString)) {
        throw new Error(`String not found in file: ${oldString}`);
      }

      content = content.replace(oldString, newString);
      await fs.writeFile(fullPath, content, 'utf-8');

      return { success: true };
    } catch (error) {
      throw new Error(`Failed to edit file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get file tree structure
   */
  async getFileTree(dir = '') {
    const fullPath = path.join(this.basePath, dir);
    const result = [];

    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip node_modules and hidden files
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }

        const relativePath = path.join(dir, entry.name);
        const item = {
          name: entry.name,
          path: relativePath,
          type: entry.isDirectory() ? 'directory' : 'file',
        };

        if (entry.isDirectory()) {
          item.children = await this.getFileTree(relativePath);
        }

        result.push(item);
      }

      return result;
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  }

  /**
   * Watch files for changes
   */
  watchFiles(callback) {
    if (this.watcher) {
      this.watcher.close();
    }

    this.watcher = chokidar.watch(this.basePath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
    });

    this.watcher
      .on('add', (filePath) => callback('add', path.relative(this.basePath, filePath)))
      .on('change', (filePath) => callback('change', path.relative(this.basePath, filePath)))
      .on('unlink', (filePath) => callback('unlink', path.relative(this.basePath, filePath)));
  }

  /**
   * Stop watching files
   */
  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  /**
   * Find files matching glob pattern
   */
  async glob(pattern) {
    try {
      const files = await glob(pattern, { cwd: this.basePath });
      return { files };
    } catch (error) {
      throw new Error(`Glob failed: ${error.message}`);
    }
  }

  /**
   * Search for text in files using grep
   */
  async grep(pattern, searchPath = '.') {
    try {
      const { stdout } = await execAsync(
        `grep -r "${pattern}" ${searchPath} || true`,
        { cwd: this.basePath }
      );
      return { matches: stdout };
    } catch (error) {
      // grep returns non-zero if no matches, which is ok
      return { matches: '' };
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
