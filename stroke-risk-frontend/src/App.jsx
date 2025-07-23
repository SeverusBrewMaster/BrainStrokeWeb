import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Risk from './pages/Risk';
import User from './pages/User';
import Symptom from './pages/Symptom';
import Login from "./components/Login";
import NurseDashboard from "./pages/NurseDashboard";
import MiddlemanDashboard from './pages/MiddlemanDashboard';
import AssessmentsPage from './pages/AssessmentsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/nurse-dashboard" element={<NurseDashboard />} />
          <Route path="/medical-dashboard" element={<MiddlemanDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/report" element={<Report />} />
          <Route path="/user" element={<User />} />
          <Route path="/symptom" element={<Symptom />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;