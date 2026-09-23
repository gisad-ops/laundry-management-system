import { useEffect, useState } from "react";
import { getServices } from "../../services/serviceService";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  return (
    <div>
      <h1>Our Services</h1>
      <ul className="service-list">
        {services.map((s) => (
          <li key={s._id}>
            <strong>{s.serviceName}</strong> — ₱{s.price} / {s.unit}
            <p>{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}