import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL as string);

async function uploader(data: any,name:string) {
  cloudinary.uploader.destroy(name);
  return new Promise(async(resolve, reject) => {
    await cloudinary.uploader
      .upload_stream(
        {
          folder: "job",
          public_id: name,
          use_filename: true,
        },
        async (error, result) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error);
           
          } else if (result) {
            // Create a new work experience record
            resolve(result.secure_url)
            
          }
        }
      ).end(data)
  })
  
}
export default uploader