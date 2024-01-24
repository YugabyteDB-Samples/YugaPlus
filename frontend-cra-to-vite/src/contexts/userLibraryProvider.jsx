import React, { createContext, useContext, useState, useEffect } from "react";

const UserLibraryContext = createContext(null);

export const useLibrary = () => useContext(UserLibraryContext);

export const UserLibraryProvider = ({ children }) => {
  const [userLibrary, setUserLibrary] = React.useState([]);
  const [addedMoviesTable, setAddedMoviesTable] = React.useState([]);

  return (
    <UserLibraryContext.Provider
      value={{
        userLibrary,
        setUserLibrary,
        addedMoviesTable,
        setAddedMoviesTable,
      }}
    >
      {children}
    </UserLibraryContext.Provider>
  );
};
