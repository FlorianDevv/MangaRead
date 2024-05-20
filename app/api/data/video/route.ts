import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const rootDirectoryPath = path.join(process.cwd(), "public");

  // Browse all folders in 'public'
  fs.readdir(rootDirectoryPath, (err, folders) => {
    if (err) {
      return Response.json({ error: "Unable to scan directory: " + err });
    }

    // Browse each 'anime/Season XX' folder
    folders.forEach((folder) => {
      const animeDirectoryPath = path.join(rootDirectoryPath, folder, "anime");

      fs.readdir(animeDirectoryPath, (err, seasons) => {
        if (err) {
          console.error("Unable to scan directory: " + err);
          return;
        }

        // Browse all files in each season
        seasons.forEach((season) => {
          const seasonPath = path.join(animeDirectoryPath, season);
          fs.readdir(seasonPath, (err, files) => {
            if (err) {
              console.error("Unable to scan directory: " + err);
              return;
            }

            // Generate a thumbnail for each video file
            files.forEach((file) => {
              const filePath = path.join(seasonPath, file);
              const outputFilePath = filePath.replace(".mp4", ".webp");

              // Check if the thumbnail already exists
              if (!fs.existsSync(outputFilePath)) {
                ffmpeg(filePath)
                  .screenshots({
                    timestamps: ["15%"],
                    filename: file.replace(".mp4", ".webp"),
                    folder: seasonPath,
                    size: "1920x1080",
                  })
                  .videoFilters("crop=1920:800:0:0") // Updated line
                  .on("error", (err) => {
                    console.error(
                      "Error generating screenshot: " + err.message
                    );
                  });
              }
            });
          });
        });
      });
    });
  });

  return Response.json({
    message: "Thumbnail generation started.",
  });
}
