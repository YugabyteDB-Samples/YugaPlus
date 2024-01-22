import './userHome.css';
import React, { useEffect } from 'react';
import Select from "react-select";
import LogOut from './logout';

const UserLibraryContext = React.createContext(null);
const SearchAreaContext = React.createContext(null);

const ranksList = Array.from({ length: 10 }, (_, i) => ({ label: i + 1, value: i + 1 }));
const categoriesList = [
    { label: 'All Categories', value: 'all' },
    { label: 'Action', value: 'Action' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Animation', value: 'Animation' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Crime', value: 'Crime' },
    { label: 'Documentary', value: 'Documentary' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Family', value: 'Family' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'History', value: 'History' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Music', value: 'Music' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Science Fiction', value: 'Science Fiction' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'TV Movie', value: 'TV Movie' },
    { label: 'War', value: 'War' },
    { label: 'Western', value: 'Western' }
];

export default function UserHome({ setAuth }) {
    const [selectedRank, changeRank] = React.useState(ranksList[4]);
    const [selectedCategory, changeCategory] = React.useState(categoriesList[0]);
    const [user, setUser] = React.useState();

    const [userLibrary, setUserLibrary] = React.useState([]);
    const [addedMoviesTable, setAddedMoviesTable] = React.useState([]);
    const [moviesRecommendations, setMoviesRecommendations] = React.useState([]);

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
                    <div className="title-container">
                        <div className="title">YugaPlus</div>
                        <div className="subtitle">Watch Your Favorite Movies Globally</div>
                    </div>
                    <div className="user">{user?.fullName} ({user?.userLocation})</div>
                    <div className="logout">
                        <LogOut setAuth={setAuth} />
                    </div>
                </div>
                <div className="sections-container">
                    <UserLibraryContext.Provider value={
                        {
                            userLibrary, setUserLibrary,
                            addedMoviesTable, setAddedMoviesTable
                        }}>
                        <UserLibrary setAuth={setAuth} />
                    </UserLibraryContext.Provider>

                    <SearchAreaContext.Provider value={
                        {
                            selectedRank, changeRank,
                            selectedCategory, changeCategory,
                            moviesRecommendations, setMoviesRecommendations,
                            userLibrary, setUserLibrary,
                            addedMoviesTable, setAddedMoviesTable
                        }}>
                        <SearchArea setAuth={setAuth} />
                    </SearchAreaContext.Provider>
                </div>
            </div>
        </div>
    );
};

// User Library Component
function UserLibrary({ setAuth }) {
    const {
        userLibrary, setUserLibrary,
        addedMoviesTable, setAddedMoviesTable
    } = React.useContext(UserLibraryContext);

    useEffect(() => {
        fetch('/api/library/load')
            .then(response => response.json())
            .then(data => {
                if (data.status.success) {
                    setUserLibrary(data.movies);

                    const newAddedMoviesTable = {};
                    for (let movie of data.movies) {
                        newAddedMoviesTable[movie.id] = true;
                    }
                    setAddedMoviesTable(newAddedMoviesTable);
                } else if (data.status.code === 401) {
                    setAuth(false);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                }
            })
    }, []);

    function handleRemoveFromLibrary(movie) {
        fetch(`/api/library/remove/${movie.id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.status.success) {
                    // Remove the movie from userLibrary
                    const updatedLibrary = userLibrary.filter(m => m.id !== movie.id);
                    setUserLibrary(updatedLibrary);

                    // Remove the movie from addedMoviesTable
                    const newAddedMoviesTable = { ...addedMoviesTable };
                    delete newAddedMoviesTable[movie.id];
                    setAddedMoviesTable(newAddedMoviesTable);

                    console.log('Movie removed from library!');
                } else if (data.status.code === 401) {
                    setAuth(false);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                }
            })
            .catch((error) => {
                alert('Oops, something went wrong: ' + error.message);
            });
    }

    return (
        <div className="user-library">
            <h2>Your Movies</h2>
            <ul>
                {userLibrary.map((movie, index) => (
                    <li key={index}>
                        <h3>{movie.title}</h3>
                        <p>{movie.description}</p>
                        <p>{movie.releaseDate}</p>
                        <button
                            onClick={() => handleRemoveFromLibrary(movie)}
                            hidden={!addedMoviesTable[movie.id]}>
                            Remove from Library
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

// Search Area Component with form
function SearchArea({ setAuth }) {
    const {
        selectedRank, changeRank,
        selectedCategory, changeCategory,
        moviesRecommendations, setMoviesRecommendations,
        userLibrary, setUserLibrary,
        addedMoviesTable, setAddedMoviesTable
    } = React.useContext(SearchAreaContext);

    function searchForMovies(form) {
        const formData = new FormData(form);
        const prompt = formData.get('userPrompt');

        let url = '/api/movie/search?prompt=' + encodeURIComponent(prompt) + '&rank=' + selectedRank.value;

        if (selectedCategory.value !== 'all') {
            url += '&category=' + encodeURIComponent(selectedCategory.value);
        }

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
            })
            .catch((error) => {
                alert('Oops, something went wrong: ' + error.message);
            });;
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

    function handleAddToLibrary(movie) {
        fetch(`/api/library/add/${movie.id}`, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                if (data.status.success) {
                    const updatedLibrary = [movie, ...userLibrary];
                    setUserLibrary(updatedLibrary);

                    const newAddedMoviesTable = { ...addedMoviesTable };
                    newAddedMoviesTable[movie.id] = true;
                    setAddedMoviesTable(newAddedMoviesTable);
                    console.log('Movie added to library!');
                } else if (data.status.code === 401) {
                    setAuth(false);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                }
            })
            .catch((error) => {
                alert('Oops, something went wrong: ' + error.message);
            });
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
                        <p>Rank: {movie.voteAverage}</p>
                        <p>Release Date: {movie.releaseDate}</p>
                        <button
                            onClick={() => handleAddToLibrary(movie)}
                            hidden={addedMoviesTable[movie.id]}>
                            Add to Library
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
