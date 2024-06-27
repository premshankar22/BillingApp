import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdDescription, MdStorage, MdMoney, MdAttachMoney } from 'react-icons/md';
import './Navbar.css'; 

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                        <MdDashboard /> Dashboard
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/invoice" className="nav-link">
                        <MdDescription /> Invoice Management
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/log" className="nav-link">
                        <MdStorage /> Log Management
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/expense" className="nav-link">
                        <MdMoney /> Expense Management
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/Tax" className="nav-link">
                        <MdAttachMoney /> Tax Management
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/manageinvoice" className="nav-link">
                        <MdAttachMoney /> ManageInvoice
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
