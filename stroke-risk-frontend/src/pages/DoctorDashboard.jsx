import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FaUserCircle } from "react-icons/fa";
import html2pdf from 'html2pdf.js';
import logo from '../components/logo1.png';
import './DoctorDashboard.css'; // You can rename the CSS or duplicate it

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorNote, setDoctorNote] = useState('');

  const fetchPatients = async () => {
    const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPatients(data);
  };

  const handleLogout = () => {
    alert("Logged out!");
    window.location.href = '/';
  };

  const isHighRisk = (patient) => {
    const score = calculateRiskScore(patient).score;
    return score > 7;
  };

  const calculateRiskScore = (patient) => {
    let score = 0;
    const ageNum = parseInt(patient.age) || 0;

    if (patient.smoke === 'yes') score += 1;
    if (patient.hypertension === 'yes') score += 4;
    if (ageNum > 60) score += 1;
    if (patient.alcohol === 'yes') score += 1;
    if (patient.irregularHeartbeat === 'yes') score += 4;
    if (patient.diabetes === 'yes') score += 2;
    if (patient.familyHistory === 'yes') score += 1;
    if (patient.exercise === 'no') score += 1;
    if ((patient.symptoms || []).length >= 2) score += 1;
    if (patient.heartDisease === 'yes') score += 1;
    if (patient.thyroidDisease === 'yes') score += 1;

    let category = '';
    let recommendation = '';

    if (score <= 3) {
      category = 'Low';
      recommendation = 'You are a healthy individual. Maintain your current lifestyle with regular check-ups.';
    } else if (score >= 4 && score <= 7) {
      category = 'Moderate';
      recommendation = 'Moderate risk detected. Consider dietary modifications, regular exercise, and follow-up with your physician.';
    } else {
      category = 'High';
      recommendation = 'High risk detected. Immediate consultation with a healthcare provider is recommended.';
    }

    return { score, category, recommendation };
  };

  const generatePDF = () => {
    const element = document.getElementById('report-section');
    html2pdf().from(element).save(`${selectedPatient.name}_Report.pdf`);
    setDoctorNote('');
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="nav-logo" />
          <h2 className="nav-title">Doctor Dashboard</h2>
        </div>
        <FaUserCircle size={30} className="profile-icon" onClick={handleLogout} title="Logout" />
      </div>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h1 className="sidebar-title">High-Risk Patients</h1>
          {patients.filter(isHighRisk).map(patient => (
            <div key={patient.id} className="horizontal-card">
              <div className="card-main-info">
                <p><strong>{patient.name}</strong> | Age: {patient.age}</p>
                <button onClick={() => setSelectedPatient(patient)}>View</button>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2 className="section-title">Patient Details</h2>

          {selectedPatient ? (
            <>
              <div id="report-section">
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                <p><strong>CBP:</strong> {selectedPatient.cbp}</p>
                <p><strong>CRP:</strong> {selectedPatient.crp}</p>
                <p><strong>RBS:</strong> {selectedPatient.rbs}</p>
                <p><strong>HbA1c:</strong> {selectedPatient.hba1c}</p>
                <p><strong>Cholesterol:</strong> {selectedPatient.cholesterol}</p>
                <p><strong>TG:</strong> {selectedPatient.tg}</p>
                <p><strong>Homocysteine:</strong> {selectedPatient.homocysteine}</p>
                <p><strong>Lipoprotein A:</strong> {selectedPatient.lipoprotein}</p>

                {(() => {
                  const { score, category, recommendation } = calculateRiskScore(selectedPatient);
                  return (
                    <>
                      <p><strong>Risk Score:</strong> {score}</p>
                      <p><strong>Category:</strong> {category}</p>
                      <p><strong>System Recommendation:</strong> {recommendation}</p>
                    </>
                  );
                })()}

                {doctorNote && (
                  <>
                    <hr />
                    <p><strong>Doctor's Recommendation:</strong></p>
                    <p>{doctorNote}</p>
                  </>
                )}
              </div>

              <div style={{ marginTop: '20px' }}>
                <label htmlFor="doctor-note"><strong>Doctor's Recommendation:</strong></label>
                <textarea
                  id="doctor-note"
                  rows="4"
                  placeholder="Write your recommendation here..."
                  style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                />
              </div>

              <button className="submit-button" style={{ marginTop: '20px' }} onClick={generatePDF}>
                Generate PDF
              </button>
            </>
          ) : (
            <p>Select a patient to view details and generate report.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
