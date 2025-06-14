import React, { useState, useEffect } from 'react';
import logo from '../components/logo1.png';  // Adjust if path differs
import './NurseDashboard.css';
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const NurseDashboard = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    name: '', age: '', locality: '', phone: '',
    cbp: '', crp: '', rbs: '', hba1c: '',
    cholesterol: '', tg: '', homocysteine: '', lipoprotein: ''
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const handleLogout = () => {
    alert("Logged out!");
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = `PAT${Date.now()}`;  // Generates a unique token using timestamp
  const defaultStatus = "Pending";   // Initial status for middleman

  try {
    await addDoc(collection(db, "patients"), {
      ...patientData,
      tokenNumber: token,
      status: defaultStatus,
      createdAt: Timestamp.now()
    });

    alert("Patient added!");

    setPatientData({
      name: '', age: '', locality: '', phone: '',
      cbp: '', crp: '', rbs: '', hba1c: '',
      cholesterol: '', tg: '', homocysteine: '', lipoprotein: ''
    });

    fetchRecentPatients();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to save patient.");
  }
};

  const fetchRecentPatients = async () => {
    const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecentPatients(data.slice(0, 3));
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patient permanently?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "patients", id));
      alert("Patient deleted successfully!");
      fetchRecentPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient.");
    }
  };

  useEffect(() => {
    fetchRecentPatients();
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="nav-logo" />
          <h2 className="nav-title">Nurse Dashboard</h2>
        </div>
        <FaUserCircle size={30} className="profile-icon" onClick={handleLogout} title="Logout" />
      </div>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h1 className="sidebar-title">Recently Added</h1>
          {recentPatients.map(patient => (
            <div key={patient.id} className="horizontal-card">
              <div className="card-main-info">
                <p><strong>{patient.name}</strong> | Age: {patient.age} | Ph: {patient.phone}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => toggleExpand(patient.id)}>
                    {expandedId === patient.id ? 'Hide' : 'More'}
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(patient.id)}>
                    Delete
                  </button>
                </div>
              </div>

              {expandedId === patient.id && (
                <div className="card-expanded-info">
                  <p><strong>Locality:</strong> {patient.locality}</p>
                  <p><strong>CBP:</strong> {patient.cbp}</p>
                  <p><strong>CRP:</strong> {patient.crp}</p>
                  <p><strong>RBS:</strong> {patient.rbs}</p>
                  <p><strong>HbA1c:</strong> {patient.hba1c}</p>
                  <p><strong>Cholesterol:</strong> {patient.cholesterol}</p>
                  <p><strong>TG:</strong> {patient.tg}</p>
                  <p><strong>Homocysteine:</strong> {patient.homocysteine}</p>
                  <p><strong>Lipoprotein A:</strong> {patient.lipoprotein}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2 className="section-title">Add Patient</h2>
          <form onSubmit={handleSubmit} className="patient-form">
            <div className="input-group">
              <input type="text" name="name" placeholder="Name" value={patientData.name} onChange={handleChange} required />
              <input type="number" name="age" placeholder="Age" value={patientData.age} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="locality" placeholder="Locality" value={patientData.locality} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Phone Number" pattern="[0-9]{10}" value={patientData.phone} onChange={handleChange} required />
            </div>

            <h3 className="section-title">Test Results</h3>
            <div className="input-group">
              <input type="text" name="cbp" placeholder="CBP" value={patientData.cbp} onChange={handleChange} />
              <input type="text" name="crp" placeholder="CRP" value={patientData.crp} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="rbs" placeholder="RBS" value={patientData.rbs} onChange={handleChange} />
              <input type="text" name="hba1c" placeholder="HbA1c" value={patientData.hba1c} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="cholesterol" placeholder="Cholesterol" value={patientData.cholesterol} onChange={handleChange} />
              <input type="text" name="tg" placeholder="TG" value={patientData.tg} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="homocysteine" placeholder="Homocysteine" value={patientData.homocysteine} onChange={handleChange} />
              <input type="text" name="lipoprotein" placeholder="Lipoprotein A" value={patientData.lipoprotein} onChange={handleChange} />
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NurseDashboard;
