import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Adjust if your server runs on a different port or URL

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
}

// Movies API Calls

// 1. Fetch all movies
export const fetchAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    throw error;
  }
};

// 2. Fetch movies by title search (fuzzy search)
export const searchMoviesByTitle = async (
  searchTerm: string
): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/search`, {
      params: { title: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies by title:", error);
    throw error;
  }
};

// 3. Fetch movies based on user's likedMovies or watchLater lists
export const fetchMoviesByUserLists = async (
  movieIds: number[]
): Promise<Movie[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/movies/user-lists`, {
      movieIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movies by user lists:", error);
    throw error;
  }
};

// Users API Calls

// 1. Fetch all users
export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// 2. User login (validate email and password)
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// 3. Update or delete cookie session
export const updateSession = async (
  email: string,
  session: string
): Promise<User> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/session`, {
      email,
      session,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user session:", error);
    throw error;
  }
};

export const deleteSession = async (email: string): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/users/session`, { email, session: "" });
  } catch (error) {
    console.error("Error deleting user session:", error);
    throw error;
  }
};

// 4. Create a new user (ensure unique email)
export const createUser = async (user: User): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
