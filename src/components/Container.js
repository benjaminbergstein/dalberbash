import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Container = ({ title, subtitle, footer, children, height }) => {
  return (
    <div style={{ height: height || '100%', position: 'relative' }}>
      <Header title={title} subtitle={subtitle} />
      <div style={{ height: '60%', overflowY: 'scroll' }}>
        {children}
      </div>
      {footer && <Footer {...footer} />}
    </div>
  );
};

export default Container;
