// Vlastni Hook na ziskani uzivatelskych dat

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/config';

const UserContext = createContext();

// vytvareni provideru
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);  // kdyz se zmeni authentifikce, ulozi se
    });

    return () => unsubscribe();  // Cleanup funkce
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
