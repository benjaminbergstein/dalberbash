import React, { memo, useState, useEffect, useRef } from 'react';
import TextBox from './TextBox';
import Button from './Button';

const EMPTY_RE = /^\s{0,}$/;

const CollectionForm = ({
  prompt,
  field,
  setField,
  handleSubmit,
  marginTop,
}) => {
  const [value, setValue] = useState(field);
  const [error, setError] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    if (EMPTY_RE.test(value)) {
      setError('Please complete above field.');
    } else {
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setField(e.target.value);
  };

  return (
    <div>
      <TextBox theme='green' text={prompt} marginTop={marginTop} />
      <form onSubmit={onSubmit}>
        <div style={{ padding: '0.5rem 1rem 0' }}>
          <textarea
            style={{
              boxSizing: 'border-box',
              width: '100%',
              height: '20vh',
              fontSize: '1.2rem',
              border: '1px solid #ccc',
              borderRadius: '3px',
            }}
            onChange={handleChange}
            value={value}
          />
        </div>

        {error !== false && (
          <TextBox theme='yellow' text={error} marginTop='0.5em' />
        )}
        <Button text='Submit' />
      </form>
    </div>
  )
};

export default CollectionForm;
