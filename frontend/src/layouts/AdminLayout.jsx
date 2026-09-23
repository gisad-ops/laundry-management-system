import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Kunin ang role ng user (default to "staff" kung wala)
  const role = user?.role || "staff";

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>LaundriTrack</h2>
        <p className="user-info">
          {user?.name} ({role.toUpperCase()})
        </p>
        <nav>
          {/* Lahat pwedeng makita ito */}
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
          <NavLink to="/admin/payments">Payments</NavLink>

          {/* ADMIN ONLY PAGES */}
          {role === "admin" && (
            <>
              <NavLink to="/admin/services">Services</NavLink>
              <NavLink to="/admin/reports">Reports</NavLink>
              {/* Pwede mo rin lagyan ng Users management dito sa future */}
            </>
          )}
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}