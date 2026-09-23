import { useEffect, useState } from "react";
import { getOrders, createOrder, updateOrderStatus } from "../../services/orderService";
import { getCustomers, createCustomer } from "../../services/customerService";
import { getServices } from "../../services/serviceService";
import { recordPayment } from "../../services/paymentService"; // <-- Import this
import StatusBadge from "../../components/StatusBadge";

const STATUSES = ["Received", "Washing", "Drying", "Folding", "Ready for Pickup", "Claimed"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Payment Modal State
  const [payModal, setPayModal] = useState(null); // Stores the order object
  const [payAmount, setPayAmount] = useState(0);

  const [form, setForm] = useState({ customerId: "", serviceId: "", weight: 1 });
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", address: "" });

  const load = async () => {
    const [o, c, s] = await Promise.all([getOrders(), getCustomers(), getServices()]);
    setOrders(o); setCustomers(c); setServices(s);
  };

  useEffect(() => { load(); }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    const created = await createCustomer(newCustomer);
    setCustomers([created, ...customers]);
    setForm({ ...form, customerId: created._id });
    setNewCustomer({ name: "", phone: "", address: "" });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    await createOrder(form);
    setShowForm(false);
    setForm({ customerId: "", serviceId: "", weight: 1 });
    load();
  };

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  const handlePay = async (e) => {
    e.preventDefault();
    await recordPayment({
      orderId: payModal._id,
      amount: payAmount,
      paymentMethod: "Cash",
    });
    setPayModal(null);
    setPayAmount(0);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Order"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>Create Order</h2>
          <h3>New Customer</h3>
          <form onSubmit={handleCreateCustomer} className="inline-form">
            <input placeholder="Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} required />
            <input placeholder="Phone" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} required />
            <input placeholder="Address" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} />
            <button type="submit">Add Customer</button>
          </form>

          <h3>Order Details</h3>
          <form onSubmit={handleCreateOrder} className="inline-form">
            <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required>
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} required>
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.serviceName} — ₱{s.price}/{s.unit}</option>
              ))}
            </select>
            <input type="number" min="0.1" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} required />
            <button type="submit">Create Order</button>
          </form>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.orderNumber}</td>
              <td>{o.customerId?.name}</td>
              <td>₱{o.totalAmount}</td>
              <td>
                {o.paymentStatus}
                {o.paymentStatus !== "PAID" && (
                  <button 
                    style={{ marginLeft: "8px", fontSize: "0.8rem" }}
                    onClick={() => { setPayModal(o); setPayAmount(o.totalAmount); }}
                  >
                    Pay
                  </button>
                )}
              </td>
              <td><StatusBadge status={o.orderStatus} /></td>
              <td>
                <select value={o.orderStatus} onChange={(e) => handleStatus(o._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAYMENT MODAL */}
      {payModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Record Payment</h2>
            <p><strong>Order:</strong> {payModal.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₱{payModal.totalAmount}</p>
            <form onSubmit={handlePay}>
              <input 
                type="number" 
                value={payAmount} 
                onChange={(e) => setPayAmount(Number(e.target.value))} 
                required 
              />
              <div style={{ marginTop: "1rem" }}>
                <button type="submit">Confirm Payment</button>
                <button type="button" onClick={() => setPayModal(null)} style={{ marginLeft: "8px" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}