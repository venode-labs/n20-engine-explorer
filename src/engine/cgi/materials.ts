import { useMemo } from "react";
import * as THREE from "three";

function phys(
  color: string,
  metalness: number,
  roughness: number,
  extras?: THREE.MeshPhysicalMaterialParameters,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness,
    roughness,
    envMapIntensity: 0.62,
    clearcoat: 0,
    ...extras,
  });
}

export function useEngineMaterials() {
  return useMemo(() => {
    // The 3D view is intentionally a technical schematic, not a faux-photoreal render.
    // Flat, restrained materials keep the simplified geometry legible and honest.
    const castAl = phys("#68747c", 0.18, 0.78);
    const darkCast = phys("#465057", 0.14, 0.82);
    const machined = phys("#929fa7", 0.34, 0.46);
    const plasticCover = phys("#171c21", 0.02, 0.78);
    const plastic = phys("#1e252a", 0.01, 0.84);
    const plasticMatte = phys("#242b31", 0.0, 0.9);
    const turboHot = phys("#6c6560", 0.2, 0.76);
    const turboComp = phys("#839099", 0.3, 0.5);
    const exhaust = phys("#56514d", 0.16, 0.82);
    const heatShield = phys("#727b80", 0.18, 0.84);
    const hose = phys("#20262b", 0.0, 0.94);
    const rubber = phys("#15191d", 0.0, 0.98);
    const belt = phys("#171b1f", 0.0, 0.98);
    const steel = phys("#87939b", 0.36, 0.5);
    const coil = phys("#14191e", 0.02, 0.82);
    const badgeRing = phys("#a8b2b8", 0.42, 0.42);
    const badgeBlue = phys("#36546a", 0.12, 0.64);
    const badgeWhite = phys("#c5c9c8", 0.02, 0.7);

    return {
      maps: {},
      castAl,
      darkCast,
      machined,
      plasticCover,
      plastic,
      plasticMatte,
      turboHot,
      turboComp,
      exhaust,
      heatShield,
      hose,
      rubber,
      belt,
      steel,
      coil,
      badgeRing,
      badgeBlue,
      badgeWhite,
    };
  }, []);
}

export type EngineMats = ReturnType<typeof useEngineMaterials>;
