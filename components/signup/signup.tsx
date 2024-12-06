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
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const sessionCookie = localStorage.getItem("session");
    if (sessionCookie) {
      const isValid = verifyCookie(sessionCookie);
      if (isValid) {
        navigate("/home");
      }
    }
  }, [navigate]);

  const handleSubmit = async () => {
    setError(null);
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);

    try {
      if (isSignupMode) {
        // Validate form data
        const validatedData = userSchema.parse(formData);

        // Check for unique email and username
        const users = await fetchAllUsers();
        const emailExists = users.some(
          (user: any) => user.email === validatedData.email
        );
        const usernameExists = users.some(
          (user: any) => user.username === validatedData.username
        );

        if (emailExists) {
          setEmailError("This email is already registered.");
          return;
        }
        if (usernameExists) {
          setUsernameError("This username is already taken.");
          return;
        }

        // Create a new user
        await createUser(
          {
            ...validatedData,
            cookieSession: "",
            likedMovies: [],
            watchLater: [],
            stayLoggedIn,
          },
          stayLoggedIn
        );

        setIsSignupMode(false);
      } else {
        // Validate login data
        const validatedData = userSchema
          .omit({ username: true })
          .parse(formData);

        const users = await fetchAllUsers();
        const user = users.find(
          (user: any) => user.email === validatedData.email
        );

        if (!user) {
          setEmailError("No account found with this email.");
          return;
        }
        if (user.password !== validatedData.password) {
          setPasswordError("Incorrect password. Please try again.");
          return;
        }

        await loginUser(
          validatedData.email,
          validatedData.password,
          stayLoggedIn
        );

        const sessionID = setCookie(stayLoggedIn);
        localStorage.setItem("session", sessionID);

        navigate("/home");
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((issue) => {
          const field = issue.path[0];
          if (field === "username") setUsernameError(issue.message);
          if (field === "email") setEmailError(issue.message);
          if (field === "password") setPasswordError(issue.message);
        });
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific errors as the user types
    if (name === "username") setUsernameError(null);
    if (name === "email") setEmailError(null);
    if (name === "password") setPasswordError(null);
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
          error={!!usernameError}
          helperText={usernameError}
        />
      )}

      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={styles.input}
        fullWidth
        error={!!emailError}
        helperText={emailError}
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        className={styles.input}
        fullWidth
        error={!!passwordError}
        helperText={passwordError}
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

      {error && (
        <Typography color="error" style={{ marginTop: "8px" }}>
          {error}
        </Typography>
      )}

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
          setUsernameError(null);
          setEmailError(null);
          setPasswordError(null);
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
