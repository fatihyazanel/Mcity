"use client";

import { useEffect } from "react";

interface HtmlDirSetterProps {
  locale: string;
  dir: "ltr" | "rtl";
}

export default function HtmlDirSetter({ locale, dir }: HtmlDirSetterProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
