import React, { useState, useEffect } from 'react';
import './StockManagement.css';

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [transactionType, setTransactionType] = useState('add');
    const [notes, setNotes] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [loading, setLoading] = useState(true);

    // Sample data
    const sampleProducts = [
        {
            id: 1,
            name: 'Espresso',
            category: 'Beverages',
            price: 3.50,
            quantity: 42,
            minStockLevel: 10
        },
        {
            id: 2,
            name: 'Cappuccino',
            category: 'Beverages',
            price: 4.25,
            quantity: 8,
            minStockLevel: 10
        },
        {
            id: 3,
            name: 'Blueberry Muffin',
            category: 'Bakery',
            price: 2.75,
            quantity: 5,
            minStockLevel: 8
        }
    ];

    const sampleTransactions = [
        {
            id: 1,
            productId: 1,
            productName: 'Espresso',
            type: 'add',
            quantity: 20,
            notes: 'Initial stock',
            date: '2023-10-15T10:30:00',
            previousQuantity: 22,
            newQuantity: 42
        },
        {
            id: 2,
            productId: 2,
            productName: 'Cappuccino',
            type: 'deduct',
            quantity: 5,
            notes: 'Sold to customer',
            date: '2023-10-16T14:20:00',
            previousQuantity: 13,
            newQuantity: 8
        }
    ];

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setProducts(sampleProducts);
            setTransactions(sampleTransactions);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedProduct || !quantity || isNaN(quantity) || quantity <= 0) {
            alert('Please select a product and enter a valid quantity');
            return;
        }

        const product = products.find(p => p.id === parseInt(selectedProduct));
        if (!product) return;

        const quantityNum = parseInt(quantity);
        let newQuantity;

        if (transactionType === 'add') {
            newQuantity = product.quantity + quantityNum;
        } else {
            if (quantityNum > product.quantity) {
                alert(`Cannot deduct more than available stock (${product.quantity})`);
                return;
            }
            newQuantity = product.quantity - quantityNum;
        }

        // Update product quantity
        const updatedProducts = products.map(p =>
            p.id === product.id ? { ...p, quantity: newQuantity } : p
        );
        setProducts(updatedProducts);

        // Record transaction
        const newTransaction = {
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            type: transactionType,
            quantity: quantityNum,
            notes: notes,
            date: new Date().toISOString(),
            previousQuantity: product.quantity,
            newQuantity: newQuantity
        };

        setTransactions([newTransaction, ...transactions]);
        
        // Reset form
        setQuantity('');
        setNotes('');
        setSelectedProduct(null);
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (!filterDate) return true;
        return transaction.date.startsWith(filterDate);
    });

    const getStatusClass = (product) => {
        if (product.quantity === 0) return 'out-of-stock';
        if (product.quantity <= product.minStockLevel) return 'low-stock';
        return 'in-stock';
    };

    const exportTransactions = () => {
        const headers = ['Date', 'Product', 'Type', 'Quantity', 'Previous Qty', 'New Qty', 'Notes'];
        const csvData = filteredTransactions.map(transaction => [
            new Date(transaction.date).toLocaleString(),
            transaction.productName,
            transaction.type,
            transaction.quantity,
            transaction.previousQuantity,
            transaction.newQuantity,
            transaction.notes || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stock-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="stock-management-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading stock data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stock-management-container">
            <div className="stock-header">
                <h2>Stock Management</h2>
                <button className="btn btn-primary" onClick={exportTransactions}>
                    <i className="fas fa-download"></i> Export Transactions
                </button>
            </div>

            <div className="stock-content">
                <div className="stock-form-section">
                    <div className="form-card">
                        <h3>Stock Transaction</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product</label>
                                <select
                                    value={selectedProduct || ''}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select a product</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.quantity} in stock)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Transaction Type</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            value="add"
                                            checked={transactionType === 'add'}
                                            onChange={() => setTransactionType('add')}
                                        />
                                        <span>Add Stock</span>
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            value="deduct"
                                            checked={transactionType === 'deduct'}
                                            onChange={() => setTransactionType('deduct')}
                                        />
                                        <span>Deduct Stock</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="form-control"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter notes about this transaction..."
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Process Transaction
                            </button>
                        </form>
                    </div>

                    <div className="products-overview">
                        <h3>Current Stock Levels</h3>
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className={`product-card ${getStatusClass(product)}`}>
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-category">{product.category}</div>
                                    <div className="product-quantity">
                                        <span className="quantity-value">{product.quantity}</span>
                                        <span className="quantity-label">in stock</span>
                                    </div>
                                    <div className="min-stock">Min: {product.minStockLevel}</div>
                                    <div className="product-status">
                                        {getStatusClass(product).replace('-', ' ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="transactions-section">
                    <div className="section-header">
                        <h3>Transaction History</h3>
                        <div className="filter-control">
                            <label>Filter by Date:</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="transactions-list">
                        {filteredTransactions.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-receipt"></i>
                                <p>No transactions found</p>
                            </div>
                        ) : (
                            filteredTransactions.map(transaction => (
                                <div key={transaction.id} className="transaction-item">
                                    <div className="transaction-header">
                                        <div className="transaction-product">
                                            {transaction.productName}
                                        </div>
                                        <div className={`transaction-type ${transaction.type}`}>
                                            {transaction.type.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="transaction-details">
                                        <div className="transaction-quantity">
                                            <span className="quantity-change">
                                                {transaction.type === 'add' ? '+' : '-'}
                                                {transaction.quantity}
                                            </span>
                                            <span className="quantity-range">
                                                ({transaction.previousQuantity} → {transaction.newQuantity})
                                            </span>
                                        </div>
                                        <div className="transaction-date">
                                            {new Date(transaction.date).toLocaleString()}
                                        </div>
                                    </div>
                                    {transaction.notes && (
                                        <div className="transaction-notes">
                                            <i className="fas fa-sticky-note"></i>
                                            {transaction.notes}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockManagement;