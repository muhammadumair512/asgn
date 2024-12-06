import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

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

  useEffect(() => {
    const checkSessionCookie = () => {
      const session = Cookies.get("session");
      setIsLoggedIn(!!session);
    };

    checkSessionCookie();
    const interval = setInterval(checkSessionCookie, 1000);

    return () => clearInterval(interval);
  }, []);

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
      } catch (error: unknown) {
        console.error(
          "Error fetching movies:",
          error instanceof Error ? error.message : error
        );
      }
    };

    loadMovies();
  }, [setUser]);

  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchTerm, movies]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleFavoriteClick = async (movieId: number) => {
    if (!userData) return;
    const updatedUser = await toggleLikeMovie(userData.email, movieId);
    fetchUserDataByEmail(userData.email);

    if (updatedUser) {
      setUserData(updatedUser);
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId ? { ...movie, liked: !movie.liked } : movie
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
            ? { ...movie, watchLater: !movie.watchLater }
            : movie
        )
      );
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
