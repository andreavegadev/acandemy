import "./App.css";
import { CartProvider } from "./context/CartContext";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import CartPage from "./pages/checkout/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import LoginPage from "./pages/login/LoginPage";
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage";
import PetList from "./pages/pets/PetList";
import PetDetailPage from "./pages/pets/PetDetailPage";
import ErrorPage from "./pages/ErrorPage";
import RegisterPage from "./pages/login/RegisterPage";
import ResetPasswordPage from "./pages/login/ResetPasswordPage";
import UserMenuPage from "./pages/user/UserMenuPage";
import ProductListPage from "./pages/products/ProductListPage";
import Header from "./components/Header";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
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
import CookiesBanner from "./components/CookiesBanner";
import WishlistPage from "./pages/wishlist/WishlistPage";
import UserOrderDetailPage from "./pages/user/UserOrderDetailPage";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserMainData from "./pages/user/UserMainData";
import AdminProductsTable from "./pages/admin/AdminProductsTable";
import AdminCategoriesTable from "./pages/admin/AdminCategoriesTable";
import AdminPersonalizationTypesTable from "./pages/admin/AdminPersonalizationTypesTable";
import AdminShippingTable from "./pages/admin/AdminShippingTable";
import AdminOrdersTable from "./pages/admin/AdminOrdersTable";
import AdminDiscountsTable from "./pages/admin/AdminDiscountsTable";
import EditCustomizationTypePage from "./pages/admin/EditCustomizationTypePage";
import EditCategoryPage from "./pages/admin/EditCategoryPage";
import EditShippingPage from "./pages/admin/EditShippingPage";
import AddCustomizationPage from "./pages/admin/AddCustomizationPage";
import AddShippingPage from "./pages/admin/AddShippingPage";
import AddDiscountPage from "./pages/admin/AddDiscountPage";
import EditDiscountPage from "./pages/admin/EditDiscountPage";
import AddCustomizationProductPage from "./pages/admin/AddCustomizationProductPage";
import EditCustomizationProductPage from "./pages/admin/EditCustomizationProductPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import AddPetPage from "./pages/pets/AddPetPage";

function App() {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Verifica el estado de la sesión al cargar la aplicación
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener la sesión:", error.message);
      }
      setSession(data.session);
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from("users") // tu tabla real
          .select("profile")
          .eq("id", session.user.id)
          .single();
        if (data) setUserProfile(data.profile);
      }
    };
    fetchProfile();
  }, [session]);

  return (
    <CartProvider>
      <Header
        session={
          session
            ? { ...session, user: { ...session.user, profile: userProfile } }
            : null
        }
      />
      <main>
        <Routes>
          {/* Redirección si no hay sesión */}
          {!session && (
            <Route path="/pets" element={<Navigate to="/login" />} />
          )}

          {/* Rutas públicas con redirección si hay sesión */}
          {session ? (
            <>
              <Route path="/login" element={<Navigate to="/home" />} />
              <Route path="/register" element={<Navigate to="/home" />} />
              <Route
                path="/forgot-password"
                element={<Navigate to="/home" />}
              />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </>
          )}

          {/* Rutas públicas */}
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

          {/* Rutas privadas de usuario */}
          {session && (
            <Route path="/profile" element={<UserMenuPage />}>
              <Route index element={<UserMainData />} />
              <Route path="all-data" element={<UserProfilePage />} />
              <Route path="orders" element={<UserOrdersPage />} />
              <Route path="orders/:orderId" element={<UserOrderDetailPage />} />
              <Route path="pets" element={<PetList />} />
              <Route path="pets/:id" element={<PetDetailPage />} />
              <Route path="pets/add" element={<AddPetPage />} />
            </Route>
          )}

          {/* Rutas privadas de admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboardPage />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminOrdersTable />} />

            {/* Productos */}
            <Route
              path="products"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminProductsTable />
                </PrivateRoute>
              }
            />
            <Route
              path="products/add"
              element={
                <PrivateRoute adminOnly={true}>
                  <AddProductPage />
                </PrivateRoute>
              }
            />
            <Route
              path="products/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditProductPage />
                </PrivateRoute>
              }
            />
            <Route
              path="products/:id/edit"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditProductPage />
                </PrivateRoute>
              }
            />

            {/* Personalizaciones de producto */}
            <Route
              path="products/customizations/add"
              element={
                <PrivateRoute adminOnly={true}>
                  <AddCustomizationProductPage />
                </PrivateRoute>
              }
            />
            <Route
              path="products/customizations/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditCustomizationProductPage />
                </PrivateRoute>
              }
            />
            <Route
              path="products/customizations/:id/edit"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditCustomizationProductPage />
                </PrivateRoute>
              }
            />

            {/* Categorías */}
            <Route
              path="categories"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminCategoriesTable />
                </PrivateRoute>
              }
            />
            <Route
              path="categories/add"
              element={
                <PrivateRoute adminOnly={true}>
                  <AddCategoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="categories/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditCategoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="categories/:id/edit"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditCategoryPage />
                </PrivateRoute>
              }
            />

            {/* Personalizaciones */}
            <Route
              path="customizations"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminPersonalizationTypesTable />
                </PrivateRoute>
              }
            />
            <Route
              path="customizations/add"
              element={
                <PrivateRoute adminOnly={true}>
                  <AddCustomizationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="customizations/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditCustomizationTypePage />
                </PrivateRoute>
              }
            />
            <Route
              path="customizations/:id/edit"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditCustomizationTypePage />
                </PrivateRoute>
              }
            />

            {/* Envíos */}
            <Route
              path="shippings"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminShippingTable />
                </PrivateRoute>
              }
            />
            <Route
              path="shippings/add"
              element={
                <PrivateRoute adminOnly={true}>
                  <AddShippingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="shippings/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditShippingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="shippings/:id/edit"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditShippingPage />
                </PrivateRoute>
              }
            />

            {/* Descuentos */}
            <Route
              path="discounts"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDiscountsTable />
                </PrivateRoute>
              }
            />
            <Route
              path="discounts/add"
              element={
                <PrivateRoute adminOnly={true}>
                  <AddDiscountPage />
                </PrivateRoute>
              }
            />
            <Route
              path="discounts/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditDiscountPage />
                </PrivateRoute>
              }
            />
            <Route
              path="discounts/:id/edit"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditDiscountPage />
                </PrivateRoute>
              }
            />

            {/* Pedidos */}
            <Route
              path="orders"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminOrdersTable />
                </PrivateRoute>
              }
            />
            <Route
              path="orders/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <EditOrderPage />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Ruta de error al final */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <CookiesBanner />
      </main>
      <Footer />
    </CartProvider>
  );
}

export default App;
