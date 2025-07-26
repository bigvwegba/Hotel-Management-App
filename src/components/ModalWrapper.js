// components/ModalWrapper.jsx

import "../styles/modal.css";
// components/ModalWrapper.jsx


export default function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
