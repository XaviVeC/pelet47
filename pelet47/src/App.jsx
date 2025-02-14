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

    </div>
  );
};

export default App;
