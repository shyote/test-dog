import React, { useState } from 'react';
import { DogProfile, DogSize, EnergyLevel, AgeGroup } from './types';

interface Props {
  initial: DogProfile | null;
  onSave: (profile: DogProfile) => void;
  onBack: () => void;
}

export default function DogProfileScreen({ initial, onSave, onBack }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [size, setSize] = useState<DogSize>(initial?.size ?? 'medium');
  const [energyLevel, setEnergy] = useState<EnergyLevel>(initial?.energyLevel ?? 'medium');
  const [age, setAge] = useState<AgeGroup>(initial?.age ?? 'adult');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), size, energyLevel, age });
  };

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={onBack}>← Back</button>
      <h2 style={styles.title}>Dog Profile</h2>

      <div style={styles.field}>
        <label style={styles.label}>Dog's name</label>
        <input
          style={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Buddy"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Size</label>
        <div style={styles.chips}>
          {(['small', 'medium', 'large'] as DogSize[]).map(s => (
            <button key={s} style={size === s ? styles.chipActive : styles.chip} onClick={() => setSize(s)}>
              {s === 'small' ? '🐩 Small' : s === 'medium' ? '🐕 Medium' : '🐕‍🦺 Large'}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Energy level</label>
        <div style={styles.chips}>
          {(['low', 'medium', 'high'] as EnergyLevel[]).map(e => (
            <button key={e} style={energyLevel === e ? styles.chipActive : styles.chip} onClick={() => setEnergy(e)}>
              {e === 'low' ? '😴 Low' : e === 'medium' ? '🙂 Medium' : '⚡ High'}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Age</label>
        <div style={styles.chips}>
          {(['puppy', 'adult', 'senior'] as AgeGroup[]).map(a => (
            <button key={a} style={age === a ? styles.chipActive : styles.chip} onClick={() => setAge(a)}>
              {a === 'puppy' ? '🐣 Puppy' : a === 'adult' ? '🐶 Adult' : '🦴 Senior'}
            </button>
          ))}
        </div>
      </div>

      <button style={{ ...styles.btnPrimary, opacity: name.trim() ? 1 : 0.5 }} onClick={handleSave} disabled={!name.trim()}>
        Save Profile
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 420, margin: '0 auto', padding: '24px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  back: { background: 'none', border: 'none', color: '#1a73e8', fontSize: 15, cursor: 'pointer', padding: 0, marginBottom: 16 },
  title: { fontSize: 24, margin: '0 0 24px' },
  field: { marginBottom: 24 },
  label: { display: 'block', fontWeight: 600, marginBottom: 10, color: '#333' },
  input: {
    width: '100%', padding: '12px 14px', fontSize: 16,
    border: '1.5px solid #ddd', borderRadius: 10, boxSizing: 'border-box',
  },
  chips: { display: 'flex', gap: 10 },
  chip: {
    flex: 1, padding: '10px 8px', background: '#f5f5f5', border: '1.5px solid #ddd',
    borderRadius: 10, fontSize: 14, cursor: 'pointer', fontWeight: 500,
  },
  chipActive: {
    flex: 1, padding: '10px 8px', background: '#e8f0fe', border: '1.5px solid #1a73e8',
    borderRadius: 10, fontSize: 14, cursor: 'pointer', fontWeight: 600, color: '#1a73e8',
  },
  btnPrimary: {
    display: 'block', width: '100%', padding: '16px', background: '#1a73e8',
    color: '#fff', border: 'none', borderRadius: 12, fontSize: 16,
    fontWeight: 700, cursor: 'pointer', marginTop: 8,
  },
};
