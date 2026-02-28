import React, { useEffect, useState } from "react";
import ServiceMap from "./ServiceMap";

function Home() {
  const [stats, setStats] = useState({ services: 0, offers: 0, needs: 0 });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  console.log(process.env.REACT_APP_API_URL);

  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          services: data.length,
          offers: data.filter((s) => s.service_type === "offer").length,
          needs: data.filter((s) => s.service_type === "need").length,
        });
      });
  }, []);

  return (
    <div>
      <p
        style={{
          textAlign: "center",
          color: "#0f0e0eff",
          fontWeight: "500",
          fontStyle: "italic",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "15px",
          fontSize: "0.95rem",
        }}
      >
        Your neighborhood, connected — share skills, help each other, build
        community.
      </p>

      {/* Mini stats bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "20px",
          padding: "10px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div>📊 Total: {stats.services}</div>
        <div style={{ color: "#22c55e" }}>🤝 Offers: {stats.offers}</div>
        <div style={{ color: "#ef4444" }}>🆘 Needs: {stats.needs}</div>
      </div>

      <ServiceMap />
    </div>
  );
}

export default Home;
