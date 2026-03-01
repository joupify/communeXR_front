import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewService() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [serviceType, setServiceType] = useState(0); // 0 = Offer, 1 = Need
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  // Catégories suggestions
  const categorySuggestions = [
    "Music",
    "Technology",
    "Pets",
    "Moving",
    "Language",
    "Repair",
    "Wellness",
    "Event",
    "Family",
    "Education",
    "Gardening",
    "Cooking",
    "Sports",
    "Art",
    "Tools",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "⏳ Creating your service...", type: "info" });

    // Validation
    if (!category.trim()) {
      setMessage({ text: "❌ Please select a category", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          service: {
            title: title || "My service",
            description: description || "Description",
            category: category,
            service_type: serviceType,
            latitude: 48.8566,
            longitude: 2.3522,
            address: address || "Paris",
            status: 0, // 0 = open
          },
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(
          data.errors ? data.errors.join(", ") : `Error ${res.status}`,
        );
      }

      console.log("✅ Service created:", data);
      setMessage({
        text: "✅ Service created successfully! Redirecting...",
        type: "success",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage({ text: `❌ Error: ${err.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      {/* En-tête avec dégradé */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "12px 12px 0 0",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>
          {serviceType === 0 ? "🤝 Create an Offer" : "🆘 Create a Need"}
        </h1>
        <p style={{ margin: "10px 0 0", opacity: 0.9 }}>
          Share your skills or ask for help in your neighborhood
        </p>
      </div>

      {/* Form */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid #e9ecef",
        }}
      >
        {/* Alert message */}
        {message.text && (
          <div
            style={{
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              background:
                message.type === "success"
                  ? "#d4edda"
                  : message.type === "error"
                    ? "#f8d7da"
                    : "#fff3cd",
              color:
                message.type === "success"
                  ? "#155724"
                  : message.type === "error"
                    ? "#721c24"
                    : "#856404",
              border: `1px solid ${
                message.type === "success"
                  ? "#c3e6cb"
                  : message.type === "error"
                    ? "#f5c6cb"
                    : "#ffeeba"
              }`,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* service (Offer/Need) with visual toggle */}
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
              What kind of service?
            </label>
            <div
              style={{
                display: "flex",
                gap: "10px",
                background: "#f8f9fa",
                padding: "5px",
                borderRadius: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setServiceType(0)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: serviceType === 0 ? "#22c55e" : "transparent",
                  color: serviceType === 0 ? "white" : "#6c757d",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                🤝 Offer Help
              </button>
              <button
                type="button"
                onClick={() => setServiceType(1)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: serviceType === 1 ? "#ef4444" : "transparent",
                  color: serviceType === 1 ? "white" : "#6c757d",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                🆘 Request Help
              </button>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Guitar lessons for beginners"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
                transition: "border-color 0.3s",
                outline: "none",
                ...(isLoading && {
                  background: "#e9ecef",
                  cursor: "not-allowed",
                }),
              }}
              onFocus={(e) =>
                (e.target.style.borderColor =
                  serviceType === 0 ? "#22c55e" : "#ef4444")
              }
              onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you offer or need..."
              rows="4"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                ...(isLoading && {
                  background: "#e9ecef",
                  cursor: "not-allowed",
                }),
              }}
              onFocus={(e) =>
                (e.target.style.borderColor =
                  serviceType === 0 ? "#22c55e" : "#ef4444")
              }
              onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            />
          </div>

          {/* ✅ CATEGORY ADDED WITH DATALIST */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
              Category *
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Select or type a category (e.g., Music, Tech, Event)"
              list="category-suggestions"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
                outline: "none",
                ...(isLoading && {
                  background: "#e9ecef",
                  cursor: "not-allowed",
                }),
              }}
              onFocus={(e) =>
                (e.target.style.borderColor =
                  serviceType === 0 ? "#22c55e" : "#ef4444")
              }
              onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            />
            <datalist id="category-suggestions">
              {categorySuggestions.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            <small
              style={{ color: "#6c757d", marginTop: "5px", display: "block" }}
            >
              🔍 Choose from suggested categories or type your own
            </small>
          </div>

          {/* Address */}
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., Paris (will be geocoded automatically)"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
                outline: "none",
                ...(isLoading && {
                  background: "#e9ecef",
                  cursor: "not-allowed",
                }),
              }}
            />
          </div>

          {/* Button submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              background:
                serviceType === 0
                  ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                  : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "transform 0.2s, opacity 0.2s",
              transform: isLoading ? "none" : "scale(1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) =>
              !isLoading && (e.target.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) =>
              !isLoading && (e.target.style.transform = "scale(1)")
            }
          >
            {isLoading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating...
              </span>
            ) : serviceType === 0 ? (
              "🤝 Create Offer"
            ) : (
              "🆘 Create Need"
            )}
          </button>

          {/* back button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <a
              href="/"
              style={{
                color: "#6c757d",
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#3b82f6")}
              onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
            >
              ← Back to map
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewService;
