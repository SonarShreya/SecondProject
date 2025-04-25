
const express = require("express");
const Notification = require("./Notification"); // Ensure this is the correct path for your Notification model
const multer = require("multer");
const router = express.Router();
const path = require("path");

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

// GET all notifications
router.get("/NotificationForms", async (req, res) => {
  try {
    const notifications = await Notification.find();
    if (notifications.length === 0) {
      return res.status(200).json({ message: "No notifications found" });
    }
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});



// POST route for creating an Ordinance
router.post('/createNotification', upload.single('pdfFile'), async (req, res) => {
  const { srNo, title, draftNotificationNo, draftNotificationDate, finalNotificationNo, finalNotificationDate, dateOfPublication, concernSection } = req.body;
  const pdfFile = req.file ? req.file.path : ''; // Handle PDF file upload

  const newNotification = new Notification({
    srNo,
    title,
    draftNotificationNo,
    draftNotificationDate,
    finalNotificationNo,
    finalNotificationDate,
    dateOfPublication,
    concernSection,
    pdfFile,
  });

  try {
    await newNotification.save();
    res.status(201).json({ message: 'Notification added successfully' });
  } catch (error) {
    console.error('Error adding Notification:', error);
    res.status(500).json({ message: 'Error adding Notification' });
  }
});
router.delete("/deleteNotification/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
});



// router.get("/searchNotification/:key", async (req, res) => {
//   const key = req.params.key; // Extract search term from the URL

//   try {
//     // Perform search on multiple fields using regex (case-insensitive search)
//     const notifications = await Notification.find({
//       $or: [
//         { title: { $regex: key, $options: "i" } },
//         { draftNotificationNo: { $regex: key, $options: "i" } },
//         { draftNotificationDate: { $regex: key, $options: "i" } },
//         { finalNotificationNo: { $regex: key, $options: "i" } },
//         { finalNotificationDate: { $regex: key, $options: "i" } },
//         { concernSection: { $regex: key, $options: "i" } },
//         { pdfFile: { $regex: key, $options: "i" } },
//       ],
//     });

//     if (notifications.length > 0) {
//       res.status(200).json(notifications);
//     } else {
//       res.status(404).json({ message: "No notifications found" });
//     }
//   } catch (error) {
//     console.error("Error searching notifications:", error);
//     res.status(500).json({ message: "Error searching notifications" });
//   }
// });



router.get("/api/searchNotification/:key", async (req, res) => {
  const key = req.params.key;

  try {
    const notifications = await Notification.find({
      title: { $regex: key, $options: "i" },  // Case-insensitive search
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error searching notifications:", error);
    res.status(500).send("Error fetching notifications");
  }
});

router.put("/updateNotification/:id", upload.single("pdfFile"), async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    
    if (req.file) {
      updateData.pdfFile = req.file.path; // Update file path if a new file is uploaded
    }

    const updatedNotification = await Notification.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNotification) return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Notification updated successfully", updatedNotification });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
});
module.exports = router;
