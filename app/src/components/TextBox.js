import React from 'react';

const COLORS = {
  'blue': {
    background: '#eeeef9',
    color: '#333366',
    borderBottom: '1px solid #333366',
  },
  'green': {
    background: '#eef9ee',
    color: '#336633',
    borderBottom: '1px solid #336633',
  },
  'gray': {
    background: '#dddddb',
    color: '#666663',
    borderBottom: '1px solid #666663',
  },
  'yellow': {
    borderBottom: '1px solid #666633',
    background: '#f9f3dd',
    color: '#666633',
  },
};

const PROFILES = {
  default: {
    fontSize: '0.7rem',
    padding: '0.5rem 1rem',
  },
  small: {
    fontSize: '0.6rem',
    padding: '0.25rem 0.5rem',
  },
};

const TextBox = ({ theme, profile, text, marginTop }) => {
  const colors = COLORS[theme];
  const profileStyles = PROFILES[profile || 'default'];

  return (
    <div style={{
      ...colors,
      ...profileStyles,
      marginTop,
    }}>{text}</div>
  );
};

export default TextBox;
