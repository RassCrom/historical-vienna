import { useEffect } from 'react'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import blanket from './assets/blanket.json'
import buildings from './assets/buildings.json'
import monuments from './assets/monuments.json'

const viennaBounds = [
  [16.18, 48.11], // Southwest coordinates (lng, lat)
  [16.58, 48.32]  // Northeast coordinates (lng, lat)
];


const MapView = ({ 
        mapRef, mapContainer, currentPalette, 
        setSelectedBuilding, filterYear, mapStyle }) => {
    useEffect(() => {
        if (mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: '/historical-vienna/style.json',
            center: [16.3638, 48.2082],
            zoom: 14,
            attributionControl: false,
            hash: true,
            renderWorldCopies: false,
            compact: false,
            maxBounds: viennaBounds
        });

        map.on('load', () => {
            map.addSource('blanket', {
                type: 'geojson',
                data: blanket
            });

            map.addLayer({
                id: 'blanket-layer',
                type: 'fill',
                source: 'blanket',
                paint: {
                    'fill-color': '#000',
                    "fill-opacity": .6,
                    "fill-outline-color": '#ccc',
                }
            })

            map.addSource('vienna-monuments', {
                type: 'geojson',
                data: monuments
            })
            
            map.addSource('vienna-buildings', {
                type: 'geojson',
                data: buildings
            })
        
            // map.addSource('vienna-monuments', {
            //     type: 'vector',
            //     tiles: [
            //     'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/vienna-age:monuments@EPSG:900913@pbf/{z}/{x}/{y}.pbf'
            //     ],
            //     scheme: 'tms',
            //     minzoom: 0,
            //     maxzoom: 14
            // });

            // map.addSource('vienna-buildings', {
            //     type: 'vector',
            //     tiles: [
            //         'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/vienna-age:buildings@EPSG:900913@pbf/{z}/{x}/{y}.pbf'
            //     ],
            //     scheme: 'tms',
            //     minzoom: 0,
            //     maxzoom: 14
            // });

            map.addLayer({
                id: 'vienna-buildings-fill',
                type: 'fill',
                source: 'vienna-buildings',
                // 'source-layer': 'buildings',
                paint: {
                'fill-color': [  
                    'case',
                    ['has', 'year_i'],
                    [
                    'interpolate',
                    ['linear'],
                    ['get', 'year_i'],
                    ...currentPalette.buildingColors.flatMap(({ year, color }) => [year, color])
                    ],
                    '#ccc'
                ],
                'fill-opacity': 1
                },
                
                filter: true
            })

            map.addLayer({
                id: 'vienna-monuments-fill',
                type: 'fill',
                source: 'vienna-monuments',
                // 'source-layer': 'monuments',
                paint: {
                'fill-color': [  
                    'case',
                    ['has', 'year_i'],
                    [
                    'interpolate',
                    ['linear'],
                    ['get', 'year_i'],
                    ...currentPalette.buildingColors.flatMap(({ year, color }) => [year, color])
                    ],
                    '#ccc'
                ],
                'fill-opacity': 1
                },
                
                filter: true
            })
        })

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        const interactiveLayers = ['vienna-buildings-fill', 'vienna-monuments-fill'];

        interactiveLayers.forEach((layer) => {
            map.on('mouseenter', layer, () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', layer, () => {
                map.getCanvas().style.cursor = 'grab';
            });

            map.on('click', layer, (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                layers: [layer]
                });

                if (features.length) {
                setSelectedBuilding(features[0].properties);
                }
            });
        });

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const layers = ['vienna-buildings-fill', 'vienna-monuments-fill'];

        const applyYearBasedColoring = (layerId) => {
        if (!mapRef.current?.getLayer(layerId)) return;

        mapRef.current.setPaintProperty(
            layerId,
            'fill-color',
            [
            'case',
            ['has', 'year_i'],
            [
                'interpolate',
                ['linear'],
                ['get', 'year_i'],
                ...currentPalette.buildingColors.flatMap(({ year, color }) => [year, color])
            ],
            '#ccc'
            ]
        );
        };

        layers.forEach(applyYearBasedColoring);
    }, [mapStyle, currentPalette]);

    useEffect(() => {
        if (!mapRef.current?.getLayer('vienna-buildings-fill')) return;

        let periodFilter;

        switch (filterYear) {
        case 'medieval':
            periodFilter = ['<', ['get', 'year_i'], 1500];
            break;
        case 'baroque':
            periodFilter = ['all',
            ['>=', ['get', 'year_i'], 1600],
            ['<=', ['get', 'year_i'], 1750]
            ];
            break;
        case 'modern':
            periodFilter = ['>=', ['get', 'year_i'], 1850];
            break;
        default:
            periodFilter = true;
        }

        mapRef.current.setFilter('vienna-buildings-fill', periodFilter);
        mapRef.current.setFilter('vienna-monuments-fill', periodFilter);

        console.log(periodFilter)

    }, [filterYear]);

  return (
    <>
      
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}
      >
      </div>
    </>
  );
};

export default MapView;