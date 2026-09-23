import { useEffect, useState } from "react";
import {
  getCustomers, createCustomer, updateCustomer, deleteCustomer,
} from "../../services/customerService";
import SearchBar from "../../components/SearchBar";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "" });

  const load = () => getCustomers(search).then(setCustomers);

  useEffect(() => { load(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCustomer(form);
    setForm({ name: "", phone: "", address: "", email: "" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;
    await deleteCustomer(id);
    load();
  };

  return (
    <div>
      <h1>Customers</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone" />

      <form onSubmit={handleSubmit} className="inline-form">
        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input placeholder="Address" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit">Add Customer</button>
      </form>

      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Phone</th><th>Address</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}