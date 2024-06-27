import React, { useState, useEffect } from 'react';
import { Table, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaSync } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import './ExpenseManagement.css';
import * as XLSX from 'xlsx';



const categories = [
    'Inventory Costs',
    'Operating Expenses',
    'Employee Expenses',
    'Marketing and Advertising',
    'Maintenance and Repairs',
    'Taxes and Licenses',
    'Transportation and Delivery',
    'Professional Services'
  ];

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState([]);


  const [newExpense, setNewExpense] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    paymentMethod: '',
    receiptNumber: '',
    vendor: '',
    tax: '',
    currency: '',
    paymentStatus: '',
    attachments: '',
    tags: ''
  });


  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
};

const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
};


  const handleAddExpense = async () => {
    try {
        await fetch('http://localhost:3000/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newExpense)
        });
        // Fetch updated list of expenses after adding
      //  fetchExpenses();
        // Clear input fields
        setNewExpense({
            date: '',
            category: '',
            description: '',
            amount: '',
            paymentMethod: '',
            receiptNumber: '',
            vendor: '',
            tax: '',
            currency: '',
            paymentStatus: '',
            attachments: '',
            tags: ''
        });
    } catch (error) {
        console.error('Error adding expense:', error);
    }
};
const handleSearch = () => {
  console.log("Search term:", searchTerm);
  if (searchTerm.trim() === '') {
      setFilteredExpenses(expenses); // Return all expenses if search term is empty
  } else {
      const filtered = expenses.filter(expense => (
          expense.id.toString().includes(searchTerm) ||
          expense.date.toString().includes(searchTerm) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.amount.toString().includes(searchTerm) ||
          expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.tags.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setFilteredExpenses(filtered);
  }
};

 useEffect(() => {
  setFilteredExpenses(expenses);
}, [searchTerm]);

useEffect(() => {
  if (searchTerm.trim() === '') {
      setFilteredExpenses(expenses);
  }
}, [searchTerm, expenses]);

  const toggleModal = () => {
    setModal(!modal);
  };

  // Function to handle refreshing the view or state
const handleRefresh = () => {
    // Reset the search term
    setSearchTerm('');
    // Reset the filtered expenses to the original list of expenses
    setFilteredExpenses(expenses);

};
// Function to handle selecting an expense
const handleSelectExpense = (expenseId) => {
  const isSelected = selectedExpenses.includes(expenseId);
  if (isSelected) {
    setSelectedExpenses(selectedExpenses.filter(id => id !== expenseId));
  } else {
    setSelectedExpenses([...selectedExpenses, expenseId]);
  }
};
   
 // Function to export selected expenses to Excel
 const handleExportSelectedToExcel = () => {
  const headers = [
    'ID',
    'Date',
    'Category',
    'Description',
    'Amount',
    'Payment Method',
    'Receipt/Invoice Number',
    'Vendor/Supplier',
    'Tax',
    'Currency',
    'Payment Status',
    'Attachments',
    'Tags'
  ];

  const selectedData = expenses.filter(expense => selectedExpenses.includes(expense.id)).map(expense => {
    return {
      ID: expense.id,
      Date: format(new Date(expense.date), 'MM/dd/yyyy'),
      Category: expense.category,
      Description: expense.description,
      Amount: expense.amount,
      'Payment Method': expense.paymentMethod,
      'Receipt/Invoice Number': expense.receiptNumber,
      'Vendor/Supplier': expense.vendor,
      Tax: expense.tax,
      Currency: expense.currency,
      'Payment Status': expense.paymentStatus,
      Attachments: expense.attachments.join(', '), // Assuming attachments is an array of filenames
      Tags: Array.isArray(expense.tags) ? expense.tags.join(', ') : '' // Check if tags is an array before joining
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(selectedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedExpenses');
  XLSX.writeFile(workbook, 'selected_expenses.xlsx');
};


 const fetchExpensesFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:3000/expenses');
      const data = await response.json();
      console.log("Fetched expenses:", data);
      setExpenses(data);
      setFilteredExpenses(data); // Initialize filteredExpenses with all expenses
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

    useEffect(() => {
        fetchExpensesFromBackend();
      }, []);
    

      useEffect(() => {
        console.log("filteredExpenses before filtering:", filteredExpenses);
        // Fetch all expenses when search term is empty
        if (searchTerm.trim() === '') {
            setFilteredExpenses(expenses);
        } else {
            // Fetch filtered expenses based on search term
            const fetchFilteredExpenses = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/expenses/${searchTerm}`);
                    const data = await response.json();
                    console.log("Filtered expenses data:", data);
                    setFilteredExpenses(data);
                } catch (error) {
                    console.error('Error fetching filtered expenses:', error);
                }
            };
            fetchFilteredExpenses();
        }
    }, [searchTerm]);


    
    const handleDeleteExpense = async (expenseId) => {
        try {
          const response = await fetch(`http://localhost:3000/expenses/${expenseId}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          console.log(data); // Log the response from the server
          // Perform any necessary updates to the UI after successful deletion
        } catch (error) {
          console.error('Error deleting expense:', error);
          // Handle error condition appropriately
        }
 };


    
    

  return (
    <div className="expense-management">
      <h2 className="title">Expense Management</h2>
      <Form className="search-form">
        <FormGroup>
          <Label for="searchTerm">Search:</Label>
          <Input type="text" name="searchTerm" id="searchTerm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button color="primary" onClick={handleSearch}>Search</Button>
        </FormGroup>
      </Form>
      <Form>
        <FormGroup>
          <Label for="date">Date:</Label>
          <Input type="date" name="date" id="date" value={newExpense.date} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
        <Label for="category">Category:</Label>
          <Input type="select" name="category" id="category" value={newExpense.category} onChange={handleInputChange}>
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="description">Description:</Label>
          <Input type="text" name="description" id="description" value={newExpense.description} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="amount">Amount:</Label>
          <Input type="number" name="amount" id="amount" value={newExpense.amount} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="paymentMethod">Payment Method:</Label>
          <Input type="text" name="paymentMethod" id="paymentMethod" value={newExpense.paymentMethod} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="receiptNumber">Receipt/Invoice Number:</Label>
          <Input type="text" name="receiptNumber" id="receiptNumber" value={newExpense.receiptNumber} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="vendor">Vendor/Supplier:</Label>
          <Input type="text" name="vendor" id="vendor" value={newExpense.vendor} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="tax">Tax:</Label>
          <Input type="number" name="tax" id="tax" value={newExpense.tax} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="currency">Currency:</Label>
          <Input type="text" name="currency" id="currency" value={newExpense.currency} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="paymentStatus">Payment Status:</Label>
          <Input type="text" name="paymentStatus" id="paymentStatus" value={newExpense.paymentStatus} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="attachments">Attachments:</Label>
          <Input type="file" name="attachments" id="attachments" onChange={handleFileInputChange} />
        </FormGroup>
        <FormGroup>
          <Label for="tags">Tags:</Label>
          <Input type="text" name="tags" id="tags" value={newExpense.tags} onChange={handleInputChange} />
        </FormGroup>
        <Button color="primary" onClick={handleAddExpense}>Add Expense</Button>{' '}
        <Button color="secondary" onClick={handleRefresh}><FaSync /> Refresh</Button>
      </Form>
      <div className="export-buttons">
      <Button color="success" onClick={handleExportSelectedToExcel}>Export to Excel</Button>{' '}
      <CSVLink data={exportData} filename={"expenses.csv"}>
        Export as CSV
      </CSVLink>
      </div>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Receipt/Invoice Number</th>
            <th>Vendor/Supplier</th>
            <th>Tax</th>
            <th>Currency</th>
            <th>Payment Status</th>
            <th>Attachments</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense, index) => (
            <tr key={index} onClick={() => handleSelectExpense(expense.id)}> {/* Add onClick handler */}
              <td>{expense.id}</td>
              <td>{format(new Date(expense.date), 'MM/dd/yyyy')}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>{expense.paymentMethod}</td>
              <td>{expense.receiptNumber}</td>
              <td>{expense.vendor}</td>
              <td>{expense.tax}</td>
              <td>{expense.currency}</td>
              <td>{expense.paymentStatus}</td>
              <td>{expense.attachments}</td>
              <td>{expense.tags}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal className='Expenses' isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Expense</ModalHeader>
        <ModalBody>
          {/* Add form inputs for new expense */}
          <Form>
            <FormGroup>
              <Label for="date">Date:</Label>
              <Input type="date" name="date" id="date" value={newExpense.date} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="category">Category:</Label>
              <Input type="text" name="category" id="category" value={newExpense.category} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description:</Label>
              <Input type="text" name="description" id="description" value={newExpense.description} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="amount">Amount:</Label>
              <Input type="number" name="amount" id="amount" value={newExpense.amount} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="paymentMethod">Payment Method:</Label>
              <Input type="text" name="paymentMethod" id="paymentMethod" value={newExpense.paymentMethod} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="receiptNumber">Receipt/Invoice Number:</Label>
              <Input type="text" name="receiptNumber" id="receiptNumber" value={newExpense.receiptNumber} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="vendor">Vendor/Supplier:</Label>
              <Input type="text" name="vendor" id="vendor" value={newExpense.vendor} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="tax">Tax:</Label>
              <Input type="number" name="tax" id="tax" value={newExpense.tax} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="currency">Currency:</Label>
              <Input type="text" name="currency" id="currency" value={newExpense.currency} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="paymentStatus">Payment Status:</Label>
              <Input type="text" name="paymentStatus" id="paymentStatus" value={newExpense.paymentStatus} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="attachments">Attachments:</Label>
              <Input type="text" name="attachments" id="attachments" value={newExpense.attachments} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="tags">Tags:</Label>
              <Input type="text" name="tags" id="tags" value={newExpense.tags} onChange={handleInputChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddExpense}>Add</Button>{' '}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ExpenseManagement;
