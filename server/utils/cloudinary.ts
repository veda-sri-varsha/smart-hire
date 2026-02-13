import { v2 as cloudinary } from "cloudinary";
import config from "../config";

cloudinary.config({
	cloud_name: config.CLOUDINARY_CLOUD_NAME,
	api_key: config.CLOUDINARY_API_KEY,
	api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
	file: Express.Multer.File,
): Promise<string> => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					folder: "smart-hire/resumes",
					resource_type: "raw", // important for PDF
				},
				(error, result) => {
					if (error) return reject(error);
					resolve(result?.secure_url as string);
				},
			)
			.end(file.buffer);
	});
};
