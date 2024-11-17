// UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/config';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);  // Set the user state when auth state changes
    });

    return () => unsubscribe();  // Cleanup on unmount
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
