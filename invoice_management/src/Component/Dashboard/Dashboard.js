import React from 'react';
import Navbar from './Navbar';
import SalesReport from './SalesReport'; // Import the SalesReport component

import './Dashboard.css';

const Dashboard = () => {
    return (
        <div>
            {/* Include the Navbar component */}
         { /* <Navbar /> */}

            {/* Render the SalesReport component */}
            <SalesReport />
        </div>
    );
}

export default Dashboard;
