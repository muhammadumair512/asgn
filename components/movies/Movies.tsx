import React, { useEffect, useState } from "react";
import {
  getUserDataFromLocalStorage,
  toggleLikeMovie,
  toggleLaterMovie,
  fetchUserDataByEmail,
  fetchAllMovies,
} from "../../services/userService";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import styles from "./Movies.module.css";

interface Movie {
  id: number;
  title: string;
  imageURL: string;
  description: string;
  category: string;
  liked: boolean; // Reflects whether the movie is liked by the user
  watchLater: boolean; // Reflects whether the movie is added to Watch Later
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const allMovies = await fetchAllMovies();
        const user = getUserDataFromLocalStorage();

        if (user) {
          setUserData(user);

          const updatedMovies = allMovies.map((movie) => ({
            ...movie,
            liked: user.likedMovies.includes(movie.id),
            watchLater: user.watchLater?.includes(movie.id) || false, // Ensure watchLater is handled
          }));

          setMovies(updatedMovies);
        } else {
          // Add default `watchLater` property to all movies if user is not logged in
          setMovies(
            allMovies.map((movie) => ({ ...movie, watchLater: false }))
          );
        }
      } catch (error: unknown) {
        console.error(
          "Error fetching movies:",
          error instanceof Error ? error.message : error
        );
      }
    };

    loadMovies();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleFavoriteClick = async (movieId: number) => {
    if (!userData) return;
    // console.log("this is emial" + userData.email);
    const updatedUser = await toggleLikeMovie(userData.email, movieId);

    fetchUserDataByEmail(userData.email);
    if (updatedUser) {
      setUserData(updatedUser);

      // Update movies state
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId
            ? { ...movie, liked: !movie.liked } // Toggle liked state
            : movie
        )
      );
    }
  };

  const handleWatchLaterClick = async (movieId: number) => {
    if (!userData) return;

    const updatedUser = await toggleLaterMovie(userData.email, movieId);
    fetchUserDataByEmail(userData.email);

    if (updatedUser) {
      setUserData(updatedUser);

      // Update movies state
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId
            ? { ...movie, watchLater: !movie.watchLater } // Toggle watchLater state
            : movie
        )
      );
    }
  };

  return (
    <Box className={styles.container}>
      <Box
        display="grid"
        gridTemplateColumns={
          isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)"
        }
        gap={theme.spacing(2)}
      >
        {movies.map((movie) => (
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
            {userData && (
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
