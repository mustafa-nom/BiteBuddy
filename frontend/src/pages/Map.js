// src/components/Map.js
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ONLY SEARCHES FOR STORES AROUND MY ZIPCODE, GOING TO IMPLEMENT USER INPUTTING ONE

export default function Map({ zip = '75094'}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [error, setError] = useState(`Loading grocery stores near ZIP code: ${zip}...`);
  const geoapifyKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
  console.log(geoapifyKey)
  useEffect(() => {
    if (!geoapifyKey) {
      setError("Geoapify API key is missing.");
      return;
    }

    // Initialize the map
    mapRef.current = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 4);
    // Fix default icon path so it loads correctly in React
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
    });
    // Add tile layer
    L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`, {
      attribution: '© OpenMapTiles © OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapRef.current);

    // Fetch store data
    fetch(`http://localhost:5000/map/find-stores?zip=${zip}`)
      .then(response => {
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (!data.features || data.features.length === 0) {
          setError('No grocery stores found near this ZIP code.');
          return;
        }

        setError(''); // Clear loading message

        data.features.forEach(store => {
          const [lng, lat] = store.geometry.coordinates;
          const props = store.properties;
          const name = props.name || 'Unnamed Store';
          const address = props.formatted || 'No address available';

          L.marker([lat, lng])
            .addTo(mapRef.current)
            .bindPopup(`<b>${name}</b><br>${address}`);
        });

        // Zoom into the first store
        const [lng, lat] = data.features[0].geometry.coordinates;
        mapRef.current.setView([lat, lng], 13);
      })
      .catch(err => {
        setError(`Error loading grocery stores: ${err.message}`);
        console.error(err);
      });

    // Clean up map on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [zip, geoapifyKey]);

  return (
    <div style={{
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vh',
    margin: '0 auto'
  }}>
      <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Nearby Grocery Stores</h1>
      {error && <div style={{ color: 'red', textAlign: 'center', margin: '10px' }}>{error}</div>}
      <div ref={mapContainerRef} style={{ flexGrow: 1 }} id="map"></div>
    </div>
  );
}
