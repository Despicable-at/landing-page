import React, { createContext, useState, useCallback, useContext } from 'react';
import Notification from './Notification';

// Create and export the context
export const NotificationContext = createContext();

// Create provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
  }, []);

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};

// Create custom hook
export const useNotification = () => {
  return useContext(NotificationContext);
};
