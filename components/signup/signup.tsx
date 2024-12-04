import React, { useState, useEffect } from "react";
import styles from "./signup.module.css";

import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  fetchAllUsers,
  createUser,
  loginUser,
} from "../../services/userService";
import { setCookie, verifyCookie } from "../../services/userService";

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const Signup: React.FC = () => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Check if the session cookie exists and is valid, redirect if valid
  useEffect(() => {
    const sessionCookie = localStorage.getItem("session"); // Get session ID from localStorage
    if (sessionCookie) {
      const isValid = verifyCookie(sessionCookie); // Verify the cookie
      if (isValid) {
        navigate("/home"); // Redirect to home if the session cookie is valid
      }
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (isSignupMode) {
        // Sign Up Process
        const validatedData = userSchema.parse(formData);

        // Check for unique email and username
        const users = await fetchAllUsers();
        const emailExists = users.some(
          (user: any) => user.email === validatedData.email
        );
        const usernameExists = users.some(
          (user: any) => user.username === validatedData.username
        );

        if (emailExists || usernameExists) {
          setError("Email or username already exists");
          return;
        }

        // Create a new user
        await createUser(
          {
            ...validatedData,
            cookieSession: "", // Initially empty, to be set later
            likedMovies: [], // Empty array for liked movies
            watchLater: [], // Empty array for watch later
            stayLoggedIn,
          },
          stayLoggedIn
        );

        setIsSignupMode(false); // Switch to login mode after signup
        setError(null);
      } else {
        // Login Process
        const validatedData = userSchema
          .omit({ username: true })
          .parse(formData);

        await loginUser(
          validatedData.email,
          validatedData.password,
          stayLoggedIn
        );

        // Set the session cookie
        const sessionID = setCookie(stayLoggedIn);
        localStorage.setItem("session", sessionID); // Store session ID in localStorage
        console.log("User logged in and session cookie set:", sessionID);

        navigate("/home"); // Redirect to home
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error during form submission:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        {isSignupMode ? "Sign Up" : "Log In"}
      </Typography>

      {isSignupMode && (
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
          fullWidth
        />
      )}

      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={styles.input}
        fullWidth
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        className={styles.input}
        fullWidth
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={stayLoggedIn}
            onChange={(e) => setStayLoggedIn(e.target.checked)}
          />
        }
        label="Stay logged in"
      />

      {error && <Typography color="error">{error}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={styles.button}
      >
        {isSignupMode ? "Sign Up" : "Log In"}
      </Button>

      <Typography
        variant="body2"
        className={styles.link}
        onClick={() => {
          setIsSignupMode((prev) => !prev);
          setFormData({ username: "", email: "", password: "" });
          setError(null);
        }}
      >
        {isSignupMode
          ? "Already have an account? Log in"
          : "Don't have an account? Sign up"}
      </Typography>
    </Box>
  );
};

export default Signup;
