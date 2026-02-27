import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import NewService from "./pages/NewService";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">
            CommuneXR
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/new">
                  New Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
