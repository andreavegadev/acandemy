import { CartProvider } from "./context/CartContext";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LogoutButton from "./components/LogoutButton";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/login/LoginPage";
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage";
import AddPetPage from "./pages/AddPetPage";
import RegisterPage from "./pages/login/RegisterPage";

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
      <header>
        <a href="/home">Home</a>
        <a href="/cart">Cart</a>
        <LogoutButton />
      </header>
      <Routes>
        {/* Redirige al login si no hay sesión */}
        {!session && <Route path="*" element={<Navigate to="/login" />} />}

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Rutas privadas */}
        {session && (
          <>
            <Route path="/add-pet" element={<AddPetPage />} />
          </>
        )}
      </Routes>
    </CartProvider>
  );
}

export default App;
