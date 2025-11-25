import express from 'express';
import simpleGit from 'simple-git';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Analyze a git repository
app.post('/api/analyze', async (req, res) => {
  try {
    let { repoPath } = req.body;
    
    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    let resolvedPath;
    let isTemporary = false;
    
    // Check if it's a GitHub URL
    if (repoPath.startsWith('http://') || repoPath.startsWith('https://') || repoPath.includes('github.com')) {
      // Clone to temporary directory
      const tempDir = path.join('/tmp', `gitsymphony-${Date.now()}`);
      console.log(`Cloning ${repoPath} to ${tempDir}...`);
      
      try {
        await simpleGit().clone(repoPath, tempDir, ['--depth', '100']);
        resolvedPath = tempDir;
        isTemporary = true;
      } catch (cloneError) {
        console.error('Clone error:', cloneError);
        return res.status(400).json({ 
          error: 'Failed to clone repository. Make sure the URL is correct and the repo is public.',
          details: cloneError.message 
        });
      }
    } else {
      // Resolve path (handle relative paths)
      resolvedPath = path.resolve(repoPath);
    }
    
    const git = simpleGit(resolvedPath);
    
    // Check if it's a valid git repo
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return res.status(400).json({ error: 'Not a valid git repository' });
    }

    // Get commit log with stats
    const log = await git.log({
      maxCount: 100, // Limit to last 100 commits for performance
      '--stat': null
    });

    // Get detailed stats for each commit
    const commits = await Promise.all(
      log.all.map(async (commit) => {
        try {
          // Get diff stats for this commit
          const diffSummary = await git.diffSummary([`${commit.hash}^`, commit.hash]);
          
          return {
            hash: commit.hash.substring(0, 7),
            author: commit.author_name,
            message: commit.message.split('\n')[0], // First line only
            date: new Date(commit.date),
            additions: diffSummary.insertions || 0,
            deletions: diffSummary.deletions || 0,
            files: diffSummary.files.map(f => ({
              file: f.file,
              additions: f.insertions,
              deletions: f.deletions
            }))
          };
        } catch (err) {
          // Handle first commit (no parent)
          return {
            hash: commit.hash.substring(0, 7),
            author: commit.author_name,
            message: commit.message.split('\n')[0],
            date: new Date(commit.date),
            additions: 0,
            deletions: 0,
            files: []
          };
        }
      })
    );

    const response = {
      repoPath: resolvedPath,
      commitCount: commits.length,
      commits: commits.reverse() // Oldest first
    };
    
    // Clean up temporary directory if it was cloned
    if (isTemporary) {
      setTimeout(() => {
        fs.rmSync(resolvedPath, { recursive: true, force: true });
        console.log(`Cleaned up temporary directory: ${resolvedPath}`);
      }, 5000); // Clean up after 5 seconds
    }
    
    res.json(response);

  } catch (error) {
    console.error('Error analyzing repository:', error);
    res.status(500).json({ 
      error: 'Failed to analyze repository',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🎵 GitSymphony API running on http://localhost:${PORT}`);
});
