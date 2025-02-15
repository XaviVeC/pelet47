import requests
import folium

def calculate_route(api_key, start_location, end_location, conquevoy, map_instance):
    """
    Calcula la ruta entre dos ubicaciones usando OpenRouteService y la dibuja en un mapa.

    :param api_key: Clave de API para OpenRouteService.
    :param start_location: Coordenadas de inicio [lat, lon].
    :param end_location: Coordenadas de destino [lat, lon].
    :param conquevoy: Modo de transporte (ejemplo: "driving-car", "foot-walking").
    :param map_instance: Instancia del mapa (folium.Map).
    """
    if not start_location or not end_location:
        print("Las ubicaciones de inicio y fin son requeridas.")
        return

    url = f"https://api.openrouteservice.org/v2/directions/{conquevoy}"
    params = {
        "api_key": api_key,
        "start": f"{start_location[1]},{start_location[0]}",
        "end": f"{end_location[1]},{end_location[0]}"
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if "features" in data and len(data["features"]) > 0:
            coordinates = data["features"][0]["geometry"]["coordinates"]
            lat_lngs = [(coord[1], coord[0]) for coord in coordinates]

            # Agregar la ruta al mapa
            folium.PolyLine(lat_lngs, color="blue").add_to(map_instance)
            print("Ruta calculada y añadida al mapa.")
        else:
            print("No se pudo calcular la ruta.")
    except requests.RequestException as e:
        print(f"Error al calcular la ruta: {e}")

# Coordenadas de inicio y fin
start_location = [41.1189, 1.2445]  # Tarragona
end_location = [41.1561, 1.1069]  # Reus

# Clave de API y modo de transporte
api_key = "5b3ce3597851110001cf6248827fe6f76cda4c0685972c545cb452d2"
conquevoy = "driving-car"

# Crear un mapa usando Folium
map_instance = folium.Map(location=start_location, zoom_start=12)

# Calcular la ruta
calculate_route(api_key, start_location, end_location, conquevoy, map_instance)

# Guardar el mapa en un archivo HTML
map_instance.save("ruta_tarragona_reus.html")
