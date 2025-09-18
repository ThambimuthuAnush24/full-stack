import React from 'react';

const FinancialSummary = ({ totalIncome, totalExpense, balance }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="financial-summary">
      <div className="summary-card income">
        <h3>Total Income</h3>
        <p className="amount">{formatCurrency(totalIncome || 0)}</p>
      </div>
      
      <div className="summary-card expense">
        <h3>Total Expense</h3>
        <p className="amount">{formatCurrency(totalExpense || 0)}</p>
      </div>
      
      <div className="summary-card balance">
        <h3>Balance</h3>
        <p className={`amount ${balance < 0 ? 'negative' : ''}`}>
          {formatCurrency(balance || 0)}
        </p>
      </div>
    </div>
  );
};

export default FinancialSummary;