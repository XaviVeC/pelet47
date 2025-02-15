import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import SigninPage from './components/SigninPage';
import LoginPage from './components/LoginPage';
import Welcome from './components/Welcome';

// Componente App
const App = () => {
  const [conquevoy, setConquevoy] = useState(["driving-car", 0]);

  function changeConquevoy(input) {
        setConquevoy(input)
        console.log(input);
  }

  return (
      <Router>
            <Routes>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/map" element={
                    <div style={{marginTop: "54px"}} className="app-container">
                      <Header  conquevoy={conquevoy} setConquevoy={changeConquevoy}/>

                      {/* Mapa */}
                      <MapComponent conquevoy={conquevoy}/>

                      {/* Botones flotantes */}
                      <div style= {{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px", /* Espaciado entre botones */
                        zIndex: "1000"
                      }} className="floating-buttons">
                        <button style={{
                            backgroundColor: "#007bff", /* Azul Bootstrap */
                            color: "white",
                            border: "none",
                            width: "55px",
                            height: "55px",
                            marginLeft: "200px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            cursor: "pointer",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            transition: "background-color 0.3s, transform 0.2s"
                        }}
                            className="btn-floating">
                          <i className="bi bi-eye"></i>
                        </button>
                        <button style={{height:"40px"}} className="btn-floating" onClick={() => calculateRoute()}>
                          <i className="bi bi-signpost"></i>
                          <span style={{marginLeft:"5px"}}>Calcula la teva ruta saludable!</span>
                        </button>
                      </div>
                    </div>
                }/>

                <Route path="/signin" element={<SigninPage/>} />
                <Route path="/login" element={<LoginPage/>} />
          </Routes>
      </Router>
  );
};

export default App;
