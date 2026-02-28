import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [message, setMessage] = useState("");
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  // Récupération du service et des échanges
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/services/${id}?include=exchanges`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setService(data.service || data);
        setExchanges(data.exchanges || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching service:", err);
        setLoading(false);
      });
  }, [id, API_URL]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (!service)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Service not found</h3>
        <a href="/" className="btn btn-primary mt-3">
          Back to map
        </a>
      </div>
    );

  const handleSendMessage = () => {
    if (!message.trim()) return alert("Please write a message before sending!");

    fetch(`${API_URL}/exchanges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        service_id: service.id,
        message: message.trim(),
        requester_id: 1, // utilisateur connecté (DemoUser)
        helper_id: service.user.id,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.errors?.join(", ") || "Error creating exchange");
        return data;
      })
      .then((data) => {
        setExchanges([data, ...exchanges]); // ajouter le nouvel échange en haut
        setMessage(""); // vider le champ
        alert("✅ Message sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        alert("❌ Error: " + err.message);
      });
  };

  // Couleurs pour les statuts
  const statusColors = {
    proposed: { bg: "#fff3cd", color: "#856404" },
    accepted: { bg: "#d4edda", color: "#155724" },
    completed: { bg: "#d1ecf1", color: "#0c5460" },
    rejected: { bg: "#f8d7da", color: "#721c24" },
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      {/* En-tête avec type */}
      <div
        style={{
          background: service.service_type === "offer" ? "#22c55e" : "#ef4444",
          color: "white",
          padding: "15px 20px",
          borderRadius: "10px 10px 0 0",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {service.service_type === "offer" ? "🤝 Offer" : "🆘 Need"}
        </h2>
      </div>

      {/* Contenu principal */}
      <div style={{ padding: "0 10px" }}>
        <h3>{service.title}</h3>
        <p style={{ fontSize: "1.1em", lineHeight: "1.6", color: "#333" }}>
          {service.description}
        </p>

        {/* Informations détaillées */}
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        >
          <p>
            <strong>📍 Address:</strong> {service.address || "Not specified"}
          </p>
          <p>
            <strong>📁 Category:</strong> {service.category}
          </p>
          <p>
            <strong>📊 Status:</strong>
            <span
              style={{
                background:
                  service.status === "open"
                    ? "#d4edda"
                    : service.status === "in_progress"
                      ? "#fff3cd"
                      : "#f8d7da",
                color:
                  service.status === "open"
                    ? "#155724"
                    : service.status === "in_progress"
                      ? "#856404"
                      : "#721c24",
                padding: "3px 8px",
                borderRadius: "12px",
                marginLeft: "8px",
              }}
            >
              {service.status}
            </span>
          </p>
        </div>

        {/* 🏆 SECTION BADGES */}
        {service.user &&
          service.user.badges &&
          service.user.badges.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🏆 {service.user.username}'s Badges
              </h4>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {service.user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    style={{
                      background: "white",
                      padding: "8px 12px",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      border: "1px solid #dee2e6",
                      cursor: "help",
                    }}
                    title={badge.description}
                  >
                    <span style={{ fontSize: "1.2em" }}>{badge.icon}</span>
                    <span style={{ fontWeight: "500" }}>{badge.name}</span>
                  </div>
                ))}
              </div>
              {service.user.points > 0 && (
                <p
                  style={{
                    margin: "10px 0 0 0",
                    color: "#6c757d",
                    fontSize: "0.9em",
                  }}
                >
                  ⭐ {service.user.points} points
                </p>
              )}
            </div>
          )}

        {/* Formulaire de message */}
        {service.user ? (
          <div style={{ marginTop: "30px" }}>
            <h4>💬 Send a message to {service.user.username}</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here... (e.g., 'Hi! I'd love to help with this!')"
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                marginBottom: "10px",
                fontSize: "1em",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1.1em",
                width: "100%",
              }}
            >
              Send Message & Propose Exchange
            </button>

            {/* Historique des échanges */}
            <h5 style={{ marginTop: "30px", marginBottom: "15px" }}>
              📋 Exchange History ({exchanges.length})
            </h5>

            {exchanges.length === 0 && (
              <p style={{ color: "#6c757d", fontStyle: "italic" }}>
                No messages yet. Be the first to propose an exchange!
              </p>
            )}

            <div style={{ display: "grid", gap: "10px" }}>
              {exchanges.map((exch) => (
                <div
                  key={exch.id}
                  style={{
                    background: statusColors[exch.status]?.bg || "#f8f9fa",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <strong>
                      From: {exch.requester?.username || "Anonymous"}
                    </strong>
                    <span
                      style={{
                        background: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.8em",
                        color: statusColors[exch.status]?.color || "#666",
                      }}
                    >
                      {exch.status}
                    </span>
                  </div>
                  <p style={{ margin: "5px 0", fontSize: "0.95em" }}>
                    {exch.message}
                  </p>
                  <small style={{ color: "#666" }}>
                    {new Date(exch.created_at).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p
            style={{ textAlign: "center", color: "#dc3545", marginTop: "20px" }}
          >
            ❌ User not available for this service.
          </p>
        )}

        {/* Bouton retour */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <a
            href="/"
            style={{
              color: "#6c757d",
              textDecoration: "none",
              fontSize: "0.95em",
            }}
          >
            ← Back to map
          </a>
        </div>
      </div>
    </div>
  );
}
