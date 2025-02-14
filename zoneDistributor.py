import sqlite3
import numpy as np

# Conectar a la base de datos
conn = sqlite3.connect('sensor_data.db')
cursor = conn.cursor()

# Obtener datos de latitud, longitud y calidad de aire
cursor.execute("SELECT latitud, longitud, calidad_aire FROM sensores")
data = cursor.fetchall()

# Definir los límites del mapa de Tarragona
min_lat, max_lat = 41.0, 41.3
min_lon, max_lon = 1.0, 1.5

# Dividir el mapa en 6 zonas cuadradas
num_zonas = 6
zonas = []
lat_step = (max_lat - min_lat) / 2
lon_step = (max_lon - min_lon) / 3

for i in range(2):
    for j in range(3):
        zona = {
            'min_lat': min_lat + i * lat_step,
            'max_lat': min_lat + (i + 1) * lat_step,
            'min_lon': min_lon + j * lon_step,
            'max_lon': min_lon + (j + 1) * lon_step,
            'calidad_aire': []
        }
        zonas.append(zona)

# Asignar datos de sensores a las zonas correspondientes
for lat, lon, calidad in data:
    for zona in zonas:
        if zona['min_lat'] <= lat < zona['max_lat'] and zona['min_lon'] <= lon < zona['max_lon']:
            zona['calidad_aire'].append(calidad)
            break

# Calcular la calidad de aire promedio para cada zona
for zona in zonas:
    if zona['calidad_aire']:
        zona['calidad_aire_promedio'] = np.mean(zona['calidad_aire'])
    else:
        zona['calidad_aire_promedio'] = None

# Imprimir resultados
for i, zona in enumerate(zonas):
    print(f"Zona {i+1}:")
    print(f"  Latitud: {zona['min_lat']} - {zona['max_lat']}")
    print(f"  Longitud: {zona['min_lon']} - {zona['max_lon']}")
    print(f"  Calidad de aire promedio: {zona['calidad_aire_promedio']}")

# Cerrar la conexión a la base de datos
conn.close()