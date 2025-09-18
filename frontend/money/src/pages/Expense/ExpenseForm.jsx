import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { expenseService, categoryService } from '../../services/api';
import { FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/TransactionForm.css';

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data.filter(cat => cat.type === 'EXPENSE'));
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();

    // If editing, fetch expense details
    if (isEditing) {
      const fetchExpense = async () => {
        setLoading(true);
        try {
          const response = await expenseService.getById(id);
          const expense = response.data;
          
          // Format date for input field (YYYY-MM-DD)
          const formattedDate = new Date(expense.date).toISOString().split('T')[0];
          
          setFormData({
            date: formattedDate,
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
          });
          
          setError(null);
        } catch (err) {
          setError('Failed to load expense data');
          console.error('Error fetching expense:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchExpense();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (isEditing) {
        await expenseService.update(id, payload);
      } else {
        await expenseService.create(payload);
      }

      navigate('/expense');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense');
      console.error('Error saving expense:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading-container">Loading expense data...</div>;
  }

  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Expense' : 'Add Expense'}</h1>
        <Link to="/expense" className="btn-secondary">
          <FaTimes /> Cancel
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter a description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;