import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// import multer from "multer";

// const storage = multer.memoryStorage();

// export const upload = multer({
// 	storage,
// 	limits: { fileSize: 5 * 1024 * 1024 },
// 	fileFilter: (_req, file, cb) => {
// 		if (file.mimetype !== "application/pdf") {
// 			cb(new Error("Only PDF files are allowed"));
// 		} else {
// 			cb(null, true);
// 		}
// 	},
// });
