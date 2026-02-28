import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import NewService from "./pages/NewService";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <nav
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          borderBottom: "1px solid #4a4a8a",
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            {/* Logo / Brand */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "2rem" }}>🏘️</span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #a8b8ff 0%, #c4b0ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  CommuneXR
                </span>
              </div>
            </Link>

            {/* Menu pour desktop */}
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <Link to="/" style={linkStyle}>
                🗺️ Map
              </Link>
              <Link to="/new" style={linkStyle}>
                ➕ New
              </Link>
              <Link to="/dashboard" style={linkStyle}>
                📊 Dashboard
              </Link>
            </div>

            {/* Menu burger pour mobile (optionnel) */}
            <button
              className="navbar-toggler d-lg-none"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4a4a8a",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <span style={{ color: "white" }}>☰</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewService />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

// Style pour les liens
const linkStyle = {
  color: "#e0e0ff",
  textDecoration: "none",
  fontSize: "1.1rem",
  fontWeight: "500",
  padding: "8px 16px",
  borderRadius: "20px",
  transition: "all 0.3s ease",
  border: "1px solid transparent",
};

// Ajoute le CSS dans un <style> ou dans ton fichier CSS
const hoverStyle = `
  .nav-link:hover {
    background: rgba(255,255,255,0.1);
    border-color: #6a6aaa;
    transform: translateY(-2px);
    color: white !important;
  }
`;

export default App;
