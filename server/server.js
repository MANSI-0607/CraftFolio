const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
