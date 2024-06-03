import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
  const imagePath = request.nextUrl.searchParams.get("imagePath");

  try {
    const fullPath = imagePath ? path.join(imagePath) : null;
    if (!fullPath) {
      throw new Error("Image path is null");
    }
    const imageBuffer = fs.readFileSync(fullPath);

    const response = new NextResponse(imageBuffer, {
      headers: { "Content-Type": "image/webp" },
    });

    // Set the Cache-Control header to cache the response for 24 hours
    response.headers.set("Cache-Control", "public, max-age=86400");

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
