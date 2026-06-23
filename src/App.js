import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { database } from './config/firebase';
import { setCurrentUser } from './store/authSlice';
import { getDamageTableThunk, getBackgroundsThunk } from './store/dataSlice';

import Home from './components/Home/Home';
import CharacterGenerator from './components/CharacterGenerator/CharacterGenerator';
import Background from './components/Background/Background';
import BackgroundsList from './components/BackgroundsList/BackgroundsList';
import Register from "./components/Register/Register";
import Login from './components/Login/Login';
import LoginMenu from './components/Login/LoginMenu';
import UserCharacters from "./components/Characters/UserCharacters";
import VirtualCharacterSheet from "./components/Characters/VirtualCharacterSheet";
import Initiative from './components/Initiative/Initiative';

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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminSnap = await getDoc(doc(database, 'admins', firebaseUser.uid));
        dispatch(setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          isAdmin: adminSnap.exists(),
        }));
      } else {
        dispatch(setCurrentUser(null));
      }
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDamageTableThunk());
    dispatch(getBackgroundsThunk());
  }, [dispatch]);

  const getLabel = () => {
    switch (location.pathname) {
      case "/": return "Troika Toolkit";
      case "/characterGen": return "Character Generator";
      case "/characterGen/editCharacter": return "Edit your character";
      case "/background": return "Add Background";
      case "/backgrounds": return "Backgrounds";
      case "/initiative": return "Initiative";
      default: return "";
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <AppBar position="sticky" className="navbar">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => navigate('/')}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
              {getLabel()}
            </Typography>
            {!currentUser && <Button color="inherit" sx={{ float: "right" }} onClick={() => setOpenLogin(true)}>Login</Button>}
            {!currentUser && <Button color="inherit" sx={{ float: "right" }} onClick={() => setOpenRegister(true)}>Register</Button>}
            {currentUser && <LoginMenu />}
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/virtualSheet" element={<VirtualCharacterSheet />} />
          <Route path="/userCharacters" element={<UserCharacters />} />
          <Route path="/characterGen/*" element={<CharacterGenerator />} />
          <Route path="/backgrounds" element={<BackgroundsList />} />
          <Route path="/background" element={<Background />} />
          <Route path="/initiative" element={<Initiative />} />
          <Route path="/" element={<Home />} />
        </Routes>

        <Login open={openLogin} setOpenLogin={setOpenLogin} handleClose={() => setOpenLogin(false)} />
        <Register open={openRegister} setOpenRegister={setOpenRegister} handleClose={() => setOpenRegister(false)} />
      </Box>
    </ThemeProvider>
  );
}
