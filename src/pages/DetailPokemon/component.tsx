import { UseQueryResult, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FlagElement from "../../components/FlagElement";
import Header from "../../components/Header";
import { icons } from "../../configs";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailPokemonPage, getDetailSpecies } from "../../api/getPokemon";
import LoadingIcon from "../../components/LoadingIcon";
import { Progress } from "antd";
import { getFavoritData, saveFavoritData } from "../../utils/handleFavoritData";

type flavorType = {
  language: { name: string }
  flavor_text: string
}

type dataSpeciesType = {
  id: string
  flavor_text_entries: { flavor: flavorType }[]
  name: string
  types: typePokemon[]
  sprites: { other: { 'official-artwork': { front_shiny: string } } }
  abilities: { ability: { name: string } }[]
  height: string
  weight: string
  stats: {
    base_stat: number
    stat: { name: string }
  }[]
}

type typePokemon = {
  type: { name: string }
}

type paramsTypes = {
  name?: string
}

export default function DetailPokemon() {
  const { name }: paramsTypes = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading }: UseQueryResult<dataSpeciesType, Error> = useQuery(['detail-pokemon', name], () => getDetailPokemonPage(name));
  const dataSpecies: UseQueryResult<dataSpeciesType> = useQuery(['species-pokemon', name], () => getDetailSpecies(name));
  const getDataFavorit: UseQueryResult<[], unknown> = useQuery(['data-favorit'], getFavoritData);

  const renderBio = () => {
    let desc = '';
    dataSpecies?.data?.flavor_text_entries?.some((flavor: flavorType) => {
        if(flavor.language.name === 'en') {
              desc = flavor.flavor_text;
              return true
        }
        return false
    })

    return desc;
  }

  const postDataFavoritMutation = useMutation((newData) => {
    saveFavoritData(newData);
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('data-favorit');
    }
  });

  const handleExecuteMutationFavorit = (newDataFav: void) => {
    postDataFavoritMutation.mutate(newDataFav);
  }
  
  const handleClickFavorit = (data: { id: string }) => {
    let tempArray: { id: string }[] = getFavoritData();
    const existingIndex = tempArray.findIndex((item: { id: string }) => item.id === data.id);

    if (existingIndex === -1) {
      tempArray = [...tempArray, data];
    } else {
      tempArray = tempArray.filter((i: { id: string }) => i.id !== data.id);
    }
    
    handleExecuteMutationFavorit(tempArray);
  }
      
  return (
    <div className="detail-container">
      <Header />
      {
        isLoading ? (
          <LoadingIcon />
        ) : (
          <div className={`main-wrapper ${data?.types[0]?.type.name ?? 'normal'}`}>
            <div className="action-btn-section">
              <div onClick={() => navigate('/')} className="back-btn">
                <img src={icons.IC_BACK} alt="ic-back" />
              </div>
              <div onClick={() => handleClickFavorit(data)} className="fav-btn">
                {
                  getDataFavorit.data?.some(i => i.name === data?.name) ? (
                    <img src={icons.IC_LOVE_FULLFILLED} alt="ic-fav" />
                    ) : (
                    <img src={icons.IC_LOVE_OUTLINE} alt="ic-fav" />
                  )
                }
              </div>
            </div>
            <div className="main-info-section">
              <div className="std-info">
                <div className="name-ele">
                  <p className="pokemon-name">{data?.name}</p>
                  <div className="flag-element">
                    {
                      data?.types.map((type: typePokemon, idx: number) => {
                        return (
                          <FlagElement name={type?.type?.name} key={idx} />
                        )
                      })
                    }
                  </div>
                </div>
                <div className="id-pokemon">
                  <p>#{data?.id}</p>
                </div>
              </div>
              <div className="bottom-info">
                <div className="img-pokemon">
                  <img src={data?.sprites.other['official-artwork'].front_shiny} alt="main-image-pokemon" />
                </div>
                <div className="basic-info">
                  <p className="pokemon-bio">{renderBio()}</p>
                  <div className="basic-ab">
                    <div className="abilities">
                      <h4 className="title">Abilities</h4>
                      {
                        data?.abilities?.map((ability: { ability: { name: string } }, idx: number) => {
                          return (
                            <div className="detail-ab" key={idx}>
                              <p className="title-sm">{ability?.ability?.name}</p>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className="basic">
                      <h4 className="title">Basic</h4>
                      <div className="hw">
                        <p className="label">Height</p>
                        <p>{data?.height}"</p>
                      </div>
                      <div className="hw">
                        <p className="label">Weight</p>
                        <p>{data?.weight}kg</p>
                      </div>
                    </div>
                  </div>
                  <div className="stat-section">
                    {
                      data?.stats?.map((dataStat, idx) => {
                        return (
                          <div className="stat-item-wrapper" key={idx}>
                            <div className="title-stat">
                              <p className="stat-value">({dataStat?.base_stat})</p>
                              <p className="stat-name">{dataStat?.stat?.name}</p>
                            </div>
                            <Progress percent={(Number(dataStat?.base_stat) / 255) * 100} showInfo={false} />
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="detail-section"></div>
            <img className="decoration" src={icons.IC_POKEDEX} alt="decor" />
          </div>
        )
      }
    </div>
  )
}
  