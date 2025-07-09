import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SidenavLayout from "../../components/SidenavLayout";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current view from pathname
  const currentPath = location.pathname;

  return (
    <SidenavLayout
      items={[
        {
          label: "Pedidos",
          onClick: () => navigate("/admin"),
          active: currentPath === "/admin",
        },
        {
          label: "Productos",
          onClick: () => navigate("/admin/products"),
          active: currentPath.startsWith("/admin/products"),
        },
        {
          label: "Descuentos",
          onClick: () => navigate("/admin/discounts"),
          active: currentPath.startsWith("/admin/discounts"),
        },
        {
          label: "Envíos",
          onClick: () => navigate("/admin/shippings"),
          active: currentPath.startsWith("/admin/shippings"),
        },
        {
          label: "Categorías",
          onClick: () => navigate("/admin/categories"),
          active: currentPath.startsWith("/admin/categories"),
        },
        {
          label: "Personalizaciones",
          onClick: () => navigate("/admin/customizations"),
          active: currentPath.startsWith("/admin/customizations"),
        },
      ]}
    >
      <Outlet />
    </SidenavLayout>
  );
};

export default AdminDashboardPage;
