import { useState } from 'react';
import useProductStore from '../store/useProductStore';

export default function ArchiveManager({ onRestore, retentionDays }) {
  const { archives, purgeArchivedProduct } = useProductStore();
  const [filter, setFilter] = useState('');
  const [selectedArchives, setSelectedArchives] = useState([]);

  const filteredArchives = archives.filter(a =>
    a.inventoryId?.toLowerCase().includes(filter.toLowerCase()) ||
    a.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const handlePurgeSelected = () => {
    if (selectedArchives.length === 0) return;
    
    if (window.confirm(
      `Permanently delete ${selectedArchives.length} archived items?\n` +
      `This cannot be undone.`
    )) {
      selectedArchives.forEach(id => purgeArchivedProduct(id));
      setSelectedArchives([]);
    }
  };

  const toggleSelectAll = (e) => {
    setSelectedArchives(e.target.checked ? filteredArchives.map(a => a.id) : []);
  };

  const toggleSelectOne = (id, checked) => {
    setSelectedArchives(prev => 
      checked ? [...prev, id] : prev.filter(i => i !== id)
    );
  };

  return (
    <div className="archive-manager">
      <div className="archive-header">
        <h2>Archived Products</h2>
        <div className="archive-controls">
          <input
            type="text"
            placeholder="Search archives..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="search-input"
          />
          <span className="archive-info">
            {archives.length} items • Auto-purge after {retentionDays} days
          </span>
        </div>
      </div>

      {filteredArchives.length > 0 && (
        <div className="bulk-actions">
          <button
            className="btn-danger"
            onClick={handlePurgeSelected}
            disabled={selectedArchives.length === 0}
          >
            Purge Selected ({selectedArchives.length})
          </button>
        </div>
      )}

      <div className="table-container">
        <table className="archive-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedArchives.length === filteredArchives.length && filteredArchives.length > 0}
                />
              </th>
              <th>Name</th>
              <th>ID</th>
              <th>Archived On</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArchives.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  {archives.length === 0 ? 'No archived items' : 'No matches found'}
                </td>
              </tr>
            ) : (
              filteredArchives.map(archive => (
                <tr key={archive.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedArchives.includes(archive.id)}
                      onChange={(e) => toggleSelectOne(archive.id, e.target.checked)}
                    />
                  </td>
                  <td>{archive.name}</td>
                  <td>{archive.inventoryId}</td>
                  <td>
                    {new Date(archive.archivedAt).toLocaleDateString()}
                    <div className="text-muted">
                      {Math.floor(
                        (new Date() - new Date(archive.archivedAt)) / (1000 * 60 * 60 * 24)
                      )} days ago
                    </div>
                  </td>
                  <td>{archive.archiveReason || 'N/A'}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-sm btn-restore"
                      onClick={() => onRestore(archive.id)}
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}