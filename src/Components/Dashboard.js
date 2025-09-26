import React from 'react';
import './Dashboard.css';

const Dashboard = ({ products, onShowProducts }) => {
  // Calculate statistics from props
  const lowStockProducts = products.filter(product => 
    product.quantity <= (product.minStockLevel || 10) && product.quantity > 0
  );
  
  const totalValue = products.reduce((total, product) => 
    total + (product.price * product.quantity), 0
  );
  
  const weeklySales = 1250; // This would come from an API

  return (
    <div className="dashboard-container">
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Total Products</div>
            <div className="card-icon">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div className="card-value">{products.length}</div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Low Stock Items</div>
            <div className="card-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="card-value">{lowStockProducts.length}</div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Total Value</div>
            <div className="card-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="card-value">${totalValue.toFixed(2)}</div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">This Week's Sales</div>
            <div className="card-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
          <div className="card-value">${weeklySales.toFixed(2)}</div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-circle"></i> 
          {lowStockProducts.length} products are running low on stock.
        </div>
      )}

      <div className="table-section">
        <div className="table-header">
          <h2>Recent Products</h2>
          <button className="btn btn-primary" onClick={onShowProducts}>
            <i className="fas fa-plus"></i> Add Product
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map(product => {
              const isLowStock = product.quantity <= (product.minStockLevel || 10);
              const status = isLowStock ? 'Low Stock' : 'In Stock';
              
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td className={isLowStock ? 'low-stock' : ''}>{product.quantity}</td>
                  <td className={isLowStock ? 'low-stock' : ''}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;