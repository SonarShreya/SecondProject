
//const CircularModel = require("../models/Circular");
const express = require("express");
const mongoose = require("mongoose"); // ✅ Added mongoose import
const Circular = require("./Circular");
const multer = require("multer");
const router = express.Router();
const path = require("path");
router.use('/uploads', express.static('uploads'));

// ✅ Configure Multer for File Upload
// Multer setup for handling PDF file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});



router.delete("/deleteCircular/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received DELETE request for ID:", id); // Log received ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ID format:", id);
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deletedCircular = await Circular.findByIdAndDelete(id);
    console.log("Deleted Circular Data:", deletedCircular); // Log deleted data

    if (!deletedCircular) {
      console.log("Circular not found in DB:", id);
      return res.status(404).json({ message: "Circular not found" });
    }

    res.json({ message: "Circular deleted successfully" });
  } catch (error) {
    console.error("Error deleting circular:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get('/circulars/searchCirculars/:query', async (req, res) => {
  const searchQuery = req.params.query;
  
  try {
    const results = await Circular.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { circularNo: { $regex: searchQuery, $options: 'i' } },
        { pdfFile: { $regex: searchQuery, $options: 'i' } },
      ]
    });

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: "No records found" });
    }
  } catch (error) {
    console.error("Error searching Circulars:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/updateCircular/:id", upload.single("pdfFile"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // Data that you want to update

    // If a new file is uploaded, update the file path in updateData
    if (req.file) {
      console.log("Received new file:", req.file); // Debugging

      updateData.pdfFile = req.file.path; // Update the file path if a new PDF is provided
    }

    // Check if circular exists before updating
    const circularExists = await Circular.findById({ _id: id });
    if (!circularExists) {
      return res.status(404).json({ message: 'Circular not found' });
    }

    // Update the circular with the new data
    const updatedCircular = await Circular.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCircular) {
      return res.status(400).json({ message: 'Failed to update circular' });
    }

    res.status(200).json({
      message: 'Circular updated successfully',
      updatedCircular,
      pdfFile: req.file ? req.file.path : updatedCircular.pdfFile // Return updated PDF path if updated
    });

  } catch (error) {
    console.error("Error updating circular:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});







router.post("/insertCircular", upload.single("pdfFile"), async (req, res) => {
  try {
    console.log("Received file:", req.file); // Debugging

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const { srNo, title, draftCircularNo, draftCircularDate, finalCircularNo, finalCircularDate, publicationDate, ConcernSection } = req.body;
    const pdfFile = req.file.path; // Ensure file path is stored correctly

    const newCircular = new Circular({
      srNo,
      title,
      draftCircularNo,
      draftCircularDate,
      finalCircularNo,
      finalCircularDate,
      publicationDate,
      ConcernSection,
      pdfFile, // Store file path
    });

    await newCircular.save();

    // **Modify response to include pdfFile**
    res.status(201).json({ 
      message: "Circular added successfully!", 
      circular: newCircular, 
      pdfFile: pdfFile // Explicitly return file path 
    });

  } catch (error) {
    console.error("Error adding circular:", error);
    res.status(500).json({ message: "Error adding circular", error: error.message });
  }
});


// GET API to fetch all circulars
// router.get("/api/circulars", async (req, res) => {
//   try {
//     const circulars = await Circular.find(); // Fetch all documents
//     res.json(circulars); // Return data in JSON format
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching circulars", error: error.message });
//   }
// });



router.get("/api/circulars", async (req, res) => {
  try {
    const circulars = await Circular.find(); // Fetch all documents
    // Map through circulars to include full URL for pdfFile
    const result = circulars.map(circular => ({
      ...circular.toObject(),
     // pdfFile: `http://localhost:5001/uploads/${circular.pdfFile}` // Construct full URL for the PDF
    }));
    res.json(circulars); // Return data in JSON format with pdfFile URL
  } catch (error) {
    res.status(500).json({ message: "Error fetching circulars", error: error.message });
  }
});


// Delete Circular by ID with ObjectId validation
router.delete("/deleteCircular/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deletedCircular = await Circular.findByIdAndDelete(id);
    if (!deletedCircular) {
      return res.status(404).json({ message: "Circular not found" });
    }
    res.json({ message: "Circular deleted successfully" });
  } catch (error) {
    console.error("Error deleting circular:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



module.exports = router;
