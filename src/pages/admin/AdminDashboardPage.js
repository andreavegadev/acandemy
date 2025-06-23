import React, { useState } from "react";
import AddProductPage from "./AddProductPage";
import AddCategoryPage from "./AddCategoryPage";
import AddDiscountPage from "./AddDiscountPage";
import AdminProductsTable from "./AdminProductsTable";
import AdminOrdersTable from "./AdminOrdersTable";
import AdminDiscountsTable from "./AdminDiscountsTable";
import AdminCategoriesTable from "./AdminCategoriesTable";
import OrderDetailPanel from "./OrderDetailPanel";
import ProductDetailPanel from "./ProductDetailPanel";
import DiscountDetailPanel from "./DiscountDetailPanel";

const AdminDashboardPage = () => {
  const [view, setView] = useState("home");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Nueva función para cambiar la vista y limpiar detalles
  const handleSetView = (newView) => {
    setSelectedOrder(null);
    setSelectedProduct(null);
    setSelectedDiscount(null);
    setView(newView);
  };

  return (
    <div
      className="admin-dashboard"
      style={{ display: "flex", minHeight: "80vh" }}
    >
      <div
        style={{
          flex: 2,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <div>
          <AdminOrdersTable onOrderSelect={setSelectedOrder} />
        </div>
        <div>
          <AdminProductsTable
            onProductSelect={setSelectedProduct}
            onAddProduct={() => handleSetView("add-product")}
          />
        </div>
        <div>
          <AdminDiscountsTable
            onDiscountSelect={setSelectedDiscount}
            onAddDiscount={() => handleSetView("add-discount")}
          />
        </div>
        <div>
          <AdminCategoriesTable onAddCategory={() => handleSetView("add-category")} />
        </div>
      </div>
      <div
        style={{ flex: 1.2, padding: "32px", borderLeft: "1px solid #d1c4e9" }}
      >
        {selectedOrder ? (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        ) : selectedProduct ? (
          <ProductDetailPanel
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onEdit={(product) => {
              setSelectedProduct(null);
              setView("edit-product");
              // Si usas un estado para el producto a editar, puedes guardarlo aquí
              // setEditProduct(product);
            }}
          />
        ) : selectedDiscount ? (
          <DiscountDetailPanel
            discount={selectedDiscount}
            onClose={() => setSelectedDiscount(null)}
          />
        ) : view === "add-product" ? (
          <AddProductPage />
        ) : view === "add-category" ? (
          <AddCategoryPage />
        ) : view === "add-discount" ? (
          <AddDiscountPage />
        ) : (
          <p style={{ color: "#aaa" }}>Selecciona una acción o un pedido.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
