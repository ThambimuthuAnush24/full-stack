import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css' 
import './styles/Layout.css'
import './styles/Auth.css'
import './styles/Dashboard.css'
import './styles/Transactions.css'
import './styles/TransactionForm.css'
import './styles/Profile.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
