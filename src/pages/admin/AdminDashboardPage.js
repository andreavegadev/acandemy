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
import CategoryDetailPanel from "./CategoryDetailPanel";
import { supabase } from "../../supabaseClient";

const AdminDashboardPage = () => {
  const [view, setView] = useState("home");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(false);

  // Nueva función para cambiar la vista y limpiar detalles
  const handleSetView = (newView) => {
    setSelectedOrder(null);
    setSelectedProduct(null);
    setSelectedDiscount(null);
    setSelectedCategory(null);
    setView(newView);
  };

  const handleReloadOrder = async (orderId) => {
    const { data: order } = await supabase
      .from("orders")
      .select(
        `
        *,
        user:users (
          full_name,
          id_number
        ),
        items:order_items (
          *,
          product:products (name)
        )
      `
      )
      .eq("id", orderId)
      .single();
    setSelectedOrder(order);
  };

  const reloadOrders = () => setReloadFlag((flag) => !flag);
  const reloadDiscounts = () => setReloadFlag((flag) => !flag);
  const reloadCategories = () => setReloadFlag((flag) => !flag);

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
          <AdminOrdersTable
            onOrderSelect={setSelectedOrder}
            reloadFlag={reloadFlag}
          />
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
          <AdminCategoriesTable
            onAddCategory={() => handleSetView("add-category")}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </div>
      <div
        style={{ flex: 1.2, padding: "32px", borderLeft: "1px solid #d1c4e9" }}
      >
        {selectedOrder ? (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onReloadOrders={reloadOrders}
          />
        ) : selectedProduct ? (
          <ProductDetailPanel
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onEdit={(product) => {
              setSelectedProduct(null);
              setView("edit-product");
              // Si usas un estado para el producto a editar, puedes guardarlo aquí
              //setEditProduct(product);
            }}
          />
        ) : selectedDiscount ? (
          <DiscountDetailPanel
            discount={selectedDiscount}
            onClose={() => setSelectedDiscount(null)}
            onEdit={(discount) => {
              setSelectedDiscount(null);
              setView("edit-discount");
              // Si tienes un estado para el descuento a editar, puedes guardarlo aquí
              //setEditDiscount(discount);
            }}
            onReloadDiscounts={reloadDiscounts}
          />
        ) : selectedCategory ? (
          <CategoryDetailPanel
            category={selectedCategory}
            onClose={() => setSelectedCategory(null)}
            onEdit={(category) => {
              setSelectedCategory(null);
              setView("edit-category");
              // setEditCategory(category);
            }}
            onReloadCategories={reloadCategories}
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
