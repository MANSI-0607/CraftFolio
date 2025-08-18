const express = require('express');
const router = express.Router();
const { generateProfessionalBio, enhanceBioWithAI } = require('../services/geminiService');

// Generate professional bio
router.post('/generate-bio', async (req, res) => {
  try {
    const { name, title, skills, experience, education } = req.body;

    // Validate required fields
    if (!name || !title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and title are required' 
      });
    }

    const bio = await generateProfessionalBio(name, title, skills || [], experience || [], education || []);
    
    res.json({
      success: true,
      bio
    });
  } catch (error) {
    console.error('Error generating bio:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate bio'
    });
  }
});

// Enhance existing bio
router.post('/enhance-bio', async (req, res) => {
  try {
    const { currentBio } = req.body;

    // Validate required fields
    if (!currentBio) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current bio is required' 
      });
    }

    const enhancedBio = await enhanceBioWithAI(currentBio);
    
    res.json({
      success: true,
      enhancedBio
    });
  } catch (error) {
    console.error('Error enhancing bio:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to enhance bio'
    });
  }
});

module.exports = router;
