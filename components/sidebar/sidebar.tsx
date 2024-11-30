import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "./sidebar.module.css";

const Sidebar: React.FC = () => {
  return (
    <Box className={styles.sidebar}>
      <Button href="/favourite" variant="contained" className={styles.button}>
        Favourite
      </Button>
      <Button href="/watch-later" variant="contained" className={styles.button}>
        Watch Later
      </Button>
    </Box>
  );
};

export default Sidebar;
