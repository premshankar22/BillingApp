import React, {useState} from 'react';
import './ManageInvoice.css';

const ManageInvoice = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`YOUR_BACKEND_API_ENDPOINT?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setSearchResult(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    return (
        <div className="invoice-container">
        <div className="block-1">Block 1 (Right Side)
        <h2>Search Invoices</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter search query"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
                <div className="search-result">
                    {/* Display search results here */}
                    {searchResult.map((invoice) => (
                        <div key={invoice.id}>
                            {/* Display individual invoice data */}
                            {/* Example: <p>{invoice.invoiceNumber}</p> */}
                        </div>
                    ))}
                </div>
        </div>
        <div className="block-2">Block 2 (Left Side)</div>
        <div className="block-3">Block 3 (Bottom)</div>
    </div>
    );
}

export default ManageInvoice;