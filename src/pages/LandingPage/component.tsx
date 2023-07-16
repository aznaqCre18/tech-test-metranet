import { useState, useEffect } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

import  Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import { getFirsrListPokemon, getNextPokemonList } from '../../api/getPokemon';
import LoadingIcon from '../../components/LoadingIcon';

type listPokemon = {
  name: string,
  url: string,
}

type pokemonList = {
  next: string,
  results: listPokemon[]
}

export default function LandingPage() {
  const [listPokemon, setListPokemon] = useState<listPokemon[] | undefined>([]);
  const [urlGetList, setUrlGetList] = useState<string | undefined>('');
  const [hasMore, setHasMore] = useState(true);
  
  const { data, isError, isLoading, error }: UseQueryResult<pokemonList, Error> = useQuery(['getFirstListPokemon'], getFirsrListPokemon);
  
  useEffect(() => {
    setUrlGetList(data?.next);
    setListPokemon(data?.results);
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const fetchMoreData = () => {
    setTimeout(async (): Promise<void> => {
      const res: pokemonList = await getNextPokemonList(urlGetList);
      const mergedArray = listPokemon?.concat(res.results);
      
      setListPokemon(mergedArray);
      setUrlGetList(res.next);

      if (!res?.next) {
        setHasMore(false);
      }
    }, 1000);
  }
  

  return (
    <div className="landing-container">
      <Header />
      <InfiniteScroll
        dataLength={listPokemon?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LoadingIcon />}
      >
        <div className="card-list-section">
          {
            listPokemon?.map((data, idx) => {
              return (
                <PokemonCard element="grass" name={data?.name} url={data?.url} key={idx} />
              )
            })
          }
        </div>
      </InfiniteScroll>
    </div>
  )
}
