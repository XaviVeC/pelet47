import React, { useState, useEffect, useRef } from "react";

const CarRouteSearch = ({ searchStart, setSearchStart, searchEnd, setSearchEnd, handleSearch }) => {
return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          marginLeft: "60px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <input
          type="text"
          placeholder="Buscar ubicación de inicio"
          value={searchStart}
          onChange={(e) => setSearchStart(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={() => handleSearch("start")} style={{ padding: "5px 10px" }}>
          Buscar
        </button>
      </div>
      <div 
        style={{
          position: "absolute",
          top: "80px",
          left: "20px",
          marginLeft: "60px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <input
          type="text"
          placeholder="Buscar ubicación de fin"
          value={searchEnd}
          onChange={(e) => setSearchEnd(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <button onClick={() => handleSearch("end")} style={{ padding: "5px 10px" }}>
          Buscar
        </button>
      </div>
    </div>
)};

export default CarRouteSearch;
