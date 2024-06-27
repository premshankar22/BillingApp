import React, { useState, useEffect } from 'react';
import './SalesReport.css';
import { Box } from '@mui/material';
import { AttachMoney, TrendingUp, TrendingDown } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShoppingBag, faTrophy, faChartPie} from '@fortawesome/free-solid-svg-icons';
import Chart from 'chart.js/auto';
import { saveAs } from 'file-saver';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


let dailySalesChart = null;


const SalesReport = () => {
    const [salesReport, setSalesReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [sortCriteria, setSortCriteria] = useState('date');
    

    useEffect(() => {
        fetchSalesReport();
    }, [searchQuery]);

    const fetchSalesReport = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/sales-report?search=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Failed to fetch sales report data');
            }
            const data = await response.json();
            setSalesReport(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching sales report data:', error);
            setError('Failed to fetch sales report data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExportData = () => {
        if (salesReport) {
            const csvData = convertToCSV(salesReport);
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, 'sales_report.csv');
        }
    };

    const convertToCSV = (data) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return ''; // Return empty string if data is invalid or empty
        }
    
        const headers = Object.keys(data[0]); // Get headers from the first object in the array
        const csvContent = [headers.join(',')]; // Initialize CSV content with headers
    
        data.forEach(item => {
            const values = headers.map(header => {
                const value = item[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value; // Wrap values containing commas in double quotes
            });
            csvContent.push(values.join(','));
        });
    
        return csvContent.join('\n'); // Join CSV rows with newline characters
    };
    

    const handleFilterStartDateChange = (event) => {
        setFilterStartDate(event.target.value);
    };

    const handleFilterEndDateChange = (event) => {
        setFilterEndDate(event.target.value);
    };

    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const applyFilterAndSort = () => {

        if (!salesReport || !salesReport.filteredSalesData) {
            console.error('Sales report data is not available.');
            return;
        }

        let filteredData = salesReport; // Assume salesReport contains the entire sales data

         // Check if filteredData is an array
         if (!Array.isArray(filteredData)) {
            console.error('Filtered data is not an array.');
            return;
        }

    
        // Apply date filter if both start and end dates are provided
        if (filterStartDate && filterEndDate) {
            filteredData = filteredData.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate >= new Date(filterStartDate) && saleDate <= new Date(filterEndDate);
            });
        }
    
        // Apply sorting based on the selected criteria
        switch (sortCriteria) {
            case 'date':
                filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'sales':
                filteredData.sort((a, b) => a.totalSales - b.totalSales);
                break;
            case 'product':
                filteredData.sort((a, b) => a.productName.localeCompare(b.productName));
                break;
            default:
                break;
        }
    
        // Now filteredData contains the sales data after applying filter and sort criteria
        // You can update the state or perform any other actions with the filteredData
    };



    const renderDailySalesGraph = () => {
        if (!salesReport || !salesReport.dailySales) {
            console.error('Sales report data is not available.');
            return;
        }
    
        const ctx = document.getElementById('dailySalesChart');
    
        // Destroy existing Chart instance if it exists
        if (dailySalesChart) {
            dailySalesChart.destroy();
        }
    
        // Create Chart instance
        dailySalesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: salesReport.dailySales.map(day => day.date),
                datasets: [{
                    label: 'Daily Sales',
                    data: salesReport.dailySales.map(day => day.totalSales),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ], // Bar color
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ], // Border color
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Start y-axis from zero
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip background color
                        borderColor: 'rgba(0, 0, 0, 0.8)', // Tooltip border color
                        borderWidth: 1, // Tooltip border width
                        titleColor: '#fff', // Tooltip title color
                        bodyColor: '#fff' // Tooltip body color
                    }
                },
                animation: {
                    duration: 2000, // Animation duration in milliseconds
                    easing: 'easeInOutQuart' // Easing function
                }
            }
        });
    };
    
     
    useEffect(() => {
        renderDailySalesGraph(); // Render graph on initial load and whenever salesReport changes
    }, [salesReport]);

    


    return (
        <div className="sales-report">
            <h2>Sales Report</h2>
            <div>
            <div>
                <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." />
                <Button variant="contained" onClick={handleExportData}>Export Data</Button>
            </div>
            <div>
                <TextField
                    id="filterStartDate"
                    label="Filter Start Date"
                    type="date"
                    value={filterStartDate}
                    onChange={handleFilterStartDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="filterEndDate"
                    label="Filter End Date"
                    type="date"
                    value={filterEndDate}
                    onChange={handleFilterEndDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="sortCriteriaLabel">Sort By</InputLabel>
                    <Select
                        labelId="sortCriteriaLabel"
                        id="sortCriteriaSelect"
                        value={sortCriteria}
                        onChange={handleSortCriteriaChange}
                    >
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="sales">Sales</MenuItem>
                        <MenuItem value="product">Product</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={applyFilterAndSort}>Apply</Button>
            </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                salesReport && (
                    <div className="grid-container">
                        {/* Header */}
                        <div className="header">
                        <Box className="header" gridColumn="span 2">
                            <Box className="option-box" display="flex" alignItems="center">
                            <AttachMoney />
                                <p>Total Sales: {salesReport.totalSales}</p>
                            </Box>
                            <Box className="option-box" display="flex" alignItems="center">
                                <AttachMoney />
                                <p> Tax colletion:  ₹{salesReport.totalGST}</p>
                            </Box>
                            <Box className="option-box" display="flex" alignItems="center">
                                <TrendingUp />
                                <p>Profit : {salesReport.profitPercentage}%</p>
                            </Box>
                            <Box className="option-box" display="flex" alignItems="center">
                                <TrendingDown />
                                <p>Loss : {salesReport.lossPercentage}%</p>
                            </Box>
                        </Box>
                        </div>
                        {/* Block 1 */}
                        <div className="block1">
                            <h3>Top Selling Product</h3>
                            <p>{salesReport.topSellingProduct ? `${salesReport.topSellingProduct.productName} (${salesReport.topSellingProduct.quantity} units)` : 'N/A'}</p>
                            <Box className="top-selling-icon" style={{ textAlign: 'center' }}>
                                <FontAwesomeIcon icon={faTrophy} size="3x" style={{ color: 'gold' }} />
                           </Box>
                        </div>
                        {/* Block 2 */}
                        <div className="block">
                             <div className="block-header">
                                   <h3 className='AAA'> <FontAwesomeIcon icon={faTruck} /> Delivery Profit</h3>
                                    <p>{salesReport.totalDeliveryProfit}</p>
                             </div>
                             <div className="block-content">
                                    <h3 className='AAA'>  <FontAwesomeIcon icon={faShoppingBag} />Shopping Bag</h3>
                                    <p>Quantity: {salesReport.totalShoppingBagQuantity}</p>
                                    <p>Profit: {salesReport.totalShoppingBagProfit}</p>
                                </div>
                          </div>
                        {/* Block 3 */}
                        <div className="block3"> 
                            <h3>Daily Sales</h3>
                                <canvas id="dailySalesChart"></canvas> 
                        </div>
                        {/* Payment Types */}
                        <div className="payment-types">
                            <h3>Payment Types</h3>
                            <ul>
                                {salesReport.paymentTypes.map(type => (
                                    <li key={type.paymentMethod}>
                                        {type.paymentMethod}: {type.quantity} ({type.percentage.toFixed(2)}%)
                                        <div className="circle-container">
                                        <div className="circle" style={{ background: `conic-gradient(#51f442 0% ${type.percentage}%, #f5b60a ${type.percentage}% 100%)` }}></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Category Sales */}
                        <div>
                        <div className="category-sales">
                            <h3><FontAwesomeIcon icon={faChartPie} size="1x" style={{ color: '#007bff', marginBottom: '1px' }} />{' '}Category Sales</h3>
                            <ul>
                                {salesReport.categorySales && salesReport.categorySales.map(categorySale => (
                                    <li key={categorySale.category}>
                                        {categorySale.category}: {categorySale.totalQuantity} units
                                    </li>
                                ))}
                            </ul>
                        </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default SalesReport;