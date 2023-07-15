import { useQuery } from '@tanstack/react-query';

import Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import { getFirsrListPokemon } from '../../api/getPokemon';

export default function LandingPage() {

  const getFirstPokemonList = useQuery(['getFirstListPokemon'], getFirsrListPokemon);

  if (getFirstPokemonList.isLoading) {
    return <div>Loading...</div>;
  }

  if (getFirstPokemonList.isError) {
    return <div>Error: {getFirstPokemonList.error.message}</div>;
  }
  if (getFirstPokemonList.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-container">
      <Header />
      <div className="card-list-section">
        {
          getFirstPokemonList.data.results.map((data, idx) => {
            return (
              <PokemonCard element="grass" name={data.name} url={data.url} key={idx} />
            )
          })
        }
      </div>
    </div>
  )
}
