import json

def add_centroid_point(input_file, output_file):
    def calculate_centroid(polygon):
        coordinates = polygon["coordinates"][0]  # Primer anillo del polígono
        x_sum = sum(coord[0] for coord in coordinates)
        y_sum = sum(coord[1] for coord in coordinates)
        num_points = len(coordinates)
        return [x_sum / num_points, y_sum / num_points]

    # Leer el archivo GeoJSON
    with open(input_file, 'r') as file:
        data = json.load(file)

    for feature in data["features"]:
        if feature["geometry"]["type"] == "Polygon":
            centroid = calculate_centroid(feature["geometry"])
            # Agregar el centroide como un atributo en properties
            feature["properties"]["CENTROID"] = {
                "coordinates": centroid
            }

    # Guardar el archivo actualizado
    with open(output_file, 'w') as file:
        json.dump(data, file, indent=4)

# Archivos de entrada y salida
input_file = "./hackathon/geofix.geojson"
output_file = "geofix_with_centroids.geojson"

# Ejecutar la función
add_centroid_point(input_file, output_file)
