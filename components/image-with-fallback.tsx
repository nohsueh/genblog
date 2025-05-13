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

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
}
