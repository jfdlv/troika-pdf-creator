import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import './Initiative.scss';

const CHARACTER_COLORS = [
  '#E53935', '#1E88E5', '#43A047', '#8E24AA',
  '#FB8C00', '#E91E63', '#00ACC1', '#C0CA33',
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildStack = (characters, enemies, enemyLimitEnabled) => {
  const charTokens = characters.flatMap((c) => [
    { id: `${c.id}-a`, type: 'character', color: c.color, label: c.name },
    { id: `${c.id}-b`, type: 'character', color: c.color, label: c.name },
  ]);

  let enemyCount = enemies.reduce((sum, e) => sum + Number(e.initiative), 0);
  if (enemyLimitEnabled) {
    // rulebook: enemy tokens may not exceed twice the number of player tokens
    enemyCount = Math.min(enemyCount, charTokens.length * 2);
  }

  const enemyTokens = Array.from({ length: enemyCount }, (_, i) => ({
    id: `enemy-token-${i}`,
    type: 'enemy',
    color: '#616161',
    label: 'Enemy',
  }));

  return shuffle([
    ...charTokens,
    ...enemyTokens,
    { id: 'end-of-round', type: 'endOfRound', color: '#F9A825', label: 'End of Round' },
  ]);
};

const Initiative = () => {
  const [phase, setPhase] = useState('setup');
  const [characters, setCharacters] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [stack, setStack] = useState([]);
  const [drawnToken, setDrawnToken] = useState(null);
  const [isEndOfRound, setIsEndOfRound] = useState(false);
  const [enemyLimitEnabled, setEnemyLimitEnabled] = useState(false);

  const [charName, setCharName] = useState('');
  const [charColor, setCharColor] = useState(CHARACTER_COLORS[0]);
  const [enemyName, setEnemyName] = useState('');
  const [enemyInitiative, setEnemyInitiative] = useState(2);

  const addCharacter = () => {
    if (!charName.trim()) return;
    setCharacters((prev) => [
      ...prev,
      { id: `char-${Date.now()}`, name: charName.trim(), color: charColor },
    ]);
    setCharName('');
  };

  const removeCharacter = (id) => setCharacters((prev) => prev.filter((c) => c.id !== id));

  const addEnemy = () => {
    if (!enemyName.trim() || Number(enemyInitiative) < 1) return;
    setEnemies((prev) => [
      ...prev,
      { id: `enemy-${Date.now()}`, name: enemyName.trim(), initiative: Number(enemyInitiative) },
    ]);
    setEnemyName('');
    setEnemyInitiative(2);
  };

  const removeEnemy = (id) => setEnemies((prev) => prev.filter((e) => e.id !== id));

  const startGame = () => {
    if (characters.length === 0) return;
    setStack(buildStack(characters, enemies, enemyLimitEnabled));
    setDrawnToken(null);
    setIsEndOfRound(false);
    setPhase('playing');
  };

  const drawToken = () => {
    if (stack.length === 0 || isEndOfRound) return;
    const idx = Math.floor(Math.random() * stack.length);
    const token = stack[idx];
    setStack((prev) => prev.filter((_, i) => i !== idx));
    setDrawnToken(token);
    setIsEndOfRound(token.type === 'endOfRound');
  };

  const delayToken = () => {
    if (!drawnToken || drawnToken.type !== 'character') return;
    setStack((prev) => {
      const insertAt = Math.floor(Math.random() * (prev.length + 1));
      const next = [...prev];
      next.splice(insertAt, 0, drawnToken);
      return next;
    });
    setDrawnToken(null);
  };

  const startNewRound = () => {
    setStack(buildStack(characters, enemies, enemyLimitEnabled));
    setDrawnToken(null);
    setIsEndOfRound(false);
  };

  const resetToSetup = () => {
    setPhase('setup');
    setStack([]);
    setDrawnToken(null);
    setIsEndOfRound(false);
  };

  const totalEnemyTokens = (() => {
    const raw = enemies.reduce((s, e) => s + Number(e.initiative), 0);
    return enemyLimitEnabled ? Math.min(raw, characters.length * 4) : raw;
  })();

  // Sort by type for the pile display so we show variety, not draw order
  const pileDots = [...stack]
    .sort((a, b) => a.type.localeCompare(b.type))
    .slice(0, 14);

  if (phase === 'setup') {
    return (
      <div className="initiative-container">
        <h2 className="initiative-title">Initiative Setup</h2>

        <section className="initiative-section">
          <h3>Characters</h3>
          <p className="initiative-hint">Each character contributes 2 tokens.</p>
          <div className="initiative-form-row">
            <TextField
              label="Name"
              size="small"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCharacter()}
            />
            <div className="color-picker">
              {CHARACTER_COLORS.map((c) => (
                <button
                  key={c}
                  className={`color-swatch${charColor === c ? ' selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setCharColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            <Button variant="contained" onClick={addCharacter}>Add</Button>
          </div>
          <ul className="token-list">
            {characters.map((c) => (
              <li key={c.id}>
                <span className="token-dot" style={{ backgroundColor: c.color }} />
                {c.name}
                <IconButton size="small" onClick={() => removeCharacter(c.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </li>
            ))}
          </ul>
        </section>

        <section className="initiative-section">
          <h3>Enemies</h3>
          <p className="initiative-hint">Add one entry per enemy group. Initiative value = number of tokens they contribute.</p>
          <div className="initiative-form-row">
            <TextField
              label="Name"
              size="small"
              value={enemyName}
              onChange={(e) => setEnemyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEnemy()}
            />
            <TextField
              label="Initiative"
              type="number"
              size="small"
              value={enemyInitiative}
              onChange={(e) => setEnemyInitiative(e.target.value)}
              inputProps={{ min: 1 }}
              className="initiative-number-input"
            />
            <Button variant="contained" onClick={addEnemy}>Add</Button>
          </div>
          <ul className="token-list">
            {enemies.map((e) => (
              <li key={e.id}>
                <span className="token-dot enemy" />
                {e.name}
                <span className="token-count">
                  {e.initiative} token{e.initiative !== 1 ? 's' : ''}
                </span>
                <IconButton size="small" onClick={() => removeEnemy(e.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </li>
            ))}
          </ul>
        </section>

        <section className="initiative-section">
          <FormControlLabel
            control={
              <Checkbox
                checked={enemyLimitEnabled}
                onChange={() => setEnemyLimitEnabled((v) => !v)}
              />
            }
            label="Enemy initiative limit (max = 2× player tokens)"
          />
          <p className="initiative-hint">
            Stack: {characters.length * 2} player + {totalEnemyTokens} enemy + 1 End of Round
            = <strong>{characters.length * 2 + totalEnemyTokens + 1}</strong> tokens
          </p>
        </section>

        <Button
          variant="contained"
          size="large"
          disabled={characters.length === 0}
          onClick={startGame}
          className="start-button"
        >
          Start Combat
        </Button>
      </div>
    );
  }

  return (
    <div className="initiative-container">
      <h2 className="initiative-title">Initiative Stack</h2>

      <div className="stack-area">
        <div className="stack-pile">
          {stack.length === 0 ? (
            <span className="pile-empty">empty</span>
          ) : (
            pileDots.map((token, i) => (
              <span
                key={token.id}
                className="pile-dot"
                style={{
                  backgroundColor: token.color,
                  transform: `translate(${(i % 5) * 16 - 32}px, ${Math.floor(i / 5) * 16 - 8}px)`,
                }}
              />
            ))
          )}
        </div>
        <p className="stack-count">
          {stack.length} token{stack.length !== 1 ? 's' : ''} remaining
        </p>
        <Button
          variant="contained"
          size="large"
          disabled={stack.length === 0 || isEndOfRound}
          onClick={drawToken}
          className="draw-button"
        >
          Draw Token
        </Button>
      </div>

      {drawnToken && (
        <div className="drawn-area">
          <div
            key={drawnToken.id}
            className={`drawn-token${isEndOfRound ? ' end-of-round-token' : ''}`}
            style={{ backgroundColor: drawnToken.color }}
          >
            <span className="drawn-label">{drawnToken.label}</span>
          </div>

          {drawnToken.type === 'character' && !isEndOfRound && (
            <Button variant="outlined" onClick={delayToken} className="delay-button">
              Delay — put token back
            </Button>
          )}

          {isEndOfRound && (
            <div className="end-of-round-info">
              <p>Remove any defeated characters or enemies, then start a new round.</p>
              <div className="removal-lists">
                {characters.length > 0 && (
                  <div>
                    <h4>Characters</h4>
                    {characters.map((c) => (
                      <div key={c.id} className="removal-item">
                        <span className="token-dot" style={{ backgroundColor: c.color }} />
                        {c.name}
                        <IconButton size="small" onClick={() => removeCharacter(c.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
                {enemies.length > 0 && (
                  <div>
                    <h4>Enemies</h4>
                    {enemies.map((e) => (
                      <div key={e.id} className="removal-item">
                        <span className="token-dot enemy" />
                        {e.name}
                        <span className="token-count">({e.initiative})</span>
                        <IconButton size="small" onClick={() => removeEnemy(e.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="contained" color="success" size="large" onClick={startNewRound}>
                Start New Round
              </Button>
            </div>
          )}
        </div>
      )}

      <Button variant="outlined" onClick={resetToSetup} className="reset-button">
        Back to Setup
      </Button>
    </div>
  );
};

export default Initiative;
