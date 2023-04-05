import React, {useContext} from 'react';
import _ from "lodash";
import InventorySorter from './InventorySorter';
import {Store} from '../../AppState/Store';
import {TextField, Container, Grid, Paper} from '@mui/material';

import {
    List,
    ListItem,
    ListItemText,
  } from "@material-ui/core";

import "./EditCharacter.scss";

export default function EditCharacter () {

    const {state, actions} = useContext(Store);

    const updateCharacterName = (event) => {
        let newCharacterInfo = Object.assign({},state.characterInfo);
        newCharacterInfo.name = event.target.value;
        // dispatch({type:"SET_CHARACTER_INFO", payload: newCharacterInfo});
        actions.setCharacterInfo(newCharacterInfo);
    }

    const updateNotes = (event) => {

        let newCharacterInfo = Object.assign({},state.characterInfo);
        newCharacterInfo.notes = event.target.value;
        // dispatch({type:"SET_CHARACTER_INFO", payload: newCharacterInfo});
        actions.setCharacterInfo(newCharacterInfo);
    }

    console.log(state.characterInfo);

    return <React.Fragment>
        <div className='edit-character-container'>
            <div className='character-name-container'>
                <h1 className='characterName-header'>{`Character Name:`}</h1>
                <Paper className="characterName-paper">
                    <TextField onChange={updateCharacterName} style={{width: "100%"}}/>
                </Paper>
            </div>
            <h2>{`Character Background (Random): ${state.characterInfo.background.backgroundName}`}</h2>
            {state.characterInfo.background.special &&  <div className="background-notes-special-container">
                <div className="backgroundInfo-container">
                    <h3>Background description:</h3>
                    <Paper className="backgroundInfo-paper">
                        <p>
                            {state.characterInfo.background.description}
                        </p>
                    </Paper>
                </div>
                <div className="backgroundSpecial-container">
                    <h3>Background special:</h3>
                    <Paper className="backgroundSpecial-paper">
                        <p>
                            {state.characterInfo.background.special}
                        </p>
                    </Paper>
                </div>
                <div className="notes-container">
                    <h3>Notes:</h3>
                    <Paper className="notes-paper">
                            <TextField onChange={updateNotes} multiline={true} rows={6} style={{width:"100%"}}/>
                    </Paper>
                </div>
            </div> }
            {!state.characterInfo.background.special &&  <div className="background-notes-container">
                <div className="backgroundInfo-container">
                    <h3>Background description:</h3>
                    <Paper className="backgroundInfo-paper">
                        <p>
                            {state.characterInfo.background.description}
                        </p>
                    </Paper>
                </div>
                <div className="notes-container">
                    <h3>Notes:</h3>
                    <Paper className="notes-paper">
                            <TextField onChange={updateNotes} multiline={true} rows={6} style={{width:"100%"}}/>
                    </Paper>
                </div>
            </div> }
            <div className="possessions-advanced-skills-container">
                <div className="possessions-container">
                    <h3>Possesssions (Including baseline possesions):</h3>
                    <div className="inventory">
                        <Paper className="inventory-paper">
                            <InventorySorter/>
                        </Paper>
                    </div>
                </div>
                <div className="advanced-skills-container">
                    <h3>Advanced Skills</h3>
                    <div className="advanced-skills">
                        <Paper className="advanced-skills-paper">
                            <List style={{width: "100%"}}>
                                {
                                    state.characterInfo.background.advancedSkills && _.map(state.characterInfo.background.advancedSkills,(result, index)=>{
                                        console.log(result, index)
                                        return <ListItem id={`background${index}`}>
                                                    <ListItemText
                                                    primary={`${result} ${index.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}`}
                                                    />
                                                </ListItem>
                                    })
                                }
                                
                            </List>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}