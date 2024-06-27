CREATE SCHEMA INVOICE_MANAGEMENT;
USE INVOICE_MANAGEMENT;

CREATE TABLE products (
  id INT unique PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  gstRate DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL,
  discountType ENUM('amount', 'percentage') NOT NULL,
  discountValue DECIMAL(10, 2) NOT NULL
);


INSERT INTO products (id, name, price, quantity, category, gstRate, date, discountType, discountValue) VALUES
(1, 'Smartphone', 799.99, 100, 'Electronics', 18.00, '2023-10-01', 'percentage', 10.00),
(2, 'Laptop', 1299.99, 50, 'Electronics', 18.00, '2023-09-02', 'percentage', 15.00),
(3, 'Television', 899.99, 30, 'Electronics', 18.00, '2023-08-03', 'amount', 50.00),
(4, 'Headphones', 199.99, 200, 'Electronics', 18.00, '2023-07-04', 'percentage', 20.00),
(5, 'Smartwatch', 299.99, 150, 'Electronics', 18.00, '2023-06-05', 'percentage', 10.00),
(6, 'T-Shirt', 19.99, 300, 'Clothing', 0.00, '2023-05-06', 'percentage', 5.00),
(7, 'Jeans', 49.99, 200, 'Clothing', 0.00, '2023-04-07', 'amount', 10.00),
(8, 'Sweater', 39.99, 150, 'Clothing', 0.00, '2023-03-08', 'percentage', 15.00),
(9, 'Dress', 59.99, 100, 'Clothing', 0.00, '2023-02-09', 'percentage', 20.00),
(10, 'Shoes', 79.99, 100, 'Clothing', 0.00, '2023-01-10', 'amount', 15.00),
(11, 'Rice', 9.99, 500, 'Groceries', 5.00, '2022-12-11', 'percentage', 5.00),
(12, 'Apples', 1.99, 300, 'Groceries', 5.00, '2022-11-12', 'percentage', 10.00),
(13, 'Chicken', 7.99, 200, 'Groceries', 5.00, '2022-10-13', 'amount', 3.00),
(14, 'Milk', 3.99, 400, 'Groceries', 5.00, '2022-09-14', 'percentage', 8.00),
(15, 'Bread', 2.49, 500, 'Groceries', 5.00, '2022-08-15', 'percentage', 12.00),
(16, 'Cereal', 3.49, 300, 'Groceries', 5.00, '2022-07-16', 'percentage', 15.00),
(17, 'Bananas', 0.79, 600, 'Groceries', 5.00, '2022-06-17', 'amount', 1.00),
(18, 'Oranges', 1.29, 400, 'Groceries', 5.00, '2022-05-18', 'percentage', 10.00),
(19, 'Pasta', 2.99, 250, 'Groceries', 5.00, '2022-04-19', 'percentage', 12.00),
(20, 'Tomatoes', 1.49, 350, 'Groceries', 5.00, '2022-03-20', 'percentage', 8.00),
(21, 'Tablet', 399.99, 80, 'Electronics', 18.00, '2022-02-21', 'amount', 30.00),
(22, 'Earbuds', 99.99, 120, 'Electronics', 18.00, '2022-01-22', 'percentage', 25.00),
(23, 'Desktop Computer', 999.99, 40, 'Electronics', 18.00, '2021-12-23', 'percentage', 20.00),
(24, 'Printer', 149.99, 60, 'Electronics', 18.00, '2021-11-24', 'amount', 15.00),
(25, 'Camera', 499.99, 90, 'Electronics', 18.00, '2021-10-25', 'percentage', 12.00),
(26, 'Polo Shirt', 29.99, 180, 'Clothing', 0.00, '2021-09-26', 'percentage', 5.00),
(27, 'Shorts', 19.99, 250, 'Clothing', 0.00, '2021-08-27', 'amount', 10.00),
(28, 'Jacket', 69.99, 100, 'Clothing', 0.00, '2021-07-28', 'percentage', 15.00),
(29, 'Skirt', 39.99, 120, 'Clothing', 0.00, '2021-06-29', 'percentage', 20.00),
(30, 'Boots', 89.99, 80, 'Clothing', 0.00, '2021-05-30', 'amount', 15.00),
(31, 'Potatoes', 0.59, 700, 'Groceries', 5.00, '2021-04-01', 'percentage', 5.00),
(32, 'Carrots', 0.79, 600, 'Groceries', 5.00, '2021-03-02', 'percentage', 10.00),
(33, 'Steak', 12.99, 150, 'Groceries', 5.00, '2021-02-03', 'amount', 3.00),
(34, 'Eggs', 2.99, 300, 'Groceries', 5.00, '2021-01-04', 'percentage', 8.00),
(35, 'Cheese', 4.99, 200, 'Groceries', 5.00, '2020-12-05', 'percentage', 12.00),
(36, 'Salad', 3.49, 250, 'Groceries', 5.00, '2020-11-06', 'percentage', 15.00),
(37, 'Pizza', 5.99, 180, 'Groceries', 5.00, '2020-10-07', 'amount', 1.00),
(38, 'Ice Cream', 3.99, 220, 'Groceries', 5.00, '2020-09-08', 'percentage', 10.00),
(39, 'Coffee', 6.49, 180, 'Groceries', 5.00, '2020-08-09', 'percentage', 12.00),
(40, 'Tea', 4.99, 200, 'Groceries', 5.00, '2020-07-10', 'percentage', 8.00),
(41, 'Smart Scale', 49.99, 100, 'Electronics', 18.00, '2020-06-11', 'amount', 20.00),
(42, 'Fitness Tracker', 79.99, 80, 'Electronics', 18.00, '2020-05-12', 'percentage', 25.00),
(43, 'Digital Camera', 299.99, 60, 'Electronics', 18.00, '2020-04-13', 'percentage', 20.00),
(44, 'External Hard Drive', 129.99, 120, 'Electronics', 18.00, '2020-03-14', 'amount', 15.00),
(45, 'Wireless Mouse', 19.99, 200, 'Electronics', 18.00, '2020-02-15', 'percentage', 12.00),
(46, 'Pullover Hoodie', 39.99, 150, 'Clothing', 0.00, '2020-01-16', 'percentage', 15.00),
(47, 'Socks', 5.99, 400, 'Clothing', 0.00, '2019-12-17', 'amount', 10.00),
(48, 'Dress Shoes', 59.99, 100, 'Clothing', 0.00, '2019-11-18', 'percentage', 20.00),
(49, 'Blouse', 29.99, 180, 'Clothing', 0.00, '2019-10-19', 'percentage', 25.00),
(50, 'Jogging Pants', 24.99, 200, 'Clothing', 0.00, '2019-09-20', 'amount', 15.00),
(51, 'Cucumbers', 0.49, 800, 'Groceries', 5.00, '2019-08-21', 'percentage', 5.00),
(52, 'Spinach', 1.29, 400, 'Groceries', 5.00, '2019-07-22', 'percentage', 10.00),
(53, 'Beef', 9.99, 120, 'Groceries', 5.00, '2019-06-23', 'amount', 3.00),
(54, 'Butter', 3.49, 250, 'Groceries', 5.00, '2019-05-24', 'percentage', 8.00),
(55, 'Yogurt', 2.99, 300, 'Groceries', 5.00, '2019-04-25', 'percentage', 12.00),
(56, 'Cookies', 1.99, 400, 'Groceries', 5.00, '2019-03-26', 'percentage', 15.00),
(57, 'Granola Bars', 3.99, 200, 'Groceries', 5.00, '2019-02-27', 'amount', 1.00),
(58, 'Orange Juice', 2.49, 300, 'Groceries', 5.00, '2019-01-28', 'percentage', 10.00),
(59, 'Bagels', 2.99, 250, 'Groceries', 5.00, '2018-12-29', 'percentage', 12.00),
(60, 'Honey', 4.99, 200, 'Groceries', 5.00, '2018-11-30', 'percentage', 8.00),
(61, 'Bluetooth Speaker', 29.99, 100, 'Electronics', 18.00, '2018-10-01', 'amount', 20.00),
(62, 'Power Bank', 19.99, 150, 'Electronics', 18.00, '2018-09-02', 'percentage', 25.00),
(63, 'Gaming Console', 299.99, 80, 'Electronics', 18.00, '2018-08-03', 'percentage', 20.00),
(64, 'Wireless Earbuds', 69.99, 120, 'Electronics', 18.00, '2018-07-04', 'amount', 15.00),
(65, 'Action Camera', 199.99, 60, 'Electronics', 18.00, '2018-06-05', 'percentage', 12.00),
(66, 'Turtleneck Sweater', 49.99, 100, 'Clothing', 0.00, '2018-05-06', 'percentage', 15.00),
(67, 'Gloves', 9.99, 200, 'Clothing', 0.00, '2018-04-07', 'amount', 10.00),
(68, 'Winter Coat', 89.99, 80, 'Clothing', 0.00, '2018-03-08', 'percentage', 20.00),
(69, 'Scarf', 19.99, 150, 'Clothing', 0.00, '2018-02-09', 'percentage', 25.00),
(70, 'Swim Shorts', 29.99, 180, 'Clothing', 0.00, '2018-01-10', 'amount', 15.00),
(71, 'Bell Peppers', 1.49, 300, 'Groceries', 5.00, '2017-12-11', 'percentage', 5.00),
(72, 'Broccoli', 1.99, 250, 'Groceries', 5.00, '2017-11-12', 'percentage', 10.00),
(73, 'Pork', 8.99, 150, 'Groceries', 5.00, '2017-10-13', 'amount', 3.00),
(74, 'Chips', 2.99, 400, 'Groceries', 5.00, '2017-09-14', 'percentage', 8.00),
(75, 'Soda', 1.99, 500, 'Groceries', 5.00, '2017-08-15', 'percentage', 12.00),
(76, 'Ice', 0.99, 300, 'Groceries', 5.00, '2017-07-16', 'percentage', 15.00),
(77, 'Chocolate', 3.49, 200, 'Groceries', 5.00, '2017-06-17', 'amount', 1.00),
(78, 'Candy', 1.49, 300, 'Groceries', 5.00, '2017-05-18', 'percentage', 10.00),
(79, 'Pickles', 1.99, 250, 'Groceries', 5.00, '2017-04-19', 'percentage', 12.00),
(80, 'Mustard', 2.49, 200, 'Groceries', 5.00, '2017-03-20', 'percentage', 8.00),
(81, 'Smart Thermostat', 99.99, 80, 'Electronics', 18.00, '2017-02-21', 'amount', 20.00),
(82, 'Smart Bulbs', 14.99, 200, 'Electronics', 18.00, '2017-01-22', 'percentage', 25.00),
(83, 'Streaming Device', 49.99, 100, 'Electronics', 18.00, '2016-12-23', 'percentage', 20.00),
(84, 'Smart Plug', 9.99, 150, 'Electronics', 18.00, '2016-11-24', 'amount', 15.00),
(85, 'Security Camera', 79.99, 60, 'Electronics', 18.00, '2016-10-25', 'percentage', 12.00),
(86, 'Waffle Maker', 24.99, 120, 'Electronics', 18.00, '2016-09-26', 'amount', 10.00),
(87, 'Microwave', 79.99, 80, 'Electronics', 18.00, '2016-08-27', 'percentage', 15.00),
(88, 'Blender', 39.99, 150, 'Electronics', 18.00, '2016-07-28', 'percentage', 20.00),
(89, 'Coffee Maker', 29.99, 200, 'Electronics', 18.00, '2016-06-29', 'percentage', 25.00),
(90, 'Toaster', 19.99, 250, 'Electronics', 18.00, '2016-05-30', 'amount', 15.00),
(91, 'Tennis Racket', 49.99, 100, 'Clothing', 0.00, '2016-04-01', 'percentage', 5.00),
(92, 'Golf Clubs', 199.99, 50, 'Clothing', 0.00, '2016-03-02', 'amount', 10.00),
(93, 'Basketball', 29.99, 80, 'Clothing', 0.00, '2016-02-03', 'percentage', 15.00),
(94, 'Soccer Ball', 19.99, 120, 'Clothing', 0.00, '2016-01-04', 'amount', 20.00),
(95, 'Football', 29.99, 100, 'Clothing', 0.00, '2015-12-05', 'percentage', 25.00),
(96, 'Volleyball', 24.99, 150, 'Clothing', 0.00, '2015-11-06', 'percentage', 15.00),
(97, 'Baseball Bat', 39.99, 100, 'Clothing', 0.00, '2015-10-07', 'amount', 10.00),
(98, 'Hiking Boots', 69.99, 80, 'Clothing', 0.00, '2015-09-08', 'percentage', 20.00),
(99, 'Camping Tent', 149.99, 30, 'Clothing', 0.00, '2015-08-09', 'percentage', 25.00),
(100, 'Fishing Rod', 79.99, 60, 'Clothing', 0.00, '2015-07-10', 'amount', 15.00);
    
SELECT * FROM products;



CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    category VARCHAR(255),
    description TEXT,
    amount DECIMAL(10, 2),
    paymentMethod VARCHAR(255),
    receiptNumber VARCHAR(255),
    vendor VARCHAR(255),
    tax DECIMAL(10, 2),
    currency VARCHAR(3),
    paymentStatus VARCHAR(20),
    attachments TEXT,
    tags TEXT
);

select * from expenses;

-- Inserting the first expense
INSERT INTO expenses (date, category, description, amount, paymentMethod, receiptNumber, vendor, tax, currency, paymentStatus, attachments, tags) 
VALUES ('2024-04-21', 'Office Supplies', 'Purchase of printer paper', 50.00, 'Credit Card', 'RCT5678', 'Office Depot', 5.00, 'USD', 'Paid', 'receipt2.jpg', 'office, supplies');

-- Inserting the second expense
INSERT INTO expenses (date, category, description, amount, paymentMethod, receiptNumber, vendor, tax, currency, paymentStatus, attachments, tags) 
VALUES ('2024-04-22', 'Travel Expenses', 'Flight tickets for business trip', 500.00, 'Bank Transfer', 'INV7890', 'Airline Company', 50.00, 'USD', 'Pending', 'ticket.pdf', 'travel, business');

-- Inserting the third expense
INSERT INTO expenses (date, category, description, amount, paymentMethod, receiptNumber, vendor, tax, currency, paymentStatus, attachments, tags) 
VALUES ('2024-04-23', 'Meals and Entertainment', 'Client dinner meeting', 200.00, 'Cash', 'REC1234', 'Restaurant XYZ', 20.00, 'USD', 'Paid', 'receipt3.jpg', 'client, dinner');

-- Inserting the fourth expense
INSERT INTO expenses (date, category, description, amount, paymentMethod, receiptNumber, vendor, tax, currency, paymentStatus, attachments, tags) 
VALUES ('2024-04-24', 'Equipment Purchase', 'Purchase of new laptop', 1200.00, 'Credit Card', 'RCT9012', 'Electronics Store', 120.00, 'USD', 'Paid', 'invoice.pdf', 'equipment, laptop');

-- Inserting the fifth expense
INSERT INTO expenses (date, category, description, amount, paymentMethod, receiptNumber, vendor, tax, currency, paymentStatus, attachments, tags) 
VALUES ('2024-04-25', 'Advertising', 'Online advertising campaign', 300.00, 'PayPal', 'INV3456', 'Ad Agency', 30.00, 'USD', 'Pending', 'campaign.pdf', 'advertising, online');






CREATE TABLE invoices (
    invoiceNumber varchar(50)  PRIMARY KEY,
    date DATE,
    deliveryCharge DECIMAL(10, 2),
    shoppingBagQuantity INT,
    shoppingBagPricePerItem DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    totalAmountOCP DECIMAL(10, 2),
    paymentMethod VARCHAR(50)
);

CREATE TABLE invoice_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoiceNumber varchar(50),
    productId INT,
    productName VARCHAR(100),
    category VARCHAR(100),
    quantity INT,
    price DECIMAL(10, 2),
    discountType VARCHAR(50),
    discountValue DECIMAL(10, 2),
    gst DECIMAL(10, 2),
    couponCode VARCHAR(50),
    totalAmountPerProduct DECIMAL(10, 2),
    FOREIGN KEY (invoiceNumber) REFERENCES invoices(invoiceNumber)
);

ALTER TABLE invoice_products
ADD COLUMN category VARCHAR(100) AFTER productName;



SELECT * FROM invoice_products;

SELECT * FROM invoices;
SELECT IFNULL(productName, "N/A") AS productName, IFNULL(SUM(quantity), 0) AS quantity FROM invoice_products GROUP BY productName ORDER BY quantity DESC LIMIT 5,
SELECT IFNULL(productId, "N/A") AS productId, IFNULL(SUM(quantity), 0) AS quantity FROM invoice_products GROUP BY productId ORDER BY quantity DESC LIMIT 1


SELECT 
    IFNULL(ip.productName, 'N/A') AS productName, 
    IFNULL(ip.productId, 'N/A') AS productId, 
    IFNULL(SUM(ip.quantity), 0) AS quantity,
    IFNULL(ip.category, 'N/A') AS category
FROM 
    invoice_products ip
GROUP BY 
    ip.productId
ORDER BY 
    quantity DESC
LIMIT 
    1;
    
    
    SELECT SUM(quantity * price) AS totalCost
FROM invoice_products;

SELECT SUM(totalAmountPerProduct) AS totalSalesRevenue
FROM invoice_products;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);


