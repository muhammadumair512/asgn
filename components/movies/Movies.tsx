// src/pages/Movies.tsx
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  getUserDataFromLocalStorage,
  toggleLikeMovie,
  toggleLaterMovie,
  // fetchUserDataByEmail,
  fetchAllMovies,
  fetchUserDataByEmail,
} from "../../services/userService";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./Movies.module.css";
import { useDataContext } from "../../dataContext";

interface Movie {
  id: number;
  title: string;
  imageURL: string;
  description: string;
  category: string;
  liked: boolean;
  watchLater: boolean;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setUser } = useDataContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Check user login status
  useEffect(() => {
    const checkSessionCookie = () => {
      const session = Cookies.get("session");
      setIsLoggedIn(!!session);
    };

    checkSessionCookie();
    const interval = setInterval(checkSessionCookie, 1000);
    return () => clearInterval(interval);
  }, [setUser]);

  // Fetch movies and user data
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const allMovies = await fetchAllMovies();
        const user = getUserDataFromLocalStorage();

        if (user) {
          setUserData(user);
          setUser(user);

          const updatedMovies = allMovies.map((movie) => ({
            ...movie,
            liked: user.likedMovies.includes(movie.id),
            watchLater: user.watchLater?.includes(movie.id) || false,
          }));

          setMovies(updatedMovies);
          setFilteredMovies(updatedMovies);
        } else {
          setMovies(
            allMovies.map((movie) => ({ ...movie, watchLater: false }))
          );
          setFilteredMovies(
            allMovies.map((movie) => ({ ...movie, watchLater: false }))
          );
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    loadMovies();
  }, [setUser]);

  // Filter movies based on search term
  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchTerm, movies]);

  // Optimistic UI update function
  const updateMovieState = (
    movieId: number,
    field: "liked" | "watchLater",
    value: boolean
  ) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId ? { ...movie, [field]: value } : movie
      )
    );
  };

  const handleFavoriteClick = async (movieId: number) => {
    if (!userData) return;

    const currentMovie = movies.find((movie) => movie.id === movieId);
    if (!currentMovie) return;

    const newLikedState = !currentMovie.liked;
    updateMovieState(movieId, "liked", newLikedState);
    try {
      const updatedUser = await toggleLikeMovie(userData.email, movieId);
      setUserData(updatedUser);
      fetchUserDataByEmail(userData.email);
    } catch (error) {
      console.error("Failed to update liked status:", error);
      updateMovieState(movieId, "liked", !newLikedState); // Revert state on error
    }
  };

  const handleWatchLaterClick = async (movieId: number) => {
    if (!userData) return;

    const currentMovie = movies.find((movie) => movie.id === movieId);
    if (!currentMovie) return;

    const newWatchLaterState = !currentMovie.watchLater;
    updateMovieState(movieId, "watchLater", newWatchLaterState);

    try {
      const updatedUser = await toggleLaterMovie(userData.email, movieId);
      setUserData(updatedUser);
      fetchUserDataByEmail(userData.email);
    } catch (error) {
      console.error("Failed to update watchLater status:", error);
      updateMovieState(movieId, "watchLater", !newWatchLaterState); // Revert state on error
    }
  };

  return (
    <Box className={styles.container}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginBottom={theme.spacing(3)}
      >
        <TextField
          variant="outlined"
          placeholder="Search for movies..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          InputProps={{
            startAdornment: (
              <SearchIcon style={{ marginRight: theme.spacing(1) }} />
            ),
          }}
          sx={{
            width: isMobile ? "90%" : "50%",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={
          isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)"
        }
        gap={theme.spacing(2)}
      >
        {filteredMovies.map((movie) => (
          <Box key={movie.id} className={styles.movieCard}>
            <Typography variant="h6" className={styles.title}>
              {movie.title}
            </Typography>
            <img
              src={movie.imageURL}
              alt={movie.title}
              className={styles.image}
            />
            <Typography className={styles.description}>
              {movie.description}
            </Typography>
            {isLoggedIn && (
              <Box className={styles.footer}>
                <IconButton onClick={() => handleFavoriteClick(movie.id)}>
                  <FavoriteIcon
                    style={{
                      fill: movie.liked ? "red" : "white",
                    }}
                  />
                </IconButton>
                <IconButton onClick={() => handleWatchLaterClick(movie.id)}>
                  <WatchLaterIcon
                    style={{
                      fill: movie.watchLater ? "red" : "white",
                    }}
                  />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Movies;
