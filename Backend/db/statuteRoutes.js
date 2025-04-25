const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Statute = require("./Statute"); // Ensure this is the correct path to your model

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

// Serve static files for uploads
router.use("/uploads", express.static("uploads"));


router.get('/Statute/:id', async (req, res) => {
  try {
    const statute = await Statute.findById(req.params.id);
    if (!statute) {
      return res.status(404).json({ message: "Statute not found" });
    }
    console.log("Sending data:", statute); // Debug log
    res.json(statute);
  } catch (error) {
    console.error("Error fetching statute:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




// Create the GET API
router.get("/api/Statute", async (req, res) => {
  try {
    const statutes = await Statute.find(); // Fetch all records
    res.json(statutes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});





router.post('/insertStatute', upload.single('pdfFile'), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const requiredFields = ['title', 'draftStatuteNo', 'draftStatuteDate'];
    if (!requiredFields.every(field => req.body[field])) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate and convert dates
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };

    const draftStatuteDate = parseDate(req.body.draftStatuteDate);
    const finalStatuteDate = parseDate(req.body.finalStatuteDate);
    const publicationDate = parseDate(req.body.publicationDate);

    if (!draftStatuteDate) {
      return res.status(400).json({ error: "Invalid draftStatuteDate format" });
    }

    const newStatute = new Statute({
      title: req.body.title,
      draftStatuteNo: req.body.draftStatuteNo,
      draftStatuteDate: draftStatuteDate,
      finalStatuteNo: req.body.finalStatuteNo,
      finalStatuteDate: finalStatuteDate,
      publicationDate: publicationDate,
      concernStatute: req.body.concernStatute,
      pdfFile: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newStatute.save();

    // Fetch all statutes after insert and send it in the response
    const allStatutes = await Statute.find();
    res.status(201).json({ message: 'Statute created successfully', newStatute, allStatutes });

  } catch (error) {
    console.error("Error creating statute:", error);
    res.status(500).json({ error: error.message || 'Failed to create statute' });
  }
});


router.get('/searchStatute/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const searchResults = await Statute.find({
      $or: [
        { title: { $regex: key, $options: "i" } },
        { draftStatuteNo: { $regex: key, $options: "i" } },
        { finalStatuteNo: { $regex: key, $options: "i" } },
      ],
    });

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching statute:", error);
    res.status(500).json({ error: "Failed to search statute" });
  }
});







router.delete('/deleteStatute/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deletedStatute = await Statute.findByIdAndDelete(id);

    if (!deletedStatute) {
      return res.status(404).json({ message: "Statute not found" });
    }

    res.status(200).json({ message: "Statute deleted successfully" });
  } catch (error) {
    console.error("Error deleting statute:", error);
    res.status(500).json({ error: "Failed to delete statute" });
  }
});
// PATCH request to update the statute
router.patch('/api/updateStatute/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const updateFields = req.body; // Capture only provided fields

      const updatedStatute = await Statute.findByIdAndUpdate(id, updateFields, { new: true });

      if (!updatedStatute) {
          return res.status(404).json({ message: 'Statute not found' });
      }

      res.json({ message: 'Statute updated successfully', data: updatedStatute });
  } catch (error) {
      res.status(500).json({ message: 'Error updating statute', error: error.message });
  }
});

// router.put('/updateStatute/:id', upload.single('pdfFile'), async (req, res) => {
//   const { id } = req.params;
  
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID format" });
//   }

//   console.log("Received ID for update:", id);

//   try {
//     // Check if statute exists before updating
//     const existingStatute = await Statute.findById(id);
//     if (!existingStatute) {
//       return res.status(404).json({ message: "Statute not found in DB" });
//     }

//     const updatedFields = {
//       title: req.body.title,
//       draftStatuteNo: req.body.draftStatuteNo,
//       draftStatuteDate: req.body.draftStatuteDate,
//       finalStatuteNo: req.body.finalStatuteNo,
//       finalStatuteDate: req.body.finalStatuteDate,
//       concernStatute: req.body.concernStatute
//     };

//     if (req.file) {
//       updatedFields.pdfFile = `/uploads/${req.file.filename}`;
//     }

//     const updatedStatute = await Statute.findByIdAndUpdate(id, updatedFields, { new: true });

//     res.status(200).json({ message: "Statute updated successfully", updatedStatute });
//   } catch (error) {
//     console.error("Error updating statute:", error);
//     res.status(500).json({ message: "Failed to update statute" });
//   }
// });


module.exports = router;