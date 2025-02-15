import React, { useState } from "react";
import { guardarUsuarios, obtenerUsuarios } from "../users";
import "../App.css";
import background from "../assets/background.png";

function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios = obtenerUsuarios();

    console.log(usuarios);
    // Buscar al usuario por email y contraseña
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (!usuario) {
      alert("Credenciales incorrectas.");
      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

    alert(`¡Bienvenido, ${usuario.name}!`);

    // Redirigir a la página principal o dashboard
    window.location.href = "/map";
  };
  

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "300px",
        }}
      >
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label>Correo Electrónico:</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <button type="submit" className="auth-button" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Iniciar Sesión
          </button>
        </form>
        <p className="auth-footer" style={{ marginTop: "15px" }}>
          ¿No tienes una cuenta? <a href="/login" style={{ color: "#007bff" }}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}

export default SigninPage;

