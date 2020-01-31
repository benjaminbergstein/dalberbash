import React from 'react';

const Input = ({ onClick, value, onChange, ...inputProps }) => (
  <div style={{ padding: '0.5rem 1rem 0' }}>
    <input type="text"
      {...inputProps}
      style={{
        boxSizing: 'border-box',
        display: 'block',
        width: '100%',
        border: '1px solid #ccc',
        background: '#f9f9ff',
        color: '#333433',
        padding: '0.5rem',
        borderRadius: '3px',
        fontSize: '0.7rem',
      }}
      onChange={onChange}
      value={value}
    />
  </div>
);

export default Input;
