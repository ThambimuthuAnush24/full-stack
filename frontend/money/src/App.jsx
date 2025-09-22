import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import IncomeList from './pages/Income/IncomeList';
import IncomeForm from './pages/Income/IncomeForm';
import ExpenseList from './pages/Expense/ExpenseList';
import ExpenseForm from './pages/Expense/ExpenseForm';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Income Routes */}
          <Route path="income" element={<IncomeList />} />
          <Route path="income/add" element={<IncomeForm />} />
          <Route path="income/edit/:id" element={<IncomeForm />} />
          
          {/* Expense Routes */}
          <Route path="expense" element={<ExpenseList />} />
          <Route path="expense/add" element={<ExpenseForm />} />
          <Route path="expense/edit/:id" element={<ExpenseForm />} />
          
          {/* Profile Routes */}
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
