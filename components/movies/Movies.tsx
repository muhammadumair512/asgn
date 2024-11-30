// import React from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { useTheme } from "@mui/material/styles";
import styles from "./Movies.module.css";

// Dummy movie data
const data = [
  {
    id: 1,
    title: "Inception",
    imageURL: "https://via.placeholder.com/300x400",
    description: "A mind-bending thriller by Christopher Nolan.",
    category: "Sci-Fi",
    liked: false,
  },
  {
    id: 2,
    title: "Interstellar",
    imageURL: "https://via.placeholder.com/300x400",
    description: "Exploring the mysteries of space and time.",
    category: "Sci-Fi",
    liked: true,
  },
  {
    id: 3,
    title: "The Dark Knight",
    imageURL: "https://via.placeholder.com/300x400",
    description: "Batman takes on the Joker in this masterpiece.",
    category: "Action",
    liked: false,
  },
  {
    id: 4,
    title: "The Matrix",
    imageURL: "https://via.placeholder.com/300x400",
    description: "Enter the digital world of the Matrix.",
    category: "Sci-Fi",
    liked: true,
  },
  {
    id: 5,
    title: "Avatar",
    imageURL: "https://via.placeholder.com/300x400",
    description: "An epic journey to Pandora.",
    category: "Fantasy",
    liked: false,
  },
];

const Movies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
        {data.map((movie) => (
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
                  style={{ color: movie.liked ? "red" : "white" }}
                />
              </IconButton>
              <IconButton>
                <WatchLaterIcon
                  style={{ color: movie.liked ? "red" : "white" }}
                />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Movies;
