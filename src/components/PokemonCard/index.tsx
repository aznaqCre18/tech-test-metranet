import { useQuery } from "@tanstack/react-query";
import { icons } from "../../configs";
import FlagElement from "../FlagElement";
import { getDetailPokemon } from "../../api/getPokemon";

type PokemonCardProps = {
  element: string,
  name: string,
  url: string
}

export default function PokemonCard({ name, url }: PokemonCardProps) {
  const getDetailPokemonQuery = useQuery(['detail-pokemon', url], () => getDetailPokemon(url));
  return (
    <div className={`pokemon-card-container ${getDetailPokemonQuery?.data?.types && getDetailPokemonQuery?.data?.types[0]?.type.name}`}>
      <p className="number-id">#{getDetailPokemonQuery?.data?.id}</p>
      <div className="main-section">
        <div className="info">
          <p className="pokemon-name">{name}</p>
          {
            getDetailPokemonQuery?.data?.types.map(type => {
              return (
                <FlagElement name={type?.type?.name} />
              )
            })
          }
        </div>
        <div className="img-pokemon">
          <img src={getDetailPokemonQuery?.data?.sprites.other['official-artwork'].front_shiny} alt="pokemon-img" />
        </div>
      </div>
      <img className="decor" src={icons.IC_POKEDEX} alt="icon-decor" />
    </div>
  )
}
