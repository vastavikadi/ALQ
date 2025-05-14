const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

