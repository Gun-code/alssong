import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main';
import MyCard from './pages/myCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mycard" element={<MyCard />} />
        <Route path="/card" element={<Navigate to="/mycard" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 