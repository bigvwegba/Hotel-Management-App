import useProductStore from '../store/useProductStore';
import AddProductModal from '../components/AddProductModal';
import ViewProductModal from '../components/ViewProductModal';
import { useState } from 'react';

export default function Products() {
  const {
    products,
    setEditProduct,
    setViewProduct,
    editProduct,
    viewProduct,
  } = useProductStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleExport = () => {
    const headers = ['Inventory ID', 'Name', 'Category', 'Price', 'Quantity', 'Sold', 'Last Restocked'];
    const rows = products.map(p => [
      p.inventoryId, p.name, p.category, p.price, p.quantity, p.sold, p.lastRestocked
    ]);
    // Escape double quotes and commas in CSV fields
    const escapeCSV = value =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(escapeCSV).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const filteredProducts = products.filter(p =>
    p.inventoryId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="page-title">Products</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by Inventory ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={handleExport} className="btn-secondary">Export CSV</button>
          <button className="btn-primary" onClick={() => {
            setEditProduct(null);
            setIsAddModalOpen(true);
          }}>
            Add Product
          </button>
        </div>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Inventory ID</th>
            <th>Category</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Sold</th>
            <th>Restocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr><td colSpan="8">No products match your search.</td></tr>
          ) : (
            filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.inventoryId}</td>
                <td>{product.category}</td>
                <td>₦{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.sold}</td>
                <td>{product.lastRestocked}</td>
                <td style={{ display: 'flex', gap: '5px' }}>
                  <button className="btn-sm" onClick={() => {
                    setViewProduct(product);
                  }}>
                    View
                  </button>
                  <button className="btn-sm" onClick={() => {
                    setEditProduct(product);
                    setIsAddModalOpen(true);
                  }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <AddProductModal
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ViewProductModal
        isVisible={!!viewProduct}
        onClose={() => setViewProduct(null)}
      />
    </div>
  );
}
