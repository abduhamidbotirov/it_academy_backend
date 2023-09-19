import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL as string);

async function uploaderImg(data: any, name: string) {
  cloudinary.uploader.destroy(name);
  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader
      .upload_stream(
        {
          folder: "video",
          public_id: name,
          use_filename: true,
        },
        async (error, result) => {
          if (error) {
            console.error("Error uploading img to Cloudinary:", error);

          } else if (result) {
            // Create a new work experience record
            resolve(result.secure_url)

          }
        }
      ).end(data)
  })

}


async function uploaderVideo(data: any, name: string) {
  cloudinary.uploader.destroy(name);
  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader
      .upload_stream(
        {
          folder: "video", // Video fayllarni "video" papkasiga yuklash
          public_id: name,
          use_filename: true,
          resource_type: "video", // Fayl turi sifatida "video" ni aniqlash
        },
        async (error, result) => {
          if (error) {
            console.error("Video yuklashda xatolik:", error);
          } else if (result) {
            resolve(result.secure_url);
          }
        }
      )
      .end(data);
  });
}

export {
  uploaderVideo,
  uploaderImg
}
