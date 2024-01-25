import React, { useEffect } from "react";
import { UserLibraryProvider } from "../../contexts/userLibraryProvider";
import { SearchProvider } from "../../contexts/searchProvider";
import { UserLibrary } from "../UserLibrary/UserLibrary";
import { Search } from "../Search/Search";
import { useAuth } from "../../contexts/authProvider";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const { setAuth, setUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/api/user/authenticated")
      .then((response) => response.json())
      .then((data) => {
        if (data.status.success) {
          setUser(data.user);
        } else if (data.status.code === 401) {
          setAuth(false, navigate);
        } else {
          // Handle error
          console.error(`Error: ${data.status.message}`);
        }
      });
  }, []);
  return (
    <div className="sections-container">
      <UserLibraryProvider>
        <UserLibrary />

        <SearchProvider>
          <Search />
        </SearchProvider>
      </UserLibraryProvider>
    </div>
  );
}
