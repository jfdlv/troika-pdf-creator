import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  List, ListItemButton, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Chip, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { generateBackgroundPdf } from '../../pdf-templates/BackgroundTemplate';
import Background from '../Background/Background';
import './BackgroundsList.scss';

const formatSkillName = (key) => {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export default function BackgroundsList() {
  const backgrounds = useSelector((state) => state.data.backgrounds);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formEditId, setFormEditId] = useState(null);

  const openAdd = () => { setFormEditId(null); setFormOpen(true); };
  const openEdit = (id) => { setSelected(null); setFormEditId(id); setFormOpen(true); };

  const filtered = backgrounds
    .filter((b) =>
      (b.backgroundName || b.name || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      (a.backgroundName || a.name || '').localeCompare(b.backgroundName || b.name || '')
    );

  const advancedSkillEntries = selected
    ? Object.entries(selected.advancedSkills || {})
    : [];

  const mien = (selected?.mien || []).filter(Boolean);

  return (
    <div className="bgl-container">
      <div className="bgl-header">
        <h2 className="bgl-title">Backgrounds</h2>
        {currentUser?.isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="small">
            Add Background
          </Button>
        )}
      </div>

      <TextField
        fullWidth
        label="Search backgrounds"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bgl-search"
      />

      <List className="bgl-list">
        {filtered.map((bg) => (
          <ListItemButton
            key={bg.id || bg.backgroundName}
            onClick={() => setSelected(bg)}
            divider
          >
            <ListItemText
              className="bgl-list-item-text"
              primary={bg.backgroundName || bg.name}
              secondary={bg.description ? bg.description.slice(0, 80) + '…' : null}
            />
          </ListItemButton>
        ))}
        {filtered.length === 0 && (
          <p className="bgl-empty">No backgrounds found.</p>
        )}
      </List>

      {/* Detail dialog */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        {selected && (
          <>
            <DialogTitle className="bgl-dialog-title">
              {selected.backgroundName || selected.name}
            </DialogTitle>

            <DialogContent dividers className="bgl-dialog-content">
              {selected.description && (
                <p className="bgl-description">{selected.description}</p>
              )}

              {selected.possessions?.length > 0 && (
                <section>
                  <h4 className="bgl-section-heading">Possessions</h4>
                  <ul className="bgl-item-list">
                    {selected.possessions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </section>
              )}

              {advancedSkillEntries.length > 0 && (
                <>
                  <Divider className="bgl-divider" />
                  <section>
                    <h4 className="bgl-section-heading">Advanced Skills</h4>
                    <div className="bgl-skills">
                      {advancedSkillEntries.map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${value} — ${formatSkillName(key)}`}
                          size="small"
                          variant="outlined"
                          className="bgl-chip"
                        />
                      ))}
                    </div>
                  </section>
                </>
              )}

              {selected.special && (
                <>
                  <Divider className="bgl-divider" />
                  <section>
                    <h4 className="bgl-section-heading">Special</h4>
                    <p className="bgl-special">{selected.special}</p>
                  </section>
                </>
              )}

              {mien.length > 0 && (
                <>
                  <Divider className="bgl-divider" />
                  <section>
                    <h4 className="bgl-section-heading">Mien (d6)</h4>
                    <ol className="bgl-mien-list">
                      {mien.map((entry, i) => (
                        <li key={i}>{entry}</li>
                      ))}
                    </ol>
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
              <Button onClick={() => generateBackgroundPdf(selected)}>Print PDF</Button>
              <Button variant="contained" onClick={() => setSelected(null)}>Close</Button>
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
        <Background editId={formEditId} onClose={() => setFormOpen(false)} />
      </Dialog>
    </div>
  );
}
