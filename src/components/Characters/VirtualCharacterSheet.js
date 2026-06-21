/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import _ from "lodash";
import { Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InventorySorter from '../CharacterGenerator/InventorySorter';
import { isEmpty } from 'lodash';
import "./VirtualCharacterSheet.scss";

export default function VirtualCharacterSheet() {
  const characterInfo = useSelector((state) => state.character.characterInfo);
  const damageTable = useSelector((state) => state.data.damageTable);
  const navigate = useNavigate();

  const [advancedSkillsObject, setAdvanceSkillsObject] = useState({});
  const [weaponsArray, setWeaponsArray] = useState([]);

  useEffect(() => {
    if (isEmpty(characterInfo)) {
      navigate("/userCharacters");
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(characterInfo)) {
      const advancedSkillsObjectAux = {};
      const weaponsArrayAux = [];

      for (const advancedSkill in characterInfo.background.advancedSkills) {
        advancedSkillsObjectAux[advancedSkill.replace(/([a-z0-9])([A-Z])/g, '$1 $2')] = characterInfo.background.advancedSkills[advancedSkill];
        const formattedSkill = advancedSkill.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
        if (formattedSkill.includes("Fighting")) {
          weaponsArrayAux.push(formattedSkill.replace("Fighting", "").trim());
        }
      }
      setAdvanceSkillsObject(advancedSkillsObjectAux);
      setWeaponsArray(weaponsArrayAux);
    }
  }, [characterInfo]);

  return !isEmpty(characterInfo) && (
    <div className="virtual-character-sheet">
      <div className="container" style={!characterInfo.background.special ? { width: "100%" } : {}}>
        <div className="top-info-item" style={!characterInfo.background.special ? { width: "100%", maxWidth: "unset" } : {}}>
          <Grid item container spacing={2} className="first-row" style={!characterInfo.background.special ? { width: "100%" } : {}}>
            <Grid item className='item' md={6} style={!characterInfo.background.special ? { width: "50%" } : {}}>
              <Paper className='item-container'>
                <div className='item-label'>Name: </div>
                <div className='item-value' style={{ textTransform: "capitalize" }}>{characterInfo.name}</div>
              </Paper>
            </Grid>
            <Grid item className='item' md={6} style={!characterInfo.background.special ? { width: "50%" } : {}}>
              <Paper className='item-container'>
                <div className='item-label'>Background: </div>
                <div className='item-value' style={{ textTransform: "capitalize" }}>
                  {characterInfo.background.backgroundName.toLowerCase()}
                </div>
              </Paper>
            </Grid>
          </Grid>

          <Grid spacing={4} container item style={{ marginTop: "1px" }}>
            {[['Skill', characterInfo.skill], ['Stamina', characterInfo.stamina], ['Luck', characterInfo.luck]].map(([label, value]) => (
              <Grid item className='item' md={4} key={label}>
                <Paper className='item-container'>
                  <div className='item-label'>{label}:</div>
                  <div className='item-value' style={{ fontSize: "25px" }}>{value}</div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>

        {characterInfo.background.special && (
          <div className="top-info-item">
            <Paper className="special-container">
              <div className='item-label'>Special: </div>
              <div className='item-value'>{characterInfo.background.special}</div>
            </Paper>
          </div>
        )}
      </div>

      {weaponsArray.length > 0 && (
        <div className='container'>
          <TableContainer component={Paper} className="item-container">
            <Table sx={{ minWidth: 650 }} aria-label="weapons table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"><div className='item-label'>Weapon</div></TableCell>
                  {['1','2','3','4','5','6','7+'].map((n) => <TableCell key={n} align="center">{n}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {weaponsArray.map((value, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row">{value}</TableCell>
                    {damageTable[value.toLowerCase()] && damageTable[value.toLowerCase()].map((val, i) => (
                      <TableCell align="center" key={`damageTable${i}`}>{val}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <div className="container">
        <div className="advanced-skills-container">
          <div className='item-label' style={{ textAlign: "center", maxHeight: "10%" }}>Advanced Skills</div>
          <TableContainer component={Paper} style={{ height: "90%", width: "100%" }}>
            <Table stickyHeader aria-label="advanced skills table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">Skill</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(advancedSkillsObject, (value, key) => (
                  <TableRow key={`advancedSkill${key}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row">
                      <div className="item-label">{key}</div>
                    </TableCell>
                    <TableCell align="center">{value}</TableCell>
                    <TableCell align="center">{characterInfo.skill}</TableCell>
                    <TableCell align="center">{value ? value + characterInfo.skill : ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="inventory-container">
          <div className='item-label' style={{ textAlign: "center", maxHeight: "10%" }}>Inventory</div>
          <Paper style={{ height: "90%" }}>
            <InventorySorter />
          </Paper>
        </div>
      </div>
    </div>
  );
}
