import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cameraPresets, PART_FOCUS, presetById } from "@/data/camera-presets";
import { useExplorer } from "@/store/explorer";
import { PhotoEngine } from "./PhotoEngine";
import { photoViews } from "./photo-views";
import { N20Assembly } from "./cgi/N20Assembly";
import { MODEL_FOCUS, MODEL_PRESETS } from "./model-cameras";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

type ControlsApi = {
  target: THREE.Vector3;
  update: () => void;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
};

function CameraDriver({ schematic }: { schematic: boolean }) {
  const { camera } = useThree();
  const controls = useThree((s) => s.controls) as ControlsApi | null;
  const preset = useExplorer((s) => s.cameraPreset);
  const nonce = useExplorer((s) => s.cameraNonce);
  const focusNonce = useExplorer((s) => s.focusNonce);
  const reduced = usePrefersReducedMotion();
  const from = useRef(new THREE.Vector3());
  const fromTarget = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());
  const t = useRef(1);
  const lastFocus = useRef(0);

  useEffect(() => {
    if (!controls) return;
    const selectedId = useExplorer.getState().selectedId;
    const usePart = focusNonce !== lastFocus.current && focusNonce > 0 && selectedId;
    lastFocus.current = focusNonce;

    let pos: [number, number, number];
    let target: [number, number, number];
    if (schematic) {
      const partCam = selectedId && usePart ? MODEL_FOCUS[selectedId] : undefined;
      const p = partCam ?? MODEL_PRESETS[preset] ?? MODEL_PRESETS.hero;
      pos = p.position;
      target = p.target;
    } else {
      const partCam = selectedId && usePart ? PART_FOCUS[selectedId] : undefined;
      const p = partCam ?? presetById[preset] ?? cameraPresets[0];
      pos = p.position;
      target = p.target;
    }

    from.current.copy(camera.position);
    fromTarget.current.copy(controls.target);
    toPos.current.set(...pos);
    toTarget.current.set(...target);
    t.current = reduced ? 1 : 0;
    if (reduced) {
      camera.position.copy(toPos.current);
      controls.target.copy(toTarget.current);
      controls.update();
    }
  }, [nonce, focusNonce, preset, camera, controls, reduced, schematic]);

  useFrame((_, delta) => {
    if (!controls || t.current >= 1) return;
    t.current = Math.min(1, t.current + Math.min(delta, 0.1) / 0.7);
    const k = 1 - (1 - t.current) ** 3;
    camera.position.lerpVectors(from.current, toPos.current, k);
    controls.target.lerpVectors(fromTarget.current, toTarget.current, k);
    camera.lookAt(controls.target);
    controls.update();
  });
  return null;
}

function PhotoScene({ photoId }: { photoId: "welt" | "bay" }) {
  const view = photoViews[photoId];
  const span = Math.max(view.width, view.height);
  const compare = useExplorer((s) => s.compareMode);
  return (
    <>
      <fog attach="fog" args={["#0b0c0e", span * 2.4, span * 5.5]} />
      <PhotoEngine photoId={photoId} />
      <OrbitControls
        makeDefault
        enableDamping
        enableRotate={!compare}
        enablePan={!compare}
        dampingFactor={0.12}
        minDistance={span * 0.34}
        maxDistance={span * 2.2}
        minPolarAngle={Math.PI * 0.42}
        maxPolarAngle={Math.PI * 0.58}
        minAzimuthAngle={-0.48}
        maxAzimuthAngle={0.48}
        target={[0, 0, 0]}
      />
      <CameraDriver schematic={false} />
    </>
  );
}

function ModelGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]} raycast={() => undefined}>
      <circleGeometry args={[1.8, 48]} />
      <meshBasicMaterial color="#101214" />
    </mesh>
  );
}

function ModelScene({ xray }: { xray: boolean }) {
  const start = MODEL_PRESETS.hero;
  return (
    <>
      <fog attach="fog" args={[xray ? "#07080a" : "#0b0c0e", 2.4, 8]} />
      <hemisphereLight args={xray ? ["#9aafc0", "#0c1014", 0.7] : ["#d0d4da", "#1a1c20", 0.9]} />
      <directionalLight position={[2.2, 3.2, 1.6]} intensity={xray ? 1.05 : 1.45} />
      <directionalLight position={[-2.4, 1.1, -1.2]} intensity={xray ? 0.7 : 0.42} />
      <directionalLight position={[0.2, 1.4, 2.4]} intensity={xray ? 0.45 : 0.55} />
      <ModelGround />
      <group>
        <N20Assembly />
      </group>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minDistance={0.32}
        maxDistance={3.4}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI * 0.86}
        target={start.target}
      />
      <CameraDriver schematic />
    </>
  );
}

export function EngineCanvas({ photoId = "welt" }: { photoId?: "welt" | "bay" }) {
  const [mobile, setMobile] = useState(false);
  const select = useExplorer((s) => s.select);
  const setWebgl = useExplorer((s) => s.setWebgl);
  const visualMode = useExplorer((s) => s.visualMode);
  const schematic = visualMode !== "photo";
  const photoStart = presetById[photoId === "bay" ? "bay" : "hero"] ?? cameraPresets[0];
  const modelStart = MODEL_PRESETS.hero;
  const start = schematic ? modelStart : { position: photoStart.position };

  useEffect(() => {
    useTexture.preload("/engine/photos/n20-welt.jpg");
    useTexture.preload("/engine/photos/f30-bay.jpg");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") ?? c.getContext("webgl");
      setWebgl(!!gl);
    } catch {
      setWebgl(false);
    }
  }, [setWebgl]);

  const dpr = useMemo<[number, number]>(() => (mobile ? [1, 1.25] : [1, 1.75]), [mobile]);

  return (
    <Canvas
      key={schematic ? "model" : "photo"}
      className="h-full w-full touch-none"
      dpr={dpr}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
        toneMapping: schematic ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ position: start.position, fov: schematic ? 36 : 32, near: 0.05, far: 24 }}
      frameloop="always"
      style={{ width: "100%", height: "100%", display: "block" }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={[visualMode === "xray" ? "#07080a" : "#0b0c0e"]} />
      <Suspense fallback={null}>
        {schematic ? <ModelScene xray={visualMode === "xray"} /> : <PhotoScene photoId={photoId} />}
      </Suspense>
    </Canvas>
  );
}
