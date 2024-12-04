import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import styles from "./Movies.module.css";
import { fetchAllMovies, verifyCookie } from "../../services/userService";

interface Movie {
  id: number;
  title: string;
  imageURL: string;
  description: string;
  category: string;
  liked: boolean;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isCookieValid, setIsCookieValid] = useState(false);

  useEffect(() => {
    const checkCookies = async () => {
      const sessionID = localStorage.getItem("session"); // Retrieve session ID from localStorage
      if (sessionID) {
        const valid = verifyCookie(sessionID); // Verify the cookie
        setIsCookieValid(valid); // Update state based on verification result
      }
    };

    const loadMovies = async () => {
      try {
        const data = await fetchAllMovies();
        setMovies(data);
      } catch (error: unknown) {
        console.error(
          "Error fetching movies:",
          error instanceof Error ? error.message : error
        );
      }
    };

    checkCookies();
    loadMovies();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box className={styles.container}>
      {/* CSS Grid Layout */}
      <Box
        display="grid"
        gridTemplateColumns={
          isMobile
            ? "1fr" // 1 movie per row on mobile
            : isTablet
            ? "repeat(2, 1fr)" // 2 movies per row on tablets
            : "repeat(4, 1fr)" // 4 movies per row on desktop
        }
        gap={theme.spacing(2)} // Consistent spacing
      >
        {movies.map((movie) => (
          <Box key={movie.id} className={styles.movieCard}>
            {/* Movie Title */}
            <Typography variant="h6" className={styles.title}>
              {movie.title}
            </Typography>
            {/* Movie Image */}
            <img
              src={movie.imageURL}
              alt={movie.title}
              className={styles.image}
            />
            {/* Movie Description */}
            <Typography className={styles.description}>
              {movie.description}
            </Typography>
            {/* Action Buttons */}
            {isCookieValid && ( // Only render if cookies are valid
              <Box className={styles.footer}>
                <IconButton>
                  <FavoriteBorderIcon
                    style={{ color: movie.liked ? "red" : "white" }}
                  />
                </IconButton>
                <IconButton>
                  <WatchLaterIcon
                    style={{ color: movie.liked ? "red" : "white" }}
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
