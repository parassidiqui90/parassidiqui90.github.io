// Initialize map
let map;
let markers = {}; // Store markers for easy access

// Airport coordinates
const airports = {
    'New York': { coords: [40.7128, -74.0060], code: 'JFK' },
    'London': { coords: [51.5074, -0.1278], code: 'LHR' },
    'Dubai': { coords: [25.2048, 55.2708], code: 'DXB' },
    'Tokyo': { coords: [35.6762, 139.6503], code: 'HND' },
    'Paris': { coords: [48.8566, 2.3522], code: 'CDG' },
    'Singapore': { coords: [1.3521, 103.8198], code: 'SIN' },
    'Sydney': { coords: [-33.8688, 151.2093], code: 'SYD' },
    'Los Angeles': { coords: [34.0522, -118.2437], code: 'LAX' },
    'Hong Kong': { coords: [22.3193, 114.1694], code: 'HKG' },
    'Rome': { coords: [41.9028, 12.4964], code: 'FCO' }
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    initializeMap();
    
    // Setup map toggle functionality
    const mapToggle = document.getElementById('mapToggle');
    const mapBackground = document.querySelector('.map-background');
    
    mapToggle.addEventListener('click', function() {
        mapBackground.classList.toggle('interactive');
        mapToggle.classList.toggle('active');
    });

    // Setup destination input listener
    const destinationInput = document.getElementById('to');
    if (destinationInput) {
        destinationInput.addEventListener('input', handleDestinationInput);
    }
});

function handleDestinationInput(event) {
    const input = event.target.value;
    
    // Reset map view if input is empty
    if (!input) {
        map.setView([20, 0], 2);
        return;
    }

    // Find matching cities
    const matchingCities = Object.keys(airports).filter(city => 
        city.toLowerCase().includes(input.toLowerCase())
    );

    if (matchingCities.length > 0) {
        const city = matchingCities[0]; // Get the first match
        const coords = airports[city].coords;
        
        // Zoom to the city
        map.setView(coords, 5, {
            animate: true,
            duration: 1
        });

        // Highlight the marker
        if (markers[city]) {
            markers[city].openPopup();
        }
    }
}

function initializeMap() {
    // Create the map centered on a world view
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: false // Hide zoom controls initially
    });

    // Add the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap contributors'
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Add markers for all airports
    Object.entries(airports).forEach(([city, data]) => {
        const airportIcon = L.divIcon({
            html: '<i class="fas fa-plane-arrival" style="color: #007bff; font-size: 24px;"></i>',
            className: 'airport-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker(data.coords, { icon: airportIcon })
            .bindPopup(`<strong>${city} (${data.code})</strong><br>International Airport`)
            .addTo(map);
        
        // Store marker reference
        markers[city] = marker;
    });

    // Draw flight paths between major hubs
    drawFlightPaths();
}

function drawFlightPaths() {
    const sydneyAirport = airports['Sydney'].coords;
    
    // Draw paths from Sydney to other major hubs
    ['Singapore', 'Dubai', 'London', 'Los Angeles'].forEach(destination => {
        const destCoords = airports[destination].coords;
        drawAnimatedPath(sydneyAirport, destCoords);
    });
}

function drawAnimatedPath(start, end) {
    // Create curved path
    const points = [];
    const segments = 100;
    
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        const alt = Math.sin(t * Math.PI) * 20; // Max curve of 20 degrees
        points.push([lat + alt * 0.1, lng]);
    }

    // Draw the path
    const path = L.polyline(points, {
        color: '#007bff',
        weight: 2,
        opacity: 0.6,
        className: 'flight-path'
    }).addTo(map);

    // Add animated plane
    const planeIcon = L.divIcon({
        html: '<i class="fas fa-plane" style="color: #007bff; font-size: 16px;"></i>',
        className: 'plane-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

    const plane = L.marker([0, 0], { icon: planeIcon }).addTo(map);
    animatePlane(plane, points);
}

function animatePlane(plane, points) {
    let step = 0;
    const numSteps = points.length;
    
    function animate() {
        // Update plane position
        if (points[step]) {
            plane.setLatLng(points[step]);
            
            // Rotate plane icon
            if (step > 0) {
                const dx = points[step][1] - points[step - 1][1];
                const dy = points[step][0] - points[step - 1][0];
                const rotation = Math.atan2(dx, dy) * (180 / Math.PI);
                plane.getElement().querySelector('i').style.transform = `rotate(${rotation}deg)`;
            }
        }
        
        step = (step + 1) % numSteps;
        requestAnimationFrame(animate);
    }
    
    animate();
}
