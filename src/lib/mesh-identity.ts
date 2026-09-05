export type MeshIdentityStatus = "verified" | "probable" | "schematic" | "unidentified";

export interface MeshIdentity {
  componentId: string;
  status: MeshIdentityStatus;
  basis: string;
}

/**
 * Identity of a highlighted region on the photographic plate, or of a
 * schematic mesh in 3D / X-ray. Visual resemblance alone is not enough
 * to attach a specific N20 part name — see assertMeshIdentity().
 */
export const meshIdentity: Record<string, MeshIdentity> = {
  "engine-cover": { componentId: "engine-cover", status: "verified", basis: "Visible on both plates: asymmetric black TwinPower Turbo acoustic cover with BMW roundel." },
  "valve-cover": { componentId: "valve-cover", status: "schematic", basis: "Under the beauty cover in both photographs. Not a separately captured surface." },
  "oil-filter-module": { componentId: "oil-filter-module", status: "verified", basis: "BMW Welt plate: aluminium housing with black cartridge cap on the intake/front corner. F30 bay plate shows the in-situ module (2012 car may still be the pre-06/2012 plastic housing)." },
  turbocharger: { componentId: "turbocharger", status: "verified", basis: "BMW Welt plate: exhaust-side turbo under gold heat shielding, image-left of the standing engine." },
  "exhaust-manifold": { componentId: "exhaust-manifold", status: "probable", basis: "Welt plate: exhaust face / heat-shielded volume above the turbo. Individual runners are not fully resolved in this capture." },
  "intake-manifold": { componentId: "intake-manifold", status: "verified", basis: "Welt plate: plastic plenum on the intake side with DME sitting on top." },
  "throttle-body": { componentId: "throttle-body", status: "probable", basis: "Welt plate: bulkhead end of the intake plenum, right of the DME. Occluded compared with a dedicated throttle photograph." },
  hpfp: { componentId: "hpfp", status: "schematic", basis: "At the bulkhead end of the head — not in frame on the Welt 3/4 front plate or the F30 bay plate." },
  "fuel-rail": { componentId: "fuel-rail", status: "schematic", basis: "Not resolved as a separate surface in the capture set." },
  "ignition-coils": { componentId: "ignition-coils", status: "schematic", basis: "Under the acoustic cover. No cover-off photograph in the licensed set." },
  "valvetronic-motor": { componentId: "valvetronic-motor", status: "probable", basis: "Welt plate: motor body on the intake side of the head, between cover and oil-filter module." },
  "vanos-intake": { componentId: "vanos-intake", status: "schematic", basis: "Intake VANOS solenoid sits on the timing face of the head. It is not resolved as a separate surface on the Welt 3/4 plate (the previous photo hit sat on the acoustic cover / oil cap). Selectable in 3D / X-ray only." },
  "vanos-exhaust": { componentId: "vanos-exhaust", status: "schematic", basis: "Exhaust VANOS solenoid sits on the timing face of the head. Not resolved on the Welt plate — the previous photo hit sat on the TwinPower script. Selectable in 3D / X-ray only." },
  crankcase: { componentId: "crankcase", status: "verified", basis: "Welt plate: aluminium block with factory casting texture, open deck not visible, bedplate joint toward the sump." },
  "oil-sump": { componentId: "oil-sump", status: "verified", basis: "Welt plate: painted steel sump on the stand, with factory fasteners and staining." },
  "oil-cap": { componentId: "oil-cap", status: "verified", basis: "Welt plate: filler cap at the top of the acoustic cover (timing/front of the valve cover)." },
  dme: { componentId: "dme", status: "verified", basis: "Welt plate: black Bosch DME on top of the plastic intake manifold, heatsink visible." },
  alternator: { componentId: "alternator", status: "probable", basis: "Welt plate: intake/front accessory, below the oil-filter module on the timing face." },
  "charge-pipe": { componentId: "charge-pipe", status: "verified", basis: "F30 bay plate: cold-side pipe across the front of the engine (blue in this capture). Not fitted on the isolated Welt display engine — that plate's front pipe is the turbo compressor outlet (boost pipe)." },
  "boost-pipe": { componentId: "boost-pipe", status: "verified", basis: "Welt plate: compressor-outlet pipe leaving the turbo toward the accessory drive, left of the timing face." },
  "serpentine-belt": { componentId: "serpentine-belt", status: "verified", basis: "Welt plate: accessory belt on the timing/front face, with real rib texture and pulley contact." },
  "crank-pulley": { componentId: "crank-pulley", status: "verified", basis: "Welt plate: crank damper at the bottom of the accessory drive, BMW centre cap visible." },
  "ac-compressor": { componentId: "ac-compressor", status: "probable", basis: "Welt plate: lowest accessory pulley, below the crank damper. Partially occluded by the stand." },
  "electric-coolant-pump": { componentId: "electric-coolant-pump", status: "probable", basis: "Welt plate: black plastic pump, intake/front, below the oil-filter module." },
  airbox: { componentId: "airbox", status: "verified", basis: "F30 bay plate: vehicle-left airbox with BMW branding. Not present on the isolated Welt display engine." },
  intercooler: { componentId: "intercooler", status: "probable", basis: "F30 bay plate: cooling pack ahead of the engine. CAC core is behind the bumper/pack in this view." },
  "oil-cooler": { componentId: "oil-cooler", status: "probable", basis: "Welt plate: stacked-plate heat exchanger on the oil-filter module." },
  "cylinder-head": { componentId: "cylinder-head", status: "schematic", basis: "Most of the aluminium head is hidden by the acoustic cover on the Welt plate. A photo hit on the lower cover previously mislabelled the beauty cover as the head. Selectable in 3D / X-ray only." },
  "belt-tensioner": { componentId: "belt-tensioner", status: "schematic", basis: "Accessory-drive tensioner on the exhaust side of the timing face. In the Welt 3/4 plate it is occluded by the boost pipe and heat shield — a photo hit here previously labelled the pipe. Selectable in 3D / X-ray only." },
  "map-thermostat": { componentId: "map-thermostat", status: "probable", basis: "Welt plate: MAP-controlled thermostat housing on the lower-front of the oil-filter module, not a separate body beside the pump." },
  "vacuum-reservoir": { componentId: "vacuum-reservoir", status: "schematic", basis: "ST1111 places it on the acoustic cover underside. Not resolved as a separate surface on either licensed photograph." },
  wastegate: { componentId: "wastegate", status: "schematic", basis: "Integrated on the turbine housing. Actuator body is not separately resolved in the Welt three-quarter capture." },
  "blow-off-valve": { componentId: "blow-off-valve", status: "schematic", basis: "ST1111 lists an integrated compressor blow-off valve. Not a separately captured surface in this set." },
  "catalyst-interface": { componentId: "catalyst-interface", status: "schematic", basis: "Close-coupled converter sits below the turbine outlet, out of frame on both plates. Diagram-only in this viewer." },
  injectors: { componentId: "injectors", status: "schematic", basis: "Seated in the head under the rail and cover. No cover-off photograph in the licensed set." },
  "vacuum-pump": { componentId: "vacuum-pump", status: "schematic", basis: "Engine-driven two-stage pump. Location reconstructed from ST1111 — not visible on the Welt or F30 plates." },
};

export function assertMeshIdentity(componentId: string): MeshIdentity {
  const ident = meshIdentity[componentId];
  if (!ident) {
    return { componentId: "unidentified-component", status: "unidentified", basis: "No identity record for this mesh. Do not attach a specific N20 part name." };
  }
  return ident;
}
