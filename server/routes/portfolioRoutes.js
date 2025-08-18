const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middlewares/authMiddleware');

// Get user's portfolio
router.get('/', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user.id });
    
    if (!portfolio) {
             // Create a new portfolio if none exists
       portfolio = new Portfolio({
         userId: req.user.id,
         about: {
           name: '',
           title: '',
           bio: '',
           email: '',
           phone: '',
           location: '',
           resume: '',
           profilePicture: ''
         },
        skills: [],
        experience: [],
        education: [],
        projects: [],
        contactLinks: []
      });
      await portfolio.save();
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update portfolio
router.put('/', auth, async (req, res) => {
  try {
    const {
      about,
      skills,
      experience,
      education,
      projects,
      contactLinks,
      theme
    } = req.body;

    let portfolio = await Portfolio.findOne({ userId: req.user.id });
    
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user.id });
    }

    // Update fields
    if (about) portfolio.about = about;
    if (skills) portfolio.skills = skills;
    if (experience) portfolio.experience = experience;
    if (education) portfolio.education = education;
    if (projects) portfolio.projects = projects;
    if (contactLinks) portfolio.contactLinks = contactLinks;
    if (theme) portfolio.theme = theme;

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public portfolio by user ID (for viewing)
router.get('/:userId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
