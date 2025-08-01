export const formatActionType = (type) => {
  const typeMap = {
    'added': 'Product Added',
    'updated': 'Product Updated',
    'restocked': 'Restock',
    'used': 'Usage',
    'inventory_adjustment': 'Inventory Adjustment',
    'archived': 'Archived',
    'restored': 'Restored'
  };
  return typeMap[type] || type.replace(/_/g, ' ');
};

const formatChangeMessage = (change) => {
  if (change.includes('→ undefined') || change.includes('undefined →')) {
    return null;
  }

  const formatted = change
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace('unit: Unit', 'Measurement unit')
    .replace(/→/g, '→')
    .replace(/: true/g, ': Yes')
    .replace(/: false/g, ': No');

  if (change.includes('isConsumable')) {
    return `Marked as ${change.includes('true') ? 'Consumable' : 'Non-consumable'}`;
  }
  if (change.includes('isRoomServiceItem')) {
    return `Marked as ${change.includes('true') ? 'Room Service Item' : 'Not for Room Service'}`;
  }

  return formatted;
};

export const renderHistoryDetail = (item) => {
  switch(item.type) {
    case 'added':
      return <p>Initial stock: <span className="detail-value-bold">{item.newQuantity} units</span></p>;
      
    case 'updated':
      const meaningfulChanges = item.detail.split('\n')
        .map(formatChangeMessage)
        .filter(change => change !== null);
      
      if (meaningfulChanges.length === 0) return null;
      
      return (
        <div className="history-detail-group">
          {meaningfulChanges.map((change, i) => (
            <p key={i}>{change}</p>
          ))}
        </div>
      );
      
    case 'restocked':
      return (
        <div className="history-detail-group">
          <p>Restocked: <span className="detail-value-positive">+{item.restockQty} units</span></p>
          {item.supplier && item.supplier !== 'N/A' && (
            <p>Supplier: <span className="detail-value-normal">{item.supplier}</span></p>
          )}
          <p>New stock level: <span className="detail-value-bold">{item.newQuantity} units</span></p>
        </div>
      );
      
    case 'inventory_adjustment':
      return (
        <div className="history-detail-group">
          <p>
            Adjustment: 
            <span className={`detail-value-${item.adjustment > 0 ? 'positive' : 'negative'}`}>
              {item.adjustment > 0 ? '+' : ''}{item.adjustment} units
            </span>
          </p>
          <p>Reason: <span className="detail-value-normal">{item.reason || 'Not specified'}</span></p>
          <p>New quantity: <span className="detail-value-bold">{item.newQuantity} units</span></p>
        </div>
      );
      
    case 'used':
      return (
        <div className="history-detail-group">
          <p>Used: <span className="detail-value-negative">-{item.usedQty} units</span></p>
          {item.purpose && <p>Purpose: <span className="detail-value-normal">{item.purpose}</span></p>}
          <p>Remaining: <span className="detail-value-bold">{item.newQuantity} units</span></p>
        </div>
      );
      
    default:
      return item.detail ? <p>{item.detail}</p> : null;
  }
};