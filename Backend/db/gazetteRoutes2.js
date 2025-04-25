const mongoose = require('mongoose');

const express = require('express');
const multer = require('multer');
const path = require('path');
// Corrected to Gazette2
const Gazette2 = require('./Govgazette2');  // Make sure this points to the correct path

const router = express.Router();
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Ensure the path is correct
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Set unique filename
  }
});



const upload = multer({ storage: storage });
router.get('/', async (req, res) => {
    try {
      const gazettes = await Gazette2.find();
      console.log('Fetched gazettes:', gazettes);  // Log the result
      res.json(gazettes);
    } catch (error) {
      console.error('Error fetching gazettes:', error);
      res.status(500).json({ message: 'Error fetching gazettes', error: error.message });
    }
  });
  

  router.get('/gazette2', async (req, res) => {  // ✅ Ensure this matches frontend
    try {
        const gazettes = await Gazette2.find();
        res.json(gazettes);
    } catch (error) {
        console.error('Error fetching gazettes:', error);
        res.status(500).json({ message: 'Error fetching gazettes', error: error.message });
    }
});



router.post('/gazette2', upload.single('pdfFile'), async (req, res) => {
  try {
      console.log('Received Data:', req.body);

      const { title, draftGovNo, draftGovDate, finalGovNo, finalGovDate, dateOfPublication, concernSection } = req.body;
      const pdfFile = req.file ? req.file.filename : '';

      const newGazette = new Gazette2({
          title,
          draftGovNo,   // ✅ Fixed field names
          draftGovDate, // ✅ Fixed field names
          finalGovNo,   // ✅ Fixed field names
          finalGovDate, // ✅ Fixed field names
          dateOfPublication,
          concernSection,
          pdfFile
      });

      const savedGazette = await newGazette.save();
      console.log('Gazette saved:', savedGazette);
      res.status(201).json({ message: 'Gazette added successfully', savedGazette });

  } catch (error) {
      console.error('Error adding gazette:', error);
      res.status(500).json({ message: 'Error adding gazette', error: error.message });
  }
});


router.put("/updategazette2/:id", upload.single("pdfFile"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Received ID:", id);
    console.log("Received Data:", updateData);
    console.log("Received File:", req.file);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const existingGazette = await Gazette2.findById(id);
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

    const updatedGazette = await Gazette2.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({ message: "Gazette updated successfully", updatedGazette });

  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Error updating record", error: error.message });
  }
});


  




router.delete('/:id', async (req, res) => {
    try {
      await Gazette2.findByIdAndDelete(req.params.id); // Use the correct model
      res.status(200).json({ message: 'Gazette deleted successfully' });
    } catch (error) {
      console.error('Error deleting gazette:', error);
      res.status(500).json({ message: 'Error deleting gazette', error: error.message });
    }
  });



module.exports = router;
