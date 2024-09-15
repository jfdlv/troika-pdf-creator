import * as React from 'react';
import { useHistory } from "react-router-dom";
import {Store} from "../../AppState/Store";
import Card from '@mui/material/Card';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DescriptionIcon from '@mui/icons-material/Description';

import "./Home.scss";

export default function Home() {
  const { state } = React.useContext(Store);
  const history = useHistory();

  const navigateTo = (newValue) => {
    switch (newValue) { 
        case "background": 
          history.push('/background');
          return null;
        case "characterGen": 
          history.push('/characterGen');
          return null;
        default: 
          return null;
    }
  };

  return (
    <div className='home-container'>  
      <div className='home-item'>
          <Card variant="outlined" 
            className='card-item'
            onClick={()=>{navigateTo("characterGen")}}>
              <PersonAddAlt1Icon style={{fontSize: "150px"}}/>
              <div className="home-label">
                Create Character
              </div>
          </Card> 
      </div>
      {state.currentUser && <div className='home-item'>
          <Card variant="outlined"
            className='card-item'
            onClick={()=>{navigateTo("background")}}>
              <DescriptionIcon style={{fontSize: "150px"}}/>
              <div className="home-label">
                Add Background
              </div>
          </Card>
      </div>}
    </div>
  );
}