import React from 'react';
import { COLORS } from '../../../assets/images';

const FinancialSummary = ({ totalIncome, totalExpense, balance }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="financial-summary">
      <div className="summary-card income card">
        <div className="card-icon-wrapper">
          <div className="card-icon" style={{ backgroundColor: `${COLORS.success}10` }}>
            <span role="img" aria-label="Income">💰</span>
          </div>
        </div>
        <div className="card-content">
          <h3>Total Income</h3>
          <p className="amount">{formatCurrency(totalIncome || 0)}</p>
        </div>
        <div className="trend-indicator positive">
          <span className="trend-arrow">↗</span>
        </div>
      </div>
      
      <div className="summary-card expense card">
        <div className="card-icon-wrapper">
          <div className="card-icon" style={{ backgroundColor: `${COLORS.danger}10` }}>
            <span role="img" aria-label="Expense">💸</span>
          </div>
        </div>
        <div className="card-content">
          <h3>Total Expense</h3>
          <p className="amount">{formatCurrency(totalExpense || 0)}</p>
        </div>
        <div className="trend-indicator negative">
          <span className="trend-arrow">↘</span>
        </div>
      </div>
      
      <div className="summary-card balance card">
        <div className="card-icon-wrapper">
          <div className="card-icon" style={{ backgroundColor: `${COLORS.info}10` }}>
            <span role="img" aria-label="Balance">💼</span>
          </div>
        </div>
        <div className="card-content">
          <h3>Balance</h3>
          <p className={`amount ${balance < 0 ? 'negative' : 'positive'}`}>
            {formatCurrency(balance || 0)}
          </p>
        </div>
        <div className={`trend-indicator ${balance < 0 ? 'negative' : 'positive'}`}>
          <span className="trend-arrow">{balance < 0 ? '↘' : '↗'}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;