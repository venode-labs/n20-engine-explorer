export const engineSystems = [
  { id: "all", label: "All systems", short: "All", index: "00", blurb: "Every catalogued N20 component." },
  { id: "air", label: "Air / boost", short: "Air", index: "01", blurb: "Twin-scroll turbo path from airbox through the charge-air cooler to the throttle." },
  { id: "fuel", label: "Fuel", short: "Fuel", index: "02", blurb: "Cam-driven HPFP, rail and solenoid direct injectors." },
  { id: "ignition", label: "Ignition", short: "Spark", index: "03", blurb: "Four pencil coils under the acoustic cover, DME-timed." },
  { id: "mechanical", label: "Mechanical", short: "Mech", index: "04", blurb: "Crankcase, head, Valvetronic and double VANOS — the TVDI core." },
  { id: "lubrication", label: "Lubrication", short: "Oil", index: "05", blurb: "Sump, map-controlled pump, raw-oil cooler and filter module." },
  { id: "cooling", label: "Cooling", short: "Cool", index: "06", blurb: "Electric pump and map thermostat — no belt-driven water pump." },
  { id: "accessories", label: "Accessories", short: "Drive", index: "07", blurb: "Serpentine belt, alternator, A/C compressor. Steering and coolant are electric." },
  { id: "exhaust", label: "Exhaust", short: "Exh", index: "08", blurb: "Air-gap twin-scroll manifold into the turbo, then the close-coupled catalyst." },
  { id: "vacuum", label: "Vacuum", short: "Vac", index: "09", blurb: "Two-stage pump for brake servo and, on pneumatic engines, wastegate control." },
  { id: "electrical", label: "Electrical", short: "DME", index: "10", blurb: "Bosch MEVD17.2.4 mounted on the intake manifold." },
] as const;

export type EngineSystemId = (typeof engineSystems)[number]["id"];

export const systemById = Object.fromEntries(engineSystems.map((s) => [s.id, s]));
