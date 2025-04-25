const express = require("express");
const router = express.Router();
const Direction = require("./Direction"); // Import your Direction model

// DELETE route to delete a direction by ID
router.delete("/api/deleteDirection/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDirection = await Direction.findByIdAndDelete(id);

    if (!deletedDirection) {
      return res.status(404).json({ success: false, message: "Direction not found." });
    }

    res.status(200).json({ success: true, message: "Direction deleted successfully." });
  } catch (error) {
    console.error("Error deleting direction:", error);
    res.status(500).json({ success: false, message: "Failed to delete direction." });
  }
});

module.exports = router;
