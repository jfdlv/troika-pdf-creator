import * as React from 'react';
import { useHistory } from "react-router-dom";
import {Store} from "../../AppState/Store";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Grid from '@mui/material/Grid';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DescriptionIcon from '@mui/icons-material/Description';

import "./Home.scss";

export default function Home() {
  const { state, actions } = React.useContext(Store);
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

  const MyCardContent = ({title, description, route, buttonLabel}) => {
    return (<>
      <CardContent style={{ minHeight: "150px" }}>
        <Typography variant="h5" component="div">
          {/* Background Creator */}
          {title}
        </Typography>
        <Typography variant="body2" style={{ padding: "5px" }}>
          {/* Lets you create a background and print a PDF. */}
          {description}
        </Typography>
      </CardContent>
      <CardActions style={{justifyContent: "flex-end", padding: "5%"}}>
          <Button size="small" color="secondary" variant="contained" onClick={() => { navigateTo(route); } }>
            <span>{buttonLabel}</span><ArrowRightIcon />
          </Button>
      </CardActions>
    </>)
  }

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