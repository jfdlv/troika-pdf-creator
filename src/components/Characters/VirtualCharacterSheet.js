/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import _ from "lodash";
import { Grid, Paper, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import InventorySorter from '../CharacterGenerator/InventorySorter';
import { isEmpty } from 'lodash';
import { updateAdvancedSkillRank, updateWeaponDamage } from '../../store/characterSlice';
import { updateCharacterThunk } from '../../store/authSlice';
import "./VirtualCharacterSheet.scss";

export default function VirtualCharacterSheet() {
  const characterInfo = useSelector((state) => state.character.characterInfo);
  const damageTable = useSelector((state) => state.data.damageTable);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [weaponsArray, setWeaponsArray] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isEmpty(characterInfo)) {
      navigate("/userCharacters");
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(characterInfo)) {
      const weaponsArrayAux = [];
      for (const advancedSkill in characterInfo.background.advancedSkills) {
        const formattedSkill = advancedSkill.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
        if (formattedSkill.includes("Fighting")) {
          weaponsArrayAux.push(formattedSkill.replace("Fighting", "").trim());
        }
      }
      setWeaponsArray(weaponsArrayAux);
    }
  }, [characterInfo]);

  const handleSkillRankChange = (originalKey, value) => {
    const rank = parseInt(value, 10);
    if (!isNaN(rank)) {
      dispatch(updateAdvancedSkillRank({ key: originalKey, rank }));
    }
  };

  const handleDamageValueChange = (weapon, index, value) => {
    const current = characterInfo.customDamageValues?.[weapon] || damageTable[weapon.toLowerCase()] || [];
    const updated = [...current];
    updated[index] = value;
    dispatch(updateWeaponDamage({ weapon, values: updated }));
  };

  const handleSave = async () => {
    setSaveError('');
    setSaving(true);
    try {
      await dispatch(updateCharacterThunk({ uid: currentUser.uid, characterInfo })).unwrap();
    } catch {
      setSaveError('Error saving character. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
          <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="weapons table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"><div className='item-label'>Weapon</div></TableCell>
                  {['1', '2', '3', '4', '5', '6', '7+'].map((n) => <TableCell key={n} align="center">{n}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {weaponsArray.map((weapon, index) => {
                  const effectiveValues = characterInfo.customDamageValues?.[weapon] || damageTable[weapon.toLowerCase()] || [];
                  return (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center" component="th" scope="row">{weapon}</TableCell>
                      {effectiveValues.map((val, i) => (
                        <TableCell align="center" key={`damageTable${i}`}>
                          <input
                            value={val ?? ''}
                            onChange={(e) => handleDamageValueChange(weapon, i, e.target.value)}
                            className="editable-cell"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <div className="container">
        <div className="advanced-skills-container">
          <TableContainer component={Paper} style={{ flex: 1, width: "100%", overflow: 'auto' }}>
            <Table stickyHeader aria-label="advanced skills table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Advanced Skills</TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">Skill</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(characterInfo.background.advancedSkills, (rank, originalKey) => {
                  const formatted = originalKey.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
                  return (
                    <TableRow key={`advancedSkill${originalKey}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center" component="th" scope="row">
                        <div className="item-label">{formatted}</div>
                      </TableCell>
                      <TableCell align="center">
                        <input
                          type="number"
                          value={rank ?? ''}
                          onChange={(e) => handleSkillRankChange(originalKey, e.target.value)}
                          className="editable-cell"
                        />
                      </TableCell>
                      <TableCell align="center">{characterInfo.skill}</TableCell>
                      <TableCell align="center">{rank ? rank + characterInfo.skill : ''}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="inventory-container">
          <Paper style={{ flex: 1, overflow: 'auto' }}>
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.default', textAlign: 'center', py: 1, fontWeight: 'bold' }}>
              Inventory
            </Box>
            <InventorySorter />
          </Paper>
        </div>
      </div>

      {characterInfo.id && (
        <div className="save-bar">
          {saveError && <Alert severity="error" sx={{ flex: 1 }}>{saveError}</Alert>}
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}
