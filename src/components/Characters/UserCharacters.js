import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {Grid} from '@mui/material';
import { styled } from '@mui/material/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {database} from "../../config/firebase";

import {Store} from "../../AppState/Store";

import { doc, getDocs, collection } from "firebase/firestore";
import { isEmpty } from 'lodash';

import "./UserCharacters.scss";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: "pointer"
}));

export default function UserCharacters() {
  const { state, actions } = React.useContext(Store);
  const history = useHistory();

  const [userCharactersArray, setUserCharactersArray] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(()=>{
    async function getCharacters () {
      if(!isEmpty(state.currentUser)) {
        let userCharactersRef = collection(database, "userCharacters", state.currentUser.uid, "characters");
        try {
          setShowSpinner(true);
          const auxArray = [];
          const querySnapshot = await getDocs(userCharactersRef); // Get all documents in the subcollection
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            auxArray.push({id: doc.id, ...data})
            console.log(`${doc.id} =>`, doc.data()); // Log each document's ID and data
          });
          setUserCharactersArray(auxArray);
        } catch (error) {
          console.error("Error getting documents: ", error);
        } finally {
          setShowSpinner(false)
        }
      }
    }
    getCharacters();
  },[state.currentUser])

  return (<>
    {!showSpinner && <Box className="characters-container">
      <Stack spacing={2}>
        <Item style={{backgroundColor: "#ffffff", opacity: "0.7", cursor: "auto"}}  key="character">
          <Grid container style={{color: "#1A2027"}}>
            <Grid item md={6} style={{textTransform:"uppercase", fontWeight: "bold", width: "50%"}}>Character Name</Grid>
            <Grid item md={6} style={{textTransform:"uppercase", fontWeight: "bold", width: "50%"}}>Background</Grid>
          </Grid>
        </Item>
        {userCharactersArray.map((element,key) => {console.log(element);return <Item onClick={()=>{actions.setCharacterInfo(element); history.push("/virtualSheet")}} key={`character${key}`}>
          <Grid container>
            <Grid item style={{textTransform:"capitalize", width: "50%"}}>{element.name.length > 0 ? element.name.toLowerCase() : "--"}</Grid>
            <Grid item style={{textTransform:"capitalize", width: "50%"}}>{element.background.backgroundName.toLowerCase()}</Grid>
          </Grid>
        </Item>} )}
      </Stack>
    </Box>}
    {showSpinner && <CircularProgress style={{marginTop: "10px", height: "50px", width: "50px"}}/>}
  </>
  );
}