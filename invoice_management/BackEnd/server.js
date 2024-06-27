const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(bodyParser.json());
const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

/* MySQL Connection
const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'prem',
    password: '12345678910',
    database: 'INVOICE_MANAGEMENT'
}); */

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

// Connect to MySQL
connection.getConnection((err, conn) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    conn.release(); // Release the connection
});

// Define Routes
// Endpoint to handle POST requests to add a new product
app.post('/products', (req, res) => {
    const {id, name, price, quantity, category, gstRate, date, discountType, discountValue } = req.body;

    // Check if all required fields are provided
    if (!id || !name || !price || !quantity || !category || !gstRate || !date || !discountType || !discountValue) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    // Execute the SQL query to insert the new product into the database
    connection.query('INSERT INTO products (id, name, price, quantity, category, gstRate, date, discountType, discountValue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, price, quantity, category, gstRate, date, discountType, discountValue],
        (error, results) => {
            if (error) {
                console.error('Error adding new product:', error);
                return res.status(500).json({ error: 'Failed to add new product. Please try again later.' });
            }
            res.status(201).json({ message: 'Product added successfully.' });
        });
});

// Route to fetch all products
app.get('/products', async (req, res) => {
    try {
        // Execute the query to fetch all products
        const [rows] = await connection.query('SELECT * FROM products');

        // Send the response with fetched products
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products. Please try again later.' });
    }
});

// Route to fetch a product by ID
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Execute the query to fetch the product by ID
        const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);

        // Check if product with the given ID exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Send the response with the fetched product
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product. Please try again later.' });
    }
});


// DELETE request to delete a product by ID
app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Execute the query to delete the product by ID
        const result = await connection.query('DELETE FROM products WHERE id = ?', [productId]);

        // Check if any rows were affected (product deleted)
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Send the response indicating successful deletion
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product. Please try again later.' });
    }
});


// PUT request to update a product by ID
app.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, price, quantity, category, gstRate, date, discountType, discountValue } = req.body;

    // Check if all required fields are provided
    if (!name || !price || !quantity || !category || !gstRate || !date || !discountType || !discountValue) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    try {
        // Execute the query to update the product details
        const result = await connection.query(
            'UPDATE products SET name = ?, price = ?, quantity = ?, category = ?, gstRate = ?, date = ?, discountType = ?, discountValue = ? WHERE id = ?',
            [name, price, quantity, category, gstRate, date, discountType, discountValue, productId]
        );

        // Check if any rows were affected (product updated)
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Send the response indicating successful update
        res.status(200).json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product. Please try again later.' });
    }
});


// Endpoint to handle POST requests to add a new expense
app.post('/expenses', async (req, res) => {
    const {
        date,
        category,
        description,
        amount,
        paymentMethod,
        receiptNumber,
        vendor,
        tax,
        currency,
        paymentStatus,
        attachments,
        tags
    } = req.body;

    try {
        // Execute the SQL query to insert the new expense into the database
        await connection.query('INSERT INTO expenses (date, category, description, amount, paymentMethod, receiptNumber, vendor, tax, currency, paymentStatus, attachments, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [date, category, description, amount, paymentMethod, receiptNumber, vendor, tax, currency, paymentStatus, attachments, tags]);

        res.status(201).json({ message: 'Expense added successfully.' });
    } catch (error) {
        console.error('Error adding new expense:', error);
        res.status(500).json({ error: 'Failed to add new expense. Please try again later.' });
    }
});

// Route to fetch all expenses
app.get('/expenses', async (req, res) => {
    try {
        // Execute the query to fetch all expenses
        const [rows] = await connection.query('SELECT * FROM expenses');

        // Send the response with fetched expenses
        res.json(rows);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses. Please try again later.' });
    }
});

// Route to fetch an expense by ID
app.get('/expenses/:id', async (req, res) => {
    const expenseId = req.params.id;
    try {
        // Execute the query to fetch the expense by ID
        const [rows] = await connection.query('SELECT * FROM expenses WHERE id = ?', [expenseId]);

        // Check if expense with the given ID exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found.' });
        }

        // Send the response with the fetched expense
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({ error: 'Failed to fetch expense. Please try again later.' });
    }
});


// Route to fetch a product by ID
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Execute the query to fetch the product by ID
        const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);

        // Check if product with the given ID exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Send the response with the fetched product
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product. Please try again later.' });
    }
});



// Endpoint to handle POST requests to save invoice data
app.post('/invoices', async (req, res) => {
    const {
        invoiceNumber,
        date,
        products,
        deliveryCharge,
        shoppingBag,
        subtotal,
        totalAmountOCP,
        paymentMethod
    } = req.body;

    try {
        // Execute the SQL query to insert the new invoice data into the database
        await connection.query('INSERT INTO invoices (invoiceNumber, date, deliveryCharge, shoppingBagQuantity, shoppingBagPricePerItem, subtotal, totalAmountOCP, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [invoiceNumber, date, deliveryCharge, shoppingBag.quantity, shoppingBag.pricePerItem, subtotal, totalAmountOCP, paymentMethod]);

        // Insert product details into another table (assuming you have a separate table for products)
        for (const product of products) {
            await connection.query('INSERT INTO invoice_products (invoiceNumber, productId, productName, quantity, price, discountType, discountValue, gst, couponCode, totalAmountPerProduct) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [invoiceNumber, product.productId, product.productName, product.quantity, product.price, product.discountType, product.discountValue, product.gst, product.couponCode, product.totalAmountPerProduct]);
        }

        res.status(201).json({ message: 'Invoice data saved successfully.' });
    } catch (error) {
        console.error('Error saving invoice data:', error);
        res.status(500).json({ error: 'Failed to save invoice data. Please try again later.' });
    }
});


// Route to fetch invoices based on time period
app.get('/invoices', async (req, res) => {
    try {
      let query = 'SELECT * FROM invoices';
      const { startDate, endDate } = req.query;
      if (startDate && endDate) {
        query += ` WHERE date BETWEEN '${startDate}' AND '${endDate}'`;
      }
      const [rows] = await connection.query(query);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Failed to fetch invoices. Please try again later.' });
    }
  });

// Route to fetch products for a specific invoice
app.get('/invoices/:invoiceNumber/products', async (req, res) => {
    const invoiceNumber = req.params.invoiceNumber;
    try {
      const [rows] = await connection.query('SELECT * FROM invoice_products WHERE invoiceNumber = ?', [invoiceNumber]);
      res.json(rows);
    } catch (error) {
      console.error(`Error fetching products for invoice ${invoiceNumber}:`, error);
      res.status(500).json({ error: `Failed to fetch products for invoice ${invoiceNumber}. Please try again later.` });
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

