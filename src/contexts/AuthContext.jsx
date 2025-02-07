import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Función para manejar el login
  const login = (userData) => {
    // Asegurarnos de que el estado isAdmin se mantenga
    const userWithAdmin = {
      ...userData,
      isAdmin: userData.isAdmin || false // Asegurarnos de que isAdmin exista
    };
    setCurrentUser(userWithAdmin);
    localStorage.setItem('currentUser', JSON.stringify(userWithAdmin));
  };

  // Función para manejar el logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 