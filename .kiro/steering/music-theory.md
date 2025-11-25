# Music Theory Guidelines for GitSymphony

## Purpose
This steering document ensures that all musical mappings in GitSymphony follow music theory principles to create pleasant, harmonious output.

## Scale Guidelines

### Pentatonic Scale (Default)
- Use for general commit playback
- Notes: C, D, E, G, A (no semitones)
- Always sounds consonant, no dissonance
- Safe for random-seeming patterns

### Major Scale
- Use for positive events (features, additions)
- Notes: C, D, E, F, G, A, B
- Bright, happy sound

### Minor Scale
- Use for deletions, bug fixes
- Notes: C, D, Eb, F, G, Ab, Bb
- Darker, more serious sound

## Chord Construction

### Triads
- Major: Root + 4 semitones + 7 semitones (e.g., C-E-G)
- Minor: Root + 3 semitones + 7 semitones (e.g., C-Eb-G)
- Use for commits with >100 changes

### Seventh Chords
- Add richness for very large commits (>200 changes)
- Major 7th: Root + 4 + 7 + 11 semitones

## Instrument Selection

### Timbre Mapping
- **Synth (Sine wave)**: Clean, modern - for JS/TS files
- **Piano (Sampled)**: Classic, versatile - for Python/Java
- **Bass (Sawtooth)**: Deep, powerful - for systems languages (Go/Rust)
- **Pluck**: Bright, percussive - for markup/styling (HTML/CSS)

### Envelope Guidelines
- **Attack**: 0.05-0.1s (quick onset)
- **Decay**: 0.1-0.3s (natural fall)
- **Sustain**: 0.3-0.5 (body of note)
- **Release**: 0.8-1.5s (natural tail)

## Rhythm and Timing

### Note Duration
- Minimum: 0.2s (avoid too-fast notes)
- Maximum: 1.5s (avoid dragging)
- Formula: `duration = clamp(totalChanges / 50, 0.2, 1.5)`

### Gaps Between Notes
- Standard: 0.15s between commits
- Allows notes to breathe
- Prevents audio overlap

## Octave Ranges

### Safe Ranges
- Low: C2-C3 (bass, deletions)
- Mid: C3-C5 (main melody)
- High: C5-C6 (highlights, large additions)

### Avoid
- Below C2 (muddy on most speakers)
- Above C7 (piercing, uncomfortable)

## Implementation Rules

1. **Always use scales** - Never use chromatic (all 12 notes) for random data
2. **Limit octave jumps** - Max 2 octaves between consecutive notes
3. **Use velocity** - Map commit importance to note velocity (0.5-1.0)
4. **Consider context** - Branch merges should sound different from regular commits
5. **Test on speakers** - Not just headphones

## Code Examples

```javascript
// Good: Using pentatonic scale
const scale = [0, 2, 4, 7, 9]; // Pentatonic
const noteIndex = (value % scale.length);

// Bad: Using all chromatic notes
const noteIndex = (value % 12); // Can sound dissonant

// Good: Clamping duration
const duration = Math.min(Math.max(changes / 50, 0.2), 1.5);

// Bad: Unbounded duration
const duration = changes / 50; // Could be 0 or 10 seconds
```

## Future Enhancements

- Tempo mapping based on commit frequency
- Key changes for different branches
- Polyrhythms for parallel development
- Generative AI to smooth melodies
