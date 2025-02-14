import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import MapComponent from './components/MapComponent';

// Componente App
const App = () => {
  return (
    <div className="app-container">
      <Header />

      {/* Mapa */}
      <MapComponent />

      {/* Botones flotantes */}
      <div className="floating-buttons">
        <button className="btn btn-primary btn-floating">
          <i className="bi bi-eye"></i>
        </button>
        <button className="btn btn-primary btn-floating">
          <i className="bi bi-signpost"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
