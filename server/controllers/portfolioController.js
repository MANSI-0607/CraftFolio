const Portfolio = require('../models/Portfolio');

// @desc Get or create portfolio for logged-in user
// @route GET /api/portfolio
// @access Private
const getUserPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user.id });
    
    if (!portfolio) {
      // Create a new portfolio if none exists
      portfolio = new Portfolio({
        userId: req.user.id,
        username: req.user.username,
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
};

// @desc Update portfolio for logged-in user
// @route PUT /api/portfolio
// @access Private
const updatePortfolio = async (req, res) => {
  try {
    console.log('Updating portfolio for user:', req.user.username);
    console.log('Request body:', req.body);
    
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
      portfolio = new Portfolio({ 
        userId: req.user.id,
        username: req.user.username
      });
    }

    // Update fields if provided
    if (about) portfolio.about = about;
    if (skills) portfolio.skills = skills;
    if (experience) portfolio.experience = experience;
    if (education) portfolio.education = education;
    if (projects) portfolio.projects = projects;
    if (contactLinks) portfolio.contactLinks = contactLinks;
    if (theme) portfolio.theme = theme;
    
    // Always ensure username is set
    portfolio.username = req.user.username;

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get public portfolio by user ID
// @route GET /api/portfolio/:userId
// @access Public
const getPublicPortfolio = async (req, res) => {
  try {
    
    const portfolio = await Portfolio.findOne({username: req.params.username });
   
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserPortfolio,
  updatePortfolio,
  getPublicPortfolio,
};
