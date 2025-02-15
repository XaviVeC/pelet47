from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import json
import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial import Voronoi

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

@app.route('/voronoia', methods=['GET'])
def get_voronoia():
    with open('geono2.geojson','r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/voronoiii', methods=['GET'])
def get_voronoiii():
    with open('geotgn.geojson','r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/voronoii', methods=['GET'])
def get_voronoii():
    with open('geono2full.geojson','r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/voronoi', methods=['GET'])
def get_voronoi():
    # Cargar los datos del archivo GeoJSON
    with open('geono2orig.geojson', 'r') as f:
        data = json.load(f)
    # Extraer coordenadas y concentraciones
    coordinates = []
    concentrations = []
    for feature in data['features']:
        coords = feature['geometry']['coordinates']
        conc = feature['properties']['CONCENTRACIO']
        coordinates.append(coords)
        concentrations.append(conc)

    coordinates = np.array(coordinates)
    concentrations = np.array(concentrations)

    # Agrupar en 4 clusters usando K-Means
    kmeans = KMeans(n_clusters=4, random_state=0).fit(coordinates)
    labels = kmeans.labels_
    centroids = kmeans.cluster_centers_

    # Calcular la concentración media de cada cluster
    mean_concentrations = []
    for i in range(4):
        cluster_concentrations = concentrations[labels == i]
        mean_concentrations.append(np.mean(cluster_concentrations))

    # Generar diagrama de Voronoi
    vor = Voronoi(centroids)

    # Obtener los vértices de los polígonos de Voronoi
    voronoi_vertices = vor.vertices

    # Crear un array de objetos JSON con los polígonos de Voronoi
    voronoi_polygons = []
    for i, region in enumerate(vor.regions):
        #if not -1 in region and len(region) > 0:
            polygon = voronoi_vertices[region].tolist()
            voronoi_polygons.append({
                "cluster": i,
                "polygon": polygon,
               # "mean_concentration": mean_concentrations[i]
          })

    #return geotgn.geojson

    # Retornar el array de objetos JSON
    return jsonify(voronoi_polygons)





import json
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import warnings
from flask import Flask, jsonify

# Suprimir advertencias específicas de scikit-learn
warnings.filterwarnings("ignore", category=UserWarning, message="X does not have valid feature names*")

# Cargar el archivo GeoJSON
with open('geono2full.geojson', 'r') as f:
    data = json.load(f)

# Convertir a DataFrame
features = data['features']
rows = []
for feature in features:
    properties = feature['properties']
    geometry = feature['geometry']
    rows.append({
        'ESTACIO': int(properties['ESTACIO']),  # Convertir a int nativo
        'DATA': properties['DATA'],
        'CONTAMINANT': properties['CONTAMINANT'],
        'CONCENTRACIO': float(properties['CONCENTRACIO']),  # Convertir a float nativo
        'LATITUD': float(properties['CENTROID']['coordinates'][1]),
        'LONGITUD': float(properties['CENTROID']['coordinates'][0])
    })
df = pd.DataFrame(rows)

# Convertir la columna DATA a datetime
df['DATA'] = pd.to_datetime(df['DATA'])

# Añadir una columna para el día de la semana (0 = lunes, 6 = domingo)
df['DIA_SEMANA'] = df['DATA'].dt.weekday

# Convertir las fechas a días desde la primera fecha
df['DIAS'] = (df['DATA'] - df['DATA'].min()).dt.days

# Función para entrenar un modelo por día de la semana
def entrenar_modelos_por_dia(df_estacion):
    modelos = {}
    for dia in range(7):  # 0 = lunes, 6 = domingo
        df_dia = df_estacion[df_estacion['DIA_SEMANA'] == dia]
        if len(df_dia) > 1:  # Necesitamos al menos 2 puntos para una regresión lineal
            X = df_dia[['DIAS']]
            y = df_dia['CONCENTRACIO']
            model = LinearRegression()
            model.fit(X, y)
            modelos[dia] = model
        else:
            modelos[dia] = None  # No hay suficientes datos para este día
    return modelos

# Función para predecir la concentración en una fecha futura
def predecir_concentracion(estacion, fecha_futura, estaciones_cerradas):
    try:
        # Filtrar datos de la estación
        df_estacion = df[df['ESTACIO'] == estacion]
        
        # Entrenar modelos para cada día de la semana
        modelos = entrenar_modelos_por_dia(df_estacion)
        
        # Obtener el día de la semana de la fecha futura
        dia_semana_futuro = fecha_futura.weekday()
        
        # Seleccionar el modelo correspondiente al día de la semana
        model = modelos.get(dia_semana_futuro)
        
        if model is None:
            return None  # No hay suficientes datos para este día
        
        # Calcular los días desde la primera fecha para la fecha futura
        dias_futuro = (fecha_futura - df['DATA'].min()).days
        
        # Predecir la concentración
        concentracion_predicha = float(model.predict([[dias_futuro]])[0])  # Convertir a float nativo
        
        # Ajustar la predicción según si la estación está cerrada o abierta
        if estacion in estaciones_cerradas:
            # Disminuir en un 15% si la estación está cerrada
            concentracion_predicha *= 0.85
        else:
            # Aumentar en un 5% por cada día desde la última medición si la estación está abierta
            ultima_fecha = df_estacion['DATA'].max()
            dias_desde_ultima_medicion = (fecha_futura - ultima_fecha).days
            concentracion_predicha *= (1 + 0.05) ** dias_desde_ultima_medicion
        
        return concentracion_predicha
    except:
        return None  # Manejar errores silenciosamente

# Definir la ruta para la petición GET
@app.route('/predicciones', methods=['GET'])
def obtener_predicciones():
    # Obtener la fecha actual
    fecha_actual = datetime.now()
    posicion_est = {
        "43148022" : {
            "latitud": 41.11560103695832,
            "longitud": 1.2548899134732905
        },
        "43148003" : {
            "latitud": 41.118789805545,
            "longitud": 1.2448510043634218
        },
        "43148028" : {
            "latitud": 41.12030866517928,
            "longitud": 1.2556923620231084
        },
        "43148001" : {
            "latitud": 41.11320481048717,
            "longitud": 1.247594468940278
        },
    }
    # Definir las estaciones cerradas
    estaciones_cerradas = []  # Ejemplo de estaciones cerradas

    # Crear una lista para almacenar las predicciones en formato JSON
    predicciones_json = []

    # Generar predicciones para los próximos 7 días
    for i in range(7):
        fecha_futura = fecha_actual + timedelta(days=i)
        dia_predicciones = {
            "fecha": fecha_futura.strftime("%Y-%m-%d"),
            "dia_semana": int(fecha_futura.weekday()),  # Convertir a int nativo
            "estaciones": []
        }
        
        for estacion in df['ESTACIO'].unique():
            prediccion = predecir_concentracion(estacion, fecha_futura, estaciones_cerradas)
            if prediccion is not None:
                dia_predicciones["estaciones"].append({
                "estacion": int(estacion),
                "latitud": posicion_est[str(estacion)]["latitud"],
                "longitud": posicion_est[str(estacion)]["longitud"],
                "prediccion": float(round(prediccion, 2))  # Redondear y convertir a float nativo
            })
            else:
                dia_predicciones["estaciones"].append({
                    "estacion": int(estacion),  # Convertir a int nativo
                    "prediccion": None  # No hay suficientes datos
                })
        
        predicciones_json.append(dia_predicciones)

    # Devolver las predicciones en formato JSON
    return jsonify(predicciones_json)

# Ejecutar la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)
