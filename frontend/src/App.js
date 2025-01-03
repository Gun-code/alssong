import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Main from './pages/main.jsx';
import Card from '../src/pages/card.jsx';
import Guide from './pages/guide.jsx';  
import CardList from './pages/cardList.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/card' element={<Card />} />
      <Route path='/guide' element={<Guide />} />
      <Route path='/CardList' element={<CardList />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
