const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: "Too many requests, try again later" }
});
app.use(limiter);

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running..." });
});

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // logs meaningful info
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
