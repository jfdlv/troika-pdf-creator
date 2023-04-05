import * as React from 'react';
import { useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import {Store} from "../../AppState/Store";

export default function LoginMenu() {
  const { state, actions } = React.useContext(Store);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const history = useHistory();

  const navigateTo = (newValue) => {
    switch (newValue) { 
        case "UserCharacters": 
          history.push('/userCharacters');
          return null;
        default: 
          return null;
    }
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <PersonOutlineIcon /><span style={{marginLeft:"10px"}}>{state.currentUser.email}</span>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        <MenuItem onClick={()=>{navigateTo("UserCharacters")}}>Your Characters</MenuItem>
        <MenuItem onClick={actions.signOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}