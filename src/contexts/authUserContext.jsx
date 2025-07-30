import { createContext, useState, useContext, useEffect } from "react";
import {
  registerUserRequest,
  loginUserRequest,
  getProfile,
  logoutUserRequest,
} from "../api/authUserApi.js";

const AuthUserContext = createContext();

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuthUser must be used within an AuthUserProvider");
  }
  return context;
};

export const AuthUserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Recupera el perfil si hay token, para auto-login (solo una vez)
  useEffect(() => {
    if (token && !authUser) {
      setLoading(true);
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Registro de usuario
  const register = async (newUser) => {
    console.log(newUser);
    const res = await registerUserRequest(newUser);
    return res;
  };

  // Login de usuario
  const login = async ({ email, password }) => {
    const res = await loginUserRequest(email, password);
    setToken(res.token);
    localStorage.setItem("token", res.token);
    await fetchProfile(res.token); // Actualiza usuario usando el token recién obtenido
    return res;
  };

  // Obtener perfil (token opcional: por defecto usa el del contexto)
  const fetchProfile = async (customToken) => {
    const usedToken = customToken || token;
    if (!usedToken) return null;
    try {
      const res = await getProfile(usedToken);
      setAuthUser(res);
      return res;
    } catch (error) {
      setAuthUser(null);
      setToken("");
      localStorage.removeItem("token");
      throw error.response?.data || error;
    }
  };

  // Logout
  const logout = async () => {
    if (!token) return;
    try {
      await logoutUserRequest(token);
    } catch (e) {}
    setAuthUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthUserContext.Provider
      value={{
        authUser,
        token,
        loading,
        register,
        login,
        fetchProfile,
        logout,
        setAuthUser,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};
