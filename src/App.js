import React, { useState, useEffect } from 'react';
import Dashboard from './Components/Dashboard';
import Inventory from './Components/Inventory';
import ProductManagement from './Components/ProductManagement';
import StockManagement from './Components/StockManagement';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);

  // Load initial products
  useEffect(() => {
    const sampleProducts = [
      {
        id: 1,
        name: 'Espresso',
        description: 'Strong black coffee',
        category: 'Beverages',
        price: 3.50,
        quantity: 42,
        minStockLevel: 10
      },
      {
        id: 2,
        name: 'Cappuccino',
        description: 'Coffee with steamed milk',
        category: 'Beverages',
        price: 4.25,
        quantity: 8,
        minStockLevel: 10
      },
      {
        id: 3,
        name: 'Blueberry Muffin',
        description: 'Fresh baked muffin with blueberries',
        category: 'Bakery',
        price: 2.75,
        quantity: 5,
        minStockLevel: 8
      }
    ];
    setProducts(sampleProducts);
  }, []);

  // Function to add a product
  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      status: productData.quantity > 10 ? 'In Stock' : 'Low Stock'
    };
    setProducts(prev => [...prev, newProduct]);
  };

  // Function to update a product
  const updateProduct = (id, updatedProduct) => {
    setProducts(prev => prev.map(product =>
      product.id === id
        ? { ...updatedProduct, id, status: updatedProduct.quantity > 10 ? 'In Stock' : 'Low Stock' }
        : product
    ));
  };

  // Function to delete a product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2><i className="fas fa-utensils"></i> Wings Cafe</h2>
        </div>
        <ul className="menu">
          <li className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}>
            <button onClick={() => setActiveSection('dashboard')}>
              <i className="fas fa-th-large"></i> Dashboard
            </button>
          </li>
          <li className={`menu-item ${activeSection === 'inventory' ? 'active' : ''}`}>
            <button onClick={() => setActiveSection('inventory')}>
              <i className="fas fa-warehouse"></i> Inventory
            </button>
          </li>
          <li className={`menu-item ${activeSection === 'products' ? 'active' : ''}`}>
            <button onClick={() => setActiveSection('products')}>
              <i className="fas fa-box"></i> Product Management
            </button>
          </li>
          <li className={`menu-item ${activeSection === 'stock' ? 'active' : ''}`}>
            <button onClick={() => setActiveSection('stock')}>
              <i className="fas fa-exchange-alt"></i> Stock Management
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Stock Inventory System</h1>
          <div className="user-info">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=3498db&color=fff" alt="User" />
            <span>Admin User</span>
          </div>
        </div>

        {/* Render active section */}
        {activeSection === 'dashboard' && (
          <Dashboard 
            products={products} 
            onShowProducts={() => setActiveSection('products')} 
          />
        )}
        
        {activeSection === 'inventory' && (
          <Inventory 
            products={products}
            onEditProduct={(product) => {
              // For now, just show an alert. You can implement proper editing later.
              alert(`Edit product: ${product.name}`);
            }}
            onDeleteProduct={deleteProduct}
          />
        )}
        
        {activeSection === 'products' && (
          <ProductManagement 
            products={products}
            onAddProduct={addProduct}
            onEditProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        )}
        
        {activeSection === 'stock' && (
          <StockManagement 
            products={products}
            onUpdateProduct={updateProduct}
          />
        )}
      </div>
    </div>
  );
}

export default App;