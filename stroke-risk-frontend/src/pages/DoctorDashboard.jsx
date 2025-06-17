import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FaUserCircle } from "react-icons/fa";
import html2pdf from 'html2pdf.js';
import logo from '../components/logo1.png';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorNote, setDoctorNote] = useState('');

  // Fetch from "medical_assessment"
  const fetchPatients = async () => {
    const q = query(collection(db, 'medical_assessment'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPatients(data);
  };

  const handleLogout = () => {
    alert("Logged out!");
    window.location.href = '/';
  };

  const generatePDF = () => {
    const element = document.getElementById('report-section');
    html2pdf().from(element).save(`${selectedPatient.patientId}_Report.pdf`);
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
          <h1 className="sidebar-title">Moderate & High Risk Patients</h1>
          {patients
            .filter(p =>
              p.riskAssessment &&
              (p.riskAssessment.riskCategory === 'Moderate' || p.riskAssessment.riskCategory === 'High')
            )
            .map(patient => (
              <div key={patient.id} className="horizontal-card">
                <div className="card-main-info">
                  <p><strong>{patient.name}</strong> | Age: {patient.patientVitals?.age}</p>
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
                <p><strong>Age:</strong> {selectedPatient.patientVitals?.age}</p>
                <p><strong>Phone:</strong> {selectedPatient.phone}</p>

                <h3>Nurse Test Results</h3>
                <p><strong>Blood Pressure:</strong> {selectedPatient.patientVitals?.bloodPressure}</p>
                <p><strong>BMI:</strong> {selectedPatient.patientVitals?.bmi}</p>
                <p><strong>HbA1c:</strong> {selectedPatient.patientVitals?.hba1c}</p>
                <p><strong>Cholesterol:</strong> {selectedPatient.patientVitals?.cholesterol}</p>
                <p><strong>LDL:</strong> {selectedPatient.patientVitals?.ldl}</p>
                <p><strong>HDL:</strong> {selectedPatient.patientVitals?.hdl}</p>
                <p><strong>Air Quality Index (AQI):</strong> {selectedPatient.patientVitals?.aqi}</p>

                <h3>Reported Symptoms</h3>
                <ul>
                  {(selectedPatient.symptoms || []).map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>

                <h3>Risk Assessment</h3>
                <p><strong>Risk Score:</strong> {selectedPatient.riskAssessment?.riskScore}</p>
                <p><strong>Risk Category:</strong> {selectedPatient.riskAssessment?.riskCategory}</p>
                <p><strong>System Recommendations:</strong> {selectedPatient.riskAssessment?.recommendations}</p>

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
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                />
              </div>

              <button
                className="submit-button"
                style={{ marginTop: '20px' }}
                onClick={generatePDF}
              >
                Generate PDF
              </button>
            </>
          ) : (
            <p>Select a patient to view their report and recommendations.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
