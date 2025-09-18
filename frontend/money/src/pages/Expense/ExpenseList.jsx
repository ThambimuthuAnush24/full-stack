import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expenseService } from '../../services/api';
import DateRangePicker from '../../components/ui/DateRangePicker';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/Transactions.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  
  useEffect(() => {
    fetchExpenses();
  }, [dateRange]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getByDateRange({
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0]
      });
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load expense data. Please try again later.');
      console.error('Error fetching expense data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await expenseService.delete(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (err) {
        setError('Failed to delete expense record.');
        console.error('Error deleting expense:', err);
      }
    }
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

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

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  if (loading) {
    return <div className="loading-container">Loading expense data...</div>;
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Expenses</h1>
        <Link to="/expense/add" className="btn-primary">
          <FaPlus /> Add Expense
        </Link>
      </div>

      <div className="filter-section">
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={handleDateRangeChange} 
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="summary-total">
        <h3>Total Expenses: {formatCurrency(calculateTotal())}</h3>
      </div>

      {expenses.length === 0 ? (
        <div className="no-data">
          <p>No expense records found for the selected period.</p>
          <Link to="/expense/add" className="btn-primary">
            Add Your First Expense
          </Link>
        </div>
      ) : (
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td className="actions">
                    <Link to={`/expense/edit/${expense.id}`} className="edit-btn">
                      <FaEdit />
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;