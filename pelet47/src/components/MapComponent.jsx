import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "../App.css"
import "leaflet/dist/leaflet.css";
import RouteSearch from './RouteSearch';


const MapComponent = ({conquevoy}) => {
  const [startLocation, setStartLocation] = useState(null); // Estado para el marcador de inicio
  const [endLocation, setEndLocation] = useState(null); // Estado para el marcador de fin
  const [searchStart, setSearchStart] = useState(""); // Estado para la barra de búsqueda de inicio
      const [value, setValue] = useState(0); // Valor inicial en el centro (0-6)
  const [searchEnd, setSearchEnd] = useState(""); // Estado para la barra de búsqueda de fin
  const [data, setData] = useState(null); // Estado para almacenar la respuesta de la API
  const [result, setResult] = useState(null);
  const [zones, setZones] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para almacenar la respuesta de la API
  const [error, setError] = useState(true); // Estado para almacenar la respuesta de la API
  const [predicciones, setPredicciones] = useState([]); // Estado para almacenar la respuesta de la API

  const mapRef = useRef(null); // Referencia al mapa
  const mapInstance = useRef(null); // Instancia del mapa
  const startMarkerRef = useRef(null); // Referencia al marcador de inicio
  const endMarkerRef = useRef(null); // Referencia al marcador de fin
  const routeRef = useRef(null); // Referencia a la ruta dibujada
  const polygonRef = useRef(null)
  const buttonRef = useRef([]);

  function handleChangeSlider(event) {
    const newValue = Number(event.target.value);
    setValue(newValue);

     buttonRef.current.forEach((layer) => {
        if (layer instanceof L.Circle) {
          mapRef.current.removeLayer(layer);
        }
      });
    
      //predicciones[value].estaciones.forEach(
      predicciones.forEach(
        (pred) => {
           //buttonRef.current.append( L.circle([pred.lat, pred.lng], {
           buttonRef.current.append( L.circle([1.2166191763128922, 41.12438826479462], {
              radius: Math.max(17.48 * 100, 500), // Escala ajustable
              fillColor: "red",
              color: "transparent",
              fillOpacity: Math.min(0.2 + pred.predicion / 100, 0.7), // Difuminado
            }).addTo(mapRef)
           )});
    }

  function decodePolyline(encodedPolyline, includeElevation) {
    // array that holds the points
    let points = []
    let index = 0
    const len = encodedPolyline.length
    let lat = 0
    let lng = 0
    let ele = 0
    while (index < len) {
      let b
      let shift = 0
      let result = 0
      do {
        b = encodedPolyline.charAt(index++).charCodeAt(0) - 63 // finds ascii
        // and subtract it by 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)

      lat += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
      shift = 0
      result = 0
      do {
        b = encodedPolyline.charAt(index++).charCodeAt(0) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      lng += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))

      if (includeElevation) {
        shift = 0
        result = 0
        do {
          b = encodedPolyline.charAt(index++).charCodeAt(0) - 63
          result |= (b & 0x1f) << shift
          shift += 5
        } while (b >= 0x20)
        ele += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
      }
      try {
        let location = [(lat / 1E5), (lng / 1E5)]
        if (includeElevation) location.push((ele / 100))
        points.push(location)
      } catch (e) {
        console.log(e)
      }
    }
    return points
  } 

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
        const response = await fetch("http://34.235.156.167/voronoii"); // Llamada GET
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        const result = await response.json(); // Convertir la respuesta a JSON
        var latLngs = [];
        for(var polygon of result.features) {
            const latLngs = polygon['geometry'].coordinates[0].map(coord => [coord[1], coord[0]]);
            //latLngs.push([polygon['geometry'].coordinates[1], point['geometry'].coordinates[0]]);
            polygonRef.current = L.polygon(latLngs).addTo(mapInstance.current);
        }

        setResult(result); // Almacenar la respuesta en el estado
      } catch (error) {
        setError(error.message); // Manejar errores
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    fetchData(); // Ejecutar la función
  }, []);

  // cosas slider  
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://34.235.156.167/predicciones"); // Llamada GET
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        const result = await response.json(); // Convertir la respuesta a JSON

        setPredicciones(predicciones); // Almacenar la respuesta en el estado
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
        const url = `https://api.openrouteservice.org/v2/directions/${conquevoy[0]}?api_key=${apiKey}`;
        console.log(result);
        const pols = result.features.map(o => o.geometry.coordinates)
        console.log(pols);
        const avoid_pol = {type:"MultiPolygon", coordinates: pols }
      
        const body = {
          coordinates: [
            [startLocation[1], startLocation[0]], // [longitud, latitud] del punto de inicio
            [endLocation[1], endLocation[0]],     // [longitud, latitud] del punto de fin
          ],
          options: {
            avoid_polygons: avoid_pol, // Polígonos a evitar
          },
        };
        fetch(url, 
            {  
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
      .then((response) => response.json())
      .then((data) => {
            // Eliminar ruta anterior
            if (routeRef.current) {
              mapInstance.current.removeLayer(routeRef.current);
            }
            console.log(data)
            // Decodificar la polyline
            routeRef.current = L.polyline(decodePolyline(data.routes[0].geometry, false), {
                color: 'blue',
                weight: 5,
                opacity: 0.7
            }).addTo(mapInstance.current);      
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


    <div style={{ position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px 15px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: "1000" }} 
      className="floating-slider">
      <span>Predicció per a:</span>
      <input
        type="range"
        min="0"
        max="6"
        step="1"
        value={value}
        onChange={handleChangeSlider}
        className="slider"
      />
      <span className="slider-value">{value} dies</span>
    </div>

    </div>
  );
};

export default MapComponent;
