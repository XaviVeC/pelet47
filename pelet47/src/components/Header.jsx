import React from 'react';
import logo from "../assets/logo.png";

const Header = ({ conquevoy, setConquevoy }) => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
      style={{ height: "50px", padding: "5px 10px" }} // Reducimos la altura y el padding
    >
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
          <ul className="navbar-nav" style={{ display: 'flex', gap: '20px', paddingLeft: '0' }}>
            <li className="nav-item" style={{ listStyle: 'none' }}>
              <a
                className="nav-link"
                onClick={() => setConquevoy(["driving-car", 0])}
                href="#"
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  transition: 'background-color 0.3s, color 0.3s',
                  backgroundColor: conquevoy[1] === 0 ? '#007bff' : 'transparent', // Destacar seleccionado
                  color: conquevoy[1] === 0 ? '#fff' : '#333', // Cambiar color del texto si está seleccionado
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} // Efecto hover
                onMouseLeave={(e) => e.target.style.backgroundColor = conquevoy[1] === 0 ? '#007bff' : 'transparent'} // Restaurar color
              >
                Conduïm!
              </a>
            </li>
            <li className="nav-item" style={{ listStyle: 'none' }}>
              <a
                className="nav-link"
                onClick={() => setConquevoy(["foot-walking", 1])}
                href="#"
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  transition: 'background-color 0.3s, color 0.3s',
                  backgroundColor: conquevoy[1] === 1 ? '#007bff' : 'transparent', // Destacar seleccionado
                  color: conquevoy[1] === 1 ? '#fff' : '#333', // Cambiar color del texto si está seleccionado
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} // Efecto hover
                onMouseLeave={(e) => e.target.style.backgroundColor = conquevoy[1] === 1 ? '#007bff' : 'transparent'} // Restaurar color
              >
                Caminem!
              </a>
            </li>
            <li className="nav-item" style={{ listStyle: 'none' }}>
              <a
                className="nav-link"
                onClick={() => setConquevoy(["foot-walking", 2])}
                href="#"
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  transition: 'background-color 0.3s, color 0.3s',
                  backgroundColor: conquevoy[1] === 2 ? '#007bff' : 'transparent', // Destacar seleccionado
                  color: conquevoy[1] === 2 ? '#fff' : '#333', // Cambiar color del texto si está seleccionado
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} // Efecto hover
                onMouseLeave={(e) => e.target.style.backgroundColor = conquevoy[1] === 2 ? '#007bff' : 'transparent'} // Restaurar color
              >
                Correm!
              </a>
            </li>
          </ul>
        </div>
        {/* Logo */}
        <a className="navbar-brand mr-3" href="#">
          <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
        </a>

        {/* Icono de perfil */}
        <div className="ms-auto">
          <a href="#">
            
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;

