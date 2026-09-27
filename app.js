// Sikadev's 3D Birthday Universe - Core Engine
// Interactive 3D Orbit, Scroll to Rotate, 3D Media Showcase & Live Event Engine

// ==========================================
// 1. STATE & STORAGE
// ==========================================
const SIKADEV_CONFIG = {
  name: "Sikadev",
  defaultPhone: localStorage.getItem("sikadev_phone") || "",
  adminPin: localStorage.getItem("sikadev_admin_pin") || "2026",
  liveCelebrationTime: localStorage.getItem("sikadev_live_time") || getDefaultCelebrationTime()
};

function getDefaultCelebrationTime() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

// Default Seed Wishes
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
  },
  {
    id: 4,
    name: "Devon",
    message: "Happy Birthday to a real visionary! Drinks on me this weekend brother! 🍕",
    vibe: "🍕 Food on Me",
    date: "Today"
  },
  {
    id: 5,
    name: "Kwame",
    message: "May your algorithms be fast and your peace of mind unbroken! Keep lifting everyone around you! 🚀",
    vibe: "👑 The GOAT",
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

// ------------------------------------------
// 3D Media Gallery Defaults
// ------------------------------------------
const DEFAULT_MEDIA = [
  {
    id: 101,
    title: "Midnight Coding & Milestones 💻",
    type: "image",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    caption: "Countless late nights building dreams and breaking through barriers. Grateful for every line of code this year.",
    likes: 48,
    date: "Year in Review"
  },
  {
    id: 102,
    title: "Golden Hour Reflections 🌅",
    type: "image",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    caption: "A moment to pause, breathe, and appreciate the journey and all the amazing people in it.",
    likes: 65,
    date: "Highlights"
  },
  {
    id: 103,
    title: "Celebration Waves 🌊",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    caption: "Riding the waves into this next chapter of life with peace, clarity, and bold ambition!",
    likes: 92,
    date: "Mood 2026"
  }
];

let mediaItems = [];
try {
  const savedMedia = localStorage.getItem("sikadev_media");
  mediaItems = savedMedia ? JSON.parse(savedMedia) : DEFAULT_MEDIA;
} catch (e) {
  mediaItems = DEFAULT_MEDIA;
}

let activeCardIndex = 0;
let autoSpinEnabled = true;

// ==========================================
// 2. THREE.JS 3D SCENE SETUP
// ==========================================
const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090a16, 0.022);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4.2, 13.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xc084fc, 1.4);
dirLight.position.set(5, 12, 7);
scene.add(dirLight);

const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.95);
blueRimLight.position.set(-6, -2, -5);
scene.add(blueRimLight);

// Group to hold the rotating cake, media frames & wish constellation
const universeGroup = new THREE.Group();
scene.add(universeGroup);

// ------------------------------------------
// Procedural Starfield & Cosmic Dust
// ------------------------------------------
const starCount = 1400;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);

const palette = [
  new THREE.Color(0xa855f7),
  new THREE.Color(0x38bdf8),
  new THREE.Color(0xfbbf24),
  new THREE.Color(0xffffff)
];

for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;
  const radius = 26 + Math.random() * 52;
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
  size: 0.22,
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
  metalness: 0.85,
  roughness: 0.2,
  emissive: 0x312e81,
  emissiveIntensity: 0.25
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
  color: 0x2e1065,
  roughness: 0.35,
  metalness: 0.15
});
const bottomTier = new THREE.Mesh(bottomGeo, bottomMat);
bottomTier.position.y = -0.4;
cakeGroup.add(bottomTier);

// Frosting Trim Beads
const beadCount = 32;
const beadGeo = new THREE.SphereGeometry(0.12, 12, 12);
const frostingMat = new THREE.MeshStandardMaterial({
  color: 0xf472b6,
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
  { x: 0, z: 0 },
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

  const waxGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
  const waxMat = new THREE.MeshStandardMaterial({
    color: candleColors[idx % candleColors.length],
    roughness: 0.25
  });
  const wax = new THREE.Mesh(waxGeo, waxMat);
  wax.position.y = 0.45;
  candleHolder.add(wax);

  const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
  const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const wick = new THREE.Mesh(wickGeo, wickMat);
  wick.position.y = 0.95;
  candleHolder.add(wick);

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

  const innerFlameGeo = new THREE.ConeGeometry(0.05, 0.2, 8);
  innerFlameGeo.translate(0, 0.1, 0);
  const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
  flame.add(innerFlame);

  const candleLight = new THREE.PointLight(0xffa200, 1.5, 4.5);
  candleLight.position.y = 1.2;
  candleHolder.add(candleLight);
  candleLights.push(candleLight);

  cakeGroup.add(candleHolder);
  candles.push(candleHolder);
});

// ------------------------------------------
// 3D FLOATING MEDIA CARDS (Large & Clear)
// ------------------------------------------
const mediaGroup = new THREE.Group();
universeGroup.add(mediaGroup);
const mediaMeshes = [];
const mediaFrameHolders = [];
const textureLoader = new THREE.TextureLoader();

function createMediaGallery() {
  while (mediaGroup.children.length > 0) {
    mediaGroup.remove(mediaGroup.children[0]);
  }
  mediaMeshes.length = 0;
  mediaFrameHolders.length = 0;

  const count = mediaItems.length;
  if (count === 0) return;

  mediaItems.forEach((item, index) => {
    const angle = (index / count) * Math.PI * 2;
    const distance = 6.6;
    const height = 1.2 + (index % 2 === 0 ? 0.4 : -0.2);

    const frameHolder = new THREE.Group();
    frameHolder.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );
    // Face center cake
    frameHolder.lookAt(0, height, 0);
    frameHolder.rotateY(Math.PI);

    // Frame Border (Larger, prominent card frame)
    const frameBorderGeo = new THREE.BoxGeometry(2.7, 1.9, 0.08);
    const frameBorderMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.3
    });
    const frameBorder = new THREE.Mesh(frameBorderGeo, frameBorderMat);
    frameHolder.add(frameBorder);

    // Glowing Neon Rim
    const rimGeo = new THREE.BoxGeometry(2.76, 1.96, 0.04);
    const rimMat = new THREE.MeshBasicMaterial({
      color: index === activeCardIndex ? 0xf59e0b : 0xc084fc,
      wireframe: true
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    frameHolder.add(rim);

    // Photo / Video Screen Plane
    const screenGeo = new THREE.PlaneGeometry(2.5, 1.7);
    let screenMat;

    if (item.type === "video") {
      const videoEl = document.createElement("video");
      videoEl.src = item.url;
      videoEl.crossOrigin = "anonymous";
      videoEl.loop = true;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.setAttribute("webkit-playsinline", "true");
      videoEl.play().catch(() => {});

      const videoTex = new THREE.VideoTexture(videoEl);
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;

      screenMat = new THREE.MeshBasicMaterial({
        map: videoTex,
        side: THREE.DoubleSide
      });
    } else {
      const tex = textureLoader.load(item.url);
      screenMat = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
      });
    }

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.045;
    screenMesh.userData = { mediaItem: item, index: index };
    frameHolder.add(screenMesh);
    mediaMeshes.push(screenMesh);

    // Play / Photo Badge in bottom corner
    const badgeGeo = new THREE.CircleGeometry(0.18, 16);
    const badgeMat = new THREE.MeshBasicMaterial({
      color: item.type === "video" ? 0xef4444 : 0x3b82f6,
      side: THREE.DoubleSide
    });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(1.1, -0.72, 0.05);
    frameHolder.add(badge);

    mediaGroup.add(frameHolder);
    mediaFrameHolders.push(frameHolder);
  });

  const memBadge = document.getElementById("memory-count-badge");
  if (memBadge) memBadge.textContent = mediaItems.length;

  updateActiveCardUI();
  renderShowcaseSection();
}

createMediaGallery();

// ------------------------------------------
// Floating Wish Constellation (Orbiting Orbs)
// ------------------------------------------
const wishOrbsGroup = new THREE.Group();
universeGroup.add(wishOrbsGroup);
const wishOrbMeshes = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createWishOrbs() {
  while (wishOrbsGroup.children.length > 0) {
    wishOrbsGroup.remove(wishOrbsGroup.children[0]);
  }
  wishOrbMeshes.length = 0;

  wishes.forEach((w, index) => {
    const angle = (index / Math.max(wishes.length, 1)) * Math.PI * 2;
    const distance = 4.4 + (index % 3) * 0.8;
    const height = 0.6 + Math.sin(index * 1.5) * 1.8;

    const orbGroup = new THREE.Group();
    orbGroup.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );

    const orbGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.userData = { wish: w, originalScale: 1 };
    orbGroup.add(orb);

    const haloGeo = new THREE.RingGeometry(0.32, 0.42, 24);
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

  const countBadge = document.getElementById("wish-count-badge");
  if (countBadge) countBadge.textContent = wishes.length;

  updateLiveWishTicker();
  renderWishesShowcase();
}

createWishOrbs();

// ==========================================
// 3. INTERACTIVE 3D ORBIT & SCROLL NAVIGATION
// ==========================================
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotationY = 0;
let targetRotationX = 0.15;
let rotationSpeed = 0.0055;

// Rotate 3D Camera directly to a selected card
function rotateToCard(index) {
  if (mediaItems.length === 0) return;
  activeCardIndex = (index + mediaItems.length) % mediaItems.length;

  const count = mediaItems.length;
  const angle = (activeCardIndex / count) * Math.PI * 2;
  // Calculate target rotation so card faces camera at z > 0
  targetRotationY = -angle - Math.PI / 2;

  updateActiveCardUI();
  playBellTone(640);
}

function updateActiveCardUI() {
  if (mediaItems.length === 0) return;
  const activeItem = mediaItems[activeCardIndex];
  if (!activeItem) return;

  const titleEl = document.getElementById("active-card-title");
  const iconEl = document.getElementById("active-card-icon");
  if (titleEl) {
    titleEl.textContent = `Card ${activeCardIndex + 1}/${mediaItems.length}: ${activeItem.title}`;
  }
  if (iconEl) {
    iconEl.textContent = activeItem.type === "video" ? "🎥" : "📸";
  }
}

// Prev / Next Card buttons
document.getElementById("prev-card-btn").addEventListener("click", () => {
  rotateToCard(activeCardIndex - 1);
});

document.getElementById("next-card-btn").addEventListener("click", () => {
  rotateToCard(activeCardIndex + 1);
});

document.getElementById("active-card-pill").addEventListener("click", () => {
  if (mediaItems[activeCardIndex]) {
    showMediaInspect(mediaItems[activeCardIndex]);
  }
});

// Auto-spin toggle
const autoSpinBtn = document.getElementById("auto-spin-btn");
autoSpinBtn.addEventListener("click", () => {
  autoSpinEnabled = !autoSpinEnabled;
  autoSpinBtn.classList.toggle("border-purple-400", autoSpinEnabled);
  autoSpinBtn.querySelector("span:last-child").textContent = autoSpinEnabled ? "Auto Spin" : "Paused";
  playBellTone(500);
});

// ------------------------------------------
// MOUSE WHEEL & PAGE SCROLL TO ROTATE 3D CARDS
// ------------------------------------------
window.addEventListener('wheel', (e) => {
  // If user is interacting inside a modal or drawer, don't hijack wheel
  if (e.target.closest('#wish-modal') || e.target.closest('#wishes-drawer') || e.target.closest('#admin-modal') || e.target.closest('#media-inspect-modal')) return;

  // If at the top hero section, wheel spins the 3D cards universe!
  if (window.scrollY < 250) {
    targetRotationY += e.deltaY * 0.0035;
    // Check nearest card index based on rotation angle
    detectNearestCard();
  }
}, { passive: true });

// Detect which card is facing camera
function detectNearestCard() {
  if (mediaItems.length === 0) return;
  const count = mediaItems.length;
  const normalizedAngle = (-targetRotationY - Math.PI / 2) % (Math.PI * 2);
  const positiveAngle = (normalizedAngle + Math.PI * 2) % (Math.PI * 2);
  const estimatedIndex = Math.round((positiveAngle / (Math.PI * 2)) * count) % count;

  if (estimatedIndex !== activeCardIndex) {
    activeCardIndex = estimatedIndex;
    updateActiveCardUI();
  }
}

// Parallax Camera tilt on page scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  // Subtle camera rise and tilt as user scrolls down to cards section
  if (scrollY > 100) {
    camera.position.y = 4.2 - (scrollY * 0.002);
    targetRotationX = Math.min(0.35, 0.15 + (scrollY * 0.0003));
  } else {
    camera.position.y = 4.2;
    targetRotationX = 0.15;
  }
}, { passive: true });

// Scroll prompt button
document.getElementById("scroll-prompt-btn").addEventListener("click", () => {
  document.getElementById("cards-showcase-section").scrollIntoView({ behavior: "smooth" });
});

// ------------------------------------------
// TOUCH & MOUSE DRAGGING TO ROTATE
// ------------------------------------------
window.addEventListener('mousedown', (e) => {
  if (e.target.closest('#wish-modal') || e.target.closest('#wishes-drawer') || e.target.closest('#admin-modal') || e.target.closest('#media-inspect-modal') || e.target.closest('header') || e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('touchstart', (e) => {
  if (e.target.closest('#wish-modal') || e.target.closest('#wishes-drawer') || e.target.closest('#admin-modal') || e.target.closest('#media-inspect-modal') || e.target.closest('header') || e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
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
  detectNearestCard();
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const deltaX = e.touches[0].clientX - previousMousePosition.x;
  const deltaY = e.touches[0].clientY - previousMousePosition.y;

  targetRotationY += deltaX * rotationSpeed;
  targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX + deltaY * rotationSpeed * 0.5));
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  detectNearestCard();
}, { passive: true });

window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('touchend', () => isDragging = false);

// Raycasting click
window.addEventListener('click', (e) => {
  if (isDragging) return;
  if (e.target.closest('#wish-modal') || e.target.closest('#wishes-drawer') || e.target.closest('#admin-modal') || e.target.closest('#media-inspect-modal') || e.target.closest('button') || e.target.closest('input') || e.target.closest('#cards-showcase-section')) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const mediaIntersects = raycaster.intersectObjects(mediaMeshes);
  if (mediaIntersects.length > 0) {
    const clickedData = mediaIntersects[0].object.userData;
    if (clickedData && clickedData.mediaItem) {
      activeCardIndex = clickedData.index;
      updateActiveCardUI();
      showMediaInspect(clickedData.mediaItem);
      return;
    }
  }

  const wishIntersects = raycaster.intersectObjects(wishOrbMeshes);
  if (wishIntersects.length > 0) {
    const clickedWish = wishIntersects[0].object.userData.wish;
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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 4. SCROLLABLE CARDS SHOWCASE (2D/3D Hybrid)
// ==========================================
function renderShowcaseSection() {
  const grid = document.getElementById("memory-cards-grid");
  if (!grid) return;
  grid.innerHTML = "";

  mediaItems.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card-showcase-item rounded-3xl bg-[#0e1026]/90 border border-purple-500/20 p-5 shadow-xl flex flex-col justify-between backdrop-blur-md cursor-pointer";
    
    const mediaPreview = item.type === "video" 
      ? `<div class="relative w-full h-44 rounded-2xl overflow-hidden bg-black mb-3">
           <video src="${item.url}" muted loop playsinline class="w-full h-full object-cover"></video>
           <span class="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">🎥 Video</span>
         </div>`
      : `<div class="relative w-full h-44 rounded-2xl overflow-hidden bg-black mb-3">
           <img src="${item.url}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover" />
           <span class="absolute top-3 right-3 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">📸 Photo</span>
         </div>`;

    card.innerHTML = `
      <div>
        ${mediaPreview}
        <div class="flex items-center justify-between text-xs text-purple-300/70 mb-1">
          <span>${item.date || 'Moment'}</span>
          <span class="text-rose-400 font-semibold">❤️ ${item.likes || 42}</span>
        </div>
        <h5 class="text-base font-bold text-white font-['Outfit']">${escapeHtml(item.title)}</h5>
        <p class="text-xs text-purple-200/80 mt-1 line-clamp-2">${escapeHtml(item.caption || '')}</p>
      </div>

      <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <button class="view-in-3d-btn px-3 py-1.5 rounded-xl bg-purple-600/40 hover:bg-purple-600 border border-purple-400/40 text-xs font-bold text-white flex items-center space-x-1" data-index="${index}">
          <span>🪐 View in 3D Sky</span>
        </button>
        <button class="expand-card-btn text-xs text-amber-300 font-bold hover:underline" data-index="${index}">
          Read Story →
        </button>
      </div>
    `;

    // View in 3D Sky Button
    card.querySelector(".view-in-3d-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: "smooth" });
      rotateToCard(index);
    });

    // Expand Card modal
    card.addEventListener("click", () => {
      showMediaInspect(item);
    });

    grid.appendChild(card);
  });
}

function renderWishesShowcase() {
  const grid = document.getElementById("wishes-cards-grid");
  if (!grid) return;
  grid.innerHTML = "";

  wishes.forEach(w => {
    const card = document.createElement("div");
    card.className = "p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 transition-all flex flex-col justify-between";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold text-amber-300 text-sm">${escapeHtml(w.name)}</span>
          <span class="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/20">${escapeHtml(w.vibe)}</span>
        </div>
        <p class="text-xs sm:text-sm text-gray-200 leading-relaxed italic">"${escapeHtml(w.message)}"</p>
      </div>
      <div class="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
        <span>${w.date || 'Today'}</span>
        <span class="text-amber-400">🌟 Pinned in 3D</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.getElementById("section-add-wish-btn").addEventListener("click", () => {
  document.getElementById("wish-modal").classList.add("active");
  initAudio();
});

// ==========================================
// 5. WEB AUDIO SYNTHESIZER & SOUND EFFECTS
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
  } catch (err) {}
}

function playTickTone() {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

function playBirthdayFanfare() {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const notes = [
    { f: 261.63, d: 0.25 },
    { f: 261.63, d: 0.25 },
    { f: 293.66, d: 0.5 },
    { f: 261.63, d: 0.5 },
    { f: 349.23, d: 0.5 },
    { f: 329.63, d: 0.9 },
    { f: 261.63, d: 0.25 },
    { f: 261.63, d: 0.25 },
    { f: 293.66, d: 0.5 },
    { f: 261.63, d: 0.5 },
    { f: 392.00, d: 0.5 },
    { f: 349.23, d: 0.9 },
    { f: 523.25, d: 1.2 }
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
// 6. THE "BLOW THE MIC" AUDIO ENGINE
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

  let lowMidEnergy = 0;
  for (let i = 2; i < 24; i++) {
    lowMidEnergy += dataArray[i];
  }
  const averageEnergy = lowMidEnergy / 22;

  const intensity = Math.min(100, Math.round((averageEnergy / 90) * 100));
  micMeterBar.style.width = `${intensity}%`;
  windPercentage.textContent = `${intensity}%`;

  candleFlames.forEach(f => {
    f.scale.x = 1 - (intensity / 180);
    f.scale.z = 1 - (intensity / 180);
  });

  if (averageEnergy > 70) {
    blowEnergyAccumulator += 1;
    if (blowEnergyAccumulator > 8) {
      extinguishCandles("mic");
      return;
    }
  } else {
    blowEnergyAccumulator = Math.max(0, blowEnergyAccumulator - 0.5);
  }

  requestAnimationFrame(listenForBlow);
}

manualBlowBtn.addEventListener("click", () => {
  initAudio();
  micMeterBar.style.width = "100%";
  windPercentage.textContent = "100%";
  setTimeout(() => extinguishCandles("manual"), 250);
});

function extinguishCandles(triggerType = "manual") {
  if (candlesExtinguished) return;
  candlesExtinguished = true;

  candleFlames.forEach(flame => flame.visible = false);
  candleLights.forEach(light => light.intensity = 0);

  spawnSmokeParticles();

  statusText.textContent = "🎉 WISHES UNLOCKED! HAPPY BIRTHDAY SIKADEV! 🚀✨";
  statusPill.classList.remove("border-white/10");
  statusPill.classList.add("bg-gradient-to-r", "from-pink-600/30", "to-amber-500/30", "border-amber-400");

  playBirthdayFanfare();
  launchCelebrationConfetti();

  relightBtn.classList.remove("hidden");
  micTriggerBtn.classList.add("hidden");
  manualBlowBtn.classList.add("hidden");

  if (micActive) stopMic();
}

function spawnSmokeParticles() {
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
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);

  confetti({
    particleCount: 110,
    spread: 110,
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
  candleLights.forEach(light => light.intensity = 1.5);

  statusText.textContent = "Candles relit! Ready to blow again! 🎂";
  statusPill.className = "pointer-events-auto inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-xs sm:text-sm text-purple-200 font-medium mb-1.5 animate-bounce-slow";

  relightBtn.classList.add("hidden");
  micTriggerBtn.classList.remove("hidden");
  manualBlowBtn.classList.remove("hidden");
  micMeterBar.style.width = "0%";
  windPercentage.textContent = "0%";

  playBellTone(700);
});

// ==========================================
// 7. TIMED LIVE EVENT & PRESENCE ENGINE
// ==========================================
const countdownTimerDisplay = document.getElementById("countdown-timer-display");
const livePresenceCount = document.getElementById("live-presence-count");
const liveEventOverlay = document.getElementById("live-event-overlay");
const liveSyncCountdown = document.getElementById("live-sync-countdown");
const dismissLiveOverlayBtn = document.getElementById("dismiss-live-overlay-btn");

let liveCelebrationTriggered = false;

let simulatedLovelies = 24;
setInterval(() => {
  const delta = (Math.random() > 0.45 ? 1 : -1) * (Math.floor(Math.random() * 2));
  simulatedLovelies = Math.max(14, Math.min(88, simulatedLovelies + delta));
  if (livePresenceCount) livePresenceCount.textContent = simulatedLovelies;
}, 3500);

function updateLiveCountdown() {
  const target = new Date(SIKADEV_CONFIG.liveCelebrationTime).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    countdownTimerDisplay.textContent = "00:00:00 (LIVE NOW!)";
    countdownTimerDisplay.classList.add("text-rose-400", "animate-pulse");
    
    if (!liveCelebrationTriggered) {
      triggerSynchronizedLiveCelebration();
    }
    return;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, '0');
  countdownTimerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

setInterval(updateLiveCountdown, 1000);
updateLiveCountdown();

function triggerSynchronizedLiveCelebration() {
  liveCelebrationTriggered = true;
  initAudio();
  liveEventOverlay.classList.add("active");

  let count = 10;
  liveSyncCountdown.textContent = count;
  playTickTone();

  const syncTimer = setInterval(() => {
    count--;
    if (count > 0) {
      liveSyncCountdown.textContent = count;
      playTickTone();
    } else {
      clearInterval(syncTimer);
      liveSyncCountdown.textContent = "BLOW! 🎂💨";
      setTimeout(() => {
        liveEventOverlay.classList.remove("active");
        extinguishCandles("live");
      }, 900);
    }
  }, 1000);
}

dismissLiveOverlayBtn.addEventListener("click", () => {
  liveEventOverlay.classList.remove("active");
  extinguishCandles("manual");
});

function updateLiveWishTicker() {
  const ticker = document.getElementById("ticker-content");
  if (!ticker) return;

  const tickerText = wishes.map(w => `🌟 "${w.message}" — ${w.name} (${w.vibe})`).join("  •  ");
  ticker.textContent = tickerText + "  •  " + tickerText;
}

// ==========================================
// 8. 3D MEDIA INSPECTION MODAL
// ==========================================
const mediaInspectModal = document.getElementById("media-inspect-modal");
const closeMediaInspectBtn = document.getElementById("close-media-inspect-btn");
const inspectMediaDisplay = document.getElementById("inspect-media-display");
const inspectMediaTitle = document.getElementById("inspect-media-title");
const inspectMediaCaption = document.getElementById("inspect-media-caption");
const inspectMediaTag = document.getElementById("inspect-media-tag");
const likeMemoryBtn = document.getElementById("like-memory-btn");
const memoryLikesCount = document.getElementById("memory-likes-count");

let currentInspectedMedia = null;

function showMediaInspect(media) {
  currentInspectedMedia = media;
  inspectMediaTitle.textContent = media.title;
  inspectMediaCaption.textContent = media.caption;
  inspectMediaTag.textContent = media.type === "video" ? "🎥 Video Memory" : "📸 Photo Memory";
  memoryLikesCount.textContent = `${media.likes || 42} Loves`;

  inspectMediaDisplay.innerHTML = "";
  if (media.type === "video") {
    const video = document.createElement("video");
    video.src = media.url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.className = "w-full max-h-[380px] object-contain rounded-xl";
    inspectMediaDisplay.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = media.url;
    img.alt = media.title;
    img.className = "w-full max-h-[380px] object-contain rounded-xl";
    inspectMediaDisplay.appendChild(img);
  }

  mediaInspectModal.classList.add("active");
  playBellTone(640);
}

closeMediaInspectBtn.addEventListener("click", () => {
  mediaInspectModal.classList.remove("active");
  const vid = inspectMediaDisplay.querySelector("video");
  if (vid) vid.pause();
});

likeMemoryBtn.addEventListener("click", () => {
  if (!currentInspectedMedia) return;
  currentInspectedMedia.likes = (currentInspectedMedia.likes || 42) + 1;
  memoryLikesCount.textContent = `${currentInspectedMedia.likes} Loves`;
  confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  playBellTone(880);
  renderShowcaseSection();
});

document.getElementById("view-memories-btn").addEventListener("click", () => {
  if (mediaItems.length > 0) {
    showMediaInspect(mediaItems[activeCardIndex] || mediaItems[0]);
  } else {
    alert("No 3D media added yet! Tap the Admin button to add your photos and videos.");
  }
});

// ==========================================
// 9. ADMIN STUDIO
// ==========================================
const adminModal = document.getElementById("admin-modal");
const adminTriggerBtn = document.getElementById("admin-trigger-btn");
const closeAdminModalBtn = document.getElementById("close-admin-modal-btn");
const adminAuthScreen = document.getElementById("admin-auth-screen");
const adminDashboardScreen = document.getElementById("admin-dashboard-screen");
const adminPinInput = document.getElementById("admin-pin-input");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminLogoutBtn = document.getElementById("admin-logout-btn");

let logoClickCount = 0;
let logoTimer = null;
document.getElementById("brand-logo").addEventListener("click", () => {
  logoClickCount++;
  clearTimeout(logoTimer);
  logoTimer = setTimeout(() => { logoClickCount = 0; }, 800);
  if (logoClickCount >= 3) {
    logoClickCount = 0;
    openAdminModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.altKey && (e.key === "a" || e.key === "A")) {
    openAdminModal();
  }
});

adminTriggerBtn.addEventListener("click", openAdminModal);

function openAdminModal() {
  adminModal.classList.add("active");
  adminPinInput.value = "";
  adminPinInput.focus();
}

closeAdminModalBtn.addEventListener("click", () => {
  adminModal.classList.remove("active");
});

adminLoginBtn.addEventListener("click", () => {
  const enteredPin = adminPinInput.value.trim();
  if (enteredPin === SIKADEV_CONFIG.adminPin) {
    adminAuthScreen.classList.add("hidden");
    adminDashboardScreen.classList.remove("hidden");
    loadAdminDashboard();
    playBellTone(800);
  } else {
    alert("Incorrect passcode! Default is 2026.");
    adminPinInput.value = "";
  }
});

adminPinInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") adminLoginBtn.click();
});

adminLogoutBtn.addEventListener("click", () => {
  adminDashboardScreen.classList.add("hidden");
  adminAuthScreen.classList.remove("hidden");
});

const tabMediaBtn = document.getElementById("tab-media-btn");
const tabEventBtn = document.getElementById("tab-event-btn");
const tabSettingsBtn = document.getElementById("tab-settings-btn");
const adminTabMedia = document.getElementById("admin-tab-media");
const adminTabEvent = document.getElementById("admin-tab-event");
const adminTabSettings = document.getElementById("admin-tab-settings");

function switchAdminTab(activeTab, activeBtn) {
  [adminTabMedia, adminTabEvent, adminTabSettings].forEach(t => t.classList.add("hidden"));
  [tabMediaBtn, tabEventBtn, tabSettingsBtn].forEach(b => {
    b.classList.remove("active", "bg-amber-500/20", "border-amber-400/40", "text-amber-300");
    b.classList.add("bg-white/5", "border-white/10", "text-gray-300");
  });

  activeTab.classList.remove("hidden");
  activeBtn.classList.add("active", "bg-amber-500/20", "border-amber-400/40", "text-amber-300");
  activeBtn.classList.remove("bg-white/5", "border-white/10", "text-gray-300");
}

tabMediaBtn.addEventListener("click", () => switchAdminTab(adminTabMedia, tabMediaBtn));
tabEventBtn.addEventListener("click", () => switchAdminTab(adminTabEvent, tabEventBtn));
tabSettingsBtn.addEventListener("click", () => switchAdminTab(adminTabSettings, tabSettingsBtn));

function loadAdminDashboard() {
  renderAdminMediaList();
  const eventDateTimeInput = document.getElementById("event-datetime-input");
  const currentScheduled = new Date(SIKADEV_CONFIG.liveCelebrationTime);
  const offset = currentScheduled.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(currentScheduled - offset)).toISOString().slice(0, 16);
  eventDateTimeInput.value = localISOTime;

  document.getElementById("admin-phone-input").value = SIKADEV_CONFIG.defaultPhone;
}

function renderAdminMediaList() {
  const list = document.getElementById("admin-media-list");
  const countSpan = document.getElementById("admin-media-count");
  list.innerHTML = "";
  countSpan.textContent = mediaItems.length;

  if (mediaItems.length === 0) {
    list.innerHTML = `<p class="text-xs text-gray-400">No media uploaded yet.</p>`;
    return;
  }

  mediaItems.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs";
    row.innerHTML = `
      <div class="flex items-center space-x-2.5 truncate">
        <span class="text-base">${item.type === "video" ? "🎥" : "📸"}</span>
        <div class="truncate">
          <p class="font-bold text-white truncate">${escapeHtml(item.title)}</p>
          <p class="text-[10px] text-gray-400 truncate">${escapeHtml(item.caption || '')}</p>
        </div>
      </div>
      <button class="delete-media-btn text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-500/10 rounded-lg shrink-0 ml-2" data-index="${index}">
        🗑️ Delete
      </button>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll(".delete-media-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      mediaItems.splice(idx, 1);
      localStorage.setItem("sikadev_media", JSON.stringify(mediaItems));
      createMediaGallery();
      renderAdminMediaList();
    });
  });
}

const addMediaForm = document.getElementById("add-media-form");
const mediaFileInput = document.getElementById("media-file-input");
const mediaUrlInput = document.getElementById("media-url-input");

mediaFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    mediaUrlInput.value = evt.target.result;
  };
  reader.readAsDataURL(file);
});

addMediaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("media-title-input").value.trim();
  const type = document.getElementById("media-type-input").value;
  const url = mediaUrlInput.value.trim();
  const caption = document.getElementById("media-caption-input").value.trim();

  if (!url) {
    alert("Please upload a file or paste an image/video URL!");
    return;
  }

  const newMedia = {
    id: Date.now(),
    title: title,
    type: type,
    url: url,
    caption: caption,
    likes: 1,
    date: "Just added"
  };

  mediaItems.unshift(newMedia);
  try {
    localStorage.setItem("sikadev_media", JSON.stringify(mediaItems));
  } catch (err) {}

  createMediaGallery();
  renderAdminMediaList();

  addMediaForm.reset();
  confetti({ particleCount: 40, spread: 60 });
  alert("✨ Memory added into Sikadev's 3D Orbit Sky!");
});

document.getElementById("set-midnight-btn").addEventListener("click", () => {
  const target = new Date();
  target.setHours(24, 0, 0, 0);
  setEventInputDate(target);
});

document.getElementById("set-1hour-btn").addEventListener("click", () => {
  const target = new Date(Date.now() + 60 * 60 * 1000);
  setEventInputDate(target);
});

document.getElementById("set-tomorrow-noon-btn").addEventListener("click", () => {
  const target = new Date();
  target.setDate(target.getDate() + 1);
  target.setHours(12, 0, 0, 0);
  setEventInputDate(target);
});

function setEventInputDate(date) {
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);
  document.getElementById("event-datetime-input").value = localISOTime;
}

document.getElementById("save-event-time-btn").addEventListener("click", () => {
  const val = document.getElementById("event-datetime-input").value;
  if (!val) return;
  const targetDate = new Date(val);
  SIKADEV_CONFIG.liveCelebrationTime = targetDate.toISOString();
  localStorage.setItem("sikadev_live_time", SIKADEV_CONFIG.liveCelebrationTime);
  liveCelebrationTriggered = false;
  updateLiveCountdown();
  alert(`⏰ Live Celebration set for: ${targetDate.toLocaleString()}`);
});

document.getElementById("force-live-now-btn").addEventListener("click", () => {
  adminModal.classList.remove("active");
  triggerSynchronizedLiveCelebration();
});

document.getElementById("save-phone-btn").addEventListener("click", () => {
  const phone = document.getElementById("admin-phone-input").value.trim();
  SIKADEV_CONFIG.defaultPhone = phone;
  localStorage.setItem("sikadev_phone", phone);
  alert("📲 WhatsApp phone number saved!");
});

document.getElementById("save-pin-btn").addEventListener("click", () => {
  const newPin = document.getElementById("admin-new-pin-input").value.trim();
  if (newPin.length < 4) {
    alert("PIN must be at least 4 digits.");
    return;
  }
  SIKADEV_CONFIG.adminPin = newPin;
  localStorage.setItem("sikadev_admin_pin", newPin);
  alert("🔐 Admin passcode updated!");
});

// ==========================================
// 10. WISH SYSTEM & WHATSAPP GENERATION
// ==========================================
const wishModal = document.getElementById("wish-modal");
const openWishModalBtn = document.getElementById("open-wish-modal-btn");
const closeWishModalBtn = document.getElementById("close-wish-modal");
const wishForm = document.getElementById("wish-form");
const submitWhatsAppBtn = document.getElementById("submit-whatsapp-btn");
const quickShareBtn = document.getElementById("quick-share-btn");

let selectedVibe = "👑 The GOAT";

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

function buildWhatsAppWishUrl(name, message, vibe) {
  const formattedText = 
`🎂 *HAPPY BIRTHDAY SIKADEV!* 🎉✨

💌 *Birthday Wish from:* ${name}
"${message}"

🌟 *Vibe:* ${vibe}

🎈 *Sent via your 3D Birthday Universe!*
🚀 ${window.location.href}`;

  const cleanPhone = (SIKADEV_CONFIG.defaultPhone || "").replace(/[^0-9]/g, '');
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedText)}`;
  } else {
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
  }
}

submitWhatsAppBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("sender-name");
  const msgInput = document.getElementById("sender-message");

  const name = nameInput.value.trim() || "A Lovely Friend";
  const message = msgInput.value.trim() || "Happy Birthday Sikadev! Wishing you happiness, health, and greatness! 🚀";

  saveWishLocally(name, message, selectedVibe);

  const url = buildWhatsAppWishUrl(name, message, selectedVibe);
  window.open(url, "_blank");

  wishModal.classList.remove("active");
  confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
});

wishForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("sender-name");
  const msgInput = document.getElementById("sender-message");

  const name = nameInput.value.trim();
  const message = msgInput.value.trim();

  saveWishLocally(name, message, selectedVibe);

  nameInput.value = "";
  msgInput.value = "";
  wishModal.classList.remove("active");

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
  renderWishesShowcase();
}

// Wishes Drawer
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

// WhatsApp Share URL
quickShareBtn.addEventListener("click", () => {
  const currentUrl = window.location.href;
  const shareText = 
`🎂 *Celebrate Sikadev's Birthday in 3D!* 🎉✨

Blow out the digital candles using your microphone, view 3D memories & join our live celebration:
👉 ${currentUrl}`;

  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(shareUrl, "_blank");
});

// ==========================================
// 11. MAIN ANIMATION LOOP
// ==========================================
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Smooth rotation interpolation
  universeGroup.rotation.y += (targetRotationY - universeGroup.rotation.y) * 0.08;
  cakeGroup.rotation.x += (targetRotationX - cakeGroup.rotation.x) * 0.08;

  // Gentle ambient spin if auto-spin is on and not dragging
  if (!isDragging && autoSpinEnabled && window.scrollY < 200) {
    targetRotationY += 0.0018;
    detectNearestCard();
  }

  // Starfield drift
  stars.rotation.y = elapsedTime * 0.012;

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

  // Animate rising smoke puffs
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

  // Animate Floating Wish Orbs
  wishOrbsGroup.children.forEach((orbGroup, idx) => {
    orbGroup.position.y += Math.sin(elapsedTime * 2 + idx) * 0.003;
    orbGroup.rotation.y = elapsedTime * 0.4;
  });

  // Animate 3D Media Frames gentle hovering wave
  mediaFrameHolders.forEach((frameGroup, idx) => {
    frameGroup.position.y += Math.sin(elapsedTime * 1.6 + idx * 2) * 0.003;
  });

  renderer.render(scene, camera);
}

animate();
