import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const uri =
  "mongodb+srv://mumair299792458u:<299792458um>@cluster0.pp0lbva.mongodb.net"; // Replace 'yourDatabaseName' with your database name

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();
