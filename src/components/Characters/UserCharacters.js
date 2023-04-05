import React, {useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {Grid} from '@mui/material';
import { styled } from '@mui/material/styles';
import {database} from "../../config/firebase";

import {Store} from "../../AppState/Store";

import { doc, getDoc } from "firebase/firestore";
import { isEmpty } from 'lodash';

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

  const [userCharactersArray, setUserCharactersArray] = React.useState([]);

  useEffect(()=>{
    if(!isEmpty(state.currentUser)) {
      const docRef = doc(database, "userCharacters", state.currentUser.uid);
      getDoc(docRef).then(docSnap => {
        let auxArray = [];
        docSnap.data().characters.forEach(element => {auxArray.push(JSON.parse(element))});
        console.log(auxArray);
        setUserCharactersArray(auxArray);
      });
    }
  },[state.currentUser])

  return (<>
    {!isEmpty(state.currentUser) && <Box sx={{ width: '80%', marginLeft: "10%", padding: "10px" }}>
      <Stack spacing={2}>
        <Item style={{backgroundColor: "#ffffff", opacity: "0.7", cursor: "auto"}}  key="character">
          <Grid container style={{color: "#1A2027"}}>
            <Grid item md={6} style={{textAlign:"left", textTransform:"uppercase", fontWeight: "bold"}}>Character Name</Grid>
            <Grid item md={6} style={{textAlign:"right", textTransform:"uppercase", fontWeight: "bold"}}>Background</Grid>
          </Grid>
        </Item>
        {userCharactersArray.map((element,key) => {console.log(element);return <Item onClick={()=>{actions.setCharacterInfo(element); history.push("/virtualSheet")}} key={`character${key}`}>
          <Grid container>
            <Grid item md={6} style={{textAlign:"left", textTransform:"capitalize"}}>{element.name.toLowerCase()}</Grid>
            <Grid item md={6} style={{textAlign:"right", textTransform:"capitalize"}}>{element.background.backgroundName.toLowerCase()}</Grid>
          </Grid>
        </Item>} )}
      </Stack>
    </Box>}
    {isEmpty(state.currentUser) && <div>You're not logged in</div>}
  </>
  );
}