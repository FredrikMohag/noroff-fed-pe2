import React from "react";

const PriceCalculator = ({ nights, pricePerNight, vatRate }) => {
  const vatAmount = nights > 0 ? (nights * pricePerNight * vatRate).toFixed(2) : "0.00";
  const totalAmount = nights > 0 ? (nights * pricePerNight * (1 + vatRate)).toFixed(2) : "0.00";

  return (
    <div>
      <div className="d-flex justify-content-between">
        <p className="mb-1">VAT (25%)</p>
        <p className="mb-1">${vatAmount}</p>
      </div>
      <div className="d-flex justify-content-between">
        <h4>Total</h4>
        <h4>${totalAmount}</h4>
      </div>
    </div>
  );
};

export default PriceCalculator;
