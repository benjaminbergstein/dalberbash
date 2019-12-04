import React from 'react';

const COLORS = {
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
};

const TextBox = ({ theme, text, marginTop}) => {
  const colors = COLORS[theme];

  return (
    <div style={{
      ...colors,
      marginTop,
      fontSize: '0.7rem',
      padding: '0.5rem 1rem',
    }}>{text}</div>
  );
};

export default TextBox;
