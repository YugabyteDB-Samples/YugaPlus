import './userHome.css';
import React, { useEffect } from 'react';
import Select from "react-select";
import LogOut from './logout';

const UserLibraryContext = React.createContext(null);
const SearchAreaContext = React.createContext(null);

// Dropdown options for rank and category
const ranksList = Array.from({ length: 10 }, (_, i) => ({ label: i + 1, value: i + 1 }));
const categoriesList = [
    { label: 'All Categories', value: 'all' },
    { label: 'Science Fiction', value: 'Science Fiction' },
    { label: 'Action', value: 'Action' },
    { label: 'Comedy', value: 'Comedy' }
];

export default function UserHome({ setAuth }) {
    const [selectedRank, changeRank] = React.useState(ranksList[4]);
    const [selectedCategory, changeCategory] = React.useState(categoriesList[0]);
    const [user, setUser] = React.useState();

    const [userLibrary, setUserLibrary] = React.useState(
        [
            { title: 'Movie #1', description: 'This is Movie 1 description.', releaseDate: '2023-01-01' },
            { title: 'Movie #2', description: 'This is Movie 2 description.', releaseDate: '2023-02-01' },
            { title: 'Movie #3', description: 'This is Movie 3 description.', releaseDate: '2023-03-01' },
        ]
    );

    const [moviesRecommendations, setMoviesRecommendations] = React.useState(
        [
            { title: 'New Movie #1', overview: 'Overview of Movie #1.', rank: 8, releaseDate: '2024-01-01' },
            { title: 'New Movie #2', overview: 'Overview of Movie #2.', rank: 7, releaseDate: '2024-02-01' },
            { title: 'New Movie #3', overview: 'Overview of Movie #3.', rank: 9, releaseDate: '2024-03-01' },
        ]);

    useEffect(() => {
        fetch('/api/user/authenticated')
            .then(response => response.json())
            .then(data => {
                if (data.status.success) {
                    setUser(data.user);
                } else if (data.status.code === 401) {
                    setAuth(false);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                }
            })
    }, []);

    return (
        <div className="app">
            <div className="app-main-container">
                <div className="header-container">
                    <div className="title">YugaPlus</div>
                    <div className="user">{user?.fullName} ({user?.userLocation})</div>
                    <div className="logout">
                        <LogOut setAuth={setAuth} />
                    </div>
                </div>
                <div className="sections-container">
                    <UserLibraryContext.Provider value={{ userLibrary, setUserLibrary }}>
                        <UserLibrary />
                    </UserLibraryContext.Provider>

                    <SearchAreaContext.Provider value={{ selectedRank, changeRank, selectedCategory, changeCategory, moviesRecommendations, setMoviesRecommendations }}>
                        <SearchArea setAuth={setAuth} />
                    </SearchAreaContext.Provider>
                </div>
            </div>
        </div>
    );
};

// User Library Component
function UserLibrary({ setAuth }) {
    const { userLibrary, setUserLibrary } = React.useContext(UserLibraryContext);

    useEffect(() => {
        fetch('/api/user/history')
            .then(response => response.json())
            .then(data => {
                if (data.status.success) {
                    setUserLibrary(data.movies);
                } else if (data.status.code === 401) {
                    setAuth(false);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                }
            })
    }, []);

    return (
        <div className="user-library">
            <h2>Your Movies</h2>
            <ul>
                {userLibrary.map((movie, index) => (
                    <li key={index}>
                        <h3>{movie.title}</h3>
                        <p>{movie.description}</p>
                        <p>{movie.releaseDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
};

// Search Area Component with form
function SearchArea({ setAuth }) {
    const { selectedRank, changeRank, selectedCategory, changeCategory, moviesRecommendations, setMoviesRecommendations } = React.useContext(SearchAreaContext);

    function searchForMovies(form) {
        const formData = new FormData(form);
        const prompt = formData.get('userPrompt');

        let url = '/api/movie/search?prompt=' + encodeURIComponent(prompt) + '&rank=' + selectedRank.value;

        if (selectedCategory.value !== 'all') {
            url += '&category=' + encodeURIComponent(selectedCategory.value);
        }

        // setLoading(true);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status.success) {
                    setMoviesRecommendations(data.movies);
                } else if (data.status.code === 401) {
                    setAuth(false);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                }
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        searchForMovies(event.target);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            searchForMovies(event.target.form);
        }
    }

    return (
        <div className="search-area">
            <h2>Search New Movies</h2>
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <div className="form-group">
                    <textarea placeholder="What would you like to watch today?" name="userPrompt" rows="3"></textarea>

                    <div className="form-controls">
                        <Select
                            name="rank"
                            options={ranksList}
                            defaultValue={selectedRank}
                            onChange={changeRank}
                        />

                        <Select
                            name="category"
                            options={categoriesList}
                            defaultValue={selectedCategory}
                            onChange={changeCategory}
                        />
                        <button type="submit">Search</button>
                    </div>
                </div>
            </form>
            <ul className="movies-recommendations">
                {moviesRecommendations.map((movie, index) => (
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
}
