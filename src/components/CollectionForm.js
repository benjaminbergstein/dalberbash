import React, { useState } from 'react';
import TextBox from './TextBox';
import Button from './Button';

const CollectionForm = ({
  prompt,
  field,
  setField,
  handleSubmit,
  marginTop,
}) => {
  const [error, setError] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    if (field === '') {
      setError('Please complete above field.');
    } else {
      handleSubmit();
    }
  };

  return (
    <div>
      <TextBox theme='green' text={prompt} marginTop={marginTop} />
      <form onSubmit={onSubmit}>
        <div style={{ padding: '0.5rem 1rem 0' }}>
          <textarea
            autoFocus
            style={{
              boxSizing: 'border-box',
              width: '100%',
              height: '20vh',
              fontSize: '1.2rem',
              border: '1px solid #ccc',
              borderRadius: '3px',
            }}
            onChange={(e) => { setField(e.target.value); }}
            value={field}
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
