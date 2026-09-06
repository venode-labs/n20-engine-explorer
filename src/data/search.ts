import { components, type EngineComponent } from "./components";

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function searchableText(component: EngineComponent) {
  return normalise(
    [
      component.id,
      component.canonicalName,
      component.system,
      ...component.aliases,
      component.description,
      component.function,
      component.howItWorks ?? "",
      component.location,
      component.serviceAccess ?? "",
      ...(component.inspectionNotes ?? []),
      ...(component.commonSymptoms ?? []),
    ].join(" "),
  );
}

export function searchComponentsRich(query: string): EngineComponent[] {
  const q = normalise(query);
  if (!q) return components;

  const terms = q.split(/\s+/).filter(Boolean);
  return components
    .map((component, index) => {
      const name = normalise(component.canonicalName);
      const aliases = component.aliases.map(normalise);
      const corpus = searchableText(component);
      if (!terms.every((term) => corpus.includes(term))) return null;

      let score = 4;
      if (name === q || normalise(component.id) === q) score = 0;
      else if (name.startsWith(q) || aliases.some((alias) => alias.startsWith(q))) score = 1;
      else if (name.includes(q) || aliases.some((alias) => alias.includes(q))) score = 2;
      else if ((component.commonSymptoms ?? []).some((symptom) => normalise(symptom).includes(q))) score = 3;

      return { component, score, index };
    })
    .filter((entry): entry is { component: EngineComponent; score: number; index: number } => entry !== null)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.component);
}
