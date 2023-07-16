import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { icons } from "../../configs";
import FlagElement from "../FlagElement";
import { getDetailPokemon } from "../../api/getPokemon";

type PokemonCardProps = {
  element: string,
  name: string,
  url: string
}

type DetailPokemonType = {
  types : { type: { name: string } }[]
  id: string
  sprites: { other: { 'official-artwork': { front_shiny: string } } }
}

export default function PokemonCard({ name, url }: PokemonCardProps) {
  const { data }: UseQueryResult<DetailPokemonType> = useQuery(['detail-pokemon', url], () => getDetailPokemon(url));

  console.log(data, "<<< DATA DETAIL");
  

  return (
    <div className={`pokemon-card-container ${data?.types[0]?.type.name ?? ''}`}>
      <p className="number-id">#{data?.id}</p>
      <div className="main-section">
        <div className="info">
          <p className="pokemon-name">{name}</p>
          {
            data?.types.map(type => {
              return (
                <FlagElement name={type?.type?.name} />
              )
            })
          }
        </div>
        <div className="img-pokemon">
          <img src={data?.sprites.other['official-artwork'].front_shiny} alt="pokemon-img" />
        </div>
      </div>
      <img className="decor" src={icons.IC_POKEDEX} alt="icon-decor" />
    </div>
  )
}

