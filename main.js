import * as Tone from 'tone';
import { initVisualization, createCommitNode, highlightCommit, clearVisualization } from './visualization.js';

// State
let commits = [];
let isPlaying = false;
let currentCommitIndex = 0;

// DOM elements
const analyzeBtn = document.getElementById('analyzeBtn');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const repoPathInput = document.getElementById('repoPath');
const statusDiv = document.getElementById('status');
const commitListDiv = document.getElementById('commitList');
const commitCountDiv = document.getElementById('commitCount');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const resetCamera = document.getElementById('resetCamera');

// Music mapping configuration
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9]
};

const BASE_NOTE = 'C3';

// Initialize multiple instruments
const instruments = {
  synth: new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
  }).toDestination(),
  
  piano: new Tone.Sampler({
    urls: {
      C4: "C4.mp3",
    },
    baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination(),
  
  bass: new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 }
  }).toDestination(),
  
  pluck: new Tone.PluckSynth().toDestination()
};

// File extension to instrument mapping
const fileTypeToInstrument = {
  '.js': 'synth',
  '.ts': 'synth',
  '.jsx': 'synth',
  '.tsx': 'synth',
  '.py': 'piano',
  '.java': 'piano',
  '.go': 'bass',
  '.rs': 'bass',
  '.css': 'pluck',
  '.html': 'pluck',
  '.md': 'pluck',
  'default': 'synth'
};

// Mock git data for MVP (since we can't run git commands in browser)
function generateMockCommits() {
  const authors = ['Alice', 'Bob', 'Charlie', 'Diana'];
  const messages = [
    'Add new feature',
    'Fix bug in parser',
    'Update documentation',
    'Refactor code structure',
    'Improve performance',
    'Add tests',
    'Fix typo',
    'Merge branch'
  ];
  
  const mockCommits = [];
  const now = Date.now();
  
  for (let i = 0; i < 20; i++) {
    mockCommits.push({
      hash: Math.random().toString(36).substring(2, 9),
      author: authors[Math.floor(Math.random() * authors.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      date: new Date(now - i * 86400000 * Math.random() * 10),
      additions: Math.floor(Math.random() * 100) + 1,
      deletions: Math.floor(Math.random() * 50)
    });
  }
  
  return mockCommits.reverse(); // Oldest first
}

// Map commit data to musical note
function commitToNote(commit, index) {
  // Use additions to determine pitch (more additions = higher pitch)
  const scale = SCALES.pentatonic;
  const totalChanges = commit.additions + commit.deletions;
  
  // Better octave calculation
  const octave = Math.min(Math.floor(commit.additions / 20) + 3, 6);
  const scaleIndex = (commit.additions + index) % scale.length;
  const noteOffset = scale[scaleIndex];
  
  // Convert to note name
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const baseNoteIndex = 0; // C
  const finalNoteIndex = (baseNoteIndex + noteOffset) % 12;
  const note = notes[finalNoteIndex] + octave;
  
  // Duration based on changes (more changes = longer note)
  const duration = Math.min(Math.max(totalChanges / 50, 0.3), 1.2);
  
  // Determine instrument based on file types
  let instrument = 'synth';
  if (commit.files && commit.files.length > 0) {
    const mainFile = commit.files[0].file;
    const ext = mainFile.substring(mainFile.lastIndexOf('.'));
    instrument = fileTypeToInstrument[ext] || fileTypeToInstrument['default'];
  }
  
  // If it's a big commit (merge?), play a chord
  const isChord = totalChanges > 100;
  const chord = isChord ? [note, notes[(finalNoteIndex + 4) % 12] + octave, notes[(finalNoteIndex + 7) % 12] + octave] : null;
  
  return { note, duration, instrument, chord, totalChanges };
}

// Display commits in UI
function displayCommits() {
  // Update commit count
  if (commitCountDiv) {
    commitCountDiv.textContent = `${commits.length} commits`;
  }
  
  commitListDiv.innerHTML = commits.map((commit, index) => {
    // Ensure date is a Date object
    const commitDate = commit.date instanceof Date ? commit.date : new Date(commit.date);
    const dateStr = commitDate.toLocaleDateString();
    
    return `
      <div class="commit-item p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer" data-index="${index}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-mono text-xs rounded">${commit.hash}</span>
              <span class="text-gray-300 text-sm">${commit.author}</span>
            </div>
            <div class="text-white text-sm">${commit.message}</div>
            <div class="flex items-center gap-3 text-xs text-gray-400">
              <span>${dateStr}</span>
              <span class="text-green-400">+${commit.additions}</span>
              <span class="text-red-400">-${commit.deletions}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Initialize 3D visualization
  clearVisualization();
  commits.forEach((commit, index) => {
    createCommitNode(commit, index, commits.length);
  });
}

// Show status message
function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.className = `p-4 rounded-lg text-center text-sm ${
    isError 
      ? 'bg-red-500/10 border border-red-500/30 text-red-300' 
      : 'bg-green-500/10 border border-green-500/30 text-green-300'
  }`;
  statusDiv.classList.remove('hidden');
}

// Hide status message
function hideStatus() {
  statusDiv.classList.add('hidden');
}

// Analyze repository
analyzeBtn.addEventListener('click', async () => {
  const repoPath = repoPathInput.value.trim() || '.';
  showStatus('🔍 Analyzing repository...');
  
  try {
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ repoPath })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze repository');
    }
    
    const data = await response.json();
    commits = data.commits;
    
    if (commits.length === 0) {
      showStatus('⚠️ No commits found in repository.', true);
      return;
    }
    
    displayCommits();
    showStatus(`✅ Found ${commits.length} commits! Ready to play.`);
    playBtn.disabled = false;
    
  } catch (error) {
    console.error('Error:', error);
    showStatus(`❌ Error: ${error.message}. Using mock data instead...`, true);
    
    // Fallback to mock data
    commits = generateMockCommits();
    displayCommits();
    playBtn.disabled = false;
  }
});

// Play symphony
playBtn.addEventListener('click', async () => {
  try {
    // Start Tone.js audio context (required by browser)
    await Tone.start();
    console.log('Tone.js started, context state:', Tone.context.state);
    
    isPlaying = true;
    currentCommitIndex = 0;
    playBtn.disabled = true;
    stopBtn.disabled = false;
    analyzeBtn.disabled = true;
    
    showStatus('🎵 Playing your git symphony...');
    
    playSymphony();
  } catch (error) {
    console.error('Error starting playback:', error);
    showStatus('❌ Error starting playback: ' + error.message, true);
  }
});

// Stop playback
stopBtn.addEventListener('click', () => {
  isPlaying = false;
  stopBtn.disabled = true;
  playBtn.disabled = false;
  analyzeBtn.disabled = false;
  
  // Remove all playing highlights
  document.querySelectorAll('.commit-item.playing').forEach(el => {
    el.classList.remove('playing');
  });
  
  showStatus('⏹️ Playback stopped.');
});

// Play through commits sequentially
async function playSymphony() {
  if (!isPlaying || currentCommitIndex >= commits.length) {
    isPlaying = false;
    stopBtn.disabled = true;
    playBtn.disabled = false;
    analyzeBtn.disabled = false;
    showStatus('✅ Symphony complete!');
    return;
  }
  
  const commit = commits[currentCommitIndex];
  console.log('Playing commit', currentCommitIndex, commit);
  
  const { note, duration, instrument, chord, totalChanges } = commitToNote(commit, currentCommitIndex);
  console.log('Note:', note, 'Duration:', duration, 'Instrument:', instrument);
  
  // Highlight current commit
  document.querySelectorAll('.commit-item').forEach((el, idx) => {
    if (idx === currentCommitIndex) {
      el.classList.add('playing', '!bg-purple-500/30', '!border-purple-500', 'ring-2', 'ring-purple-500');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      el.classList.remove('playing', '!bg-purple-500/30', '!border-purple-500', 'ring-2', 'ring-purple-500');
    }
  });
  
  // Highlight in 3D visualization
  highlightCommit(currentCommitIndex);
  
  // Play note or chord
  try {
    const selectedInstrument = instruments[instrument];
    if (!selectedInstrument) {
      console.error('Instrument not found:', instrument);
      return;
    }
    
    if (chord) {
      // Play chord for big commits
      selectedInstrument.triggerAttackRelease(chord, duration);
    } else {
      selectedInstrument.triggerAttackRelease(note, duration);
    }
  } catch (error) {
    console.error('Error playing note:', error);
  }
  
  // Add visual feedback based on changes
  if (totalChanges > 100) {
    document.body.style.background = 'linear-gradient(135deg, #2a1a3e 0%, #26314e 100%)';
    setTimeout(() => {
      document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }, duration * 1000);
  }
  
  // Wait for note duration + small gap
  const waitTime = (duration + 0.15) * 1000;
  currentCommitIndex++;
  
  setTimeout(() => playSymphony(), waitTime);
}

// Initial state
hideStatus();

// Theme toggle
let isDarkTheme = true;

themeToggle.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;
  
  if (isDarkTheme) {
    document.documentElement.classList.add('dark');
    document.body.style.background = 'linear-gradient(to bottom right, rgb(15 23 42), rgb(88 28 135), rgb(15 23 42))';
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.body.style.background = 'linear-gradient(to bottom right, rgb(241 245 249), rgb(216 180 254), rgb(241 245 249))';
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light';
  }
});

// Reset camera button
resetCamera.addEventListener('click', () => {
  if (window.resetCameraView) {
    window.resetCameraView();
  }
});

// Initialize 3D visualization on load
window.addEventListener('DOMContentLoaded', () => {
  initVisualization('visualizationCanvas');
});
