import React from 'react';

function RegistrationList({ registrations }) {
  return (
    <>
      <h2 style={{ marginTop: '2rem' }}>📋 Registered Users</h2>
      <ul>
        {registrations.map((user, index) => (
          <li key={index}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </>
  );
}

export default RegistrationList;
