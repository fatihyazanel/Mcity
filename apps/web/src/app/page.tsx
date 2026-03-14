import { locales, defaultLocale } from "@/lib/i18n/config";
import { redirect } from "next/navigation";

// Root page redirects to default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
