import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewService() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState(0); // 0 = Offer, 1 = Need
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("⏳ Creating service...");

    try {
      const res = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: {
            title: title || "My service",
            description: description || "Description",
            category: "general",
            service_type: serviceType,
            latitude: 48.8566,
            longitude: 2.3522,
            address: "Paris",
            status: 0, // 0 = open
          },
        }),
      });

      let data;
      const text = await res.text();
      data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.errors ? data.errors.join(", ") : res.status);
      }

      console.log("✅ Service created:", data);
      setMessage("✅ Service created successfully!");
      setTimeout(() => navigate("/"), 1500); // retour à la liste
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-md-8 offset-md-2">
      <h1 className="mb-3">Create a New Service</h1>

      {message && (
        <div
          className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={serviceType}
            onChange={(e) => setServiceType(Number(e.target.value))}
            disabled={isLoading}
          >
            <option value={0}>Offer</option>
            <option value={1}>Need</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "⏳ Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default NewService;
