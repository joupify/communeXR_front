import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Icône par défaut Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Icône custom pour offer / need
const getServiceIcon = (type) =>
  L.divIcon({
    html: `<div style="
      background-color: ${type === "offer" ? "#22c55e" : "#ef4444"};
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; border: 3px solid white;
    ">${type === "offer" ? "🤝" : "🆘"}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

export default function ServiceMap() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/services")
      .then((res) => res.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Services in Your Neighborhood</h2>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {services.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={getServiceIcon(s.service_type)}
          >
            <Popup>
              <strong>{s.title}</strong>
              <br />
              {s.description}
              <br />
              <em>{s.service_type === "offer" ? "Offer" : "Need"}</em>
              <br />
              <Link to={`/services/${s.id}`} style={{ color: "#3b82f6" }}>
                See details →
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
