import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid"; // For generating unique session IDs
const API_BASE_URL =
"https://movie-server-opal.vercel.app"
// "http://localhost:5000"; // Replace with your server URL

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
    localStorage.removeItem("userData"); // Remove user data from localStorage
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

let data: User | null = null; // Keep track of the logged-in user data

// Function to fetch full user data by email immediately after login

// const { user, setUser } = UseData();
export const fetchUserDataByEmail = async (email: string): Promise<User> => {
  try {
    console.log(`Attempting to fetch user with email: ${email}`);
    const response = await axios.get(`${API_BASE_URL}/users/email/${email}`);
    const userData: User = response.data;
    console.log("Fetched user data successfully:", userData);

    // Save the user data to local storage
    localStorage.setItem("userData", JSON.stringify(userData));

    return userData;
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(
        `Error fetching user data. Status: ${error.response.status}, Message: ${error.response.data.message}`
      );
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response received from server:", error.request);
    } else {
      // Other errors
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};
export const removeUserDataFromLocalStorage = (): void => {
  try {
    localStorage.removeItem("userData"); // Remove user data from local storage
    console.log("User data removed from local storage successfully.");
  } catch (error) {
    console.error("Error removing user data from local storage:", error);
  }
};
export const getUserDataFromLocalStorage = (): User | null => {
  try {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      // Parse the stored data to return as User object
      const loginuserData: User = JSON.parse(storedUserData);
      console.log("Retrieved user data from local storage:", loginuserData);
      return loginuserData;
    } else {
      console.log("No user data found in local storage.");
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error retrieving user data from local storage:", error);
    return null; // Return null if an error occurs
  }
};

// Updated login function
export const loginUser = async (
  email: string,
  password: string,
  stayLoggedIn: boolean
): Promise<User> => {
  try {
    console.log(`Logging in with email: ${email} and password: ${password}`);

    // Make the login request
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });

    const loggedInUser: User = response.data;
    console.log("Login successful:", loggedInUser);

    // Use the setCookie function to handle cookie creation
    const sessionID = setCookie(stayLoggedIn); // Generate and set the cookie
    console.log(
      `Session cookie set successfully for user: ${loggedInUser.email}, Session ID: ${sessionID}`
    );

    // Fetch additional user data based on the logged-in user's email
    const user1 = fetchUserDataByEmail(email);

    return user1;
  } catch (error: any) {
    console.error("Error logging in user:", error.message);
    if (error.response) {
      console.error(
        `Error status: ${error.response.status}, Message: ${error.response.data}`
      );
    }
    throw error; // Re-throw the error for the calling function to handle
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

    // Save user data in localStorage if the user chooses to stay logged in
    if (stayLoggedIn) {
      localStorage.setItem("userData", JSON.stringify(createdUser)); // Save user data to localStorage
    }

    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Get currently logged-in user data
export const getUserData = (): User | null => {
  const sessionID = Cookies.get("session"); // Get session ID from cookie
  if (!sessionID) {
    console.log("No session cookie found.");
    return null; // Return null if no session is found
  }

  // Check if the data is available in memory first
  if (data) {
    return data; // Return the user data stored in memory
  }

  // Otherwise, check localStorage
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    const userData: User = JSON.parse(storedUserData);
    if (userData.cookieSession === sessionID) {
      data = userData; // Store the user data in memory
      return userData;
    } else {
      console.log("Session ID mismatch with localStorage user data.");
      return null;
    }
  }

  console.log("No user data found in localStorage.");
  return null; // Return null if no user data is found
};

// Logout user (clear session cookie and localStorage)
export const logoutUser = (): void => {
  try {
    Cookies.remove("session", { path: "/" }); // Remove session cookie
    localStorage.removeItem("userData"); // Remove user data from localStorage
    data = null; // Clear in-memory user data
    removeUserDataFromLocalStorage();
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out user:", error);
  }
};
export const toggleLikeMovie = async (
  email: string,
  movieId: number
): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/toggle-like`, {
      email,
      movieId,
    });
    return response.data; // Return updated user data
  } catch (error) {
    console.error("Error toggling movie like:", error);
    return null;
  }
};
export const toggleLaterMovie = async (
  email: string,
  movieId: number
): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/toggle-later`, {
      email,
      movieId,
    });
    return response.data; // Return updated user data
  } catch (error) {
    console.error("Error toggling movie watch latter:", error);
    return null;
  }
};
