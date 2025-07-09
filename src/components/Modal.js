const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(60,40,100,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const contentStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 4px 32px #311b9240",
  padding: 0,
  minWidth: 340,
  maxWidth: 600,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
