import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  shape: {
    borderRadius: 28, // Set default border radius to 8px
  },
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  color: "white",
  border: "1px solid white",
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  "&::placeholder": {
    color: "white",
  },
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "20ch",
  },
}));

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250, textAlign: "left" }}>
      <Box sx={{ width: 250, textAlign: "right" }}>
        <IconButton onClick={toggleDrawer(false)} className={styles.closeIcon}>
          <Close />
        </IconButton>
      </Box>
      <List>
        <ListItem component="a">
          <NavLink
            to="/favourite"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.navLink}`
                : `${styles.inActive} ${styles.navLink}`
            }
          >
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favourite" className={styles.listItem} />
          </NavLink>
        </ListItem>
        <ListItem component="a">
          <NavLink
            to="/watchLater"
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.navLink}`
                : `${styles.inActive} ${styles.navLink}`
            }
          >
            <ListItemIcon>
              <WatchLaterIcon />
            </ListItemIcon>
            <ListItemText primary="Watch Later" className={styles.listItem} />
          </NavLink>
        </ListItem>
        <ListItem
          component="a"
          href="/login"
          style={{ cursor: "pointer", color: "black", textDecoration: "none" }}
        >
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar className={styles.toolbar}>
          {/* Hamburger Menu for Mobile */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { sm: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <Menu />
          </IconButton>
          <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>

          {/* Mobile: Search Bar in Center */}
          {/* Brand Logo */}
          <Box className={styles.logoContainer}>
            <NavLink to="/" className={styles.logoLink}>
              <img
                src="../../public/Creative.png" // Replace with your logo path
                alt="Brand Logo"
                className={styles.logo}
              />
            </NavLink>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search movies"
                inputProps={{ "aria-label": "search movies" }}
              />
            </Search>
          </Box>

          {/* Left: Search Bar on Larger Screens */}
          <Search sx={{ display: { xs: "none", sm: "block" } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search movies"
              inputProps={{ "aria-label": "search movies" }}
            />
          </Search>

          {/* Center: Navigation Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "left",
              gap: 2,
            }}
          >
            {" "}
            <NavLink
              to="/favourite"
              className={({ isActive }) =>
                isActive ? styles.active : styles.inactive
              }
            >
              {({ isActive }) => (
                <Button
                  startIcon={<FavoriteIcon />}
                  style={{ color: isActive ? "#FFFFFF" : "#83838c" }}
                  href="/favourite"
                >
                  Favourite
                </Button>
              )}
            </NavLink>
            <NavLink
              to="/watchLater"
              className={({ isActive }) =>
                isActive ? styles.active : styles.inactive
              }
            >
              {({ isActive }) => (
                <Button
                  startIcon={<WatchLaterIcon />}
                  style={{ color: isActive ? "#FFFFFF" : "#83838c" }}
                  href="/watchLater"
                >
                  Watch Later
                </Button>
              )}
            </NavLink>
          </Box>

          {/* Right: Login Button */}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <Button
              style={{
                color: "#5f9ea0",
                border: "1px solid #5f9ea0",
                width: 100,
              }}
              href="/login"
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
