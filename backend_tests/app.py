from flask import Flask, jsonify
import pandas as pd
import requests

app = Flask(__name__)

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
