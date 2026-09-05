import { vehicle } from "@/data/vehicle";
import { sources, authorityLabel } from "@/data/sources";
import { meshIdentity } from "@/lib/mesh-identity";
import { components } from "@/data/components";

export function TechnicalView() {
  const identities = Object.values(meshIdentity);

  return (
    <div className="h-full overflow-y-auto bg-bg">
      <article className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <p className="text-2xs uppercase tracking-wide text-accent">Technical notes</p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight text-balance text-fg">
          2015 BMW 428i F32 — Australian N20
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-pretty text-muted">
          Independent technical visualisation. Not affiliated with BMW AG. The engine you see is a photograph of a
          physical BMW N20, not a modelled or rendered reconstruction. Component data is from BMW service-training
          material. This is not a substitute for TIS / ISTA procedures.
        </p>

        <h2 className="mt-10 text-sm font-medium tracking-tight text-fg">Source photographs</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-xl border border-border bg-surface">
            <img
              src="/engine/photos/n20-welt-full.jpg"
              alt="Physical BMW N20 engine on a stand at BMW Welt, Munich, April 2012."
              className="w-full outline outline-1 -outline-offset-1 outline-white/10"
              width={1365}
              height={2048}
            />
            <figcaption className="px-3 py-2 text-2xs leading-relaxed text-muted">
              Hullie (AHHM van Hulten), BMW N20 Engine, BMW Welt, 30 April 2012. Wikimedia Commons, CC BY-SA 3.0.
              Isolated display engine — primary photographic plate.
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-xl border border-border bg-surface">
            <img
              src="/engine/photos/f30-bay.jpg"
              alt="BMW 328i F30 2012 engine bay, showing an N20 with acoustic cover, airbox on vehicle-left, and charge plumbing across the front."
              className="w-full outline outline-1 -outline-offset-1 outline-white/10"
              width={2560}
              height={1706}
            />
            <figcaption className="px-3 py-2 text-2xs leading-relaxed text-muted">
              HLW, BMW 328i F30 2012 Motorraum. Wikimedia Commons, CC BY-SA 3.0. LHD F30; in-bay plate. A 2012 car may
              still carry the pre-06/2012 plastic oil-filter housing.
            </figcaption>
          </figure>
        </div>

        <h2 className="mt-10 text-sm font-medium tracking-tight text-fg">Vehicle baseline</h2>
        <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {[
            ["Chassis", `${vehicle.name} ${vehicle.chassis} ${vehicle.body}`],
            ["Market / year", `${vehicle.market} · ${vehicle.modelYear}`],
            ["Steering", vehicle.steering],
            ["Engine family", `${vehicle.engineFamily} · ${vehicle.engineConfiguration}`],
            ["Capacity", `${vehicle.displacementCc.toLocaleString("en-AU")} cc`],
            ["Bore × stroke", `${vehicle.boreMm} × ${vehicle.strokeMm} mm`],
            ["Compression", vehicle.compression],
            ["Output", `${vehicle.powerKw} kW @ ${vehicle.powerRpm} rpm`],
            ["Torque", `${vehicle.torqueNm} Nm @ ${vehicle.torqueRpm} rpm`],
            ["Valvetrain", vehicle.valvetrain],
            ["Aspiration", vehicle.aspiration],
            ["Injection", vehicle.injection],
            ["Engine code", `${vehicle.publishedEngineCode} — VIN verification required`],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-border py-2">
              <dt className="text-2xs uppercase tracking-wide text-subtle">{k}</dt>
              <dd className="text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-4 list-disc space-y-1 pl-4 text-sm text-muted">
          {vehicle.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <h2 className="mt-10 text-sm font-medium tracking-tight text-fg">Model status</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The CGI reconstruction previously used as the primary engine was removed from the production scene (archived
          as rejected). The live visual is a photographic plate of a real N20: unlit, unretouched albedo from the source
          JPEG. Invisible hit regions sit in front of the plate for picking. Dense photogrammetry was not possible — the
          licensed set is two photographs of two different physical engines, not an overlapping capture of one object.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[40rem] text-left text-xs">
            <thead className="text-2xs uppercase tracking-wide text-subtle">
              <tr>
                <th className="border-b border-border px-3 py-2 pr-3">Feature</th>
                <th className="border-b border-border px-3 py-2 pr-3">Mesh</th>
                <th className="border-b border-border px-3 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {identities.map((i) => (
                <tr key={i.componentId}>
                  <td className="border-b border-border px-3 py-2 pr-3 text-fg">{i.componentId}</td>
                  <td className="border-b border-border px-3 py-2 pr-3 uppercase text-accent">{i.status}</td>
                  <td className="border-b border-border px-3 py-2 text-muted">{i.basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-sm font-medium tracking-tight text-fg">Australian packaging</h2>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">
          The N20 itself is not mirrored for right-hand drive. In the F32 bay the engine sits longitudinally with the
          accessory drive toward the radiator and the bellhousing toward the bulkhead. Intake / oil-filter module sit on
          vehicle-left; turbocharger and exhaust sit on vehicle-right. Pedal box, steering column and brake booster sit
          on the right in Australian cars. Claims about other RHD-only hose routing that have not been verified are
          omitted.
        </p>

        <h2 className="mt-10 text-sm font-medium tracking-tight text-fg">Sources</h2>
        <ol className="mt-3 space-y-3 text-sm">
          {Object.values(sources).map((s) => (
            <li key={s.id}>
              <p className="text-fg">
                {s.title}{" "}
                <span className="text-2xs uppercase tracking-wide text-accent">{authorityLabel(s.authorityLevel)}</span>
              </p>
              <p className="text-xs text-muted">
                {s.publisher}
                {s.url ? (
                  <>
                    {" · "}
                    <a href={s.url} className="hover:text-fg" target="_blank" rel="noreferrer">
                      {s.url}
                    </a>
                  </>
                ) : null}
                {" · accessed "}
                {s.accessed}
              </p>
              {s.notes && <p className="mt-1 text-xs text-subtle">{s.notes}</p>}
            </li>
          ))}
        </ol>

        <h2 className="mt-10 text-sm font-medium tracking-tight text-fg">Catalogue</h2>
        <p className="mt-2 text-sm text-muted">{components.length} components in the structured database.</p>
        <p className="mt-8 text-2xs text-subtle">
          BMW, TwinPower Turbo and related marks are trademarks of BMW AG. Their appearance is documentary of the
          photographed physical object. Independent visualisation — not affiliated with BMW AG. Source photographs remain
          CC BY-SA 3.0; this viewer is an adaptation and carries the same attribution.
        </p>
      </article>
    </div>
  );
}
