// Data management and storage

// Sample product data
let products = [
    {
        id: 1,
        name: 'Espresso',
        description: 'Strong black coffee',
        category: 'Beverages',
        price: 3.50,
        quantity: 42,
        status: 'In Stock'
    },
    {
        id: 2,
        name: 'Cappuccino',
        description: 'Coffee with steamed milk',
        category: 'Beverages',
        price: 4.25,
        quantity: 8,
        status: 'Low Stock'
    },
    {
        id: 3,
        name: 'Blueberry Muffin',
        description: 'Fresh baked muffin with blueberries',
        category: 'Bakery',
        price: 2.75,
        quantity: 5,
        status: 'Low Stock'
    },
    {
        id: 4,
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake',
        category: 'Desserts',
        price: 5.50,
        quantity: 15,
        status: 'In Stock'
    }
];

// Function to get all products
function getProducts() {
    // Try to load from localStorage first
    const storedProducts = localStorage.getItem('wingsCafeProducts');
    if (storedProducts) {
        return JSON.parse(storedProducts);
    }
    
    // If nothing in localStorage, return sample data
    return products;
}

// Function to add a new product
function addProduct(product) {
    const products = getProducts();
    const newProduct = {
        id: Date.now(),
        ...product,
        status: product.quantity > 10 ? 'In Stock' : 'Low Stock'
    };
    
    products.push(newProduct);
    localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
    return newProduct;
}

// Function to update a product
function updateProduct(id, updatedProduct) {
    const products = getProducts();
    const index = products.findIndex(product => product.id === id);
    
    if (index !== -1) {
        products[index] = { 
            ...products[index], 
            ...updatedProduct,
            status: updatedProduct.quantity > 10 ? 'In Stock' : 'Low Stock'
        };
        localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
        return products[index];
    }
    
    return null;
}

// Function to delete a product
function deleteProduct(id) {
    const products = getProducts();
    const index = products.findIndex(product => product.id === id);
    
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1)[0];
        localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
        return deletedProduct;
    }
    
    return null;
}

// Function to get product by ID
function getProductById(id) {
    const products = getProducts();
    return products.find(product => product.id === id);
}

// Function to get products by category
function getProductsByCategory(category) {
    const products = getProducts();
    return products.filter(product => product.category === category);
}

// Function to get low stock products
function getLowStockProducts(threshold = 10) {
    const products = getProducts();
    return products.filter(product => product.quantity <= threshold);
}