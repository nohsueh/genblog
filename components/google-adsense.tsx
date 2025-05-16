"use client";

import { useEffect } from "react";

export default function GoogleAdsense({ clientId }: { clientId: string }) {
  useEffect(() => {
    if (!clientId) return;

    if (document.getElementById("google-adsense-script")) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      return;
    }

    const script = document.createElement("script");
    script.id = "google-adsense-script";
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${clientId}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    script.onload = () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };
  }, []);

  return null;
}
