const mongoose = require("mongoose");

const express = require("express");
const multer = require("multer");
const Regulation = require("./Regulation");
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Get all regulations
router.get("/", async (req, res) => {
  try {
    const regulations = await Regulation.find();
    res.json(regulations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching regulations" });
  }
});

// Search regulations by title
router.get("/search/:query", async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const regulations = await Regulation.find({
      title: { $regex: searchQuery, $options: "i" },
    });
    res.json(regulations);
  } catch (error) {
    res.status(500).json({ error: "Error searching regulations" });
  }
});



router.post("/", upload.single("pdfFile"), async (req, res) => {
  try {
    const newRegulation = new Regulation({
      srNo: req.body.srNo,
      title: req.body.title,
      draftRegulationNo: req.body.draftRegulationNo,
      draftRegulationDate: req.body.draftRegulationDate,
      finalRegulationNo: req.body.finalRegulationNo,
      finalRegulationDate: req.body.finalRegulationDate,
      dateOfPublication: req.body.dateOfPublication,
      concernSection: req.body.concernSection,
      pdfFile: req.file ? req.file.path : null, // Handle file path if uploaded
    });

    await newRegulation.save();
    res.json({ message: "Regulation added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding regulation" });
  }
});



router.patch("/:id", upload.single("pdfFile"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log("Received ID:", id);
    console.log("Received Data:", updateData);
    console.log("Received File:", req.file);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid regulation ID" });
    }

    const existingRegulation = await Regulation.findById(id);
    if (!existingRegulation) {
      return res.status(404).json({ message: "Regulation not found" });
    }

    const updatedFields = {
      srNo: updateData.srNo || existingRegulation.srNo,
      title: updateData.title || existingRegulation.title,
      draftRegulationNo: updateData.draftRegulationNo || existingRegulation.draftRegulationNo,
      draftRegulationDate: updateData.draftRegulationDate || existingRegulation.draftRegulationDate,
      finalRegulationNo: updateData.finalRegulationNo || existingRegulation.finalRegulationNo,
      finalRegulationDate: updateData.finalRegulationDate || existingRegulation.finalRegulationDate,
      dateOfPublication: updateData.dateOfPublication || existingRegulation.dateOfPublication,
      concernSection: updateData.concernSection || existingRegulation.concernSection,
    };

    if (req.file) {
      updatedFields.pdfFile = req.file.path;
    }

    const updatedRegulation = await Regulation.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({ message: "Regulation updated successfully", updatedRegulation });
  } catch (error) {
    console.error("Error updating regulation:", error);
    res.status(500).json({ message: "Error updating regulation", error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  console.log("Delete request received for ID:", req.params.id); // Debug log
  try {
    await Regulation.findByIdAndDelete(req.params.id);
    res.json({ message: "Regulation deleted successfully" });
  } catch (error) {
    console.error("Error deleting regulation:", error); // Log the error
    res.status(500).json({ error: "Error deleting regulation" });
  }
});

router.get('/searchRegulations/:query', async (req, res) => {
  const query = req.params.query;

  try {
    // Using MongoDB's $or to search in multiple fields
    const regulations = await Regulation.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { draftRegulationNo: { $regex: query, $options: 'i' } },
        { finalRegulationNo: { $regex: query, $options: 'i' } },
      ]
    });

    if (regulations.length > 0) {
      res.json(regulations);
    } else {
      res.json([]); // No results found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
