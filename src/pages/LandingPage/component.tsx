import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

import  Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import { getFirsrListPokemon, getNextPokemonList } from '../../api/getPokemon';
import LoadingIcon from '../../components/LoadingIcon';

type listPokemon = {
  name: string,
  url: string,
}

export default function LandingPage() {
  const [listPokemon, setListPokemon] = useState<listPokemon[]>([]);
  const [urlGetList, setUrlGetList] = useState<string>('');
  const [hasMore, setHasMore] = useState(true);
  
  const getFirstPokemonList = useQuery(['getFirstListPokemon'], getFirsrListPokemon);
  
  useEffect(() => {
    setUrlGetList(getFirstPokemonList?.data?.next);
    setListPokemon(getFirstPokemonList?.data?.results);
  }, [getFirstPokemonList.data])

  if (getFirstPokemonList.isLoading) {
    return <div>Loading...</div>;
  }

  if (getFirstPokemonList.isError) {
    return <div>Error: {getFirstPokemonList.error.message}</div>;
  }

  const fetchMoreData = () => {
    setTimeout(async () => {
      const res = await getNextPokemonList(urlGetList);
      const mergedArray = listPokemon.concat(res.results);
      
      setListPokemon(mergedArray);
      setUrlGetList(res.next);

      if (!res.next) {
        setHasMore(false);
      }
    }, 1000);
  }

  console.log(listPokemon?.length, "AISHGDASD");
  

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
