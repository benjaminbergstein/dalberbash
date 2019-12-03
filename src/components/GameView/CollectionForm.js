import React, { useState } from 'react';

const CollectionForm = ({ prompt, field, setField, handleSubmit }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div>
      <div>{prompt}</div>
      <form onSubmit={onSubmit}>
        <textarea onChange={(e) => { setField(e.target.value); }} value={field} />
        <button>Submit</button>
      </form>
    </div>
  )
};

export default CollectionForm;
