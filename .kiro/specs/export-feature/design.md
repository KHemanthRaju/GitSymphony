# Export Feature Design

## Architecture

### Component Structure
```
ExportModal
├── FormatSelector (MIDI/MP3/Video)
├── OptionsPanel (quality, resolution, etc.)
├── ProgressBar
└── DownloadButton
```

### Data Flow
1. User clicks "Export" button
2. Modal opens with format options
3. User selects format and options
4. Export process begins (async)
5. Progress updates in real-time
6. File downloads automatically on completion

## Technical Design

### MIDI Export

**Library:** Tone.js Transport + MIDI.js

**Process:**
1. Create MIDI file structure
2. Add tracks for each instrument
3. Iterate through commits
4. Convert each commit to MIDI note events
5. Set tempo and time signature
6. Export as .mid file

**Code Structure:**
```javascript
async function exportMIDI(commits) {
  const midi = new MidiWriter.Track();
  midi.setTempo(120);
  
  commits.forEach(commit => {
    const { note, duration, instrument } = commitToNote(commit);
    midi.addNote({
      pitch: note,
      duration: duration,
      channel: instrumentToChannel[instrument]
    });
  });
  
  return midi.toBytes();
}
```

### MP3 Export

**Library:** MediaRecorder API + lamejs (MP3 encoder)

**Process:**
1. Create audio context
2. Play symphony silently (capture mode)
3. Record audio stream with MediaRecorder
4. Encode to MP3 using lamejs
5. Create blob and download

**Code Structure:**
```javascript
async function exportMP3(commits) {
  const dest = Tone.context.createMediaStreamDestination();
  // Connect all instruments to destination
  
  const recorder = new MediaRecorder(dest.stream);
  const chunks = [];
  
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.start();
  
  await playSymphonyForExport(commits);
  
  recorder.stop();
  return new Blob(chunks, { type: 'audio/mp3' });
}
```

### Video Export

**Library:** MediaRecorder + Canvas Capture

**Process:**
1. Capture Three.js canvas as video stream
2. Capture audio stream
3. Combine streams with MediaRecorder
4. Play symphony with visualization
5. Stop recording and download

**Code Structure:**
```javascript
async function exportVideo(commits) {
  const canvas = renderer.domElement;
  const videoStream = canvas.captureStream(30); // 30 FPS
  const audioStream = Tone.context.createMediaStreamDestination().stream;
  
  const combined = new MediaStream([
    ...videoStream.getTracks(),
    ...audioStream.getTracks()
  ]);
  
  const recorder = new MediaRecorder(combined, {
    mimeType: 'video/webm',
    videoBitsPerSecond: 5000000
  });
  
  // Record and export
}
```

## UI Design

### Export Button
- Location: Next to Play/Stop buttons
- Icon: 💾 or download icon
- Disabled until repository is analyzed
- Tooltip: "Export symphony"

### Export Modal
```
┌─────────────────────────────────────┐
│  Export Your Git Symphony           │
├─────────────────────────────────────┤
│                                     │
│  Format:                            │
│  ○ MIDI (.mid)                      │
│  ○ MP3 (.mp3)                       │
│  ○ Video (.mp4)                     │
│                                     │
│  Options:                           │
│  Quality: [High ▼]                  │
│  Include metadata: [✓]              │
│                                     │
│  [████████░░] 80% Exporting...      │
│                                     │
│  [Cancel]              [Export]     │
└─────────────────────────────────────┘
```

## Error Handling

### Common Errors
1. **Browser not supported**: Show message with supported browsers
2. **Export failed**: Retry button with error details
3. **Out of memory**: Suggest reducing commit count
4. **Timeout**: Show progress and allow cancellation

### Error Messages
- "Your browser doesn't support audio export. Try Chrome or Firefox."
- "Export failed. Please try again or reduce the number of commits."
- "Export is taking longer than expected. Continue waiting?"

## Performance Optimization

### Strategies
1. **Web Workers**: Offload encoding to worker thread
2. **Chunked Processing**: Process commits in batches
3. **Progress Streaming**: Update UI every 100ms
4. **Memory Management**: Clear buffers after each chunk

### Benchmarks
- 100 commits → ~30 seconds (MIDI)
- 100 commits → ~60 seconds (MP3)
- 100 commits → ~120 seconds (Video)

## Testing Strategy

### Unit Tests
- Test MIDI note conversion
- Test audio encoding
- Test file download trigger

### Integration Tests
- Test full export flow
- Test progress updates
- Test error handling

### Manual Tests
- Export from small repo (10 commits)
- Export from large repo (500 commits)
- Test on different browsers
- Verify file playback in external apps

## Future Enhancements

- Custom video templates
- Adjustable tempo/pitch
- Multiple export formats simultaneously
- Cloud storage integration
- Social media direct sharing
