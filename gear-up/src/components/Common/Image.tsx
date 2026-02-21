"use client"
import Image from "next/image";
import { ImgHTMLAttributes, RefObject, useState } from "react";

interface CarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string
    width: number
    height: number
    ref?: RefObject<HTMLImageElement | null>
}

const CarImage = ({ src, ref, width, height, ...props }: CarImageProps) => {

    const [imgSrc, setImageSrc] = useState(src);
    return (
        <Image
            {...props}
            ref={ref}
            src={imgSrc}
            onError={() => setImageSrc("/fallback_image.jpg")}
            alt="fallback_image"
            fill
        />
    );
}

export default CarImage;