import type { Locale } from "./config";

const dictionaries: Record<Locale, () => Promise<Record<string, string>>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  he: () => import("./dictionaries/he.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Record<string, string>> {
  const loader = dictionaries[locale] ?? dictionaries["en"];
  return loader();
}
