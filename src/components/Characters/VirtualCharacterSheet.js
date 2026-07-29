/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import _ from "lodash";
import { Grid, Paper, Button, Box, TextField, Accordion, AccordionSummary, AccordionDetails, Typography, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GradeIcon from '@mui/icons-material/Grade';
import SchoolIcon from '@mui/icons-material/School';
import BackpackIcon from '@mui/icons-material/Backpack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SetMealIcon from '@mui/icons-material/SetMeal';
import CheckIcon from '@mui/icons-material/Check';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
  const advancedSkills = useSelector((state) => state.data.advancedSkills);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [weaponsArray, setWeaponsArray] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);

  const { register, control, handleSubmit, reset, watch, setValue, getValues, formState: { isDirty } } = useForm();
  const { fields: moneyFields, append: appendMoney, remove: removeMoney } = useFieldArray({ control, name: 'monies' });
  const watchedSkillRanks = watch('skillRanks') || {};
  const watchedSkillTicks = watch('skillTicks') || {};
  const isAdmin = !!currentUser?.isAdmin;

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
        skillTicks: characterInfo.skillTicks || Object.fromEntries(
          Object.keys(characterInfo.background?.advancedSkills || {}).map((k) => [k, false])
        ),
        damageValues,
        provisionsChecked,
        currentStamina: characterInfo.currentStamina ?? characterInfo.stamina,
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
      skillTicks: data.skillTicks || {},
      customDamageValues: data.damageValues || {},
      provisionsChecked: data.provisionsChecked || [],
      currentStamina: parseInt(data.currentStamina, 10) || 0,
      monies: (data.monies || []).map(m => ({ [m.currencyType]: parseInt(m.amount, 10) || 0 })),
    };
    dispatch(setCharacterInfo(updatedCharacterInfo));
    try {
      await dispatch(updateCharacterThunk({ uid: currentUser.uid, characterInfo: updatedCharacterInfo })).unwrap();
      reset(data);
    } catch {
      setSaveError('Error saving character. Please try again.');
    } finally {
      setSaving(false);
    }
  });

  const onLevelUp = () => {
    const currentRanks = getValues('skillRanks') || {};
    const currentTicks = getValues('skillTicks') || {};
    const incremented = Object.fromEntries(
      Object.entries(currentRanks).map(([k, v]) => [
        k,
        currentTicks[k] ? (parseInt(v, 10) || 0) + 1 : (parseInt(v, 10) || 0),
      ])
    );
    setValue('skillRanks', incremented, { shouldDirty: true });
    const clearedTicks = Object.fromEntries(
      Object.keys(currentRanks).map((k) => [k, false])
    );
    setValue('skillTicks', clearedTicks, { shouldDirty: true });
  };

  const getCharacterSpells = () => {
    const advancedSkills = characterInfo.background?.advancedSkills || {};
    const skillNames = Object.keys(advancedSkills);

    return spells.filter((spell) =>
      skillNames.some((skillName) => {
        const withoutSpellPrefix = skillName.replace(/^spell/i, '');
        const separatedCamelCase = withoutSpellPrefix.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
        const spellNameLower = spell.name.toLowerCase();
        return separatedCamelCase === spellNameLower;
      })
    );
  };

  const getCharacterAdvancedSkills = () => {
    const advancedSkillsFromBackground = characterInfo.background?.advancedSkills || {};
    const skillNames = Object.keys(advancedSkillsFromBackground);

    return advancedSkills.filter((ability) =>
      skillNames.some((skillName) => {
        const normalizedSkillName = skillName
          .replace(/^spell/i, '')
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/[_-]/g, ' ')
          .trim()
          .toLowerCase();
        const normalizedAbilityName = ability.name
          .replace(/[_-]/g, ' ')
          .trim()
          .toLowerCase();

        return normalizedSkillName === normalizedAbilityName ||
          normalizedAbilityName.includes(normalizedSkillName) ||
          normalizedSkillName.includes(normalizedAbilityName);
      })
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
                <div
                  className='item-value'
                  style={{ textTransform: "capitalize", cursor: 'pointer' }}
                  onClick={() => setBackgroundDialogOpen(true)}
                >
                  {characterInfo.background.backgroundName.toLowerCase()}
                </div>
              </Paper>
            </Grid>
          </Grid>

          <Grid spacing={4} container item style={{ marginTop: "1px" }}>
            {[['Skill', characterInfo.skill], ['Luck', characterInfo.luck]].map(([label, value]) => (
              <Grid item className='item' md={4} key={label}>
                <Paper className='item-container'>
                  <div className='item-label'>{label}:</div>
                  <div className='item-value' style={{ fontSize: "25px" }}>{value}</div>
                </Paper>
              </Grid>
            ))}
            <Grid item className='item' md={4} key="stamina">
              <Paper className='item-container' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                <div className='item-label'>Stamina:</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <div style={{ fontSize: "25px", fontWeight: 'bold' }}>
                    {watch('currentStamina') || characterInfo.stamina} / {characterInfo.stamina}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button size="small" variant="contained" onClick={() => {
                      const current = watch('currentStamina') || 0;
                      if (current > 0) {
                        setValue('currentStamina', current - 1);
                      }
                    }} sx={{ minWidth: '32px', padding: '4px' }}>−</Button>
                    <Button size="small" variant="contained" onClick={() => {
                      const current = watch('currentStamina') || 0;
                      if (current < characterInfo.stamina) {
                        setValue('currentStamina', current + 1);
                      }
                    }} sx={{ minWidth: '32px', padding: '4px' }}>+</Button>
                  </div>
                </div>
              </Paper>
            </Grid>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <GradeIcon sx={{ fontSize: '20px', color: '#ff9800' }} />
              <Typography sx={{ fontWeight: 'bold' }}>Weapons</Typography>
            </Box>
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
                  <TableCell align="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: '8px' }}>
                    <SchoolIcon sx={{ fontSize: '18px', color: '#2196f3' }} />
                    <span>Advanced Skills</span>
                  </TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">Skill</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(characterInfo.background.advancedSkills, (rank, originalKey) => {
                  const formatted = originalKey.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
                  const currentRank = parseInt(watchedSkillRanks[originalKey], 10) || 0;
                  const ticked = !!watchedSkillTicks[originalKey];
                  return (
                    <TableRow key={`advancedSkill${originalKey}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left" component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                          <Box
                            onClick={() => setValue(`skillTicks.${originalKey}`, !ticked, { shouldDirty: true })}
                            sx={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                              '&:hover': { transform: 'scale(1.1)' },
                            }}
                          >
                            <CheckIcon sx={{ fontSize: '22px', color: ticked ? '#2196f3' : '#ccc' }} />
                          </Box>
                          <div className="item-label">{formatted}</div>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {isAdmin ? (
                          <input
                            type="number"
                            {...register(`skillRanks.${originalKey}`, { valueAsNumber: true })}
                            className="editable-cell"
                          />
                        ) : (
                          <span className="readonly-rank">{currentRank}</span>
                        )}
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
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.default', textAlign: 'center', py: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'left', gap: '8px' }}>
              <BackpackIcon sx={{ fontSize: '20px' }} />
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
                <Box
                  key={i}
                  onClick={() => {
                    const updated = [...(watch('provisionsChecked') || [])];
                    updated[i] = !updated[i];
                    setValue('provisionsChecked', updated);
                  }}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <SetMealIcon sx={{ fontSize: '28px', color: watch('provisionsChecked')?.[i] ? '#ff6f00' : '#ccc' }} />
                </Box>
              ))}
            </div>
          </Paper>
        </div>

        {characterInfo.monies && characterInfo.monies.length > 0 && (
          <div className="monies-container">
            <Paper className="monies-paper">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AttachMoneyIcon sx={{ fontSize: '20px', color: '#4caf50' }} />
                <Box sx={{ fontWeight: 'bold', fontSize: '16px' }}>Monies</Box>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="number"
                      {...register(`monies.${index}.amount`, { valueAsNumber: true })}
                      className="monies-input"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          const current = watch(`monies.${index}.amount`) || 0;
                          setValue(`monies.${index}.amount`, current + 1);
                        }}
                        sx={{ minWidth: '24px', padding: '2px', fontSize: '12px' }}
                      >
                        +
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          const current = watch(`monies.${index}.amount`) || 0;
                          if (current > 0) {
                            setValue(`monies.${index}.amount`, current - 1);
                          }
                        }}
                        sx={{ minWidth: '24px', padding: '2px', fontSize: '12px' }}
                      >
                        −
                      </Button>
                    </Box>
                  </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AutoAwesomeIcon sx={{ fontSize: '24px', color: '#7c4dff' }} />
              <Box sx={{ fontWeight: 'bold', fontSize: '16px' }}>Spells</Box>
              <Chip label={getCharacterSpells().length} size="small" color="primary" />
            </Box>
            {getCharacterSpells().map((spell, idx) => (
              <Accordion
                key={spell.id}
                className="spell-accordion"
                sx={{
                  marginBottom: '8px',
                  '&:last-child': { marginBottom: 0 },
                  '&.Mui-expanded': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'rgba(124, 77, 255, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(124, 77, 255, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <AutoAwesomeIcon sx={{ fontSize: '18px', color: '#7c4dff' }} />
                    <Typography sx={{ fontWeight: 500 }}>{spell.name}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ paddingTop: '16px' }}>
                  <div className="spell-details">
                    {spell.cost !== null && (
                      <Box sx={{ marginBottom: '12px' }}>
                        <Chip
                          label={`Cost: ${spell.cost}${spell.costNote ? ` (${spell.costNote})` : ''}`}
                          size="small"
                          variant="outlined"
                          color="warning"
                        />
                      </Box>
                    )}
                    {spell.description && (
                      <div className="spell-description">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: '4px' }}>Description</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{spell.description}</Typography>
                      </div>
                    )}
                    {spell.damage && (
                      <div className="spell-damage" style={{ marginTop: '12px' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: '8px' }}>Damage by Roll</Typography>
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

      {getCharacterAdvancedSkills().length > 0 && (
        <div className="character-spells-container">
          <Paper className="spells-paper">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FlashOnIcon sx={{ fontSize: '24px', color: '#ff9800' }} />
              <Box sx={{ fontWeight: 'bold', fontSize: '16px' }}>Advanced Skills</Box>
              <Chip label={getCharacterAdvancedSkills().length} size="small" color="secondary" />
            </Box>
            {getCharacterAdvancedSkills().map((ability) => (
              <Accordion
                key={ability.id}
                className="spell-accordion"
                sx={{
                  marginBottom: '8px',
                  '&:last-child': { marginBottom: 0 },
                  '&.Mui-expanded': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'rgba(255, 152, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <FlashOnIcon sx={{ fontSize: '18px', color: '#ff9800' }} />
                    <Typography sx={{ fontWeight: 500 }}>{ability.name}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ paddingTop: '16px' }}>
                  <div className="spell-details">
                    {ability.description && (
                      <div className="spell-description">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: '4px' }}>Description</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{ability.description}</Typography>
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
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<TrendingUpIcon />}
          onClick={onLevelUp}
        >
          Level Up
        </Button>
        <Button variant="outlined" onClick={() => generateCharacterSheetPdf(characterInfo, damageTable)}>
          Print PDF
        </Button>
        {characterInfo.id && (
          <Button variant="contained" onClick={onSave} disabled={saving || !isDirty}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <Dialog open={backgroundDialogOpen} onClose={() => setBackgroundDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textTransform: 'capitalize' }}>
          {characterInfo.background?.backgroundName?.toLowerCase()}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', marginTop: '12px' }}>
            {characterInfo.background?.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackgroundDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
