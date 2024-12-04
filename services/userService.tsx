import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Replace with your server URL

import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid"; // For generating unique session IDs

// Function to set a cookie, generate a session ID, and return the session ID
export const setCookie = (stayLoggedIn: boolean): string => {
  const sessionID = uuidv4(); // Generate a unique session ID

  const cookieOptions: Cookies.CookieAttributes = stayLoggedIn
    ? { expires: 30, path: "/", sameSite: "Strict" } // Persistent cookie for 30 days
    : { path: "/", sameSite: "Strict" }; // Session cookie (expires on browser close)

  Cookies.set("session", sessionID, cookieOptions); // Store session ID in a cookie
  console.log("Session cookie set with session ID:", sessionID);

  return sessionID; // Return the generated session ID
};

// Function to remove the session cookie and clear all session-related data
export const removeCookie = (): void => {
  try {
    Cookies.remove("session", { path: "/" }); // Remove the session cookie
    console.log("Session cookie removed successfully.");
  } catch (error) {
    console.error("Error removing session cookie:", error);
  }
};

// Function to verify the session cookie
export const verifyCookie = (inputSessionID: string): boolean => {
  const storedSessionID = Cookies.get("session"); // Retrieve the stored session ID from the cookie

  if (storedSessionID === inputSessionID) {
    console.log("Session ID verified successfully.");
    return true; // Session ID matches
  } else {
    console.log("Session ID verification failed.");
    return false; // Session ID does not match
  }
};

// Interface Definitions for TypeScript
export interface Movie {
  id: number;
  title: string;
  imageURL: string;
  description: string;
  category: string;
  liked: boolean;
}

export interface User {
  username: string;
  email: string;
  password: string;
  cookieSession: string;
  likedMovies: number[];
  watchLater: number[];
  stayLoggedIn: boolean;
}

// Movies API Calls

// Fetch all movies
export const fetchAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    throw error;
  }
};

// Users API Calls

// Fetch all users
export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// User login (validate email and password, create session cookie)
// Updated loginUser function
export const loginUser = async (
  email: string,
  password: string,
  stayLoggedIn: boolean
): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });

    const loggedInUser: User = response.data;

    // Use the setCookie function to handle cookie creation
    const sessionID = setCookie(stayLoggedIn); // Generate and set the cookie
    console.log(
      `Session cookie set successfully for user: ${loggedInUser.email}, Session ID: ${sessionID}`
    );

    return loggedInUser;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Create a new user (register and set session cookie)
export const createUser = async (
  user: User,
  stayLoggedIn: boolean
): Promise<User> => {
  try {
    const session = uuidv4(); // Generate a unique session ID
    const newUser = { ...user, cookieSession: session };

    const response = await axios.post(`${API_BASE_URL}/users`, newUser);

    const createdUser: User = response.data;

    // Cookie options
    const cookieOptions: Cookies.CookieAttributes = stayLoggedIn
      ? { expires: 30, path: "/", sameSite: "Strict" }
      : { path: "/", sameSite: "Strict" };

    // Set session cookie
    Cookies.set("session", session, cookieOptions);
    console.log("Session cookie set successfully for new user.");

    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Verify session (validate session cookie on the server)
export const verifySession = async (): Promise<User | null> => {
  try {
    const session = Cookies.get("session");
    if (!session) {
      console.log("No session cookie found.");
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/users/verify-session`, {
      session,
    });

    console.log("Session verification successful.");
    return response.data; // Return the user object if the session is valid
  } catch (error) {
    console.error("Error verifying session:", error);
    return null; // Return null if verification fails
  }
};

// Logout user (clear session cookie)
export const logoutUser = (): void => {
  try {
    Cookies.remove("session", { path: "/" }); // Remove session cookie
    console.log("Session cookie removed successfully.");
  } catch (error) {
    console.error("Error logging out user:", error);
  }
};
