import { useNavigate, Outlet, useLocation } from "react-router-dom";
import SidenavLayout from "../../components/SidenavLayout";

const UserMenuPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const view = location.pathname;

  return (
    <SidenavLayout
      items={[
        {
          label: "Perfil",
          onClick: () => {
            navigate("/profile");
          },
          active: view === "/profile",
        },
        {
          label: "Mis pedidos",
          onClick: () => {
            navigate("/profile/orders");
          },
          active: view.startsWith("/profile/orders"),
        },
        {
          label: "Mis mascotas",
          onClick: () => {
            navigate("/profile/pets");
          },
          active: view.startsWith("/profile/pets"),
        },
      ]}
    >
      <Outlet />
    </SidenavLayout>
  );
};

export default UserMenuPage;
