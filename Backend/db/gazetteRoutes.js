

const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const GovGazette= require('./GovGazette'); // Ensure the correct path

const router = express.Router();
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));



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

// GET all gazettes
router.get('/gazettes', async (req, res) => {
  try {
    const gazettes = await GovGazette.find();
    res.json(gazettes);
  } catch (error) {
    console.error('Error fetching gazettes:', error);
    res.status(500).json({ message: 'Error fetching gazettes', error: error.message });
  }
});

// GET a single gazette by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const gazette = await GovGazette.findById(id);
    if (!gazette) return res.status(404).json({ error: 'Gazette not found' });
    res.json(gazette);
  } catch (error) {
    console.error('Error fetching gazette:', error);
    res.status(500).json({ message: 'Error fetching gazette', error: error.message });
  }
});



router.post('/gazettes', upload.single('pdfFile'), async (req, res) => {
  try {
    const { title, draftGovNo, draftGovDate, finalGovNo, finalGovDate, dateOfPublication, concernSection } = req.body;

    if (!concernSection) {
      return res.status(400).json({ message: "concernSection is required" });
    }

    const formattedFinalGovDate = new Date(finalGovDate);
    const formattedDateOfPublication = new Date(dateOfPublication);

    if (isNaN(formattedFinalGovDate) || isNaN(formattedDateOfPublication)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const filePath = req.file ? req.file.path : '';

    const newGazette = new GovGazette({
      title,
      draftGovNo,
      draftGovDate,
      finalGovNo,
      finalGovDate: formattedFinalGovDate,
      dateOfPublication: formattedDateOfPublication,
      concernSection,
      pdfFile: filePath, // Save the file path to the database
    });

    await newGazette.save();
    res.status(201).json({ message: 'Gazette added successfully', gazette: newGazette });
  } catch (error) {
    console.error('Error adding gazette:', error);
    res.status(500).json({ message: 'Error adding gazette', error: error.message });
  }
});

// DELETE a gazette
router.delete('/gazettes/:id', async (req, res) => {
  const { id } = req.params;

  // Validate if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const deletedGazette = await GovGazette.findByIdAndDelete(id);
    if (!deletedGazette) return res.status(404).json({ error: 'Gazette not found' });
    res.json({ message: 'Gazette deleted successfully' });
  } catch (error) {
    console.error('Error deleting gazette:', error);
    res.status(500).json({ message: 'Error deleting gazette', error: error.message });
  }
});

router.put("/updategazette/:id", upload.single("pdfFile"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Received ID:", id);
    console.log("Received Data:", updateData);
    console.log("Received File:", req.file);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
console.log(id)
    const existingGazette = await GovGazette.findById(id);
    console.log(existingGazette)
    if (!existingGazette) {
      return res.status(404).json({ message: "Gazette not found" });
    }


    const updatedFields = {
      title: updateData.title || existingGazette.title,
      draftGovNo: updateData.draftGovNo || existingGazette.draftGovNo,
      draftGovDate: updateData.draftGovDate || existingGazette.draftGovDate,
      finalGovNo: updateData.finalGovNo || existingGazette.finalGovNo,
      finalGovDate: updateData.finalGovDate || existingGazette.finalGovDate,
      dateOfPublication: updateData.dateOfPublication || existingGazette.dateOfPublication,
      concernSection: updateData.concernSection || existingGazette.concernSection,
    };

    if (req.file) {
      updatedFields.pdfFile = req.file.path;
    }

    const updatedGazette = await GovGazette.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({ message: "Gazette updated successfully", updatedGazette });

  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Error updating record", error: error.message });
  }
});


module.exports = router;
