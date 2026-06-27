import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Grid, TextField, Button, Paper, Alert, CircularProgress,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { addSpellThunk, updateSpellThunk } from '../../store/dataSlice';
import './Spell.scss';

const DAMAGE_ROLLS = ['1', '2', '3', '4', '5', '6', '7+'];

const Spell = ({ editId, onClose }) => {
  const dispatch = useDispatch();
  const spells = useSelector((state) => state.data.spells);
  const editTarget = editId ? spells.find((s) => s.id === editId) : null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      cost: '',
      costNote: '',
      description: '',
    },
  });

  const [damageValues, setDamageValues] = useState(
    Object.fromEntries(DAMAGE_ROLLS.map((r) => [r, '']))
  );
  const [hasDamage, setHasDamage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    setSaveStatus(null);
    if (editTarget) {
      reset({
        name: editTarget.name || '',
        cost: editTarget.cost ?? '',
        costNote: editTarget.costNote || '',
        description: editTarget.description || '',
      });
      if (editTarget.damage) {
        setHasDamage(true);
        setDamageValues(
          Object.fromEntries(DAMAGE_ROLLS.map((r) => [r, editTarget.damage[r] ?? '']))
        );
      } else {
        setHasDamage(false);
        setDamageValues(Object.fromEntries(DAMAGE_ROLLS.map((r) => [r, ''])));
      }
    } else {
      reset({ name: '', cost: '', costNote: '', description: '' });
      setHasDamage(false);
      setDamageValues(Object.fromEntries(DAMAGE_ROLLS.map((r) => [r, ''])));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const onSubmit = async (values) => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const payload = {
        name: values.name,
        cost: values.cost === '' ? null : Number(values.cost),
        description: values.description,
      };

      if (values.costNote) {
        payload.costNote = values.costNote;
      }

      if (hasDamage) {
        const damageObj = {};
        DAMAGE_ROLLS.forEach((r) => {
          if (damageValues[r] !== '') {
            damageObj[r] = Number(damageValues[r]);
          }
        });
        if (Object.keys(damageObj).length > 0) {
          payload.damage = damageObj;
        }
      }

      if (editId) {
        await dispatch(updateSpellThunk({ id: editId, ...payload })).unwrap();
      } else {
        await dispatch(addSpellThunk(payload)).unwrap();
      }
      onClose();
    } catch {
      setSaveStatus({ type: 'error', message: 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{editId ? 'Edit Spell' : 'Add Spell'}</DialogTitle>

      <DialogContent dividers className="spell-dialog-content">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className="spell-section">
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
            <Paper className="spell-section">
              <h3>Stamina Cost</h3>
              <div className="spell-cost-row">
                <TextField
                  label="Cost"
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  placeholder="Leave blank for null"
                  {...register('cost')}
                />
                <TextField
                  label="Cost Note (optional)"
                  size="small"
                  placeholder="e.g. '2 per viewer'"
                  {...register('costNote')}
                />
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="spell-section">
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
            <Paper className="spell-section">
              <div className="spell-damage-header">
                <h3>Damage by Roll</h3>
                <Button
                  size="small"
                  variant={hasDamage ? 'contained' : 'outlined'}
                  onClick={() => setHasDamage(!hasDamage)}
                >
                  {hasDamage ? 'Remove' : 'Add'}
                </Button>
              </div>

              {hasDamage && (
                <div className="spell-damage-grid">
                  {DAMAGE_ROLLS.map((roll) => (
                    <TextField
                      key={roll}
                      label={`Roll ${roll}`}
                      size="small"
                      type="number"
                      value={damageValues[roll]}
                      onChange={(e) =>
                        setDamageValues((prev) => ({
                          ...prev,
                          [roll]: e.target.value,
                        }))
                      }
                    />
                  ))}
                </div>
              )}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={saving}>
          {editId ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default Spell;
