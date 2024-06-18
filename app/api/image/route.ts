import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const imagePath = url.searchParams.get("path");
  const width = parseInt(url.searchParams.get("w") || "0");
  const quality = parseInt(url.searchParams.get("q") || "75");

  try {
    if (!imagePath) {
      throw new Error("Missing required parameters");
    }

    const decodedImagePath = decodeURIComponent(imagePath);
    if (decodedImagePath.includes("..")) {
      throw new Error("Invalid image path");
    }

    const fullPath = path.join(process.cwd(), "public", decodedImagePath);

    // If not in cache, process the image
    const image = sharp(fullPath);
    if (width > 0) {
      image.resize(width);
    }
    const buffer = await image.webp({ quality }).toBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
