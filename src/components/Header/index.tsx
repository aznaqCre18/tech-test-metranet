import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header-container">
        <h3>Pokedex</h3>
        <Link to='/favorite'>
          My Favorite
        </Link>
    </div>
  )
}
