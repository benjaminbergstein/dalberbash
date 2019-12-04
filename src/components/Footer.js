import React from 'react';

const Footer = ({ primaryText, secondaryText }) => (
  <div style={{
    position: 'absolute',
    width: '100%',
    bottom: '0',
    left: '0',
    background: '#eeefee',
    color: '#333433',
    padding: '1em',
    fontWeight: '900',
  }}>
    <div style={{ fontSize: '0.6rem' }}>{primaryText}</div>
    <div style={{ fontSize: '1rem' }}>{secondaryText}</div>
  </div>
);

export default Footer;
