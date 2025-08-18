const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  about: {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    resume: { type: String, default: '' }, // URL to uploaded resume
    profilePicture: { type: String, default: '' } // URL to profile picture
  },
  skills: [{ type: String }],
  experience: [{
    id: { type: String, required: true },
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  education: [{
    id: { type: String, required: true },
    school: { type: String, default: '' },
    degree: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  projects: [{
    id: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    link: { type: String, default: '' }
  }],
  contactLinks: [{
    platform: { type: String, required: true },
    url: { type: String, required: true }
  }],
  theme: { type: String, default: 'default' }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
