import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Component/Dashboard/Navbar';
import Dashboard from './Component/Dashboard/Dashboard';
import InvoiceManagement from './Component/InvoiceManagement/InvoiceManagement';
import LogManagement from './Component/LogManagement/LogManagement';
import ExpenseManagement from './Component/ExpenseManagement/ExpenseManagement';
import TaxManagement from './Component/TaxManagement/TaxManagement';
import ManageInvoice from './Component/ManageInvoice/ManageInvoice';
//import LoginForm from './Component/LoginForm/LoginForm'; 
//import './App.css';

const App = () => {


    return (
        <Router>
            <div>
               <Navbar /> 
               <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/invoice" element={<InvoiceManagement />} />
                    <Route path="/log" element={<LogManagement />} />
                    <Route path="/expense" element={<ExpenseManagement />} />
                    <Route path="/tax" element={<TaxManagement />} />
                    <Route path="/manageinvoice" element={<ManageInvoice/>}/>
                    <Route path="/" element={<InvoiceManagement />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;


