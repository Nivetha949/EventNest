import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [key, setKey] = useState('');

  const handleLogin = () => {
    if (key === 'mysecret123') {
      onLogin(true);
    } else {
      alert('❌ Invalid Security Key!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔐 Admin Login</h2>
      <input
        type="password"
        placeholder="Enter Security Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button onClick={handleLogin} style={{ marginLeft: '1rem' }}>Login</button>
    </div>
  );
};

export default AdminLogin;
