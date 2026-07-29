import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { addAdvancedSkillThunk, updateAdvancedSkillThunk } from '../../store/dataSlice';
import './AdvancedSkill.scss';

const AdvancedSkill = ({ editId, onClose }) => {
  const dispatch = useDispatch();
  const advancedSkills = useSelector((state) => state.data.advancedSkills);
  const editTarget = editId ? advancedSkills.find((ability) => ability.id === editId) : null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    setSaveStatus(null);
    if (editTarget) {
      reset({
        name: editTarget.name || '',
        description: editTarget.description || '',
      });
    } else {
      reset({ name: '', description: '' });
    }
  }, [editId]);

  const onSubmit = async (values) => {
    const trimmedName = values.name?.trim();
    const trimmedDescription = values.description?.trim();

    if (!trimmedName || !trimmedDescription) {
      setSaveStatus({ type: 'error', message: 'Name and description are required.' });
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      const payload = {
        name: trimmedName,
        description: trimmedDescription,
      };

      if (editId) {
        await dispatch(updateAdvancedSkillThunk({ id: editId, ...payload })).unwrap();
      } else {
        await dispatch(addAdvancedSkillThunk(payload)).unwrap();
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
      <DialogTitle>{editId ? 'Edit Advanced Skill' : 'Add Advanced Skill'}</DialogTitle>

      <DialogContent dividers className="advanced-skill-dialog-content">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className="advanced-skill-section">
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
            <Paper className="advanced-skill-section">
              <h3>Description</h3>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={6}
                {...register('description', { required: 'Description is required' })}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />
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

export default AdvancedSkill;
