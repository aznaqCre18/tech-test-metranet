import { UseQueryResult, useQuery } from "@tanstack/react-query";
import Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import { getFavoritData } from "../../utils/handleFavoritData";
import { POKEDEX_BASE_URL } from "../../configs/services";
import LoadingIcon from "../../components/LoadingIcon";
import { icons } from "../../configs";
import { useNavigate } from "react-router-dom";

type favType = {
  name: string,
}

export default function FavoritePokemon() {
  const { data, isLoading }: UseQueryResult<favType[], unknown> = useQuery(['data-favorit'], getFavoritData);
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
            data?.map((datas, idx) => {
              return (
                <PokemonCard name={datas?.name} url={`${POKEDEX_BASE_URL}/pokemon/${datas.name}`} key={idx} isFav={true} />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
  