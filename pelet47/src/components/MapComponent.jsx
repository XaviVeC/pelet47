// src/components/MapComponent.jsx
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

// Solución para los iconos de los marcadores
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41], // Tamaño del icono
  iconAnchor: [12, 41], // Punto de anclaje del icono
});

L.Marker.prototype.options.icon = defaultIcon;

const MapComponent = () => {
  useEffect(() => {
    // Inicializar el mapa
    const map = L.map('map').setView([40.416775, -3.703790], 13); // Coordenadas de Madrid, zoom 13

    // Añadir capa de tiles (mapa base)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Añadir un marcador
    const marker = L.marker([40.416775, -3.703790]).addTo(map);
    marker.bindPopup('¡Hola! Este es un marcador.').openPopup();

    // Limpieza al desmontar el componente
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;
