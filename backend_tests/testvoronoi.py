import json
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from scipy.spatial import Voronoi, voronoi_plot_2d

# Cargar los datos del archivo GeoJSON
with open('./hackathon/geo.geojson', 'r') as f:
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

# Representar el diagrama de Voronoi
fig, ax = plt.subplots()
voronoi_plot_2d(vor, ax=ax)
ax.plot(coordinates[:, 0], coordinates[:, 1], 'ko')  # Puntos originales
ax.plot(centroids[:, 0], centroids[:, 1], 'ro')  # Centroides de los clusters
plt.show()

# Imprimir los vértices de los polígonos de Voronoi
for i, region in enumerate(vor.regions):
    #if not -1 in region:
        polygon = voronoi_vertices[region]
        print(f"Cluster {i}:")
        print(polygon)

# Imprimir las concentraciones medias de cada cluster
for i, mean_conc in enumerate(mean_concentrations):
    print(f"Cluster {i} - Concentración media de NO2: {mean_conc}")