import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ dateRange, onChange }) => {
  const [startDate, setStartDate] = useState(dateRange.startDate);
  const [endDate, setEndDate] = useState(dateRange.endDate);

  const handleStartDateChange = (date) => {
    const newStartDate = date;
    setStartDate(newStartDate);
    
    // If start date is after end date, update end date
    if (newStartDate > endDate) {
      setEndDate(newStartDate);
      onChange({ startDate: newStartDate, endDate: newStartDate });
    } else {
      onChange({ startDate: newStartDate, endDate });
    }
  };

  const handleEndDateChange = (date) => {
    const newEndDate = date;
    setEndDate(newEndDate);
    
    // If end date is before start date, update start date
    if (newEndDate < startDate) {
      setStartDate(newEndDate);
      onChange({ startDate: newEndDate, endDate: newEndDate });
    } else {
      onChange({ startDate, endDate: newEndDate });
    }
  };

  // Predefined date ranges
  const handleQuickSelect = (period) => {
    const today = new Date();
    let newStartDate, newEndDate;

    switch (period) {
      case 'today':
        newStartDate = new Date(today);
        newEndDate = new Date(today);
        break;
      case 'thisWeek':
        newStartDate = new Date(today);
        newStartDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        newEndDate = new Date(today);
        break;
      case 'thisMonth':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = new Date(today);
        break;
      case 'thisYear':
        newStartDate = new Date(today.getFullYear(), 0, 1);
        newEndDate = new Date(today);
        break;
      case 'lastMonth':
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onChange({ startDate: newStartDate, endDate: newEndDate });
  };

  return (
    <div className="date-range-picker">
      <div className="quick-select">
        <button onClick={() => handleQuickSelect('today')}>Today</button>
        <button onClick={() => handleQuickSelect('thisWeek')}>This Week</button>
        <button onClick={() => handleQuickSelect('thisMonth')}>This Month</button>
        <button onClick={() => handleQuickSelect('lastMonth')}>Last Month</button>
        <button onClick={() => handleQuickSelect('thisYear')}>This Year</button>
      </div>
      
      <div className="date-inputs">
        <div className="date-picker-container">
          <label>From</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            dateFormat="MMM d, yyyy"
          />
        </div>
        
        <div className="date-picker-container">
          <label>To</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat="MMM d, yyyy"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;