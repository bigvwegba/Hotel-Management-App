import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import useProductStore from '../store/useProductStore';

export default function ProductModal({ isVisible, onClose }) {
  const {
    addProduct,
    updateProduct,
    editProduct,
    setEditProduct,
  } = useProductStore();

  const isEditMode = Boolean(editProduct);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

useEffect(() => {
  if (isEditMode && isVisible) {
    setFormData({
      name: editProduct.name,
      category: editProduct.category,
      price: editProduct.price,
      quantity: editProduct.quantity,

    });
  } else if (isVisible) {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
    });
  }
}, [editProduct, isEditMode, isVisible]);

  const CATEGORIES = [
    "Beverages",
    "Food",
    "Fruits",
    "Beer",
    "Snacks",
    "Toiletries",
    "Cleaning Supplies",
    "Laundry",
    "Electronics",
    "Room Service",
  ];


  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, category, price, quantity } = formData;
    if (!name || !category || !price || !quantity) {
      toast.error("Please fill in all fields");
      return;
    }

    const productData = {
      ...formData,
      lastRestocked: isEditMode
        ? editProduct.lastRestocked
        : new Date().toISOString().split("T")[0], // system date
      id: isEditMode ? editProduct.id : Date.now(),
      sold: isEditMode ? editProduct.sold : 0,
    };

    if (isEditMode) {
      updateProduct(productData);
      toast.success("Product updated");
    } else {
      addProduct(productData);
      toast.success("Product added");
    }

    setEditProduct(null);
    setFormData({ name: '', category: '', price: '', quantity: '' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Toaster position="top-right" />
        <h2 className="modal-title">{isEditMode ? 'Edit Product' : 'New Product'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
          <label>Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
          <div className="modal-actions">
            <button type="submit" className="btn-submit">{isEditMode ? 'Update' : 'Save'}</button>
            <button type="button" className="btn-cancel" onClick={() => {
              setEditProduct(null);
              onClose();
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
