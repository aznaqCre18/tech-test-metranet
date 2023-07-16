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
  const [favoriteSelected, setFavoriteSelected] = useState([]);
  const queryClient = useQueryClient();
  
  const { data, isError, isLoading, error }: UseQueryResult<pokemonList, Error> = useQuery(['getFirstListPokemon'], getFirsrListPokemon);
  const getDataFavorit = useQuery(['data-favorit'], getFavoritData);

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
    onSuccess: () => {
      queryClient.invalidateQueries('data-favorit');
    }
  });

  const handleExecuteMutationFavorit = async (newDataFav) => {
    postDataFavoritMutation.mutate(newDataFav);
  }
  
  const handleClickFavorit = async (data: []) => {
    let tempArray = favoriteSelected;
    const existingIndex = tempArray.findIndex((item) => item.id === data.id);

    if (existingIndex === -1) {
      tempArray = [...tempArray, data];
    } else {
      tempArray = tempArray.filter((i) => i.id !== data.id);
    }
    
    setFavoriteSelected(tempArray);
    await handleExecuteMutationFavorit(tempArray);
  }
  
  useEffect(() => {
    setUrlGetList(data?.next);
    setListPokemon(data?.results);
  }, [data])

  useEffect(() => {
    console.log(getDataFavorit.data, "<<< SP DATA");
  }, [getDataFavorit.data])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
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
                <PokemonCard element="grass" name={data?.name} url={data?.url} key={idx} handleFavorit={handleClickFavorit} />
              )
            })
          }
        </div>
      </InfiniteScroll>
    </div>
  )
}
