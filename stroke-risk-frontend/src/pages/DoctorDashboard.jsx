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
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [doctorNote, setDoctorNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatientsWithAssessments = async () => {
    try {
      setLoading(true);
      const patientsQuery = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
      const patientsSnapshot = await getDocs(patientsQuery);
      const patientsData = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const assessmentsQuery = query(collection(db, 'medical_assessments'), orderBy('updatedAt', 'desc'));
      const assessmentsSnapshot = await getDocs(assessmentsQuery);
      const assessmentsData = assessmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const patientsWithAssessments = patientsData.map(patient => {
        const assessment = assessmentsData.find(assess => assess.tokenNumber === patient.tokenNumber);
        return {
          ...patient,
          assessment: assessment || null
        };
      }).filter(patient => patient.assessment !== null);

      setPatients(patientsWithAssessments);
    } catch (error) {
      console.error('Error fetching patients and assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'risk-badge risk-low';
      case 'moderate':
      case 'medium': return 'risk-badge risk-medium';
      case 'high': return 'risk-badge risk-high';
      default: return 'risk-badge';
    }
  };

  const isHighOrModerateRisk = (patient) => {
    const score = patient?.assessment?.riskAssessment?.riskScore;
    return score >= 5;
  };

  const extractRiskFactors = (patient, assessment) => {
    const contributing = [];
    const age = Number(patient.age);
    const bmi = Number(patient.bmi);
    const hba1c = Number(assessment.hba1c);
    const rbs = Number(assessment.rbs);
    const cholesterol = Number(assessment.cholesterol);
    const ldl = Number(patient.ldl);
    const hdl = Number(patient.hdl);
    const aqi = Number(patient.aqi);
    const sleep = Number(assessment.sleepHours);
    const stress = Number(assessment.stressLevel);
    const bp = patient.bloodPressure?.split('/');
    const systolic = bp && bp.length === 2 ? parseInt(bp[0]) : 0;
    const diastolic = bp && bp.length === 2 ? parseInt(bp[1]) : 0;

    if (assessment.smoke === 'yes') contributing.push("Smoking/Tobacco");
    if (systolic > 140 || diastolic > 90) contributing.push("High Blood Pressure");
    if (age > 60) contributing.push("Age > 60");
    if (['daily', 'multiple-daily'].includes(assessment.alcoholFrequency)) contributing.push("Alcohol abuse");
    if (assessment.irregularHeartbeat === 'yes') contributing.push("Atrial Fibrillation");
    if (assessment.diabetes === 'yes' || rbs > 160 || hba1c > 6.5) contributing.push("Diabetes");
    if (cholesterol > 200 || ldl > 100 || hdl < 60) contributing.push("Abnormal Lipid Profile");
    if (stress >= 3) contributing.push("High Stress");
    if (assessment.exercise === 'no') contributing.push("Lack of Exercise");
    if (bmi > 30) contributing.push("High BMI");
    if (assessment.tiaHistory === 'yes') contributing.push("History of TIA");
    if (sleep < 6) contributing.push("Sleep Deprivation");
    if (aqi > 200) contributing.push("Poor Air Quality");
    if (assessment.familyHistory === 'yes') contributing.push("Family History");

    return contributing;
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedAssessment(patient.assessment);
    setDoctorNote('');
  };

  const generatePDF = () => {
    const reportSection = document.getElementById('report-section');

    const pdfOptions = {
      margin: 10,
      filename: `${selectedPatient.name}_BrainStroke_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    const timestamp = new Date().toLocaleString();
    const originalHTML = reportSection.innerHTML;

    const headerHTML = `
      <div style="display: flex; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
        <img src="${logo}" alt="Logo" style="height: 50px; margin-right: 15px;" />
        <h2 style="text-align: center; flex: 1; margin: 0;">Brain Stroke Report</h2>
      </div>
      <p style="text-align: center; margin-top: 5px;">
        <a href="https://brainline.info/" target="_blank">brainline.info/</a>
      </p>
    `;

    const footerHTML = `
      <hr />
      <p style="font-size: 12px; text-align: center; color: gray;">
        Report generated on ${timestamp} by Dr.Ashok Hande Sir
      </p>
    `;

    const doctorNoteHTML = `
      <h3>Doctor's Recommendation</h3>
      <p>${doctorNote || 'No recommendation provided.'}</p>
    `;

    reportSection.innerHTML = headerHTML + reportSection.innerHTML + doctorNoteHTML + footerHTML;

    html2pdf().set(pdfOptions).from(reportSection).save().then(() => {
      reportSection.innerHTML = originalHTML;
    });
  };

  const sendToWhatsApp = () => {
    if (!selectedPatient?.phone) {
      alert("Phone number not available.");
      return;
    }

    const phoneNumber = selectedPatient.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${selectedPatient.name},\n\nYour brain stroke risk report has been generated.\nPlease consult further if needed.\n\n- Dr. Ashok Hande`
    );

    window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
  };

  const handleLogout = () => {
    alert("Logged out!");
    window.location.href = '/';
  };

  useEffect(() => {
    fetchPatientsWithAssessments();
  }, []);

  const filteredPatients = patients.filter(isHighOrModerateRisk);

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
        <div className="sidebar">
          <h1 className="sidebar-title">High/Moderate Risk Patients</h1>
          {filteredPatients.map(patient => {
            const { riskScore, riskCategory } = patient.assessment?.riskAssessment || {};
            return (
              <div key={patient.id} className="horizontal-card">
                <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>
                  {patient.tokenNumber}
                  <span className={getRiskClass(riskCategory)} style={{ marginLeft: '12px' }}>
                    {riskCategory}
                  </span>
                </p>
                <p style={{ margin: '4px 0', fontSize: '15px' }}>{patient.name}</p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  Risk Score: <strong>{riskScore ?? 'N/A'}</strong>
                </p>
                <button
                  style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handlePatientSelect(patient)}
                >
                  View
                </button>
              </div>
            );
          })}
        </div>

        <div className="main-content">
          {selectedPatient && selectedAssessment ? (
            <>
              <div id="report-section">
                <h3>Basic Information</h3>
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                <p><strong>Email:</strong> {selectedPatient.email}</p>
                <p><strong>Locality:</strong> {selectedPatient.locality}</p>
                <p><strong>Blood Pressure:</strong> {selectedPatient.bloodPressure}</p>
                <p><strong>BMI:</strong> {selectedPatient.bmi}</p>
                <p><strong>Waist Circumference:</strong> {selectedPatient.waist}</p>
                <p><strong>HDL:</strong> {selectedPatient.hdl}</p>
                <p><strong>LDL:</strong> {selectedPatient.ldl}</p>

                <h3>Test Results</h3>
                <p><strong>Hemoglobin:</strong> {selectedPatient.hemoglobin}</p>
                <p><strong>WBC:</strong> {selectedPatient.wbc}</p>
                <p><strong>Platelets:</strong> {selectedPatient.platelets}</p>
                <p><strong>RBC:</strong> {selectedPatient.rbc}</p>
                <p><strong>Hematocrit:</strong> {selectedPatient.hematocrit}</p>
                <p><strong>CRP:</strong> {selectedPatient.crp}</p>
                <p><strong>RBS:</strong> {selectedPatient.rbs}</p>
                <p><strong>HbA1c:</strong> {selectedPatient.hba1c}</p>
                <p><strong>Cholesterol:</strong> {selectedPatient.cholesterol}</p>
                <p><strong>TG:</strong> {selectedPatient.tg}</p>
                <p><strong>Homocysteine:</strong> {selectedPatient.homocysteine}</p>
                <p><strong>Lipoprotein A:</strong> {selectedPatient.lipoprotein}</p>

                <h3>Contributing Risk Factors</h3>
                <ul>
                  {extractRiskFactors(selectedPatient, selectedAssessment).map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
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
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button className="submit-button" onClick={generatePDF}>
                  Generate PDF Report
                </button>
                <button
                  className="submit-button"
                  style={{ backgroundColor: '#28a745' }}
                  onClick={sendToWhatsApp}
                >
                  Send to Patient
                </button>
              </div>
            </>
          ) : (
            <div>
              <p>Select a patient to view details and generate report.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
