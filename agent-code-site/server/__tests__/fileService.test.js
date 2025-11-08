import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { FileService } from '../src/services/fileService.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('FileService', () => {
  let fileService;
  let testDir;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(__dirname, 'temp-test-files');
    await fs.mkdir(testDir, { recursive: true });
    fileService = new FileService(testDir);
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('readFile', () => {
    it('should read file contents successfully', async () => {
      const content = 'Hello, world!';
      const filePath = 'test.txt';
      await fs.writeFile(path.join(testDir, filePath), content);

      const result = await fileService.readFile(filePath);

      expect(result).toBe(content);
    });

    it('should throw error when file does not exist', async () => {
      await expect(fileService.readFile('nonexistent.txt'))
        .rejects
        .toThrow();
    });

    it('should read empty file', async () => {
      const filePath = 'empty.txt';
      await fs.writeFile(path.join(testDir, filePath), '');

      const result = await fileService.readFile(filePath);

      expect(result).toBe('');
    });

    it('should read file with special characters', async () => {
      const content = '特殊文字 émojis 🎉 <html>&nbsp;</html>';
      const filePath = 'special.txt';
      await fs.writeFile(path.join(testDir, filePath), content);

      const result = await fileService.readFile(filePath);

      expect(result).toBe(content);
    });
  });

  describe('writeFile', () => {
    it('should write file successfully', async () => {
      const content = 'New content';
      const filePath = 'new.txt';

      const result = await fileService.writeFile(filePath, content);

      expect(result.success).toBe(true);
      const written = await fs.readFile(path.join(testDir, filePath), 'utf-8');
      expect(written).toBe(content);
    });

    it('should create nested directories automatically', async () => {
      const content = 'Nested content';
      const filePath = 'dir1/dir2/nested.txt';

      const result = await fileService.writeFile(filePath, content);

      expect(result.success).toBe(true);
      const written = await fs.readFile(path.join(testDir, filePath), 'utf-8');
      expect(written).toBe(content);
    });

    it('should overwrite existing file', async () => {
      const filePath = 'overwrite.txt';
      await fs.writeFile(path.join(testDir, filePath), 'Old content');

      const result = await fileService.writeFile(filePath, 'New content');

      expect(result.success).toBe(true);
      const written = await fs.readFile(path.join(testDir, filePath), 'utf-8');
      expect(written).toBe('New content');
    });

    it('should write empty file', async () => {
      const result = await fileService.writeFile('empty.txt', '');

      expect(result.success).toBe(true);
      const written = await fs.readFile(path.join(testDir, 'empty.txt'), 'utf-8');
      expect(written).toBe('');
    });
  });

  describe('editFile', () => {
    it('should replace string successfully', async () => {
      const filePath = 'edit.txt';
      const original = 'background: red;';
      await fs.writeFile(path.join(testDir, filePath), original);

      const result = await fileService.editFile(filePath, 'red', 'blue');

      expect(result.success).toBe(true);
      const edited = await fs.readFile(path.join(testDir, filePath), 'utf-8');
      expect(edited).toBe('background: blue;');
    });

    it('should throw error when old string not found', async () => {
      const filePath = 'edit.txt';
      await fs.writeFile(path.join(testDir, filePath), 'content');

      await expect(fileService.editFile(filePath, 'notfound', 'replacement'))
        .rejects
        .toThrow(/not found/);
    });

    it('should throw error when file does not exist', async () => {
      await expect(fileService.editFile('nonexistent.txt', 'old', 'new'))
        .rejects
        .toThrow();
    });

    it('should replace only first occurrence by default', async () => {
      const filePath = 'multiple.txt';
      await fs.writeFile(path.join(testDir, filePath), 'foo foo foo');

      const result = await fileService.editFile(filePath, 'foo', 'bar');

      expect(result.success).toBe(true);
      const edited = await fs.readFile(path.join(testDir, filePath), 'utf-8');
      expect(edited).toBe('bar foo foo');
    });

    it('should handle multiline replacement', async () => {
      const filePath = 'multiline.txt';
      const original = 'line1\nline2\nline3';
      await fs.writeFile(path.join(testDir, filePath), original);

      const result = await fileService.editFile(filePath, 'line2', 'newline');

      expect(result.success).toBe(true);
      const edited = await fs.readFile(path.join(testDir, filePath), 'utf-8');
      expect(edited).toBe('line1\nnewline\nline3');
    });
  });

  describe('getFileTree', () => {
    it('should return empty array for empty directory', async () => {
      const tree = await fileService.getFileTree();

      expect(tree).toEqual([]);
    });

    it('should return file tree structure', async () => {
      // Create test structure
      await fs.writeFile(path.join(testDir, 'file1.txt'), 'content');
      await fs.mkdir(path.join(testDir, 'subdir'), { recursive: true });
      await fs.writeFile(path.join(testDir, 'subdir', 'file2.txt'), 'content');

      const tree = await fileService.getFileTree();

      expect(tree).toHaveLength(2);
      expect(tree.some(item => item.name === 'file1.txt' && item.type === 'file')).toBe(true);
      expect(tree.some(item => item.name === 'subdir' && item.type === 'directory')).toBe(true);
    });

    it('should return nested children', async () => {
      await fs.mkdir(path.join(testDir, 'dir'), { recursive: true });
      await fs.writeFile(path.join(testDir, 'dir', 'nested.txt'), 'content');

      const tree = await fileService.getFileTree();
      const dirItem = tree.find(item => item.name === 'dir');

      expect(dirItem.children).toHaveLength(1);
      expect(dirItem.children[0].name).toBe('nested.txt');
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      await fs.writeFile(path.join(testDir, 'exists.txt'), 'content');

      const exists = await fileService.fileExists('exists.txt');

      expect(exists).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const exists = await fileService.fileExists('notexists.txt');

      expect(exists).toBe(false);
    });

    it('should return true for directories', async () => {
      await fs.mkdir(path.join(testDir, 'dir'), { recursive: true });

      const exists = await fileService.fileExists('dir');

      expect(exists).toBe(true);
    });
  });

  describe('glob', () => {
    it('should find files by pattern', async () => {
      await fs.writeFile(path.join(testDir, 'test1.js'), '');
      await fs.writeFile(path.join(testDir, 'test2.js'), '');
      await fs.writeFile(path.join(testDir, 'test.css'), '');

      const result = await fileService.glob('*.js');

      expect(result.files.length).toBe(2);
      expect(result.files).toContain('test1.js');
      expect(result.files).toContain('test2.js');
    });

    it('should find nested files', async () => {
      await fs.mkdir(path.join(testDir, 'src'), { recursive: true });
      await fs.writeFile(path.join(testDir, 'src', 'app.js'), '');

      const result = await fileService.glob('**/*.js');

      expect(result.files).toContain('src/app.js');
    });

    it('should return empty array when no matches', async () => {
      const result = await fileService.glob('*.nonexistent');

      expect(result.files).toEqual([]);
    });
  });

  describe('grep', () => {
    it('should find text in files', async () => {
      await fs.writeFile(path.join(testDir, 'test.txt'), 'Hello world\nFoo bar\nHello again');

      const result = await fileService.grep('Hello');

      expect(result.matches).toContain('Hello world');
      expect(result.matches).toContain('Hello again');
    });

    it('should return empty string when no matches', async () => {
      await fs.writeFile(path.join(testDir, 'test.txt'), 'content');

      const result = await fileService.grep('notfound');

      expect(result.matches.trim()).toBe('');
    });

    it('should search in subdirectories', async () => {
      await fs.mkdir(path.join(testDir, 'subdir'), { recursive: true });
      await fs.writeFile(path.join(testDir, 'subdir', 'nested.txt'), 'FOUND');

      const result = await fileService.grep('FOUND', 'subdir');

      expect(result.matches).toContain('FOUND');
    });
  });

  describe('watchFiles', () => {
    it('should detect file changes', async () => {
      return new Promise(async (resolve) => {
        const filePath = 'watched.txt';
        await fs.writeFile(path.join(testDir, filePath), 'original');

        let changeDetected = false;
        fileService.watchFiles((eventType, changedPath) => {
          if (changedPath.includes('watched.txt')) {
            changeDetected = true;
            fileService.stopWatching();
            expect(changeDetected).toBe(true);
            resolve();
          }
        });

        // Give watcher time to initialize
        setTimeout(async () => {
          await fs.writeFile(path.join(testDir, filePath), 'modified');
        }, 100);
      });
    }, 5000); // 5 second timeout

    it('should stop watching when requested', async () => {
      fileService.watchFiles(() => {});
      fileService.stopWatching();

      expect(fileService.watcher).toBe(null);
    });
  });
});
