import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { formatActionType, renderHistoryDetail } from '../utils/productHistoryHelpers';
import '../styles/viewProductModal.css';

const ViewProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const {
    name,
    inventoryId,
    category,
    price,
    quantity,
    unit,
    sold,
    lastRestocked,
    reorderLevel,
    supplier,
    location,
    isConsumable,
    isRoomServiceItem,
    history = []
  } = product;
 

  return (
    <div className="view-product-modal-overlay">
      <div className="view-product-modal-content">
        <Toaster position="top-right" />
        <h2 className="view-product-modal-title">Product Details</h2>
          <button className="modal_close" onClick={onClose}>
            ×
          </button>
        <div className="product-details-grid">
          <div className="product-details-column">
            <p><span className="detail-label">Name:</span> {name}</p>
            <p className="inventory-id-row">
              <span className="detail-label">Inventory ID:</span> 
              <span className="inventory-id-value">{inventoryId}</span>
              <button
                className="copy-id-button"
                onClick={() => {
                  navigator.clipboard.writeText(inventoryId);
                  toast.success("Copied ID!");
                }}
              >
                Copy
              </button>
            </p>
            <p><span className="detail-label">Category:</span> {category}</p>
            <p><span className="detail-label">Price:</span> ₦{price?.toLocaleString()}</p>
            <p><span className="detail-label">Quantity:</span> {quantity} {unit}</p>
          </div>
          <div className="product-details-column">
            <p><span className="detail-label">Sold:</span> {sold}</p>
            <p><span className="detail-label">Last Restocked:</span> {lastRestocked ? new Date(lastRestocked).toLocaleString() : 'Never'}</p>
            <p><span className="detail-label">Reorder Level:</span> {reorderLevel}</p>
            <p><span className="detail-label">Supplier:</span> {supplier}</p>
            <p><span className="detail-label">Location:</span> {location}</p>
            <p><span className="detail-label">Consumable:</span> {isConsumable ? 'Yes' : 'No'}</p>
            <p><span className="detail-label">Room Service:</span> {isRoomServiceItem ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="product-history-section">
          <h3 className="history-section-title">Activity History</h3>
          {history.length === 0 ? (
            <p className="no-history-message">No activity history recorded yet.</p>
          ) : (
            <div className="history-items-container">
              {history.slice().reverse().map((item, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-item-header">
                    <div>
                      <span className="history-action-type">{formatActionType(item.type)}</span>
                      <span className="history-action-by">by {item.by || 'system'}</span>
                    </div>
                    <span className="history-timestamp">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                    </span>
                  </div>
                  
                  <div className="history-item-details">
                    {renderHistoryDetail(item)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="modal-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;