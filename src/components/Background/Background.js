import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid, TextField, Button, Paper,
  List, ListItem, ListItemText, IconButton,
  Alert, CircularProgress, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addBackgroundThunk, updateBackgroundThunk } from '../../store/dataSlice';
import { generateBackgroundPdf } from '../../pdf-templates/BackgroundTemplate';
import './Background.scss';

const toCamelCase = (str) =>
  str.trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

const formatSkillName = (key) => {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const emptyMien = ['', '', '', '', '', ''];

const emptyState = () => ({
  backgroundName: '',
  description: '',
  possessions: [],
  advancedSkills: {},
  special: '',
  mien: [...emptyMien],
});

export default function Background({ editId, onClose }) {
  const dispatch = useDispatch();
  const backgrounds = useSelector((state) => state.data.backgrounds);
  const editTarget = editId ? backgrounds.find((b) => b.id === editId) : null;

  const [form, setForm] = useState(emptyState());
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(1);
  const [possession, setPossession] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    setSaveStatus(null);
    if (editTarget) {
      const mienPadded = [...(editTarget.mien || [])];
      while (mienPadded.length < 6) mienPadded.push('');
      setForm({
        backgroundName: editTarget.backgroundName || '',
        description: editTarget.description || '',
        possessions: editTarget.possessions || [],
        advancedSkills: editTarget.advancedSkills || {},
        special: editTarget.special || '',
        mien: mienPadded,
      });
    } else {
      setForm(emptyState());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addPossession = () => {
    if (!possession.trim()) return;
    setField('possessions', [...form.possessions, possession.trim()]);
    setPossession('');
  };

  const removePossession = (index) =>
    setField('possessions', form.possessions.filter((_, i) => i !== index));

  const addSkill = () => {
    if (!skillName.trim() || Number(skillLevel) < 1) return;
    const key = toCamelCase(skillName);
    setField('advancedSkills', { ...form.advancedSkills, [key]: Number(skillLevel) });
    setSkillName('');
    setSkillLevel(1);
  };

  const removeSkill = (key) => {
    const updated = { ...form.advancedSkills };
    delete updated[key];
    setField('advancedSkills', updated);
  };

  const setMienEntry = (index, value) => {
    const updated = [...form.mien];
    updated[index] = value;
    setField('mien', updated);
  };

  const handleSave = async () => {
    if (!form.backgroundName.trim()) {
      setSaveStatus({ type: 'error', message: 'Background name is required.' });
      return;
    }
    setSaving(true);
    setSaveStatus(null);
    try {
      const payload = {
        ...form,
        backgroundName: form.backgroundName.trim(),
        mien: form.mien.filter(Boolean),
      };
      if (editId) {
        await dispatch(updateBackgroundThunk({ id: editId, ...payload })).unwrap();
      } else {
        await dispatch(addBackgroundThunk(payload)).unwrap();
      }
      onClose();
    } catch {
      setSaveStatus({ type: 'error', message: 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    generateBackgroundPdf({ ...form, mien: form.mien.filter(Boolean) });
  };

  return (
    <>
      <DialogTitle>{editId ? 'Edit Background' : 'Add Background'}</DialogTitle>

      <DialogContent dividers className="background-dialog-content">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Background Name</h3>
              <TextField
                fullWidth
                size="small"
                value={form.backgroundName}
                onChange={(e) => setField('backgroundName', e.target.value)}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Description</h3>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={4}
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Special Ability</h3>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                value={form.special}
                onChange={(e) => setField('special', e.target.value)}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Possessions</h3>
              <div className="bg-row">
                <TextField
                  label="Item"
                  size="small"
                  value={possession}
                  onChange={(e) => setPossession(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPossession()}
                  className="bg-input-grow"
                />
                <Button variant="contained" onClick={addPossession}>Add</Button>
              </div>
              <List dense>
                {form.possessions.map((item, i) => (
                  <ListItem
                    key={i}
                    secondaryAction={
                      <IconButton size="small" onClick={() => removePossession(i)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Advanced Skills</h3>
              <div className="bg-row">
                <TextField
                  label="Skill name"
                  size="small"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="bg-input-grow"
                />
                <TextField
                  label="Level"
                  type="number"
                  size="small"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  inputProps={{ min: 1 }}
                  className="bg-input-short"
                />
                <Button variant="contained" onClick={addSkill}>Add</Button>
              </div>
              <List dense>
                {Object.entries(form.advancedSkills).map(([key, value]) => (
                  <ListItem
                    key={key}
                    secondaryAction={
                      <IconButton size="small" onClick={() => removeSkill(key)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={`${value}  ${formatSkillName(key)}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Mien (d6 table)</h3>
              <div className="bg-mien-grid">
                {form.mien.map((entry, i) => (
                  <TextField
                    key={i}
                    label={String(i + 1)}
                    size="small"
                    value={entry}
                    onChange={(e) => setMienEntry(i, e.target.value)}
                  />
                ))}
              </div>
            </Paper>
          </Grid>

          {saveStatus && (
            <Grid item xs={12}>
              <Alert severity={saveStatus.type}>{saveStatus.message}</Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        {saving && <CircularProgress size={24} />}
        <Button onClick={handlePrint}>Print PDF</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {editId ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </>
  );
}
