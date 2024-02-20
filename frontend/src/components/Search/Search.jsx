import { useEffect } from "react";
import { useSearch } from "../../contexts/searchProvider";
import { useLibrary } from "../../contexts/userLibraryProvider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authProvider";
import Select from "react-select";
import SearchSVG from "../SVG/search";

const ranksList = Array.from({ length: 10 }, (_, i) => ({
    label: i + 1,
    value: i + 1,
}));
const categoriesList = [
    { label: "All Categories", value: "all" },
    { label: "Action", value: "Action" },
    { label: "Adventure", value: "Adventure" },
    { label: "Animation", value: "Animation" },
    { label: "Comedy", value: "Comedy" },
    { label: "Crime", value: "Crime" },
    { label: "Documentary", value: "Documentary" },
    { label: "Drama", value: "Drama" },
    { label: "Family", value: "Family" },
    { label: "Fantasy", value: "Fantasy" },
    { label: "History", value: "History" },
    { label: "Horror", value: "Horror" },
    { label: "Music", value: "Music" },
    { label: "Mystery", value: "Mystery" },
    { label: "Romance", value: "Romance" },
    { label: "Science Fiction", value: "Science Fiction" },
    { label: "Thriller", value: "Thriller" },
    { label: "TV Movie", value: "TV Movie" },
    { label: "War", value: "War" },
    { label: "Western", value: "Western" },
];
// Search Area Component with form
export function Search() {
    const { setAuth } = useAuth();
    const {
        selectedRank,
        setSelectedRank,
        selectedCategory,
        setSelectedCategory,
        moviesRecommendations,
        setMoviesRecommendations,
    } = useSearch();
    const navigate = useNavigate();

    const { userLibrary, setUserLibrary, addedMoviesTable, setAddedMoviesTable } =
        useLibrary();

    useEffect(() => {
        setSelectedRank(ranksList[4]);
        setSelectedCategory(categoriesList[0]);
    }, []);

    function searchForMovies(form) {
        const formData = new FormData(form);
        const prompt = formData.get("userPrompt");

        let url =
            "/api/movie/search?prompt=" +
            encodeURIComponent(prompt) +
            "&rank=" +
            selectedRank.value;

        if (selectedCategory.value !== "all") {
            url += "&category=" + encodeURIComponent(selectedCategory.value);
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.status.success) {
                    setMoviesRecommendations(data.movies);
                } else if (data.status.code === 401) {
                    setAuth(false, navigate);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                    alert(data.status.message);
                }
            })
            .catch((error) => {
                alert("Oops, something went wrong: " + error.message);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        searchForMovies(event.target);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            searchForMovies(event.target.form);
        }
    }

    function handleAddToLibrary(movie) {
        fetch(`/api/library/add/${movie.id}`, { method: "PUT" })
            .then((response) => response.json())
            .then((data) => {
                if (data.status.success) {
                    const updatedLibrary = [movie, ...userLibrary];
                    setUserLibrary(updatedLibrary);

                    const newAddedMoviesTable = { ...addedMoviesTable };
                    newAddedMoviesTable[movie.id] = true;
                    setAddedMoviesTable(newAddedMoviesTable);
                    console.log("Movie added to library!");
                } else if (data.status.code === 401) {
                    setAuth(false);
                } else {
                    // Handle error
                    console.error(`Error: ${data.status.message}`);
                }
            })
            .catch((error) => {
                alert("Oops, something went wrong: " + error.message);
            });
    }

    return (
        <div className="search-area section">
            <h3 className="section-heading">Search New Movies</h3>
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <div className="form-group">
                    <textarea
                        placeholder="What would you like to watch today?"
                        name="userPrompt"
                        rows="3"
                    ></textarea>

                    <div className="form-controls">
                        {selectedRank && (
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        outline: state.isFocused
                                            ? "1px auto rgba(93, 95, 239, 1)"
                                            : "",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                            ? "rgb(93, 95, 239)"
                                            : state.isFocused
                                                ? "rgba(115,90,245, 0.2)"
                                                : "inherit",
                                    }),
                                }}
                                name="rank"
                                options={ranksList}
                                defaultValue={selectedRank}
                                onChange={setSelectedRank}
                            />
                        )}

                        {selectedCategory && (
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        outline: state.isFocused
                                            ? "1px auto rgba(93, 95, 239, 1)"
                                            : "",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                            ? "rgb(93, 95, 239)"
                                            : state.isFocused
                                                ? "rgba(115,90,245, 0.2)"
                                                : "inherit",
                                    }),
                                }}
                                name="category"
                                options={categoriesList}
                                defaultValue={selectedCategory}
                                onChange={setSelectedCategory}
                            />
                        )}
                        <button className="search-button" type="submit">
                            <SearchSVG width={20} />
                        </button>
                    </div>
                </div>
            </form>
            <ul className="movies-recommendations">
                {moviesRecommendations.map((movie, index) => (
                    <li key={index}>
                        <div className="movie-title-container">
                            <h4>{movie.title}</h4>
                            <p>Rank: {movie.voteAverage}</p>
                        </div>
                        <p>{movie.overview}</p>
                        <p>Release Date: {movie.releaseDate}</p>
                        <button
                            onClick={() => handleAddToLibrary(movie)}
                            hidden={addedMoviesTable[movie.id]}
                        >
                            Add to Library
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
