import React from 'react';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { setCharacterInfo } from '../../store/characterSlice';
import InventorySorter from './InventorySorter';
import { TextField, Paper, List, ListItem, ListItemText } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import "./EditCharacter.scss";

export default function EditCharacter() {
  const dispatch = useDispatch();
  const characterInfo = useSelector((state) => state.character.characterInfo);

  const updateCharacterName = (event) => {
    dispatch(setCharacterInfo({ ...characterInfo, name: event.target.value }));
  };

  const updateNotes = (event) => {
    dispatch(setCharacterInfo({ ...characterInfo, notes: event.target.value }));
  };

  return !isEmpty(characterInfo) && (
    <React.Fragment>
      <div className='edit-character-container'>
        <div className='character-name-container'>
          <h1 className='characterName-header'>Character Name:</h1>
          <Paper className="characterName-paper">
            <TextField onChange={updateCharacterName} style={{ width: "100%" }} />
          </Paper>
        </div>
        <h2>{`Character Background (Random): ${characterInfo.background.backgroundName}`}</h2>
        {characterInfo.background.special && (
          <div className="background-notes-special-container">
            <div className="backgroundInfo-container">
              <h3>Background description:</h3>
              <Paper className="backgroundInfo-paper">
                <p>{characterInfo.background.description}</p>
              </Paper>
            </div>
            <div className="backgroundSpecial-container">
              <h3>Background special:</h3>
              <Paper className="backgroundSpecial-paper">
                <p>{characterInfo.background.special}</p>
              </Paper>
            </div>
            <div className="notes-container">
              <h3>Notes:</h3>
              <Paper className="notes-paper">
                <TextField onChange={updateNotes} multiline={true} rows={6} style={{ width: "100%" }} />
              </Paper>
            </div>
          </div>
        )}
        {!characterInfo.background.special && (
          <div className="background-notes-container">
            <div className="backgroundInfo-container">
              <h3>Background description:</h3>
              <Paper className="backgroundInfo-paper">
                <p>{characterInfo.background.description}</p>
              </Paper>
            </div>
            <div className="notes-container">
              <h3>Notes:</h3>
              <Paper className="notes-paper">
                <TextField onChange={updateNotes} multiline={true} rows={6} style={{ width: "100%" }} />
              </Paper>
            </div>
          </div>
        )}
        <div className="possessions-advanced-skills-container">
          <div className="possessions-container">
            <h3>Possessions (Including baseline possessions):</h3>
            <div className="inventory">
              <Paper className="inventory-paper">
                <InventorySorter />
              </Paper>
            </div>
          </div>
          <div className="advanced-skills-container">
            <h3>Advanced Skills</h3>
            <div className="advanced-skills">
              <Paper className="advanced-skills-paper">
                <List style={{ width: "100%" }}>
                  {characterInfo.background.advancedSkills && _.map(characterInfo.background.advancedSkills, (result, index) => (
                    <ListItem id={`background${index}`} key={`backgroundKey${index}`}>
                      <ListItemText
                        primary={`${result} ${index.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
