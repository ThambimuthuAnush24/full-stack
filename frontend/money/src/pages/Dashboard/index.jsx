import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import FinancialSummary from './components/FinancialSummary';
import ExpenseChart from './components/ExpenseChart';
import IncomeChart from './components/IncomeChart';
import RecentTransactions from './components/RecentTransactions';
import DateRangePicker from '../../components/ui/DateRangePicker';
import { ILLUSTRATIONS, COLORS } from '../../assets/images';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getDashboardByDateRange({
          startDate: dateRange.startDate.toISOString().split('T')[0],
          endDate: dateRange.endDate.toISOString().split('T')[0]
        });
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]);

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-animation"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header page-section">
        <div className="header-content">
          <h1>Financial Dashboard</h1>
          <p className="subtitle">Track, analyze and manage your finances in one place</p>
        </div>
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={handleDateRangeChange} 
        />
        <div className="dashboard-decoration">
          <img src={ILLUSTRATIONS.dashboard} alt="Dashboard illustration" className="dashboard-image" />
        </div>
      </div>

      {dashboardData && (
        <>
          <FinancialSummary
            totalIncome={dashboardData.totalIncome}
            totalExpense={dashboardData.totalExpense}
            balance={dashboardData.balance}
          />

          <div className="dashboard-charts">
            <div className="chart-container card">
              <h2 className="section-title">Income Breakdown</h2>
              <IncomeChart incomeByCategory={dashboardData.incomeByCategory} />
              <div className="decorative-icon">💹</div>
            </div>
            <div className="chart-container card">
              <h2 className="section-title">Expense Breakdown</h2>
              <ExpenseChart expenseByCategory={dashboardData.expenseByCategory} />
              <div className="decorative-icon">📊</div>
            </div>
          </div>

          <div className="recent-transactions-wrapper card">
            <h2 className="section-title">Recent Transactions</h2>
            <RecentTransactions 
              recentIncomes={dashboardData.recentIncomes || []} 
              recentExpenses={dashboardData.recentExpenses || []} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;