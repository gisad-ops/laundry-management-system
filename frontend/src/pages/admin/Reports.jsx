import { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";

export default function Reports() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { getOrders().then(setOrders); }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const claimed = orders.filter((o) => o.orderStatus === "Claimed").length;
  const pending = orders.filter((o) =>
    ["Received", "Washing", "Drying", "Folding"].includes(o.orderStatus)
  ).length;

  return (
    <div>
      <h1>Reports</h1>
      <div className="stat-grid">
        <div className="stat-card"><h3>₱{totalSales}</h3><p>Total Sales</p></div>
        <div className="stat-card"><h3>{claimed}</h3><p>Claimed Orders</p></div>
        <div className="stat-card"><h3>{pending}</h3><p>Pending Orders</p></div>
        <div className="stat-card"><h3>{orders.length}</h3><p>Total Orders</p></div>
      </div>
    </div>
  );
}