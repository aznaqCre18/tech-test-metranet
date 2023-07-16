export function saveFavoritData(data: []) {
    // Saves profile data to localStorage
    localStorage.setItem('favorit-pokemon', JSON.stringify(data));
}