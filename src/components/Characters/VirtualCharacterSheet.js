/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { setCharacterInfo } from '../../store/characterSlice';
import { updateCharacterThunk } from '../../store/authSlice';
import { generateCharacterSheetPdf } from '../../pdf-templates/CharacterSheetTemplate';
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

  const { register, control, handleSubmit, reset, watch } = useForm();
  const { fields: moneyFields, append: appendMoney, remove: removeMoney } = useFieldArray({ control, name: 'monies' });
  const watchedSkillRanks = watch('skillRanks') || {};

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

      const provisionsCount = characterInfo.background?.provisionsCount || 6;
      const provisionsChecked = characterInfo.provisionsChecked ||
        new Array(14).fill(false).map((_, i) => i < provisionsCount);

      const damageValues = {};
      for (const weapon of weaponsArrayAux) {
        damageValues[weapon] = characterInfo.customDamageValues?.[weapon] || damageTable[weapon.toLowerCase()] || [];
      }

      reset({
        skillRanks: { ...characterInfo.background?.advancedSkills },
        damageValues,
        provisionsChecked,
        monies: (characterInfo.monies || []).map(m => {
          const currencyType = Object.keys(m)[0];
          return { currencyType, amount: m[currencyType] };
        }),
      });
    }
  }, [characterInfo]);

  const onSave = handleSubmit(async (data) => {
    setSaveError('');
    setSaving(true);
    const updatedCharacterInfo = {
      ...characterInfo,
      background: {
        ...characterInfo.background,
        advancedSkills: Object.fromEntries(
          Object.entries(data.skillRanks || {}).map(([k, v]) => [k, parseInt(v, 10) || 0])
        ),
      },
      customDamageValues: data.damageValues || {},
      provisionsChecked: data.provisionsChecked || [],
      monies: (data.monies || []).map(m => ({ [m.currencyType]: parseInt(m.amount, 10) || 0 })),
    };
    dispatch(setCharacterInfo(updatedCharacterInfo));
    try {
      await dispatch(updateCharacterThunk({ uid: currentUser.uid, characterInfo: updatedCharacterInfo })).unwrap();
    } catch {
      setSaveError('Error saving character. Please try again.');
    } finally {
      setSaving(false);
    }
  });

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
                  const cellCount = (characterInfo.customDamageValues?.[weapon] || damageTable[weapon.toLowerCase()] || []).length;
                  return (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center" component="th" scope="row">{weapon}</TableCell>
                      {Array.from({ length: cellCount }, (_, i) => (
                        <TableCell align="center" key={`damageTable${i}`}>
                          <input
                            {...register(`damageValues.${weapon}.${i}`)}
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
                  const currentRank = parseInt(watchedSkillRanks[originalKey], 10) || 0;
                  return (
                    <TableRow key={`advancedSkill${originalKey}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center" component="th" scope="row">
                        <div className="item-label">{formatted}</div>
                      </TableCell>
                      <TableCell align="center">
                        <input
                          type="number"
                          {...register(`skillRanks.${originalKey}`, { valueAsNumber: true })}
                          className="editable-cell"
                        />
                      </TableCell>
                      <TableCell align="center">{characterInfo.skill}</TableCell>
                      <TableCell align="center">{currentRank ? currentRank + characterInfo.skill : ''}</TableCell>
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
                    {...register(`provisionsChecked.${i}`)}
                  />
                </label>
              ))}
            </div>
          </Paper>
        </div>

        {characterInfo.monies && characterInfo.monies.length > 0 && (
          <div className="monies-container">
            <Paper className="monies-paper">
              <Box sx={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>
                Monies
              </Box>
              {moneyFields.map((field, index) => (
                <div key={field.id} className="monies-row">
                  <Controller
                    name={`monies.${index}.currencyType`}
                    control={control}
                    render={({ field: { ref, ...f } }) => (
                      <TextField
                        {...f}
                        inputRef={ref}
                        size="small"
                        className="monies-currency-name"
                      />
                    )}
                  />
                  <input
                    type="number"
                    {...register(`monies.${index}.amount`, { valueAsNumber: true })}
                    className="monies-input"
                  />
                  {moneyFields.length > 1 && (
                    <Button size="small" color="error" onClick={() => removeMoney(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button size="small" variant="outlined" onClick={() => appendMoney({ currencyType: 'New Currency', amount: 0 })} style={{ marginTop: "8px" }}>
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

      <div className="save-bar">
        {saveError && <Alert severity="error" sx={{ flex: 1 }}>{saveError}</Alert>}
        <Button variant="outlined" onClick={() => generateCharacterSheetPdf(characterInfo, damageTable)}>
          Print PDF
        </Button>
        {characterInfo.id && (
          <Button variant="contained" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>
    </div>
  );
}
