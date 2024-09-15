import React, { useEffect } from "react";
import Home from './components/Home/Home';
import CharacterGenerator from './components/CharacterGenerator/CharacterGenerator';
import Background from './components/Background/Background';
import Register from "./components/Register/Register";
import Login from './components/Login/Login';
import LoginMenu from './components/Login/LoginMenu';
import UserCharacters from "./components/Characters/UserCharacters";
import VirtualCharacterSheet from "./components/Characters/VirtualCharacterSheet";


import {
  Switch,
  Route,
  useHistory,
  useLocation
} from "react-router-dom";

import './App.scss';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomeIcon from '@mui/icons-material/Home';

import {Store} from "./AppState/Store";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  
  const { state, actions } = React.useContext(Store);
  const location = useLocation();
  const history = useHistory();
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);



  const getLabel = () => {
    switch (location.pathname) {
      case "/":
        return "Troika Toolkit"
      case "/characterGen":
        return "Character Generator"
      case "/characterGen/editCharacter":
        return "Edit your character"
      case "/background":
        return "Background Creator"
      default:
        break;
    }
  }

  const handleClickOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleClickOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  useEffect(()=>{
    actions.getDamageTable();
    actions.getBackgrounds();
  },[])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{display:"flex", flexDirection: "column", alignItems: "center"}}>
          
          <AppBar position="sticky" className="navbar">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={()=>{history.push('/')}}
              >
                <HomeIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                {getLabel()}
              </Typography>
              {!state.currentUser &&  <Button color="inherit" sx={{float:"right"}} onClick={handleClickOpenLogin}>Login</Button>}
              {!state.currentUser &&  <Button color="inherit" sx={{float:"right"}} onClick={handleClickOpenRegister}>Register</Button>}
              {state.currentUser && <LoginMenu />}
            </Toolbar>
          </AppBar>
          
          <Switch>
            <Route path="/virtualSheet">
              <VirtualCharacterSheet />
            </Route>
            <Route path="/userCharacters">
              <UserCharacters />
            </Route>
            <Route path="/characterGen">
              <CharacterGenerator />
            </Route>
            <Route path="/background">
              <Background/>
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>

          <Login open={openLogin} setOpenLogin={setOpenLogin} handleClose={handleCloseLogin}/>
          <Register open={openRegister} setOpenRegister={setOpenRegister} handleClose={handleCloseRegister}/>
      </Box>
    </ThemeProvider>
  );
}