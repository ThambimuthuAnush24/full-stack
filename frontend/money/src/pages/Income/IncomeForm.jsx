import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { incomeService, categoryService } from '../../services/api';
import { FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/TransactionForm.css';
import { toast } from 'react-toastify';
import { getCategoryEmoji } from '../../utils/categoryUtils';

const IncomeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    emoji: '💰', // Default emoji
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (response.data && response.data.income) {
          setCategories(response.data.income);
        } else {
          // If no categories or incorrect format, create a default set
          setCategories([
            { name: 'Salary', emoji: '💰', color: '#28a745' },
            { name: 'Freelance', emoji: '💻', color: '#17a2b8' },
            { name: 'Investments', emoji: '📈', color: '#fd7e14' },
            { name: 'Other', emoji: '💲', color: '#6c757d' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // Set default categories on error
        setCategories([
          { name: 'Salary', emoji: '💰', color: '#28a745' },
          { name: 'Freelance', emoji: '💻', color: '#17a2b8' },
          { name: 'Investments', emoji: '📈', color: '#fd7e14' },
          { name: 'Other', emoji: '💲', color: '#6c757d' }
        ]);
      }
    };

    fetchCategories();

    // If editing, fetch income details
    if (isEditing) {
      const fetchIncome = async () => {
        setLoading(true);
        try {
          const response = await incomeService.getById(id);
          const income = response.data;
          
          // Format date for input field (YYYY-MM-DD)
          const formattedDate = new Date(income.date).toISOString().split('T')[0];
          
          setFormData({
            date: formattedDate,
            category: income.category,
            amount: income.amount,
            emoji: income.emoji || '💰', // Use the emoji if available, otherwise default
          });
          
          setError(null);
        } catch (err) {
          setError('Failed to load income data');
          console.error('Error fetching income:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchIncome();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category' && value === 'custom') {
      // For custom category, just update the form data
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      // For regular field updates, apply automatic emoji if it's the category field
      const updates = { [name]: value };
      
      // Auto-assign emoji if this is a category change
      if (name === 'category') {
        // Find the matching category from our list
        const categoryObj = categories.find(cat => cat.name === value);
        if (categoryObj && categoryObj.emoji) {
          updates.emoji = categoryObj.emoji;
        }
      }
      
      setFormData({
        ...formData,
        ...updates
      });
    }
  };
  
  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    
    // Auto-update the emoji based on the custom category text
    const suggestedEmoji = getCategoryEmoji(value, 'income');
    setFormData({
      ...formData,
      emoji: suggestedEmoji
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalCategory = formData.category;
      
      // Handle custom category if selected
      if (formData.category === 'custom' && customCategory.trim()) {
        finalCategory = customCategory.trim();
      }
      
      const payload = {
        ...formData,
        category: finalCategory,
        amount: parseFloat(formData.amount),
      };

      if (isEditing) {
        await incomeService.update(id, payload);
        toast.success('Income updated successfully!');
      } else {
        await incomeService.create(payload);
        toast.success('Income added successfully!');
      }

      navigate('/'); // Redirect to home screen
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save income';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error saving income:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading-container">Loading income data...</div>;
  }

  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Income' : 'Add Income'}</h1>
        <Link to="/income" className="btn-secondary">
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
          <div className="category-input-group">
            <span className="category-emoji">{formData.emoji}</span>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="category-select"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.emoji} {category.name}
                </option>
              ))}
              <option value="custom">➕ Add Custom Category</option>
            </select>
          </div>
        </div>
        
        {formData.category === 'custom' && (
          <div className="form-group">
            <label htmlFor="customCategory">Custom Category Name</label>
            <div className="category-input-group">
              <span className="category-emoji">{formData.emoji}</span>
              <input
                type="text"
                id="customCategory"
                value={customCategory}
                onChange={handleCustomCategoryChange}
                required
                placeholder="Enter category name"
                className="custom-category-input"
              />
            </div>
          </div>
        )}

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
            <FaSave /> {loading ? 'Saving...' : 'Save Income'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;