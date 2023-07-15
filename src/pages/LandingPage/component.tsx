import Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <Header />
      <div className="card-list-section">
        <PokemonCard element="grass" name="bulbasaur" />
      </div>
    </div>
  )
}
