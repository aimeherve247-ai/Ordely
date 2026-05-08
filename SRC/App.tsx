import { Routes, Route } from "react-router";
import { BusinessProvider } from "@/context/BusinessContext";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import SuperAdminPage from "./pages/SuperAdminPage";
import DashboardLayout from "./components/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import OrdersPage from "./pages/OrdersPage";
import InventoryPage from "./pages/InventoryPage";
import StaffPage from "./pages/StaffPage";
import ConfigPage from "./pages/ConfigPage";
import ClientMenuPage from "./pages/ClientMenuPage";

export default function App() {
  return (
    <BusinessProvider>
      <Routes>
        {/* Public Home - The Canteen landing */}
        <Route path="/" element={<HomePage />} />

        {/* Super Admin */}
        <Route path="/admin" element={<SuperAdminPage />} />

        {/* Business-facing routes with slug */}
        <Route path="/:slug" element={<HomePage />} />
        <Route path="/:slug/menu" element={<ClientMenuPage />} />

        {/* Dashboard Manager per business */}
        <Route path="/:slug/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="config" element={<ConfigPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BusinessProvider>
  );
}
