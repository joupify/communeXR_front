import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [message, setMessage] = useState("");
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération du service et des échanges
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/services/${id}?include=exchanges`)
      .then((res) => res.json())
      .then((data) => {
        setService(data.service || data);
        setExchanges(data.exchanges || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!service) return <div>Service introuvable</div>;

  const handleSendMessage = () => {
    if (!message.trim()) return alert("Écrivez un message avant d'envoyer.");

    fetch(`http://localhost:3000/exchanges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: service.id,
        message: message.trim(),
        requester_id: 1, // utilisateur connecté
        helper_id: service.user.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          alert(data.errors.join("\n"));
        } else {
          setExchanges([...exchanges, data]); // ajouter le nouvel échange
          setMessage(""); // vider le champ
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>{service.title}</h2>
      <p>{service.description}</p>
      <p>
        <strong>Type:</strong>{" "}
        {service.service_type === "offer" ? "Offer" : "Need"}
      </p>
      <p>
        <strong>Address:</strong> {service.address || "Non renseignée"}
      </p>
      <p>
        <strong>Status:</strong> {service.status}
      </p>

      {/* 🏆 SECTION BADGES - AJOUTÉE ICI */}
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
              🏆 Badges de {service.user.username}
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

      {service.user ? (
        <div style={{ marginTop: "20px" }}>
          <h4>Écrire un message au créateur du service</h4>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message..."
            style={{ width: "100%", minHeight: "80px", marginBottom: "10px" }}
          />
          <button onClick={handleSendMessage}>Envoyer et proposer</button>

          <h5 style={{ marginTop: "30px" }}>Messages envoyés / échanges</h5>
          {exchanges.length === 0 && <p>Aucun message pour l'instant.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {exchanges.map((exch) => (
              <li
                key={exch.id}
                style={{
                  background: "#f3f4f6",
                  marginBottom: "8px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>De:</strong> {exch.requester?.username || "Anonyme"}
                </p>
                <p style={{ margin: "5px 0 0 0" }}>{exch.message}</p>
                <small>Status: {exch.status}</small>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Utilisateur non disponible pour ce service.</p>
      )}
    </div>
  );
}
