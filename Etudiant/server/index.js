import express from "express";
import cors from "cors";
import UserModel from "./mongodb/models/register.js";
import connectDB from "./mongodb/connection.js";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Complaint from "./mongodb/models/Complaint.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users with sorting and pagination
app.get("/api/users", async (req, res) => {
  try {
    const { sortBy } = req.query;
    let users;

    if (sortBy === "lastModified") {
      users = await UserModel.find().sort({ lastModified: 1 });
    } else if (sortBy === "-lastModified") {
      users = await UserModel.find().sort({ lastModified: -1 });
    } else {
      users = await UserModel.find();
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Import the Complaint model


// Route to handle complaint submission
app.post("/api/complaints", async (req, res) => {
  try {
    // Extract the complaint from the request body
    const { complaint } = req.body;

    // Create a new complaint using the Complaint model
    const newComplaint = await Complaint.create({ complaint });

    res.status(201).json({ success: true, message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ success: false, message: "Failed to submit complaint" });
  }
});


// Update tokens and last modified date for a user
app.post("/api/users/:id/addTokens", async (req, res) => {
  try {
    const userId = req.params.id;
    const { tokensToAdd } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentDate = new Date();
    user.tokens += tokensToAdd;
    user.tokensAdded = tokensToAdd; // Update tokens added
    user.lastModified = currentDate; // Update last modified date

    // Save tokensAdded and lastModified to the database
    await UserModel.findByIdAndUpdate(userId, {
      tokensAdded: tokensToAdd,
      lastModified: currentDate
    });

    res.status(200).json({ success: true, message: "Tokens updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, this is the backend");
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(5000, () => {
      console.log("Server is listening on port 5000");
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
