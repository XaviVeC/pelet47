import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Función para crear un ícono personalizado
const createCustomIcon = (iconUrl) =>
  new L.Icon({
    iconUrl,
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [0, -45],
  });

const MapComponent = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null); // Estado para la ubicación actual
  const [data, setData] = useState(null); // Estado para almacenar la respuesta de la API
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores


  // Llamada GET a localhost:3000
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/neighborhoods"); // Llamada GET
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        const result = await response.json(); // Convertir la respuesta a JSON
        setData(result); // Almacenar la respuesta en el estado
      } catch (error) {
        setError(error.message); // Manejar errores
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    fetchData(); // Ejecutar la función
  }, []);

  return (
    <>
      <MapContainer
        center={[41.118882, 1.24449]}
        zoom={13}
      >
        {/* Capa base */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />



        {/* Ubicación en tiempo real */}
        {!loading && data.map((neighborhood) => (
          <Polygon
            key={neighborhood.name}
            positions={neighborhood.positions}
            pathOptions={{
              color: neighborhood.color,
              fillColor: neighborhood.color,
              fillOpacity: 0.5,
            }}
          >
          </Polygon>
        ))}
      </MapContainer>
      {/* Botones flotantes */}
      <div className="floating-buttons">
        <button className="btn-floating">
          <i className="bi bi-eye"></i>
        </button>
        <button className="btn-floating">
          <i className="bi bi-signpost"></i>
        </button>
      </div>

    </>
  );
};

export default MapComponent;

