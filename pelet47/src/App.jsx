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

                    </div>
                }/>

                <Route path="/signin" element={<SigninPage/>} />
                <Route path="/login" element={<LoginPage/>} />
          </Routes>
      </Router>
  );
};

export default App;
