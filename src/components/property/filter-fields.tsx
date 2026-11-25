import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import type { PropertyFilters, PropertyType } from "@/lib/properties/types";
import { bedroomSteps, formatPrice, priceSteps } from "@/lib/properties/helpers";
import { ChevronDownIcon } from "../icons";

export type FilterLabels = Dictionary["properties"]["filters"] & { types: Dictionary["properties"]["types"] };

type Field = "town" | "type" | "maxPrice" | "minBeds";

/**
 * The four search selects, shared by the hero search (plain GET form,
 * works without JavaScript) and the live property browser.
 */
export function FilterFields({
  locale,
  labels,
  towns,
  types,
  values,
  onChange,
  tone = "light",
  idPrefix,
}: {
  locale: Locale;
  labels: FilterLabels;
  towns: string[];
  types: PropertyType[];
  values?: PropertyFilters;
  onChange?: (field: Field, value: string) => void;
  tone?: "light" | "plain";
  idPrefix: string;
}) {
  const controlled = Boolean(onChange);
  const v = (f: Field) => (values?.[f] ?? "").toString();
  const fieldProps = (f: Field) =>
    controlled
      ? { value: v(f), onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange!(f, e.target.value) }
      : { defaultValue: v(f) };

  const fields: { name: Field; label: string; options: { value: string; label: string }[] }[] = [
    {
      name: "town",
      label: labels.town,
      options: [{ value: "", label: labels.anyTown }, ...towns.map((t) => ({ value: t, label: t }))],
    },
    {
      name: "type",
      label: labels.type,
      options: [{ value: "", label: labels.anyType }, ...types.map((t) => ({ value: t, label: labels.types[t] }))],
    },
    {
      name: "maxPrice",
      label: labels.maxPrice,
      options: [
        { value: "", label: labels.anyPrice },
        ...priceSteps.map((p) => ({ value: String(p), label: `${labels.upTo} ${formatPrice(p, locale)}` })),
      ],
    },
    {
      name: "minBeds",
      label: labels.beds,
      options: [{ value: "", label: labels.anyBeds }, ...bedroomSteps.map((b) => ({ value: String(b), label: `${b}${labels.bedsPlus}` }))],
    },
  ];

  return (
    <>
      {fields.map((f) => (
        <div
          key={f.name}
          className={`relative flex min-w-0 flex-col justify-center py-3 ${
            tone === "light"
              ? "border-b border-ivory-200 px-4 even:border-l md:border-b-0 md:border-l md:px-5 md:first:border-l-0"
              : "border border-ivory-200 bg-ivory-50 px-5"
          }`}
        >
          <label htmlFor={`${idPrefix}-${f.name}`} className="text-[0.65rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">
            {f.label}
          </label>
          <select
            id={`${idPrefix}-${f.name}`}
            name={f.name}
            {...fieldProps(f.name)}
            className="mt-1 w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[0.9rem] text-forest-900 focus:outline-none md:text-[0.95rem]"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 bottom-4 size-4 md:right-5 text-gold-600" />
        </div>
      ))}
    </>
  );
}
