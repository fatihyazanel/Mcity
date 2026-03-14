import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "m.city — City & Football Culture",
  description: "The ultimate city and football culture guide for Manchester. News, products, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
