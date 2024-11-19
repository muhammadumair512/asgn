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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1px solid black",
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
  color: "black",
  "&::placeholder": {
    color: "black",
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
    <Box sx={{ width: 250, textAlign: "center" }}>
      <IconButton onClick={toggleDrawer(false)} className={styles.closeIcon}>
        <Close />
      </IconButton>
      <List>
        <ListItem component="a" href="/favourite">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favourite" />
        </ListItem>
        <ListItem component="a" href="/watch-later">
          <ListItemIcon>
            <WatchLaterIcon />
          </ListItemIcon>
          <ListItemText primary="Watch Later" />
        </ListItem>
        <ListItem component="a" href="/login">
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    </Box>
  );

  return (
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
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            startIcon={<FavoriteIcon />}
            color="inherit"
            href="/favourite"
          >
            Favourite
          </Button>
          <Button
            startIcon={<WatchLaterIcon />}
            color="inherit"
            href="/watch-later"
          >
            Watch Later
          </Button>
        </Box>

        {/* Right: Login Button */}
        <Box sx={{ display: { xs: "none", sm: "flex" } }}>
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
