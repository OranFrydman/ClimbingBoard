import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Workout from './components/Workout';
import Statistics from './components/Statistics';
import CrushView from './components/CrushView';

function App() {
  console.log('App component rendering...');
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/Workout" element={<Workout />} />
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/CrushView" element={<CrushView />} />
      </Routes>
    </div>
  );
}

export default App;
