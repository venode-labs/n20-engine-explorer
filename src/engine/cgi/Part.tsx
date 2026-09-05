import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";
import { componentById } from "@/data/components";
import { useExplorer } from "@/store/explorer";

interface PartProps {
  id: string;
  children: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Part({ id, children, position = [0, 0, 0], rotation = [0, 0, 0] }: PartProps) {
  const ref = useRef<THREE.Group>(null);
  const selectedId = useExplorer((s) => s.selectedId);
  const hoveredId = useExplorer((s) => s.hoveredId);
  const visualMode = useExplorer((s) => s.visualMode);
  const mode = useExplorer((s) => s.materialMode);
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
  if (xray) opacity = selected ? 0.94 : 0.18;
  else if (mode === "context") opacity = selected ? 1 : 0.28;

  const emissive = selected ? "#8aa0b4" : hovered ? "#4a5560" : "#000000";
  const emissiveIntensity = selected ? (xray ? 0.7 : 0.45) : hovered ? 0.2 : 0;

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    g.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
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
      const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[];
      for (const m of mats) {
        m.transparent = opacity < 0.98;
        m.opacity = opacity;
        m.depthWrite = opacity > 0.7;
        m.side = xray ? THREE.DoubleSide : THREE.FrontSide;
        if (m.emissive) {
          m.emissive.set(emissive);
          m.emissiveIntensity = emissiveIntensity;
        }
        m.needsUpdate = true;
      }
    });
  }, [id, opacity, emissive, emissiveIntensity, xray]);

  return (
    <group
      ref={ref}
      visible={visible}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        hover(id);
      }}
      onPointerOut={() => hover(null)}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
    >
      {children}
    </group>
  );
}
