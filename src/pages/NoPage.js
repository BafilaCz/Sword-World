import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './NoPage.css';

const NoPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <FaExclamationTriangle className="not-found-icon" />
        <h1 className='noPageH1'>404</h1>
        <h2 className='noPageH2'>Stránka Nenalezena</h2>
        <p className='noPageP'>Stránku, kterou zkoušíte navštívit nelze najít</p>
        <a href="/" className="home-link">Zpět Domů</a>
      </div>
    </div>
  );
};

export default NoPage;