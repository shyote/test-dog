import React, { useEffect, useState } from 'react';

interface Props {
  onFinish: (durationMin: number, distanceKm: number) => void;
  onCancel: () => void;
}

export default function WalkScreen({ onFinish, onCancel }: Props) {
  const [elapsed, setElapsed] = useState(0); // seconds
  const [distance, setDistance] = useState(0); // km — simulated via geolocation

  // Geolocation tracking
  useEffect(() => {
    let lastPos: GeolocationPosition | null = null;
    const watchId = navigator.geolocation?.watchPosition(pos => {
      if (lastPos) {
        setDistance(d => d + haversine(lastPos!.coords, pos.coords));
      }
      lastPos = pos;
    }, undefined, { enableHighAccuracy: true });

    return () => { if (watchId != null) navigator.geolocation?.clearWatch(watchId); };
  }, []);

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const handleFinish = () => {
    const durationMin = Math.max(1, Math.round(elapsed / 60));
    onFinish(durationMin, parseFloat(distance.toFixed(2)));
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Walk in progress 🦮</h2>

      <div style={styles.card}>
        <p style={styles.statLabel}>Time</p>
        <p style={styles.timer}>{mm}:{ss}</p>
      </div>

      <div style={styles.card}>
        <p style={styles.statLabel}>Distance</p>
        <p style={styles.stat}>{distance.toFixed(2)} km</p>
      </div>

      <div style={styles.card}>
        <p style={styles.statLabel}>Pace</p>
        <p style={styles.stat}>
          {elapsed > 30 && distance > 0.01
            ? `${(elapsed / 60 / distance).toFixed(1)} min/km`
            : '—'}
        </p>
      </div>

      <button style={styles.btnFinish} onClick={handleFinish}>
        Finish Walk ✅
      </button>
      <button style={styles.btnCancel} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

// Haversine formula — returns km
function haversine(a: GeolocationCoordinates, b: GeolocationCoordinates): number {
  const R = 6371;
  const dLat = deg2rad(b.latitude - a.latitude);
  const dLon = deg2rad(b.longitude - a.longitude);
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(a.latitude)) * Math.cos(deg2rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function deg2rad(d: number) { return d * Math.PI / 180; }

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 420, margin: '0 auto', padding: '24px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  title: { fontSize: 24, margin: '0 0 24px', textAlign: 'center' },
  card: {
    background: '#fff', borderRadius: 16, padding: '20px',
    marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  statLabel: { color: '#888', fontSize: 13, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 },
  timer: { fontSize: 52, fontWeight: 800, margin: 0, fontVariantNumeric: 'tabular-nums' },
  stat: { fontSize: 36, fontWeight: 700, margin: 0 },
  btnFinish: {
    display: 'block', width: '100%', padding: '16px', background: '#4caf50',
    color: '#fff', border: 'none', borderRadius: 12, fontSize: 16,
    fontWeight: 700, cursor: 'pointer', marginBottom: 10,
  },
  btnCancel: {
    display: 'block', width: '100%', padding: '12px', background: 'transparent',
    color: '#888', border: '1.5px solid #ddd', borderRadius: 12,
    fontSize: 15, cursor: 'pointer',
  },
};
