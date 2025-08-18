const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
  
    const existingUser = await User.findOne({ email });

    if (existingUser)return res.status(400).json({ message: "Email already exists" });
    const hash = await bcrypt.hash(password, 10);
    try{
        const user = await User.create({
        username: username,
        email: email,
        passwordHash: hash,
      });
    
    res.status(201).json({ message: "User registered", userId: user._id });
    }
    catch(error){
        console.log(error)
    }
   
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
