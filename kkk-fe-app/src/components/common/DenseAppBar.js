import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

export default function DenseAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <MenuIcon style={{marginRight: "10px"}}/>
          <Typography variant="h6" color="inherit" component="div">
            <Link to={"/"} style={{marginRight: "10px", textDecoration: "none", color: "white"}}>
              User
            </Link>
          </Typography>
          <Typography variant="h6" color="inherit" component="div" >
            <Link to={"/summary"} style={{marginRight: "10px", textDecoration: "none", color: "white"}}>
              Summary
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}