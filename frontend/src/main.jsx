import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UserHome from "./components/UserHome/userHome.jsx";
import LoginPage from "./components/Login/login.jsx";
import { AuthProvider } from "./contexts/authProvider.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<UserHome />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
