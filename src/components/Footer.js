import React from 'react';

const Footer = ({ primaryText, secondaryText }) => (
  <div style={{
    position: 'absolute',
    width: '100%',
    bottom: '0',
    left: '0',
    background: '#eeefee',
    color: '#333433',
    fontWeight: '900',
  }}>
    <div style={{ padding: '1em' }}>
      <div style={{ fontSize: '0.6rem' }}>{primaryText}</div>
      <div style={{ fontSize: '1rem' }}>{secondaryText}</div>
    </div>
  </div>
);

export default Footer;
