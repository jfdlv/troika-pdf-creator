import React from 'react';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { setCharacterInfo } from '../../store/characterSlice';
import InventorySorter from './InventorySorter';
import { TextField, Paper, List, ListItem, ListItemText, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import isEmpty from 'lodash/isEmpty';
import "./EditCharacter.scss";

export default function EditCharacter() {
  const dispatch = useDispatch();
  const characterInfo = useSelector((state) => state.character.characterInfo);
  const spells = useSelector((state) => state.data.spells);

  const updateCharacterName = (event) => {
    dispatch(setCharacterInfo({ ...characterInfo, name: event.target.value }));
  };

  const updateNotes = (event) => {
    dispatch(setCharacterInfo({ ...characterInfo, notes: event.target.value }));
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
            {characterInfo.background.mien && characterInfo.background.mien.length > 0 && (
              <div className="background-mien-container">
                <h3>Background Mien (d6):</h3>
                <Paper className="background-mien-paper">
                  <table className="background-mien-table">
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
            {characterInfo.background.mien && characterInfo.background.mien.length > 0 && (
              <div className="background-mien-container">
                <h3>Background Mien (d6):</h3>
                <Paper className="background-mien-paper">
                  <table className="background-mien-table">
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

        {characterInfo.monies && characterInfo.monies.length > 0 && (
          <div className="monies-container">
            <h3>Monies:</h3>
            <Paper className="monies-paper">
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
                    <TextField
                      type="number"
                      size="small"
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

        {getCharacterSpells().length > 0 && (
          <div className="spells-container">
            <h3>Spells:</h3>
            <Paper className="spells-paper">
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
      </div>
    </React.Fragment>
  );
}
