import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import TrackLaundry from "./pages/public/TrackLaundry";
import Login from "./pages/public/Login";

// Admin/Staff Pages
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import ServicesAdmin from "./pages/admin/Services";
import Payments from "./pages/admin/Payments";
import Reports from "./pages/admin/Reports";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/track" element={<TrackLaundry />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ============ ADMIN / STAFF PROTECTED ROUTES ============ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Accessible by BOTH Admin and Staff */}
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />

        {/* ADMIN ONLY ROUTES */}
        <Route
          path="services"
          element={
            <AdminRoute>
              <ServicesAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />
      </Route>

      {/* ============ FALLBACK / 404 ============ */}
      {/* Kung may hindi kilalang URL, ibalik sa Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}