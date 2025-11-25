import * as THREE from 'three';

let scene, camera, renderer, particles = [];
let animationId = null;
let stars = [];
let connections = [];
let mouse = { x: 0, y: 0 };
let isMouseDown = false;
let autoRotate = true;
let cameraAngle = 0;
let cameraHeight = 20;

export function initVisualization(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Visualization container not found:', containerId);
    return;
  }
  
  console.log('Initializing 3D visualization...');
  
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 50, 200);
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(40, 30, 40);
  camera.lookAt(0, 0, 0);
  
  // Renderer with better quality
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: false,
    powerPreference: 'high-performance'
  });
  
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Clear any existing canvas
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  container.appendChild(renderer.domElement);
  console.log('Renderer initialized:', width, 'x', height);
  
  // Enhanced lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0xff6b6b, 1, 100);
  pointLight1.position.set(30, 30, 30);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0x4ecdc4, 0.8, 100);
  pointLight2.position.set(-30, -30, 30);
  scene.add(pointLight2);
  
  // Add starfield background
  createStarfield();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Add mouse controls
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('wheel', onMouseWheel);
  renderer.domElement.addEventListener('dblclick', onDoubleClick);
  
  // Touch controls for mobile
  renderer.domElement.addEventListener('touchstart', onTouchStart);
  renderer.domElement.addEventListener('touchmove', onTouchMove);
  renderer.domElement.addEventListener('touchend', onTouchEnd);
  
  animate();
}

function onMouseDown(event) {
  isMouseDown = true;
  autoRotate = false;
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

function onMouseUp() {
  isMouseDown = false;
}

function onMouseMove(event) {
  if (!isMouseDown) return;
  
  const deltaX = event.clientX - mouse.x;
  const deltaY = event.clientY - mouse.y;
  
  cameraAngle += deltaX * 0.01;
  cameraHeight = Math.max(-30, Math.min(50, cameraHeight - deltaY * 0.1));
  
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

function onMouseWheel(event) {
  event.preventDefault();
  const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
  const newRadius = Math.max(20, Math.min(100, radius + event.deltaY * 0.1));
  
  const angle = Math.atan2(camera.position.z, camera.position.x);
  camera.position.x = Math.cos(angle) * newRadius;
  camera.position.z = Math.sin(angle) * newRadius;
}

function onDoubleClick() {
  autoRotate = !autoRotate;
}

function onTouchStart(event) {
  if (event.touches.length === 1) {
    isMouseDown = true;
    autoRotate = false;
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
  }
}

function onTouchMove(event) {
  if (event.touches.length === 1 && isMouseDown) {
    const deltaX = event.touches[0].clientX - mouse.x;
    const deltaY = event.touches[0].clientY - mouse.y;
    
    cameraAngle += deltaX * 0.01;
    cameraHeight = Math.max(-30, Math.min(50, cameraHeight - deltaY * 0.1));
    
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
  }
}

function onTouchEnd() {
  isMouseDown = false;
}

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8
  });
  
  const starVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starVertices.push(x, y, z);
  }
  
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
  stars.push(starField);
}

function onWindowResize() {
  const container = document.getElementById('visualizationCanvas');
  if (!container || !renderer || !camera) return;
  
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 400;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

export function createCommitNode(commit, index, total) {
  const totalChanges = commit.additions + commit.deletions;
  
  // Dynamic size based on commit size
  const baseSize = 0.8;
  const size = baseSize + Math.min(totalChanges / 80, 2);
  
  // Create planet with textured material
  const geometry = new THREE.SphereGeometry(size, 64, 64);
  const color = getColorForCommit(commit);
  
  // Create planet texture using canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Convert color to hex string properly
  const colorHex = '#' + color.toString(16).padStart(6, '0');
  const threeColor = new THREE.Color(color);
  
  // Create gradient for planet surface
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, colorHex);
  gradient.addColorStop(0.5, `rgb(${threeColor.r * 180}, ${threeColor.g * 180}, ${threeColor.b * 180})`);
  gradient.addColorStop(1, `rgb(${threeColor.r * 100}, ${threeColor.g * 100}, ${threeColor.b * 100})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  // Add surface details (craters/continents)
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 30 + 10;
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    color: color,
    emissive: color,
    emissiveIntensity: 0.3,
    shininess: 80,
    bumpScale: 0.05
  });
  
  const planet = new THREE.Mesh(geometry, material);
  
  // Orbital positioning
  const angle = (index / total) * Math.PI * 6;
  const orbitRadius = 15 + (index / total) * 15;
  const height = (index / total) * 50 - 25;
  
  planet.position.x = Math.cos(angle) * orbitRadius;
  planet.position.y = height;
  planet.position.z = Math.sin(angle) * orbitRadius;
  
  // Add atmosphere glow
  const glowGeometry = new THREE.SphereGeometry(size * 1.15, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(color) }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(glowColor, 1.0) * intensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  const atmosphere = new THREE.Mesh(glowGeometry, glowMaterial);
  atmosphere.position.copy(planet.position);
  scene.add(atmosphere);
  
  // Add rings for large commits
  if (totalChanges > 100) {
    const ringGeometry = new THREE.RingGeometry(size * 1.5, size * 2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2 + Math.random() * 0.5;
    planet.add(ring);
    planet.userData.ring = ring;
  }
  
  // Create orbital path
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitPoints = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    orbitPoints.push(
      Math.cos(a) * orbitRadius,
      height,
      Math.sin(a) * orbitRadius
    );
  }
  orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0x4ecdc4,
    transparent: true,
    opacity: 0.15
  });
  const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbit);
  connections.push(orbit);
  
  planet.userData = { 
    commit, 
    index, 
    atmosphere,
    orbitRadius,
    orbitAngle: angle,
    rotationSpeed: 0.01 + Math.random() * 0.02
  };
  
  scene.add(planet);
  particles.push(planet);
  
  return planet;
}

function getColorForCommit(commit) {
  const totalChanges = commit.additions + commit.deletions;
  
  if (totalChanges > 100) return 0xff6b6b; // Red for big commits
  if (totalChanges > 50) return 0xffa500; // Orange for medium
  if (commit.additions > commit.deletions) return 0x4ecdc4; // Cyan for additions
  return 0x95e1d3; // Light cyan for small changes
}

export function highlightCommit(index) {
  if (!particles || particles.length === 0) {
    console.warn('No particles to highlight');
    return;
  }
  
  if (index < 0 || index >= particles.length) {
    console.warn('Invalid index:', index);
    return;
  }
  
  particles.forEach((planet, i) => {
    if (i === index) {
      // Scale up and brighten
      planet.scale.set(2, 2, 2);
      planet.material.emissiveIntensity = 0.8;
      
      // Atmosphere glow effect
      if (planet.userData.atmosphere) {
        planet.userData.atmosphere.scale.set(2, 2, 2);
      }
      
      // Create expanding ring effect
      const ringGeometry = new THREE.RingGeometry(1, 1.5, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(particle.position);
      ring.lookAt(camera.position);
      scene.add(ring);
      
      // Animate ring
      let scale = 1;
      const ringInterval = setInterval(() => {
        scale += 0.3;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity -= 0.08;
        
        if (ring.material.opacity <= 0) {
          scene.remove(ring);
          clearInterval(ringInterval);
        }
      }, 50);
      
      // Create particle burst
      createParticleBurst(particle.position);
      
    } else {
      planet.scale.set(1, 1, 1);
      planet.material.emissiveIntensity = 0.3;
      if (planet.userData.atmosphere) {
        planet.userData.atmosphere.scale.set(1, 1, 1);
      }
    }
  });
}

function createParticleBurst(position) {
  const particleCount = 20;
  const burstParticles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0xff6b6b : 0x4ecdc4,
      transparent: true,
      opacity: 1
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.position.copy(position);
    
    // Random velocity
    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    );
    
    scene.add(particle);
    burstParticles.push(particle);
  }
  
  // Animate burst
  let frame = 0;
  const burstInterval = setInterval(() => {
    frame++;
    burstParticles.forEach(p => {
      p.position.add(p.userData.velocity);
      p.material.opacity -= 0.05;
    });
    
    if (frame > 20) {
      burstParticles.forEach(p => scene.remove(p));
      clearInterval(burstInterval);
    }
  }, 50);
}

export function clearVisualization() {
  particles.forEach(planet => {
    scene.remove(planet);
    if (planet.userData.atmosphere) {
      scene.remove(planet.userData.atmosphere);
    }
  });
  particles = [];
  
  connections.forEach(line => scene.remove(line));
  connections = [];
}

function animate() {
  animationId = requestAnimationFrame(animate);
  
  const time = Date.now() * 0.0001;
  
  // Camera control
  if (autoRotate) {
    cameraAngle = time * 0.5;
    cameraHeight = Math.sin(time * 0.3) * 20 + 20;
  }
  
  const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2) || 50;
  camera.position.x = Math.sin(cameraAngle) * radius;
  camera.position.z = Math.cos(cameraAngle) * radius;
  camera.position.y = cameraHeight;
  camera.lookAt(0, 0, 0);
  
  // Rotate planets and update positions
  particles.forEach((planet, index) => {
    // Planet rotation on its axis
    planet.rotation.y += planet.userData.rotationSpeed || 0.01;
    
    // Subtle orbital movement
    if (planet.userData.orbitRadius) {
      planet.userData.orbitAngle += 0.001;
      const newX = Math.cos(planet.userData.orbitAngle) * planet.userData.orbitRadius;
      const newZ = Math.sin(planet.userData.orbitAngle) * planet.userData.orbitRadius;
      planet.position.x = newX;
      planet.position.z = newZ;
    }
    
    // Update atmosphere position
    if (planet.userData.atmosphere) {
      planet.userData.atmosphere.position.copy(planet.position);
      planet.userData.atmosphere.rotation.y -= 0.005;
    }
    
    // Rotate rings
    if (planet.userData.ring) {
      planet.userData.ring.rotation.z += 0.005;
    }
  });
  
  // Rotate starfield slowly
  stars.forEach(star => {
    star.rotation.y += 0.0001;
  });
  
  renderer.render(scene, camera);
}

export function stopVisualization() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function resetCameraView() {
  autoRotate = true;
  cameraAngle = 0;
  cameraHeight = 20;
  
  const radius = 50;
  camera.position.x = Math.sin(cameraAngle) * radius;
  camera.position.z = Math.cos(cameraAngle) * radius;
  camera.position.y = cameraHeight;
  camera.lookAt(0, 0, 0);
}

// Expose reset function globally
if (typeof window !== 'undefined') {
  window.resetCameraView = resetCameraView;
}
