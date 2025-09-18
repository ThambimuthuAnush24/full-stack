import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeChart = ({ incomeByCategory }) => {
  if (!incomeByCategory || incomeByCategory.length === 0) {
    return (
      <div className="chart-container">
        <h3>Income by Category</h3>
        <p className="no-data">No income data available for this period</p>
      </div>
    );
  }

  // Generate chart colors - using a different hue than expense chart
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137 + 120) % 360; // Offset from expense chart colors
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  const backgroundColor = generateColors(incomeByCategory.length);
  const hoverBackgroundColor = backgroundColor.map(color => color.replace('60%', '70%'));

  const chartData = {
    labels: incomeByCategory.map(item => item.category),
    datasets: [
      {
        data: incomeByCategory.map(item => item.amount),
        backgroundColor,
        hoverBackgroundColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const value = tooltipItem.raw;
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value);
            return `${tooltipItem.label}: ${formattedValue}`;
          }
        }
      }
    },
  };

  return (
    <div className="chart-container">
      <h3>Income by Category</h3>
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default IncomeChart;