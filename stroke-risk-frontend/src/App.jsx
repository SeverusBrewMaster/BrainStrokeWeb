import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Risk from './pages/Risk';
import User from './pages/User';
import Symptom from './pages/Symptom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/user" element={<User />} />
          <Route path="/symptom" element={<Symptom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;