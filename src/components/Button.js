import React from 'react';
const noOp = () => {};
const orNoOp = (a) => a || noOp;

const COLORS = {
  lightgray: {
    border: '1px solid #e0e0e0',
    background: '#eeefee',
    color: '#aaacaa',
  },
  gray: {
    border: '1px solid #ccc',
    background: '#eeefee',
    color: '#333433',
  },
  green: {
    border: '1px solid #336633',
    background: '#eef9ee',
    color: '#336633',
  },
  yellow: {
    border: '1px solid #666633',
    background: '#f9f3dd',
    color: '#666633',
  },
  blue: {
    border: '1px solid #333366',
    background: '#eeeef9',
    color: '#333366',
  },
}

const Button = ({ theme, onClick, text }) => (
  <div style={{ padding: '0.5rem 1rem 0' }}>
    <button
      style={{
        boxSizing: 'border-box',
        display: 'block',
        width: '100%',
        padding: '0.5rem',
        borderRadius: '3px',
        fontSize: '0.7rem',
        textAlign: 'center',
        ...COLORS[theme || 'blue'],
      }}
      onClick={orNoOp(onClick)}
    >
      {text}
    </button>
  </div>
);

export default Button;
