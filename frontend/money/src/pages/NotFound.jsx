import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="not-found">
      <div className="not-found-content">
        <FaExclamationTriangle className="not-found-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;