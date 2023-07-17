import { POKEDEX_BASE_URL } from "../configs/services";
import fetch from "../utils/fetch"

type listPokemon = {
    name: string,
    url: string,
}

type pokemonList = {
    next: string,
    results: listPokemon[]
}

export const getFirsrListPokemon = async () => {
    const options = {
        method: 'GET',
        url: `${POKEDEX_BASE_URL}/pokemon?limit=18`
    }
    const res = await fetch(options);
    return res;
}

export const getDetailPokemon = async (url: string) => {
    const options = {
        method: 'GET',
        url
    }

    const res = await fetch(options);
    return res;
}

export const getNextPokemonList = async (url: string | undefined) => {
    const options = {
        method: 'GET',
        url
    }

    const res: pokemonList = await fetch(options) as pokemonList;
    return res;
}

export const getDetailPokemonPage = async (name: string | undefined) => {
    const options = {
        method: 'GET',
        url: `${POKEDEX_BASE_URL}/pokemon/${name ?? ''}`
    }

    const res = await fetch(options);
    return res;
}

export const getDetailSpecies = async (name?: string) => {
    const options = {
        method: 'GET',
        url: `${POKEDEX_BASE_URL}/pokemon-species/${name ?? ''}`
    }

    const res = await fetch(options);
    return res;
}

export const getPokemonByType = async (types: string[]) => {
    const fetchData = async (type: string) => {
        const options = {
            method: 'GET',
            url: `${POKEDEX_BASE_URL}/type/${type}`
        }

        const response = await fetch(options);
        return response.pokemon;
    };
      
    const fetchAllData = async () => {
        const promises = types.map(type => fetchData(type));
        const allData = await Promise.all(promises);
        return allData.flat(); // Menggabungkan data dari semua jenis menjadi satu array
    };
      
    const allPokemon = await fetchAllData();
    return allPokemon;
}