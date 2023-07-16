export function saveFavoritData(data: []) {
    // Saves profile data to localStorage
    localStorage.setItem('favorit-pokemon', JSON.stringify(data));
}

export function getFavoritData(): [] {
    const favData = localStorage.getItem('favorit-pokemon');
    return favData ? JSON.parse(favData) : [];
}