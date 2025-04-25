// const express = require("express");
// const multer = require("multer");
// const router = require("../db/ordinanceRoutes");
// const router = express();

// // Multer configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Make sure this folder exists
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.pdfFile}`);
//     },
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// }).single("pdfFile"); // Field name must match

// // POST route to handle file uploads
// router.post("/Ordinances", (req, res) => {
//     upload(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             // Multer-specific errors
//             return res.status(400).json({ error: err.message });
//         } else if (err) {
//             // Other errors
//             return res.status(500).json({ error: "File upload failed" });
//         }

//         // File uploaded successfully
//         res.status(200).json({
//             message: "File uploaded successfully",
//             file: req.file, // This contains file metadata
//         });
//     });
// });
















// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => {
// // //     cb(null, "uploads/");
// // //   },
// // //   filename: (req, file, cb) => {
// // //     const timestamp = Date.now();
// // //     const originalName = file.originalname;
// // //     cb(null, `${timestamp}-${originalName}`);
// // //   },
// // // });

// // // const upload = multer({ storage });













// // //  const multer = require("multer");
// // //  const path = require("path"); // Import the 'path' module to handle file extensions
// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => {
// // //       cb(null, "./uploads"); // Ensure the "uploads" folder exists
// // //   },
// // //   filename: (req, file, cb) => {
// // //       cb(null, `${Date.now()}-${file.  pdfFile}`);
// // //   },
// // // });
// // // // Set up multer to handle the file upload
// // // const upload = multer({ storage: storage, fileFilter: fileFilter }).single('pdfFile');

// // // //const upload = multer({ storage });
// // // module.exports = upload;








// // const multer = require('multer');

// // const upload = multer({
// //     storage: multer.diskStorage({
// //         destination: function (req, file, cb) {
// //             cb(null, 'uploads/'); // Directory for file uploads
// //         },
// //         filename: function (req, file, cb) {
// //             cb(null, Date.now() + '-' + file.originalname);
// //         }
// //     }),
// //     fileFilter: function (req, file, cb) {
// //         // Add file filter logic if necessary
// //         cb(null, true);
// //     }
// // });

// // // Define the expected field name(s)
// // const uploadSingle = upload.single('pdfFile'); // For single file
// //const uploadMultiple = upload.array('images', 5); // For multiple files
