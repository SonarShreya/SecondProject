const express = require('express');
const Gazette = require('../db/Add-Gazette'); // Correctly importing the Gazette model

const router = express.Router();

// Get all gazettes
router.get('/', async (req, res) => {
  try {
    const gazettes = await Gazette.find(); // Fetching all gazette records
    res.json(gazettes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

// Add a new gazette
router.post('/', async (req, res) => {
  const gazetteData = req.body; // Getting data from the request body
  try {
    const gazette = new Gazette(gazetteData); // Creating a new Gazette instance
    await gazette.save(); // Saving the instance to the database
    res.status(201).json({ message: 'Gazette added successfully', gazette });
  } catch (error) {
    res.status(500).json({ message: 'Error adding gazette', error });
  }
});

module.exports = router;
