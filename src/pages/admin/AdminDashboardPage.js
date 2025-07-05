import { useState } from "react";
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
import Modal from "../../components/Modal"; // ajusta la ruta si es necesario

const sidebarButtonStyle = {
  background: "none",
  border: "none",
  color: "#5e35b1",
  fontWeight: 500,
  fontSize: 17,
  padding: "14px 24px",
  textAlign: "left",
  borderRadius: "0 20px 20px 0",
  cursor: "pointer",
  transition: "background 0.2s, color 0.2s",
};

const sidebarButtonActiveStyle = {
  ...sidebarButtonStyle,
  background: "#fff",
  color: "#311b92",
  boxShadow: "0 2px 8px #ede7f6",
};

const sidebarStyle = {
  width: 220,
  background: "linear-gradient(180deg, #ede7f6 60%, #fff 100%)",
  borderRight: "1px solid #d1c4e9",
  padding: "32px 0",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minHeight: "100vh",
};

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
  const [section, setSection] = useState("products");

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

  const reloadOrders = () => setReloadFlag((flag) => !flag);
  const reloadDiscounts = () => setReloadFlag((flag) => !flag);
  const reloadCategories = () => setReloadFlag((flag) => !flag);
  const reloadTypes = () => setReloadTypesFlag((f) => !f);

  const sidebarItems = [
    { key: "orders", label: "Pedidos" },
    { key: "products", label: "Productos" },
    { key: "discounts", label: "Descuentos" },
    { key: "shipping", label: "Envíos" },
    { key: "categories", label: "Categorías" },
    { key: "types", label: "Tipos de personalización" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f6ff" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2
          style={{
            color: "#5e35b1",
            fontWeight: 700,
            fontSize: 22,
            margin: "0 0 24px 24px",
            letterSpacing: 1,
          }}
        >
          Admin
        </h2>
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            style={
              section === item.key
                ? sidebarButtonActiveStyle
                : sidebarButtonStyle
            }
            onClick={() => setSection(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* Contenido principal */}
      <div
        style={{
          flex: 1,
          padding: "40px 5vw 40px 5vw",
          background: "#f8f6ff",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {section === "orders" && (
          <AdminOrdersTable
            onOrderSelect={setSelectedOrder}
            reloadFlag={reloadFlag}
          />
        )}
        {section === "products" && (
          <AdminProductsTable
            onProductSelect={setSelectedProduct}
            onAddProduct={() => handleSetView("add-product")}
          />
        )}
        {section === "discounts" && (
          <AdminDiscountsTable
            onDiscountSelect={setSelectedDiscount}
            onAddDiscount={() => handleSetView("add-discount")}
          />
        )}
        {section === "shipping" && (
          <AdminShippingTable
            onAddShipping={() => handleSetView("add-shipping")}
            onShippingSelect={setSelectedShipping}
          />
        )}
        {section === "categories" && (
          <AdminCategoriesTable
            onAddCategory={() => handleSetView("add-category")}
            onCategorySelect={setSelectedCategory}
          />
        )}
        {section === "types" && (
          <AdminPersonalizationTypesTable
            onAddType={() => setView("add-personalization-type")}
            onTypeSelect={setSelectedType}
          />
        )}
        {selectedOrder ? (
          <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
            <OrderDetailPanel
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onReloadOrders={reloadOrders}
            />
          </Modal>
        ) : selectedProduct ? (
          <Modal
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          >
            <ProductDetailPanel
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onReloadProducts={reloadFlag}
            />
          </Modal>
        ) : selectedDiscount ? (
          <Modal
            open={!!selectedDiscount}
            onClose={() => setSelectedDiscount(null)}
          >
            <DiscountDetailPanel
              discount={selectedDiscount}
              onClose={() => setSelectedDiscount(null)}
              onEdit={(discount) => {
                setSelectedDiscount(null);
                setView("edit-discount");
              }}
              onReloadDiscounts={reloadDiscounts}
            />
          </Modal>
        ) : selectedCategory ? (
          <Modal
            open={!!selectedCategory}
            onClose={() => setSelectedCategory(null)}
          >
            <CategoryDetailPanel
              category={selectedCategory}
              onClose={() => setSelectedCategory(null)}
              onEdit={(category) => {
                setSelectedCategory(null);
                setView("edit-category");
              }}
              onReloadCategories={reloadCategories}
            />
          </Modal>
        ) : selectedShipping ? (
          <Modal
            open={!!selectedShipping}
            onClose={() => setSelectedShipping(null)}
          >
            <ShippingDetailPanel
              shipping={selectedShipping}
              onClose={() => setSelectedShipping(null)}
            />
          </Modal>
        ) : selectedType ? (
          <Modal open={!!selectedType} onClose={() => setSelectedType(null)}>
            <PersonalizationTypeDetailPanel
              type={selectedType}
              onClose={() => setSelectedType(null)}
              onReloadTypes={reloadTypes}
            />
          </Modal>
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
