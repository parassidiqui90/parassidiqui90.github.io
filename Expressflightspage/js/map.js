// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map centered on Sydney
    const map = L.map('map').setView([-33.8688, 151.2093], 3);

    // Add the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Flight routes data (from Sydney to major cities)
    const routes = [
        { to: "Dubai", coords: [25.2048, 55.2708] },
        { to: "London", coords: [51.5074, -0.1278] },
        { to: "New York", coords: [40.7128, -74.0060] },
        { to: "Tokyo", coords: [35.6762, 139.6503] },
        { to: "Singapore", coords: [1.3521, 103.8198] },
        { to: "Paris", coords: [48.8566, 2.3522] },
        { to: "Los Angeles", coords: [34.0522, -118.2437] }
    ];

    // Sydney coordinates
    const sydney = [-33.8688, 151.2093];

    // Add Sydney marker with custom icon
    const airportIcon = L.divIcon({
        html: '<i class="fas fa-plane-arrival" style="color: #007bff; font-size: 24px;"></i>',
        className: 'airport-icon'
    });

    L.marker(sydney, { icon: airportIcon })
        .bindPopup('<strong>Sydney International Airport</strong><br>Main Hub')
        .addTo(map);

    // Create flight routes
    routes.forEach(route => {
        // Add destination marker
        L.marker(route.coords, { icon: airportIcon })
            .bindPopup(`<strong>${route.to} International Airport</strong>`)
            .addTo(map);

        // Calculate intermediate points for curved line
        const points = [];
        const segments = 100;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            // Create a slight curve by adjusting the midpoint
            const lat = sydney[0] + (route.coords[0] - sydney[0]) * t;
            const lng = sydney[1] + (route.coords[1] - sydney[1]) * t;
            // Add altitude curve
            const alt = Math.sin(t * Math.PI) * 20; // Max curve of 20 degrees
            points.push([lat + alt * 0.1, lng]);
        }

        // Draw flight path
        const path = L.polyline(points, {
            color: '#007bff',
            weight: 2,
            opacity: 0.6,
            className: 'flight-path'
        }).addTo(map);

        // Add plane icon
        const planeIcon = L.divIcon({
            html: '<i class="fas fa-plane" style="color: #007bff; font-size: 16px;"></i>',
            className: 'plane-icon'
        });

        // Create plane marker
        const plane = L.marker([0, 0], { icon: planeIcon }).addTo(map);

        // Animation function
        function animatePlane() {
            let start = null;
            const duration = 10000; // 10 seconds for one trip

            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;

                if (progress >= 1) {
                    setTimeout(() => {
                        start = null;
                        requestAnimationFrame(animate);
                    }, 1000);
                    return;
                }

                const currentIndex = Math.floor(progress * points.length);
                if (points[currentIndex]) {
                    plane.setLatLng(points[currentIndex]);
                    
                    // Rotate plane icon based on path direction
                    if (currentIndex > 0) {
                        const dx = points[currentIndex][1] - points[currentIndex - 1][1];
                        const dy = points[currentIndex][0] - points[currentIndex - 1][0];
                        const rotation = Math.atan2(dx, dy) * (180 / Math.PI);
                        plane.getElement().querySelector('i').style.transform = `rotate(${rotation}deg)`;
                    }
                }

                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        }

        // Start animation
        animatePlane();
    });
});
