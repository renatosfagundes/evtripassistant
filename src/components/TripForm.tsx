import React, { useState } from 'react';

export const TripForm = ({ onSubmit, loading }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [autonomy, setAutonomy] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin || !destination || !autonomy) return;
    onSubmit({ origin, destination, autonomy: Number(autonomy) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#f8f9fa', padding: 20, borderRadius: 8, border: '1px solid #e9ecef' }}>
      <h2 style={{ marginTop: 0, color: '#495057' }}>Plan Your EV Trip</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Origin<br />
            <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} required placeholder="e.g. Berlin, DE" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          </label>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Destination<br />
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required placeholder="e.g. Munich, DE" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          </label>
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label>Vehicle Autonomy (km)<br />
            <input type="number" value={autonomy} onChange={e => setAutonomy(e.target.value)} required min={1} placeholder="e.g. 350" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          </label>
        </div>
        <div style={{ alignSelf: 'end' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 24px', borderRadius: 6, background: '#0078D4', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Planning...' : 'Plan Trip'}
          </button>
        </div>
      </div>
    </form>
  );
};
