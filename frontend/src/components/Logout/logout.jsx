import React from "react";
import { useAuth } from "../../contexts/authProvider";
import { useNavigate } from "react-router-dom";
import LogoutSVG from "../SVG/logout";

function Logout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    fetch("/api/logout", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Logout successful!");
          setAuth(false, navigate);
        } else {
          alert("Logout failed: " + data.message);
        }
      })
      .catch((error) => {
        alert("Oops, something went wrong: " + error.message);
      });
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <LogoutSVG width={20} />
    </button>
  );
}

export default Logout;
