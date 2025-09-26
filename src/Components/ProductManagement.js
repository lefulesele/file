import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = ({ products, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    };

    if (editingProduct) {
      onEditProduct(editingProduct.id, productData);
    } else {
      onAddProduct(productData);
    }

    // Reset form
    setFormData({ name: '', description: '', category: '', price: '', quantity: '' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDeleteProduct(productId);
    }
  };

  const cancelEdit = () => {
    setFormData({ name: '', description: '', category: '', price: '', quantity: '' });
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="product-management-container">
      <div className="product-header">
        <h2>Product Management</h2>
        <div className="product-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-section">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select Category</option>
                <option value="Beverages">Beverages</option>
                <option value="Bakery">Bakery</option>
                <option value="Desserts">Desserts</option>
                <option value="Sandwiches">Sandwiches</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-control"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;