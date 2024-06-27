import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes} from '@fortawesome/free-solid-svg-icons';
import GenerateInvoice from './GenerateInvoice';
import './InvoiceManagement.css';
import { Button, Input } from 'reactstrap'; // Assuming you're using Reactstrap for UI components
import AdditionalCharges from './AdditionalCharges';
import {FaSearch, FaPlus, FaTrash } from 'react-icons/fa'; 


const InvoiceManagement = () => {
    const [shoppingBagQuantity, setShoppingBagQuantity] = useState(0); // State for shopping bag quantity
    const [productIdSearch, setProductIdSearch] = useState('');
    const [orderProducts, setOrderProducts] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [showGenerateInvoice, setShowGenerateInvoice] = useState(false); 
    const [payment, setPayment] = useState('Cash'); // State for payment option
  //  const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [timePeriod, setTimePeriod] = useState('All');
   const [invoices, setInvoices] = useState([]);
    const selectedGST = () => {};
    const invoiceNumber = () => {};
    const [newInvoice, setNewInvoice] = useState({
        productName: '',
        productId: '',
        category: '',
        quantity: 0,
        price: 0,
        discountType: 'amount', // default to 'amount'
        discountValue: 0,
        couponCode: '',
        totalAmount: 0,
        gst: "0%"
    });

    const [searchResults, setSearchResults] = useState([]);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const searchInputRef = useRef(null);
 
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedResultIndex(prevIndex =>
                    prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
                );
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedResultIndex(prevIndex =>
                    prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
                );
            } else if (e.key === 'Enter' && selectedResultIndex !== -1) {
                e.preventDefault();
                handleSelectProduct(searchResults[selectedResultIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedResultIndex, searchResults]);

    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Extract the name and value from the event target
        setProductIdSearch(value);
        searchProducts(value);
        setNewInvoice(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const searchProducts = async (query) => {
        try {
            let url;
            if (productIdSearch) {
                url = `http://localhost:3000/products/${productIdSearch}`;
            } else {
                url = `http://localhost:3000/products?q=${query}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setSearchResults(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Error searching/fetching products:', error);
            setSearchResults([]);
        }
    };
    

    const handleSelectProduct = (product) => {
        setNewInvoice({
            ...newInvoice,
            productName: product.name,
            productId: product.id,
            category: product.category,
            price: product.price,
            discountType: product.discountType,
            discountValue: product.discountValue,
            gst: product.gstRate.toString()
        });
        setSearchResults([]);
        setSelectedResultIndex(-1);
        searchInputRef.current.blur();
    };

    const recalculateTotalAmount = () => {
        const totalAmount = calculateTotalAmount()
        setNewInvoice(prevInvoice => ({
            ...prevInvoice,
            totalAmount: totalAmount 
        }));
    };


    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();


        // Convert GST percentage to decimal form (e.g., 5% to 0.05)
        const gstPercentage = parseFloat(newInvoice.gst) / 100;
        let totalAmount = newInvoice.price * newInvoice.quantity;

        // Calculate GST amount for total amount
        const gstAmount = totalAmount * gstPercentage;

        // Calculate total amount after applying discount, if applicable
        if (newInvoice.discountType === 'amount') {
            totalAmount -= newInvoice.discountValue;
        } else if (newInvoice.discountType === 'percentage') {
            totalAmount -= (totalAmount * newInvoice.discountValue) / 100;
        }

        // Add GST amount to the total amount
        totalAmount += gstAmount;
         
        const newInvoiceWithTotal = { ...newInvoice, totalAmount,  payment};
    
        // Update the order products state with the new invoice
        setOrderProducts(prevInvoices => [...prevInvoices, newInvoiceWithTotal]);

        // Clear form fields
        setNewInvoice({
            productName: '',
            productId: '',
            quantity: 0,
            price: 0,
            discountType: 'amount',
            discountValue: 0,
            couponCode: '',
            totalAmount: 0,
            gst: '0%',
            payment: payment // Include the selected payment option
        });
        
    };

    // Function to remove a product from the order list
    const handleRemoveProduct = (index) => {
        setOrderProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
    }; 

    // Function to handle quantity change
    const handleQuantityChange = (index, change) => {
        setOrderProducts(prevProducts => {
            const updatedProducts = prevProducts.map((product, i) => {
                if (i === index) {
                    // Create a copy of the product object
                    const updatedProduct = { ...product };
                    // Calculate new quantity
                    updatedProduct.quantity = Math.max(product.quantity + change, 0);
                    // Update product details and calculate total amount
                    return calculateProductTotal(updatedProduct);
                }
                return product;
            });
            return updatedProducts;
        });
    };


    // Function to calculate total amount for a product
    const calculateProductTotal = (product) => {
        const gstPercentage = parseFloat(product.gst) / 100;
        let totalAmount = product.price * product.quantity;

        // Calculate GST amount for total amount
        const gstAmount = totalAmount * gstPercentage;

        // Calculate total amount after applying discount, if applicable
        if (product.discountType === 'amount') {
            totalAmount -= product.discountValue;
        } else if (product.discountType === 'percentage') {
            totalAmount -= (totalAmount * product.discountValue) / 100;
        }

    
        totalAmount += gstAmount;
        product.totalAmount = totalAmount;
        return product;
    };
    

    const calculateTotalAmount = () => {
        let totalAmount = (newInvoice.price * newInvoice.quantity);
    
        // Apply discount
        if (newInvoice.discountType === 'amount') {
            totalAmount -= newInvoice.discountValue;
        } else if (newInvoice.discountType === 'percentage') {
            totalAmount -= (totalAmount * newInvoice.discountValue) / 100;
        }
    
        // Calculate GST
        const gstPercentage = parseFloat(newInvoice.gst) / 100;
        const gstAmount = totalAmount * gstPercentage;
    
        // Add GST
        totalAmount += gstAmount;
    
        // Return the total amount
        return totalAmount;
    };
    
    const handleCloseInvoice = () => {
        setShowGenerateInvoice(false);
    };


    const handleApplyCoupon = () => {
        const validCouponCodes = ['prem'];
    
        if (!couponCode.trim()) {
            alert('Please enter a coupon code.');
            return;
        }
    
        if (!validCouponCodes.includes(couponCode.trim())) {
            alert('Invalid coupon code. No discount applied.');
            return;
        }
    
        const discountedTotal = calculateTotalWithGST(); // Implement this function according to your logic
    
        if (isNaN(discountedTotal)) {
            alert('Error calculating total amount. Please try again.');
            return;
        }
     alert('Coupon applied successfully! Discount applied.');
    };
    
    const calculateTotalWithGST = () => {
        const originalTotal = orderProducts.reduce((acc, product) => acc + product.totalAmount, 0);

        if (selectedGST > 0) {
            const gstAmount = (selectedGST / 100) * (originalTotal - calculateDiscountedTotal(originalTotal));
            return originalTotal + gstAmount;
        }
        return originalTotal;
    };

    const calculateDiscountedTotal = (originalTotal) => {
        // Assuming you have a fixed discount percentage
        const discountPercentage = 10; // Example: 10% discount
    
        // Calculate the discount amount
        const discountAmount = (originalTotal * discountPercentage) / 100;
    
        // Apply the discount to the original total
        const discountedTotal = originalTotal - discountAmount;
    
        return discountedTotal;
    };
    

    const handleAddDelivery = (deliveryPrice) => {
        setDeliveryCharge(deliveryPrice); // Set the delivery charge
    };


    useEffect(() => {
        const fetchInvoices = async () => {
          try {
            let url = 'http://localhost:3000/invoices';
            // Append query parameters based on the selected time period
            switch (timePeriod) {
              case 'Day':
                url += '?startDate=2024-04-28&endDate=2024-04-28'; // Replace with actual date
                break;
              case 'Week':
                // Calculate the start and end dates for the week
                // Replace with actual start and end dates
                const startDateOfWeek = '2024-04-22';
                const endDateOfWeek = '2024-04-28';
                url += `?startDate=${startDateOfWeek}&endDate=${endDateOfWeek}`;
                break;
              case 'Month':
                // Calculate the start and end dates for the month
                // Replace with actual start and end dates
                const startDateOfMonth = '2024-04-01';
                const endDateOfMonth = '2024-04-30';
                url += `?startDate=${startDateOfMonth}&endDate=${endDateOfMonth}`;
                break;
              case 'Year':
                // Calculate the start and end dates for the year
                // Replace with actual start and end dates
                const startYear = 2024;
                const startDateOfYear = `${startYear}-01-01`;
                const endDateOfYear = `${startYear}-12-31`;
                url += `?startDate=${startDateOfYear}&endDate=${endDateOfYear}`;
                break;
              default:
                // Fetch all invoices for 'All' time period
                break;
            }
    
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Failed to fetch invoices');
            }
            const data = await response.json();
            setInvoices(data);
          } catch (error) {
            console.error('Error fetching invoices:', error);
          }
        };
    
        fetchInvoices();
      }, [timePeriod]);


    useEffect(() => {
        setFilteredInvoices(
          invoices.filter((invoice) =>
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }, [searchTerm, invoices]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3000/invoices/${searchTerm}/products`);
            if (!response.ok) {
                throw new Error('Failed to fetch invoice products');
            }
            const data = await response.json();
            // Update state with the fetched invoice products data
            setInvoiceProducts(data);
        } catch (error) {
            console.error('Error fetching invoice products:', error);
            // Optionally, you can display an error message to the user
        }
    };

/* const fetchInvoiceProducts = async (invoiceNumber) => {
        try {
          const response = await fetch(`http://localhost:3000/invoices/${invoiceNumber}/products`);
          const data = await response.json();
          setInvoiceProducts((prevState) => ({
            ...prevState,
            [invoiceNumber]: data
          }));
        } catch (error) {
          console.error(`Error fetching products for invoice ${invoiceNumber}:`, error);
        }
      }; */
    
    


    return (
        <div className='InvoiceManagement'>
            <div className='search-container'>
            <Input
                 type="text"
                 value={productIdSearch}
                 onChange={handleInputChange}
                  placeholder="Enter Product ID"
                  innerRef={searchInputRef}
             />
              {searchResults.length > 0 && (
                    <div className="search-results-container">
                        <ul className="search-results">
                        {searchResults.map((result, index) => (
                            <li
                                key={result.id}
                                className={index === selectedResultIndex ? 'selected' : ''}
                                onClick={() => handleSelectProduct(result)}
                            >
                                {result.name} - {result.price}
                            </li>
                        ))}
                    </ul>
                    </div>
                )}
              {' '}
             <div className='button-container'>
             <Button className='faTimes' onClick={() => setSearchResults([])}><FontAwesomeIcon icon={faTimes} /> </Button>
              <Button className='SearhButton' onClick={() => searchProducts(productIdSearch)}><FaSearch />{' '}Search</Button>
             </div>

            </div>
            <h6>.</h6>
            <div className="Block2">
            <div className='InvoiceForm'>
                <form className='InputField' onSubmit={handleSubmit}>
                <label htmlFor="productId">Product ID:</label>
                {' '}
                <input type="text" id="productId" name="productId" value={newInvoice.productId} onChange={handleInputChange} />
                <label htmlFor="category">Category:</label> {/* New input field for category */}
                {' '}
                <select id="category" name="category" value={newInvoice.category} onChange={handleInputChange}>
                      <option value="">Select Category</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Groceries">Groceries</option>
               </select>
                {' '}
                <label htmlFor="productName">Product Name:</label>
                {' '}
                <input type="text" id="productName" name="productName" value={newInvoice.productName} onChange={handleInputChange} />
                {' '}
                <label htmlFor="quantity">Quantity:</label>
                {' '}
                <input type="number" id="quantity" name="quantity"  className="input-field" value={newInvoice.quantity}  onChange={handleInputChange} min="1" />
                {' '}
                <label htmlFor="price">Price ₹:</label>
                {' '}
                <input type="number" id="price" name="price" value={newInvoice.price} className="input-field" onChange={handleInputChange} />
                {' '}
                <div className='Right-Side'>
                <label htmlFor="discountType1">Discount Type:</label>
                {' '}
                <select id="discountType" name="discountType" value={newInvoice.discountType} onChange={handleInputChange}>
                    <option value="amount" defaultValue>Amount</option>
                    <option value="percentage">Percentage</option>
                </select>
                {' '}
                <label htmlFor="input-field3">Discount Value:</label>
                {' '}
                <input type="number" id="discountValue" name="discountValue" className="input-field3" value={newInvoice.discountValue} onChange={handleInputChange} min="0" />
                {' '}
                <label htmlFor="gst">GST:</label>
                {' '}
                <select id="gst" name="gst" value={newInvoice.gst} onChange={handleInputChange}>
                    <option value="0%">0%</option>
                    <option value="5%">5%</option>
                    <option value="12%">12%</option>
                    <option value="18%">18%</option>
                    <option value="28%">28%</option>
                </select>
                <label htmlFor="couponCode">Coupon Code:</label>
                {' '}
                <input type="text" id="couponCode" name="couponCode" className="input-field" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                {' '}
                </div>
                <button onClick={handleApplyCoupon}><FaPlus />{' '}Apply Coupon</button>
                {' '}
                <button type="submit"><FaPlus />{' '}Add Invoice</button>
                {' '}
                <label htmlFor="payment4">Payment:</label>
                    <select id="payment"  name="payment" value={payment} onChange={(e) => setPayment(e.target.value)}>
                        <option value="Cash">Cash</option>
                        <option value="Other">Other</option>
                    </select>
             {' '}
              <AdditionalCharges  onAddDelivery={handleAddDelivery} /> 
                {' '}

                </form>
                </div>
              </div>
            {' '}
              <div className="Block1">
                     <div className="search-bar">
                          <input
                              type="text"
                               placeholder="Search by Invoice Number"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                           />
                              <button onClick={handleSearch}>Search</button>
                            </div>
                            <div className="header">
                  
                                <div className="select-container">
                                    <select className="time-period-select" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
                                          <option value="All">All</option>
                                          <option value="Day">Day</option>
                                          <option value="Week">Week</option>
                                          <option value="Month">Month</option>
                                           <option value="Year">Year</option>
                                     </select>
                                 </div>
                               </div>
                                 <div  className="table-container5">
                                        <table  className="invoice-table">
                                            <thead>
                                                      <tr>
                                                          <th className="invoice-header">Invoice Number</th>
                                                           <th className="invoice-header">Date</th>
                                                          <th className="invoice-header">Total AmountOCP</th>
                                                          <th className="invoice-header">Payment Method</th>
                                                         </tr>
                                             </thead>
                                         <tbody>
                                    {filteredInvoices.map((invoice) => (
                                      <tr key={invoice.invoiceNumber} className="invoice-row">
                                          <td className="invoice-data">{invoice.invoiceNumber}</td>
                                          <td className="invoice-data">{invoice.date}</td>
                                         <td className="invoice-data">{invoice.totalAmountOCP}</td>
                                         <td className="invoice-data">{invoice.paymentMethod}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                 </table>
                                 <div>
                                 {invoiceProducts && (
                                     <div className="invoice-products-table">
                                      <h3>Invoice Products</h3>
                                         <table>
                                             <thead>
                                                 <tr>
                                                     <th>Product ID</th>
                                                     <th>Product Name</th>
                                                     <th>Category</th>
                                                     <th>Quantity</th>
                                                     <th>Price</th>
                                                     <th>Discount Type</th>
                                                     <th>Discount Value</th>
                                                      <th>GST</th>
                                                     <th>Coupon Code</th>
                                                     <th>Total Amount Per Product</th>
                                                  </tr>
                                              </thead>
                                          <tbody>
                                          {invoiceProducts.map((product) => (
                                                <tr key={product.id}>
                                                     <td>{product.productId}</td>
                                                     <td>{product.productName}</td> 
                                                     <td>{product.category}</td>
                                                     <td>{product.quantity}</td>
                                                     <td>{product.price}</td>
                                                     <td>{product.discountType}</td>
                                                     <td>{product.discountValue}</td>
                                                     <td>{product.gst}</td>
                                                     <td>{product.couponCode}</td>
                                                     <td>{product.totalAmountPerProduct}</td>
                                                </tr>
                                             ))}
                                         </tbody>
                                      </table>
                                     </div>
                                    )}
                                 </div>
                              </div>
              
                              </div>
                                 <div className="Block3">
                                     <div className="scrollable-table">
                                       <h5>Orderd Product</h5>
                                          <table className="ordered-product-list-section">
                                        <thead>
                                        <tr>
            
                                         <th className='TH'>Product ID</th>
                                         {' '}
                                          <th className='TH'>Product Name</th>
                                          {' '}
                                          <th className='TH'>Category</th> {/* Added Category column */}
                                          {' '}
                                         <th className='TH'>Quantity</th>
                                         {' '}
                                          <th className='TH'>Price</th>
                                         {' '}
                                         <th className='TH'>Discount Type</th>
                                          {' '}
                                         <th className='TH'>Discount Value</th>
                                         {' '}
                                          <th className='TH'>Coupon Code</th>
                                         {' '}
                                         <th className='TH'>GST</th>
                                          {' '}
                                         <th className='TH'>Total Amount</th>
                                          {' '}
                                         <th className='TH'>Actions</th>
                                         {' '}
                                 </tr>
                             </thead>
                       <tbody>
                        {orderProducts.map((orderProduct, index) => (
                            <tr key={index}>
                                <td>{orderProduct.productId}</td>
                                {' '}
                                <td>{orderProduct.productName}</td>
                                {' '}
                                <td>{orderProduct.category}</td> {/* Render Category */}
                                {' '}
                                <td>
                                    <FontAwesomeIcon icon={faMinus} onClick={() => handleQuantityChange(index, -1)} />
                                    {' '}
                                     <span>{orderProduct.quantity}</span>
                                     {' '}
                                    <FontAwesomeIcon icon={faPlus} onClick={() => handleQuantityChange(index, 1)} />
                                </td>
                                {' '}
                                <td>{orderProduct.price}</td>
                                {' '}
                                <td>{orderProduct.discountType}</td>
                                {' '}
                                <td>{orderProduct.discountValue}</td>
                                {' '}
                                <td>{orderProduct.couponCode}</td>
                                {' '}
                                <td>{orderProduct.gst}</td>
                                {' '}
                                <td>{orderProduct.totalAmount} </td>
                                {' '}
                                <td>
                                    <button className='RemoveButton' onClick={() => handleRemoveProduct(index)}><FaTrash />{' '}Remove</button>
                                </td>
                            </tr>
                        ))}
                    
                    </tbody>
                </table>
            </div>
            </div>
                <div className='GenerateInvoice' >
                      {/* Button to toggle visibility of GenerateInvoice component */}
                      <button  className='ButtonGenerateInvoice' onClick={() => setShowGenerateInvoice(!showGenerateInvoice)}>Generate Invoice </button>
                     {/* Conditionally render GenerateInvoice component */}
                      {showGenerateInvoice && <GenerateInvoice orderProducts={orderProducts} onClose={handleCloseInvoice} invoiceNumber={invoiceNumber} paymentMethod={payment} deliveryCharge={deliveryCharge}  shoppingBagQuantity={shoppingBagQuantity}  setShoppingBagQuantity={setShoppingBagQuantity}/>}
                </div>
        </div>
    );
};

export default InvoiceManagement;