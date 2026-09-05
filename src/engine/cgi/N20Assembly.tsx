import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { disposeGeo, extrude, hexBolt, hose, lathe, merge, placed, pulley, snail } from "./geometry";
import { useEngineMaterials } from "./materials";
import { Part } from "./Part";
import {
  beautyCoverShape,
  blockShape,
  coolerShape,
  dmeShape,
  headShape,
  heatShieldShape,
  intakePlenumShape,
  ofhBodyShape,
  sumpShape,
  valveCoverShape,
} from "./profiles";

const CYL_Z = [-0.1365, -0.0455, 0.0455, 0.1365] as const;

function coverLabel(text: string, w = 512, h = 96, size = 42): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#d4d0c8";
  ctx.font = `600 ${size}px "IBM Plex Sans", "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "4px";
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function compressorBlades(r = 0.028, n = 8): THREE.BufferGeometry {
  const blade = new THREE.BoxGeometry(0.0022, 0.018, r * 0.85);
  blade.translate(0, 0, r * 0.38);
  const geos = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return placed(blade, [0, 0, 0], [0, a, 0]);
  });
  const hub = new THREE.CylinderGeometry(0.008, 0.008, 0.01, 12);
  hub.rotateX(Math.PI / 2);
  return merge([...geos, hub]);
}

export function N20Assembly() {
  const m = useEngineMaterials();
  const geo = useMemo(() => {
    const cover = extrude(beautyCoverShape(), 0.048, 0.006, 24);
    cover.rotateX(Math.PI / 2);

    const coverLip = extrude(beautyCoverShape(), 0.01, 0.002, 20);
    coverLip.rotateX(Math.PI / 2);

    const vcover = extrude(valveCoverShape(), 0.04, 0.004, 20);
    vcover.rotateX(Math.PI / 2);

    const block = extrude(blockShape(), 0.228, 0.008, 18);
    block.rotateX(Math.PI / 2);

    const head = extrude(headShape(), 0.122, 0.006, 18);
    head.rotateX(Math.PI / 2);

    const sump = extrude(sumpShape(), 0.088, 0.006, 16);
    sump.rotateX(Math.PI / 2);

    const ofh = extrude(ofhBodyShape(), 0.09, 0.005, 16);
    const cooler = extrude(coolerShape(), 0.058, 0.002, 8);
    const intake = extrude(intakePlenumShape(), 0.082, 0.005, 16);
    intake.rotateX(Math.PI / 2);
    const dme = extrude(dmeShape(), 0.026, 0.002, 8);

    const shield = extrude(heatShieldShape(), 0.003, 0.001, 12);

    const crankPulley = pulley(0.074, 0.034);
    const altPulley = pulley(0.03, 0.026);
    const acPulley = pulley(0.054, 0.03);
    const tenPulley = pulley(0.027, 0.022);

    const belt = hose(
      [
        new THREE.Vector3(0, -0.078, 0.308),
        new THREE.Vector3(0.095, -0.148, 0.308),
        new THREE.Vector3(0.175, 0.055, 0.308),
        new THREE.Vector3(0.04, 0.125, 0.308),
        new THREE.Vector3(-0.09, 0.012, 0.308),
        new THREE.Vector3(-0.05, -0.07, 0.308),
        new THREE.Vector3(0, -0.078, 0.308),
      ],
      0.0072,
      72,
      8,
      true,
    );

    const charge = hose(
      [
        new THREE.Vector3(0.165, 0.2, -0.255),
        new THREE.Vector3(0.2, 0.12, -0.12),
        new THREE.Vector3(0.12, -0.02, 0.22),
        new THREE.Vector3(-0.02, -0.05, 0.32),
        new THREE.Vector3(-0.16, -0.02, 0.28),
      ],
      0.03,
      36,
      12,
    );

    const boost = hose(
      [
        new THREE.Vector3(-0.205, 0.13, 0.055),
        new THREE.Vector3(-0.2, 0.07, 0.18),
        new THREE.Vector3(-0.12, 0.0, 0.3),
        new THREE.Vector3(-0.02, -0.06, 0.36),
      ],
      0.027,
      24,
      10,
    );

    const hpLine = hose(
      [
        new THREE.Vector3(0.012, 0.348, -0.205),
        new THREE.Vector3(0.078, 0.358, -0.12),
        new THREE.Vector3(0.1, 0.332, 0.02),
      ],
      0.0052,
      16,
      8,
    );

    const coolantA = hose(
      [
        new THREE.Vector3(0.175, 0.12, 0.2),
        new THREE.Vector3(0.16, 0.04, 0.22),
        new THREE.Vector3(0.15, -0.02, 0.215),
      ],
      0.01,
      10,
      8,
    );

    const turboVolute = snail(0.018, 0.072, 0.026, 1.55, 40);
    const compressor = lathe(
      [
        [0.016, -0.042],
        [0.052, -0.04],
        [0.06, -0.018],
        [0.058, 0.006],
        [0.046, 0.028],
        [0.03, 0.042],
        [0.02, 0.052],
      ],
      32,
    );
    const blades = compressorBlades();

    const oilCap = lathe(
      [
        [0, 0],
        [0.036, 0],
        [0.04, 0.006],
        [0.034, 0.012],
        [0.02, 0.016],
        [0.018, 0.028],
        [0, 0.03],
      ],
      24,
    );

    const filterCap = lathe(
      [
        [0, 0],
        [0.044, 0],
        [0.048, 0.008],
        [0.046, 0.016],
        [0.022, 0.02],
        [0.018, 0.036],
        [0.012, 0.04],
        [0, 0.042],
      ],
      28,
    );

    const coil = lathe(
      [
        [0, 0],
        [0.013, 0],
        [0.015, 0.01],
        [0.013, 0.048],
        [0.016, 0.056],
        [0.012, 0.068],
        [0, 0.07],
      ],
      12,
    );

    const bolt = hexBolt(1);
    const bmwLabel = coverLabel("BMW", 512, 128, 92);
    const tptLabel = coverLabel("TwinPower Turbo", 768, 96, 48);

    const timingFace = new THREE.CylinderGeometry(0.122, 0.122, 0.032, 36);
    const bell = new THREE.CylinderGeometry(0.128, 0.128, 0.032, 32);
    const crankNose = new THREE.CylinderGeometry(0.08, 0.08, 0.042, 24);

    const turboInA = hose(
      [
        new THREE.Vector3(-0.14, 0.165, CYL_Z[0]),
        new THREE.Vector3(-0.18, 0.12, -0.09),
        new THREE.Vector3(-0.21, 0.085, -0.04),
      ],
      0.015,
      10,
      8,
    );
    const turboInB = hose(
      [
        new THREE.Vector3(-0.14, 0.165, CYL_Z[3]),
        new THREE.Vector3(-0.18, 0.12, 0.08),
        new THREE.Vector3(-0.21, 0.085, 0.0),
      ],
      0.015,
      10,
      8,
    );
    const turboInC = hose(
      [
        new THREE.Vector3(-0.14, 0.165, CYL_Z[1]),
        new THREE.Vector3(-0.175, 0.125, -0.02),
        new THREE.Vector3(-0.205, 0.09, -0.02),
      ],
      0.014,
      8,
      8,
    );
    const turboInD = hose(
      [
        new THREE.Vector3(-0.14, 0.165, CYL_Z[2]),
        new THREE.Vector3(-0.175, 0.125, 0.04),
        new THREE.Vector3(-0.205, 0.09, 0.01),
      ],
      0.014,
      8,
      8,
    );

    return {
      cover,
      coverLip,
      vcover,
      block,
      head,
      sump,
      ofh,
      cooler,
      intake,
      dme,
      shield,
      crankPulley,
      altPulley,
      acPulley,
      tenPulley,
      belt,
      charge,
      boost,
      hpLine,
      coolantA,
      turboVolute,
      compressor,
      blades,
      oilCap,
      filterCap,
      coil,
      bolt,
      timingFace,
      bell,
      crankNose,
      turboInA,
      turboInB,
      turboInC,
      turboInD,
      bmwLabel,
      tptLabel,
    };
  }, []);

  useEffect(
    () => () => {
      const { bmwLabel, tptLabel, ...geoms } = geo;
      disposeGeo(geoms);
      bmwLabel.dispose();
      tptLabel.dispose();
    },
    [geo],
  );

  const coverBolts: Array<[number, number, number]> = [
    [-0.13, 0.382, -0.2],
    [0.12, 0.382, -0.2],
    [-0.13, 0.382, 0.05],
    [0.02, 0.382, 0.2],
    [-0.13, 0.382, 0.2],
  ];

  return (
    <group>
      <Part id="crankcase">
        <mesh geometry={geo.block} position={[0, 0.018, 0]} material={m.castAl} castShadow receiveShadow />
        <mesh
          geometry={geo.timingFace}
          position={[0, 0.028, 0.242]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m.darkCast}
          castShadow
        />
        <mesh geometry={geo.bell} position={[0, -0.018, -0.248]} material={m.darkCast} castShadow />
        <mesh geometry={geo.crankNose} position={[0, -0.018, -0.268]} material={m.castAl} />
        {[-0.13, -0.02, 0.1].map((z) => (
          <mesh key={z} position={[-0.112, 0.0, z]} material={m.darkCast}>
            <boxGeometry args={[0.01, 0.15, 0.022]} />
          </mesh>
        ))}
        <mesh position={[0.118, -0.018, 0.02]} rotation={[0, 0, Math.PI / 2]} material={m.castAl}>
          <cylinderGeometry args={[0.026, 0.03, 0.038, 14]} />
        </mesh>
        <mesh position={[-0.118, -0.018, 0.02]} rotation={[0, 0, Math.PI / 2]} material={m.castAl}>
          <cylinderGeometry args={[0.026, 0.03, 0.038, 14]} />
        </mesh>
      </Part>

      <Part id="oil-sump">
        <mesh geometry={geo.sump} position={[0, -0.148, 0.01]} material={m.castAl} castShadow receiveShadow />
        <mesh position={[0, -0.2, -0.125]} material={m.darkCast} castShadow>
          <boxGeometry args={[0.155, 0.048, 0.145]} />
        </mesh>
        <mesh position={[0.048, -0.218, 0.12]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
          <cylinderGeometry args={[0.01, 0.01, 0.018, 12]} />
        </mesh>
      </Part>

      <Part id="cylinder-head">
        <mesh geometry={geo.head} position={[0, 0.186, 0]} material={m.castAl} castShadow receiveShadow />
        <mesh position={[-0.12, 0.172, 0]} material={m.darkCast}>
          <boxGeometry args={[0.016, 0.068, 0.4]} />
        </mesh>
        <mesh position={[0.12, 0.172, 0]} material={m.darkCast}>
          <boxGeometry args={[0.016, 0.068, 0.4]} />
        </mesh>
        <mesh position={[0.036, 0.246, 0]} material={m.machined}>
          <boxGeometry args={[0.052, 0.018, 0.42]} />
        </mesh>
        <mesh position={[-0.036, 0.246, 0]} material={m.machined}>
          <boxGeometry args={[0.052, 0.018, 0.42]} />
        </mesh>
      </Part>

      <Part id="valve-cover">
        <mesh geometry={geo.vcover} position={[0, 0.27, 0]} material={m.plastic} castShadow />
        <mesh position={[0.052, 0.292, -0.198]} material={m.plasticMatte} castShadow>
          <boxGeometry args={[0.068, 0.042, 0.068]} />
        </mesh>
        <mesh position={[-0.018, 0.29, 0.205]} material={m.plastic}>
          <cylinderGeometry args={[0.03, 0.032, 0.018, 20]} />
        </mesh>
      </Part>

      <Part id="oil-cap">
        <mesh geometry={geo.oilCap} position={[-0.018, 0.302, 0.205]} material={m.plasticCover} castShadow />
      </Part>

      <Part id="ignition-coils">
        {CYL_Z.map((z) => (
          <mesh key={z} geometry={geo.coil} position={[0, 0.266, z]} material={m.coil} castShadow />
        ))}
      </Part>

      <Part id="vanos-intake">
        <mesh position={[0.044, 0.252, 0.248]} rotation={[Math.PI / 2, 0, 0]} material={m.machined} castShadow>
          <cylinderGeometry args={[0.024, 0.024, 0.042, 18]} />
        </mesh>
        <mesh position={[0.044, 0.252, 0.274]} material={m.plastic}>
          <boxGeometry args={[0.03, 0.03, 0.018]} />
        </mesh>
      </Part>
      <Part id="vanos-exhaust">
        <mesh position={[-0.044, 0.252, 0.248]} rotation={[Math.PI / 2, 0, 0]} material={m.machined} castShadow>
          <cylinderGeometry args={[0.024, 0.024, 0.042, 18]} />
        </mesh>
        <mesh position={[-0.044, 0.252, 0.274]} material={m.plastic}>
          <boxGeometry args={[0.03, 0.03, 0.018]} />
        </mesh>
      </Part>

      <Part id="valvetronic-motor">
        <mesh position={[0.128, 0.252, 0.02]} rotation={[0, 0, Math.PI / 2]} material={m.plastic} castShadow>
          <cylinderGeometry args={[0.03, 0.032, 0.078, 20]} />
        </mesh>
        <mesh position={[0.172, 0.252, 0.02]} material={m.machined}>
          <boxGeometry args={[0.018, 0.038, 0.042]} />
        </mesh>
      </Part>

      <Part id="engine-cover">
        <mesh geometry={geo.cover} position={[-0.012, 0.354, 0]} material={m.plasticCover} castShadow receiveShadow />
        <mesh geometry={geo.coverLip} position={[-0.012, 0.328, 0]} material={m.plasticMatte} />
        <mesh position={[-0.012, 0.38, -0.04]} material={m.plastic}>
          <boxGeometry args={[0.012, 0.006, 0.32]} />
        </mesh>
        <group position={[-0.012, 0.382, -0.172]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh material={m.badgeRing}>
            <cylinderGeometry args={[0.032, 0.032, 0.004, 36]} />
          </mesh>
          <mesh position={[0, 0.003, 0]} material={m.badgeRing}>
            <cylinderGeometry args={[0.026, 0.026, 0.003, 32]} />
          </mesh>
          <mesh position={[0.01, 0.005, 0.01]} material={m.badgeBlue}>
            <boxGeometry args={[0.018, 0.002, 0.018]} />
          </mesh>
          <mesh position={[-0.01, 0.005, 0.01]} material={m.badgeWhite}>
            <boxGeometry args={[0.018, 0.002, 0.018]} />
          </mesh>
          <mesh position={[-0.01, 0.005, -0.01]} material={m.badgeBlue}>
            <boxGeometry args={[0.018, 0.002, 0.018]} />
          </mesh>
          <mesh position={[0.01, 0.005, -0.01]} material={m.badgeWhite}>
            <boxGeometry args={[0.018, 0.002, 0.018]} />
          </mesh>
        </group>
        <mesh position={[-0.132, 0.381, 0.05]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.09, 0.028]} />
          <meshBasicMaterial map={geo.bmwLabel} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.092, 0.381, -0.172]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.11, 0.018]} />
          <meshBasicMaterial map={geo.tptLabel} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        {coverBolts.map((p, i) => (
          <mesh key={i} geometry={geo.bolt} position={p} material={m.steel} />
        ))}
      </Part>

      <Part id="vacuum-reservoir">
        <mesh position={[0.088, 0.338, -0.04]} rotation={[0, 0, Math.PI / 2]} material={m.plasticMatte} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.088, 18]} />
        </mesh>
      </Part>

      <Part id="oil-filter-module">
        <mesh
          geometry={geo.ofh}
          position={[0.178, 0.142, 0.1]}
          rotation={[0, Math.PI / 2, Math.PI / 2]}
          material={m.castAl}
          castShadow
        />
        <mesh position={[0.178, 0.152, 0.1]} material={m.machined} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.072, 24]} />
        </mesh>
        <mesh geometry={geo.filterCap} position={[0.178, 0.198, 0.1]} material={m.plasticCover} castShadow />
        <mesh position={[0.178, 0.168, 0.148]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
          <cylinderGeometry args={[0.008, 0.008, 0.03, 10]} />
        </mesh>
      </Part>

      <Part id="oil-cooler">
        <mesh
          geometry={geo.cooler}
          position={[0.178, 0.142, 0.172]}
          rotation={[0, 0, Math.PI / 2]}
          material={m.machined}
          castShadow
        />
        {[-0.018, -0.009, 0, 0.009, 0.018].map((y) => (
          <mesh key={y} position={[0.178, 0.142 + y, 0.172]} material={m.steel}>
            <boxGeometry args={[0.07, 0.0025, 0.05]} />
          </mesh>
        ))}
      </Part>

      <Part id="intake-manifold">
        <mesh geometry={geo.intake} position={[0.168, 0.202, -0.018]} material={m.plasticMatte} castShadow />
        {CYL_Z.map((z) => (
          <mesh key={z} position={[0.132, 0.182, z]} rotation={[0, 0, Math.PI / 2]} material={m.plastic}>
            <cylinderGeometry args={[0.017, 0.019, 0.052, 14]} />
          </mesh>
        ))}
      </Part>

      <Part id="throttle-body">
        <mesh position={[0.168, 0.202, -0.232]} rotation={[Math.PI / 2, 0, 0]} material={m.castAl} castShadow>
          <cylinderGeometry args={[0.04, 0.042, 0.058, 24]} />
        </mesh>
        <mesh position={[0.168, 0.202, -0.266]} material={m.plastic}>
          <boxGeometry args={[0.052, 0.046, 0.02]} />
        </mesh>
      </Part>

      <Part id="dme">
        <mesh
          geometry={geo.dme}
          position={[0.178, 0.262, -0.038]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          material={m.plastic}
          castShadow
        />
        <mesh position={[0.178, 0.278, -0.038]} material={m.machined}>
          <boxGeometry args={[0.072, 0.004, 0.132]} />
        </mesh>
        {[-0.04, -0.02, 0, 0.02, 0.04].map((z) => (
          <mesh key={z} position={[0.178, 0.284, -0.038 + z]} material={m.machined}>
            <boxGeometry args={[0.06, 0.008, 0.006]} />
          </mesh>
        ))}
      </Part>

      <Part id="exhaust-manifold">
        <mesh geometry={geo.turboInA} material={m.exhaust} castShadow />
        <mesh geometry={geo.turboInB} material={m.exhaust} castShadow />
        <mesh geometry={geo.turboInC} material={m.exhaust} castShadow />
        <mesh geometry={geo.turboInD} material={m.exhaust} castShadow />
        <mesh position={[-0.188, 0.1, -0.05]} material={m.exhaust} castShadow>
          <boxGeometry args={[0.042, 0.038, 0.12]} />
        </mesh>
        <mesh position={[-0.188, 0.1, 0.05]} material={m.exhaust} castShadow>
          <boxGeometry args={[0.042, 0.038, 0.1]} />
        </mesh>
      </Part>

      <Part id="turbocharger">
        <mesh
          geometry={geo.turboVolute}
          position={[-0.218, 0.072, -0.015]}
          rotation={[0, 0.35, 0]}
          material={m.turboHot}
          castShadow
        />
        <mesh
          geometry={geo.compressor}
          position={[-0.198, 0.128, 0.032]}
          rotation={[0.45, 0.25, 0]}
          material={m.turboComp}
          castShadow
        />
        <mesh
          geometry={geo.blades}
          position={[-0.188, 0.168, 0.052]}
          rotation={[0.45, 0.25, 0]}
          material={m.machined}
        />
        <mesh position={[-0.185, 0.172, 0.055]} rotation={[0.5, 0.2, 0]} material={m.machined} castShadow>
          <cylinderGeometry args={[0.034, 0.036, 0.028, 24]} />
        </mesh>
        <mesh position={[-0.185, 0.172, 0.055]} rotation={[0.5, 0.2, 0]} material={m.plasticMatte}>
          <torusGeometry args={[0.035, 0.004, 8, 24]} />
        </mesh>
        <mesh position={[-0.242, 0.018, -0.058]} rotation={[1.12, 0, 0.18]} material={m.turboHot} castShadow>
          <cylinderGeometry args={[0.032, 0.036, 0.058, 18]} />
        </mesh>
        <mesh
          geometry={geo.shield}
          position={[-0.21, 0.095, -0.02]}
          rotation={[Math.PI / 2, 0, 0.4]}
          material={m.heatShield}
          castShadow
        />
      </Part>

      <Part id="wastegate">
        <mesh position={[-0.268, 0.122, -0.078]} rotation={[0.2, 0.4, 0]} material={m.castAl} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.048, 16]} />
        </mesh>
        <mesh position={[-0.268, 0.158, -0.078]} material={m.plastic}>
          <boxGeometry args={[0.032, 0.038, 0.028]} />
        </mesh>
      </Part>
      <Part id="blow-off-valve">
        <mesh position={[-0.2, 0.152, 0.09]} material={m.machined} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.03, 14]} />
        </mesh>
      </Part>
      <Part id="catalyst-interface">
        <mesh position={[-0.242, -0.042, -0.12]} rotation={[1.18, 0, 0.14]} material={m.exhaust} castShadow>
          <cylinderGeometry args={[0.04, 0.044, 0.1, 18]} />
        </mesh>
      </Part>

      <Part id="boost-pipe">
        <mesh geometry={geo.boost} material={m.hose} castShadow />
      </Part>
      <Part id="charge-pipe">
        <mesh geometry={geo.charge} material={m.hose} castShadow />
      </Part>

      <Part id="hpfp">
        <mesh position={[0.0, 0.322, -0.215]} material={m.machined} castShadow>
          <cylinderGeometry args={[0.03, 0.032, 0.058, 22]} />
        </mesh>
        <mesh position={[0.0, 0.354, -0.215]} material={m.steel}>
          <cylinderGeometry args={[0.02, 0.02, 0.012, 16]} />
        </mesh>
        <mesh position={[0.034, 0.322, -0.215]} material={m.plastic}>
          <boxGeometry args={[0.02, 0.026, 0.03]} />
        </mesh>
      </Part>
      <Part id="fuel-rail">
        <mesh position={[0.1, 0.316, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.steel} castShadow>
          <cylinderGeometry args={[0.009, 0.009, 0.36, 12]} />
        </mesh>
        <mesh geometry={geo.hpLine} material={m.steel} />
      </Part>
      <Part id="injectors">
        {CYL_Z.map((z) => (
          <mesh key={z} position={[0.1, 0.292, z]} material={m.plastic} castShadow>
            <cylinderGeometry args={[0.008, 0.007, 0.03, 10]} />
          </mesh>
        ))}
      </Part>

      <Part id="crank-pulley">
        <mesh
          geometry={geo.crankPulley}
          position={[0, -0.078, 0.272]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m.darkCast}
          castShadow
        />
        <mesh position={[0, -0.078, 0.294]} rotation={[Math.PI / 2, 0, 0]} material={m.machined}>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
        </mesh>
      </Part>
      <Part id="alternator">
        <mesh position={[0.175, 0.055, 0.232]} rotation={[Math.PI / 2, 0, 0]} material={m.machined} castShadow>
          <cylinderGeometry args={[0.05, 0.052, 0.092, 24]} />
        </mesh>
        <mesh
          geometry={geo.altPulley}
          position={[0.175, 0.055, 0.288]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m.darkCast}
        />
        <mesh position={[0.175, 0.055, 0.186]} material={m.plastic}>
          <boxGeometry args={[0.048, 0.04, 0.018]} />
        </mesh>
      </Part>
      <Part id="ac-compressor">
        <mesh position={[0.095, -0.148, 0.228]} rotation={[Math.PI / 2, 0, 0]} material={m.castAl} castShadow>
          <cylinderGeometry args={[0.044, 0.047, 0.1, 18]} />
        </mesh>
        <mesh
          geometry={geo.acPulley}
          position={[0.095, -0.148, 0.288]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m.darkCast}
        />
      </Part>
      <Part id="belt-tensioner">
        <mesh
          geometry={geo.tenPulley}
          position={[-0.09, 0.012, 0.288]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m.darkCast}
          castShadow
        />
        <mesh position={[-0.09, 0.012, 0.258]} material={m.castAl}>
          <boxGeometry args={[0.046, 0.052, 0.026]} />
        </mesh>
      </Part>
      <Part id="serpentine-belt">
        <mesh geometry={geo.belt} material={m.belt} />
      </Part>

      <Part id="electric-coolant-pump">
        <mesh position={[0.148, -0.02, 0.215]} rotation={[0, 0, Math.PI / 2]} material={m.plastic} castShadow>
          <cylinderGeometry args={[0.034, 0.036, 0.072, 18]} />
        </mesh>
        <mesh position={[0.184, -0.02, 0.215]} material={m.machined}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 12]} />
        </mesh>
        <mesh geometry={geo.coolantA} material={m.hose} />
      </Part>
      <Part id="map-thermostat">
        <mesh position={[0.128, 0.058, 0.2]} material={m.castAl} castShadow>
          <sphereGeometry args={[0.028, 16, 12]} />
        </mesh>
        <mesh position={[0.128, 0.058, 0.232]} rotation={[Math.PI / 2, 0, 0]} material={m.hose}>
          <cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />
        </mesh>
      </Part>
      <Part id="vacuum-pump">
        <mesh position={[-0.08, 0.252, -0.232]} rotation={[Math.PI / 2, 0, 0]} material={m.castAl} castShadow>
          <cylinderGeometry args={[0.026, 0.028, 0.052, 16]} />
        </mesh>
      </Part>
    </group>
  );
}
