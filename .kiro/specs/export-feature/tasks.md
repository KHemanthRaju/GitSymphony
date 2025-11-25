# Export Feature Implementation Tasks

## Phase 1: UI Components

### Task 1.1: Create Export Button
- [ ] Add export button to controls section
- [ ] Style button to match existing UI
- [ ] Add disabled state logic
- [ ] Add tooltip
- **Estimated:** 30 minutes

### Task 1.2: Create Export Modal
- [ ] Create modal HTML structure
- [ ] Add CSS styling with backdrop
- [ ] Implement open/close functionality
- [ ] Add format radio buttons
- [ ] Add options panel
- **Estimated:** 1 hour

### Task 1.3: Add Progress Bar
- [ ] Create progress bar component
- [ ] Add percentage display
- [ ] Add cancel button
- [ ] Implement progress updates
- **Estimated:** 45 minutes

## Phase 2: MIDI Export

### Task 2.1: Setup MIDI Library
- [ ] Install @tonejs/midi package
- [ ] Create exportMIDI.js module
- [ ] Setup basic MIDI file structure
- **Estimated:** 30 minutes

### Task 2.2: Implement MIDI Conversion
- [ ] Convert commits to MIDI notes
- [ ] Map instruments to MIDI channels
- [ ] Set tempo and time signature
- [ ] Add track names
- **Estimated:** 2 hours

### Task 2.3: Implement MIDI Download
- [ ] Create blob from MIDI data
- [ ] Trigger file download
- [ ] Add filename with repo name
- [ ] Test in different browsers
- **Estimated:** 1 hour

## Phase 3: MP3 Export

### Task 3.1: Setup Audio Recording
- [ ] Install lamejs package
- [ ] Create MediaRecorder setup
- [ ] Connect instruments to destination
- **Estimated:** 1 hour

### Task 3.2: Implement Silent Playback
- [ ] Create export mode for playSymphony
- [ ] Disable UI updates during export
- [ ] Capture audio stream
- **Estimated:** 1.5 hours

### Task 3.3: Implement MP3 Encoding
- [ ] Encode audio chunks to MP3
- [ ] Handle encoding progress
- [ ] Create final MP3 blob
- [ ] Trigger download
- **Estimated:** 2 hours

## Phase 4: Video Export

### Task 4.1: Setup Canvas Recording
- [ ] Capture Three.js canvas stream
- [ ] Set frame rate (30 FPS)
- [ ] Test canvas capture quality
- **Estimated:** 1 hour

### Task 4.2: Combine Audio and Video
- [ ] Combine canvas and audio streams
- [ ] Setup MediaRecorder for video
- [ ] Configure video bitrate
- **Estimated:** 1.5 hours

### Task 4.3: Implement Video Export
- [ ] Record synchronized playback
- [ ] Handle video encoding
- [ ] Create video blob
- [ ] Trigger download
- **Estimated:** 2 hours

### Task 4.4: Add Commit Overlays
- [ ] Draw commit info on canvas
- [ ] Sync overlays with playback
- [ ] Style overlay text
- **Estimated:** 1.5 hours

## Phase 5: Error Handling & Polish

### Task 5.1: Add Error Handling
- [ ] Detect browser compatibility
- [ ] Handle export failures
- [ ] Add retry logic
- [ ] Show helpful error messages
- **Estimated:** 1 hour

### Task 5.2: Add Loading States
- [ ] Show spinner during export
- [ ] Disable buttons during export
- [ ] Add cancel functionality
- **Estimated:** 45 minutes

### Task 5.3: Testing
- [ ] Test all export formats
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test with small and large repos
- [ ] Verify file quality
- **Estimated:** 2 hours

### Task 5.4: Documentation
- [ ] Update README with export instructions
- [ ] Add export examples
- [ ] Document browser requirements
- **Estimated:** 30 minutes

## Total Estimated Time: ~20 hours

## Dependencies
- @tonejs/midi: MIDI file creation
- lamejs: MP3 encoding
- MediaRecorder API: Audio/video recording

## Risks
- Browser compatibility issues with MediaRecorder
- Performance issues with large repositories
- Memory constraints during video encoding
- Audio quality degradation during encoding

## Success Criteria
- All three export formats work
- Export completes in reasonable time
- Files are valid and playable
- UI provides clear feedback
- Error handling is robust
