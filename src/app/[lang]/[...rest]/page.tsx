import { notFound } from "next/navigation";

/** Send unknown paths under /en or /es to the branded [lang]/not-found page. */
export default function CatchAll() {
  notFound();
}
