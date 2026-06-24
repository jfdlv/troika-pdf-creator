import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  List, ListItemButton, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Divider,
} from '@mui/material';
import './BestiaryList.scss';

const StatRow = ({ label, value }) => (
  <div className="bl-stat-row">
    <span className="bl-stat-label">{label}</span>
    <span className="bl-stat-value">{value}</span>
  </div>
);

export default function BestiaryList() {
  const bestiary = useSelector((state) => state.data.bestiary);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = [...bestiary]
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const mien = (selected?.mien || []).filter(Boolean);

  return (
    <div className="bl-container">
      <h2 className="bl-title">Bestiary</h2>

      <TextField
        fullWidth
        label="Search beasts"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bl-search"
      />

      <List className="bl-list">
        {filtered.map((beast) => (
          <ListItemButton
            key={beast.id}
            onClick={() => setSelected(beast)}
            divider
          >
            <ListItemText
              className="bl-list-item-text"
              primary={beast.name}
              secondary={`Skill ${beast.skill} · Stamina ${beast.stamina} · Initiative ${beast.initiative}`}
            />
          </ListItemButton>
        ))}
        {filtered.length === 0 && (
          <p className="bl-empty">No beasts found.</p>
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
            <DialogTitle className="bl-dialog-title">{selected.name}</DialogTitle>

            <DialogContent dividers className="bl-dialog-content">
              <div className="bl-stats-block">
                <StatRow label="Skill" value={selected.skill} />
                <StatRow label="Stamina" value={selected.stamina} />
                <StatRow label="Initiative" value={selected.initiative} />
                <StatRow label="Armour" value={selected.armour} />
                <StatRow label="Damage" value={selected.damage} />
              </div>

              {mien.length > 0 && (
                <>
                  <Divider className="bl-divider" />
                  <section>
                    <h4 className="bl-section-heading">Mien (d6)</h4>
                    <ol className="bl-mien-list">
                      {mien.map((entry, i) => (
                        <li key={i}>{entry}</li>
                      ))}
                    </ol>
                  </section>
                </>
              )}

              {selected.description && (
                <>
                  <Divider className="bl-divider" />
                  <p className="bl-description">{selected.description}</p>
                </>
              )}

              {selected.special && (
                <>
                  <Divider className="bl-divider" />
                  <section>
                    <h4 className="bl-section-heading">Special</h4>
                    {selected.special.description && (
                      <p className="bl-description">{selected.special.description}</p>
                    )}
                    {selected.special.damageTable?.length > 0 && (
                      <table className="bl-damage-table">
                        <thead>
                          <tr>
                            <th>Damage Roll</th>
                            {['1', '2', '3', '4', '5', '6', '7+'].map((col) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selected.special.damageTable.map((row, i) => (
                            <tr key={i}>
                              <td>{row.label}</td>
                              {row.values.map((v, j) => <td key={j}>{v}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {selected.special.notes && (
                      <p className="bl-special-notes">{selected.special.notes}</p>
                    )}
                  </section>
                </>
              )}
            </DialogContent>

            <DialogActions>
              <Button variant="contained" onClick={() => setSelected(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
