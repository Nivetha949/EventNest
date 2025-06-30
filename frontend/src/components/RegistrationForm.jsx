import React from 'react';

function RegistrationForm({ formData, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ marginRight: '10px' }}
      />
      <input
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <button type="submit" style={{ marginLeft: '10px' }}>Register</button>
    </form>
  );
}

export default RegistrationForm;
