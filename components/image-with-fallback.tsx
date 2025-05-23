"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageWithFallback({
  src,
  fallback,
  alt,
  ...rest
}: {
  src: string;
  fallback: string;
  alt: string;
} & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallback);
      }}
      onLoadingComplete={() => {
        setIsLoading(false);
      }}
      className={`transition-opacity duration-300 ${
        isLoading ? "opacity-0" : "opacity-100"
      } ${rest.className || ""}`}
    />
  );
}
