import React, { useState } from "react";
import "../App.css";

function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    function handleSubmit() {
    }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Registrarse
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tienes una cuenta? <a href="/signin">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
