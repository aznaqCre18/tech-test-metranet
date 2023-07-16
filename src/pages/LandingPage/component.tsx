import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

import  Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import { getFirsrListPokemon, getNextPokemonList } from '../../api/getPokemon';
import LoadingIcon from '../../components/LoadingIcon';
import { getFavoritData, saveFavoritData } from '../../utils/handleFavoritData';

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
  const queryClient = useQueryClient();
  
  const { data, isError, isLoading, error }: UseQueryResult<pokemonList, Error> = useQuery(['getFirstListPokemon'], getFirsrListPokemon);
  const getDataFavorit: UseQueryResult<[], unknown> = useQuery(['data-favorit'], getFavoritData);

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
  
  useEffect(() => {
    setUrlGetList(data?.next);
    setListPokemon(data?.results);
  }, [data])

  useEffect(() => {
    console.log(getDataFavorit.data, "<<< SP DATA");
  }, [getDataFavorit.data])

  const commonIds = listPokemon?.reduce((result, item: { name: string }) => {
    if (getDataFavorit.data.find((obj: { name: string }) => obj.name === item.name)) {
      result.push(item.name)
    }
    return result;
  }, [])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(commonIds, "<<< COMS");
  

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
                <PokemonCard element="grass" name={data?.name} url={data?.url} key={idx} handleFavorit={handleClickFavorit} isFavorit={commonIds?.includes(data?.name) ? true : false} />
              )
            })
          }
        </div>
      </InfiniteScroll>
    </div>
  )
}
