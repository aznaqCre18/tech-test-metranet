import { useQuery } from "@tanstack/react-query";
import FlagElement from "../../components/FlagElement";
import Header from "../../components/Header";
import { icons, images } from "../../configs";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailPokemonPage } from "../../api/getPokemon";
import LoadingIcon from "../../components/LoadingIcon";
import { Progress } from "antd";

export default function DetailPokemon() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(['detail-pokemon', name], () => getDetailPokemonPage(name));

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
              <div className="fav-btn">
                <img src={icons.IC_LOVE_OUTLINE} alt="ic-fav" />
              </div>
            </div>
            <div className="main-info-section">
              <div className="std-info">
                <div className="name-ele">
                  <p className="pokemon-name">{data?.name}</p>
                  <div className="flag-element">
                    {
                      data?.types.map(type => {
                        return (
                          <FlagElement name={type?.type?.name} />
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
                  <p className="pokemon-bio">A strange seed was planted on its back at birth.The plant sprouts and grows with this POKéMON.</p>
                  <div className="basic-ab">
                    <div className="abilities">
                      <h4 className="title">Abilities</h4>
                      {
                        data?.abilities?.map((ability, idx) => {
                          return (
                            <div className="detail-ab">
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
                          <div className="stat-item-wrapper">
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
  