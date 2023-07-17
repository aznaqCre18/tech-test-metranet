import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import { getFavoritData } from "../../utils/handleFavoritData";
import { POKEDEX_BASE_URL } from "../../configs/services";
import LoadingIcon from "../../components/LoadingIcon";
import { icons } from "../../configs";

export default function FavoritePokemon() {
  const { data, isLoading }: UseQueryResult<any> = useQuery(['data-favorit'], getFavoritData);
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingIcon />
  }

  return (
    <div className="fav-container">
      <Header hideFilter />
      <div className="list-fav-wrapper">
        <div className="title-fav-section">
          <div onClick={() => navigate('/')} className="wrapper-back">
            <img src={icons.IC_BACK} alt="ic-back" />
          </div>
          <h1>Your Favorite Pokemon.</h1>
        </div>
        <div className="card-list-section">
          {
            data ?? data?.length > 0 ? 
              data?.map((datas: any, idx: number) => {
                return (
                  <PokemonCard name={datas?.name} url={`${POKEDEX_BASE_URL}/pokemon/${datas.name}`} key={idx} isFav={true} />
                )
              }) : (
                <p>You haven't added any Pokémon yet.</p>
              )
          }
        </div>
      </div>
    </div>
  )
}
  