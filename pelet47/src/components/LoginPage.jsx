import React, { useState } from "react";
import "../App.css";
import { guardarUsuarios, obtenerUsuarios } from "../users";
import background from "../assets/bg.jpeg";

function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios = obtenerUsuarios();

    // Verificar si el correo ya existe
    const usuarioExistente = usuarios.find((u) => u.email === email);

    if (usuarioExistente) {
      alert("El correo ya está registrado.");
      return;
    }

    // Agregar nuevo usuario
    const nuevoUsuario = { name, email, password };
    usuarios.push(nuevoUsuario);

    // Guardar usuarios actualizados en localStorage
    guardarUsuarios(usuarios);

    alert("Usuario registrado exitosamente.");

    // Redirigir a la página de inicio de sesión
    window.location.href = "/signin";
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
          width: "350px",
        }}
      >
        <h1>Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label>Nombre:</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
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
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <button type="submit" className="auth-button" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Registrarse
          </button>
        </form>
        <p className="auth-footer" style={{ marginTop: "15px" }}>
          ¿Ya tienes una cuenta? <a href="/signin" style={{ color: "#007bff" }}>Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

