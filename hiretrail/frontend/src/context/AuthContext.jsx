import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/authApi";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("ht_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getMe();
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem("ht_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem("ht_token", data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name.split(" ")[0]}`);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    localStorage.setItem("ht_token", data.token);
    setUser(data.user);
    toast.success("Account created. Let's build your profile.");
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // no-op — clearing local state regardless
    }
    localStorage.removeItem("ht_token");
    setUser(null);
    toast.success("Logged out");
  };

  const updateUserLocal = (partial) => {
    setUser((prev) => ({ ...prev, ...partial }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUserLocal,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
