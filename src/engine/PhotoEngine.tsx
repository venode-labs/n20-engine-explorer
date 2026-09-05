import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useCursor, Line, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { componentById } from "@/data/components";
import { assertMeshIdentity } from "@/lib/mesh-identity";
import { useExplorer } from "@/store/explorer";
import { photoViews, uvRectToLocal, type PhotoHit, type PhotoView } from "./photo-views";

const _colorSelected = new THREE.Color("#d7e1ea");
const _colorHover = new THREE.Color("#9aadb8");

function hitGeometry(hit: PhotoHit, view: PhotoView) {
  const local = uvRectToLocal(hit.rect, view.width, view.height);
  const geo = new THREE.PlaneGeometry(local.w, local.h);
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const { u0, v0, u1, v1 } = hit.rect;
  // PlaneGeometry r185: 0 top-left, 1 top-right, 2 bottom-left, 3 bottom-right.
  // flipY textures: image top → uv.y = 1. Our rect origin is top-left.
  uv.setXY(0, u0, 1 - v0);
  uv.setXY(1, u1, 1 - v0);
  uv.setXY(2, u0, 1 - v1);
  uv.setXY(3, u1, 1 - v1);
  uv.needsUpdate = true;
  return { geo, local };
}

function roundedRect(w: number, h: number, r: number, z: number): [number, number, number][] {
  const hx = w / 2;
  const hy = h / 2;
  const rad = Math.min(r, hx * 0.35, hy * 0.35);
  const pts: [number, number, number][] = [];
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 4; i++) {
      const a = a0 + (i / 4) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z]);
    }
  };
  corner(hx - rad, hy - rad, 0);
  corner(-hx + rad, hy - rad, Math.PI / 2);
  corner(-hx + rad, -hy + rad, Math.PI);
  corner(hx - rad, -hy + rad, (Math.PI * 3) / 2);
  pts.push(pts[0]);
  return pts;
}

function ReliefHit({ view, hit, map }: { view: PhotoView; hit: PhotoHit; map: THREE.Texture }) {
  const selectedId = useExplorer((s) => s.selectedId);
  const hoveredId = useExplorer((s) => s.hoveredId);
  const select = useExplorer((s) => s.select);
  const hover = useExplorer((s) => s.hover);
  const selected = selectedId === hit.id;
  const hovered = hoveredId === hit.id;
  useCursor(hovered);

  const { geo, local } = useMemo(() => hitGeometry(hit, view), [hit, view]);
  useLayoutEffect(() => () => geo.dispose(), [geo]);

  const depth = hit.depth ?? 1;
  const layer = hit.layer ?? 0;
  const zBase = 0.008 + layer * 0.022 + depth * 0.005;
  const group = useRef<THREE.Group>(null);
  const zCur = useRef(0.004);

  const outline = useMemo(() => roundedRect(local.w, local.h, 0.018, 0.004), [local.w, local.h]);
  const show = selected || hovered;

  useFrame((_, delta) => {
    const target = show ? zBase + (selected ? 0.032 : 0.014) : 0.004;
    const k = 1 - Math.exp(-12 * Math.min(delta, 0.1));
    zCur.current += (target - zCur.current) * k;
    if (group.current) group.current.position.z = zCur.current;
  });

  return (
    <group ref={group} position={[local.x, local.y, 0.004]}>
      <mesh
        geometry={geo}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(hit.id);
        }}
        onPointerOut={() => hover(null)}
        onClick={(e) => {
          e.stopPropagation();
          select(hit.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          select(hit.id);
        }}
      >
        <meshBasicMaterial map={map} toneMapped={false} transparent={!show} opacity={show ? 1 : 0} depthWrite={show} />
      </mesh>
      {show && (
        <>
          <mesh position={[0, 0, 0.002]} raycast={() => undefined}>
            <planeGeometry args={[local.w, local.h]} />
            <meshBasicMaterial
              color={selected ? _colorSelected : _colorHover}
              transparent
              opacity={selected ? 0.07 : 0.04}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
          <Line
            points={outline}
            color={selected ? "#e4ebe8" : "#8aa0b4"}
            lineWidth={selected ? 2.2 : 1.4}
            transparent
            opacity={selected ? 0.95 : 0.75}
            depthTest={false}
            raycast={() => undefined}
          />
        </>
      )}
    </group>
  );
}

function ContextVeil({ view }: { view: PhotoView }) {
  const selectedId = useExplorer((s) => s.selectedId);
  const mode = useExplorer((s) => s.materialMode);
  if (mode !== "context" || !selectedId) return null;
  const hit = view.hits.find((h) => h.id === selectedId);
  if (!hit) return null;
  const r = hit.rect;
  const panes = [
    { u0: 0, v0: 0, u1: 1, v1: r.v0 },
    { u0: 0, v0: r.v1, u1: 1, v1: 1 },
    { u0: 0, v0: r.v0, u1: r.u0, v1: r.v1 },
    { u0: r.u1, v0: r.v0, u1: 1, v1: r.v1 },
  ];
  return (
    <group>
      {panes.map((p, i) => {
        const local = uvRectToLocal(p, view.width, view.height);
        if (local.w < 0.008 || local.h < 0.008) return null;
        return (
          <mesh key={i} position={[local.x, local.y, 0.2]}>
            <planeGeometry args={[local.w, local.h]} />
            <meshBasicMaterial color="#0b0c0e" transparent opacity={0.68} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function PhotographicPlate({ view, map }: { view: PhotoView; map: THREE.Texture }) {
  return (
    <mesh>
      <planeGeometry args={[view.width, view.height]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

function Ground({ width, height }: { width: number; height: number }) {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);

  useLayoutEffect(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const g = c.getContext("2d");
    if (!g) return;
    const grd = g.createRadialGradient(128, 128, 16, 128, 128, 128);
    grd.addColorStop(0, "rgba(0,0,0,0.62)");
    grd.addColorStop(0.55, "rgba(0,0,0,0.22)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    setTex(t);
    return () => t.dispose();
  }, []);

  if (!tex) return null;

  const y = -height / 2 - 0.05;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0.08]} raycast={() => undefined}>
      <planeGeometry args={[Math.max(width, height) * 2.1, Math.max(width, height) * 2.1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export function PhotoEngine({ photoId }: { photoId: "welt" | "bay" }) {
  const view = photoViews[photoId];
  const systemFilter = useExplorer((s) => s.systemFilter);
  const map = useTexture(view.src);

  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.magFilter = THREE.LinearFilter;
    map.needsUpdate = true;
  }, [map]);

  const hits = useMemo(() => {
    return view.hits
      .filter((h) => {
        const c = componentById[h.id];
        if (!c) return false;
        if (assertMeshIdentity(h.id).status === "unidentified") return false;
        if (systemFilter !== "all" && c.system !== systemFilter) return false;
        return true;
      })
      .slice()
      .sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));
  }, [view, systemFilter]);

  return (
    <group>
      <Ground width={view.width} height={view.height} />
      <PhotographicPlate view={view} map={map} />
      <ContextVeil view={view} />
      {hits.map((hit) => (
        <ReliefHit key={hit.id} view={view} hit={hit} map={map} />
      ))}
    </group>
  );
}
