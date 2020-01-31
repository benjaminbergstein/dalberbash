import React from 'react';

const Header = ({ title, subtitle }) => (
  <div style={{
    background: '#eeefee',
    color: '#333433',
    padding: '0.5rem 1rem',
    fontWeight: '900',
  }}>
    <div style={{ fontSize: '1.2rem' }}>{title}</div>
    <div style={{ fontSize: '0.8rem' }}>{subtitle}</div>
  </div>
);

export default Header;
