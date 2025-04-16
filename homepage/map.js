// Mapbox access token - Replace with your actual token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGlzYXN0ZXJhbGVydCIsImEiOiJjbHRqMnBqOWMwMDFqMnFxcGVqZnBqMnBqIn0.8J7Z9Z9Z9Z9Z9Z9Z9Z9Z9';

// Initialize map when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if map container exists
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // Initialize the map
        const map = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [0, 0],
            zoom: 1,
            projection: 'globe',
            antialias: true
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Add fullscreen control
        map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

        // Add 3D terrain and atmospheric effects
        map.on('style.load', () => {
            map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            
            // Add atmospheric effect
            map.setFog({
                color: 'rgb(186, 210, 235)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)',
                'star': true
            });
        });

        // Example disaster markers
        const disasters = [
            {
                type: 'earthquake',
                coordinates: [139.6917, 35.6895], // Tokyo
                magnitude: 5.2,
                severity: 'high'
            },
            {
                type: 'flood',
                coordinates: [-122.4194, 37.7749], // San Francisco
                magnitude: 3,
                severity: 'moderate'
            },
            {
                type: 'wildfire',
                coordinates: [151.2093, -33.8688], // Sydney
                magnitude: 4,
                severity: 'high'
            }
        ];

        // Add markers to the map
        disasters.forEach(disaster => {
            const el = document.createElement('div');
            el.className = `marker marker-${disaster.type} marker-${disaster.severity}`;
            
            new mapboxgl.Marker(el)
                .setLngLat(disaster.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`
                            <h3>${disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)}</h3>
                            <p>Magnitude: ${disaster.magnitude}</p>
                            <p>Severity: ${disaster.severity}</p>
                        `)
                )
                .addTo(map);
        });

        // Handle map control buttons
        const setupMapControls = () => {
            const controls = {
                'zoom-in': () => map.zoomIn(),
                'zoom-out': () => map.zoomOut(),
                'rotate': () => {
                    map.easeTo({
                        bearing: map.getBearing() + 90,
                        duration: 1000
                    });
                },
                'fullscreen': () => {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                }
            };

            Object.entries(controls).forEach(([action, handler]) => {
                const button = document.querySelector(`[data-action="${action}"]`);
                if (button) {
                    button.addEventListener('click', handler);
                }
            });
        };

        setupMapControls();

        // Log successful initialization
        console.log('Map initialized successfully');

    } catch (error) {
        console.error('Error initializing map:', error);
    }
}); 