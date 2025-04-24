// import { v2 as cloudinary } from "cloudinary";

import {v2 as cloudinary} from "cloudinary";
const CLOUDINARY_FOLDER = "mini_facebook";
// yo clodinary.uploader.upload_stream callback  vayekole yeslai hamile promise banayeko kinaki callaback ma async await use garna mildaina


async function uploadFile(files) {
  const uploadResults = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
          },
          (error, data) => {
            if (error) return reject(error);

            resolve(data);
          }
        )
        .end(file.buffer);
    });

    uploadResults.push(result);
  }

  return uploadResults;
}

export default uploadFile;

