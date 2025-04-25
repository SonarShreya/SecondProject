
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const Ordinance = require("./Ordinance");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

// **GET** Route to Fetch Ordinances
router.get("/getOrdinances", async (req, res) => {
  try {
    const ordinances = await Ordinance.find(); // Fetch all ordinances
    res.json(ordinances); // Send ordinances as a response
  } catch (err) {
    console.error("Error fetching ordinances:", err);
    res.status(500).json({ message: "Failed to fetch ordinances." });
  }
});



// Update Ordinance by ID
router.put("/Ordinances/:id", upload.single("pdfFile"), async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = {
      title: req.body.title,
      draftOrdinanceNo: req.body.draftOrdinanceNo,
      draftOrdinanceDate: req.body.draftOrdinanceDate,
      finalOrdinanceNo: req.body.finalOrdinanceNo,
      finalOrdinanceDate: req.body.finalOrdinanceDate,
      dateOfPublication: req.body.dateOfPublication,
      concernSection: req.body.concernSection,
    };

    // If a new PDF file is uploaded, update the file path
    if (req.file) {
      updatedData.pdfFile = req.file.path;
    }

    const updatedOrdinance = await Ordinance.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedOrdinance) {
      return res.status(404).json({ message: "Ordinance not found" });
    }

    res.json({ message: "Ordinance updated successfully!", data: updatedOrdinance });
  } catch (error) {
    console.error("Error updating ordinance:", error);
    res.status(500).json({ message: "Failed to update ordinance", error });
  }
});



// //**POST** Route to Insert Ordinances (with file upload)
// router.post("/createOrdinances", upload.single("pdfFile"), async (req, res) => {
//   const { title, draftOrdinanceNo, draftOrdinanceDate, finalOrdinanceNo, finalOrdinanceDate, dateOfPublication, concernSection } = req.body;
//   const pdfFile = req.file ? req.file.path.replace("uploads/", "") : null; // Save file path

//   try {
//     const newOrdinance = new Ordinance({
      
//       title,
//       draftOrdinanceNo,
//       draftOrdinanceDate,
//       finalOrdinanceNo,
//       finalOrdinanceDate,
//       dateOfPublication,
//       concernSection,
//       pdfFile,
//     });

//     await newOrdinance.save();
//     res.json({ message: "Ordinance added successfully!" });
//   } catch (error) {
//     console.error("Error inserting ordinance:", error);
//     res.status(500).json({ message: "Failed to insert ordinance." });
//   }
// });
router.post("/createOrdinances", upload.single("pdfFile"), async (req, res) => {
  const {
    title,
    draftOrdinanceNo,
    draftOrdinanceDate,
    finalOrdinanceNo,
    finalOrdinanceDate,
    dateOfPublication,
    concernSection,
  } = req.body;

  const pdfFile = req.file ? req.file.path.replace("uploads/", "") : null;

  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  try {
    const newOrdinance = new Ordinance({
      title,
      draftOrdinanceNo,
      draftOrdinanceDate,
      finalOrdinanceNo,
      finalOrdinanceDate,
      dateOfPublication,
      concernSection,
      pdfFile,
    });

    await newOrdinance.save();
    res.json({ message: "Ordinance added successfully!" });
  } catch (error) {
    console.error("Error inserting ordinance:", error);
    res.status(500).json({ message: "Failed to insert ordinance.", error: error.message });
  }
});

router.delete("/deleteOrdinance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID for deletion:", id); // Debugging log

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Ordinance ID" });
    }

    // Find and delete the ordinance
    const ordinance = await Ordinance.findByIdAndDelete(id);

    if (!ordinance) {
      console.log("No ordinance found for ID:", id); // Debugging log
      return res.status(404).json({ message: "Ordinance not found" });
    }

    console.log("Deleted Ordinance:", ordinance); // Debugging log
    res.status(200).json({ message: "Ordinance deleted successfully" });
  } catch (error) {
    console.error("Error deleting ordinance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





// **SEARCH** Route
router.get("/searchOrdinances/:query", async (req, res) => {
  const query = req.params.query;
  
  try {
    const ordinances = await Ordinance.find({
      title: { $regex: query, $options: "i" }, // Case-insensitive search by title
    });
    res.json(ordinances);
  } catch (error) {
    console.error("Error searching ordinances:", error);
    res.status(500).json({ message: "Failed to search ordinances." });
  }
});












module.exports = router;

















