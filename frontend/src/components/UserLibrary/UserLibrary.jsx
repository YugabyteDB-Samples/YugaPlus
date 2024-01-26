import { useAuth } from "../../contexts/authProvider";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../../contexts/userLibraryProvider";
import { useEffect } from "react";
import Delete from "../SVG/delete";
// User Library Component
export function UserLibrary() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const { userLibrary, setUserLibrary, addedMoviesTable, setAddedMoviesTable } =
    useLibrary();

  useEffect(() => {
    fetch("/api/library/load")
      .then((response) => response.json())
      .then((data) => {
        if (data.status.success) {
          setUserLibrary(data.movies);

          const newAddedMoviesTable = {};
          for (let movie of data.movies) {
            newAddedMoviesTable[movie.id] = true;
          }
          setAddedMoviesTable(newAddedMoviesTable);
        } else if (data.status.code === 401) {
          setAuth(false, navigate);
        } else {
          // Handle error
          console.error(`Error: ${data.status.message}`);
        }
      });
  }, []);

  function handleRemoveFromLibrary(movie) {
    fetch(`/api/library/remove/${movie.id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        if (data.status.success) {
          // Remove the movie from userLibrary
          const updatedLibrary = userLibrary.filter((m) => m.id !== movie.id);
          setUserLibrary(updatedLibrary);

          // Remove the movie from addedMoviesTable
          const newAddedMoviesTable = { ...addedMoviesTable };
          delete newAddedMoviesTable[movie.id];
          setAddedMoviesTable(newAddedMoviesTable);

          console.log("Movie removed from library!");
        } else if (data.status.code === 401) {
          setAuth(false, navigate);
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
    <div className="user-library section">
      <h3 className="section-heading">Your Movies</h3>
      <ul>
        {userLibrary.map((movie, index) => (
          <li key={index}>
            <div className="movie-title-container">
              <h4>{movie.title}</h4>
              <button
                className="delete-button"
                onClick={() => handleRemoveFromLibrary(movie)}
                hidden={!addedMoviesTable[movie.id]}
              >
                <Delete fill={"#735AF5"} width={20} />
              </button>
            </div>
            <p>{movie.description}</p>
            <p>{movie.releaseDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
