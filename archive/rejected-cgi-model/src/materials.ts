import { useMemo } from "react";
import * as THREE from "three";
import {
  makeBeltAlbedo,
  makeCastAlbedo,
  makeHeatAlbedo,
  makeMachinedAlbedo,
  makeNormalFrom,
  makePlasticAlbedo,
  makeRoughnessFrom,
} from "./textures";

function phys(
  color: string,
  metal: number,
  rough: number,
  extras?: THREE.MeshPhysicalMaterialParameters,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: metal,
    roughness: rough,
    envMapIntensity: 1.1,
    ...extras,
  });
}

export function useEngineMaterials() {
  return useMemo(() => {
    const castMap = makeCastAlbedo();
    const castRough = makeRoughnessFrom(castMap, 0.42, 0.22);
    const castNorm = makeNormalFrom(castMap, 1.6);
    const machMap = makeMachinedAlbedo();
    const machNorm = makeNormalFrom(machMap, 0.8);
    const heatMap = makeHeatAlbedo();
    const plasticMap = makePlasticAlbedo();
    const plasticNorm = makeNormalFrom(plasticMap, 0.9);
    const beltMap = makeBeltAlbedo();

    const castAl = phys("#d2cdc4", 0.7, 0.42, {
      map: castMap,
      roughnessMap: castRough,
      normalMap: castNorm,
      normalScale: new THREE.Vector2(0.55, 0.55),
    });
    const darkCast = phys("#9a948c", 0.65, 0.48, {
      map: castMap,
      roughnessMap: castRough,
      normalMap: castNorm,
      normalScale: new THREE.Vector2(0.7, 0.7),
    });
    const machined = phys("#d0d4d8", 0.9, 0.24, {
      map: machMap,
      normalMap: machNorm,
      normalScale: new THREE.Vector2(0.35, 0.35),
    });
    const plasticCover = phys("#1a1b1e", 0.04, 0.42, {
      map: plasticMap,
      normalMap: plasticNorm,
      normalScale: new THREE.Vector2(0.35, 0.35),
      clearcoat: 0.38,
      clearcoatRoughness: 0.32,
    });
    const plastic = phys("#1d1e22", 0.03, 0.62, { map: plasticMap });
    const plasticMatte = phys("#22242a", 0.02, 0.78, { map: plasticMap });
    const turboHot = phys("#ffffff", 0.68, 0.42, {
      map: heatMap,
      roughness: 0.48,
    });
    const turboComp = phys("#c5c9ce", 0.86, 0.28, { map: machMap });
    const exhaust = phys("#6a5c50", 0.58, 0.5, { map: heatMap });
    const heatShield = phys("#7a746c", 0.55, 0.62, {
      map: castMap,
      normalMap: castNorm,
      normalScale: new THREE.Vector2(0.9, 0.9),
    });
    const hose = phys("#2a2c32", 0.0, 0.82);
    const rubber = phys("#1a1918", 0.0, 0.94);
    const belt = phys("#1c1714", 0.0, 0.88, { map: beltMap });
    const steel = phys("#9aa1a8", 0.92, 0.3);
    const coil = phys("#141416", 0.12, 0.46);
    const badgeRing = phys("#d8d6d0", 0.88, 0.26);
    const badgeBlue = phys("#2f4d6e", 0.18, 0.42);
    const badgeWhite = phys("#eceae4", 0.04, 0.38);

    return {
      maps: { castMap, castRough, castNorm, machMap, machNorm, heatMap, plasticMap, plasticNorm, beltMap },
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
