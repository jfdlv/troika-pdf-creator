import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setCharacterInfo } from '../../store/characterSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { database } from "../../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { isEmpty } from 'lodash';
import "./UserCharacters.scss";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: "pointer",
}));

export default function UserCharacters() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [userCharactersArray, setUserCharactersArray] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    async function getCharacters() {
      if (!isEmpty(currentUser)) {
        const userCharactersRef = collection(database, "userCharacters", currentUser.uid, "characters");
        try {
          setShowSpinner(true);
          const auxArray = [];
          const querySnapshot = await getDocs(userCharactersRef);
          querySnapshot.forEach((doc) => {
            auxArray.push({ id: doc.id, ...doc.data() });
          });
          setUserCharactersArray(auxArray);
        } catch (error) {
          console.error("Error getting documents: ", error);
        } finally {
          setShowSpinner(false);
        }
      }
    }
    getCharacters();
  }, [currentUser]);

  const handleCharacterClick = (element) => {
    dispatch(setCharacterInfo(element));
    navigate("/virtualSheet");
  };

  return (
    <>
      {!showSpinner && (
        <Box className="characters-container">
          <Stack spacing={2}>
            <Item style={{ backgroundColor: "#ffffff", opacity: "0.7", cursor: "auto" }}>
              <Grid container style={{ color: "#1A2027" }}>
                <Grid item md={6} style={{ textTransform: "uppercase", fontWeight: "bold", width: "50%" }}>Character Name</Grid>
                <Grid item md={6} style={{ textTransform: "uppercase", fontWeight: "bold", width: "50%" }}>Background</Grid>
              </Grid>
            </Item>
            {userCharactersArray.map((element, key) => (
              <Item onClick={() => handleCharacterClick(element)} key={`character${key}`}>
                <Grid container>
                  <Grid item style={{ textTransform: "capitalize", width: "50%" }}>
                    {element.name?.length > 0 ? element.name.toLowerCase() : "--"}
                  </Grid>
                  <Grid item style={{ textTransform: "capitalize", width: "50%" }}>
                    {element.background.backgroundName.toLowerCase()}
                  </Grid>
                </Grid>
              </Item>
            ))}
          </Stack>
        </Box>
      )}
      {showSpinner && <CircularProgress style={{ marginTop: "10px", height: "50px", width: "50px" }} />}
    </>
  );
}
