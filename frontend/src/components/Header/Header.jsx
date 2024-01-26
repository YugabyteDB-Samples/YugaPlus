import FilmReel from "../SVG/film-reel";
import Logout from "../Logout/logout";
import { useAuth } from "../../contexts/authProvider";
export function Header() {
  const { user } = useAuth();

  return (
    <div className="header">
      <div className="brand-logo-container">
        <div className="title">YugaPlus</div>
        <FilmReel />
      </div>
      {user && (
        <>
          <div className="user">
            {user.fullName} ({user.userLocation})
          </div>
          <div className="logout">
            <Logout />
          </div>
        </>
      )}
    </div>
  );
}
