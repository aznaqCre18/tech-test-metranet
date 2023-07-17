import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

import  Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import { getFirsrListPokemon, getNextPokemonList, getPokemonByType } from '../../api/getPokemon';
import LoadingIcon from '../../components/LoadingIcon';
import { getFavoritData, saveFavoritData } from '../../utils/handleFavoritData';

type listPokemon = {
  name: string,
  url: string,
}[]

type listPokemonSec = {
  pokemon: listPokemon
}[]

type pokemonList = {
  next: string,
  results: listPokemon[]
}

export default function LandingPage() {
  const [listPokemon, setListPokemon] = useState<listPokemon | listPokemonSec | any>([]);
  const [urlGetList, setUrlGetList] = useState<string | undefined>('');
  const [hasMore, setHasMore] = useState(true);
  const [typeSelected, setTypeSelected] = useState([]);
  const queryClient = useQueryClient();
  
  const { data, isError, isLoading, error }: UseQueryResult<pokemonList, Error> = useQuery(['getFirstListPokemon'], getFirsrListPokemon);
  const getDataFavorit: UseQueryResult<[], unknown> = useQuery(['data-favorit'], getFavoritData);
  const getPokemonByTypes = useQuery(['pokemon-type', typeSelected], () => getPokemonByType(typeSelected));

  const fetchMoreData = () => {
    setTimeout(async (): Promise<void> => {
      const res: any = await getNextPokemonList(urlGetList);
      const mergedArray = listPokemon?.concat(res.results);
      
      setListPokemon(mergedArray);
      setUrlGetList(res.next);

      if (!res?.next) {
        setHasMore(false);
      }
    }, 1000);
  }

  const postDataFavoritMutation = useMutation(async (newData: any) => {
    saveFavoritData(newData);
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['data-favorit']);
    }
  });

  const handleExecuteMutationFavorit = (newDataFav: any) => {
    postDataFavoritMutation.mutate(newDataFav);
  }
  
  const handleClickFavorit = (data: { id: string }) => {
    let tempArray: { id: string }[] | void = getFavoritData();
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const commonIds = listPokemon?.reduce((result: string[], item: { name: string }) => {
    if (getDataFavorit?.data?.find((obj: { name: string }) => obj.name === item.name)) {
      result.push(item.name)
    }
    return result;
  }, [])

  const handleChangeFilterCheckbox = (e: any) => {
    let tempArr: any = typeSelected;

    if (tempArr.includes(e.target.value)) {
      tempArr = tempArr.filter((i: string) => i !== e.target.value);
    } else {
      tempArr = [...tempArr, e.target.value];
    }

    setTypeSelected(tempArr);
  }

  const handleApplyFilter = () => {
    setListPokemon(getPokemonByTypes.data);
  }
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="landing-container">
      <Header onChange={handleChangeFilterCheckbox} onApply={handleApplyFilter} />
      <InfiniteScroll
        dataLength={listPokemon?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LoadingIcon />}
      >
        <div className="card-list-section">
          {
            listPokemon?.map((data: any, idx: number) => {
              return (
                <PokemonCard name={data?.name || data?.pokemon?.name} url={data?.url || data?.pokemon?.url} key={idx} handleFavorit={handleClickFavorit} isFavorit={commonIds?.includes(data?.name) ? true : false} />
              )
            })
          }
        </div>
      </InfiniteScroll>
    </div>
  )
}
