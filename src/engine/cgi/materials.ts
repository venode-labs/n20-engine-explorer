import { useMemo } from "react";
import * as THREE from "three";
import { makeBeltAlbedo, makeCastAlbedo, makeHeatAlbedo, makeMachinedAlbedo, makeNormalFrom, makePlasticAlbedo, makeRoughnessFrom } from "./textures";

function phys(color: string, metal: number, rough: number, extras?: THREE.MeshPhysicalMaterialParameters): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({ color, metalness: metal, roughness: rough, envMapIntensity: 0.92, ...extras });
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

    const castAl = phys("#aaa7a1", 0.46, 0.56, { map: castMap, roughnessMap: castRough, normalMap: castNorm, normalScale: new THREE.Vector2(0.5, 0.5) });
    const darkCast = phys("#706e69", 0.38, 0.6, { map: castMap, roughnessMap: castRough, normalMap: castNorm, normalScale: new THREE.Vector2(0.62, 0.62) });
    const machined = phys("#b8bdc2", 0.62, 0.34, { map: machMap, normalMap: machNorm, normalScale: new THREE.Vector2(0.3, 0.3) });
    const plasticCover = phys("#141619", 0.03, 0.5, { map: plasticMap, normalMap: plasticNorm, normalScale: new THREE.Vector2(0.3, 0.3), clearcoat: 0.2, clearcoatRoughness: 0.42 });
    const plastic = phys("#17191d", 0.02, 0.68, { map: plasticMap });
    const plasticMatte = phys("#1c1f24", 0.01, 0.82, { map: plasticMap });
    const turboHot = phys("#8c8176", 0.5, 0.58, { map: heatMap, roughness: 0.58 });
    const turboComp = phys("#aab0b6", 0.58, 0.38, { map: machMap });
    const exhaust = phys("#5a5048", 0.42, 0.62, { map: heatMap });
    const heatShield = phys("#77746e", 0.4, 0.72, { map: castMap, normalMap: castNorm, normalScale: new THREE.Vector2(0.76, 0.76) });
    const hose = phys("#20242a", 0.0, 0.86);
    const rubber = phys("#151516", 0.0, 0.96);
    const belt = phys("#171513", 0.0, 0.92, { map: beltMap });
    const steel = phys("#858d95", 0.64, 0.4);
    const coil = phys("#111316", 0.08, 0.56);
    const badgeRing = phys("#c3c5c4", 0.86, 0.3);
    const badgeBlue = phys("#294763", 0.22, 0.46);
    const badgeWhite = phys("#dddcd7", 0.04, 0.42);

    return { maps: { castMap, castRough, castNorm, machMap, machNorm, heatMap, plasticMap, plasticNorm, beltMap }, castAl, darkCast, machined, plasticCover, plastic, plasticMatte, turboHot, turboComp, exhaust, heatShield, hose, rubber, belt, steel, coil, badgeRing, badgeBlue, badgeWhite };
  }, []);
}

export type EngineMats = ReturnType<typeof useEngineMaterials>;
