import  React from 'react';
import AppBar from '@mui/material/AppBar';
import {Box,Toolbar,Typography,IconButton,Menu,MenuItem, makeStyles} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

export default function Header() {
   const styles=makeStyles
   const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
 
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>  <Link to="/home" >Homepage</Link> </MenuItem>
        <MenuItem onClick={handleClose}>  <Link to="/tictactoe" >Tictactoe</Link></MenuItem>
       
      </Menu>
      
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
      <MenuIcon         onClick={handleClick}/>
    </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Menu
          </Typography>
        </Toolbar>
        
      </AppBar>
    </Box>
  );
}
