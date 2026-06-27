/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import _ from "lodash";
import { Grid, Paper, Button, Box, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import { updateAdvancedSkillRank, updateWeaponDamage, setCharacterInfo } from '../../store/characterSlice';
import { updateCharacterThunk } from '../../store/authSlice';
import "./VirtualCharacterSheet.scss";

export default function VirtualCharacterSheet() {
  const characterInfo = useSelector((state) => state.character.characterInfo);
  const damageTable = useSelector((state) => state.data.damageTable);
  const spells = useSelector((state) => state.data.spells);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [weaponsArray, setWeaponsArray] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [provisionsChecked, setProvisionsChecked] = useState([]);

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

      // Initialize checked state from characterInfo — always 14 boxes, first N checked
      const provisionsCount = characterInfo.background?.provisionsCount || 6;
      const checkedState = characterInfo.provisionsChecked ||
        new Array(14).fill(false).map((_, i) => i < provisionsCount);
      setProvisionsChecked(checkedState);
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

  const handleProvisionToggle = (index) => {
    const updated = [...provisionsChecked];
    updated[index] = !updated[index];
    setProvisionsChecked(updated);
    dispatch(setCharacterInfo({ ...characterInfo, provisionsChecked: updated }));
  };

  const handleMoneyChange = (currencyIndex, newValue) => {
    const updated = [...(characterInfo.monies || [])];
    const currencyType = Object.keys(updated[currencyIndex])[0];
    updated[currencyIndex] = { [currencyType]: parseInt(newValue, 10) || 0 };
    dispatch(setCharacterInfo({ ...characterInfo, monies: updated }));
  };

  const handleCurrencyNameChange = (currencyIndex, newName) => {
    const updated = [...(characterInfo.monies || [])];
    const oldCurrencyType = Object.keys(updated[currencyIndex])[0];
    const amount = updated[currencyIndex][oldCurrencyType];
    updated[currencyIndex] = { [newName]: amount };
    dispatch(setCharacterInfo({ ...characterInfo, monies: updated }));
  };

  const handleAddCurrency = () => {
    const updated = [...(characterInfo.monies || [])];
    updated.push({ "New Currency": 0 });
    dispatch(setCharacterInfo({ ...characterInfo, monies: updated }));
  };

  const handleRemoveCurrency = (currencyIndex) => {
    const updated = [...(characterInfo.monies || [])];
    updated.splice(currencyIndex, 1);
    dispatch(setCharacterInfo({ ...characterInfo, monies: updated }));
  };

  const getCharacterSpells = () => {
    const advancedSkills = characterInfo.background?.advancedSkills || {};
    const skillNames = Object.keys(advancedSkills);
    return spells.filter((spell) =>
      skillNames.some((skillName) =>
        skillName.toLowerCase().includes(spell.name.toLowerCase()) ||
        spell.name.toLowerCase().includes(skillName.toLowerCase())
      )
    );
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

        {characterInfo.background.mien && characterInfo.background.mien.length > 0 && (
          <div className="top-info-item">
            <Paper className="mien-container">
              <div className='item-label'>Mien (d6):</div>
              <table className="mien-table">
                <thead>
                  <tr>
                    {characterInfo.background.mien.map((_, i) => (
                      <th key={i}>{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {characterInfo.background.mien.map((entry, i) => (
                      <td key={i}>{entry}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
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
      
      <div className="provisions-monies-container">
      

        {provisionsChecked.length > 0 && (
          <div className="provisions-container">
            <Paper className="provisions-paper">
              <Box sx={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>
                Provisions
              </Box>
              <div className="provisions-grid">
                {new Array(14).fill(false).map((_, i) => (
                  <label key={i} className="provision-checkbox">
                    <input
                      type="checkbox"
                      checked={provisionsChecked[i] || false}
                      onChange={() => handleProvisionToggle(i)}
                    />
                  </label>
                ))}
              </div>
            </Paper>
          </div>
        )}

        {characterInfo.monies && characterInfo.monies.length > 0 && (
          <div className="monies-container">
            <Paper className="monies-paper">
              <Box sx={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>
                Monies
              </Box>
              {characterInfo.monies.map((currencyObj, index) => {
                const currencyType = Object.keys(currencyObj)[0];
                const amount = currencyObj[currencyType];
                return (
                  <div key={index} className="monies-row">
                    <TextField
                      size="small"
                      value={currencyType}
                      onChange={(e) => handleCurrencyNameChange(index, e.target.value)}
                      className="monies-currency-name"
                    />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleMoneyChange(index, e.target.value)}
                      className="monies-input"
                    />
                    {characterInfo.monies.length > 1 && (
                      <Button size="small" color="error" onClick={() => handleRemoveCurrency(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                );
              })}
              <Button size="small" variant="outlined" onClick={handleAddCurrency} style={{ marginTop: "8px" }}>
                Add Currency
              </Button>
            </Paper>
          </div>
        )}

      </div>

      {getCharacterSpells().length > 0 && (
        <div className="character-spells-container">
          <Paper className="spells-paper">
            <Box sx={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>
              Spells
            </Box>
            {getCharacterSpells().map((spell) => (
              <Accordion key={spell.id} className="spell-accordion">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{spell.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="spell-details">
                    {spell.cost !== null && (
                      <div className="spell-cost">
                        <strong>Cost:</strong> {spell.cost}
                        {spell.costNote && ` (${spell.costNote})`}
                      </div>
                    )}
                    {spell.description && (
                      <div className="spell-description">
                        <strong>Description:</strong>
                        <p>{spell.description}</p>
                      </div>
                    )}
                    {spell.damage && (
                      <div className="spell-damage">
                        <strong>Damage by Roll:</strong>
                        <table className="spell-damage-table">
                          <tbody>
                            <tr>
                              {['1', '2', '3', '4', '5', '6', '7+'].map((roll) => (
                                <td key={roll}>{spell.damage[roll] || '—'}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </div>
      )}

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
