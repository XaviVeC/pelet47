import React from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import logo from "../assets/logo.png"; // Importar el logo

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "50px",
      }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "200px", // Ajusta el tamaño del logo
          height: "auto",
          marginBottom: "20px", // Espacio entre el logo y los botones
        }}
      />

      {/* Botón Register */}
      <button
        onClick={() => navigate("/signin")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
      Inicia Sessió
      </button>

      {/* Botón Log In */}
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
      Registrar-se
      </button>
    </div>
  );
};

export default Welcome;

