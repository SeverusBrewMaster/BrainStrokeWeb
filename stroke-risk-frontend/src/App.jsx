import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Risk from './pages/Risk';
import User from './pages/User';
import Symptom from './pages/Symptom';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import NurseDashboard from "./pages/NurseDashboard";
import ViewPatients from './pages/ViewPatients';
import MiddlemanDashboard from './pages/MiddlemanDashboard';
import AssessmentsPage from './pages/AssessmentsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/nurse-dashboard" element={<NurseDashboard />} />
          <Route path="/middleman-dashboard" element={<MiddlemanDashboard />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/user" element={<User />} />
          <Route path="/symptom" element={<Symptom />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/view-patients" element={<ViewPatients/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;