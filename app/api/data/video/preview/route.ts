import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

function generatePreview(filePath: string, animeDirectoryPath: string) {
  const outputFilePath = path.join(animeDirectoryPath, "preview.mp4");

  // Check if the preview already exists
  if (!fs.existsSync(outputFilePath)) {
    ffmpeg.ffprobe(filePath, function (err, metadata) {
      if (err) {
        console.error("Error getting video metadata: " + err.message);
        return;
      }

      const duration = metadata.format.duration as number; // Duration in seconds
      const seekTime = duration * 0.15; // 15% of the video

      ffmpeg(filePath)
        .seekInput(seekTime)
        .duration(60) // Generate a 60 seconds preview
        .outputOptions(["-crf 23", "-preset veryfast"])
        .output(outputFilePath)
        .on("error", (err) => {
          console.error("Error generating preview: " + err.message);
        })
        .run();
    });
  }
}
export async function GET() {
  const rootDirectoryPath = path.join(process.cwd(), "public");

  // Browse all folders in 'public'
  fs.readdir(rootDirectoryPath, (err, folders) => {
    if (err) {
      return Response.json({ error: "Unable to scan directory: " + err });
    }

    // Browse each 'anime' folder
    folders.forEach((folder) => {
      const animeDirectoryPath = path.join(rootDirectoryPath, folder, "anime");

      fs.readdir(animeDirectoryPath, (err, seasons) => {
        if (err) {
          console.error("Unable to scan directory: " + err);
          return;
        }

        // Browse all files in 'Season01'
        seasons.forEach((season) => {
          if (season === "Season01") {
            const seasonPath = path.join(animeDirectoryPath, season);
            fs.readdir(seasonPath, (err, files) => {
              if (err) {
                console.error("Unable to scan directory: " + err);
                return;
              }

              // Generate a preview for the first episode
              files.forEach((file) => {
                if (file === "01-001.mp4") {
                  const filePath = path.join(seasonPath, file);
                  generatePreview(filePath, animeDirectoryPath);
                }
              });
            });
          }
        });
      });
    });
  });

  return Response.json({
    message: "Preview generation started.",
  });
}
