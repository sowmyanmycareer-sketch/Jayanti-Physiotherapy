import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CLINIC_INFO } from '../data/clinicData';
import { 
  Star, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  ChevronRight,
  RotateCw
} from 'lucide-react';

interface Hero3DProps {
  onStartPainCheck: () => void;
  onOpenTour: () => void;
  onOpenBooking: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ 
  onStartPainCheck, 
  onOpenTour, 
  onOpenBooking 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeZone, setActiveZone] = useState<string>('Lumbar Decompression');

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x14b8a6, 2.5, 10);
    pointLight1.position.set(2, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Group for whole 3D kinetic human spine & anatomical model
    const spineGroup = new THREE.Group();
    scene.add(spineGroup);

    // Vertebrae construction: 16 stacked anatomical vertebrae with intervertebral discs
    const vertebraGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.12, 16);
    const discGeo = new THREE.CylinderGeometry(0.32, 0.34, 0.06, 16);
    const spinalCanalGeo = new THREE.TorusGeometry(0.32, 0.05, 8, 20);

    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.25,
    });

    const discMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0x0f766e,
      emissiveIntensity: 0.4,
    });

    const spineSegments: THREE.Mesh[] = [];

    const totalVertebrae = 16;
    for (let i = 0; i < totalVertebrae; i++) {
      const yPos = (i - totalVertebrae / 2) * 0.22;
      // natural s-curve lordosis and kyphosis
      const zCurvature = Math.sin((i / totalVertebrae) * Math.PI * 2) * 0.18;

      const vertebraMesh = new THREE.Mesh(vertebraGeo, boneMaterial);
      vertebraMesh.position.set(0, yPos, zCurvature);
      vertebraMesh.scale.set(
        1 + (totalVertebrae - i) * 0.03,
        1,
        1 + (totalVertebrae - i) * 0.03
      );
      spineGroup.add(vertebraMesh);
      spineSegments.push(vertebraMesh);

      // Disc between vertebrae
      if (i < totalVertebrae - 1) {
        const discMesh = new THREE.Mesh(discGeo, discMaterial);
        discMesh.position.set(0, yPos + 0.1, zCurvature);
        discMesh.scale.set(
          0.95 + (totalVertebrae - i) * 0.03,
          1,
          0.95 + (totalVertebrae - i) * 0.03
        );
        spineGroup.add(discMesh);
      }

      // Posterior process / arch
      const archMesh = new THREE.Mesh(spinalCanalGeo, boneMaterial);
      archMesh.position.set(0, yPos, zCurvature - 0.22);
      archMesh.rotation.x = Math.PI / 2;
      archMesh.scale.set(0.6, 0.6, 0.6);
      spineGroup.add(archMesh);
    }

    // Rib cage ring cages around thoracic spine
    const ribMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    for (let r = 5; r <= 11; r++) {
      const y = (r - totalVertebrae / 2) * 0.22;
      const ribGeo = new THREE.TorusGeometry(0.85 + (r > 8 ? (11 - r) * 0.1 : (r - 5) * 0.12), 0.025, 8, 24, Math.PI * 1.6);
      const ribMesh = new THREE.Mesh(ribGeo, ribMaterial);
      ribMesh.position.set(0, y, 0.1);
      ribMesh.rotation.x = Math.PI / 2.3;
      ribMesh.rotation.z = -Math.PI * 0.8;
      spineGroup.add(ribMesh);
    }

    // Head / Cranium wireframe sphere at top
    const headGeo = new THREE.SphereGeometry(0.55, 16, 12);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(0, (totalVertebrae / 2) * 0.22 + 0.7, 0);
    spineGroup.add(headMesh);

    // Pelvic ring at bottom
    const pelvicGeo = new THREE.TorusGeometry(0.9, 0.08, 8, 16);
    const pelvicMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4
    });
    const pelvicMesh = new THREE.Mesh(pelvicGeo, pelvicMat);
    pelvicMesh.position.set(0, -(totalVertebrae / 2) * 0.22 - 0.2, 0);
    pelvicMesh.rotation.x = Math.PI / 2.2;
    spineGroup.add(pelvicMesh);

    // Dynamic glowing kinetic particle field around the spine
    const particlesCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleColors = new Float32Array(particlesCount * 3);

    for (let p = 0; p < particlesCount * 3; p += 3) {
      const radius = 0.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4.5;
      particlePositions[p] = Math.cos(theta) * radius;
      particlePositions[p + 1] = y;
      particlePositions[p + 2] = Math.sin(theta) * radius;

      particleColors[p] = 0.08; // R
      particleColors[p + 1] = 0.75 + Math.random() * 0.25; // G (teal)
      particleColors[p + 2] = 0.85 + Math.random() * 0.15; // B (cyan)
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse interaction for responsive rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      prevMouseX = clientX;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        spineGroup.rotation.y += deltaX * 0.008;
        prevMouseX = clientX;
      } else {
        const rect = currentMount.getBoundingClientRect();
        mouseX = ((clientX - rect.left) / width - 0.5) * 2;
        mouseY = ((clientY - rect.top) / height - 0.5) * 2;
        targetRotationY = mouseX * 0.4;
        targetRotationX = mouseY * 0.2;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    canvasElem.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Responsive resize
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle auto-rotation when not dragging
      if (!isDragging) {
        spineGroup.rotation.y += 0.005;
        spineGroup.rotation.y += (targetRotationY - spineGroup.rotation.y) * 0.05;
        spineGroup.rotation.x += (targetRotationX - spineGroup.rotation.x) * 0.05;
      }

      // Gentle floating sine wave breathing motion
      spineGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Rotate particle cloud gently in counter direction
      particles.rotation.y = -elapsedTime * 0.03;

      // Discs dynamic pulse glow
      const pulse = 0.3 + Math.sin(elapsedTime * 3) * 0.25;
      discMaterial.emissiveIntensity = pulse;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvasElem.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvasElem.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clinic Hero Info */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* 5.0 Star Badge + Landmark */}
            <div className="inline-flex flex-wrap items-center gap-2 p-1.5 pr-4 rounded-full bg-slate-900/90 border border-teal-500/30 text-xs shadow-lg">
              <span className="flex items-center gap-1 bg-amber-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                5.0 Google Rating
              </span>
              <span className="text-slate-300 font-medium">
                251 Verified Reviews
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-teal-400 font-medium hidden sm:flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Dasarahalli, Bengaluru
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Precision 3D Biomechanics &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400">
                  AI-Guided Physiotherapy
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Bengaluru’s highest-rated rehabilitation center. Located between 
                <strong className="text-white font-semibold"> Bharat Petrol Pump</strong> and 
                <strong className="text-white font-semibold"> Sangeetha Mobile Store</strong> on 7th Cross Road. 
                Experience non-surgical recovery for severe spine, joint, and sports conditions.
              </p>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">100% Non-Surgical</div>
                  <div className="text-[11px] text-slate-400">McKenzie & Maitland Protocols</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">12+ Yrs Experience</div>
                  <div className="text-[11px] text-slate-400">10,000+ Pain-Free Patients</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Gemini 3.5 Thinking AI</div>
                  <div className="text-[11px] text-slate-400">Instant Clinical Biomechanics</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onStartPainCheck}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>3D Body Pain Check</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTour}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>360° Clinic Photosphere</span>
              </button>

              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-teal-950/70 hover:bg-teal-900/80 border border-teal-500/40 text-teal-300 font-semibold text-sm transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Book Slot</span>
              </button>
            </div>

            {/* Quick landmark note */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>26, 7th Cross Rd, Dasarahalli, Jnana Ganga Nagar, Bengaluru 560056</span>
            </p>
          </div>

          {/* Right Column: Interactive 3D Spine & Kinetic Holo Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square max-w-[460px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-teal-500/30 shadow-2xl shadow-teal-950/50 p-2">
              
              {/* 3D Canvas Mount */}
              <div 
                ref={mountRef} 
                className="w-full h-full canvas-interactive rounded-2xl overflow-hidden"
              />

              {/* 3D Model HUD Overlays */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-950/80 backdrop-blur-md border border-teal-500/40 px-3 py-1.5 rounded-xl text-xs">
                  <span className="text-teal-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    3D Spinal Column
                  </span>
                  <p className="text-[10px] text-slate-400">Drag to rotate 360°</p>
                </div>

                <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl text-[11px] text-slate-300 flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Real-time Kinematics</span>
                </div>
              </div>

              {/* Interactive Zone Buttons at bottom of 3D frame */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveZone('Cervical Alignment')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                    activeZone === 'Cervical Alignment' 
                      ? 'bg-teal-500 text-slate-950 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Neck (C1-C7)
                </button>
                <button
                  onClick={() => setActiveZone('Thoracic Mobilization')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                    activeZone === 'Thoracic Mobilization' 
                      ? 'bg-teal-500 text-slate-950 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mid-Back
                </button>
                <button
                  onClick={() => setActiveZone('Lumbar Decompression')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                    activeZone === 'Lumbar Decompression' 
                      ? 'bg-teal-500 text-slate-950 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lumbar (L1-L5)
                </button>
              </div>
            </div>

            {/* Quick Micro Badge below 3D */}
            <div className="mt-3 text-center text-xs text-slate-400">
              <span className="text-teal-400 font-semibold">Active Biomechanics Mode:</span> {activeZone} • Touch or mouse to inspect articulation
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
