import { Metadata } from "next";
import CookiePolicyContent from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how m.city uses cookies and similar technologies to enhance your experience.",
  robots: { index: true, follow: true },
};

type Props = { params: Promise<{ locale: string }> };

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  return <CookiePolicyContent locale={locale} />;
}