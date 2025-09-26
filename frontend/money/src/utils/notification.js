import { toast } from 'react-toastify';

/**
 * Utility class for showing notifications throughout the app
 */
const Notification = {
  /**
   * Show a success notification
   * @param {string} message - The message to display
   * @param {Object} options - Toast options
   */
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  /**
   * Show an error notification
   * @param {string} message - The message to display
   * @param {Object} options - Toast options
   */
  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  /**
   * Show an info notification
   * @param {string} message - The message to display
   * @param {Object} options - Toast options
   */
  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  /**
   * Show a warning notification
   * @param {string} message - The message to display
   * @param {Object} options - Toast options
   */
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },
};

export default Notification;