import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import config from "../config";

const s3 = new S3Client({
	region: config.AWS_REGION,
	credentials: {
		accessKeyId: config.AWS_ACCESS_KEY_ID,
		secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
	},
});

export const uploadToS3 = async (file: Express.Multer.File, folder: string) => {
	const key = `${folder}/${Date.now()}-${file.originalname}`;

	const command = new PutObjectCommand({
		Bucket: config.AWS_BUCKET_NAME,
		Key: key,
		Body: file.buffer,
		ContentType: file.mimetype,
	});

	await s3.send(command);

	return `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;
};
