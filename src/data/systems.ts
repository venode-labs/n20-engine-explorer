export const engineSystems = [
  { id: "all", label: "All systems" },
  { id: "air", label: "Air / boost" },
  { id: "fuel", label: "Fuel" },
  { id: "ignition", label: "Ignition" },
  { id: "mechanical", label: "Mechanical" },
  { id: "lubrication", label: "Lubrication" },
  { id: "cooling", label: "Cooling" },
  { id: "accessories", label: "Accessories" },
  { id: "exhaust", label: "Exhaust" },
  { id: "vacuum", label: "Vacuum" },
  { id: "electrical", label: "Electrical" },
] as const;

export type EngineSystemId = (typeof engineSystems)[number]["id"];
