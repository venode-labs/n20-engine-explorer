export type MeshIdentityStatus = "verified" | "probable" | "schematic" | "unidentified";

export interface MeshIdentity {
  componentId: string;
  status: MeshIdentityStatus;
  basis: string;
}

/**
 * Identity of a highlighted region on the photographic plate.
 * Visual resemblance on a CGI mesh is not used — the plate is a real photograph.
 */
export const meshIdentity: Record<string, MeshIdentity> = {
  "engine-cover": {
    componentId: "engine-cover",
    status: "verified",
    basis: "Visible on both plates: asymmetric black TwinPower Turbo acoustic cover with BMW roundel.",
  },
  "valve-cover": {
    componentId: "valve-cover",
    status: "schematic",
    basis: "Under the beauty cover in both photographs. Not a separately captured surface.",
  },
  "oil-filter-module": {
    componentId: "oil-filter-module",
    status: "verified",
    basis: "BMW Welt plate: aluminium housing with black cartridge cap on the intake/front corner. F30 bay plate shows the in-situ module (2012 car may still be the pre-06/2012 plastic housing).",
  },
  turbocharger: {
    componentId: "turbocharger",
    status: "verified",
    basis: "BMW Welt plate: exhaust-side turbo under gold heat shielding, vehicle-right of the standing engine.",
  },
  "exhaust-manifold": {
    componentId: "exhaust-manifold",
    status: "probable",
    basis: "Welt plate: exhaust face / heat-shielded volume above the turbo. Individual runners are not fully resolved in this capture.",
  },
  "intake-manifold": {
    componentId: "intake-manifold",
    status: "verified",
    basis: "Welt plate: plastic plenum on the intake side with DME sitting on top.",
  },
  "throttle-body": {
    componentId: "throttle-body",
    status: "probable",
    basis: "Welt plate: bulkhead end of the intake plenum. Occluded compared with a dedicated throttle photograph.",
  },
  hpfp: {
    componentId: "hpfp",
    status: "schematic",
    basis: "At the bulkhead end of the head — not in frame on the Welt 3/4 front plate or the F30 bay plate.",
  },
  "fuel-rail": {
    componentId: "fuel-rail",
    status: "schematic",
    basis: "Not resolved as a separate surface in the capture set.",
  },
  "ignition-coils": {
    componentId: "ignition-coils",
    status: "schematic",
    basis: "Under the acoustic cover. No cover-off photograph in the licensed set.",
  },
  "valvetronic-motor": {
    componentId: "valvetronic-motor",
    status: "probable",
    basis: "Welt plate: motor body on the intake side of the head, between cover and oil-filter module.",
  },
  "vanos-intake": {
    componentId: "vanos-intake",
    status: "probable",
    basis: "Welt plate: timing-end region of the head, intake side. Solenoid body is small in this capture.",
  },
  "vanos-exhaust": {
    componentId: "vanos-exhaust",
    status: "probable",
    basis: "Welt plate: timing-end region of the head, exhaust side.",
  },
  crankcase: {
    componentId: "crankcase",
    status: "verified",
    basis: "Welt plate: aluminium block with factory casting texture, open deck not visible, bedplate joint toward the sump.",
  },
  "oil-sump": {
    componentId: "oil-sump",
    status: "verified",
    basis: "Welt plate: painted steel sump on the stand, with factory fasteners and staining.",
  },
  "oil-cap": {
    componentId: "oil-cap",
    status: "verified",
    basis: "Welt plate: filler cap at the timing/front of the acoustic cover.",
  },
  dme: {
    componentId: "dme",
    status: "verified",
    basis: "Welt plate: black Bosch DME on top of the plastic intake manifold, heatsink visible.",
  },
  alternator: {
    componentId: "alternator",
    status: "verified",
    basis: "Welt plate: under the oil-filter module on the intake/front corner.",
  },
  "charge-pipe": {
    componentId: "charge-pipe",
    status: "verified",
    basis: "Both plates: black charge pipe across the front of the engine.",
  },
  "boost-pipe": {
    componentId: "boost-pipe",
    status: "probable",
    basis: "Welt plate: hose from the turbo compressor toward the front of the engine.",
  },
  "serpentine-belt": {
    componentId: "serpentine-belt",
    status: "verified",
    basis: "Welt plate: accessory belt on the timing/front face, with real rib texture and pulley contact.",
  },
  "crank-pulley": {
    componentId: "crank-pulley",
    status: "verified",
    basis: "Welt plate: crank damper at the bottom of the accessory drive.",
  },
  "ac-compressor": {
    componentId: "ac-compressor",
    status: "probable",
    basis: "Welt plate: lower accessory, intake/front. Partially occluded by the stand and belt.",
  },
  "electric-coolant-pump": {
    componentId: "electric-coolant-pump",
    status: "probable",
    basis: "Welt plate: intake/front lower region near the oil-filter module.",
  },
  airbox: {
    componentId: "airbox",
    status: "verified",
    basis: "F30 bay plate: vehicle-left airbox. Not present on the isolated Welt display engine.",
  },
  intercooler: {
    componentId: "intercooler",
    status: "probable",
    basis: "F30 bay plate: cooling pack ahead of the engine. CAC core is behind the bumper/pack in this view.",
  },
  "oil-cooler": {
    componentId: "oil-cooler",
    status: "probable",
    basis: "Welt plate: heat exchanger stacked with the oil-filter module.",
  },
  "cylinder-head": {
    componentId: "cylinder-head",
    status: "verified",
    basis: "Welt plate: aluminium head visible at the cover edges, with factory casting and fasteners.",
  },
  "belt-tensioner": {
    componentId: "belt-tensioner",
    status: "probable",
    basis: "Welt plate: accessory-drive tensioner on the front face.",
  },
  "map-thermostat": {
    componentId: "map-thermostat",
    status: "probable",
    basis: "Welt plate: coolant housing region near the oil-filter module.",
  },
};
