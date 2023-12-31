import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const handleFooterFix = () => {
    const footerElement = document.querySelector('.footer');
    if (footerElement) {
      footerElement.style.position = 'fixed';
      footerElement.style.bottom = '0';
    }
  };

  const handleRemoveFooterFix = () => {
    const footerElement = document.querySelector('.footer');
    if (footerElement) {
      footerElement.style.position = ''; // Restablecer la posición predeterminada
      footerElement.style.bottom = '';
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to='/' onClick={handleRemoveFooterFix }>
          <img src="/logo.svg" alt="MasterEvents Logo" width="100" height="57" />
        </Link>
        <div className="header-text">
          MasterEvents
        </div>
      </div>
      <div className="button-container">

        <Link to="/formevent" onClick={handleFooterFix}>
          <button className="header-button" onClick={handleFooterFix}>
            Crear Evento
          </button>
        </Link>
        <Link to="/registration" onClick={handleFooterFix}>
          <button className="header-button">
            Crear cuenta
          </button>
        </Link>
        <Link to="/signin" onClick={handleFooterFix}>
          <button className="header-button">
            Iniciar sesión
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
