import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { componentById } from "@/data/components";
import { assertMeshIdentity } from "@/lib/mesh-identity";
import { EXPLODE } from "@/engine/explode";
import { useExplorer } from "@/store/explorer";

interface PartProps {
  id: string;
  children: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

type CadMesh = THREE.Mesh & {
  userData: THREE.Mesh["userData"] & {
    _clonedMat?: boolean;
    _cadEdges?: THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;
    partId?: string;
  };
};

export function Part({ id, children, position = [0, 0, 0], rotation = [0, 0, 0] }: PartProps) {
  const ref = useRef<THREE.Group>(null);
  const explodeAmt = useRef(0);
  const selectedId = useExplorer((s) => s.selectedId);
  const hoveredId = useExplorer((s) => s.hoveredId);
  const visualMode = useExplorer((s) => s.visualMode);
  const mode = useExplorer((s) => s.materialMode);
  const explode = useExplorer((s) => s.explode);
  const systemFilter = useExplorer((s) => s.systemFilter);
  const select = useExplorer((s) => s.select);
  const hover = useExplorer((s) => s.hover);

  const selected = selectedId === id;
  const hovered = hoveredId === id;
  const comp = componentById[id];
  const xray = visualMode === "xray";
  const hideCover = xray && (id === "engine-cover" || id === "vacuum-reservoir");
  const hideSystem = systemFilter !== "all" && comp != null && comp.system !== systemFilter;
  const hideIsolate = mode === "context" && selectedId != null && selectedId !== id;
  const visible = !hideCover && !hideSystem && !hideIsolate;
  useCursor(hovered && visible);

  let opacity = 1;
  if (xray) opacity = selected ? 0.94 : 0.2;
  else if (mode === "context") opacity = selected ? 1 : 0.24;

  const emissive = selected ? "#8fa8b8" : hovered ? "#536774" : "#000000";
  const emissiveIntensity = selected ? (xray ? 0.76 : 0.4) : hovered ? 0.16 : 0;
  const offset = EXPLODE[id] ?? [0, 0, 0];
  const explodeTarget = visualMode === "photo" ? 0 : explode;

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const k = 1 - Math.exp(-10 * Math.min(delta, 0.1));
    explodeAmt.current += (explodeTarget - explodeAmt.current) * k;
    const t = explodeAmt.current;
    g.position.set(position[0] + offset[0] * t, position[1] + offset[1] * t, position[2] + offset[2] * t);
  });

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    g.traverse((obj) => {
      const mesh = obj as CadMesh;
      if (!mesh.isMesh) return;
      const raw = mesh.material;
      const list = Array.isArray(raw) ? raw : [raw];
      const adjustable = list.every(
        (mat) => mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial,
      );
      if (!adjustable) return;

      if (!mesh.userData._clonedMat) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((m) => m.clone())
          : mesh.material.clone();
        mesh.userData._clonedMat = true;
        mesh.userData.partId = id;
      }

      if (!mesh.userData._cadEdges && mesh.geometry) {
        const edgeGeometry = new THREE.EdgesGeometry(mesh.geometry, 34);
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: "#55636d",
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
          toneMapped: false,
        });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edges.renderOrder = 2;
        edges.raycast = () => undefined;
        mesh.add(edges);
        mesh.userData._cadEdges = edges;
      }

      const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[];
      for (const material of mats) {
        material.transparent = opacity < 0.98;
        material.opacity = opacity;
        material.depthWrite = opacity > 0.7;
        material.side = xray ? THREE.DoubleSide : THREE.FrontSide;
        if (material.emissive) {
          material.emissive.set(emissive);
          material.emissiveIntensity = emissiveIntensity;
        }
        material.needsUpdate = true;
      }

      const edgeMaterial = mesh.userData._cadEdges?.material;
      if (edgeMaterial) {
        edgeMaterial.color.set(selected ? "#c1d2dc" : hovered ? "#8ca1ae" : xray ? "#6f8491" : "#55636d");
        edgeMaterial.opacity = selected ? 0.92 : hovered ? 0.66 : xray ? 0.24 : 0.34;
        edgeMaterial.needsUpdate = true;
      }
    });
  }, [id, opacity, emissive, emissiveIntensity, selected, hovered, xray]);

  useEffect(
    () => () => {
      const g = ref.current;
      if (!g) return;
      g.traverse((obj) => {
        const mesh = obj as CadMesh;
        const edges = mesh.userData?._cadEdges;
        if (!edges) return;
        edges.geometry.dispose();
        edges.material.dispose();
      });
    },
    [],
  );

  return (
    <group
      ref={ref}
      visible={visible}
      position={position}
      rotation={rotation}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (assertMeshIdentity(id).status === "unidentified") return;
        hover(id);
      }}
      onPointerOut={() => hover(null)}
      onClick={(event) => {
        event.stopPropagation();
        if (assertMeshIdentity(id).status === "unidentified") return;
        select(id);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        if (assertMeshIdentity(id).status === "unidentified") return;
        select(id);
      }}
    >
      {children}
    </group>
  );
}
