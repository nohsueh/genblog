"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdsenseReloader() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, [pathname]);

  return null;
}
