import requests
import sqlite3

# URL de la API
url = "https://dadesobertes.seu-e.cat/api/action/datastore_search?resource_id=778e8d7e-ed69-49f3-a8ac-4a87d7ce4db0"

# Realizar la solicitud a la API
response = requests.get(url)
data = response.json()

# Conectar a la base de datos SQLite
conn = sqlite3.connect('dataset.db')
cursor = conn.cursor()

# Crear la tabla si no existe
cursor.execute('''
CREATE TABLE IF NOT EXISTS dataset (
    id INTEGER PRIMARY KEY,
    ESTACIO INTEGER,
    DATA TEXT,
    LATITUD REAL,
    LONGITUD REAL,
    CONTAMINANT TEXT,
    H01 INTEGER,
    H02 INTEGER,
    H03 INTEGER,
    H04 INTEGER,
    H05 INTEGER,
    H06 INTEGER,
    H07 INTEGER,
    H08 INTEGER,
    H09 INTEGER,
    H10 INTEGER,
    H11 INTEGER,
    H12 INTEGER,
    H13 INTEGER,
    H14 INTEGER,
    H15 INTEGER,
    H16 INTEGER,
    H17 INTEGER,
    H18 INTEGER,
    H19 INTEGER,
    H20 INTEGER,
    H21 INTEGER,
    H22 INTEGER,
    H23 INTEGER,
    H24 INTEGER,
    CODI_ENS INTEGER,
    NOM_ENS TEXT
)
''')

# Insertar los datos en la base de datos
for record in data['result']['records']:
    cursor.execute('''
    INSERT INTO dataset (
        ESTACIO, DATA, LATITUD, LONGITUD, CONTAMINANT, H01, H02, H03, H04, H05, H06, H07, H08, H09, H10, H11, H12, H13, H14, H15, H16, H17, H18, H19, H20, H21, H22, H23, H24, CODI_ENS, NOM_ENS
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        record['ESTACIO'], record['DATA'], record['LATITUD'], record['LONGITUD'], record['CONTAMINANT'],
        record['H01'], record['H02'], record['H03'], record['H04'], record['H05'], record['H06'], record['H07'],
        record['H08'], record['H09'], record['H10'], record['H11'], record['H12'], record['H13'], record['H14'],
        record['H15'], record['H16'], record['H17'], record['H18'], record['H19'], record['H20'], record['H21'],
        record['H22'], record['H23'], record['H24'], record['CODI_ENS'], record['NOM_ENS']
    ))

# Guardar los cambios y cerrar la conexión
conn.commit()
conn.close()
