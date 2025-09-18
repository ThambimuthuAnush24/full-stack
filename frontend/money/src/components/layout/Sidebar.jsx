import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaArrowUp, 
  FaArrowDown, 
  FaChartPie, 
  FaUser,
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">MoneyManager</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaHome className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/income" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaArrowDown className="nav-icon" />
              <span>Income</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/expense" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaArrowUp className="nav-icon" />
              <span>Expenses</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaUser className="nav-icon" />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <p>© 2025 Money Manager</p>
      </div>
    </aside>
  );
};

export default Sidebar;