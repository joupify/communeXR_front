import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Correction icône par défaut Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="mb-3">Services in Your Neighborhood</h1>

      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        className="mb-4"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {services.map((service) => (
          <Marker
            key={service.id}
            position={[service.latitude, service.longitude]}
          >
            <Popup>
              <strong>{service.title}</strong>
              <br />
              {service.description}
              <br />
              <em>{service.service_type === 0 ? "Offer" : "Need"}</em>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <h2 className="mb-3">All Services</h2>
      <ul className="list-group">
        {services.map((service) => (
          <li
            key={service.id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              <strong>{service.title}</strong> - {service.description}
            </div>
            <span
              className={`badge ${service.service_type === 0 ? "bg-success" : "bg-warning"} rounded-pill`}
            >
              {service.service_type === 0 ? "Offer" : "Need"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
