import React, {useContext} from 'react';
import _ from "lodash";
import InventorySorter from './InventorySorter';
import {Store} from '../../Store';
import {TextField, Container, Grid, Paper} from '@material-ui/core';

import {
    List,
    ListItem,
    ListItemText,
  } from "@material-ui/core";

import "./EditCharacter.css";

export default function EditCharacter () {

    const {state, dispatch} = useContext(Store);

    const updateCharacterName = (event) => {
        let newCharacterInfo = Object.assign({},state.characterInfo);
        newCharacterInfo.name = event.target.value;
        dispatch({type:"SET_CHARACTER_INFO", payload: newCharacterInfo});
    }

    const updateNotes = (event) => {

        let newCharacterInfo = Object.assign({},state.characterInfo);
        newCharacterInfo.notes = event.target.value;
        dispatch({type:"SET_CHARACTER_INFO", payload: newCharacterInfo});
    }

    console.log(state.characterInfo);

    return <React.Fragment>
        <Container>
        <Grid container>
            <Grid item md={12}>
                <h1>{`Character Name:`}</h1>
                <Paper classes={{root: "characterName-paper"}}>
                    <TextField onChange={updateCharacterName} style={{width: "100%"}}/>
                </Paper>
                <h2>{`Character Background (Random): ${state.characterInfo.background.backgroundName}`}</h2>
            </Grid>
            <Grid item md={6}>
                <div className="backgroundInfo-container">
                    <h3>Background description:</h3>
                    <Paper classes={{root:"backgroundInfo-paper"}}>
                        <p>
                            {state.characterInfo.background.description}
                        </p>
                    </Paper>
                </div>
            </Grid>
            <Grid item md={6}>
                <div className="notes-container">
                    <h3>Notes:</h3>
                    <Paper classes={{root:"notes-paper"}}>
                        <Grid container>
                            <TextField onChange={updateNotes} multiline={true} rows={6} style={{width:"100%"}}/>
                        </Grid>
                    </Paper>
                </div>
            </Grid> 

            <Grid item md={6}  style={{padding: "10px"}}>
                <Grid item md={12} style={{marginTop: "30px"}}>
                    <h3>Possesssions (Including baseline possesions):</h3>
                </Grid>
                <Grid item md={12}>
                    <Paper classes={{root: "inventory-advanced-skills-paper"}}>
                        <InventorySorter/>
                    </Paper>
                </Grid>
            </Grid>

            <Grid item md={6} style={{padding: "10px"}}>
                <Grid item md={12} style={{marginTop: "30px"}}>
                    <h3>Advanced Skills</h3>
                </Grid>
                <Grid item md={12}>
                    <Paper classes={{root: "inventory-advanced-skills-paper"}}>
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
                </Grid>
            </Grid>
        
        </Grid>
        </Container>
    </React.Fragment>
}