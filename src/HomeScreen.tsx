import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AppState } from './types';

interface Props {
  state: AppState;
  onStartWalk: () => void;
  onSetupDog: () => void;
}

function batteryColor(pct: number): string {
  if (pct >= 100) return '#4caf50';
  if (pct >= 60) return '#ff9800';
  return '#f44336';
}

function batteryLabel(pct: number): string {
  if (pct >= 120) return 'Fully charged! Maybe ease off a bit 🐾';
  if (pct >= 100) return 'Daily goal reached! 🎉';
  if (pct >= 60) return 'Getting there — keep going!';
  return 'Needs more activity today';
}

export default function HomeScreen({ state, onStartWalk, onSetupDog }: Props) {
  const { dog, battery, dailyNeed, walks } = state;
  const displayPct = Math.min(battery, 150);
  const color = batteryColor(battery);

  const todayWalks = walks.filter(w => {
    const today = new Date();
    const d = new Date(w.startTime);
    return d.toDateString() === today.toDateString();
  });
  const totalMin = todayWalks.reduce((s, w) => s + w.durationMin, 0);
  const remaining = Math.max(0, dailyNeed - totalMin);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🐕 DogWalk</h1>

      {!dog ? (
        <div style={styles.card}>
          <p style={styles.subtitle}>Set up your dog's profile to get started.</p>
          <button style={styles.btnPrimary} onClick={onSetupDog}>
            Set up dog profile
          </button>
        </div>
      ) : (
        <>
          <div style={styles.card}>
            <p style={styles.dogName}>{dog.name}</p>

            {/* Battery visual */}
            <div style={styles.batteryWrap}>
              <div style={styles.batteryOuter}>
                <div style={{ ...styles.batteryFill, width: `${Math.min(displayPct, 100)}%`, backgroundColor: color }} />
              </div>
              <div style={styles.batteryNub} />
            </div>
            <p style={{ ...styles.batteryPct, color }}>{Math.round(battery)}%</p>
            <p style={styles.batteryMsg}>{batteryLabel(battery)}</p>

            {remaining > 0 && (
              <p style={styles.hint}>~{remaining} min more activity needed today</p>
            )}
          </div>

          <div style={styles.card}>
            <p style={styles.statLabel}>Today's walks</p>
            <p style={styles.statValue}>{todayWalks.length} walk{todayWalks.length !== 1 ? 's' : ''} · {totalMin} min</p>
          </div>

          <button style={styles.btnPrimary} onClick={onStartWalk}>
            Start Walk 🦮
          </button>
          <button style={styles.btnSecondary} onClick={onSetupDog}>
            Edit dog profile
          </button>

          {walks.length > 0 && (
            <div style={{ ...styles.card, marginTop: 16 }}>
              <p style={styles.statLabel}>Walk history</p>
              {[...walks].reverse().map(w => {
                const d = new Date(w.startTime);
                const dateStr = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                const feedbackEmoji = w.feedback === 'tired' ? '😴' : w.feedback === 'satisfied' ? '🙂' : w.feedback === 'energetic' ? '⚡' : '';
                const hasRoute = w.route && w.route.length > 1;
                const center: [number, number] = hasRoute
                  ? [
                      w.route!.reduce((s, p) => s + p[0], 0) / w.route!.length,
                      w.route!.reduce((s, p) => s + p[1], 0) / w.route!.length,
                    ]
                  : [48.8566, 2.3522];
                return (
                  <div key={w.id} style={styles.walkEntry}>
                    <div style={styles.walkRow}>
                      <div style={styles.walkLeft}>
                        <span style={styles.walkDate}>{dateStr}</span>
                        <span style={styles.walkTime}>{timeStr}</span>
                      </div>
                      <div style={styles.walkRight}>
                        <span style={styles.walkStat}>{w.durationMin} min</span>
                        <span style={styles.walkStat}>{w.distanceKm.toFixed(2)} km</span>
                        {feedbackEmoji && <span style={styles.walkEmoji}>{feedbackEmoji}</span>}
                      </div>
                    </div>
                    {hasRoute && (
                      <div style={styles.miniMapWrap}>
                        <MapContainer
                          center={center}
                          zoom={15}
                          style={{ width: '100%', height: '100%', borderRadius: 10 }}
                          zoomControl={false}
                          scrollWheelZoom={false}
                          dragging={false}
                          attributionControl={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Polyline positions={w.route!} color="#1a73e8" weight={4} opacity={0.85} />
                        </MapContainer>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 420,
    margin: '0 auto',
    padding: '24px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  title: { textAlign: 'center', fontSize: 28, margin: '0 0 24px' },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '20px',
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  dogName: { fontWeight: 700, fontSize: 20, margin: '0 0 16px', textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#555', marginBottom: 16 },
  batteryWrap: { display: 'flex', alignItems: 'center', marginBottom: 8 },
  batteryOuter: {
    flex: 1, height: 28, borderRadius: 6, border: '2px solid #ccc',
    overflow: 'hidden', background: '#f5f5f5',
  },
  batteryFill: { height: '100%', borderRadius: 4, transition: 'width 0.6s ease' },
  batteryNub: {
    width: 6, height: 14, background: '#ccc',
    borderRadius: '0 3px 3px 0', marginLeft: 2,
  },
  batteryPct: { fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '4px 0' },
  batteryMsg: { textAlign: 'center', color: '#555', margin: '0 0 4px' },
  hint: { textAlign: 'center', color: '#888', fontSize: 14, margin: 0 },
  statLabel: { color: '#888', fontSize: 13, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { fontWeight: 600, fontSize: 18, margin: 0 },
  btnPrimary: {
    display: 'block', width: '100%', padding: '16px',
    background: '#1a73e8', color: '#fff', border: 'none',
    borderRadius: 12, fontSize: 16, fontWeight: 700,
    cursor: 'pointer', marginBottom: 10,
  },
  btnSecondary: {
    display: 'block', width: '100%', padding: '12px',
    background: 'transparent', color: '#1a73e8',
    border: '1.5px solid #1a73e8', borderRadius: 12,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  walkEntry: { borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 4 },
  walkRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0 6px',
  },
  miniMapWrap: { height: 160, borderRadius: 10, overflow: 'hidden', marginBottom: 4 },
  walkLeft: { display: 'flex', flexDirection: 'column', gap: 2 },
  walkDate: { fontWeight: 600, fontSize: 14 },
  walkTime: { color: '#888', fontSize: 12 },
  walkRight: { display: 'flex', alignItems: 'center', gap: 10 },
  walkStat: { fontSize: 14, color: '#444', fontWeight: 500 },
  walkEmoji: { fontSize: 16 },
};
