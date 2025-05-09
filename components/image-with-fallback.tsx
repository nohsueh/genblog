"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function ImageWithFallback({
  src,
  fallback: fallbackSrc,
  alt,
  ...rest
}: {
  src: string;
  fallback: string;
  alt: string;
} & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Suspense
      fallback={
        <Skeleton
          className={`block ${rest.width && ` w-[${rest.width}px]`} ${rest.height && ` h-[${rest.height}px]`}`}
        />
      }
    >
      <Image
        {...rest}
        src={imgSrc}
        alt={alt}
        onError={() => {
          setImgSrc(fallbackSrc);
        }}
      />
    </Suspense>
  );
}
