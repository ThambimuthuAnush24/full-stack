import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApiTest() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Test the API health endpoint
    const testApi = async () => {
      try {
        // Test direct API call
        const response = await axios.get('/api/public/health');
        setStatus(`API is connected! Status: ${response.data.status}`);
      } catch (err) {
        console.error('API Test Error:', err);
        setError(`Error connecting to API: ${err.message}`);
        setStatus('Failed');
      }
    };
    
    testApi();
  }, []);
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>API Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>API Status: {status}</h3>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </div>
        )}
      </div>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
        <h3>Debugging Tips:</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>Make sure your Spring Boot backend is running on port 8080</li>
          <li>Check browser console for any CORS errors</li>
          <li>Verify that the CORS configuration in Spring is correct</li>
          <li>Ensure the API proxy in Vite config is working properly</li>
        </ul>
      </div>
    </div>
  );
}

export default ApiTest;