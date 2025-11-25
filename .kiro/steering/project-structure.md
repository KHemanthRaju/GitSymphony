# GitSymphony Project Structure

## Purpose
Maintain consistent project organization and coding standards.

## Directory Structure

```
gitsymphony/
├── .kiro/                  # Kiro configuration
│   ├── hooks/             # Agent hooks
│   ├── steering/          # Steering documents
│   └── specs/             # Feature specs
├── public/                # Static assets
├── src/                   # Source code (future refactor)
├── index.html             # Main HTML entry
├── main.js                # Frontend logic
├── visualization.js       # Three.js 3D visualization
├── server.js              # Backend API
├── package.json           # Dependencies
└── README.md              # Documentation
```

## Code Organization

### Frontend (main.js)
- State management at top
- DOM element references
- Configuration objects (scales, instruments)
- Tone.js initialization
- Event handlers
- Helper functions
- Initialization code at bottom

### Backend (server.js)
- Imports
- Configuration constants
- Express middleware
- API routes
- Helper functions
- Server startup

### Visualization (visualization.js)
- Three.js imports
- Module-level variables
- Exported functions (init, create, highlight, clear)
- Internal helper functions
- Animation loop

## Naming Conventions

### Variables
- camelCase for variables and functions
- UPPER_SNAKE_CASE for constants
- Descriptive names (no single letters except loops)

### Functions
- Verbs for actions: `createCommitNode()`, `playSymph()`, `highlightCommit()`
- Nouns for getters: `commitToNote()`, `getColorForCommit()`
- Boolean functions start with `is/has/should`: `isPlaying`, `hasCommits()`

### Files
- kebab-case for file names: `music-theory.md`
- camelCase for JS files: `visualization.js`

## Dependencies

### Production
- `tone`: Web Audio API wrapper (music generation)
- `three`: 3D graphics library
- `simple-git`: Git repository parsing
- `express`: Backend API framework
- `cors`: Cross-origin resource sharing
- `class-variance-authority`: Component variants
- `clsx`: Conditional classes
- `tailwind-merge`: Merge Tailwind classes

### Development
- `vite`: Build tool and dev server
- `concurrently`: Run multiple npm scripts
- `tailwindcss`: Utility-first CSS framework
- `postcss`: CSS processing
- `autoprefixer`: CSS vendor prefixes

## API Design

### Endpoints
- `POST /api/analyze` - Analyze git repository
- `GET /api/health` - Health check

### Request/Response Format
```javascript
// Request
{
  "repoPath": "/path/to/repo"
}

// Response
{
  "repoPath": "/resolved/path",
  "commitCount": 42,
  "commits": [
    {
      "hash": "abc1234",
      "author": "Alice",
      "message": "Add feature",
      "date": "2024-11-24T12:00:00Z",
      "additions": 50,
      "deletions": 10,
      "files": [...]
    }
  ]
}
```

## Error Handling

### Frontend
- Try-catch for API calls
- Fallback to mock data on error
- User-friendly error messages
- Console logging for debugging

### Backend
- Validate all inputs
- Return appropriate HTTP status codes
- Include error details in response
- Log errors to console

## Performance Guidelines

### Frontend
- Debounce user inputs
- Limit DOM updates
- Use requestAnimationFrame for animations
- Lazy load Three.js scenes

### Backend
- Cache git analysis results
- Limit commit count (max 500)
- Timeout long-running git commands
- Use streaming for large responses

## Testing Strategy

### Manual Testing
1. Test with current repository
2. Test with empty repository
3. Test with invalid path
4. Test with very large repository
5. Test audio on different browsers

### Future Automated Testing
- Unit tests for mapping functions
- Integration tests for API
- E2E tests for full workflow

## Build and Deployment

### Development
```bash
npm run dev:all  # Run both frontend and backend
```

### Production Build
```bash
npm run build    # Build frontend
node server.js   # Run backend
```

### Environment Variables (Future)
- `PORT`: Backend port (default: 3001)
- `MAX_COMMITS`: Maximum commits to analyze (default: 100)
- `CACHE_TTL`: Cache time-to-live in seconds (default: 300)

## Code Style

### JavaScript
- Use ES6+ features (const/let, arrow functions, async/await)
- Semicolons required
- Single quotes for strings
- 2-space indentation
- Max line length: 100 characters

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow shadcn/ui design patterns
- Use CSS variables for theming (HSL format)
- Custom animations in styles.css
- Responsive design with Tailwind breakpoints

### Comments
- JSDoc for functions
- Inline comments for complex logic
- TODO comments for future work
- No commented-out code in commits

## Git Workflow

### Commit Messages
- Present tense: "Add feature" not "Added feature"
- Imperative mood: "Fix bug" not "Fixes bug"
- First line <50 chars
- Detailed description after blank line

### Branches (Future)
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes
