import './App.css';
import React from 'react';

// Mock data for the user's library
const userLibrary = [
    { title: 'Movie 1', description: 'This is Movie 1 description.', releaseDate: '2023-01-01' },
    { title: 'Movie 2', description: 'This is Movie 2 description.', releaseDate: '2023-02-01' },
    { title: 'Movie 3', description: 'This is Movie 3 description.', releaseDate: '2023-03-01' },
];

// Mock data for the search results
const searchResults = [
    { title: 'Movie #1', overview: 'Overview of Movie #1.', rank: 8, releaseDate: '2024-01-01' },
    { title: 'Movie #2', overview: 'Overview of Movie #2.', rank: 7, releaseDate: '2024-02-01' },
    { title: 'Movie #3', overview: 'Overview of Movie #3.', rank: 9, releaseDate: '2024-03-01' },
];

// Dropdown options for rank and category
const ranks = Array.from({ length: 10 }, (_, i) => i + 1);
const categories = ['Science Fiction', 'Action', 'Comedy'];

// User Library Component
const UserLibrary = ({ movies }) => (
    <div className="user-library">
        <h2>Your Movies</h2>
        <ul>
            {movies.map((movie, index) => (
                <li key={index}>
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                    <p>{movie.releaseDate}</p>
                </li>
            ))}
        </ul>
    </div>
);

// Search Area Component with form
const SearchArea = ({ results }) => (
    <div className="search-area">
        <h2>Search New Movies</h2>
        <form action="http://localhost:3001/search-movies" method="POST">
            <div className="form-group">
                <textarea placeholder="Search..." name="searchQuery" rows="3"></textarea>
                <select name="rank">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(rank => (
                        <option key={rank} value={rank}>{rank}</option>
                    ))}
                </select>
                <select name="category">
                    {['Science Fiction', 'Action', 'Comedy'].map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <button type="submit">Search</button>
            </div>
        </form>
        <ul className="search-results">
            {results.map((movie, index) => (
                <li key={index}>
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                    <p>Rank: {movie.rank}</p>
                    <p>Release Date: {movie.releaseDate}</p>
                </li>
            ))}
        </ul>
    </div>
);

const App = () => (
    <div className="app">
        <div className="title-container">
            <div className="title">YugaPlus</div>
        </div>
        <div className="sections-container">
            <UserLibrary movies={userLibrary} />
            <SearchArea results={searchResults} />
        </div>
    </div>
);

export default App;
