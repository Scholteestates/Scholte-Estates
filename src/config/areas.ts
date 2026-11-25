/**
 * Areas for the landing-page area explorer. Copy comes from the `area.places`
 * dictionary entries (same order). `towns` links each area to listing towns;
 * `map` places a pin on the schematic (not-to-scale) Costa Blanca map,
 * projected roughly from real coordinates into a 400 × 600 box.
 * `scene` names the demo home whose illustrative neighbourhood scene sets the
 * mood (atmosphere only: never presented as the real place). `place` is the
 * index into `area.places`. Areas without a scene are left out for now.
 */
export const areas = [
  { id: "ciudad-quesada", place: 0, towns: ["Ciudad Quesada"], map: { x: 72, y: 433 }, scene: "SE-DEMO-001" },
  { id: "torrevieja", place: 1, towns: ["Torrevieja"], map: { x: 84, y: 494 }, scene: "SE-DEMO-008" },
  { id: "orihuela-costa", place: 2, towns: ["Orihuela Costa"], map: { x: 62, y: 526 }, scene: "SE-DEMO-009" },
  { id: "guardamar", place: 3, towns: ["Guardamar del Segura"], map: { x: 98, y: 418 }, scene: "SE-DEMO-002" },
  { id: "north", place: 5, towns: ["Finestrat", "Altea"], map: { x: 300, y: 100 }, scene: "SE-DEMO-010" },
] as const;

/** Simplified coastline, south (Pilar de la Horadada) to north (Calpe). */
export const coastline =
  "M50 600 L56 560 L66 527 L90 497 L97 460 L102 420 L128 372 L156 340 L164 300 L172 253 L200 240 L204 193 L236 168 L268 143 L312 123 L342 84 L362 70 L380 51 L392 20 L400 0";
