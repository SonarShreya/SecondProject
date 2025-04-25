const express = require("express");
const multer = require("multer");
const path = require("path");
const Direction = require("./Direction");
const mongoose = require("mongoose");
const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be stored in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });


router.get("/directions", async (req, res) => {
  try {
    const directions = await Direction.find();
    res.json(directions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching directions", error: error.message });
  }
});

// GET single direction by ID
router.get("/direction/:id", async (req, res) => {
  try {
    const direction = await Direction.findById(req.params.id);
    if (!direction) {
      return res.status(404).json({ message: "Direction not found" });
    }
    res.json(direction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching direction", error: error.message });
  }
});


// ✅ SEARCH directions by title
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    const results = await Direction.find({ title: { $regex: query, $options: "i" } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error searching directions", error: error.message });
  }
});

router.post("/direction", upload.single("pdfFile"), async (req, res) => {
  try {
    const { title, draftDirectionNo, draftDirectionDate, dateOfRenewal, concernSection } = req.body;

    // Validate date format
    if (isNaN(Date.parse(dateOfRenewal))) {
      return res.status(400).json({ message: "Invalid date format for dateOfRenewal" });
    }

    const newDirection = new Direction({
      title,
      draftDirectionNo,
      draftDirectionDate: new Date(draftDirectionDate),
      dateOfRenewal: new Date(dateOfRenewal), // Ensure valid date format
      concernSection,
      pdfFile: req.file ? req.file.path : "",
    });

    await newDirection.save();
    res.status(201).json({ message: "Direction added successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error adding direction", error: error.message });
  }
});


// ✅ DELETE a direction
router.delete("/direction/:id", async (req, res) => {
  try {
    const deletedDirection = await Direction.findByIdAndDelete(req.params.id);
    if (!deletedDirection) return res.status(404).json({ message: "Direction not found" });

    res.json({ message: "Direction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting direction", error: error.message });
  }
});

//PUT endpoint to update a Direction by id
router.put('/updateDirection/:id', upload.single('pdfFile'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate the MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Find the existing direction record by id
    const existingDirection = await Direction.findById(id);
    if (!existingDirection) {
      return res.status(404).json({ message: 'Direction not found' });
    }

    // If a new file is uploaded, use its path; otherwise, keep the current file path
    let filePath = existingDirection.pdfFile;
    if (req.file) {
      filePath = req.file.path;
    }

    // Build the update data using the fields provided in req.body
    // Make sure these field names match your model schema.
    const updateData = {
      title: req.body.title || existingDirection.title,
      draftDirectionNo: req.body.draftDirectionNo || existingDirection.draftDirectionNo,
      draftDirectionDate: req.body.draftDirectionDate || existingDirection.draftDirectionDate,
      dateOfRenewal: req.body.dateOfRenewal || existingDirection.dateOfRenewal,
      concernSection: req.body.concernSection || existingDirection.concernSection,
      pdfFile: filePath,
    };

    // Update the record in the database and return the new document
    const updatedDirection = await Direction.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Direction updated successfully',
      updatedDirection,
    });
  } catch (error) {
    console.error("Error updating direction:", error);
    res.status(500).json({ message: 'Error updating direction', error: error.message });
  }
});





module.exports = router;
