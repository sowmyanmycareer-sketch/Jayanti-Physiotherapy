import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Rotate3d, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Layers,
  ArrowUpDown,
  Move
} from 'lucide-react';

export const SpineRangeOfMotion3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [flexionAngle, setFlexionAngle] = useState<number>(0); // -30 to 50
  const [lateralAngle, setLateralAngle] = useState<number>(0); // -30 to 30
  const [rotationAngle, setRotationAngle] = useState<number>(0); // -40 to 40
  const [activePreset, setActivePreset] = useState<string>('Neutral Alignment');

  const spineMeshArrayRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x14b8a6, 2.5);
    dirLight1.position.set(3, 4, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 2);
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    // Base root group for spine
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Materials
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.2
    });

    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0x0f766e,
      emissiveIntensity: 0.3
    });

    const spinalSpurMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.5
    });

    // Construct 12 hierarchical vertebrae chained together for true progressive biomechanical bending
    const vertebraCount = 12;
    const vertebraGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.14, 16);
    const discGeo = new THREE.CylinderGeometry(0.3, 0.32, 0.08, 16);
    const processGeo = new THREE.ConeGeometry(0.12, 0.3, 8);

    const joints: THREE.Group[] = [];
    let parentGroup: THREE.Group = rootGroup;
    parentGroup.position.set(0, -1.2, 0);

    for (let i = 0; i < vertebraCount; i++) {
      const jointGroup = new THREE.Group();
      jointGroup.position.set(0, i === 0 ? 0 : 0.22, 0);

      // Vertebra body
      const vMesh = new THREE.Mesh(vertebraGeo, boneMat);
      jointGroup.add(vMesh);

      // Posterior Spinous Process
      const pMesh = new THREE.Mesh(processGeo, spinalSpurMat);
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.set(0, 0, -0.32);
      jointGroup.add(pMesh);

      // Disc (on top of vertebra)
      if (i < vertebraCount - 1) {
        const dMesh = new THREE.Mesh(discGeo, discMat);
        dMesh.position.set(0, 0.11, 0);
        jointGroup.add(dMesh);
      }

      parentGroup.add(jointGroup);
      joints.push(jointGroup);
      parentGroup = jointGroup;
    }

    // Interactive Drag to Rotate Canvas
    let isDragging = false;
    let prevX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevX;
      rootGroup.rotation.y += deltaX * 0.01;
      prevX = clientX;
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

    // Render loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Calculate incremental rotation per segment
      const flexRadPerJoint = (THREE.MathUtils.degToRad(flexionAngle) / vertebraCount);
      const latRadPerJoint = (THREE.MathUtils.degToRad(lateralAngle) / vertebraCount);
      const rotRadPerJoint = (THREE.MathUtils.degToRad(rotationAngle) / vertebraCount);

      // Apply kinematics up the chain
      joints.forEach((joint, idx) => {
        if (idx > 0) {
          joint.rotation.x = flexRadPerJoint;
          joint.rotation.z = -latRadPerJoint;
          joint.rotation.y = rotRadPerJoint;
        }
      });

      // Disc color shifts from teal to red if excessive strain is reached
      const totalStrain = Math.abs(flexionAngle) + Math.abs(lateralAngle) + Math.abs(rotationAngle);
      if (totalStrain > 75) {
        discMat.color.setHex(0xef4444); // Red strain warning
        discMat.emissive.setHex(0xb91c1c);
      } else if (totalStrain > 45) {
        discMat.color.setHex(0xf59e0b); // Amber caution
        discMat.emissive.setHex(0xb45309);
      } else {
        discMat.color.setHex(0x0d9488); // Healthy teal
        discMat.emissive.setHex(0x0f766e);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
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
  }, [flexionAngle, lateralAngle, rotationAngle]);

  // Preset posture applicator
  const applyPreset = (presetName: string, flex: number, lat: number, rot: number) => {
    setActivePreset(presetName);
    setFlexionAngle(flex);
    setLateralAngle(lat);
    setRotationAngle(rot);
  };

  // Disc pressure calculation index
  const basePressure = 100;
  const calculatedDiscPressure = Math.round(
    basePressure + 
    (flexionAngle > 0 ? flexionAngle * 2.2 : flexionAngle * -0.8) + 
    Math.abs(lateralAngle) * 1.2 + 
    Math.abs(rotationAngle) * 1.5
  );

  return (
    <section id="spine-rom" className="py-16 md:py-24 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            3D Spine Biomechanics Simulator
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Interactive <span className="text-emerald-400">Spine Range of Motion</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Experiment with spinal kinematics in real-time 3D. Witness how everyday postures affect 
            intervertebral disc pressure, nerve exit pathways, and musculoskeletal strain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3D Spine Simulator Mount */}
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            
            {/* Top HUD */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
              <span className="text-teal-400 font-bold flex items-center gap-1.5">
                <Rotate3d className="w-4 h-4" />
                Kinematic Vertebral Column
              </span>
              <span className="text-slate-400 text-[11px]">
                Drag on canvas to inspect posterior view
              </span>
            </div>

            {/* 3D Canvas */}
            <div 
              ref={mountRef} 
              className="w-full h-[400px] sm:h-[460px] rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 canvas-interactive overflow-hidden relative"
            />

            {/* Live Biomechanical Telemetry Overlay */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400">Intra-Discal Load</div>
                <div className={`font-bold text-base ${
                  calculatedDiscPressure > 175 ? 'text-rose-400' : calculatedDiscPressure > 130 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {calculatedDiscPressure}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400">Foraminal Space</div>
                <div className="font-bold text-base text-cyan-400">
                  {Math.abs(lateralAngle) > 20 || flexionAngle > 35 ? 'Compromised' : 'Optimal'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400">Clinical Safety</div>
                <div className={`font-bold text-base ${
                  calculatedDiscPressure > 175 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {calculatedDiscPressure > 175 ? 'Excessive Shear' : 'Physiological'}
                </div>
              </div>
            </div>

          </div>

          {/* Right: Motion Controls & Posture Presets */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Presets */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Select Clinical Posture Preset:
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyPreset('Neutral Alignment', 0, 0, 0)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    activePreset === 'Neutral Alignment' 
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold">Neutral Stand</div>
                  <div className="text-[11px] text-slate-400">100% baseline pressure</div>
                </button>

                <button
                  onClick={() => applyPreset('Slumped Desk Posture', 38, 0, 10)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    activePreset === 'Slumped Desk Posture' 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold">Slumped IT Desk</div>
                  <div className="text-[11px] text-rose-400">High disc bulge risk</div>
                </button>

                <button
                  onClick={() => applyPreset('McKenzie Extension', -22, 0, 0)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    activePreset === 'McKenzie Extension' 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold">McKenzie Extension</div>
                  <div className="text-[11px] text-cyan-400">Decompresses nerves</div>
                </button>

                <button
                  onClick={() => applyPreset('Asymmetric Carrying', 15, 24, 18)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    activePreset === 'Asymmetric Carrying' 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold">Heavy Bag Lift</div>
                  <div className="text-[11px] text-amber-400">Lateral shear strain</div>
                </button>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                Fine-Tune Motion Vectors:
              </h3>

              {/* Flexion / Extension */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Flexion / Extension:</span>
                  <span className="font-mono text-teal-400 font-bold">{flexionAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="55"
                  value={flexionAngle}
                  onChange={(e) => {
                    setFlexionAngle(Number(e.target.value));
                    setActivePreset('Custom Vector');
                  }}
                  className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>-30° (Backward Extension)</span>
                  <span>0° (Neutral)</span>
                  <span>+55° (Forward Bend)</span>
                </div>
              </div>

              {/* Lateral Bending */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Lateral Side-Bending:</span>
                  <span className="font-mono text-cyan-400 font-bold">{lateralAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={lateralAngle}
                  onChange={(e) => {
                    setLateralAngle(Number(e.target.value));
                    setActivePreset('Custom Vector');
                  }}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>-30° (Left Bend)</span>
                  <span>0°</span>
                  <span>+30° (Right Bend)</span>
                </div>
              </div>

              {/* Axial Rotation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Axial Twist / Rotation:</span>
                  <span className="font-mono text-purple-400 font-bold">{rotationAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={rotationAngle}
                  onChange={(e) => {
                    setRotationAngle(Number(e.target.value));
                    setActivePreset('Custom Vector');
                  }}
                  className="w-full accent-purple-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>-40° (Left Twist)</span>
                  <span>0°</span>
                  <span>+40° (Right Twist)</span>
                </div>
              </div>

            </div>

            {/* Clinical Decompression Note */}
            <div className="p-4 rounded-2xl bg-teal-950/50 border border-teal-500/30 text-xs text-slate-300 flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-300">Jayanti Decompression Therapy:</strong> When spinal discs endure chronic flexion &gt;30° during desk work, 
                our specialized lumbar motorized traction gently creates negative intra-discal vacuum, drawing herniated jelly back into the disc annulus.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
