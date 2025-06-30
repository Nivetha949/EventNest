import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('http://localhost:5000/registrations');
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error('❌ Failed to fetch registrations:', err);
      setRegistrations([]);
    }
  };

  const handleDelete = async (email) => {
    const confirm = window.confirm(`Are you sure you want to delete ${email}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/registrations/${email}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to delete');
      }

      alert('🗑️ Deleted successfully!');
      setRegistrations(registrations.filter(r => r.email !== email));
    } catch (err) {
      alert('❌ Could not delete user.');
      console.error(err);
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      ['Name', 'Email'],
      ...registrations.map(r => [r.name, r.email])
    ]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'registrations.csv';
    link.click();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 Registered Users</h2>

      {registrations.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <ul>
          {registrations.map((r, i) => (
            <li key={i}>
              {r.name} ({r.email})
              <button
                onClick={() => handleDelete(r.email)}
                style={{ marginLeft: '1rem', color: 'white', backgroundColor: 'red', border: 'none', padding: '4px 8px', borderRadius: '5px' }}
              >
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={downloadCSV}
        style={{ marginTop: '1rem' }}
        disabled={registrations.length === 0}
      >
        📥 Download CSV
      </button>
    </div>
  );
};

export default AdminPanel;
