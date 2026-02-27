import React from "react";
import ServiceMap from "./ServiceMap";

function Home() {
  return (
    <div>
      <h1 className="mb-4 text-primary">Services in Your Neighborhood</h1>

      <ServiceMap />
    </div>
  );
}

export default Home;
