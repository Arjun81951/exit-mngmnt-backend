require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect Database
connectDB();

// Routes
const routes  = require('./src/routes/router');
app.use(routes);

// Default Route
app.get("/", (req, res) => {
    console.log("API IS WORKING");
    res.send("🚀 API is running");
  
  });

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
