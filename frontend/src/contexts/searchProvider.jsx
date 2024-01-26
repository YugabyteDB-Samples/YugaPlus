import React, { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext(null);

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [selectedRank, setSelectedRank] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [moviesRecommendations, setMoviesRecommendations] = useState([]);

  return (
    <SearchContext.Provider
      value={{
        selectedRank,
        setSelectedRank,
        selectedCategory,
        setSelectedCategory,
        moviesRecommendations,
        setMoviesRecommendations,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
