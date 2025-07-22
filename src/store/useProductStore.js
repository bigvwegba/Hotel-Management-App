// store/useProductStore.js
import { create } from 'zustand';

const STORAGE_KEY = 'hotel-products';

const loadProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {}
};

const useProductStore = create((set, get) => ({
  products: loadProducts(),
  editProduct: null,
  viewProduct: null,
  setViewProduct: (product) => set({ viewProduct: product }),
  addProduct: (product) => {
    const timestamp = new Date().toISOString();
    const inventoryId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newProduct = {
      ...product,
      id: Date.now(),
      inventoryId,
      price: Number(product.price),
      quantity: Number(product.quantity),
      unit: product.unit || 'unit',
      reorderLevel: product.reorderLevel || 10,
      category: product.category,
      supplier: product.supplier || 'N/A',
      location: product.location || 'General Storage',
      sold: 0,
      isArchived: false,
      isConsumable: product.isConsumable ?? true,
      isRoomServiceItem: product.isRoomServiceItem ?? false,
      isInMaintenance: false,
      lastRestocked: timestamp,
      lastUsedDate: null,
      addedBy: product.addedBy || 'admin',
      history: [
        {
          type: 'added',
          detail: `Initial stock: ${product.quantity}`,
          timestamp,
          by: product.addedBy || 'admin',
        },
      ],
    };
    set(state => {
      const products = [...state.products, newProduct];
      saveProducts(products);
      return { products };
    });
  },

  updateProduct: (updatedProduct) => {
    const timestamp = new Date().toISOString();
    const products = get().products.map(p => {
      if (p.id === updatedProduct.id) {
        const history = [...p.history];
        if (p.name !== updatedProduct.name) {
          history.push({
            type: 'updated',
            detail: `Name changed from ${p.name} to ${updatedProduct.name}`,
            timestamp,
            by: updatedProduct.updatedBy || 'admin',
          });
        }
        if (p.price !== updatedProduct.price) {
          history.push({
            type: 'updated',
            detail: `Price changed from ₦${p.price} to ₦${updatedProduct.price}`,
            timestamp,
            by: updatedProduct.updatedBy || 'admin',
          });
        }
        if (p.category !== updatedProduct.category) {
          history.push({
            type: 'updated',
            detail: `Category changed from ${p.category} to ${updatedProduct.category}`,
            timestamp,
            by: updatedProduct.updatedBy || 'admin',
          });
        }
        return {
          ...p,
          ...updatedProduct,
          history,
        };
      }
      return p;
    });
    saveProducts(products);
    set({ products });
  },

  restockProduct: (id, qty, by = 'admin') => {
    const timestamp = new Date().toISOString();
    const products = get().products.map(p => {
      if (p.id === id) {
        return {
          ...p,
          quantity: Number(p.quantity) + Number(qty),
          lastRestocked: timestamp,
          history: [
            ...p.history,
            {
              type: 'restocked',
              detail: `Restocked ${qty} units`,
              timestamp,
              by,
            },
          ],
        };
      }
      return p;
    });
    saveProducts(products);
    set({ products });
  },

  setEditProduct: (product) => set({ editProduct: product }),
}));

export default useProductStore;
