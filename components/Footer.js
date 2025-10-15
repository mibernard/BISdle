import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '250px 0 0 0',
        // position: 'fixed',
        bottom: 0,
        width: '100%',
        color: 'tan'
      }}
    >
      
      <p>Bisdle.vercel.app - 2025</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <a href='https://github.com/mibernard' target='_blank' aria-label='GitHub' style={{ margin: '0 10px' }}>
          <img
            src='https://cdn-icons-png.flaticon.com/512/733/733553.png'
            alt='GitHub'
            style={{ width: '30px', height: 'auto' }}
          />
        </a>
        <a
          href='https://linkedin.com/in/matthewbernard'
          target='_blank'
          aria-label='LinkedIn'
          style={{ margin: '0 10px' }}
        >
          <img
            src='https://cdn-icons-png.flaticon.com/512/174/174857.png'
            alt='LinkedIn'
            style={{ width: '30px', height: 'auto' }}
          />
        </a>
        <a href='https://ko-fi.com/J3J51MVB8P' target='_blank' rel='noopener noreferrer'>
          <img 
            height='36' 
            style={{ border: '0px', height: '30px', margin: '0 10px' }} 
            src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' 
            border='0' 
            alt='Buy Me a Coffee at ko-fi.com' 
          />
        </a>
      </div>
      
      {/* <p style={{ fontSize: '12px' }}>In Collaboration With</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <a href='https://github.com/BrendanLThompson' target='_blank' aria-label='GitHub' style={{ margin: '0 10px' }}>
          <img
            src='https://cdn-icons-png.flaticon.com/512/733/733553.png'
            alt='GitHub'
            style={{ width: '15px', height: 'auto' }}
          />
        </a>
        <a href='https://linkedin.com/in/blthomp' target='_blank' aria-label='LinkedIn' style={{ margin: '0 10px' }}>
          <img
            src='https://cdn-icons-png.flaticon.com/512/174/174857.png'
            alt='LinkedIn'
            style={{ width: '15px', height: 'auto' }}
          />
        </a>
      </div> */}
    </footer>
  );
};

export default Footer;
