import { useState, useEffect } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { useTheme } from "@mui/material/styles";
import styles from "./favourite.module.css";
import {
  getUserDataFromLocalStorage,
  fetchAllMovies,
  toggleLikeMovie,
  toggleLaterMovie,
  fetchUserDataByEmail,
} from "../../services/userService";

interface Movie {
  id: number;
  title: string;
  imageURL: string;
  description: string;
  category: string;
  liked: boolean; // Reflects whether the movie is liked by the user
  watchLater: boolean; // Reflects whether the movie is added to Watch Later
}

const Favourite = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [userData, setUserData] = useState<any>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUserDataFromLocalStorage();
        const moviesData = await fetchAllMovies();

        if (user) {
          setUserData(user);

          const updatedMovies = moviesData.map((movie) => ({
            ...movie,
            liked: user.likedMovies.includes(movie.id),
            watchLater: user.watchLater?.includes(movie.id) || false, // Ensure watchLater is handled
          }));
          setMovies(updatedMovies);
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error instanceof Error ? error.message : error
        );
      }
    };

    fetchData();
  }, []);

  const handleFavoriteClick = async (movieId: number) => {
    if (!userData) return;

    const updatedUser = await toggleLikeMovie(userData.email, movieId);
    fetchUserDataByEmail(userData.email);

    if (updatedUser) {
      setUserData(updatedUser);
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
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId
            ? { ...movie, watchLater: !movie.watchLater } // Toggle watchLater state
            : movie
        )
      );
    }
  };

  const filteredMovies = movies.filter((movie) => movie.liked);

  return (
    <Box className={styles.container}>
      <Box
        display="grid"
        gridTemplateColumns={
          isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)"
        }
        gap={theme.spacing(2)}
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
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
                      color: movie.watchLater ? "red" : "white",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="h6">
            No movies in your Favorites list.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Favourite;
