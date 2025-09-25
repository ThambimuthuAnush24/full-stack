import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApiTest() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);
  const [directTestResult, setDirectTestResult] = useState('Not tested');
  const [proxyTestResult, setProxyTestResult] = useState('Not tested');
  
  useEffect(() => {
    // Test the API health endpoint
    const testApi = async () => {
      try {
        // Test direct API call
        try {
          const directResponse = await axios.get('http://localhost:8080/api/public/health', {
            headers: { 'Content-Type': 'application/json' }
          });
          setDirectTestResult(`Direct API call successful: ${JSON.stringify(directResponse.data)}`);
        } catch (directErr) {
          setDirectTestResult(`Direct API call failed: ${directErr.message}`);
        }

        // Test proxied call
        try {
          const proxyResponse = await axios.get('/api/public/health');
          setProxyTestResult(`Proxy API call successful: ${JSON.stringify(proxyResponse.data)}`);
          setStatus('API is connected!');
        } catch (proxyErr) {
          setProxyTestResult(`Proxy API call failed: ${proxyErr.message}`);
          setStatus('Failed');
        }
      } catch (err) {
        console.error('API Test Error:', err);
        setError(`Error connecting to API: ${err.message}`);
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
        
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>Direct API Test:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>{directTestResult}</pre>
          
          <h4>Proxy API Test:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>{proxyTestResult}</pre>
          
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={async () => {
                try {
                  const response = await axios.post('http://localhost:8080/api/auth/register', {
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'testuser@example.com',
                    username: 'testuser' + Date.now(),
                    password: 'password123'
                  }, {
                    headers: { 'Content-Type': 'application/json' }
                  });
                  alert('Registration test successful: ' + JSON.stringify(response.data));
                } catch (err) {
                  alert('Registration test failed: ' + err.message);
                  console.error('Registration test error:', err);
                }
              }}
              style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Test Direct Registration
            </button>
          </div>
        </div>
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