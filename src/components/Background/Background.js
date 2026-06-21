import React, { useState, useRef } from "react";
import cloneDeep from 'lodash/cloneDeep';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Container,
  Grid,
  IconButton,
  Button,
  Paper,
} from '@mui/material';
import { generateBackgroundPdf } from '../../pdf-templates/BackgroundTemplate';
import './Background.css';

export default function Background() {
  const [state, setState] = useState({
    name: "",
    description: "",
    possessions: [],
    advancedSkills: [],
    special: "",
  });

  const advancedSkillRef = useRef();
  const advancedSkillLevelRef = useRef();
  const possessionRef = useRef();

  const handleNameChange = (event) => {
    setState((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleDescriptionChange = (event) => {
    setState((prev) => ({ ...prev, description: event.target.value }));
  };

  const handleSpecialChange = (event) => {
    setState((prev) => ({ ...prev, special: event.target.value }));
  };

  const handlePossessionsAdd = () => {
    const newItem = possessionRef.current.value;
    if (!newItem) return;
    setState((prev) => ({ ...prev, possessions: [...prev.possessions, newItem] }));
    possessionRef.current.value = '';
  };

  const handleAdvancedSkillAdd = () => {
    const newItem = ` ${advancedSkillLevelRef.current.value} ${advancedSkillRef.current.value}`;
    setState((prev) => ({ ...prev, advancedSkills: [...prev.advancedSkills, newItem] }));
    advancedSkillRef.current.value = '';
    advancedSkillLevelRef.current.value = '';
  };

  const handleOnDeletePossession = (index) => {
    setState((prev) => {
      const possessions = cloneDeep(prev.possessions);
      possessions.splice(index, 1);
      return { ...prev, possessions };
    });
  };

  const handleOnDeleteAdvncdSkill = (index) => {
    setState((prev) => {
      const advancedSkills = cloneDeep(prev.advancedSkills);
      advancedSkills.splice(index, 1);
      return { ...prev, advancedSkills };
    });
  };

  const printPdf = () => {
    generateBackgroundPdf(state);
  };

  return (
    <React.Fragment>
      <Container className="background-container">
        <form>
          <Grid container>
            <h2>Create Troika Background</h2>

            <Grid item md={12} style={{ marginTop: "10px" }}>
              <Paper>
                <TextField fullWidth label="Background Name" type="text" value={state.name} onChange={handleNameChange} variant="outlined" />
              </Paper>
            </Grid>

            <Grid item md={12} style={{ marginTop: "10px" }}>
              <Paper>
                <TextField fullWidth label="Description" type="text" multiline rows={4} value={state.description} onChange={handleDescriptionChange} variant="outlined" />
              </Paper>
            </Grid>

            <Grid container spacing={1} className="possessions-container">
              <Grid item md={11}>
                <Paper>
                  <TextField fullWidth label="Possessions:" type="text" variant="outlined" inputRef={possessionRef} />
                </Paper>
              </Grid>
              <Grid className="button-container" item md={1} style={{ textAlign: "center", verticalAlign: "middle" }}>
                <Button variant="contained" onClick={handlePossessionsAdd}>Add</Button>
              </Grid>
              <Grid item md={12}>
                <List>
                  {state.possessions.map((item, index) => (
                    <ListItem
                      key={`${item}${index}`}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleOnDeletePossession(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>

            <Grid container spacing={1} className="advanced-skills-container">
              <Grid item md={5}>
                <Paper>
                  <TextField fullWidth label="Advanced Skill:" type="text" variant="outlined" inputRef={advancedSkillRef} />
                </Paper>
              </Grid>
              <Grid item md={5}>
                <Paper>
                  <TextField fullWidth label="Level:" type="number" variant="outlined" inputRef={advancedSkillLevelRef} />
                </Paper>
              </Grid>
              <Grid item md={2} className="button-container">
                <Button variant="contained" onClick={handleAdvancedSkillAdd}>Add</Button>
              </Grid>
              <Grid item md={12}>
                <List>
                  {state.advancedSkills.map((item, index) => (
                    <ListItem
                      key={`${item}${index}`}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleOnDeleteAdvncdSkill(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>

            <Grid item md={12} className="special-container" style={{ marginTop: "10px", marginBottom: "10px" }}>
              <Paper>
                <TextField fullWidth label="Special" type="text" value={state.special} onChange={handleSpecialChange} variant="outlined" />
              </Paper>
            </Grid>

            <div className="print-button-container">
              <Button onClick={printPdf} variant="contained">Print</Button>
            </div>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  );
}
