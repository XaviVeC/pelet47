// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        {/* Menú desplegable */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Opción 1
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Opción 2
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Opción 3
              </a>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <a className="navbar-brand mr-3" href="#">
          <img
            src="./logo.png" // Cambia esto por la ruta de tu logo
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top"
          />
        </a>


        {/* Icono de perfil */}
        <div className="ms-auto">
          <a href="#">
            <img
              src="profile-icon.png" // Cambia esto por la ruta de tu icono de perfil
              alt="Perfil"
              width="30"
              height="30"
              className="rounded-circle"
            />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
