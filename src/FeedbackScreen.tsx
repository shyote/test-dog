import React from 'react';
import { WalkFeedback } from './types';

interface Props {
  durationMin: number;
  distanceKm: number;
  batteryGain: number;
  newBattery: number;
  onFeedback: (feedback: WalkFeedback) => void;
}

const options: { value: WalkFeedback; emoji: string; label: string }[] = [
  { value: 'tired',      emoji: '😴', label: 'Tired' },
  { value: 'satisfied',  emoji: '🙂', label: 'Satisfied' },
  { value: 'energetic',  emoji: '⚡', label: 'Still energetic' },
];

export default function FeedbackScreen({ durationMin, distanceKm, batteryGain, newBattery, onFeedback }: Props) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Walk complete! 🎉</h2>

      <div style={styles.card}>
        <div style={styles.row}>
          <div style={styles.stat}><span style={styles.val}>{durationMin}</span><span style={styles.unit}>min</span></div>
          <div style={styles.divider} />
          <div style={styles.stat}><span style={styles.val}>{distanceKm.toFixed(2)}</span><span style={styles.unit}>km</span></div>
          <div style={styles.divider} />
          <div style={styles.stat}><span style={styles.val}>+{Math.round(batteryGain)}%</span><span style={styles.unit}>battery</span></div>
        </div>
      </div>

      <div style={styles.card}>
        <p style={styles.batteryLabel}>Battery now</p>
        <p style={{ ...styles.batteryVal, color: newBattery >= 100 ? '#4caf50' : newBattery >= 60 ? '#ff9800' : '#f44336' }}>
          {Math.round(newBattery)}%
        </p>
      </div>

      <p style={styles.question}>How is your dog feeling?</p>

      <div style={styles.feedbackRow}>
        {options.map(o => (
          <button key={o.value} style={styles.feedbackBtn} onClick={() => onFeedback(o.value)}>
            <span style={styles.feedbackEmoji}>{o.emoji}</span>
            <span style={styles.feedbackLabel}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 420, margin: '0 auto', padding: '24px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  title: { fontSize: 26, textAlign: 'center', margin: '0 0 24px' },
  card: {
    background: '#fff', borderRadius: 16, padding: '20px',
    marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  row: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  stat: { textAlign: 'center' as const },
  val: { display: 'block', fontSize: 28, fontWeight: 800 },
  unit: { display: 'block', fontSize: 13, color: '#888', marginTop: 2 },
  divider: { width: 1, height: 40, background: '#eee' },
  batteryLabel: { textAlign: 'center', color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' },
  batteryVal: { textAlign: 'center', fontSize: 48, fontWeight: 800, margin: 0 },
  question: { textAlign: 'center', fontWeight: 600, fontSize: 17, margin: '8px 0 16px' },
  feedbackRow: { display: 'flex', gap: 10 },
  feedbackBtn: {
    flex: 1, padding: '16px 8px', background: '#fff',
    border: '1.5px solid #ddd', borderRadius: 14,
    cursor: 'pointer', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  },
  feedbackEmoji: { fontSize: 28 },
  feedbackLabel: { fontSize: 13, fontWeight: 600, color: '#333' },
};
