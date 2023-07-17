import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { icons } from "../../configs";
import FlagElement from "../FlagElement";
import { getDetailPokemon } from "../../api/getPokemon";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../LoadingIcon";

type PokemonCardProps = {
  name: string,
  url: string
  handleFavorit?: React.MouseEvent<Element, MouseEvent>
  isFavorit?: boolean
  isFav: boolean
}

type DetailPokemonType = {
  types : { type: { name: string } }[]
  id: string
  sprites: { other: { 'official-artwork': { front_shiny: string } } }
  name: string
  data: { id: string }
}

export default function PokemonCard({ name, url, handleFavorit, isFavorit, isFav }: PokemonCardProps) {
  const { data, isLoading }: UseQueryResult<DetailPokemonType> = useQuery(['detail-pokemon', url], () => getDetailPokemon(url));
  const navigate = useNavigate();

  const handleRedirectDetail = (name: string ): void => {
    if (name) {
      navigate(`/${name}`);
    }
  }

  if (isLoading) {
    return <LoadingIcon />
  }

  return (
    <div className="upper-container">
      <div onClick={() => handleRedirectDetail(data?.name ?? "")} className={`pokemon-card-container ${data?.types[0]?.type.name ?? ''}`}>
        <p className="number-id">#{data?.id}</p>
        <div className="main-section">
          <div className="info">
            <p className="pokemon-name">{name}</p>
            {
              data?.types.map((type, idx) => {
                return (
                  <FlagElement name={type?.type?.name} key={idx} />
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
      {
        !isFav && (
          <div onClick={() => handleFavorit(data)} className="fav-btn">
            {
              isFavorit ? (
                <img className="fav-ic" src={icons.IC_LOVE_FULLFILLED} alt="love-outline" />
              ) : (
                <img className="fav-ic" src={icons.IC_LOVE_OUTLINE} alt="love-outline" />
              )
            }
          </div>
        )
      }
    </div>
  )
}

