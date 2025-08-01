// store/useProductStore.js
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import LZString from 'lz-string';

const STORAGE_KEY = 'hotel-products';
const ARCHIVE_KEY = 'hotel-products-archive';
const SETTINGS_KEY = 'hotel-inventory-settings';

const loadFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    
    try {
      return JSON.parse(LZString.decompress(data)) || defaultValue;
    } catch {
      return JSON.parse(data) || defaultValue;
    }
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, data, compress = true) => {
  try {
    const serialized = compress 
      ? LZString.compress(JSON.stringify(data))
      : JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

const defaultSettings = {
  retentionDays: 90,
  compressArchives: true,
  maxArchiveSizeMB: 10
};

const useProductStore = create((set, get) => ({
  products: loadFromStorage(STORAGE_KEY),
  archives: loadFromStorage(ARCHIVE_KEY),
  settings: loadFromStorage(SETTINGS_KEY, defaultSettings),
  editProduct: null,
  viewProduct: null,

  // Core Methods
  setViewProduct: (product) => set({ viewProduct: product }),
  setEditProduct: (product) => set({ editProduct: product }),
  
  getActiveProducts: () => get().products.filter(p => !p.isArchived),
  getArchivedProducts: () => get().archives,
  getProductById: (id) => get().products.find(p => p.id === id),

  addProduct: (product) => {
    const timestamp = new Date().toISOString();
    const inventoryId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newProduct = {
      ...product,
      id: uuidv4().slice(0, 6),
      inventoryId,
      price: Math.max(0, Number(product.price) || 0),
      quantity: Math.max(0, Number(product.quantity) || 0),
      isArchived: false,
      lastUpdated: timestamp,
      history: [{
        type: 'added',
        detail: `Product created with initial stock of ${product.quantity} units`,
        timestamp,
        by: product.addedBy || 'admin'
      }]
    };

    set(state => {
      const products = [...state.products, newProduct];
      saveToStorage(STORAGE_KEY, products, false);
      return { products };
    });
  },

  updateProduct: (updatedProduct) => {
    const timestamp = new Date().toISOString();
    set(state => {
      const products = state.products.map(p => {
        if (p.id === updatedProduct.id) {
          const history = [...p.history];
          const changes = [];
          
          if (Number(p.quantity) !== Number(updatedProduct.quantity)) {
            const diff = Number(updatedProduct.quantity) - Number(p.quantity);
            changes.push(`Quantity ${diff > 0 ? 'increased' : 'decreased'} by ${Math.abs(diff)}`);
          }
          
          if (p.name !== updatedProduct.name) changes.push(`Name updated`);
          if (p.price !== updatedProduct.price) changes.push(`Price updated`);
          if (p.category !== updatedProduct.category) changes.push(`Category updated`);

          if (changes.length > 0) {
            history.push({
              type: 'updated',
              detail: changes.join(', '),
              timestamp,
              by: updatedProduct.updatedBy || 'admin'
            });
          }

          return {
            ...p,
            ...updatedProduct,
            price: Number(updatedProduct.price) || p.price,
            quantity: Math.max(0, Number(updatedProduct.quantity)) || p.quantity,
            lastUpdated: timestamp,
            history
          };
        }
        return p;
      });

      saveToStorage(STORAGE_KEY, products, false);
      return { products };
    });
  },

  archiveProduct: (id, reason = 'Manual archive', by = 'admin') => {
    const timestamp = new Date().toISOString();
    set(state => {
      const product = state.products.find(p => p.id === id);
      if (!product) return state;

      const archiveRecord = {
        ...product,
        archivedAt: timestamp,
        archivedBy: by,
        archiveReason: reason,
        originalData: product
      };

      const products = state.products.map(p => 
        p.id === id ? { ...p, isArchived: true } : p
      );
      const archives = [...state.archives, archiveRecord];
      
      saveToStorage(STORAGE_KEY, products, false);
      saveToStorage(ARCHIVE_KEY, archives, state.settings.compressArchives);
      
      return { products, archives };
    });
  },

  restoreProduct: (id) => {
    set(state => {
      const archive = state.archives.find(a => a.id === id);
      if (!archive) return state;

      const products = [...state.products, archive.originalData];
      const archives = state.archives.filter(a => a.id !== id);
      
      saveToStorage(STORAGE_KEY, products, false);
      saveToStorage(ARCHIVE_KEY, archives, state.settings.compressArchives);
      
      return { products, archives };
    });
  },

  purgeArchivedProduct: (id) => {
    set(state => {
      const archives = state.archives.filter(a => a.id !== id);
      saveToStorage(ARCHIVE_KEY, archives, state.settings.compressArchives);
      return { archives };
    });
  },

  cleanupOldArchives: () => {
    set(state => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - state.settings.retentionDays);

      const archives = state.archives.filter(a => 
        new Date(a.archivedAt) > cutoff
      );

      saveToStorage(ARCHIVE_KEY, archives, state.settings.compressArchives);
      return { archives };
    });
  },

  updateSettings: (newSettings) => {
    set(state => {
      const settings = { ...state.settings, ...newSettings };
      saveToStorage(SETTINGS_KEY, settings, false);
      return { settings };
    });
  },

  adjustInventory: (id, adjustment, reason = 'Adjustment', by = 'admin') => {
    const timestamp = new Date().toISOString();
    set(state => {
      const products = state.products.map(p => {
        if (p.id === id) {
          const adjustmentValue = Number(adjustment);
          const newQuantity = Math.max(0, p.quantity + adjustmentValue);
          
          return {
            ...p,
            quantity: newQuantity,
            lastUpdated: timestamp,
            history: [
              ...p.history,
              {
                type: 'adjusted',
                detail: `Quantity ${adjustmentValue >= 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustmentValue)} | Reason: ${reason}`,
                timestamp,
                by,
                previousQuantity: p.quantity,
                newQuantity
              }
            ]
          };
        }
        return p;
      });

      saveToStorage(STORAGE_KEY, products, false);
      return { products };
    });
  },

  restockProduct: (id, quantity, supplier = 'N/A', by = 'admin') => {
    const timestamp = new Date().toISOString();
    set(state => {
      const products = state.products.map(p => {
        if (p.id === id) {
          const restockQty = Math.max(0, Number(quantity));
          const newQuantity = p.quantity + restockQty;
          
          return {
            ...p,
            quantity: newQuantity,
            lastRestocked: timestamp,
            lastUpdated: timestamp,
            supplier: supplier !== 'N/A' ? supplier : p.supplier,
            history: [
              ...p.history,
              {
                type: 'restocked',
                detail: `Restocked ${restockQty} units${supplier !== 'N/A' ? ` from ${supplier}` : ''}`,
                timestamp,
                by,
                previousQuantity: p.quantity,
                newQuantity
              }
            ]
          };
        }
        return p;
      });

      saveToStorage(STORAGE_KEY, products, false);
      return { products };
    });
  },

  useProduct: (id, quantity, purpose = 'Used', by = 'admin') => {
    const timestamp = new Date().toISOString();
    set(state => {
      const products = state.products.map(p => {
        if (p.id === id) {
          const useQty = Math.min(Math.max(0, Number(quantity)), p.quantity);
          const newQuantity = p.quantity - useQty;
          
          return {
            ...p,
            quantity: newQuantity,
            sold: p.sold + useQty,
            lastUsedDate: timestamp,
            lastUpdated: timestamp,
            history: [
              ...p.history,
              {
                type: 'used',
                detail: `Used ${useQty} units | Purpose: ${purpose}`,
                timestamp,
                by,
                previousQuantity: p.quantity,
                newQuantity
              }
            ]
          };
        }
        return p;
      });

      saveToStorage(STORAGE_KEY, products, false);
      return { products };
    });
  }
}));

export default useProductStore;