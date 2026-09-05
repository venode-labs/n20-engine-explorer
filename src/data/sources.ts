export type AuthorityLevel = "A" | "B" | "C" | "D";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessed: string;
  authorityLevel: AuthorityLevel;
  notes?: string;
}

/**
 * Provenance for technical claims. Authority:
 * A = BMW primary (training, TSB, TIS)
 * B = recognised technical / market reference
 * C = corroborating secondary
 * D = unverified
 */
export const sources: Record<string, Source> = {
  st1111: {
    id: "st1111",
    title: "ST1111 N20 Engine — Technical Training / Product Information",
    publisher: "BMW Group (Service training)",
    url: "https://archive.org/download/BMWTechnicalTrainingDocuments/ST1111%20N20%20Engine/N20%20Engine.pdf",
    accessed: "05/09/2026",
    authorityLevel: "A",
    notes:
      "Primary mechanical and systems description of the N20 family. US training print; engine architecture is family-wide. Market-specific calibration and suffix remain VIN-dependent.",
  },
  nhtsaB111212: {
    id: "nhtsaB111212",
    title: "SI B11 12 12 — N20 Engine: Engine Oil Filter Application",
    publisher: "BMW / NHTSA TSB archive",
    url: "https://static.nhtsa.gov/odi/tsbs/2013/MC-10149427-9999.pdf",
    accessed: "05/09/2026",
    authorityLevel: "A",
    notes:
      "Documents a running change: black plastic oil-filter housing before 06/2012; silver aluminium housing from 06/2012. A 2015 F32 is expected to use the aluminium housing — confirm on the vehicle.",
  },
  ausReviewF32: {
    id: "ausReviewF32",
    title: "Review: BMW F32 4-Series Coupe (2013–20)",
    publisher: "Australian Car.Reviews",
    url: "https://www.australiancar.reviews/review-bmw-f32-4-series-coupe-2013-20/",
    accessed: "05/09/2026",
    authorityLevel: "B",
    notes:
      "Australian-market F32 428i listed as 2.0-litre N20 B20, 180 kW / 350 Nm, 2013–2016.",
  },
  autoData428i: {
    id: "autoData428i",
    title: "BMW 4 Series Coupe (F32) 428i (245 PS) technical data",
    publisher: "auto-data.net",
    url: "https://www.auto-data.net/en/bmw-4-series-coupe-f32-428i-245hp-18590",
    accessed: "05/09/2026",
    authorityLevel: "B",
    notes:
      "Published figures: 1997 cm³, 84 × 90.1 mm, 10.0:1, twin-scroll turbo, direct injection, N20B20A designation. Exact production suffix is VIN-dependent.",
  },
  bmwrepairOil: {
    id: "bmwrepairOil",
    title: "Engine Oil Service — BMW N20 Turbo 4-Cylinder Engine",
    publisher: "BMW Repair Guide",
    url: "https://bmwrepairguide.com/repair_service/engine-oil-service-n20-4-cylinder-engine/",
    accessed: "05/09/2026",
    authorityLevel: "B",
  },
  bmwrepairHpfp: {
    id: "bmwrepairHpfp",
    title: "High Pressure Fuel Pump Repair — BMW N20 Turbo 4-Cylinder Engine",
    publisher: "BMW Repair Guide",
    url: "https://bmwrepairguide.com/repair_service/high-pressure-fuel-pump-repair-bmw-n20-turbo-4-cylinder-engine/",
    accessed: "05/09/2026",
    authorityLevel: "B",
  },
  fcpValveCover: {
    id: "fcpValveCover",
    title: "How To Replace A BMW N20 Or N26 Valve Cover Gasket (F30)",
    publisher: "FCP Euro",
    url: "https://www.fcpeuro.com/blog/how-to-replace-a-bmw-n20-n26-valve-cover-gasket-f30",
    accessed: "05/09/2026",
    authorityLevel: "C",
    notes: "Photographic location of HPFP, coils, Valvetronic connector, oil cap. Not a BMW primary source.",
  },
  fcpOfh: {
    id: "fcpOfh",
    title: "BMW N20 and N26 Oil Filter Housing Gasket Replacement DIY",
    publisher: "FCP Euro",
    url: "https://www.youtube.com/watch?v=NhFKtf2tP1o",
    accessed: "05/09/2026",
    authorityLevel: "C",
  },
  visualBay: {
    id: "visualBay",
    title: "In-bay photographs of N20 in F3x engine compartments (visual comparison set)",
    publisher: "Multiple published workshop / parts photographs",
    url: "",
    accessed: "05/09/2026",
    authorityLevel: "C",
    notes:
      "Used only to verify external silhouette: beauty cover, oil-filter module, turbo side, charge plumbing. Not used as a source of part numbers or specifications.",
  },
  wikimediaBay: {
    id: "wikimediaBay",
    title: "BMW 328i F30 2012 Motorraum",
    publisher: "Wikimedia Commons — HLW, CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:BMW_328i_F30_2012_Motorraum_1.jpg",
    accessed: "05/09/2026",
    authorityLevel: "C",
    notes:
      "Installed N20 in an LHD F30 328i. Primary in-bay photographic plate. Early-2012 car may still carry the pre-06/2012 plastic oil-filter housing.",
  },
  wikimediaWelt: {
    id: "wikimediaWelt",
    title: "BMW N20 Engine (BMW Welt display)",
    publisher: "Wikimedia Commons — Hullie (AHHM van Hulten), CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:BMW_N20_Engine.JPG",
    accessed: "05/09/2026",
    authorityLevel: "C",
    notes:
      "Photograph of a physical N20 on a stand at BMW Welt, Munich, 30 April 2012. Primary isolated-engine photographic plate. The visual mesh is this photograph, not a modelled reconstruction.",
  },
};

export function sourceList(ids: string[]): Source[] {
  return ids.map((id) => sources[id]).filter(Boolean);
}

export function authorityLabel(level: AuthorityLevel): string {
  switch (level) {
    case "A":
      return "BMW primary";
    case "B":
      return "Technical reference";
    case "C":
      return "Secondary / visual";
    default:
      return "Unverified";
  }
}
