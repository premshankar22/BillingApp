import React, {useRef} from 'react';
import './GenerateInvoice.css';

const GenerateInvoice = ({ orderProducts, onClose,  paymentMethod, deliveryCharge, shoppingBagQuantity, setShoppingBagQuantity }) => {
    const invoiceRef = useRef(null);
    
    const generateInvoiceNumber = () => {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `INV-${timestamp}-${random}`;
    };

    const calculateSubtotal = () => {
        return orderProducts.reduce((subtotal, item) => subtotal + (item.price * item.quantity), 0).toFixed(2);
    };
    

    const calculateTotalAmount = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const totalAmount = subtotal + parseFloat(deliveryCharge) + (shoppingBagQuantity * 10);
        return totalAmount.toFixed(2);
    };


    const handleClose = () => {
        if (typeof onClose === 'function') {
            onClose(); // Call onClose only if it's a function
        }
    };


    const handlePrint = () => {
        try {
            const content = generatePrintableContent();
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Invoice</title>
                        <style>
                            /* Add any custom styles for printing here */
                            @media print {
                                body * {
                                    visibility: hidden;
                                }
                                #invoice-container, #invoice-container * {
                                    visibility: visible;
                                }
                                #invoice-container {
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    width: 100%;
                                }
                            }
                        </style>
                    </head>
                    <body>${content}</body>
                </html>
            `);
            newWindow.document.close();
            newWindow.print();
        } catch (error) {
            console.error('Error printing invoice:', error);
        }
    };

    const generatePrintableContent = () => {
        let content = `<div id="invoice-container">`;
        content += `<div className="invoice-header">`;
        content += `<h2 className='Invoice' >Invoice : #${generateInvoiceNumber()}</h2>`;
        content += `<p className='Date'>Date: ${new Date().toLocaleDateString()}</p>`;
        content += `</div>`;
        content += `<div className="invoice-details">`;
        content += `<h5 className='InvoiceItem'>Invoice Item</h5>`;
        content += `<table>`;
        content += `<thead><tr>`;
        content += `<th className='TH'>Product ID</th>`;
        content += `<th className='TH'>Product Name</th>`;
        content += `<th className='TH'>Quantity</th>`;
        content += `<th className='TH'>Unit Price</th>`;
        content += `<th className='TH'>Discount Type</th>`;
        content += `<th className='TH'>Discount Value</th>`;
        content += `<th className='TH'>GST Value</th>`;
        content += `<th className='TH'>Coupon Code</th>`;
        content += `<th className='TH'>Total Amount (₹) </th>`;
        content += `</tr></thead><tbody>`;
        orderProducts.forEach((item, index) => {
            content += `<tr key=${index}>`;
            content += `<td>${item.productId}</td>`
            content += `<td>${item.productName}</td>`;
            content += `<td>${item.quantity}</td>`;
            content += `<td>${item.price}</td>`;
            content += `<td>${item.discountType}</td>`;
            content += `<td>${item.discountType === 'amount' && !isNaN(parseFloat(item.discountValue)) ? parseFloat(item.discountValue).toFixed(2) : `${item.discountValue}%`}</td>`;
            content += `<td>${item.gst}</td>`;
            content += `<td>${item.couponCode}</td>`;
            content += `<td>${typeof item.totalAmount === 'number' ? item.totalAmount.toFixed(2) : 'N/A'}</td>`;
            content += `</tr>`;
        });
        content += `</tbody></table>`;
        content += `</div>`;
        content += `<div className="total-amount-container">`;
        content += `<p className="subtotal">Subtotal: ₹${calculateSubtotal()}</p>`;
        content += `<p className="shopping-bag-charge">Shopping Bag Charge: ₹${(shoppingBagQuantity * 10).toFixed(2)}</p>`;
        content += `<p className="delivery-charge">Delivery Charge: ₹${deliveryCharge.toFixed(2)}</p>`;
        content += `<h5 className="total-amount-title">Total Amount</h5>`;
        content += `<p className="total-amount-value">₹${calculateTotalAmount()}</p>`;
        content += `</div>`;
        content += `<div className="payment-method-container">`;
        content += `<p className="payment-method">Payment Method: ${paymentMethod}</p>`;
        content += `</div>`;
        content += `</div>`;
        return content;
    };

    const saveInvoice = async () => {
        try {
            const invoiceNumber = generateInvoiceNumber();
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
            const response = await fetch('http://localhost:3000/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    invoiceNumber,
                    date:  formattedDate,
                    products: orderProducts.map(item => ({
                        productId: item.productId,
                        productName: item.productName,
                        category: item.category,
                        quantity: item.quantity,
                        price: item.price,
                        discountType: item.discountType,
                        discountValue: item.discountValue,
                        gst: item.gst,
                        couponCode: item.couponCode,
                        totalAmountPerProduct: (item.totalAmount + (item.gst * item.totalAmount / 100)).toFixed(2) // Add GST to the total amount per product
                    })),
                    deliveryCharge,
                    shoppingBag: {
                        quantity: shoppingBagQuantity,
                        pricePerItem: 10, // Assuming fixed price per item
                        totalCharge: shoppingBagQuantity * 10
                    },
                    subtotal: calculateSubtotal(),
                    totalAmountOCP: calculateTotalAmount(),
                    paymentMethod
                })
            });
            // Handle response as needed
            if (response.ok) {
                // If the response is successful, reset the form
                onClose(); // Close the form
                setShoppingBagQuantity(0); // Reset shopping bag quantity
            } else {
                console.error('Failed to save invoice:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    return (
        <div className="invoice-container10"  ref={invoiceRef}>
            <div className="invoice-header11">
                <h2 className='Invoice' >Invoice : #{generateInvoiceNumber()}</h2>
                <p className='Date'>Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="invoice-details">
                <h5 className='InvoiceItem'>Invoice Item</h5>
                <table>
                    <thead>
                        <tr>
                            <th className='TH'>Product ID</th>
                            <th className='TH'>Product Name</th>
                            <th className='TH'>Category</th>
                            <th className='TH'>Quantity</th>
                            <th className='TH'>Unit Price</th>
                            <th className='TH'>Discount Type</th>
                            <th className='TH'>Discount Value</th>
                            <th className='TH'>GST Value</th>
                            <th  className='TH'>Coupon Code</th>
                            <th className='TH'>Total Amount (₹) </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderProducts.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productId}</td>
                                <td>{item.productName}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.discountType}</td>
                                <td>
                                    
                                {item.discountType === 'amount' && !isNaN(parseFloat(item.discountValue)) ? parseFloat(item.discountValue).toFixed(2) : `${item.discountValue}%`}
                                </td>
                                <td>{item.gst}</td>
                                <td>{item.couponCode}</td>
                                <td>{typeof item.totalAmount=== 'number' ? item.totalAmount.toFixed(2) : 'N/A'}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>
            <div className="total-amount-container">
                <p className="subtotal">Subtotal: ₹{calculateSubtotal()}</p>
                <div>
                <label>Shopping Bag Quantity:</label>
                <input
                    type="number"
                    value={shoppingBagQuantity}
                    onChange={(e) => setShoppingBagQuantity(parseInt(e.target.value))}
                />
            </div>
                <p className="delivery-charge">Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
                <h5 className="total-amount-title">Total Amount</h5>
               {/*<p className="total-amount-value">₹{calculateTotalAmount()} </p> */} 
               <input type="text" className="total-amount-value" value={"₹" + calculateTotalAmount()} readOnly />
            </div>
            <div className="payment-method-container">
                <p className="payment-method">Payment Method: {paymentMethod}</p>
            </div>
            <div className="button-container">
                <button onClick={handleClose}>Close</button>
                <button onClick={handlePrint}>Print</button>
                <button onClick={saveInvoice}>Save</button> 
            </div>
        </div>
    );
};

export default GenerateInvoice;

