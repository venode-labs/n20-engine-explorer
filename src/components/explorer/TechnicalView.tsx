import { vehicle } from "@/data/vehicle";
import { sources } from "@/data/sources";

const baseline = [
  ["Vehicle", `${vehicle.name} ${vehicle.chassis} ${vehicle.body}`],
  ["Market / year", `${vehicle.market} · ${vehicle.modelYear}`],
  ["Steering", vehicle.steering],
  ["Engine family", `${vehicle.engineFamily} · ${vehicle.engineConfiguration}`],
  ["Capacity", `${vehicle.displacementCc.toLocaleString("en-AU")} cc`],
  ["Output", `${vehicle.powerKw} kW @ ${vehicle.powerRpm} rpm`],
  ["Torque", `${vehicle.torqueNm} Nm @ ${vehicle.torqueRpm} rpm`],
  ["Valvetrain", vehicle.valvetrain],
  ["Aspiration / injection", `${vehicle.aspiration} · ${vehicle.injection}`],
  ["Published engine code", `${vehicle.publishedEngineCode} — VIN verification required`],
] as const;

export function TechnicalView() {
  return (
    <div className="h-full overflow-y-auto bg-bg">
      <article className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <p className="text-2xs uppercase tracking-wide text-accent">Reference</p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight text-balance text-fg">
          2015 BMW 428i F32 — Australian N20 reference
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-pretty text-muted">
          Use this page for the vehicle baseline, source-photo context and limits of the visualisation. It is an independent
          reference, not a substitute for BMW TIS / ISTA procedures.
        </p>

        <section className="mt-8 border-y border-border py-5">
          <h2 className="text-sm font-medium tracking-tight text-fg">What the viewer can prove</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            <li><span className="font-medium text-fg">Photo:</span> Photo mode remains the visual source of truth. Clickable regions exist only where a component was conservatively verified in that exact source image.</li>
            <li><span className="font-medium text-fg">3D / X-ray:</span> 3D and X-ray modes are schematic teaching views for orientation. They are not a dimensional scan or photorealistic digital twin.</li>
            <li><span className="font-medium text-fg">Part numbers:</span> Exact OE identification is shown only when verified; otherwise the viewer explicitly requires VIN confirmation.</li>
          </ul>
        </section>

        <h2 className="mt-9 text-sm font-medium tracking-tight text-fg">Vehicle baseline</h2>
        <dl className="mt-3 grid grid-cols-1 gap-x-8 text-sm sm:grid-cols-2">
          {baseline.map(([key, value]) => (
            <div key={key} className="border-t border-border py-2.5">
              <dt className="text-xs text-muted">{key}</dt>
              <dd className="mt-0.5 text-fg">{value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-9 text-sm font-medium tracking-tight text-fg">Australian right-hand-drive context</h2>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">
          The N20 itself is not mirrored for right-hand drive. The engine remains longitudinal: accessory drive toward the
          radiator, bellhousing toward the bulkhead, intake and oil-filter module on vehicle-left, turbocharger and exhaust
          on vehicle-right. Steering-column, pedal-box and brake-booster packaging changes around the engine in Australian
          cars. Unverified RHD-only hose-routing claims are deliberately omitted.
        </p>

        <h2 className="mt-9 text-sm font-medium tracking-tight text-fg">Source photographs</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The isolated engine and in-bay views come from different physical N20 installations. They are complementary
          references, not a photogrammetry set of one engine.
        </p>
        <div className="mt-4 grid items-start gap-4 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-[6px] border border-border bg-surface">
            <img
              src="/engine/photos/n20-welt-full.jpg"
              alt="Physical BMW N20 engine on a stand at BMW Welt, Munich, April 2012."
              className="w-full outline outline-1 -outline-offset-1 outline-white/10"
              width={1365}
              height={2048}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="px-3 py-2 text-xs leading-relaxed text-muted">
              Hullie (AHHM van Hulten), BMW N20 Engine, BMW Welt, 30 April 2012. Wikimedia Commons, CC BY-SA 3.0. Primary isolated-engine plate.
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-[6px] border border-border bg-surface">
            <img
              src="/engine/photos/f30-bay.jpg"
              alt="BMW 328i F30 2012 engine bay showing an N20 installation."
              className="w-full outline outline-1 -outline-offset-1 outline-white/10"
              width={2560}
              height={1706}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="px-3 py-2 text-xs leading-relaxed text-muted">
              HLW, BMW 328i F30 2012 Motorraum. Wikimedia Commons, CC BY-SA 3.0. LHD F30 reference used only for verified in-bay locations.
            </figcaption>
          </figure>
        </div>

        <details className="mt-9 border-t border-border pt-4">
          <summary className="cursor-pointer select-none text-sm font-medium text-fg">Technical references and attribution</summary>
          <ol className="mt-4 space-y-3 text-sm">
            {Object.values(sources).map((source) => (
              <li key={source.id} className="border-l border-border pl-3">
                <p className="text-fg">{source.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {source.publisher}
                  {source.url ? (
                    <>
                      {" · "}
                      <a href={source.url} className="underline-offset-2 hover:text-fg hover:underline" target="_blank" rel="noreferrer">source</a>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            BMW and related marks are trademarks of BMW AG. Their appearance here documents the photographed physical
            object. Viscerra is independent and not affiliated with BMW AG.
          </p>
        </details>
      </article>
    </div>
  );
}
