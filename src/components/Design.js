import React, { useState } from 'react';
import Button from './Button';
import Container from './Container';
import Header from './Header';
import Footer from './Footer';
import Input from './Input';
import TextBox from './TextBox';

const Box = ({ children, hasBorder, styles }) => (
  <div style={{
    ...styles,
    margin: '0.5em 0',
    padding: '0.5em',
    border: hasBorder ? '1px solid #999' : '',
    borderRadius: '5px'
  }}>
    {children}
  </div>
);

const Example = ({ text, code, children }) => (
  <>
    <Box>
      <TextBox profile='small' theme='gray' text={text} />
      <Box hasBorder styles={{ background: 'white' }}>
        <div style={{ background: '#f9f9f9' }}>
          {children}
        </div>
      </Box>
      <Code code={code} />
    </Box>
  </>
);

const Code = ({ code }) => (
  <>
    <TextBox profile='small' theme='gray' text='Code' />
    <Box hasBorder>
      <div style={{ background: '#f9f9f9' }}>
        <pre>
          {code}
        </pre>
      </div>
    </Box>
  </>
);

const TextBoxExamples = () => (
  <>
    <TextBox marginTop='1em' theme='blue' text='<TextBox> Examples' />
    <Example text='Basic TextBox' code={`<TextBox theme='gray' text='This is a TextBox' />`}>
      <TextBox theme='gray' text='This TextBox is green' />
    </Example>
    <Example text='Green TextBox' code={`<TextBox theme='green' text='This TextBox is green' />`}>
      <TextBox theme='green' text='This is a TextBox' />
    </Example>
  </>
);

const ButtonExamples = () => (
  <>
    <TextBox marginTop='1em' theme='blue' text='<Button> Examples' />
    <Example text='Basic Button' code={`<Button theme='gray' text='Submit' onClick={() => alert('Clicked!')} />`}>
      <Button theme='gray' text='Submit' onClick={() => alert('Clicked!')} />
    </Example>
    <Example text='Themed Buttons' code={`<Button theme='lightgray' text='Next' />
<Button theme='green' text='Enter' />
<Button theme='blue' text='Pounce' />`}>
      <Button theme='lightgray' text='Next' />
      <Button theme='green' text='Success' />
      <Button theme='blue' text='Info' />
      <Button theme='yellow' text='Warning' />
    </Example>
  </>
);

const InputExamples = () => {
  const [value, setValue] = useState('foo bar');

  return (
    <>
      <TextBox theme='blue' text='<Input> Examples' />
      <Example text='Input' code={`const [value, setValue] = useState('foo bar');
...
<Input value={value} onChange={(e) => setValue(e.target.value)}> />`}>
        <>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <div><small>{`The value is ${value}`}</small></div>
        </>
      </Example>
    </>
  );
};

const Design = () => {
  return (
    <div>
      <Container
        title="Design System"
        subtitle="Components used in the game">

        <TextBoxExamples />
        <InputExamples />
        <ButtonExamples />

      </Container>
    </div>
  );
};

export default Design;
