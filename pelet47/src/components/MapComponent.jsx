import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RouteSearch from './RouteSearch';

const MapComponent = ({conquevoy}) => {
  const [startLocation, setStartLocation] = useState(null); // Estado para el marcador de inicio
  const [endLocation, setEndLocation] = useState(null); // Estado para el marcador de fin
  const [searchStart, setSearchStart] = useState(""); // Estado para la barra de búsqueda de inicio
  const [searchEnd, setSearchEnd] = useState(""); // Estado para la barra de búsqueda de fin
  const [data, setData] = useState(null); // Estado para almacenar la respuesta de la API
  const [loading, setLoading] = useState(true); // Estado para almacenar la respuesta de la API
  const [error, setError] = useState(true); // Estado para almacenar la respuesta de la API

  const mapRef = useRef(null); // Referencia al mapa
  const mapInstance = useRef(null); // Instancia del mapa
  const startMarkerRef = useRef(null); // Referencia al marcador de inicio
  const endMarkerRef = useRef(null); // Referencia al marcador de fin
  const routeRef = useRef(null); // Referencia a la ruta dibujada

  // Inicializar el mapa
  useEffect(() => {
    mapInstance.current = L.map(mapRef.current).setView([41.118882, 1.24449], 13);

    // Añadir capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    // Limpieza al desmontar el componente
    return () => {
      mapInstance.current.remove();
    };
  }, []);

    
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

  // Función para manejar la búsqueda de ubicaciones
  const handleSearch = (type) => {
    const query = type === "start" ? searchStart : searchEnd;

    // Usar la API de geocodificación de OpenStreetMap Nominatim
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const location = [parseFloat(lat), parseFloat(lon)];

          // Eliminar el marcador anterior (inicio o fin)
          if (type === "start" && startMarkerRef.current) {
            mapInstance.current.removeLayer(startMarkerRef.current);
          } else if (type === "end" && endMarkerRef.current) {
            mapInstance.current.removeLayer(endMarkerRef.current);
          }

          // Añadir nuevo marcador
          const marker = L.marker(location).addTo(mapInstance.current);

          // Guardar la referencia al marcador
          if (type === "start") {
            startMarkerRef.current = marker;
            setStartLocation(location); // Actualizar el marcador de inicio
          } else {
            endMarkerRef.current = marker;
            setEndLocation(location); // Actualizar el marcador de fin
          }

          // Centrar el mapa en la nueva ubicación
          mapInstance.current.setView(location, 13);

        } else {
          alert("Ubicación no encontrada");
        }
      })
      .catch((error) => {
        console.error("Error en la búsqueda:", error);
      });
  };

  // Función para calcular la ruta
  const calculateRoute = () => {
    if (!startLocation || !endLocation) return;

    const apiKey = "5b3ce3597851110001cf6248827fe6f76cda4c0685972c545cb452d2"; // OpenRouteService no requiere clave para uso básico
    const url = `https://api.openrouteservice.org/v2/directions/${conquevoy}?api_key=${apiKey}&start=${startLocation[1]},${startLocation[0]}&end=${endLocation[1]},${endLocation[0]}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const coordinates = data.features[0].geometry.coordinates;
          const latLngs = coordinates.map((coord) => [coord[1], coord[0]]);

          // Eliminar ruta anterior
          if (routeRef.current) {
            mapInstance.current.removeLayer(routeRef.current);
          }

          // Dibujar la nueva ruta
          routeRef.current = L.polyline(latLngs, { color: "blue" }).addTo(mapInstance.current);
        } else {
          alert("No se pudo calcular la ruta");
        }
      })
      .catch((error) => {
        console.error("Error al calcular la ruta:", error);
      });
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
        <RouteSearch conquevoy={conquevoy} handleSearch={handleSearch} setSearchStart={setSearchStart} searchStart={searchStart} searchEnd={searchEnd} setSearchEnd={setSearchEnd}/>

      {/* Mapa */}
      <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>

      {/* Botones flotantes */}
      <div className="floating-buttons">
        <button className="btn-floating">
          <i className="bi bi-eye"></i>
        </button>
        <button className="btn-floating" onClick={() => calculateRoute()}>
          <i className="bi bi-signpost"></i>
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
