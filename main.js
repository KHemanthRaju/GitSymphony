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
    commitCountDiv.textContent = `${commits.length} commit${commits.length !== 1 ? 's' : ''}`;
  }
  
  commitListDiv.innerHTML = commits.map((commit, index) => {
    const totalChanges = commit.additions + commit.deletions;
    const sizeLabel = totalChanges > 100 ? 'Large' : totalChanges > 50 ? 'Medium' : 'Small';
    const sizeColor = totalChanges > 100 ? 'text-red-400' : totalChanges > 50 ? 'text-orange-400' : 'text-cyan-400';
    
    return `
      <div class="commit-item group relative p-5 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/60 hover:to-muted/30 border-l-4 border-accent/30 hover:border-accent rounded-xl transition-all cursor-pointer hover:shadow-lg" data-index="${index}">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="px-2 py-1 bg-red-500/20 text-red-400 font-mono text-xs rounded-md">${commit.hash}</span>
              <span class="flex items-center gap-1 text-accent text-sm font-medium">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                ${commit.author}
              </span>
              <span class="px-2 py-0.5 ${sizeColor} bg-current/10 text-xs font-semibold rounded-full">${sizeLabel}</span>
            </div>
            <div class="text-foreground font-medium">${commit.message}</div>
            <div class="flex items-center gap-4 text-xs">
              <span class="flex items-center gap-1 text-muted-foreground">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                ${commit.date.toLocaleDateString()}
              </span>
              <span class="flex items-center gap-1 text-green-400 font-semibold">
                +${commit.additions}
              </span>
              <span class="flex items-center gap-1 text-red-400 font-semibold">
                -${commit.deletions}
              </span>
            </div>
          </div>
          <div class="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
            🎵
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
  statusDiv.className = `mt-4 p-4 rounded-lg text-center font-medium ${
    isError 
      ? 'bg-destructive/10 border border-destructive/30 text-destructive' 
      : 'bg-accent/10 border border-accent/30 text-accent'
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
  // Start Tone.js audio context (required by browser)
  await Tone.start();
  
  isPlaying = true;
  currentCommitIndex = 0;
  playBtn.disabled = true;
  stopBtn.disabled = false;
  analyzeBtn.disabled = true;
  
  showStatus('🎵 Playing your git symphony...');
  
  playSymphony();
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
  const { note, duration, instrument, chord, totalChanges } = commitToNote(commit, currentCommitIndex);
  
  // Highlight current commit
  document.querySelectorAll('.commit-item').forEach((el, idx) => {
    if (idx === currentCommitIndex) {
      el.classList.add('playing', 'scale-105', '!border-l-8', '!border-accent', 'shadow-2xl', 'shadow-accent/50', '!bg-accent/20');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      el.classList.remove('playing', 'scale-105', '!border-l-8', '!border-accent', 'shadow-2xl', 'shadow-accent/50', '!bg-accent/20');
    }
  });
  
  // Highlight in 3D visualization
  highlightCommit(currentCommitIndex);
  
  // Play note or chord
  const selectedInstrument = instruments[instrument];
  if (chord) {
    // Play chord for big commits
    selectedInstrument.triggerAttackRelease(chord, duration);
  } else {
    selectedInstrument.triggerAttackRelease(note, duration);
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

// Initialize 3D visualization on load
window.addEventListener('DOMContentLoaded', () => {
  initVisualization('visualizationCanvas');
});
