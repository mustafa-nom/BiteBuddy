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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);

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
    <div className="map-container">
    <div className="map-header">
      <h1>Find Grocery Stores</h1>
      <p>Enter your ZIP code to find nearby grocery stores</p>
    </div>

    <form onSubmit={handleSubmit} className="map-search-form">
      <input 
        className="map-search-input"
        id="zipcode" 
        name="zipcode" 
        type="text" 
        placeholder="Enter your ZIP code (e.g., 10001)"
        required 
        pattern="\d{5}" 
      />
      <button 
        className="map-search-btn" 
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <svg className="map-spinner" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
        ) : (
          '📌'
        )}
      </button>
    </form>

    {error && <div className="map-error">{error}</div>}

    {!error && !mapRef.current && (
      <div className="map-placeholder">
        <p>Enter a ZIP code above to find grocery stores in your area!</p>
      </div>
    )}

    <div ref={mapContainerRef} className="map-display" />
  </div>
);
    }
