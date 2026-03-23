import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Canvas from './pages/Canvas';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
}
