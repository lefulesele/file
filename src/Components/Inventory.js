import React, { useState, useEffect } from 'react';
import './Inventory.css';

const Inventory = ({ products, onEditProduct, onDeleteProduct }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Simulate loading
        const timer = setTimeout(() => {
            filterProducts();
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory, products]);

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.category === selectedCategory
            );
        }

        setFilteredProducts(filtered);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const getStatus = (product) => {
        if (product.quantity === 0) return 'Out of Stock';
        if (product.quantity <= (product.minStockLevel || 10)) return 'Low Stock';
        return 'In Stock';
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'In Stock': return 'status-in-stock';
            case 'Low Stock': return 'status-low-stock';
            case 'Out of Stock': return 'status-out-of-stock';
            default: return '';
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Category', 'Price', 'Quantity', 'Status', 'Description'];
        const csvData = filteredProducts.map(product => [
            product.name,
            product.category,
            `$${product.price.toFixed(2)}`,
            product.quantity,
            getStatus(product),
            product.description
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="inventory-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading inventory...</p>
                </div>
            </div>
        );
    }

    const lowStockCount = products.filter(p => p.quantity <= (p.minStockLevel || 10) && p.quantity > 0).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    return (
        <div className="inventory-container">
            <div className="inventory-header">
                <h2>Inventory Management</h2>
                <div className="inventory-controls">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="search-input"
                    >
                        <option value="all">All Categories</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Sandwiches">Sandwiches</option>
                        <option value="Salads">Salads</option>
                    </select>
                    <button className="btn btn-primary" onClick={exportToCSV}>
                        <i className="fas fa-download"></i> Export CSV
                    </button>
                </div>
            </div>

            <div className="inventory-stats">
                <div className="stat-card">
                    <div className="stat-value">{products.length}</div>
                    <div className="stat-label">Total Products</div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-value">{lowStockCount}</div>
                    <div className="stat-label">Low Stock Items</div>
                </div>
                <div className="stat-card danger">
                    <div className="stat-value">{outOfStockCount}</div>
                    <div className="stat-label">Out of Stock</div>
                </div>
            </div>

            <div className="inventory-table-container">
                <div className="table-header">
                    <h3>Product Inventory</h3>
                    <span>Showing {filteredProducts.length} of {products.length} products</span>
                </div>

                <div className="table-scroll">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const status = getStatus(product);
                                const statusClass = getStatusClass(status);
                                const isLowStock = status === 'Low Stock' || status === 'Out of Stock';
                                
                                return (
                                    <tr key={product.id} className={isLowStock ? 'low-stock' : ''}>
                                        <td>
                                            <div className="product-info">
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-description">{product.description}</div>
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                        <td>{product.quantity}</td>
                                        <td>
                                            <span className={`status-badge ${statusClass}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => onEditProduct(product)}
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger"
                                                    onClick={() => onDeleteProduct(product.id)}
                                                >
                                                    <i className="fas fa-trash"></i> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="empty-state">
                        <i className="fas fa-search"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;