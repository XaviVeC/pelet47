import React, { useState } from "react";
import "../App.css";

function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    function handleSubmit() {
    }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
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
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Iniciar Sesión
          </button>
        </form>
        <p className="auth-footer">
          ¿No tienes una cuenta? <a href="/login">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}

export default SigninPage;
