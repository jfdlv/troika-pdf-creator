/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {Grid, Paper} from '@mui/material';
import {Store} from "../../AppState/Store";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InventorySorter from '../CharacterGenerator/InventorySorter';
import isEmpty from 'lodash/isEmpty';
import {
  useHistory
} from "react-router-dom";

// import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';

import "./VirtualCharacterSheet.scss";

export default function VirtualCharacterSheet() {
    const { state, actions } = React.useContext(Store);
    const [advancedSkillsObject, setAdvanceSkillsObject] = useState({});
    const [weaponsArray, setWeaponsArray] = useState([]);

    const history = useHistory();
    
    useEffect(()=>{
      if(isEmpty(state.characterInfo)) {
        history.push("/userCharacters");
      }
    }, [])

    useEffect(()=>{
      if(!isEmpty(state.characterInfo)) {
        let advancedSkillsObjectAux = {};
        let weaponsArrayAux = [];
        


        for (var advancedSkill in state.characterInfo.background.advancedSkills) {
            advancedSkillsObjectAux[advancedSkill.replace(/([a-z0-9])([A-Z])/g, '$1 $2')] = state.characterInfo.background.advancedSkills[advancedSkill];
            let formattedSkill = advancedSkill.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
            if(formattedSkill.includes("Fighting")){
                let weaponName = formattedSkill.replace("Fighting","");
                weaponName = weaponName.replace(" ","");
                weaponsArrayAux.push(weaponName);
            }
        }
        setAdvanceSkillsObject(advancedSkillsObjectAux)
        setWeaponsArray(weaponsArrayAux);
      }
    }, [state.characterInfo])

    return !isEmpty(state.characterInfo) && <div className="virtual-character-sheet">
            <div className="container"  style={!state.characterInfo.background.special ? {width: "100%"}: {}}>
              <div className="top-info-item"  style={!state.characterInfo.background.special ? {width: "100%", maxWidth: "unset"}: {}}>

                {/* <Paper  className="items-container"> */}
                  <Grid item container spacing={2} className="first-row"  style={!state.characterInfo.background.special ? {width: "100%"}: {}}>
                    <Grid item className='item' md={6}  style={!state.characterInfo.background.special ? {width: "50%"}: {}}>
                      <Paper className='item-container'>
                        <div className='item-label'>Name: </div>
                        <div className='item-value' style={{textTransform: "capitalize"}}>{state.characterInfo.name}</div>
                      </Paper>
                    </Grid>
                    <Grid item className='item' md={6}  style={!state.characterInfo.background.special ? {width: "50%"}: {}}>
                      <Paper className='item-container'>
                        <div className='item-label'>Background: </div>
                        <div className='item-value' style={{textTransform: "capitalize"}}>
                          {state.characterInfo.background.backgroundName.toLowerCase()}
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>
                {/* </Paper> */}

                <Grid spacing={4} container item style={{marginTop: "1px"}}>
                    <Grid item className='item' md={4}>
                      <Paper className='item-container'>
                        {/* <Grid md={12}> */}
                            <div className='item-label'>
                                Skill:
                            </div>
                        {/* </Grid>
                        <Grid md={12}>  */}
                            <div className='item-value' style={{fontSize: "25px"}}>
                                {state.characterInfo.skill}
                            </div>
                        {/* </Grid> */}
                      </Paper>
                    </Grid>
                    <Grid item className='item' md={4}>
                      <Paper className='item-container'>
                        {/* <Grid md={12}> */}
                            <div className='item-label'>
                                Stamina:
                            </div>
                        {/* </Grid>
                        <Grid md={12}>  */}
                            <div className='item-value'  style={{fontSize: "25px"}}>
                                {state.characterInfo.stamina}
                            </div>
                        {/* </Grid> */}
                      </Paper>
                    </Grid>
                    <Grid item className='item' md={4}>
                      <Paper className='item-container'>
                        {/* <Grid md={12}> */}
                            <div className='item-label'>
                                Luck:
                            </div>
                        {/* </Grid>
                        <Grid md={12}>  */}
                            <div className='item-value'  style={{fontSize: "25px"}}>
                                {state.characterInfo.luck}
                            </div>
                        {/* </Grid> */}
                      </Paper>
                    </Grid>
                </Grid>
              </div>


              {state.characterInfo.background.special && <div className="top-info-item">
                <Paper  className="special-container">
                  <div className='item-label'>Special: </div>
                  <div className='item-value'>
                      {state.characterInfo.background.special}
                  </div>
                </Paper>
              </div>}
            </div>

            {weaponsArray.length > 0 && 
            <div className='container'>
              <TableContainer component={Paper} className="item-container">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"><div className='item-label'>Weapon</div></TableCell>
                      <TableCell align="center">1</TableCell>
                      <TableCell align="center">2</TableCell>
                      <TableCell align="center">3</TableCell>
                      <TableCell align="center">4</TableCell>
                      <TableCell align="center">5</TableCell>
                      <TableCell align="center">6</TableCell>
                      <TableCell align="center">7+</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {weaponsArray.map((value, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="center" component="th" scope="row">
                          {value}
                        </TableCell>
                        {state.damageTable[value.toLowerCase()] && state.damageTable[value.toLowerCase()].map((value,index)=>{
                            return  <TableCell align="center" key={`damageTable${index}`}>{value}</TableCell>
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>}
            
            <div className="container">
              <div className="advanced-skills-container">
                <div className='item-label' style={{textAlign: "center", maxHeight: "10%"}}>
                    Advanced Skills
                </div>
                <TableContainer component={Paper} style={{height: "90%", width: "100%"}}>
                  <Table stickyHeader aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">Rank</TableCell>
                        <TableCell align="center">Skill</TableCell>
                        <TableCell align="center">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {_.map(advancedSkillsObject, (value, key)=>{
                        return <TableRow
                          key={`advancedSkill${key}`}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="center" component="th" scope="row">
                            <div className="item-label">{key}</div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {value}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {state.characterInfo.skill}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {value ? value + state.characterInfo.skill : ""}
                          </TableCell>
                        </TableRow>
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="inventory-container">
                <div className='item-label' style={{textAlign: "center", maxHeight: "10%"}}>
                  Inventory
                </div>
                <Paper style={{height: "90%"}}>
                  <InventorySorter />
                </Paper>
              </div>
            </div>
        </div>
}