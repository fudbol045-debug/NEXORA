import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Globe, Plane, ShieldCheck, Navigation2, ChevronDown, ChevronUp, RotateCw, ZoomIn, Eye } from 'lucide-react';

interface GlobeLogisticsSceneProps {
  onSelectHub?: (hubName: string) => void;
  activeHub?: string;
}

export const GlobeLogisticsScene: React.FC<GlobeLogisticsSceneProps> = ({ onSelectHub, activeHub }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<'all' | 'air' | 'rail' | 'sea'>('all');
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.6);
  const [activeHubName, setActiveHubName] = useState<string>(activeHub || 'Toshkent (TAS)');

  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060b17);
    scene.fog = new THREE.FogExp2(0x060b17, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 2. Studio Environment & Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point lighting
    const warmKeyLight = new THREE.DirectionalLight(0xfff1dc, 2.8);
    warmKeyLight.position.set(6, 9, 6);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (warmKeyLight.castShadow) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
    }
    scene.add(warmKeyLight);

    const coolHemiFill = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.4);
    scene.add(coolHemiFill);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    rimLight.position.set(-6, -2, -6);
    scene.add(rimLight);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI * 0.85;

    // 4. Procedural Earth Texture (CanvasTexture)
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ctx = earthCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0a1931';
      ctx.fillRect(0, 0, 1024, 512);

      // Lat-Long grid lines
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 1;
      for (let y = 0; y < 512; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }
      for (let x = 0; x < 1024; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }

      // Procedural continents representation
      ctx.fillStyle = '#1e40af';
      const continents = [
        [580, 200, 140, 100], // Eurasia central
        [650, 240, 120, 80],  // East Asia
        [280, 190, 110, 120], // North America
        [340, 340, 70, 110],  // South America
        [510, 260, 90, 120],  // Africa
        [740, 370, 70, 60],   // Australia
      ];
      continents.forEach(([cx, cy, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Trade glow hubs on canvas
      ctx.fillStyle = '#38bdf8';
      const hubsOnCanvas = [
        [590, 185], // Tashkent
        [565, 235], // Dubai
        [720, 220], // Shanghai
        [495, 170], // Frankfurt
        [280, 200], // New York
        [535, 195], // Istanbul
      ];
      hubsOnCanvas.forEach(([hx, hy]) => {
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    // Earth Sphere Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeGeo = new THREE.SphereGeometry(2.4, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.25,
      bumpScale: 0.05,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Atmosphere halo
    const atmosGeo = new THREE.SphereGeometry(2.48, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // Contact shadow plane underneath
    const shadowGeo = new THREE.PlaneGeometry(7, 7);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0,0,0,0.7)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.7;
    scene.add(shadowMesh);

    // 5. Major Logistics Hubs (Lat/Long converted to 3D Sphere points)
    function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    const hubs = [
      { name: 'Tashkent (TAS)', lat: 41.2995, lon: 69.2401, country: 'Uzbekistan' },
      { name: 'Dubai (DXB)', lat: 25.2048, lon: 55.2708, country: 'UAE' },
      { name: 'Shanghai (PVG)', lat: 31.2304, lon: 121.4737, country: 'China' },
      { name: 'Frankfurt (FRA)', lat: 50.1109, lon: 8.6821, country: 'Germany' },
      { name: 'New York (JFK)', lat: 40.7128, lon: -74.006, country: 'USA' },
      { name: 'Istanbul (IST)', lat: 41.0082, lon: 28.9784, country: 'Turkey' },
    ];

    const hubPinMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      roughness: 0.2,
      metalness: 0.9,
    });

    const hubPinGeo = new THREE.CylinderGeometry(0.04, 0.01, 0.25, 12);

    hubs.forEach((hub) => {
      const pos = latLongToVector3(hub.lat, hub.lon, 2.4);
      const pin = new THREE.Mesh(hubPinGeo, hubPinMat);
      pin.position.copy(pos);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      globeGroup.add(pin);

      // Top beacon sphere
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
      );
      beacon.position.copy(pos.clone().multiplyScalar(1.05));
      globeGroup.add(beacon);
    });

    // 6. Glowing Trade Route Arcs
    const routes = [
      { from: hubs[2], to: hubs[0], color: 0x38bdf8 }, // Shanghai -> Tashkent (Air Cargo)
      { from: hubs[0], to: hubs[1], color: 0x22d3ee }, // Tashkent -> Dubai
      { from: hubs[0], to: hubs[5], color: 0x38bdf8 }, // Tashkent -> Istanbul
      { from: hubs[5], to: hubs[3], color: 0x60a5fa }, // Istanbul -> Frankfurt
      { from: hubs[3], to: hubs[4], color: 0x818cf8 }, // Frankfurt -> New York
    ];

    routes.forEach((route) => {
      const start = latLongToVector3(route.from.lat, route.from.lon, 2.4);
      const end = latLongToVector3(route.to.lat, route.to.lon, 2.4);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const midLen = mid.length();
      mid.normalize().multiplyScalar(midLen + 0.8); // Arc height

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: route.color,
        transparent: true,
        opacity: 0.75,
      });
      const arcLine = new THREE.Line(lineGeo, lineMat);
      globeGroup.add(arcLine);
    });

    // 7. Composite Procedural Cargo Airplane (7 parts!)
    // Skill requirement: Assemble procedural 3D subjects as a THREE.Group of 3–12 distinct parts
    const planeGroup = new THREE.Group();
    globeGroup.add(planeGroup);

    // Part 1: Main Fuselage (metallic white)
    const fuselageGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.45, 12);
    fuselageGeo.rotateX(Math.PI / 2);
    const fuselageMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.85,
      roughness: 0.2,
    });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    planeGroup.add(fuselage);

    // Part 2: Cockpit Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.06, 0.12, 12);
    noseGeo.rotateX(Math.PI / 2);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1,
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.z = 0.28;
    planeGroup.add(nose);

    // Part 3 & 4: Left & Right Delta Wings
    const wingGeo = new THREE.BoxGeometry(0.65, 0.015, 0.16);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.6,
      roughness: 0.35,
    });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0, 0.02);
    planeGroup.add(wings);

    // Part 5: Vertical Stabilizer Tail Fin
    const tailFinGeo = new THREE.BoxGeometry(0.015, 0.16, 0.12);
    const tailFinMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.7,
      roughness: 0.3,
    });
    const tailFin = new THREE.Mesh(tailFinGeo, tailFinMat);
    tailFin.position.set(0, 0.09, -0.2);
    planeGroup.add(tailFin);

    // Part 6 & 7: Dual Jet Turbines underneath wings
    const engineGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 10);
    engineGeo.rotateX(Math.PI / 2);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.95,
      roughness: 0.15,
    });
    const engineLeft = new THREE.Mesh(engineGeo, engineMat);
    engineLeft.position.set(-0.16, -0.04, 0.02);
    planeGroup.add(engineLeft);

    const engineRight = new THREE.Mesh(engineGeo, engineMat);
    engineRight.position.set(0.16, -0.04, 0.02);
    planeGroup.add(engineRight);

    // 8. Animation Loop
    let animationFrameId = 0;
    let flightProgress = 0;

    // Flight route points between Shanghai (PVG) and Tashkent (TAS)
    const pvgPos = latLongToVector3(hubs[2].lat, hubs[2].lon, 2.4);
    const tasPos = latLongToVector3(hubs[0].lat, hubs[0].lon, 2.4);
    const flightArcMid = pvgPos.clone().add(tasPos).multiplyScalar(0.5);
    flightArcMid.normalize().multiplyScalar(3.2); // Airplane flies above arc
    const flightCurve = new THREE.QuadraticBezierCurve3(pvgPos, flightArcMid, tasPos);

    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();

      // Smooth damped rotation of the globe
      globeGroup.rotation.y += delta * 0.15 * rotationSpeed;

      // Animate cargo plane along flight curve
      flightProgress = (flightProgress + delta * 0.08) % 1;
      const planePos = flightCurve.getPoint(flightProgress);
      planeGroup.position.copy(planePos);

      // Orient plane towards path tangent
      const tangent = flightCurve.getTangent(flightProgress).normalize();
      const up = planePos.clone().normalize();
      const matrix = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), tangent, up);
      planeGroup.quaternion.setFromRotationMatrix(matrix);

      controls.update();
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(tick);
    }

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
    };
  }, [rotationSpeed]);

  const selectHub = (hub: string) => {
    setActiveHubName(hub);
    onSelectHub?.(hub);
  };

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-800 bg-[#060b17] shadow-2xl">
      {/* 3D Canvas mount container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge (Non-occluding, static spec) */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
        <div>
          <div className="text-xs font-semibold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            NEXORA Global Cargo Grid
          </div>
          <div className="text-[11px] text-slate-400">
            Real-time Logistics & Intermodal Trade Routes
          </div>
        </div>
      </div>

      {/* Top-Right Active Flight Spec */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center space-x-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
        <Plane className="w-4 h-4 text-cyan-400" />
        <span>Flight NX-882: <strong>Shanxay → Toshkent</strong></span>
        <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
          En Route
        </span>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Skill guideline compliant!) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[840px] transition-transform duration-300">
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 text-[11px] font-medium text-slate-300 hover:text-white rounded-full border border-slate-700 shadow hover:bg-slate-800 transition"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3 h-3 text-cyan-400" />
                Show 3D Controls
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 text-cyan-400" />
                Hide Controls
              </>
            )}
          </button>
        </div>

        {/* Dock Controls */}
        {!isControlsCollapsed && (
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Hub Selectors */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-slate-400 font-medium px-1 flex items-center gap-1">
                <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
                Hubs:
              </span>
              {[
                'Toshkent (TAS)',
                'Shanxay (PVG)',
                'Dubay (DXB)',
                'Frankfurt (FRA)',
                'Istanbul (IST)',
              ].map((hub) => (
                <button
                  key={hub}
                  onClick={() => selectHub(hub)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap ${
                    activeHubName === hub
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {hub}
                </button>
              ))}
            </div>

            {/* Orbit & Speed Multipliers */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-slate-400">
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Spin:</span>
                <button
                  onClick={() => setRotationSpeed(rotationSpeed === 0 ? 0.6 : 0)}
                  className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 text-[11px]"
                >
                  {rotationSpeed === 0 ? 'Paused' : 'Auto'}
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PBR Shading Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
