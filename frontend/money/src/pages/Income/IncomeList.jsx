import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incomeService } from '../../services/api';
import DateRangePicker from '../../components/ui/DateRangePicker';
import { FaPlus, FaEdit, FaTrash, FaMoneyBillWave, FaFilter, FaChartLine } from 'react-icons/fa';
import '../../styles/Transactions.css';
import { ILLUSTRATIONS } from '../../assets/images';

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
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading income data...</p>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <div className="header-with-icon">
          <FaMoneyBillWave className="header-icon" />
          <h1>Income</h1>
        </div>
        <Link to="/income/add" className="btn-primary">
          <FaPlus /> Add Income
        </Link>
      </div>

      <div className="filter-section">
        <div className="filter-label">
          <FaFilter /> <span>Filter by date:</span>
        </div>
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={handleDateRangeChange} 
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="summary-card">
        <div className="summary-icon">
          <FaChartLine />
        </div>
        <div className="summary-content">
          <span className="summary-label">Total Income</span>
          <h3 className="summary-amount">{formatCurrency(calculateTotal())}</h3>
        </div>
      </div>

      {incomes.length === 0 ? (
        <div className="no-data">
          <div className="empty-state-illustration">
            <img src={ILLUSTRATIONS.income} alt="No income data" />
          </div>
          <p>No income records found for the selected period.</p>
          <Link to="/income/add" className="btn-primary btn-add-first">
            <FaPlus /> Add Your First Income
          </Link>
        </div>
      ) : (
        <div className="transactions-table">
          <div className="table-container">
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
                  <tr key={income.id} className="transaction-row">
                    <td className="date-cell">{formatDate(income.date)}</td>
                    <td className="category-cell">
                      <div className="category-tag">{income.category}</div>
                    </td>
                    <td className="description-cell">{income.description}</td>
                    <td className="amount amount-positive">{formatCurrency(income.amount)}</td>
                    <td className="actions">
                      <Link to={`/income/edit/${income.id}`} className="edit-btn" title="Edit">
                        <FaEdit />
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(income.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeList;