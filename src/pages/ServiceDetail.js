import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/services/${id}`)
      .then((res) => res.json())
      .then((data) => setService(data));
  }, [id]);

  const handleExchange = () => {
    fetch(`http://localhost:3000/exchanges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: service.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          alert(data.errors.join("\n"));
        } else {
          alert("Échange proposé avec succès !");
        }
      });
  };

  if (!service) return <div>Loading...</div>;

  return (
    <div>
      <h2>{service.title}</h2>
      <p>{service.description}</p>
      <p>Type: {service.service_type === "offer" ? "Offer" : "Need"}</p>
      <p>Address: {service.address || "Non renseignée"}</p>
      <p>Status: {service.status}</p>

      {service.user &&
        service.user.id !== 1 && ( // pas proposer sur son propre service
          <button onClick={handleExchange}>Proposer un échange</button>
        )}
    </div>
  );
}
export default ServiceDetail;
