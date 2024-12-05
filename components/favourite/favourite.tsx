import { useState, useEffect } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { useTheme } from "@mui/material/styles";
import styles from "./favourite.module.css";
import {
  getUserDataFromLocalStorage,
  fetchAllMovies,
} from "../../services/userService";

const Favourite = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [userData, setUserData] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]); // Initialize as an array

  // Fetch user details and movies when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const user = getUserDataFromLocalStorage(); // Retrieve logged-in user data
      const moviesData = await fetchAllMovies(); // Fetch all movies

      if (user) {
        setUserData(user);
      }

      if (moviesData) {
        setMovies(moviesData); // Set the fetched movies
      }
    };

    fetchData();
  }, []);

  // Filter the movies to only show those in the user's watchLater list
  const filteredMovies = movies.filter((movie) =>
    userData?.likedMovies?.includes(movie.id)
  );
  console.log(filteredMovies);
  return (
    <Box className={styles.container}>
      {/* Replacing Grid with CSS Grid */}
      <Box
        display="grid"
        gridTemplateColumns={
          isMobile
            ? "1fr" // 1 movie per row on mobile
            : isTablet
            ? "repeat(2, 1fr)" // 2 movies per row on tablets
            : "repeat(4, 1fr)" // 4 movies per row on desktop
        }
        gap={theme.spacing(2)} // Ensures consistent spacing
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Box key={movie.id} className={styles.movieCard}>
              {/* Title */}
              <Typography variant="h6" className={styles.title}>
                {movie.title}
              </Typography>
              {/* Image */}
              <img
                src={movie.imageURL}
                alt={movie.title}
                className={styles.image}
              />
              {/* Description */}
              <Typography className={styles.description}>
                {movie.description}
              </Typography>
              {/* Buttons */}
              <Box className={styles.footer}>
                <IconButton>
                  <FavoriteBorderIcon
                    style={{
                      fill: userData.likedMovies.includes(movie.id)
                        ? "red"
                        : "white",
                    }}
                  />
                </IconButton>
                <IconButton>
                  <WatchLaterIcon
                    style={{
                      color: userData.watchLater.includes(movie.id)
                        ? "red"
                        : "white",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="h6">No movies in Watch Later list</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Favourite;
