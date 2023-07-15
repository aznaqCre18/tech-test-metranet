import { icons, images } from "../../configs";
import FlagElement from "../FlagElement";

type PokemonCardProps = {
  element: string,
  name: string,
  url?: string
}

export default function PokemonCard({ element, name, url }: PokemonCardProps) {
  return (
    <div className={`pokemon-card-container ${element}`}>
      <p className="number-id">#001</p>
      <div className="main-section">
        <div className="info">
          <p className="pokemon-name">{name}</p>
          <FlagElement name="grass" />
          <FlagElement name="poison" />
        </div>
        <div className="img-pokemon">
          <img src={images.DUMMY_POKEMON} alt="dummy" />
        </div>
      </div>
      <img className="decor" src={icons.IC_POKEDEX} alt="icon-decor" />
    </div>
  )
}
