import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FlowMode } from "@/store/explorer";

const PATHS: Record<Exclude<FlowMode, "none">, THREE.Vector3[]> = {
  intake: [
    new THREE.Vector3(0.32, 0.18, 0.22),
    new THREE.Vector3(-0.18, 0.17, 0.06),
    new THREE.Vector3(-0.2, 0.12, 0.04),
    new THREE.Vector3(-0.18, 0.08, 0.18),
    new THREE.Vector3(0.05, -0.04, 0.3),
    new THREE.Vector3(0.16, 0.18, -0.2),
    new THREE.Vector3(0.12, 0.18, 0),
    new THREE.Vector3(0.08, 0.18, 0.05),
  ],
  exhaust: [
    new THREE.Vector3(0.0, 0.18, 0.15),
    new THREE.Vector3(-0.14, 0.16, 0.1),
    new THREE.Vector3(-0.2, 0.1, -0.02),
    new THREE.Vector3(-0.24, 0.02, -0.08),
    new THREE.Vector3(-0.24, -0.08, -0.16),
  ],
  fuel: [
    new THREE.Vector3(0.02, 0.34, -0.22),
    new THREE.Vector3(0.08, 0.35, -0.1),
    new THREE.Vector3(0.1, 0.32, 0.0),
    new THREE.Vector3(0.1, 0.3, 0.05),
    new THREE.Vector3(0.1, 0.3, 0.15),
  ],
};

export function Flow({ mode }: { mode: FlowMode }) {
  const count = 18;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const curve = useMemo(() => {
    if (mode === "none") return null;
    return new THREE.CatmullRomCurve3(PATHS[mode], false, "catmullrom", 0.35);
  }, [mode]);

  useFrame((state) => {
    if (!mesh.current || !curve) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const u = (t * 0.12 + i / count) % 1;
      const p = curve.getPointAt(u);
      dummy.position.copy(p);
      const s = 0.55 + Math.sin(u * Math.PI) * 0.45;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (mode === "none" || !curve) return null;

  const color = mode === "exhaust" ? "#c4a070" : mode === "fuel" ? "#8aa0b4" : "#d8d4cc";

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.012, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  );
}
