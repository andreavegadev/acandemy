import { CartProvider } from "./context/CartContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/products/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/login/LoginPage";
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage";
import AddPetPage from "./pages/pets/AddPetPage";
import PetListPage from "./pages/pets/PetListPage";
import PetDetailPage from "./pages/pets/PetDetailPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/add-pet"
            element={
              <PrivateRoute>
                <AddPetPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/pets"
            element={
              <PrivateRoute>
                <PetListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/pets/:id"
            element={
              <PrivateRoute>
                <PetDetailPage />
              </PrivateRoute>
            }
          />
          {/* Ruta para manejar errores, si se pone entran por aqui el resto de páginas */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
