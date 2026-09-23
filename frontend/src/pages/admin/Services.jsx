import { useEffect, useState } from "react";
import { getServices, createService, updateService } from "../../services/serviceService";

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ serviceName: "", description: "", price: 0, unit: "kg" });

  const load = () => getServices().then(setServices);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createService(form);
    setForm({ serviceName: "", description: "", price: 0, unit: "kg" });
    load();
  };

  const toggleStatus = async (s) => {
    await updateService(s._id, { status: s.status === "active" ? "inactive" : "active" });
    load();
  };

  return (
    <div>
      <h1>Services</h1>
      <form onSubmit={handleSubmit} className="inline-form">
        <input placeholder="Service Name" value={form.serviceName}
          onChange={(e) => setForm({ ...form, serviceName: e.target.value })} required />
        <input placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
        <input placeholder="Unit" value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        <button type="submit">Add Service</button>
      </form>

      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Price</th><th>Unit</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s._id}>
              <td>{s.serviceName}</td>
              <td>₱{s.price}</td>
              <td>{s.unit}</td>
              <td>{s.status}</td>
              <td>
                <button onClick={() => toggleStatus(s)}>
                  {s.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}