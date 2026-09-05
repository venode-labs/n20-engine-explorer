# Performance trade-offs

Desktop target: smooth orbit at 60 fps on a recent integrated GPU. Mobile uses a reduced quality path.

| Choice | Why |
| --- | --- |
| Procedural mesh, no GLB | No licensed N20 scan. Geometry is generated once in `useMemo`. |
| N8AO + SMAA | Evaluated and dropped: N8AO crushed the metallic read on a near-black stage. Antialiasing is the renderer MSAA path. |
| Shadows | Directional shadow map 1024, disabled on mobile. Contact shadows remain. |
| DPR cap | `[1, 1.75]` desktop, `[1, 1.25]` mobile. |
| Textures | Canvas PBR maps (256²), not KTX2 — small enough that Basis compression would cost more than it saves. |
| Draw calls | Parts are selectable groups, so they cannot all be merged. Repeated bolts share one geometry. |
| No LOD | Engine is always in view at inspection distance. |
| Frameloop always | Required for damping, explode, and flow overlay. |

Unknown coolant / lubrication hose routes are omitted rather than animated.
