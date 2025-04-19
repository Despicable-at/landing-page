import React, { createContext, useState, useContext } from 'react';
import Notification from './Notification';

// 1️⃣ Create context
const NotificationContext = createContext();

// 2️⃣ Create provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

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

// 3️⃣ Create custom hook for consumption
export const useNotification = () => {
  return useContext(NotificationContext);
};

// 4️⃣ Export context as default
export default NotificationContext;
