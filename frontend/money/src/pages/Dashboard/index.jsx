import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import FinancialSummary from './components/FinancialSummary';
import ExpenseChart from './components/ExpenseChart';
import IncomeChart from './components/IncomeChart';
import RecentTransactions from './components/RecentTransactions';
import DateRangePicker from '../../components/ui/DateRangePicker';
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
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={handleDateRangeChange} 
        />
      </div>

      {dashboardData && (
        <>
          <FinancialSummary
            totalIncome={dashboardData.totalIncome}
            totalExpense={dashboardData.totalExpense}
            balance={dashboardData.balance}
          />

          <div className="dashboard-charts">
            <IncomeChart incomeByCategory={dashboardData.incomeByCategory} />
            <ExpenseChart expenseByCategory={dashboardData.expenseByCategory} />
          </div>

          <RecentTransactions 
            recentIncomes={dashboardData.recentIncomes || []} 
            recentExpenses={dashboardData.recentExpenses || []} 
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;