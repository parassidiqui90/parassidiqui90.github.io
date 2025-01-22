function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

function searchFlights(event) {
    event.preventDefault();
    
    // Get form values
    const from = document.getElementById('flight-from').value;
    const to = document.getElementById('flight-to').value;
    const departure = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    
    // Convert city names to airport codes (you might want to use a more comprehensive airport database)
    const airports = {
        'New York': 'JFK',
        'London': 'LHR',
        'Dubai': 'DXB',
        'Tokyo': 'HND',
        'Paris': 'CDG',
        'Singapore': 'SIN',
        'Sydney': 'SYD',
        'Los Angeles': 'LAX',
        'Hong Kong': 'HKG',
        'Rome': 'FCO'
    };
    
    // Get airport codes (if available) or use city names
    const fromCode = airports[from] || from;
    const toCode = airports[to] || to;
    
    // Construct Google Flights URL
    let googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights%20from%20${encodeURIComponent(fromCode)}%20to%20${encodeURIComponent(toCode)}`;
    
    // Add dates if provided
    if (departure) {
        const formattedDeparture = formatDate(departure);
        googleFlightsUrl += `%20on%20${encodeURIComponent(formattedDeparture)}`;
    }
    
    if (returnDate) {
        const formattedReturn = formatDate(returnDate);
        googleFlightsUrl += `%20returning%20${encodeURIComponent(formattedReturn)}`;
    }
    
    // Open Google Flights in a new tab
    window.open(googleFlightsUrl, '_blank');
}
