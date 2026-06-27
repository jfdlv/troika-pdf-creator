import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  List, ListItemButton, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Spell from '../Spell/Spell';
import './SpellsList.scss';

export default function SpellsList() {
  const spells = useSelector((state) => state.data.spells);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formEditId, setFormEditId] = useState(null);

  const openAdd = () => { setFormEditId(null); setFormOpen(true); };
  const openEdit = (id) => { setSelected(null); setFormEditId(id); setFormOpen(true); };

  const filtered = [...spells]
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const formatCost = (spell) => {
    if (spell.cost === null) {
      return spell.costNote || '?';
    }
    return `${spell.cost}${spell.costNote ? ` (${spell.costNote})` : ''}`;
  };

  return (
    <div className="spells-container">
      <div className="spells-header">
        <h2 className="spells-search-container">
          <TextField
            fullWidth
            label="Search spells"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="spells-search"
          />
        </h2>
        {currentUser?.isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="small">
            Add Spell
          </Button>
        )}
      </div>

      <List className="spells-list">
        {filtered.map((spell) => (
          <ListItemButton
            key={spell.id}
            onClick={() => setSelected(spell)}
            divider
          >
            <ListItemText
              className="spells-list-item-text"
              primary={spell.name}
              secondary={`Cost: ${formatCost(spell)}`}
            />
          </ListItemButton>
        ))}
        {filtered.length === 0 && (
          <p className="spells-empty">No spells found.</p>
        )}
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
            <DialogTitle className="spells-dialog-title">{selected.name}</DialogTitle>

            <DialogContent dividers className="spells-dialog-content">
              <div className="spells-cost-block">
                <span className="spells-cost-label">Stamina Cost:</span>
                <span className="spells-cost-value">{formatCost(selected)}</span>
              </div>

              <Divider className="spells-divider" />

              <p className="spells-description">{selected.description}</p>

              {selected.damage && (
                <>
                  <Divider className="spells-divider" />
                  <section>
                    <h4 className="spells-section-heading">Damage by Roll</h4>
                    <table className="spells-damage-table">
                      <thead>
                        <tr>
                          <th>Roll</th>
                          {['1', '2', '3', '4', '5', '6', '7+'].map((roll) => (
                            <th key={roll}>{roll}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Damage</td>
                          {['1', '2', '3', '4', '5', '6', '7+'].map((roll) => (
                            <td key={roll}>{selected.damage[roll] || '—'}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </section>
                </>
              )}
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

      {/* Add / Edit form dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <Spell editId={formEditId} onClose={() => setFormOpen(false)} />
      </Dialog>
    </div>
  );
}
