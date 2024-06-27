import React, { useState } from 'react';
import { Button } from 'reactstrap';

const AdditionalCharges = ({ onAddDelivery }) => {
    const [showDelivery, setShowDelivery] = useState(false);

    const deliveryPrice = 40;

    const handleAddDelivery = () => {
        setShowDelivery(true);
        if (typeof onAddDelivery === 'function') {
            onAddDelivery(deliveryPrice);
        }
    };
   

    return (
        <div className='AdditionalCharges'>
           {showDelivery && (
                <div>
                    <h6>Additional Charges:</h6>
                    <p>Delivery - ₹{deliveryPrice}</p>
                    <p>Total Additional Charges: ₹{deliveryPrice}</p>
                </div>
            )}
             <div className='AdditionalChargeButtons'>
                {!showDelivery && <Button onClick={handleAddDelivery}>Add Delivery</Button>}
            </div>
        </div>
    );
};

export default AdditionalCharges;
