import React, { useState, useEffect } from 'react';
import RegistrationForm from './components/RegistrationForm';

import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('user'); // 'user' or 'admin'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email) {
    alert('Please fill out both fields!');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert('Please enter a valid email address!');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await res.json(); // ✅ call this ONCE

    if (res.status === 409) {
      alert(result.error); // ✅ now works fine
      return;
    }

    if (!res.ok) {
      throw new Error(result.error || 'Unknown error');
    }

    alert('✅ Registered successfully!');
    setFormData({ name: '', email: '' });
    fetchRegistrations(); // update admin list
  } catch (err) {
    console.error('Error:', err);
    setError('Failed to register. Please try again later.');
  }
};


  const fetchRegistrations = async () => {
    try {
      const res = await fetch('http://localhost:5000/registrations');
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error(err);
      setRegistrations([]);
      setError('Could not load registrations.');
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('user')} style={{ marginRight: '1rem' }}>
          👤 User View
        </button>
        <button onClick={() => setView('admin')}>
          🛡️ Admin View
        </button>
      </div>

      {view === 'admin' ? (
        isAdmin ? (
          <AdminPanel registrations={registrations} />

        ) : (
          <AdminLogin onLogin={setIsAdmin} />
        )
      ) : (
        <>
          <h1>🎟️ Event Registration</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <RegistrationForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};

export default App;
