import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CasinoIcon from '@mui/icons-material/Casino';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PetsIcon from '@mui/icons-material/Pets';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import "./Home.scss";

export default function Home() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();

  return (
    <div className='home-container'>
      <div className='home-item'>
        <Card variant="outlined" className='card-item' onClick={() => navigate('/characterGen')}>
          <PersonAddAlt1Icon style={{ fontSize: "150px" }} />
          <div className="home-label">Create Character</div>
        </Card>
      </div>
      <div className='home-item'>
        <Card variant="outlined" className='card-item' onClick={() => navigate('/backgrounds')}>
          <MenuBookIcon style={{ fontSize: "150px" }} />
          <div className="home-label">Backgrounds</div>
        </Card>
      </div>
      <div className='home-item'>
        <Card variant="outlined" className='card-item' onClick={() => navigate('/initiative')}>
          <CasinoIcon style={{ fontSize: "150px" }} />
          <div className="home-label">Initiative</div>
        </Card>
      </div>
      <div className='home-item'>
        <Card variant="outlined" className='card-item' onClick={() => navigate('/bestiary')}>
          <PetsIcon style={{ fontSize: "150px" }} />
          <div className="home-label">Bestiary</div>
        </Card>
      </div>
      <div className='home-item'>
        <Card variant="outlined" className='card-item' onClick={() => navigate('/spells')}>
          <AutoAwesomeIcon style={{ fontSize: "150px" }} />
          <div className="home-label">Spells</div>
        </Card>
      </div>
    </div>
  );
}
