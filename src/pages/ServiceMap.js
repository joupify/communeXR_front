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
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">${type === "offer" ? "🤝" : "🆘"}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

export default function ServiceMap() {
  const [services, setServices] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/services`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services");
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, [API_URL]);

  // Filtrer les services
  const filteredServices = services.filter((s) => {
    const serviceTypeMatch =
      filterType === "all" ||
      (s.service_type === "offer" && filterType === "0") ||
      (s.service_type === "need" && filterType === "1");

    const categoryMatch =
      filterCategory === "" ||
      (s.category &&
        s.category.toLowerCase().includes(filterCategory.toLowerCase()));

    return serviceTypeMatch && categoryMatch && s.latitude && s.longitude;
  });

  // Extraire toutes les catégories uniques pour l'autocomplete (optionnel)
  const allCategories = [
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* ✅ FILTRES AJOUTÉS ICI */}
      <div
        style={{
          padding: "20px",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Filtre par type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            <option value="all">📊 All services</option>
            <option value="0">🤝 Offers only</option>
            <option value="1">🆘 Needs only</option>
          </select>

          {/* Filtre par catégorie */}
          <input
            type="text"
            placeholder="🔍 Filter by category (e.g., Music, Tech...)"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              flex: "1",
              minWidth: "250px",
            }}
            list="categories" // Optionnel: datalist pour autocomplete
          />

          {/* Datalist pour suggestions de catégories */}
          <datalist id="categories">
            {allCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>

          {/* Compteur de résultats */}
          <span
            style={{
              padding: "8px 15px",
              background: "#f3f4f6",
              borderRadius: "20px",
              fontSize: "0.9rem",
              color: "#4b5563",
            }}
          >
            📍 {filteredServices.length} service
            {filteredServices.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Légende flottante */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "20px",
          zIndex: 1000,
          background: "white",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: "1px solid #e5e7eb",
          fontSize: "0.9rem",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              background: "#22c55e",
              borderRadius: "50%",
              marginRight: "8px",
              border: "2px solid white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          ></div>
          <span>Offer 🤝</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              background: "#ef4444",
              borderRadius: "50%",
              marginRight: "8px",
              border: "2px solid white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          ></div>
          <span>Need 🆘</span>
        </div>
      </div>

      {/* Carte */}
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredServices.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={getServiceIcon(s.service_type)}
          >
            <Popup>
              <div style={{ minWidth: "200px", padding: "5px" }}>
                <strong style={{ fontSize: "1.1em" }}>{s.title}</strong>
                <br />
                <span style={{ color: "#666", fontSize: "0.9em" }}>
                  {s.description.length > 100
                    ? s.description.substring(0, 100) + "..."
                    : s.description}
                </span>
                <br />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      background:
                        s.service_type === "offer" ? "#d4edda" : "#f8d7da",
                      color: s.service_type === "offer" ? "#155724" : "#721c24",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8em",
                    }}
                  >
                    {s.service_type === "offer" ? "🤝 Offer" : "🆘 Need"}
                  </span>
                  <span style={{ fontSize: "0.8em", color: "#6c757d" }}>
                    {s.category}
                  </span>
                </div>
                <Link
                  to={`/services/${s.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "10px",
                    padding: "5px",
                    background: "#3b82f6",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "0.9em",
                  }}
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
