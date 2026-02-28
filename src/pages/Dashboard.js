import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myServices, setMyServices] = useState([]);
  const [myExchanges, setMyExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ AJOUTE LES COULEURS ICI - APRÈS LES useState, AVANT LE useEffect
  const statusColors = {
    proposed: { bg: "#fff3cd", color: "#856404" },
    accepted: { bg: "#d4edda", color: "#155724" },
    completed: { bg: "#d1ecf1", color: "#0c5460" },
    rejected: { bg: "#f8d7da", color: "#721c24" },
  };

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/users/1").then((res) => res.json()),
      fetch("http://localhost:3000/users/1/services").then((res) => res.json()),
      fetch("http://localhost:3000/users/1/exchanges").then((res) =>
        res.json(),
      ),
    ])
      .then(([userData, servicesData, exchangesData]) => {
        setUser(userData);
        setMyServices(servicesData);
        setMyExchanges(exchangesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateExchangeStatus = (exchangeId, newStatus) => {
    fetch(`http://localhost:3000/exchanges/${exchangeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedExchange) => {
        setMyExchanges(
          myExchanges.map((ex) =>
            ex.id === updatedExchange.id ? updatedExchange : ex,
          ),
        );
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;

  return (
    <div
      className="container"
      style={{ maxWidth: "800px", margin: "40px auto" }}
    >
      <h1>My Dashboard</h1>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#e3f2fd",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2em" }}>⭐</div>
          <h3>{user.points || 0}</h3>
          <p>Points</p>
        </div>
        <div
          style={{
            background: "#e8f5e8",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2em" }}>📦</div>
          <h3>{myServices.length}</h3>
          <p>Services</p>
        </div>
        <div
          style={{
            background: "#fff3e0",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2em" }}>🤝</div>
          <h3>{myExchanges.length}</h3>
          <p>My Exchanges</p>
        </div>
      </div>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h2>My Badges 🏆</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                style={{
                  background: "#f8f9fa",
                  padding: "10px 15px",
                  borderRadius: "25px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #dee2e6",
                }}
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Services */}
      <div style={{ marginBottom: "30px" }}>
        <h2>My Services</h2>
        {myServices.length === 0 ? (
          <p>No services yet</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {myServices.map((service) => (
              <div
                key={service.id}
                style={{
                  padding: "15px",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  background: "white",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link
                    to={`/services/${service.id}`}
                    style={{ fontWeight: "bold", color: "#0066cc" }}
                  >
                    {service.title}
                  </Link>
                  <span
                    style={{
                      background:
                        service.service_type === "offer"
                          ? "#d4edda"
                          : "#f8d7da",
                      color:
                        service.service_type === "offer"
                          ? "#155724"
                          : "#721c24",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "0.85em",
                    }}
                  >
                    {service.service_type === "offer" ? "Offer" : "Need"}
                  </span>
                </div>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#666",
                    fontSize: "0.9em",
                  }}
                >
                  {service.description?.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Exchanges */}
      <div>
        <h2>My Exchanges</h2>
        {myExchanges.length === 0 ? (
          <p>No exchanges yet</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {myExchanges.map((exchange) => (
              <div
                key={exchange.id}
                style={{
                  padding: "15px",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  background: "#f8f9fa",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link to={`/services/${exchange.service?.id}`}>
                    <strong>{exchange.service?.title}</strong>
                  </Link>
                  {/* ✅ UTILISATION DES COULEURS ICI */}
                  <span
                    style={{
                      background:
                        statusColors[exchange.status]?.bg || "#e9ecef",
                      color: statusColors[exchange.status]?.color || "#495057",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "0.85em",
                    }}
                  >
                    {exchange.status}
                  </span>
                </div>

                <p style={{ margin: "8px 0", fontSize: "0.9em" }}>
                  {exchange.message}
                </p>

                <small>
                  With:{" "}
                  {exchange.helper?.id === user?.id
                    ? exchange.requester?.username
                    : exchange.helper?.username}
                </small>

                {/* Boutons de statut */}
                {exchange.status === "proposed" && (
                  <div
                    style={{ marginTop: "10px", display: "flex", gap: "10px" }}
                  >
                    <button
                      onClick={() =>
                        updateExchangeStatus(exchange.id, "accepted")
                      }
                      style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "5px 15px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ✅ Accept
                    </button>
                    <button
                      onClick={() =>
                        updateExchangeStatus(exchange.id, "rejected")
                      }
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 15px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ❌ Decline
                    </button>
                  </div>
                )}

                {exchange.status === "accepted" && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() =>
                        updateExchangeStatus(exchange.id, "completed")
                      }
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "5px 15px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ✅ Mark as completed
                    </button>
                  </div>
                )}

                {exchange.status === "completed" && (
                  <div style={{ marginTop: "10px", color: "#28a745" }}>
                    ✓ Exchange completed - +10 points
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
