import { POKEDEX_BASE_URL } from "../configs/services"
import fetch from "../utils/fetch"

export const getFirsrListPokemon = async () => {
    const options = {
        method: 'GET',
        url: `${POKEDEX_BASE_URL}/pokemon?limit=18`
    }
    const res = await fetch(options);
    console.log(res);
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