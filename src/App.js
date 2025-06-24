import { CartProvider } from "./context/CartContext";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/login/LoginPage";
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage";
import AddPetPage from "./pages/pets/AddPetPage";
import PetListPage from "./pages/pets/PetListPage";
import PetDetailPage from "./pages/pets/PetDetailPage";
import ErrorPage from "./pages/ErrorPage";
import RegisterPage from "./pages/login/RegisterPage";
import ResetPasswordPage from "./pages/login/ResetPasswordPage";
import UserMenuPage from "./pages/user/UserMenuPage";
import ProductListPage from "./pages/products/ProductListPage";
import Header from "./components/Header";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/user/ProfilePage";
import LegalNoticePage from "./pages/legal/LegalNoticePage";
import CookiesPolicyPage from "./pages/legal/CookiesPolicyPage";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AddProductPage from "./pages/admin/AddProductPage";
import AddCategoryPage from "./pages/admin/AddCategoryPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import EditProductPage from "./pages/admin/EditProductPage";
import EditOrderPage from "./pages/admin/EditOrderPage";
import MyOrdersPage from "./pages/orders/MyOrdersPage";
import CookiesBanner from "./components/CookiesBanner";
import WishlistPage from "./pages/wishlist/WishlistPage";
import UserOrderDetailPage from "./pages/user/UserOrderDetailPage";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    // Verifica el estado de la sesión al cargar la aplicación
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener la sesión:", error.message);
      }
      setSession(data.session);
      setLoading(false); // Finaliza la carga después de verificar la sesión
    };

    checkSession();

    // Escucha los cambios en el estado de autenticación
    const { subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Cancela la suscripción correctamente
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras se verifica la sesión
  }

  return (
    <CartProvider>
      <Header session={session} />
      <Routes>
        {/* Redirige al login si no hay sesión */}
        {!session && (
          <>
            <Route path="/pets" element={<Navigate to="/login" />} />
          </>
        )}

        {/* Rutas públicas con redirección si hay sesión */}
        {session ? (
          <>
            <Route path="/login" element={<Navigate to="/home" />} />
            <Route path="/register" element={<Navigate to="/home" />} />
            <Route path="/forgot-password" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </>
        )}

        {/* Rutas públicas sin restricciones */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:name" element={<ProductDetailPage />} />
        <Route path="/products/:category" element={<ProductListPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Rutas privadas */}
        {session && (
          <>
            <Route path="/pets/add" element={<AddPetPage />} />
            <Route path="/pets" element={<PetListPage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path="/profile" element={<UserMenuPage />} />
            <Route path="/profile/details" element={<ProfilePage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:orderId" element={<UserOrderDetailPage />} />
          </>
        )}
        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute adminOnly={true}>
              <AddProductPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-category"
          element={
            <PrivateRoute adminOnly={true}>
              <AddCategoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <PrivateRoute adminOnly={true}>
              <EditProductPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders/:id/edit"
          element={
            <PrivateRoute adminOnly={true}>
              <EditOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        {/* Ruta de error al final para que no caigan por aqui las urls */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <CookiesBanner />
      <Footer />
    </CartProvider>
  );
}

export default App;
