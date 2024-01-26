import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header/Header";
export default function App() {
  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
}
