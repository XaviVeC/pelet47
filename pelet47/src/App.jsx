import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import MapComponent from './components/MapComponent';

// Componente App
const App = () => {
  const [conquevoy, setConquevoy] = useState("driving-car");

  function changeConquevoy(input) {
        setConquevoy(input)
        console.log(input);
  }

  return (
    <div className="app-container">
      <Header  setConquevoy={changeConquevoy}/>

      {/* Mapa */}
      <MapComponent conquevoy={conquevoy}/>

    </div>
  );
};

export default App;
