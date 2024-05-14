import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import "./styles/custom.css";
import "./styles/dummy.css";
import "./styles/Ragul.css";
import "./styles/user.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoadning] = useState(false);

  const handleLogin = () => {
    sessionStorage.setItem("isAdmin", true);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("company_id");
    sessionStorage.removeItem("user_name");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("appointmentRole");
    setIsAdmin(false);
  };

  useEffect(() => {
    const isAdminFromStorage = sessionStorage.getItem("isAdmin");
    const isAdminBoolean = isAdminFromStorage === "true";
    if (isAdmin !== isAdminBoolean) {
      setIsAdmin(isAdminBoolean);
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,

      (error) => {
        // console.log("Error is", error.response);
        if (error.response?.status === 401) {
          toast.warning("Session Experied!! Please Login");
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="loader-container">
          <div class="loading">
            <span>Hi</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : isAdmin ? (
        <AdminLayout handleLogout={handleLogout} />
      ) : (
        <UserLayout handleLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
