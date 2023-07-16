import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';

import LandingPage from './pages/LandingPage';
import DetailPokemon from './pages/DetailPokemon';
import FavoritePokemon from './pages/FavoritePokemon';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/:name' element={<DetailPokemon />} />
        <Route path='/favorite' element={<FavoritePokemon />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App