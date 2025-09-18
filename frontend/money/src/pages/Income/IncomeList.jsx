import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incomeService } from '../../services/api';
import DateRangePicker from '../../components/ui/DateRangePicker';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/Transactions.css';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  
  useEffect(() => {
    fetchIncomes();
  }, [dateRange]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await incomeService.getByDateRange({
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0]
      });
      setIncomes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load income data. Please try again later.');
      console.error('Error fetching income data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await incomeService.delete(id);
        setIncomes(incomes.filter(income => income.id !== id));
      } catch (err) {
        setError('Failed to delete income record.');
        console.error('Error deleting income:', err);
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
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  if (loading) {
    return <div className="loading-container">Loading income data...</div>;
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Income</h1>
        <Link to="/income/add" className="btn-primary">
          <FaPlus /> Add Income
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
        <h3>Total Income: {formatCurrency(calculateTotal())}</h3>
      </div>

      {incomes.length === 0 ? (
        <div className="no-data">
          <p>No income records found for the selected period.</p>
          <Link to="/income/add" className="btn-primary">
            Add Your First Income
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
              {incomes.map((income) => (
                <tr key={income.id}>
                  <td>{formatDate(income.date)}</td>
                  <td>{income.category}</td>
                  <td>{income.description}</td>
                  <td className="amount">{formatCurrency(income.amount)}</td>
                  <td className="actions">
                    <Link to={`/income/edit/${income.id}`} className="edit-btn">
                      <FaEdit />
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(income.id)}
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

export default IncomeList;