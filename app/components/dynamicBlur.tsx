import fs from "fs/promises";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import React from "react";

const DynamicBlur: React.FC<{
  src: string;
  alt: string;
  className: string;
}> = async ({ src, alt, className }) => {
  const imagePath = src.replace("/api/image?imagePath=", "");

  let file;
  try {
    file = await fs.readFile(imagePath);
  } catch (err) {
    return null; // Or handle the error in another way
  }

  let base64;
  try {
    base64 = await getPlaiceholder(file);
  } catch (error) {
    return null; // Or handle the error in another way
  }

  return (
    <Image
      src={src}
      alt={`Cover image de ${alt}`} // if the image conveys information
      quality={50}
      sizes="(min-width: 1540px) calc(20vw - 122px), (min-width: 1280px) calc(20vw - 96px), (min-width: 1040px) calc(25vw - 116px), (min-width: 780px) calc(33.33vw - 80px), calc(50vw - 16px)"
      placeholder="blur"
      blurDataURL={base64.base64} // Convert base64 object to string
      width={200}
      height={800}
      className={className}
    />
  );
};

export default DynamicBlur;
