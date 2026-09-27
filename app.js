// Sikadev's 3D Birthday Universe - Core Engine
// Three.js 3D Graphics + Web Audio API Mic Blow Detection + Confetti + WhatsApp Wish Engine

// ==========================================
// 1. STATE & STORAGE
// ==========================================
const SIKADEV_CONFIG = {
  name: "Sikadev",
  defaultPhone: "", // Leave blank or fill with your country code + phone (e.g. "1234567890")
};

const DEFAULT_WISHES = [
  {
    id: 1,
    name: "Maya & Team",
    message: "Happy Birthday Sikadev! Keep shining, innovating, and inspiring all of us! Big love! 💛",
    vibe: "👑 The GOAT",
    date: "Just now"
  },
  {
    id: 2,
    name: "Alex",
    message: "Wishing you unstoppable energy, clean code, and zero bugs this year! Let's celebrate! 🚀",
    vibe: "🚀 Big Moves",
    date: "Today"
  },
  {
    id: 3,
    name: "Chloe",
    message: "Cheers to another glorious trip around the sun! May this year bring everything you wished for! 🥂",
    vibe: "🥂 Cheers & Joy",
    date: "Today"
  }
];

let wishes = [];
try {
  const saved = localStorage.getItem("sikadev_bday_wishes");
  wishes = saved ? JSON.parse(saved) : DEFAULT_WISHES;
} catch (e) {
  wishes = DEFAULT_WISHES;
}

// ==========================================
// 2. THREE.JS 3D SCENE SETUP
// ==========================================
const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090a16, 0.025);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4.5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xc084fc, 1.2);
dirLight.position.set(5, 12, 7);
scene.add(dirLight);

const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
blueRimLight.position.set(-6, -2, -5);
scene.add(blueRimLight);

// Group to hold the rotating cake & constellation
const universeGroup = new THREE.Group();
scene.add(universeGroup);

// ------------------------------------------
// Procedural Starfield & Nebula Dust
// ------------------------------------------
const starCount = 1200;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);

const palette = [
  new THREE.Color(0xa855f7), // Purple
  new THREE.Color(0x38bdf8), // Cyan
  new THREE.Color(0xfbbf24), // Gold
  new THREE.Color(0xffffff)  // White
];

for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;
  const radius = 25 + Math.random() * 45;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  starPositions[i3 + 2] = radius * Math.cos(phi);

  const col = palette[Math.floor(Math.random() * palette.length)];
  starColors[i3] = col.r;
  starColors[i3 + 1] = col.g;
  starColors[i3 + 2] = col.b;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 0.18,
  vertexColors: true,
  transparent: true,
  opacity: 0.85
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ------------------------------------------
// 3D Birthday Cake Construction
// ------------------------------------------
const cakeGroup = new THREE.Group();
universeGroup.add(cakeGroup);

// Pedestal / Plate
const plateGeo = new THREE.CylinderGeometry(3.6, 3.4, 0.25, 48);
const plateMat = new THREE.MeshStandardMaterial({
  color: 0x1e1b4b,
  metalness: 0.8,
  roughness: 0.2,
  emissive: 0x312e81,
  emissiveIntensity: 0.2
});
const plate = new THREE.Mesh(plateGeo, plateMat);
plate.position.y = -1.2;
cakeGroup.add(plate);

// Glowing pedestal ring
const ringGeo = new THREE.TorusGeometry(3.65, 0.05, 16, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
const ringMesh = new THREE.Mesh(ringGeo, ringMat);
ringMesh.rotation.x = Math.PI / 2;
ringMesh.position.y = -1.1;
cakeGroup.add(ringMesh);

// Bottom Tier Cake
const bottomGeo = new THREE.CylinderGeometry(2.8, 2.9, 1.4, 48);
const bottomMat = new THREE.MeshStandardMaterial({
  color: 0x2e1065, // Deep cosmic violet
  roughness: 0.35,
  metalness: 0.15
});
const bottomTier = new THREE.Mesh(bottomGeo, bottomMat);
bottomTier.position.y = -0.4;
cakeGroup.add(bottomTier);

// Bottom Frosting Trim Beads
const beadCount = 32;
const beadGeo = new THREE.SphereGeometry(0.12, 12, 12);
const frostingMat = new THREE.MeshStandardMaterial({
  color: 0xf472b6, // Rosy pink frosting
  roughness: 0.2
});
for (let i = 0; i < beadCount; i++) {
  const angle = (i / beadCount) * Math.PI * 2;
  const bead = new THREE.Mesh(beadGeo, frostingMat);
  bead.position.set(Math.cos(angle) * 2.85, 0.3, Math.sin(angle) * 2.85);
  cakeGroup.add(bead);
}

// Top Tier Cake
const topGeo = new THREE.CylinderGeometry(1.9, 2.0, 1.2, 48);
const topMat = new THREE.MeshStandardMaterial({
  color: 0x4c1d95,
  roughness: 0.3,
  metalness: 0.15
});
const topTier = new THREE.Mesh(topGeo, topMat);
topTier.position.y = 0.9;
cakeGroup.add(topTier);

// Top Frosting Trim Beads
const topBeadCount = 22;
for (let i = 0; i < topBeadCount; i++) {
  const angle = (i / topBeadCount) * Math.PI * 2;
  const bead = new THREE.Mesh(beadGeo, frostingMat);
  bead.position.set(Math.cos(angle) * 1.95, 1.5, Math.sin(angle) * 1.95);
  cakeGroup.add(bead);
}

// ------------------------------------------
// Birthday Candles & Animated Flickering Flames
// ------------------------------------------
const candles = [];
const candleFlames = [];
const candleLights = [];
const smokePuffs = [];

const candlePositions = [
  { x: 0, z: 0 },         // Center main candle
  { x: 0.85, z: 0.5 },
  { x: -0.85, z: 0.5 },
  { x: 0, z: -0.9 },
  { x: -0.8, z: -0.6 },
  { x: 0.8, z: -0.6 }
];

const candleColors = [0xf59e0b, 0xec4899, 0x06b6d4, 0x84cc16, 0xa855f7, 0x3b82f6];

candlePositions.forEach((pos, idx) => {
  const candleHolder = new THREE.Group();
  candleHolder.position.set(pos.x, 1.5, pos.z);

  // Wax stick
  const waxGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
  const waxMat = new THREE.MeshStandardMaterial({
    color: candleColors[idx % candleColors.length],
    roughness: 0.25
  });
  const wax = new THREE.Mesh(waxGeo, waxMat);
  wax.position.y = 0.45;
  candleHolder.add(wax);

  // Wick
  const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
  const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const wick = new THREE.Mesh(wickGeo, wickMat);
  wick.position.y = 0.95;
  candleHolder.add(wick);

  // Flame Mesh
  const flameGeo = new THREE.ConeGeometry(0.12, 0.35, 12);
  flameGeo.translate(0, 0.175, 0);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.95
  });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.y = 1.0;
  candleHolder.add(flame);
  candleFlames.push(flame);

  // Inner flame core (white hot)
  const innerFlameGeo = new THREE.ConeGeometry(0.05, 0.2, 8);
  innerFlameGeo.translate(0, 0.1, 0);
  const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
  flame.add(innerFlame);

  // Point light for warmth
  const candleLight = new THREE.PointLight(0xffa200, 1.5, 4);
  candleLight.position.y = 1.2;
  candleHolder.add(candleLight);
  candleLights.push(candleLight);

  cakeGroup.add(candleHolder);
  candles.push(candleHolder);
});

// ------------------------------------------
// Floating Wish Constellation (Orbiting Orbs)
// ------------------------------------------
const wishOrbsGroup = new THREE.Group();
universeGroup.add(wishOrbsGroup);
const wishOrbMeshes = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createWishOrbs() {
  // Clear existing
  while (wishOrbsGroup.children.length > 0) {
    wishOrbsGroup.remove(wishOrbsGroup.children[0]);
  }
  wishOrbMeshes.length = 0;

  wishes.forEach((w, index) => {
    const angle = (index / Math.max(wishes.length, 1)) * Math.PI * 2;
    const distance = 4.2 + (index % 3) * 0.9;
    const height = 0.5 + Math.sin(index * 1.5) * 1.8;

    const orbGroup = new THREE.Group();
    orbGroup.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );

    // Glowing Wish Star Sphere
    const orbGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.userData = { wish: w, originalScale: 1 };
    orbGroup.add(orb);

    // Halo Glow Ring
    const haloGeo = new THREE.RingGeometry(0.35, 0.45, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    orbGroup.add(halo);

    wishOrbsGroup.add(orbGroup);
    wishOrbMeshes.push(orb);
  });

  // Update badge count
  const countBadge = document.getElementById("wish-count-badge");
  if (countBadge) countBadge.textContent = wishes.length;
}

createWishOrbs();

// ==========================================
// 3. INTERACTIVE 3D ORBIT / TOUCH DRAG
// ==========================================
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotationY = 0;
let targetRotationX = 0.15;
let rotationSpeed = 0.005;

window.addEventListener('mousedown', (e) => {
  if (e.target.closest('#wish-modal') || e.target.closest('#wishes-drawer') || e.target.closest('header') || e.target.closest('button')) return;
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('touchstart', (e) => {
  if (e.target.closest('#wish-modal') || e.target.closest('#wishes-drawer') || e.target.closest('header') || e.target.closest('button')) return;
  if (e.touches.length === 1) {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
}, { passive: true });

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;

  targetRotationY += deltaX * rotationSpeed;
  targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX + deltaY * rotationSpeed * 0.5));
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const deltaX = e.touches[0].clientX - previousMousePosition.x;
  const deltaY = e.touches[0].clientY - previousMousePosition.y;

  targetRotationY += deltaX * rotationSpeed;
  targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX + deltaY * rotationSpeed * 0.5));
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('touchend', () => isDragging = false);

// Click Raycasting on 3D Wish Stars
window.addEventListener('click', (e) => {
  if (isDragging) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(wishOrbMeshes);

  if (intersects.length > 0) {
    const clickedWish = intersects[0].object.userData.wish;
    if (clickedWish) {
      showStarInspect(clickedWish);
    }
  }
});

function showStarInspect(wish) {
  const card = document.getElementById("star-inspect-card");
  document.getElementById("inspect-sender").textContent = wish.name;
  document.getElementById("inspect-message").textContent = `"${wish.message}"`;
  document.getElementById("inspect-vibe").textContent = wish.vibe;
  card.classList.add("active");
  playBellTone(880);
}

document.getElementById("close-inspect-btn").addEventListener("click", () => {
  document.getElementById("star-inspect-card").classList.remove("active");
});

// Window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 4. WEB AUDIO SYNTHESIZER & SOUND EFFECTS
// ==========================================
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playBellTone(freq = 520, duration = 0.8) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn("Audio bell tone issue", err);
  }
}

function playBirthdayFanfare() {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  // Happy Birthday Chords (C, G, C, F, C, G, C)
  const notes = [
    { f: 261.63, d: 0.25 }, // C
    { f: 261.63, d: 0.25 }, // C
    { f: 293.66, d: 0.5 },  // D
    { f: 261.63, d: 0.5 },  // C
    { f: 349.23, d: 0.5 },  // F
    { f: 329.63, d: 0.9 },  // E
    { f: 261.63, d: 0.25 }, // C
    { f: 261.63, d: 0.25 }, // C
    { f: 293.66, d: 0.5 },  // D
    { f: 261.63, d: 0.5 },  // C
    { f: 392.00, d: 0.5 },  // G
    { f: 349.23, d: 0.9 },  // F
    // Big finish chords
    { f: 523.25, d: 1.2 }   // High C
  ];

  let time = audioCtx.currentTime + 0.1;
  notes.forEach((note) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note.f, time);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + note.d);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + note.d);

    time += note.d * 0.85;
  });
}

// Sound toggle button
const soundBtn = document.getElementById("sound-btn");
const soundState = document.getElementById("sound-state");
soundBtn.addEventListener("click", () => {
  initAudio();
  soundEnabled = !soundEnabled;
  soundState.textContent = soundEnabled ? "On" : "Off";
  soundBtn.classList.toggle("border-purple-400", soundEnabled);
  if (soundEnabled) playBellTone(660);
});

// ==========================================
// 5. THE "BLOW THE MIC" AUDIO ENGINE
// ==========================================
let micStream = null;
let analyser = null;
let micActive = false;
let candlesExtinguished = false;
let blowEnergyAccumulator = 0;

const micTriggerBtn = document.getElementById("mic-trigger-btn");
const micBtnText = document.getElementById("mic-btn-text");
const micBtnIcon = document.getElementById("mic-btn-icon");
const micMeterBar = document.getElementById("mic-meter-bar");
const windPercentage = document.getElementById("wind-percentage");
const statusText = document.getElementById("status-text");
const statusPill = document.getElementById("status-pill");
const relightBtn = document.getElementById("relight-btn");
const manualBlowBtn = document.getElementById("manual-blow-btn");

micTriggerBtn.addEventListener("click", async () => {
  initAudio();
  if (micActive) {
    stopMic();
    return;
  }
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.2;
    source.connect(analyser);

    micActive = true;
    micBtnText.textContent = "Mic Active (Blow Now!)";
    micBtnIcon.textContent = "💨";
    micTriggerBtn.classList.add("from-emerald-600", "to-teal-600");
    statusText.textContent = "Listening! Take a breath and blow into your mic! 🌬️";
    statusPill.classList.add("border-emerald-400/50");

    listenForBlow();
  } catch (err) {
    console.error("Mic error:", err);
    alert("Microphone permission was denied or not supported. You can still use 'Tap to Blow'!");
    stopMic();
  }
});

function stopMic() {
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
  micActive = false;
  micBtnText.textContent = "Enable Mic to Blow";
  micBtnIcon.textContent = "🎙️";
  micTriggerBtn.classList.remove("from-emerald-600", "to-teal-600");
  micMeterBar.style.width = "0%";
  windPercentage.textContent = "0%";
}

function listenForBlow() {
  if (!micActive || !analyser || candlesExtinguished) return;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  // Blowing on a mic generates strong low-to-mid frequency turbulence (bins 2 to 24)
  let lowMidEnergy = 0;
  for (let i = 2; i < 24; i++) {
    lowMidEnergy += dataArray[i];
  }
  const averageEnergy = lowMidEnergy / 22; // 0 to 255

  // Calculate wind intensity percentage
  const intensity = Math.min(100, Math.round((averageEnergy / 90) * 100));
  micMeterBar.style.width = `${intensity}%`;
  windPercentage.textContent = `${intensity}%`;

  // Candle flame flicker reaction to wind
  const flickerSpeed = 1 + (intensity / 30);
  candleFlames.forEach(f => {
    f.scale.x = 1 - (intensity / 180);
    f.scale.z = 1 - (intensity / 180);
  });

  // Threshold check: high turbulence sustained
  if (averageEnergy > 70) {
    blowEnergyAccumulator += 1;
    if (blowEnergyAccumulator > 8) { // Sustained puff
      extinguishCandles("mic");
      return;
    }
  } else {
    blowEnergyAccumulator = Math.max(0, blowEnergyAccumulator - 0.5);
  }

  requestAnimationFrame(listenForBlow);
}

// Manual Blow Fallback Button
manualBlowBtn.addEventListener("click", () => {
  initAudio();
  // Animate the bar quickly to simulate blow
  micMeterBar.style.width = "100%";
  windPercentage.textContent = "100%";
  setTimeout(() => extinguishCandles("manual"), 250);
});

// ------------------------------------------
// THE EXTINGUISH & CELEBRATION MOMENT
// ------------------------------------------
function extinguishCandles(triggerType = "manual") {
  if (candlesExtinguished) return;
  candlesExtinguished = true;

  // 1. Hide candle flames & dim lights
  candleFlames.forEach(flame => {
    flame.visible = false;
  });
  candleLights.forEach(light => {
    light.intensity = 0;
  });

  // 2. Spawn Rising 3D Smoke Particles
  spawnSmokeParticles();

  // 3. Status update
  statusText.textContent = "🎉 WISHES UNLOCKED! HAPPY BIRTHDAY SIKADEV! 🚀✨";
  statusPill.classList.remove("border-white/10");
  statusPill.classList.add("bg-gradient-to-r", "from-pink-600/30", "to-amber-500/30", "border-amber-400");

  // 4. Celebratory Fanfare Audio
  playBirthdayFanfare();

  // 5. Massive Confetti Fireworks Cascade!
  launchCelebrationConfetti();

  // 6. UI Toggle
  relightBtn.classList.remove("hidden");
  micTriggerBtn.classList.add("hidden");
  manualBlowBtn.classList.add("hidden");

  if (micActive) stopMic();
}

function spawnSmokeParticles() {
  const smokeCount = 45;
  const smokeGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const smokeMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.6
  });

  candlePositions.forEach(pos => {
    for (let i = 0; i < 6; i++) {
      const puff = new THREE.Mesh(smokeGeo, smokeMat.clone());
      puff.position.set(
        pos.x + (Math.random() - 0.5) * 0.15,
        2.5 + Math.random() * 0.2,
        pos.z + (Math.random() - 0.5) * 0.15
      );
      puff.userData = {
        vy: 0.03 + Math.random() * 0.04,
        vx: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.02
      };
      cakeGroup.add(puff);
      smokePuffs.push(puff);
    }
  });
}

function launchCelebrationConfetti() {
  // Fire multiple bursts of confetti from left, right, and center
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;

  const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Cannons from left and right edges
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);

  // Central Gold and Purple Star Burst
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8', '#ffffff']
  });
}

// Relight Candles
relightBtn.addEventListener("click", () => {
  candlesExtinguished = false;
  blowEnergyAccumulator = 0;

  candleFlames.forEach(flame => {
    flame.visible = true;
    flame.scale.set(1, 1, 1);
  });
  candleLights.forEach(light => {
    light.intensity = 1.5;
  });

  statusText.textContent = "Candles relit! Ready to blow again! 🎂";
  statusPill.className = "pointer-events-auto inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-xs sm:text-sm text-purple-200 font-medium mb-2 animate-bounce-slow";

  relightBtn.classList.add("hidden");
  micTriggerBtn.classList.remove("hidden");
  manualBlowBtn.classList.remove("hidden");
  micMeterBar.style.width = "0%";
  windPercentage.textContent = "0%";

  playBellTone(700);
});

// ==========================================
// 6. WISH SYSTEM & WHATSAPP GENERATION
// ==========================================
const wishModal = document.getElementById("wish-modal");
const openWishModalBtn = document.getElementById("open-wish-modal-btn");
const closeWishModalBtn = document.getElementById("close-wish-modal");
const wishForm = document.getElementById("wish-form");
const submitWhatsAppBtn = document.getElementById("submit-whatsapp-btn");
const quickShareBtn = document.getElementById("quick-share-btn");

let selectedVibe = "👑 The GOAT";

// Vibe Button Clicker
document.querySelectorAll(".vibe-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".vibe-btn").forEach(b => {
      b.classList.remove("active", "border-pink-500", "bg-pink-500/20");
      b.classList.add("border-white/10", "bg-white/5");
    });
    btn.classList.add("active", "border-pink-500", "bg-pink-500/20");
    btn.classList.remove("border-white/10", "bg-white/5");
    selectedVibe = btn.getAttribute("data-vibe");
    playBellTone(600);
  });
});

openWishModalBtn.addEventListener("click", () => {
  wishModal.classList.add("active");
  initAudio();
  playBellTone(500);
});

closeWishModalBtn.addEventListener("click", () => {
  wishModal.classList.remove("active");
});

// Format and construct WhatsApp Direct Deep Link
function buildWhatsAppWishUrl(name, message, vibe, targetPhone) {
  const formattedText = 
`🎂 *HAPPY BIRTHDAY SIKADEV!* 🎉✨

💌 *Birthday Wish from:* ${name}
"${message}"

🌟 *Vibe:* ${vibe}

🎈 *Sent via your 3D Birthday Universe!*
🚀 https://sikadev-birthday.web.app`;

  const cleanPhone = (targetPhone || SIKADEV_CONFIG.defaultPhone).replace(/[^0-9]/g, '');
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedText)}`;
  } else {
    // If no phone configured, opens WhatsApp recipient picker
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
  }
}

// Send Directly via WhatsApp
submitWhatsAppBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("sender-name");
  const msgInput = document.getElementById("sender-message");
  const phoneInput = document.getElementById("target-phone");

  const name = nameInput.value.trim() || "A Lovely Friend";
  const message = msgInput.value.trim() || "Happy Birthday Sikadev! Wishing you happiness, health, and greatness! 🚀";
  const phone = phoneInput ? phoneInput.value.trim() : "";

  // Also save to 3D sky!
  saveWishLocally(name, message, selectedVibe);

  // Open WhatsApp
  const url = buildWhatsAppWishUrl(name, message, selectedVibe, phone);
  window.open(url, "_blank");

  wishModal.classList.remove("active");
  confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
});

// Pin to 3D Sky Submit
wishForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("sender-name");
  const msgInput = document.getElementById("sender-message");

  const name = nameInput.value.trim();
  const message = msgInput.value.trim();

  saveWishLocally(name, message, selectedVibe);

  // Clear inputs & close
  nameInput.value = "";
  msgInput.value = "";
  wishModal.classList.remove("active");

  // Visual fanfare
  confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
  statusText.textContent = `🌟 ${name}'s wish pinned into Sikadev's 3D Sky!`;
  playBellTone(784);
});

function saveWishLocally(name, message, vibe) {
  const newWish = {
    id: Date.now(),
    name: name,
    message: message,
    vibe: vibe,
    date: "Just now"
  };
  wishes.unshift(newWish);
  try {
    localStorage.setItem("sikadev_bday_wishes", JSON.stringify(wishes));
  } catch (err) {}

  createWishOrbs();
  renderWishesDrawer();
}

// ------------------------------------------
// WISHES DRAWER (All Wishes List)
// ------------------------------------------
const wishesDrawer = document.getElementById("wishes-drawer");
const viewWishesBtn = document.getElementById("view-wishes-btn");
const closeWishesDrawerBtn = document.getElementById("close-wishes-drawer");
const wishesListContainer = document.getElementById("wishes-list-container");

viewWishesBtn.addEventListener("click", () => {
  renderWishesDrawer();
  wishesDrawer.classList.add("active");
  playBellTone(550);
});

closeWishesDrawerBtn.addEventListener("click", () => {
  wishesDrawer.classList.remove("active");
});

function renderWishesDrawer() {
  wishesListContainer.innerHTML = "";
  if (wishes.length === 0) {
    wishesListContainer.innerHTML = `<p class="text-sm text-gray-400">No wishes pinned yet. Be the first!</p>`;
    return;
  }

  wishes.forEach(w => {
    const card = document.createElement("div");
    card.className = "p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/40 transition-all";
    card.innerHTML = `
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="font-bold text-amber-300">${escapeHtml(w.name)}</span>
        <span class="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/20">${escapeHtml(w.vibe)}</span>
      </div>
      <p class="text-sm text-gray-200 leading-snug">"${escapeHtml(w.message)}"</p>
      <span class="block text-[10px] text-gray-400 mt-2">${w.date || 'Today'}</span>
    `;
    wishesListContainer.appendChild(card);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// ------------------------------------------
// VIRAL WHATSAPP SHARE BUTTON
// ------------------------------------------
quickShareBtn.addEventListener("click", () => {
  const currentUrl = window.location.href;
  const shareText = 
`🎂 *Celebrate Sikadev's Birthday in 3D!* 🎉✨

Blow out the digital candles using your microphone & pin your birthday wish onto Sikadev's 3D Universe:
👉 ${currentUrl}`;

  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(shareUrl, "_blank");
});

// ==========================================
// 7. MAIN ANIMATION LOOP
// ==========================================
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Smooth rotation interpolation
  universeGroup.rotation.y += (targetRotationY - universeGroup.rotation.y) * 0.08;
  cakeGroup.rotation.x += (targetRotationX - cakeGroup.rotation.x) * 0.08;

  // Gentle idle ambient spin
  if (!isDragging) {
    targetRotationY += 0.002;
  }

  // Starfield gentle cosmic drift
  stars.rotation.y = elapsedTime * 0.015;

  // Candle Flames Dynamic Flickering
  if (!candlesExtinguished) {
    candleFlames.forEach((flame, idx) => {
      const flicker = Math.sin(elapsedTime * 15 + idx * 2.5) * 0.12;
      const sway = Math.cos(elapsedTime * 8 + idx) * 0.05;
      flame.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
      flame.rotation.z = sway;
    });

    candleLights.forEach((light, idx) => {
      light.intensity = 1.3 + Math.sin(elapsedTime * 12 + idx) * 0.3;
    });
  }

  // Animate rising smoke puffs if any
  for (let i = smokePuffs.length - 1; i >= 0; i--) {
    const puff = smokePuffs[i];
    puff.position.y += puff.userData.vy;
    puff.position.x += puff.userData.vx;
    puff.position.z += puff.userData.vz;
    puff.scale.multiplyScalar(1.025);
    puff.material.opacity *= 0.96;

    if (puff.material.opacity <= 0.02) {
      cakeGroup.remove(puff);
      smokePuffs.splice(i, 1);
    }
  }

  // Animate Floating Wish Orbs (gentle hovering wave)
  wishOrbsGroup.children.forEach((orbGroup, idx) => {
    orbGroup.position.y += Math.sin(elapsedTime * 2 + idx) * 0.003;
    orbGroup.rotation.y = elapsedTime * 0.5;
  });

  renderer.render(scene, camera);
}

animate();
