import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

function generatePreview(filePath: string, outputDirectoryPath: string) {
  const outputFilePath = path.join(outputDirectoryPath, "preview.mp4");

  if (!fs.existsSync(outputFilePath)) {
    ffmpeg.ffprobe(filePath, function (err, metadata) {
      if (err) {
        console.error("Error during ffprobe:", err);
        return;
      }

      const duration = metadata.format.duration as number;
      const seekTime = duration * 0.15;

      ffmpeg(filePath)
        .seekInput(seekTime)
        .duration(60)
        .outputOptions(["-crf 26", "-preset veryslow"])
        .output(outputFilePath)
        .on("error", (err) => {
          console.error("Error during ffmpeg processing:", err);
        })
        .run();
    });
  }
}

export async function GET() {
  let videoPath = "";
  const publicDirectoryPath = path.join(process.cwd(), "public");

  // Check if path.json exists and read the path from it
  const pathJson = path.join(process.cwd(), "path.json");
  if (fs.existsSync(pathJson)) {
    const customPath = fs.readFileSync(pathJson, "utf8");
    videoPath = JSON.parse(customPath).videoPath;
  }

  if (videoPath) {
    // Assuming the videoPath is the full path to the video file
    const filePath = videoPath;
    const outputDirectoryPath = publicDirectoryPath; // Ensure previews are saved in the public directory
    generatePreview(filePath, outputDirectoryPath);
  } else {
    console.error("No video path specified in path.json.");
  }

  return Response.json({
    message: "Preview generation started.",
  });
}
