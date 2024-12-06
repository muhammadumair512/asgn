import React, { useState, useEffect } from "react";
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
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import { logoutUser } from "../../services/userService"; // Assuming you have this method in userService

const theme = createTheme({
  shape: {
    borderRadius: 28, // Set default border radius
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // console.log(user);
    const checkSessionCookie = () => {
      const session = Cookies.get("session");
      setIsLoggedIn(!!session); // Update login state based on session cookie
    };

    // Initial check when the component mounts
    checkSessionCookie();

    // Set up an interval to check for cookie changes every second
    const interval = setInterval(checkSessionCookie, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

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
        {isLoggedIn ? (
          <>
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
                <ListItemText
                  primary="Watch Later"
                  className={styles.listItem}
                />
              </NavLink>
            </ListItem>
          </>
        ) : (
          <ListItem
            component="a"
            href="/"
            style={{
              cursor: "pointer",
              color: "black",
              textDecoration: "none",
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false); // Update state after logging out
  };

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

          {/* Brand Logo */}
          <Box className={styles.logoContainer}>
            <NavLink to="/" className={styles.logoLink}>
              <img
                src="https://res.cloudinary.com/dtra3fmqb/image/upload/v1732991149/Creative_cjj4ei.png" // Replace with your logo path
                alt="Brand Logo"
                className={styles.logo}
              />
            </NavLink>
          </Box>

          {/* Search Bar */}
          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search movies"
              inputProps={{ "aria-label": "search movies" }}
            />
          </Search>

          {/* Navigation Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "left",
              gap: 2,
            }}
          >
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.inactive
                  }
                >
                  <Button startIcon={<HomeIcon />}>Home</Button>
                </NavLink>
                <NavLink
                  to="/favourite"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.inactive
                  }
                >
                  <Button startIcon={<FavoriteIcon />}>Favourite</Button>
                </NavLink>
                <NavLink
                  to="/watchLater"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.inactive
                  }
                >
                  <Button startIcon={<WatchLaterIcon />}>Watch Later</Button>
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.inactive
                }
              >
                <Button startIcon={<HomeIcon />}>Home</Button>
              </NavLink>
            )}
          </Box>

          {/* Right: Login/Logout */}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                style={{
                  color: "#5f9ea0",
                  border: "1px solid #5f9ea0",
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                href="/"
                style={{
                  color: "#5f9ea0",
                  border: "1px solid #5f9ea0",
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
