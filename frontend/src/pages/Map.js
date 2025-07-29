import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Map() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [error, setError] = useState('');
  const geoapifyKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
  console.log(geoapifyKey)

    // Fetch and show map when ZIP changes
    const handleSubmit = async (e) => {
    e.preventDefault();
    const inputZip = e.target.elements.zipcode.value;

    if (!geoapifyKey) {
        setError("Geoapify API key is missing.");
        return;
    }

    try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${inputZip}&apiKey=${geoapifyKey}`);
        const data = await response.json();

        if (data.features.length === 0) {
        setError("Invalid ZIP code or no location found.");
        return;
        }

        const { lat, lon } = data.features[0].properties;

        // Initialize or update map
        if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
        } else {
        mapRef.current.setView([lat, lon], 13);

        // Clear old markers
        mapRef.current.eachLayer(layer => {
            if (layer instanceof L.Marker) mapRef.current.removeLayer(layer);
        });
        }

        // Search for grocery stores
        const storeResp = await fetch(`https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=circle:${lon},${lat},5000&limit=10&apiKey=${geoapifyKey}`);
        const storeData = await storeResp.json();

        if (storeData.features.length === 0) {
        setError("No grocery stores found nearby.");
        return;
        }

        setError(""); // Clear error

        storeData.features.forEach(store => {
        const coords = store.geometry.coordinates;
        const name = store.properties.name || "Unnamed Store";
        const address = store.properties.formatted;

        L.marker([coords[1], coords[0]])
            .addTo(mapRef.current)
            .bindPopup(`<b>${name}</b><br>${address}`);
        });

    } catch (err) {
        setError("An error occurred while loading the map.");
        console.error(err);
    }
    };


    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vh',
        margin: '0 auto'
    }}>
       <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
        <label htmlFor="zipcode">Enter ZIP code: </label>
        <input id="zipcode" name="zipcode" type="text" required pattern="\d{5}" />
        <button type="submit">Search</button>
      </form>

      {error && <div style={{ padding: '10px', color: 'red' }}>{error}</div>}

      <div ref={mapContainerRef} style={{ flex: 1 }} />
    </div>
    );
    }
