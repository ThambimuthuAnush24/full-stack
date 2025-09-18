import React from 'react';
import { Link } from 'react-router-dom';

const RecentTransactions = ({ recentIncomes = [], recentExpenses = [] }) => {
  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format amount as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Combine incomes and expenses, sort by date (newest first)
  const transactions = [
    ...recentIncomes.map(income => ({
      ...income,
      type: 'income',
    })),
    ...recentExpenses.map(expense => ({
      ...expense,
      type: 'expense',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get the 10 most recent transactions
  const recentTransactions = transactions.slice(0, 10);

  if (recentTransactions.length === 0) {
    return (
      <div className="recent-transactions">
        <div className="section-header">
          <h3>Recent Transactions</h3>
        </div>
        <p className="no-data">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="recent-transactions">
      <div className="section-header">
        <h3>Recent Transactions</h3>
        <div className="section-actions">
          <Link to="/income" className="btn-small">View All Income</Link>
          <Link to="/expense" className="btn-small">View All Expenses</Link>
        </div>
      </div>
      
      <div className="transactions-list">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr 
                key={`${transaction.type}-${transaction.id}`}
                className={transaction.type}
              >
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td className="amount">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="transaction-type">
                  <span className={`badge ${transaction.type}`}>
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;