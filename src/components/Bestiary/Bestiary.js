import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Container, Grid, TextField, Button, Paper,
  IconButton, Alert, CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addBeastThunk } from '../../store/dataSlice';
import './Bestiary.scss';

const emptyMien = ['', '', '', '', '', ''];
const DAMAGE_COLS = ['1', '2', '3', '4', '5', '6', '7+'];
const emptyDamageRow = () => ({ label: '', values: ['', '', '', '', '', '', ''] });
const emptySpecial = () => ({ description: '', notes: '', damageRows: [] });

const Bestiary = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      skill: '',
      stamina: '',
      initiative: '',
      armour: '',
      damage: '',
      description: '',
    },
  });

  const [mien, setMien] = useState([...emptyMien]);
  const [special, setSpecial] = useState(emptySpecial());
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  if (!currentUser?.isAdmin) {
    return (
      <Container className="bestiary-container">
        <Alert severity="error" style={{ marginTop: 24 }}>
          You don&apos;t have permission to access this page.
        </Alert>
      </Container>
    );
  }

  const setMienEntry = (index, value) => {
    setMien((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addDamageRow = () =>
    setSpecial((prev) => ({ ...prev, damageRows: [...prev.damageRows, emptyDamageRow()] }));

  const removeDamageRow = (i) =>
    setSpecial((prev) => ({ ...prev, damageRows: prev.damageRows.filter((_, idx) => idx !== i) }));

  const updateDamageRowLabel = (i, value) =>
    setSpecial((prev) => {
      const rows = [...prev.damageRows];
      rows[i] = { ...rows[i], label: value };
      return { ...prev, damageRows: rows };
    });

  const updateDamageRowValue = (i, j, value) =>
    setSpecial((prev) => {
      const rows = [...prev.damageRows];
      const values = [...rows[i].values];
      values[j] = value;
      rows[i] = { ...rows[i], values };
      return { ...prev, damageRows: rows };
    });

  const onSubmit = async (values) => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const hasSpecial = special.description || special.notes || special.damageRows.length > 0;
      const payload = {
        ...values,
        skill: Number(values.skill),
        stamina: Number(values.stamina),
        initiative: Number(values.initiative),
        armour: Number(values.armour),
        mien: mien.filter(Boolean),
        ...(hasSpecial ? {
          special: {
            description: special.description,
            notes: special.notes,
            damageTable: special.damageRows.map((row) => ({
              label: row.label,
              values: row.values.map((v) => (v === '' ? '' : Number(v))),
            })),
          },
        } : {}),
      };
      await dispatch(addBeastThunk(payload)).unwrap();
      setSaveStatus({ type: 'success', message: 'Beast saved to database.' });
      reset();
      setMien([...emptyMien]);
      setSpecial(emptySpecial());
    } catch {
      setSaveStatus({ type: 'error', message: 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="bestiary-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h2>Add Beast</h2>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Name</h3>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Stats</h3>
              <div className="bestiary-stats-grid">
                <TextField
                  label="Skill"
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  {...register('skill', { required: 'Required', min: { value: 0, message: 'Min 0' } })}
                  error={Boolean(errors.skill)}
                  helperText={errors.skill?.message}
                />
                <TextField
                  label="Stamina"
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  {...register('stamina', { required: 'Required', min: { value: 0, message: 'Min 0' } })}
                  error={Boolean(errors.stamina)}
                  helperText={errors.stamina?.message}
                />
                <TextField
                  label="Initiative"
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  {...register('initiative', { required: 'Required', min: { value: 0, message: 'Min 0' } })}
                  error={Boolean(errors.initiative)}
                  helperText={errors.initiative?.message}
                />
                <TextField
                  label="Armour"
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  {...register('armour', { required: 'Required', min: { value: 0, message: 'Min 0' } })}
                  error={Boolean(errors.armour)}
                  helperText={errors.armour?.message}
                />
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Damage</h3>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. As Large Beast, 2d6+4, etc."
                {...register('damage', { required: 'Damage is required' })}
                error={Boolean(errors.damage)}
                helperText={errors.damage?.message}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Mien (d6 table)</h3>
              <div className="bg-mien-grid">
                {mien.map((entry, i) => (
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

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Description</h3>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={5}
                {...register('description')}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="bg-section">
              <h3>Special</h3>
              <TextField
                fullWidth
                size="small"
                label="Description"
                multiline
                rows={3}
                value={special.description}
                onChange={(e) => setSpecial((prev) => ({ ...prev, description: e.target.value }))}
              />

              <div className="bestiary-damage-table-builder">
                <div className="bestiary-damage-table-header">
                  <span className="bestiary-damage-table-label">Damage Table</span>
                  <Button size="small" onClick={addDamageRow}>+ Add Row</Button>
                </div>

                {special.damageRows.length > 0 && (
                  <div className="bestiary-damage-cols-header">
                    <span className="bestiary-damage-col-label-spacer" />
                    {DAMAGE_COLS.map((col) => (
                      <span key={col} className="bestiary-damage-col-heading">{col}</span>
                    ))}
                    <span className="bestiary-damage-col-delete-spacer" />
                  </div>
                )}

                {special.damageRows.map((row, i) => (
                  <div key={i} className="bestiary-damage-row">
                    <TextField
                      size="small"
                      label="Label"
                      className="bestiary-damage-row-label"
                      value={row.label}
                      onChange={(e) => updateDamageRowLabel(i, e.target.value)}
                    />
                    {row.values.map((val, j) => (
                      <TextField
                        key={j}
                        size="small"
                        className="bestiary-damage-col-value"
                        value={val}
                        onChange={(e) => updateDamageRowValue(i, j, e.target.value)}
                      />
                    ))}
                    <IconButton size="small" onClick={() => removeDamageRow(i)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>

              <TextField
                fullWidth
                size="small"
                label="Notes"
                multiline
                rows={2}
                style={{ marginTop: 12 }}
                value={special.notes}
                onChange={(e) => setSpecial((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </Paper>
          </Grid>

          {saveStatus && (
            <Grid item xs={12}>
              <Alert severity={saveStatus.type}>{saveStatus.message}</Alert>
            </Grid>
          )}

          <Grid item xs={12} className="bg-actions">
            {saving && <CircularProgress size={24} />}
            <Button variant="contained" type="submit" disabled={saving}>
              Save to Database
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Bestiary;
