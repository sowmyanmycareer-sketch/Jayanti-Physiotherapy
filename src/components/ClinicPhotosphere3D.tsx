import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CLINIC_INFO } from '../data/clinicData';
import { 
  Compass, 
  ExternalLink, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  MapPin, 
  Navigation,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

export const ClinicPhotosphere3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeLandmark, setActiveLandmark] = useState<string>('Clinic Entrance');
  const [tourSceneMode, setTourSceneMode] = useState<'streetview' | 'interior'>('streetview');
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Panorama URLs
  const streetviewPanoramaUrl = 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=rwqAi7HHrYPQ9ryV_Lpzqg&cb_client=search.gws-prod.gps&yaw=118.358406&pitch=0&thumbfov=100&w=2048&h=1024';

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Camera inside the sphere
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Inverted 360-degree panoramic sphere
    const sphereGeometry = new THREE.SphereGeometry(50, 60, 40);
    // Invert normals so texture is rendered on the inside
    sphereGeometry.scale(-1, 1, 1);

    // Texture Loader with fallback procedural canvas if network image is restricted by CORS
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    // Create a fallback stylized 360 gradient texture with streetview landmarks
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 2048;
    fallbackCanvas.height = 1024;
    const ctx = fallbackCanvas.getContext('2d')!;
    
    if (tourSceneMode === 'streetview') {
      // Procedural Bengaluru Dasarahalli Streetview Sky & Road
      const skyGradient = ctx.createLinearGradient(0, 0, 0, 1024);
      skyGradient.addColorStop(0, '#0284c7'); // Clear sky
      skyGradient.addColorStop(0.45, '#38bdf8');
      skyGradient.addColorStop(0.5, '#e2e8f0'); // Horizon
      skyGradient.addColorStop(0.55, '#334155'); // Buildings & street level
      skyGradient.addColorStop(1, '#0f172a'); // Road asphalt
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, 2048, 1024);

      // Draw stylized buildings & landmarks
      // Jayanti Physiotherapy Clinic Building
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(850, 420, 360, 280);
      ctx.fillStyle = '#14b8a6';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('JAYANTI PHYSIOTHERAPY CLINIC', 870, 480);
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px sans-serif';
      ctx.fillText('26, 7th Cross Rd, Dasarahalli', 910, 520);
      ctx.fillText('★ 5.0 Star Rated (251 Reviews)', 920, 560);

      // Bharat Petrol Pump Landmark
      ctx.fillStyle = '#f97316';
      ctx.fillRect(400, 460, 280, 240);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('BHARAT PETROL PUMP', 420, 520);

      // Sangeetha Mobile Store Landmark
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(1350, 460, 320, 240);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('SANGEETHA MOBILE STORE', 1370, 520);

      // Road markings
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 12;
      ctx.setLineDash([40, 40]);
      ctx.beginPath();
      ctx.moveTo(0, 850);
      ctx.lineTo(2048, 850);
      ctx.stroke();
    } else {
      // Clinic Treatment Interior Panorama
      const interiorGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      interiorGrad.addColorStop(0, '#042f2e'); // Clinic ceiling
      interiorGrad.addColorStop(0.5, '#0f766e'); // Treatment bays
      interiorGrad.addColorStop(1, '#020617'); // Anti-static hygienic flooring
      ctx.fillStyle = interiorGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('SPINAL DECOMPRESSION & REHABILITATION SUITE', 700, 380);
      ctx.font = '24px sans-serif';
      ctx.fillText('Electrotherapy • Laser Therapy • Matrix Rhythm • Manual Mobilization Beds', 600, 440);
    }

    const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);
    fallbackTexture.wrapS = THREE.RepeatWrapping;
    fallbackTexture.repeat.x = -1; // Align panoramic coordinates

    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: fallbackTexture
    });

    // Try loading actual streetview image
    if (tourSceneMode === 'streetview') {
      textureLoader.load(
        streetviewPanoramaUrl,
        (loadedTexture) => {
          sphereMaterial.map = loadedTexture;
          sphereMaterial.needsUpdate = true;
        },
        undefined,
        (err) => {
          // Gracefully retain high-res stylized procedural texture
          console.log('Streetview texture using local high-resolution canvas renderer');
        }
      );
    }

    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMesh);

    // Landmark 3D Hotspot Rings inside the sphere
    const hotspotsGroup = new THREE.Group();
    scene.add(hotspotsGroup);

    const landmarks = [
      { name: 'Jayanti Physiotherapy Clinic', pos: [0, 0, -45], color: 0x14b8a6 },
      { name: 'Bharat Petrol Pump', pos: [-35, -2, -25], color: 0xf97316 },
      { name: 'Sangeetha Mobile Store', pos: [35, -2, -25], color: 0x3b82f6 }
    ];

    landmarks.forEach(lm => {
      const ringGeo = new THREE.RingGeometry(1.2, 1.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: lm.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(lm.pos[0], lm.pos[1], lm.pos[2]);
      ring.lookAt(0, 0, 0);
      hotspotsGroup.add(ring);
    });

    // Spherical Drag Controls
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let lon = 90;
    let onPointerDownLon = 90;
    let lat = 0;
    let onPointerDownLat = 0;
    let phi = 0;
    let theta = 0;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      isUserInteracting = true;
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      onPointerDownPointerX = clientX;
      onPointerDownPointerY = clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      if (!isUserInteracting) return;
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      lon = (onPointerDownPointerX - clientX) * 0.15 + onPointerDownLon;
      lat = (clientY - onPointerDownPointerY) * 0.15 + onPointerDownLat;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
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

      if (!isUserInteracting && isAutoRotating) {
        lon += 0.08;
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
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
  }, [tourSceneMode, isAutoRotating]);

  // Zoom control
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const fov = cameraRef.current.fov + (direction === 'in' ? -10 : 10);
    cameraRef.current.fov = Math.max(35, Math.min(100, fov));
    cameraRef.current.updateProjectionMatrix();
  };

  return (
    <section id="clinic-tour" className="py-16 md:py-24 bg-slate-900/50 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            360° Virtual Clinic Tour & Google Photosphere
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Explore <span className="text-cyan-400">Jayanti Clinic</span> in 3D
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Take a 360-degree virtual tour around our clinic entrance between Bharat Petrol Pump 
            and Sangeetha Mobile Store on 7th Cross Road, Dasarahalli.
          </p>
        </div>

        {/* 3D Photosphere Viewer Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          
          {/* Top HUD Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-teal-950/80 border border-teal-500/40 text-teal-300 px-3 py-1 rounded-xl font-semibold">
                <Navigation className="w-3.5 h-3.5 text-teal-400" />
                {tourSceneMode === 'streetview' ? 'Clinic Exterior 360° Photosphere' : 'Treatment Suite 360° Interior'}
              </span>
              <span className="text-slate-400 hidden md:inline text-[11px]">
                Click & drag to look in any direction
              </span>
            </div>

            {/* Mode & Navigation Controls */}
            <div className="flex items-center gap-2">
              {/* Scene Switcher */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTourSceneMode('streetview')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    tourSceneMode === 'streetview' 
                      ? 'bg-teal-500 text-slate-950 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Exterior Street View
                </button>
                <button
                  onClick={() => setTourSceneMode('interior')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    tourSceneMode === 'interior' 
                      ? 'bg-teal-500 text-slate-950 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Treatment Rooms
                </button>
              </div>

              {/* Auto rotate toggle */}
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`p-2 rounded-xl border text-xs cursor-pointer ${
                  isAutoRotating 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
                title="Toggle Auto-Rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
              </button>

              {/* Zoom In / Out */}
              <button
                onClick={() => handleZoom('in')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WebGL Panoramic Canvas */}
          <div className="relative w-full h-[420px] sm:h-[500px] rounded-2xl overflow-hidden bg-black canvas-interactive">
            <div ref={mountRef} className="w-full h-full" />

            {/* Overlaid Compass HUD */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl text-xs space-y-1.5 pointer-events-none hidden sm:block">
              <div className="flex items-center gap-2 font-bold text-white">
                <Compass className="w-4 h-4 text-teal-400" />
                <span>360° Interactive Canvas</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pano ID: rwqAi7HHrYPQ9ryV_Lpzqg
              </p>
            </div>

            {/* Street View Landmark Tags along bottom of canvas */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex flex-wrap gap-2 pointer-events-auto">
                <span className="px-3 py-1.5 rounded-xl bg-teal-950/90 backdrop-blur-md border border-teal-500/50 text-teal-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  Clinic Entrance (Door 26)
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-orange-950/90 backdrop-blur-md border border-orange-500/40 text-orange-300 text-xs font-medium shadow-lg">
                  Adjacent: Bharat Petrol Pump
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-950/90 backdrop-blur-md border border-blue-500/40 text-blue-300 text-xs font-medium shadow-lg">
                  Neighbor: Sangeetha Mobile Store
                </span>
              </div>

              {/* Direct Open Google Streetview Photosphere Button */}
              <a
                href={CLINIC_INFO.googleStreetviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all shadow-xl cursor-pointer"
              >
                <span>Open in Google Photosphere</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </a>
            </div>
          </div>

          {/* Quick instructions & address footnote */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                26, 7th Cross Rd, Dasarahalli, Jnananjyothinagar, Muneshwaranagar, Jnana Ganga Nagar, Bengaluru 560056
              </span>
            </div>
            <a 
              href={CLINIC_INFO.googleMapsDirectionsUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center gap-1"
            >
              Get Turn-by-Turn Directions →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
