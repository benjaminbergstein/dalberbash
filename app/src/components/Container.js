import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Container = ({ title, subtitle, footer, children, height }) => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header title={title} subtitle={subtitle} />
      <div style={{ flex: '1', overflowY: 'scroll', marginBottom: 'auto' }}>
        {children}
      </div>
      {footer && <Footer {...footer} />}
    </div>
  );
};

export default Container;
