import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwtToken, setJwtToken] = useState(null);

  return (
    <AuthContext.Provider value={{ jwtToken, setJwtToken }}>
      {children}
    </AuthContext.Provider>
  );
};
