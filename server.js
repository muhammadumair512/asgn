import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Movie from "./models/Movie.js";
import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/movieWeb"; // Replace 'yourDatabaseName' with your database name

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB at localhost:27017"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if connection fails
  });

// Movies Endpoints
app.get("/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

app.get("/movies/search", async (req, res) => {
  const { title } = req.query;
  const movies = await Movie.find({ title: { $regex: title, $options: "i" } }); // Case-insensitive search
  res.json(movies);
});

app.post("/movies/user-lists", async (req, res) => {
  const { movieIds } = req.body;
  const movies = await Movie.find({ id: { $in: movieIds } });
  res.json(movies);
});

// Users Endpoints
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/users", async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });

  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
