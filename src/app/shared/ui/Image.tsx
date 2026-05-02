"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface CarImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

const CarImage = ({
  src,
  alt = "Car image",
  width,
  height,
  className = "",
  priority,
  ...props
}: CarImageProps) => {
  const [imgSrc, setImageSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => {
        if (imgSrc !== "/fallback_image.jpg") {
          setImageSrc("/fallback_image.jpg");
        }
      }}
    />
  );
};

export default CarImage;
