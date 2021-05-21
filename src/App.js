import React from "react";
import { useHistory } from "react-router-dom";
import Background from './components/Background/Background';
import CharacterGenerator from './components/CharacterGenerator/CharacterGenerator';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MoodRoundedIcon from '@material-ui/icons/MoodRounded';
import MoodBadRoundedIcon from '@material-ui/icons/MoodBadRounded';

import {
  Switch,
  Route,
} from "react-router-dom";

import './App.css';

export default function App() {

  const history = useHistory();

  const [value, setValue] = React.useState('background');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) { 
        case "background": 
          history.push('/');
          return null;
        case "characterGen": 
          history.push('/characterGen');
          return null;
        default: 
          return null;
    }
  };

  return (
    <React.Fragment>

        <Switch>
          <Route path="/characterGen">
            <CharacterGenerator />
          </Route>
          <Route path="/">
            <Background />
          </Route>
        </Switch>

        <BottomNavigation value={value} onChange={handleChange} className="bottom-navigation">
          <BottomNavigationAction label="Background" value="background" icon={<MoodRoundedIcon />} />
          <BottomNavigationAction label="Character Generator" value="characterGen" icon={<MoodBadRoundedIcon />} />
        </BottomNavigation>
      {/* </div> */}
    </React.Fragment>
  );
}