/**
 * ==============================================================================
 * MODUL THREE.JS 3D SCENE — VISUALGRID MEDIA LOGO (3D WEB EXPERIENCE)
 * Penjelasan: File ini merender Logo 3D Interaktif "VisualGrid Media" pada Hero Section.
 * Menggabungkan:
 * 1. Monogram 3D "V" bervolume tebal dengan beveled edges & material obsidian chrome.
 * 2. Garis tepi neon cybernetic (EdgesGeometry) bercahaya cyan futuristik.
 * 3. Inti sensor optik prisma (Faceted Iris Prism) dengan kilau energi ungu-kebiruan.
 * 4. Piringan Grid Holografis 3D (Coordinate Matrix & Data Nodes) khas VisualGrid.
 * 5. Viewfinder Brackets sinematik [  ] yang merepresentasikan industri video & media.
 * 6. Ring orbit gimbal giroskopik & kartu rasio media melayang (1:1, 9:16, 16:9).
 * 7. Interaksi mouse parallax interaktif dengan lerp inertia, click pulse,
 *    dan IntersectionObserver untuk efisiensi performa 60 FPS tanpa beban GPU berlebih.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initVisualGridHero3D();
});

function initVisualGridHero3D() {
  const container = document.querySelector('.hero__canvas-container');
  const canvas = document.getElementById('hero-3d-canvas');
  const fallback = document.querySelector('.hero__canvas-fallback');

  if (!container || !canvas) return;

  // --------------------------------------------------------------------------
  // 1. FALLBACK STRATEGY: DUKUNGAN WEBGL
  // --------------------------------------------------------------------------
  if (!isWebGLAvailable()) {
    console.warn('WebGL tidak aktif. Mengaktifkan fallback visual CSS.');
    if (fallback) fallback.style.display = 'block';
    canvas.style.display = 'none';
    return;
  }

  // --------------------------------------------------------------------------
  // 2. SCENE, KAMERA, DAN RENDERER SETUP
  // --------------------------------------------------------------------------
  const scene = new THREE.Scene();

  let width = container.clientWidth;
  let height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  renderer.setSize(width, height);

  // Optimasi DPR: 1.0 pada mobile untuk mencegah panas baterai, maks 1.6 di desktop
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.6));

  // --------------------------------------------------------------------------
  // 3. TATA CAHAYA SINEMATIK (STUDIO LIGHTING RIG)
  // --------------------------------------------------------------------------
  // Ambient fill lembut berkarakter cosmic midnight
  const ambientLight = new THREE.AmbientLight(0x111c30, 0.9);
  scene.add(ambientLight);

  // Key Light putih tajam untuk memunculkan refleksi bevel monogram
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(5, 7, 6);
  scene.add(keyLight);

  // Cyan Neon Point Light (sisi kiri depan)
  const cyanLight = new THREE.PointLight(0x00f2fe, 3.8, 16);
  cyanLight.position.set(-4.5, 2.5, 3.5);
  scene.add(cyanLight);

  // Magenta / Electric Indigo Point Light (sisi kanan bawah)
  const purpleLight = new THREE.PointLight(0x9333ea, 3.2, 16);
  purpleLight.position.set(4.5, -2.5, 3.0);
  scene.add(purpleLight);

  // Deep Royal Blue Backlight untuk rim-lighting efek kedalaman
  const rimLight = new THREE.PointLight(0x2563eb, 2.6, 14);
  rimLight.position.set(0, 0, -3.5);
  scene.add(rimLight);

  // --------------------------------------------------------------------------
  // 4. GRUP UTAMA LOGO 3D VISUALGRID
  // --------------------------------------------------------------------------
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Sub-grup yang dapat dirotasikan mouse secara terpadu
  const logoGroup = new THREE.Group();
  mainGroup.add(logoGroup);

  // ==========================================================================
  // A. MONOGRAM 3D "V" EKSTRUSI PRESISI
  // ==========================================================================
  const vShape = new THREE.Shape();
  // Koordinat presisi proporsi chevron monogram "V"
  vShape.moveTo(-1.6, 1.35);
  vShape.lineTo(-0.7, 1.35);
  vShape.lineTo(0, -0.28);
  vShape.lineTo(0.7, 1.35);
  vShape.lineTo(1.6, 1.35);
  vShape.lineTo(0.35, -1.6);
  vShape.lineTo(-0.35, -1.6);
  vShape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: 0.38,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.07,
    bevelOffset: 0,
    bevelSegments: 4
  };

  const vGeometry = new THREE.ExtrudeGeometry(vShape, extrudeSettings);
  vGeometry.center(); // Pusat rotasi pas di tengah geometris

  // Material bodi: Dark Obsidian Metallic reflektif
  const vMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c1628,
    metalness: 0.92,
    roughness: 0.18,
    emissive: 0x06152d,
    emissiveIntensity: 0.5
  });

  const vMesh = new THREE.Mesh(vGeometry, vMaterial);
  logoGroup.add(vMesh);

  // Garis Tepi Neon (Cyber Edge Glow)
  const edgeGeo = new THREE.EdgesGeometry(vGeometry, 24);
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.88,
    linewidth: 2
  });
  const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
  vMesh.add(edgeLines);

  // ==========================================================================
  // B. INTI SENSOR OPTIK PRISMA (VISUAL IRIS CORE)
  // ==========================================================================
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0.42, 0.08);
  logoGroup.add(coreGroup);

  // Prisma Berlian Faset
  const prismGeo = new THREE.OctahedronGeometry(0.46, 0);
  const prismMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x2563eb,
    emissiveIntensity: 0.85,
    metalness: 0.85,
    roughness: 0.12,
    flatShading: true
  });
  const prismMesh = new THREE.Mesh(prismGeo, prismMat);
  coreGroup.add(prismMesh);

  // Wireframe Pembungkus Inti
  const prismWireGeo = new THREE.OctahedronGeometry(0.58, 0);
  const prismWireMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const prismWire = new THREE.Mesh(prismWireGeo, prismWireMat);
  coreGroup.add(prismWire);

  // ==========================================================================
  // C. MATRIX GRID HOLOGRAFIS 3D (THE "GRID")
  // ==========================================================================
  const gridMatrixGroup = new THREE.Group();
  gridMatrixGroup.position.set(0, -0.65, -0.2);
  gridMatrixGroup.rotation.x = Math.PI / 4.2;
  logoGroup.add(gridMatrixGroup);

  // 1. Cincin Koordinat Konsentris
  const ringRadii = [0.8, 1.35, 1.9, 2.45];
  ringRadii.forEach((r, idx) => {
    const ringGeo = new THREE.RingGeometry(r - 0.008, r + 0.008, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: idx % 2 === 0 ? 0x00f2fe : 0x3b82f6,
      transparent: true,
      opacity: 0.35 - idx * 0.06,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    gridMatrixGroup.add(ringMesh);
  });

  // 2. Garis Sumbu Koordinat Radial & Segitiga Arah
  const radialMat = new THREE.LineBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.35
  });
  const spokeCount = 8;
  const gridNodes = [];

  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const p1 = new THREE.Vector3(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6);
    const p2 = new THREE.Vector3(Math.cos(angle) * 2.45, 0, Math.sin(angle) * 2.45);
    const spokeGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const spokeLine = new THREE.Line(spokeGeo, radialMat);
    gridMatrixGroup.add(spokeLine);

    // Titik Node Koordinat Bercahaya (Grid Intersection Points)
    const nodeGeo = new THREE.SphereGeometry(0.042, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x00f2fe : 0xc084fc
    });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.copy(p2);
    gridMatrixGroup.add(node);
    gridNodes.push(node);
  }

  // 3. Grid Helper Isometris Dasar
  const planarGrid = new THREE.GridHelper(4.4, 10, 0x00f2fe, 0x1e3a8a);
  planarGrid.position.y = -0.05;
  planarGrid.material.transparent = true;
  planarGrid.material.opacity = 0.22;
  gridMatrixGroup.add(planarGrid);

  // ==========================================================================
  // D. VIEWFINDER BRACKETS SINEMATIK (MEDIA FRAMING) [  ]
  // ==========================================================================
  const bracketGroup = new THREE.Group();
  bracketGroup.position.set(0, 0, 0.3);
  logoGroup.add(bracketGroup);

  function createViewfinderBracket(x, y, dirX, dirY, length = 0.45) {
    const pts = [
      new THREE.Vector3(x, y - dirY * length, 0),
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x - dirX * length, y, 0)
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65
    });
    return new THREE.Line(geo, mat);
  }

  const bSizeX = 2.05;
  const bSizeY = 1.65;
  const brackets = [
    createViewfinderBracket(-bSizeX,  bSizeY, -1,  1), // Kiri Atas
    createViewfinderBracket( bSizeX,  bSizeY,  1,  1), // Kanan Atas
    createViewfinderBracket(-bSizeX, -bSizeY, -1, -1), // Kiri Bawah
    createViewfinderBracket( bSizeX, -bSizeY,  1, -1)  // Kanan Bawah
  ];
  brackets.forEach(b => bracketGroup.add(b));

  // ==========================================================================
  // E. RING ORBIT GIMBAL SINEMATIK
  // ==========================================================================
  // Ring 1: Focus Ring Torus Tipis
  const orbit1Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 120);
  const orbit1Mat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.55
  });
  const orbit1 = new THREE.Mesh(orbit1Geo, orbit1Mat);
  orbit1.rotation.x = Math.PI / 3.2;
  logoGroup.add(orbit1);

  // Ring 2: Gyro Orbit Sudut Berlawanan
  const orbit2Geo = new THREE.TorusGeometry(2.85, 0.016, 16, 120);
  const orbit2Mat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.38
  });
  const orbit2 = new THREE.Mesh(orbit2Geo, orbit2Mat);
  orbit2.rotation.y = Math.PI / 3.8;
  orbit2.rotation.x = -Math.PI / 4.5;
  logoGroup.add(orbit2);

  // ==========================================================================
  // F. KARTU ELEMEN MEDIA MELAYANG (1:1 FEED, 9:16 REEL, 16:9 VIDEO)
  // ==========================================================================
  const mediaCardsGroup = new THREE.Group();
  logoGroup.add(mediaCardsGroup);

  function createFloatingCard(w, h, color, posX, posY, posZ) {
    const cardGeo = new THREE.PlaneGeometry(w, h);
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);

    const wireEdges = new THREE.EdgesGeometry(cardGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.75 });
    const wireLines = new THREE.LineSegments(wireEdges, wireMat);
    cardMesh.add(wireLines);

    cardMesh.position.set(posX, posY, posZ);
    return cardMesh;
  }

  // 1:1 Card (Instagram Feed)
  const feedCard = createFloatingCard(0.48, 0.48, 0x00f2fe, -2.2, 0.8, 0.4);
  feedCard.rotation.y = 0.35;
  mediaCardsGroup.add(feedCard);

  // 9:16 Card (Reels & TikTok)
  const reelCard = createFloatingCard(0.32, 0.56, 0xa855f7, 2.25, -0.4, 0.3);
  reelCard.rotation.y = -0.4;
  mediaCardsGroup.add(reelCard);

  // 16:9 Card (Video Landscape)
  const videoCard = createFloatingCard(0.62, 0.35, 0x38bdf8, 1.4, 1.6, -0.3);
  videoCard.rotation.x = 0.25;
  mediaCardsGroup.add(videoCard);

  // ==========================================================================
  // G. SISTEM PARTIKEL KOSMIK (CREATIVE DATA SPARKS)
  // ==========================================================================
  const particlesCount = isMobile ? 320 : 650;
  const particlePositions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 16;
    particlePositions[i + 1] = (Math.random() - 0.5) * 16;
    particlePositions[i + 2] = (Math.random() - 0.5) * 12;
  }

  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particlesMat = new THREE.PointsMaterial({
    color: 0x93c5fd,
    size: 0.035,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particleSystem);

  // --------------------------------------------------------------------------
  // 5. PENYESUAIAN POSISI & SKALA BERDASARKAN VIEWPORT
  // --------------------------------------------------------------------------
  function positionLogoForScreen() {
    if (window.innerWidth >= 1024) {
      // Desktop: Geser ke kanan (X = 1.9) agar teks headline hero di sisi kiri leluasa
      mainGroup.position.set(1.9, 0, 0);
      mainGroup.scale.set(1.0, 1.0, 1.0);
    } else if (window.innerWidth >= 768) {
      mainGroup.position.set(1.1, -0.25, 0);
      mainGroup.scale.set(0.85, 0.85, 0.85);
    } else {
      // Mobile: Letakkan di tengah atas/tengah dengan skala kompak
      mainGroup.position.set(0, 0.35, -0.8);
      mainGroup.scale.set(0.72, 0.72, 0.72);
    }
  }

  positionLogoForScreen();

  // --------------------------------------------------------------------------
  // 6. INTERAKSI MOUSE/TOUCH DRAG & AUTO-ROTATION
  // Fungsi:
  // - TIDAK mengikuti mouse pasif.
  // - BISA digerakkan/diputar bebas dengan klik & seret (drag) mouse/sentuhan.
  // - BERPUTAR OTOMATIS secara mulus saat tidak sedang digerakkan.
  // --------------------------------------------------------------------------
  let isDragging = false;
  let previousPointerX = 0;
  let previousPointerY = 0;
  let dragVelocityX = 0;
  let dragVelocityY = 0;
  const autoRotateSpeed = 0.007; // Kecepatan rotasi otomatis saat idle
  const dragSensitivity = 0.0055;

  const heroSection = document.querySelector('.hero');
  const interactionTarget = heroSection || container;

  // Handler Mulai Drag (Pointer Down)
  const onPointerDown = (e) => {
    // Jangan menginterupsi jika pengguna sedang mengklik tombol atau link
    if (e.target.closest('a, button, input, textarea, select, .btn, .header, .nav')) return;

    isDragging = true;
    previousPointerX = e.clientX;
    previousPointerY = e.clientY;
    dragVelocityX = 0;
    dragVelocityY = 0;

    container.classList.add('is-grabbing');
    canvas.classList.add('is-grabbing');
  };

  // Handler Menggeser (Pointer Move)
  const onPointerMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousPointerX;
    const deltaY = e.clientY - previousPointerY;

    previousPointerX = e.clientX;
    previousPointerY = e.clientY;

    dragVelocityX = deltaX * dragSensitivity;
    dragVelocityY = deltaY * dragSensitivity;

    // Rotasi logo langsung mengikuti arah geseran tangan
    logoGroup.rotation.y += dragVelocityX;
    logoGroup.rotation.x += dragVelocityY;

    // Batasi sudut elevasi vertikal agar tidak terbalik
    logoGroup.rotation.x = Math.max(-0.75, Math.min(0.75, logoGroup.rotation.x));
  };

  // Handler Berhenti Drag (Pointer Up / Cancel)
  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('is-grabbing');
    canvas.classList.remove('is-grabbing');
  };

  // Pasang listener pada container & window
  interactionTarget.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // --------------------------------------------------------------------------
  // 7. EVENT LISTENER RESIZE
  // --------------------------------------------------------------------------
  window.addEventListener('resize', onWindowResize);

  function onWindowResize() {
    width = container.clientWidth;
    height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    positionLogoForScreen();
  }

  // --------------------------------------------------------------------------
  // 8. INTERSECTION OBSERVER: PAUSE SAAT HERO TIDAK TERLIHAT
  // --------------------------------------------------------------------------
  let isCanvasInView = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCanvasInView = entry.isIntersecting;
    });
  }, { threshold: 0.05 });

  if (heroSection) observer.observe(heroSection);

  // --------------------------------------------------------------------------
  // 9. ANIMATION TICK LOOP
  // --------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isCanvasInView) return;

    const elapsedTime = clock.getElapsedTime();

    // Logika Rotasi: Drag Manual vs Auto-Rotate saat Idle
    if (isDragging) {
      // Sedang digerakkan pengguna: posisi dikontrol langsung oleh pointer
    } else {
      // Menerapkan inersia gesekan (momentum throw) jika baru saja dilepas
      if (Math.abs(dragVelocityX) > 0.0001) {
        logoGroup.rotation.y += dragVelocityX;
        dragVelocityX *= 0.94; // Gesekan pelan
      } else {
        // Berputar otomatis secara mulus saat tidak digerakkan
        logoGroup.rotation.y += autoRotateSpeed;
      }

      if (Math.abs(dragVelocityY) > 0.0001) {
        logoGroup.rotation.x += dragVelocityY;
        logoGroup.rotation.x = Math.max(-0.75, Math.min(0.75, logoGroup.rotation.x));
        dragVelocityY *= 0.94;
      } else {
        // Kembalikan kemiringan X perlahan ke sudut pandang netral yang estetis
        logoGroup.rotation.x += (0.02 - logoGroup.rotation.x) * 0.025;
      }
    }

    // Inti Iris Berputar Cepat Mandiri & Denyut Emissive
    coreGroup.rotation.y = -elapsedTime * 0.8;
    coreGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.2;
    const pulseScale = 1.0 + Math.sin(elapsedTime * 2.5) * 0.08;
    coreGroup.scale.set(pulseScale, pulseScale, pulseScale);

    // Matrix Grid Berputar Koordinat
    gridMatrixGroup.rotation.z = -elapsedTime * 0.15;

    // Viewfinder Brackets Bernapas Halus
    const bBreath = 1.0 + Math.sin(elapsedTime * 1.8) * 0.04;
    bracketGroup.scale.set(bBreath, bBreath, bBreath);

    // Ring Orbit Gyro
    orbit1.rotation.z = elapsedTime * 0.35;
    orbit2.rotation.x = -elapsedTime * 0.26;

    // Kartu Media Melayang (Floating Hover)
    feedCard.position.y = 0.8 + Math.sin(elapsedTime * 1.4) * 0.12;
    feedCard.rotation.z = Math.sin(elapsedTime * 0.9) * 0.08;

    reelCard.position.y = -0.4 + Math.cos(elapsedTime * 1.2) * 0.1;
    reelCard.rotation.z = Math.cos(elapsedTime * 0.7) * 0.08;

    videoCard.position.y = 1.6 + Math.sin(elapsedTime * 1.1 + 1) * 0.09;

    // Node Grid Berkedip
    gridNodes.forEach((node, idx) => {
      const nodePulse = 1.0 + Math.sin(elapsedTime * 3 + idx) * 0.3;
      node.scale.set(nodePulse, nodePulse, nodePulse);
    });

    // Partikel Ambient Melayang
    particleSystem.rotation.y = elapsedTime * 0.035;
    particleSystem.rotation.x = elapsedTime * 0.015;

    // Render ke kanvas WebGL
    renderer.render(scene, camera);
  }

  animate();
}

/**
 * Utilitas Pemeriksaan Dukungan WebGL
 */
function isWebGLAvailable() {
  try {
    const testCanvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}
