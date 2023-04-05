import * as React from 'react';
import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Grid from '@mui/material/Grid';

import "./Home.scss";

export default function Home() {
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
    // <Grid id="Home" container direction="row" spacing={3}justifyItems="center" alignItems="center" style={{maxHeight: "100%", width: "50%", marginLeft: "25%",padding:"10px"}}>
    <div className='home-container'>  
      <div className='home-item'>
          <Card variant="outlined">
            <MyCardContent 
              title={"Character Generator"} 
              description={"Generates a character picking a background randomly (from the core book) also lets you order your inventory and add some notes to the page before printing a PDF."} 
              route={"characterGen"}
              buttonLabel={"Create Character"}/>  
          </Card> 
      </div>
      <div className='home-item'>
          <Card variant="outlined">
            <MyCardContent 
                title={"Background Creator"} 
                description={"Lets you create a background and print a PDF."} 
                route={"background"}
                buttonLabel={"Create Background"}/>  
          </Card>
      </div>
    </div>
  );
}