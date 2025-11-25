import * as THREE from 'three';

let scene, camera, renderer, particles = [];
let animationId = null;

export function initVisualization(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 50;
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  // Add point light
  const pointLight = new THREE.PointLight(0xff6b6b, 1, 100);
  pointLight.position.set(0, 0, 30);
  scene.add(pointLight);
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  animate();
}

function onWindowResize() {
  const container = document.getElementById('visualizationCanvas');
  if (!container) return;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

export function createCommitNode(commit, index, total) {
  // Create sphere for commit
  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshPhongMaterial({
    color: getColorForCommit(commit),
    emissive: getColorForCommit(commit),
    emissiveIntensity: 0.3
  });
  
  const sphere = new THREE.Mesh(geometry, material);
  
  // Position in a spiral
  const angle = (index / total) * Math.PI * 4;
  const radius = 20 + (index / total) * 10;
  sphere.position.x = Math.cos(angle) * radius;
  sphere.position.y = (index / total) * 40 - 20;
  sphere.position.z = Math.sin(angle) * radius;
  
  sphere.userData = { commit, index };
  
  scene.add(sphere);
  particles.push(sphere);
  
  return sphere;
}

function getColorForCommit(commit) {
  const totalChanges = commit.additions + commit.deletions;
  
  if (totalChanges > 100) return 0xff6b6b; // Red for big commits
  if (totalChanges > 50) return 0xffa500; // Orange for medium
  if (commit.additions > commit.deletions) return 0x4ecdc4; // Cyan for additions
  return 0x95e1d3; // Light cyan for small changes
}

export function highlightCommit(index) {
  particles.forEach((particle, i) => {
    if (i === index) {
      particle.scale.set(2, 2, 2);
      particle.material.emissiveIntensity = 1;
      
      // Create pulse effect
      const pulseGeometry = new THREE.SphereGeometry(1, 16, 16);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.5
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.position.copy(particle.position);
      scene.add(pulse);
      
      // Animate pulse
      let scale = 1;
      const pulseInterval = setInterval(() => {
        scale += 0.2;
        pulse.scale.set(scale, scale, scale);
        pulse.material.opacity -= 0.05;
        
        if (pulse.material.opacity <= 0) {
          scene.remove(pulse);
          clearInterval(pulseInterval);
        }
      }, 50);
      
    } else {
      particle.scale.set(1, 1, 1);
      particle.material.emissiveIntensity = 0.3;
    }
  });
}

export function clearVisualization() {
  particles.forEach(particle => scene.remove(particle));
  particles = [];
}

function animate() {
  animationId = requestAnimationFrame(animate);
  
  // Rotate camera slowly
  camera.position.x = Math.sin(Date.now() * 0.0001) * 50;
  camera.position.z = Math.cos(Date.now() * 0.0001) * 50;
  camera.lookAt(0, 0, 0);
  
  // Rotate particles slightly
  particles.forEach(particle => {
    particle.rotation.y += 0.01;
  });
  
  renderer.render(scene, camera);
}

export function stopVisualization() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
