import React, { useState } from "react";
import AddProductPage from "./AddProductPage";
import AddCategoryPage from "./AddCategoryPage";
import AddDiscountPage from "./AddDiscountPage";
import AddShippingPage from "./AddShippingPage";
import AddPersonalizationTypePage from "./AddPersonalizationTypePage";
import AdminProductsTable from "./AdminProductsTable";
import AdminOrdersTable from "./AdminOrdersTable";
import AdminDiscountsTable from "./AdminDiscountsTable";
import AdminCategoriesTable from "./AdminCategoriesTable";
import AdminShippingTable from "./AdminShippingTable";
import OrderDetailPanel from "./OrderDetailPanel";
import ProductDetailPanel from "./ProductDetailPanel";
import DiscountDetailPanel from "./DiscountDetailPanel";
import CategoryDetailPanel from "./CategoryDetailPanel";
import ShippingDetailPanel from "./ShippingDetailPanel";
import AdminPersonalizationTypesTable from "./AdminPersonalizationTypesTable";
import PersonalizationTypeDetailPanel from "./PersonalizationTypeDetailPanel";
import { supabase } from "../../supabaseClient";

const AdminDashboardPage = () => {
  const [view, setView] = useState("home");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [reloadTypesFlag, setReloadTypesFlag] = useState(false);

  // Nueva función para cambiar la vista y limpiar detalles
  const handleSetView = (newView) => {
    setSelectedOrder(null);
    setSelectedProduct(null);
    setSelectedDiscount(null);
    setSelectedCategory(null);
    setSelectedShipping(null);
    setSelectedType(null);
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
  const reloadTypes = () => setReloadTypesFlag((f) => !f);

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
          <AdminShippingTable
            onAddShipping={() => handleSetView("add-shipping")}
            onShippingSelect={setSelectedShipping}
          />
        </div>
        <div>
          <AdminCategoriesTable
            onAddCategory={() => handleSetView("add-category")}
            onCategorySelect={setSelectedCategory}
          />
        </div>
        <div>
          <AdminPersonalizationTypesTable
            onAddType={() => setView("add-personalization-type")}
            onTypeSelect={setSelectedType}
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
            onEdit={(product) => {
              setSelectedProduct(null);
              setView("edit-product");
            }}
            onClose={() => setSelectedProduct(null)}
            onListPersonalization={(product) => {
              setSelectedProduct(product);
              setView("add-product-personalization");
            }}
          />
        ) : selectedDiscount ? (
          <DiscountDetailPanel
            discount={selectedDiscount}
            onClose={() => setSelectedDiscount(null)}
            onEdit={(discount) => {
              setSelectedDiscount(null);
              setView("edit-discount");
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
            }}
            onReloadCategories={reloadCategories}
          />
        ) : selectedShipping ? (
          <ShippingDetailPanel
            shipping={selectedShipping}
            onClose={() => setSelectedShipping(null)}
          />
        ) : selectedType ? (
          <PersonalizationTypeDetailPanel
            type={selectedType}
            onClose={() => setSelectedType(null)}
            onReloadTypes={reloadTypes}
          />
        ) : view === "add-product" ? (
          <AddProductPage />
        ) : view === "add-category" ? (
          <AddCategoryPage />
        ) : view === "add-discount" ? (
          <AddDiscountPage />
        ) : view === "add-shipping" ? (
          <AddShippingPage />
        ) : view === "add-personalization-type" ? (
          <AddPersonalizationTypePage
            onCreated={reloadTypes}
            onCancel={() => setView("")}
          />
        ) : (
          <p style={{ color: "#aaa" }}>Selecciona una acción o un pedido.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
