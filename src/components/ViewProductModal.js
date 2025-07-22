import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useProductStore from '../store/useProductStore';

export default function ViewProductModal({ isVisible, onClose }) {
  const { viewProduct, setViewProduct } = useProductStore(); // ✅ Correct store state

  useEffect(() => {
    if (!isVisible) setViewProduct(null);
  }, [isVisible, setViewProduct]);

  if (!isVisible || !viewProduct) return null;

  const {
    name,
    category,
    price,
    quantity,
    sold,
    lastRestocked,
    inventoryId,
    unit,
    reorderLevel,
    supplier,
    location,
    consumable,
    history = [],
  } = viewProduct; // ✅ Correct product to display

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Toaster position="top-right" />
        <h2 className="modal-title">Product Details</h2>

        <div className="product-details">
          <p><strong>Name:</strong> {name}</p>
          <p>
            <strong>Inventory ID:</strong> 
            <span className="font-mono">{inventoryId}</span>
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

          <p><strong>Category:</strong> {category}</p>
          <p><strong>Price:</strong> ₦{price}</p>
          <p><strong>Quantity:</strong> {quantity} {unit}</p>
          <p><strong>Sold:</strong> {sold}</p>
          <p><strong>Last Restocked:</strong> {new Date(lastRestocked).toLocaleString()}</p>
          <p><strong>Reorder Level:</strong> {reorderLevel}</p>
          <p><strong>Supplier:</strong> {supplier}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Consumable:</strong> {consumable ? 'Yes' : 'No'}</p>
        </div>

        <div className="product-history mt-4">
          <h3>Activity History</h3>
          {history.length === 0 ? (
            <p>No recorded history yet.</p>
          ) : (
            <ul className="history-list">
              {history.slice().reverse().map((item, idx) => (
                <li key={idx}>
                  <span className="text-sm">
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleString()
                      : 'Unknown Date'}
                  </span>
                  <span className="ml-2 font-medium">{item.type}</span>
                  {item.detail && (
                    <span className="ml-2 text-gray-600">({item.detail})</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-actions mt-4">
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
