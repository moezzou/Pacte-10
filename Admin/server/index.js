import express from "express";
import cors from "cors";
import UserModel from "./mongodb/models/register.js";
import connectDB from "./mongodb/connection.js";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Complaint from "./mongodb/models/Complaint.js";
import { verifyAdmin } from './middlewares/isAdmin.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Add a route to fetch and sort complaints by date
app.get("/api/complaints", async (req, res) => {
  try {
    // Fetch complaints from the database and sort them by createdAt date in descending order
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ success: false, message: "Failed to fetch complaints" });
  }
});


// Get all users with sorting and pagination
// Récupérer tous les utilisateurs
app.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Récupérer les pourcentages de rôle
app.get("/api/users/stat", async (req, res) => {
  try {
    const users = await UserModel.find();

    // Calculer les pourcentages de rôle
    const totalUsers = users.length;
    const roleCounts = {
      professeur: 0,
      etudiant: 0,
      admin: 0
    };

    users.forEach(user => {
      if (user.role === "professeur") {
        roleCounts.professeur++;
      } else if (user.role === "etudiant") {
        roleCounts.etudiant++;
      } else if (user.role === "admin") {
        roleCounts.admin++;
      }
    });

    const rolePercentages = {
      professeur: parseFloat((roleCounts.professeur / totalUsers * 100).toFixed(2)),
      etudiant: parseFloat((roleCounts.etudiant / totalUsers * 100).toFixed(2)),
      admin: parseFloat((roleCounts.admin / totalUsers * 100).toFixed(2))
    };

    res.status(200).json({ success: true, data: rolePercentages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
