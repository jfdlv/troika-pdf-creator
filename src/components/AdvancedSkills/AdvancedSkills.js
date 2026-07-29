import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AdvancedSkill from '../AdvancedSkill/AdvancedSkill';
import './AdvancedSkills.scss';

export default function AdvancedSkills() {
  const advancedSkills = useSelector((state) => state.data.advancedSkills);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formEditId, setFormEditId] = useState(null);

  const openAdd = () => {
    setFormEditId(null);
    setFormOpen(true);
  };

  const openEdit = (id) => {
    setSelected(null);
    setFormEditId(id);
    setFormOpen(true);
  };

  const filtered = [...advancedSkills]
    .filter((ability) => ability.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="advanced-skills-container">
      <div className="advanced-skills-header">
        <h2 className="advanced-skills-search-container">
          <TextField
            fullWidth
            label="Search advanced skills"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="advanced-skills-search"
          />
        </h2>
        {currentUser?.isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="small">
            Add Advanced Skill
          </Button>
        )}
      </div>

      <List className="advanced-skills-list">
        {filtered.map((ability) => (
          <ListItemButton key={ability.id} onClick={() => setSelected(ability)} divider>
            <ListItemText
              className="advanced-skills-list-item-text"
              primary={ability.name}
              secondary={ability.description || 'No description provided.'}
            />
          </ListItemButton>
        ))}
        {filtered.length === 0 && <p className="advanced-skills-empty">No advanced skills found.</p>}
      </List>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        {selected && (
          <>
            <DialogTitle className="advanced-skills-dialog-title">{selected.name}</DialogTitle>
            <DialogContent dividers className="advanced-skills-dialog-content">
              <p className="advanced-skills-description">{selected.description}</p>
            </DialogContent>
            <DialogActions>
              {currentUser?.isAdmin && (
                <Button startIcon={<EditIcon />} onClick={() => openEdit(selected.id)}>
                  Edit
                </Button>
              )}
              <Button variant="contained" onClick={() => setSelected(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth scroll="paper">
        <AdvancedSkill editId={formEditId} onClose={() => setFormOpen(false)} />
      </Dialog>
    </div>
  );
}
