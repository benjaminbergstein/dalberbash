import React, { useState } from 'react';
import TextBox from '../TextBox';
import Button from '../Button';

const CollectionForm = ({ prompt, field, setField, handleSubmit }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div>
      <TextBox theme='green' text={prompt} />
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

        <Button text='Submit' />
      </form>
    </div>
  )
};

export default CollectionForm;
