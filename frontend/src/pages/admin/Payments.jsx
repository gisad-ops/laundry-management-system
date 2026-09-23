import { useEffect, useState } from "react";
import { getPayments, recordPayment } from "../../services/paymentService";
import { getOrders } from "../../services/orderService";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ orderId: "", amount: 0, paymentMethod: "Cash" });

  const load = async () => {
    const [p, o] = await Promise.all([getPayments(), getOrders()]);
    setPayments(p); setOrders(o);
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await recordPayment(form);
    setForm({ orderId: "", amount: 0, paymentMethod: "Cash" });
    load();
  };

  return (
    <div>
      <h1>Payments</h1>
      <form onSubmit={handleSubmit} className="inline-form">
        <select value={form.orderId}
          onChange={(e) => setForm({ ...form, orderId: e.target.value })} required>
          <option value="">Select Order</option>
          {orders.map((o) => (
            <option key={o._id} value={o._id}>
              {o.orderNumber} — ₱{o.totalAmount} ({o.paymentStatus})
            </option>
          ))}
        </select>
        <input type="number" placeholder="Amount" value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required />
        <select value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
          <option>Cash</option>
          <option>GCash</option>
          <option>Bank Transfer</option>
        </select>
        <button type="submit">Record Payment</button>
      </form>

      <table className="data-table">
        <thead>
          <tr><th>Order #</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.orderId?.orderNumber}</td>
              <td>₱{p.amount}</td>
              <td>{p.paymentMethod}</td>
              <td>{p.paymentStatus}</td>
              <td>{new Date(p.paymentDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}