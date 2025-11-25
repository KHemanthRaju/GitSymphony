# Git Analysis Guidelines for GitSymphony

## Purpose
Guidelines for parsing and analyzing git repositories to extract meaningful musical data.

## Git Commands

### Commit Log
```bash
git log --stat --pretty=format:'%H|%an|%ae|%ad|%s' --date=iso
```

### Diff Statistics
```bash
git diff --stat <commit>^ <commit>
```

### File Changes
```bash
git show --stat <commit>
```

## Data Extraction

### Required Fields
- **Hash**: Unique commit identifier (use first 7 chars for display)
- **Author**: Commit author name
- **Date**: ISO format timestamp
- **Message**: First line only (for UI display)
- **Additions**: Lines added (green in git diff)
- **Deletions**: Lines removed (red in git diff)
- **Files**: Array of changed files with individual stats

### Optional Fields
- **Branch**: Current branch name
- **Tags**: Associated tags
- **Parents**: Parent commit hashes (for merge detection)
- **Email**: Author email (for avatar generation)

## Performance Considerations

### Commit Limits
- Default: 100 commits (good balance)
- Minimum: 10 commits (too few for interesting music)
- Maximum: 500 commits (performance limit)

### Caching Strategy
- Cache parsed repo data for 5 minutes
- Invalidate on new commits (watch .git/refs/heads)
- Store in memory (not disk for MVP)

## Error Handling

### Common Errors
1. **Not a git repository**: Check `.git` directory exists
2. **Empty repository**: No commits yet
3. **Permission denied**: Can't read .git directory
4. **Corrupted repository**: Git commands fail

### Fallback Strategy
- Always provide mock data as fallback
- Show clear error messages to user
- Log errors to console for debugging

## File Type Detection

### Extension Mapping
```javascript
const fileTypes = {
  code: ['.js', '.ts', '.py', '.java', '.go', '.rs', '.c', '.cpp'],
  markup: ['.html', '.xml', '.jsx', '.tsx'],
  style: ['.css', '.scss', '.sass', '.less'],
  config: ['.json', '.yaml', '.yml', '.toml', '.ini'],
  docs: ['.md', '.txt', '.rst'],
  data: ['.sql', '.csv', '.json']
};
```

### Instrument Assignment
- Code files → Synth/Piano (melodic)
- Markup → Pluck (percussive)
- Style → Pluck (bright)
- Config → Bass (foundational)
- Docs → Soft synth (background)

## Merge Detection

### Identifying Merges
- Check if commit has multiple parents
- Look for "Merge" in commit message
- Large number of files changed (>20)

### Musical Representation
- Play chord instead of single note
- Use all instruments simultaneously
- Longer duration (1.5-2s)
- Visual: Larger sphere, different color

## Branch Analysis (Future)

### Multi-branch Support
- Parse all branches, not just current
- Create separate "tracks" for each branch
- Merge points create harmonic convergence
- Visualize as branching tree in 3D

## Security Considerations

### Path Validation
- Sanitize user-provided paths
- Prevent directory traversal (../)
- Whitelist allowed directories
- Never execute user-provided git commands directly

### Resource Limits
- Timeout git commands after 30s
- Limit memory usage for large repos
- Rate limit API requests (10 per minute)

## Testing Repositories

### Good Test Cases
1. **Small repo** (10-20 commits): Quick testing
2. **Medium repo** (100 commits): Typical use case
3. **Large repo** (500+ commits): Performance testing
4. **Merge-heavy repo**: Branch visualization
5. **Monorepo**: Multiple file types

### Edge Cases
- Single commit repository
- Repository with no file changes (empty commits)
- Binary files (images, PDFs)
- Very large commits (>1000 files)
