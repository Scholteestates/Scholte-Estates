import type { Dictionary } from "./dictionaries/en";
import type { CardLabels } from "@/components/property/property-card";
import type { FilterLabels } from "@/components/property/filter-fields";

export const cardLabels = (d: Dictionary): CardLabels => ({
  demoBadge: d.properties.demoBadge,
  examplePrice: d.properties.examplePrice,
  types: d.properties.types,
  condition: d.properties.condition,
  specs: d.properties.specs,
});

export const filterLabels = (d: Dictionary): FilterLabels => ({
  ...d.properties.filters,
  types: d.properties.types,
});
