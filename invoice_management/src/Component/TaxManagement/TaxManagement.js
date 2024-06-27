import React, { useState, useEffect } from 'react';
import { Table, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TaxManagement.css';
import { format } from 'date-fns';
import { FormFeedback } from 'reactstrap';
import { FaSync, FaSearch, FaPlus, FaTrash, FaEdit, FaExclamationCircle } from 'react-icons/fa'; 

const LowStockAlert = ({ product }) => {
  const [showAlert, setShowAlert] = useState(() => {
    // Initialize showAlert state based on local storage
    const isLowStock = localStorage.getItem(`lowStock_${product.id}`);
    return isLowStock === 'true';
  });

  useEffect(() => {
    const isLowStock = product.quantity < 50; // Threshold set to 50
    setShowAlert(isLowStock);

    // Update local storage when showAlert changes
    localStorage.setItem(`lowStock_${product.id}`, isLowStock);
  }, [product]);

  return (
    <div className={`low-stock-alert ${showAlert ? 'show' : ''}`}>
      {showAlert && <FaExclamationCircle />}
      <span className='Indicator'>{product.name} is {showAlert ? 'low' : 'not low'} in stock</span>
    </div>
  );
};



const TaxManagement = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: '',
    quantity: '',
    category: '',
    gstRate: '',
    date: '',
    discountType: '',
    discountValue: ''
  });
  const [modal, setModal] = useState(false);

  useEffect(() => {
    console.log('Fetching products...');
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('Products:', products);
  }, [products]);

  const fetchProducts = async (productId = null) => {
    setIsLoading(true);
    try {
      let url = 'http://localhost:3000/products'; // Updated URL to match the backend server
      if (productId) {
        url += `/${productId}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleSearch = async () => {
    setIsLoading(true);
    try {
      let url = 'http://localhost:3000/products';
      if (searchId) {
        url += `/${searchId}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNewProductToDatabase(newProduct);
      setNewProduct({ id: '', name: '', price: '', quantity: '', category: '', gstRate: '', date: '', discountType: '', discountValue: '' });
      setError(null);
      toggleModal();
    } catch (error) {
      console.error('Error adding new product:', error);
      setError('Failed to add new product. Please try again later.');
    }
  };

  const validateInput = (product) => {
    return product.id && product.name && product.price && product.quantity && product.category && product.gstRate && product.date && product.discountType && product.discountValue;
  };

  const addNewProductToDatabase = async (product) => {
    try {
      const response = await fetch('http://localhost:3000/products', { // Updated URL to match the backend server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      await fetchProducts();
    } catch (error) {
      throw error;
    }
  };

  //**************************************************** */
 
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`, { // Updated URL to match the backend server
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again later.');
      }
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEdit = (id) => {
    setEditProductId(id);
    const productToEdit = products.find(product => product.id === id);
    setNewProduct(productToEdit);
    toggleModal();
  };

  const handleCancelEdit = () => {
    setEditProductId(null);
    setNewProduct({ id: '', name: '', price: '', quantity: '', category: '', gstRate: '', date: '', discountType: '', discountValue: '' });
    toggleModal();
  };

  const handleSaveEdit = async () => {
    if (!validateInput(newProduct)) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/products/${editProductId}`, { // Updated URL to match the backend server
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      await fetchProducts();
      toggleModal();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again later.');
    }
  };
  
 
  
  return (
    <div className='Hero'>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2 className="slideIn">Product Management</h2>
      <Form>
        <FormGroup>
          <Label for="searchId">Search by ID:</Label>
          <Input type="text" name="searchId" id="searchId" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
          <Button  className='SearchButton' onClick={handleSearch}> <FaSearch /> {' '} Search</Button>
        </FormGroup>
      </Form>
      <div>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="id">Product ID:</Label>
            <Input type="text" name="id" id="id" value={newProduct.id} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Product Name:</Label>
            <Input type="text" name="name" id="name" value={newProduct.name} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="price">Price:</Label>
            <Input type="number" name="price" id="price" value={newProduct.price} onChange={handleInputChange} />
            <FormFeedback>{newProduct.price <= 0 ? 'Price must be greater than zero.' : ''}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="quantity">Quantity:</Label>
            <Input type="number" name="quantity" id="quantity" value={newProduct.quantity} onChange={handleInputChange} />
            <FormFeedback>{newProduct.quantity <= 0 ? 'Quantity must be greater than zero.' : ''}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="category">Category:</Label>
            <Input type="select" name="category" id="category" value={newProduct.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              <option value="Groceries">Groceries</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="gstRate">GST Rate:</Label>
            <Input type="select" name="gstRate" id="gstRate" value={newProduct.gstRate} onChange={handleInputChange}>
              <option value="">Select GST Rate</option>
              {[0, 5, 12, 18, 28].map(rate => (
                <option key={rate} value={rate}>{rate}%</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="discountType">Discount Type:</Label>
            <Input type="select" name="discountType" id="discountType" value={newProduct.discountType} onChange={handleInputChange}>
              <option value="">Select Discount Type</option>
              <option value="amount">Amount</option>
              <option value="percentage">Percentage</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="discountValue">Discount Value:</Label>
            <Input type="number" name="discountValue" id="discountValue" value={newProduct.discountValue} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="date">Date:</Label>
            <Input type="date" name="date" id="date" value={newProduct.date} onChange={handleDateChange} />
          </FormGroup>
          <Button type="submit" className='AddProduct' color="primary"><FaPlus />{' '} Add Product</Button>
          {' '}
          <Button color="primary" className='Refresh' onClick={handleRefresh}>
        <FaSync /> Refresh
      </Button>
        </Form>
      </div>
      <div className="table-container">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>GST Rate (%)</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Date</th>
              <th>Action</th>
              <th>Low Stock Indicator</th>
            </tr>
          </thead>
          <tbody>
            { products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td className="scrollable-cell">{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.category}</td>
                <td>{product.gstRate}</td>
                <td>{product.discountType}</td>
                <td>{product.discountValue}</td>
                <td>{format(new Date(product.date), 'MM/dd/yyyy')}</td>
                <td>
                  <Button color="danger" className='Delete' onClick={() => handleDelete(product.id)}><FaTrash />{' '} Delete</Button>
                  {' '}
                  <Button color="primary" className='Edit' onClick={() => handleEdit(product.id)}><FaEdit /> {' '}Edit</Button>
                </td>
                <LowStockAlert product={product} />
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{editProductId ? 'Edit Product' : 'Add Product'}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="id">Product ID:</Label>
              <Input type="text" name="id" id="id" value={newProduct.id} onChange={handleInputChange} disabled={editProductId} />
            </FormGroup>
            <FormGroup>
              <Label for="name">Product Name:</Label>
              <Input type="text" name="name" id="name" value={newProduct.name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price:</Label>
              <Input type="number" name="price" id="price" value={newProduct.price} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="quantity">Quantity:</Label>
              <Input type="number" name="quantity" id="quantity" value={newProduct.quantity} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="category">Category:</Label>
              <Input type="select" name="category" id="category" value={newProduct.category} onChange={handleInputChange}>
                <option value="">Select Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="gstRate">GST Rate:</Label>
              <Input type="select" name="gstRate" id="gstRate" value={newProduct.gstRate} onChange={handleInputChange}>
                <option value="">Select GST Rate</option>
                {[0, 5, 12, 18, 28].map(rate => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="discountType">Discount Type:</Label>
              <Input type="select" name="discountType" id="discountType" value={newProduct.discountType} onChange={handleInputChange}>
                <option value="">Select Discount Type</option>
                <option value="amount">Amount</option>
                <option value="percentage">Percentage</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="discountValue">Discount Value:</Label>
              <Input type="number" name="discountValue" id="discountValue" value={newProduct.discountValue} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="date">Date:</Label>
              <Input type="date" name="date" id="date" value={newProduct.date} onChange={handleDateChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {editProductId ? <Button color="primary" onClick={handleSaveEdit}>Save Changes</Button> : <Button color="primary" onClick={handleSubmit}>Add Product</Button>}
          <Button color="secondary" onClick={handleCancelEdit}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default TaxManagement;