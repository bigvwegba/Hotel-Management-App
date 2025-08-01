import { useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import ProductModal from '../components/ProductModal';
import ViewProductModal from '../components/ViewProductModal';
import ArchiveManager from '../components/ArchiveManager';
import '../styles/product.css';

export default function Products() {
  const {
    getActiveProducts,
    setEditProduct,
    setViewProduct,
    archiveProduct,
    restoreProduct,
    cleanupOldArchives,
    settings
  } = useProductStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showArchives, setShowArchives] = useState(false);
  const [storageSize, setStorageSize] = useState(0);

  const products = getActiveProducts();

  useEffect(() => {
    const calculateStorage = () => {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length * 2;
        }
      }
      setStorageSize(total / (1024 * 1024));
    };

    calculateStorage();
    const interval = setInterval(calculateStorage, 30000);
    cleanupOldArchives();
    return () => clearInterval(interval);
  }, [cleanupOldArchives]);

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Qty', 'Status'];
    const rows = products.map(p => [p.inventoryId, p.name, p.category, p.price, p.quantity, p.isArchived ? 'Archived' : 'Active']);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `products_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleArchive = (product) => {
    if (window.confirm(`Archive ${product.name} (${product.inventoryId})?`)) {
      archiveProduct(product.id, 'Manual archive');
    }
  };

  const filteredProducts = products.filter(p =>
    !p.isArchived && (
      p.inventoryId?.toLowerCase().includes(search.toLowerCase()) ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="header-title">
          <h1>Products Inventory</h1>
          <div className="storage-info">
            Storage: {storageSize.toFixed(2)}MB
            {storageSize > settings.maxArchiveSizeMB * 0.8 && (
              <span className="storage-warning"> (Approaching limit)</span>
            )}
          </div>
        </div>
        
        <div className="products-actions">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          
          <div className="action-buttons">
            <button onClick={handleExport} className="btn-secondary">
              Export CSV
            </button>
            <button 
              className="btn-primary" 
              onClick={() => {
                setEditProduct(null);
                setIsAddModalOpen(true);
              }}
            >
              Add Product
            </button>
            <button
              className={`btn-toggle ${showArchives ? 'active' : ''}`}
              onClick={() => setShowArchives(!showArchives)}
            >
              {showArchives ? 'Hide Archives' : 'View Archives'}
            </button>
          </div>
        </div>
      </div>

      {showArchives ? (
        <ArchiveManager onRestore={restoreProduct} retentionDays={settings.retentionDays} />
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-results">
                    {products.some(p => p.isArchived) ? (
                      <>
                        No active products found. 
                        <button className="link-button" onClick={() => setShowArchives(true)}>
                          View archives
                        </button>
                      </>
                    ) : 'No products found'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.inventoryId}</td>
                    <td>{product.category}</td>
                    <td>₦{product.price.toLocaleString()}</td>
                    <td className={product.quantity <= (product.reorderLevel || 10) ? 'low-stock' : ''}>
                      {product.quantity}
                    </td>
                    <td>
                      <span className={`status-${product.isArchived ? 'archived' : 'active'}`}>
                        {product.isArchived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                    <td>
                      {product.lastUpdated ? 
                        new Date(product.lastUpdated).toLocaleDateString() : 
                        'N/A'}
                    </td>
                    <td className="action-buttons">
                      <button 
                        className="btn-sm btn-view"
                        onClick={() => setViewProduct(product)}
                      >
                        View
                      </button>
                      <button 
                        className="btn-sm btn-edit"
                        onClick={() => {
                          setEditProduct(product);
                          setIsAddModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-sm btn-archive"
                        onClick={() => handleArchive(product)}
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ProductModal
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ViewProductModal
        product={useProductStore.getState().viewProduct}
        onClose={() => setViewProduct(null)}
      />
    </div>
  );
}