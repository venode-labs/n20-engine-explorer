import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useTexture } from "@react-three/drei";
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
  const explode = useExplorer((s) => s.explode);
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
      target = p.target;

      const basePosition = new THREE.Vector3(...p.position);
      const baseTarget = new THREE.Vector3(...p.target);
      const explodeFrameScale = 1 + explode * 0.85;
      const framedPosition = basePosition.sub(baseTarget).multiplyScalar(explodeFrameScale).add(baseTarget);
      pos = [framedPosition.x, framedPosition.y, framedPosition.z];
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
  }, [nonce, focusNonce, preset, explode, camera, controls, reduced, schematic]);

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
        minDistance={span * 0.28}
        maxDistance={span * 1.30}
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

function makeStudioEnv(gl: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(gl);
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight("#dce5ec", "#15181d", 1.05));
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ color: "#dfe4e7" }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = 3.2;
  sc.add(ceil);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.MeshBasicMaterial({ color: "#aeb9c2" }));
  wall.position.z = -4;
  sc.add(wall);
  const warm = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.MeshBasicMaterial({ color: "#b5aa9e" }));
  warm.rotation.y = -Math.PI / 2;
  warm.position.x = 4;
  sc.add(warm);
  const cool = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.MeshBasicMaterial({ color: "#9faeb9" }));
  cool.rotation.y = Math.PI / 2;
  cool.position.x = -4;
  sc.add(cool);
  const tex = pmrem.fromScene(sc, 0.06).texture;
  sc.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else mat?.dispose();
  });
  return { tex, pmrem };
}

function StudioEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    let tex: THREE.Texture | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    try {
      const env = makeStudioEnv(gl);
      tex = env.tex;
      pmrem = env.pmrem;
      scene.environment = tex;
      scene.environmentIntensity = 0.92;
    } catch {
      scene.environment = null;
    }
    return () => {
      scene.environment = null;
      tex?.dispose();
      pmrem?.dispose();
    };
  }, [gl, scene]);
  return null;
}

function ModelGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]} raycast={() => undefined}>
        <circleGeometry args={[2.25, 64]} />
        <meshStandardMaterial color="#0d1014" metalness={0} roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.278, 0]} raycast={() => undefined}>
        <ringGeometry args={[0.62, 0.628, 96]} />
        <meshBasicMaterial color="#34414b" transparent opacity={0.72} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.277, 0]} raycast={() => undefined}>
        <ringGeometry args={[1.18, 1.184, 96]} />
        <meshBasicMaterial color="#242c33" transparent opacity={0.58} />
      </mesh>
    </group>
  );
}

function ModelScene({ xray }: { xray: boolean }) {
  const start = MODEL_PRESETS.hero;
  return (
    <>
      <fog attach="fog" args={[xray ? "#090b0e" : "#0b0d11", 6.5, 15]} />
      <StudioEnv />
      <ambientLight intensity={xray ? 0.72 : 0.82} />
      <hemisphereLight args={xray ? ["#b7c7d2", "#11151a", 1.05] : ["#d9e0e4", "#171b20", 1.18]} />
      <directionalLight position={[2.6, 4.2, 2.4]} intensity={xray ? 1.8 : 2.35} />
      <directionalLight position={[-2.4, 2.2, 1.2]} intensity={xray ? 1.05 : 1.25} />
      <directionalLight position={[0.2, 2.4, 3.2]} intensity={xray ? 0.55 : 0.85} />
      <directionalLight position={[1.2, 1.2, -2.4]} intensity={0.42} />
      <ModelGround />
      <group>
        <N20Assembly />
      </group>
      {!xray ? (
        <ContactShadows
          position={[0, -0.272, 0]}
          opacity={0.34}
          scale={2.8}
          blur={2.8}
          far={1.25}
          resolution={256}
          frames={1}
        />
      ) : null}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minDistance={0.32}
        maxDistance={4.6}
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

  const dpr = useMemo<[number, number]>(() => (mobile ? [1, 1.2] : [1, 1.5]), [mobile]);

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
      <color attach="background" args={[visualMode === "xray" ? "#090b0e" : schematic ? "#0b0d11" : "#0b0c0e"]} />
      <Suspense fallback={null}>
        {schematic ? <ModelScene xray={visualMode === "xray"} /> : <PhotoScene photoId={photoId} />}
      </Suspense>
    </Canvas>
  );
}
