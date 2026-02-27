// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/services") // ton API Rails
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Services in your neighborhood</h1>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
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
              Type: {service.service_type === 0 ? "Offer" : "Need"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <hr />
      <h2>All Services</h2>
      <ul className="list-group">
        {services.map((service) => (
          <li key={service.id} className="list-group-item">
            <strong>{service.title}</strong> - {service.description} (
            {service.service_type === 0 ? "Offer" : "Need"})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
