from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
import pandas as pd
import requests
from geojson import Feature, FeatureCollection, Point


app = Flask(__name__)

app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        )


def process_api_data(api_url):

    response = requests.get(api_url)

    data = response.json()

    records = data["result"]["records"]

    df = pd.DataFrame(records)

    hour_columns = [f"H{str(i).zfill(2)}" for i in range(1, 25)]

    df["CONCENTRACIO"] = df[hour_columns].mean(axis=1, skipna=True)

    df = df[["_id", "ESTACIO", "DATA", "LATITUD", "LONGITUD", "CONTAMINANT", "CONCENTRACIO"]]

    df["DATA"] = pd.to_datetime(df["DATA"])

    df = df.dropna()

    features = []

    for _, row in df.iterrows():

        point = Point((row["LONGITUD"], row["LATITUD"]))

        properties = {

            "ESTACIO": row["ESTACIO"],

            "DATA": row["DATA"].isoformat(),

            "CONTAMINANT": row["CONTAMINANT"],

            "CONCENTRACIO": row["CONCENTRACIO"]

        }

        feature = Feature(geometry=point, properties=properties)

        features.append(feature)

    feature_collection = FeatureCollection(features)

    return feature_collection



@app.route('/get-geojson', methods=['GET'])

def get_geojson():

    contaminant = request.args.get('contaminant')

    if contaminant not in ["PM2.5", "PM10", "NO2"]:

        return jsonify({"error": "Invalid contaminant"}), 400



    api_urls = {

        "PM2.5": 'https://dadesobertes.seu-e.cat/api/action/datastore_search?resource_id=778e8d7e-ed69-49f3-a8ac-4a87d7ce4db0&filters={"CONTAMINANT":"PM2.5"}&limit=25000',

        "PM10": 'https://dadesobertes.seu-e.cat/api/action/datastore_search?resource_id=778e8d7e-ed69-49f3-a8ac-4a87d7ce4db0&filters={"CONTAMINANT":"PM10"}&limit=25000',

        "NO2": 'https://dadesobertes.seu-e.cat/api/action/datastore_search?resource_id=778e8d7e-ed69-49f3-a8ac-4a87d7ce4db0&filters={"CONTAMINANT":"NO2"}&limit=25000'

    }



    api_url = api_urls[contaminant]

    geojson_data = process_api_data(api_url)

    return jsonify(geojson_data)


@app.route('/get-data', methods=['GET'])
def get_data():
    # URL de la API
    url = "https://dadesobertes.seu-e.cat/api/action/datastore_search?resource_id=778e8d7e-ed69-49f3-a8ac-4a87d7ce4db0"

    # Realizar la solicitud GET a la API
    response = requests.get(url)
    data = response.json()

    # Extraer los registros del resultado
    records = data["result"]["records"]

    # Crear un DataFrame
    df = pd.DataFrame(records)

    # Calcular la media de H01 a H24
    hour_columns = [f"H{str(i).zfill(2)}" for i in range(1, 25)]
    df["CONCENTRACIO"] = df[hour_columns].mean(axis=1, skipna=True)

    # Seleccionar las columnas deseadas
    df = df[["_id", "ESTACIO", "DATA", "LATITUD", "LONGITUD", "CONTAMINANT", "CONCENTRACIO"]]

    # Filtrar solo los registros donde CONTAMINANT sea "NOX"
    df = df.loc[df["CONTAMINANT"] == "NO2"]

    # Convertir DATA a datetime y agregar columnas SETMANA y DIA
    df["DATA"] = pd.to_datetime(df["DATA"])
    df["SETMANA"] = df["DATA"].dt.isocalendar().week
    df["DIA"] = df["DATA"].dt.isocalendar().day

    # Convertir la columna DATA a string
    df["DATA"] = df["DATA"].dt.strftime('%Y-%m-%d')

    # Ordenar por ESTACIO en orden ascendente
    df = df.sort_values(by="ESTACIO", ascending=True)

    # Convertir a array JSON
    json_array = df.to_dict(orient='records')

    # Devolver el JSON como respuesta
    return jsonify(json_array)
    
if __name__ == '__main__':
    app.run(debug=True)

