import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BODY_REGIONS } from '../data/clinicData';
import { BodyRegionInfo, BodyRegionId } from '../types';
import { 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface Anatomy3DViewerProps {
  onSelectRegionForAI: (regionId: BodyRegionId) => void;
  selectedRegionId?: BodyRegionId;
}

export const Anatomy3DViewer: React.FC<Anatomy3DViewerProps> = ({ 
  onSelectRegionForAI,
  selectedRegionId = 'lumbar-spine'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState<BodyRegionInfo>(
    BODY_REGIONS.find(r => r.id === selectedRegionId) || BODY_REGIONS[3]
  );
  const [isWireframe, setIsWireframe] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const hotspotMeshesRef = useRef<{ id: BodyRegionId; mesh: THREE.Mesh }[]>([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x14b8a6, 2.5);
    dirLight1.position.set(3, 4, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight2.position.set(-3, -2, -3);
    scene.add(dirLight2);

    // Main Human Body Biomechanical Model Group
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);
    bodyGroupRef.current = bodyGroup;

    // Materials
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.2,
      wireframe: isWireframe
    });

    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.2,
      metalness: 0.5,
      wireframe: isWireframe
    });

    // 1. Head / Skull
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), boneMaterial);
    head.position.set(0, 2.15, 0);
    bodyGroup.add(head);

    // 2. Cervical Spine
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.35, 12), jointMaterial);
    neck.position.set(0, 1.78, 0);
    bodyGroup.add(neck);

    // 3. Clavicles & Shoulder Girdle
    const clavicleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.9, 12), boneMaterial);
    clavicleBar.rotation.z = Math.PI / 2;
    clavicleBar.position.set(0, 1.55, 0);
    bodyGroup.add(clavicleBar);

    // 4. Thorax / Ribcage
    const thorax = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.48, 1.05, 16), boneMaterial);
    thorax.position.set(0, 1.05, 0);
    thorax.scale.set(1.1, 1, 0.7);
    bodyGroup.add(thorax);

    // 5. Lumbar Spine
    const lumbar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.75, 12), jointMaterial);
    lumbar.position.set(0, 0.25, -0.02);
    bodyGroup.add(lumbar);

    // 6. Pelvis / Hips
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.5, 0.45, 14), boneMaterial);
    pelvis.position.set(0, -0.28, 0);
    pelvis.scale.set(1.15, 1, 0.75);
    bodyGroup.add(pelvis);

    // 7. Left & Right Arms
    const createArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group();
      const xOffset = isLeft ? -0.95 : 0.95;

      // Shoulder joint ball
      const shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), jointMaterial);
      shoulderBall.position.set(xOffset, 1.5, 0);
      armGroup.add(shoulderBall);

      // Upper arm (Humerus)
      const humerus = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.75, 10), boneMaterial);
      humerus.position.set(xOffset, 1.05, 0);
      armGroup.add(humerus);

      // Elbow joint
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), jointMaterial);
      elbow.position.set(xOffset, 0.65, 0);
      armGroup.add(elbow);

      // Forearm (Radius/Ulna)
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.75, 10), boneMaterial);
      forearm.position.set(xOffset, 0.25, 0);
      armGroup.add(forearm);

      // Wrist / Hand
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.05), boneMaterial);
      hand.position.set(xOffset, -0.2, 0);
      armGroup.add(hand);

      return armGroup;
    };

    bodyGroup.add(createArm(true));
    bodyGroup.add(createArm(false));

    // 8. Left & Right Legs
    const createLeg = (isLeft: boolean) => {
      const legGroup = new THREE.Group();
      const xOffset = isLeft ? -0.42 : 0.42;

      // Hip joint ball
      const hipBall = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), jointMaterial);
      hipBall.position.set(xOffset, -0.38, 0);
      legGroup.add(hipBall);

      // Femur / Thigh
      const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 1.05, 12), boneMaterial);
      femur.position.set(xOffset, -0.95, 0);
      legGroup.add(femur);

      // Knee joint
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), jointMaterial);
      knee.position.set(xOffset, -1.5, 0.05);
      legGroup.add(knee);

      // Tibia / Lower leg
      const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 1.05, 12), boneMaterial);
      tibia.position.set(xOffset, -2.05, 0);
      legGroup.add(tibia);

      // Ankle joint & foot
      const ankle = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), jointMaterial);
      ankle.position.set(xOffset, -2.6, 0);
      legGroup.add(ankle);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.45), boneMaterial);
      foot.position.set(xOffset, -2.7, 0.15);
      legGroup.add(foot);

      return legGroup;
    };

    bodyGroup.add(createLeg(true));
    bodyGroup.add(createLeg(false));

    // 9. Interactive Hotspot Markers
    const hotspotMeshes: { id: BodyRegionId; mesh: THREE.Mesh }[] = [];
    const hotspotGroup = new THREE.Group();
    bodyGroup.add(hotspotGroup);

    BODY_REGIONS.forEach((region) => {
      const markerGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const isCurrentActive = region.id === activeRegion.id;
      const markerMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(region.color),
        emissive: new THREE.Color(region.color),
        emissiveIntensity: isCurrentActive ? 1.0 : 0.4,
        roughness: 0.1,
        metalness: 0.8
      });

      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.set(...region.position3D);
      markerMesh.userData = { regionId: region.id };
      hotspotGroup.add(markerMesh);

      // Add a halo ring around active hotspot
      const ringGeo = new THREE.RingGeometry(0.18, 0.24, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(region.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      markerMesh.add(ringMesh);

      hotspotMeshes.push({ id: region.id, mesh: markerMesh });
    });

    hotspotMeshesRef.current = hotspotMeshes;

    // Raycaster for clicking 3D hotspots
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        hotspotMeshes.map(h => h.mesh),
        true
      );

      if (intersects.length > 0) {
        let clickedMesh = intersects[0].object as THREE.Mesh;
        // If clicked on ring child, get parent
        if (!clickedMesh.userData.regionId && clickedMesh.parent) {
          clickedMesh = clickedMesh.parent as THREE.Mesh;
        }

        const regionId = clickedMesh.userData?.regionId as BodyRegionId;
        if (regionId) {
          const found = BODY_REGIONS.find(r => r.id === regionId);
          if (found) {
            setActiveRegion(found);
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Orbit Drag Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      bodyGroup.rotation.y += deltaX * 0.009;
      bodyGroup.rotation.x = Math.max(-0.4, Math.min(0.4, bodyGroup.rotation.x + deltaY * 0.005));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle continuous ambient rotation if not dragging
      if (!isDragging) {
        bodyGroup.rotation.y += 0.003;
      }

      // Hotspots pulsating animation
      hotspotMeshes.forEach((item) => {
        const isCurrent = item.id === activeRegion.id;
        const scale = isCurrent 
          ? 1 + Math.sin(elapsedTime * 4) * 0.25 
          : 0.9 + Math.sin(elapsedTime * 2) * 0.1;
        item.mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('click', handleCanvasClick);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isWireframe, activeRegion.id]);

  // Camera Zoom Controls
  const handleZoom = (inOut: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = inOut === 'in' ? -0.8 : 0.8;
    cameraRef.current.position.z = Math.max(3.2, Math.min(9.5, cameraRef.current.position.z + delta));
  };

  const handleReset = () => {
    if (!cameraRef.current || !bodyGroupRef.current) return;
    cameraRef.current.position.set(0, 0, 6.2);
    bodyGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <section id="3d-anatomy" className="py-16 md:py-24 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
            <Rotate3d className="w-3.5 h-3.5" />
            Interactive 3D Musculoskeletal Explorer
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Pinpoint Your Pain in <span className="text-teal-400">3D Real-Time</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Rotate the human anatomical model 360°, inspect specific joints and spinal segments, 
            and transfer your pain region directly to our Gemini AI Clinical Reasoning Engine.
          </p>
        </div>

        {/* 3D Body + Clinical Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 3D Interactive Canvas & HUD */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-4 relative shadow-2xl overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-teal-400 font-semibold bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-500/30">
                  <Activity className="w-3.5 h-3.5" />
                  {activeRegion.name} Selected
                </span>
                <span className="text-slate-400 hidden sm:inline text-[11px]">
                  • Click glowing nodes or drag to inspect
                </span>
              </div>

              {/* View control buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                    isWireframe 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Toggle Biomechanical Wireframe Mode"
                >
                  {isWireframe ? 'Solid View' : 'Wireframe'}
                </button>
                <button
                  onClick={() => handleZoom('in')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleZoom('out')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                  title="Reset View"
                  aria-label="Reset View"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D WebGL Canvas */}
            <div 
              ref={mountRef} 
              className="w-full h-[460px] sm:h-[520px] rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 canvas-interactive overflow-hidden"
            />

            {/* Region quick picker buttons along the bottom */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400 mb-2 font-medium">Quick Select Region:</div>
              <div className="flex flex-wrap gap-1.5">
                {BODY_REGIONS.map((region) => {
                  const isSelected = region.id === activeRegion.id;
                  return (
                    <button
                      key={region.id}
                      onClick={() => setActiveRegion(region)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/20' 
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {region.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Selected Anatomical Region Details & AI Action */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Region Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none" 
                style={{ backgroundColor: activeRegion.color }}
              />

              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="w-3 h-3 rounded-full animate-pulse" 
                  style={{ backgroundColor: activeRegion.color }}
                />
                <span className="text-xs uppercase tracking-wider font-bold text-teal-400">
                  {activeRegion.tagline}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {activeRegion.name}
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Clinical biomechanical overview and common pathologies treated at Jayanti Physiotherapy Clinic.
              </p>

              {/* Common Conditions List */}
              <div className="space-y-3 mb-5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Common Conditions Diagnosed:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {activeRegion.commonConditions.map((cond, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typical Symptoms */}
              <div className="space-y-2 mb-5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Hallmark Symptoms:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeRegion.symptoms.map((sym, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* In-Clinic Treatment Modalities */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Jayanti Clinic Protocol:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeRegion.recommendedTreatments.map((t, idx) => (
                    <span 
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-950/70 border border-teal-500/30 text-teal-300 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action: Send to Gemini Thinking AI */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectRegionForAI(activeRegion.id)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze {activeRegion.name.split(' ')[0]} in AI Recovery Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Uses Gemini 3.5 Thinking Model with deep kinetic chain reasoning
                </p>
              </div>

            </div>

            {/* In-person evaluation banner */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-cyan-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <strong className="text-white">Expert Clinical Tip:</strong> For persistent symptoms lasting &gt;2 weeks, 
                an in-person biomechanical assessment at our Dasarahalli clinic will identify postural compensation before permanent joint changes occur.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
