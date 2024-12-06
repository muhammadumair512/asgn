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
import Menu from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import { logoutUser } from "../../services/userService";
import { useDataContext } from "../../dataContext";

const theme = createTheme({
  shape: {
    borderRadius: 28, // Set default border radius
  },
});

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useDataContext();

  useEffect(() => {
    const checkSessionCookie = () => {
      const session = Cookies.get("session");
      setIsLoggedIn(!!session);
    };
    checkSessionCookie();
  }, [user]);

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
  };

  const drawerContent = (
    <Box sx={{ width: 200, textAlign: "left" }} className={styles.drawer}>
      <Box sx={{ textAlign: "right", padding: 1 }}>
        <IconButton onClick={toggleDrawer(false)} className={styles.closeIcon}>
          <Close />
        </IconButton>
      </Box>
      <List className={styles.list}>
        <ListItem>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </NavLink>
        </ListItem>
        {isLoggedIn && (
          <>
            <ListItem>
              <NavLink
                to="/favourite"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.inactive
                }
              >
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Favourite" />
              </NavLink>
            </ListItem>
            <ListItem>
              <NavLink
                to="/watchLater"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.inactive
                }
              >
                <ListItemIcon>
                  <WatchLaterIcon />
                </ListItemIcon>
                <ListItemText primary="Watch Later" />
              </NavLink>
            </ListItem>
            <ListItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
        {!isLoggedIn && (
          <ListItem component="a" href="/">
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar className={styles.toolbar}>
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
          <Box className={styles.logoContainer}>
            <NavLink to="/" className={styles.logoLink}>
              <img
                src="https://res.cloudinary.com/dtra3fmqb/image/upload/v1732991149/Creative_cjj4ei.png"
                alt="Brand Logo"
                className={styles.logo}
              />
            </NavLink>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "left",
              gap: 2,
            }}
          >
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? styles.active : styles.inactive
              }
            >
              <Button startIcon={<HomeIcon />}>Home</Button>
            </NavLink>
            {isLoggedIn && (
              <>
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
            )}
          </Box>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
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
                startIcon={<LoginIcon />}
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
