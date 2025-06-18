import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
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
      
      // Fetch all patients
      const patientsQuery = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
      const patientsSnapshot = await getDocs(patientsQuery);
      const patientsData = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch all medical assessments
      const assessmentsQuery = query(collection(db, 'medical_assessments'), orderBy('updatedAt', 'desc'));
      const assessmentsSnapshot = await getDocs(assessmentsQuery);
      const assessmentsData = assessmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Combine patients with their assessments
      const patientsWithAssessments = patientsData.map(patient => {
        const assessment = assessmentsData.find(assess => assess.tokenNumber === patient.tokenNumber);
        return {
          ...patient,
          assessment: assessment || null
        };
      }).filter(patient => patient.assessment !== null); // Only include patients with assessments

      setPatients(patientsWithAssessments);
    } catch (error) {
      console.error('Error fetching patients and assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    alert("Logged out!");
    window.location.href = '/';
  };

  const isHighRisk = (patient) => {
    if (!patient.assessment || !patient.assessment.riskAssessment) return false;
    return patient.assessment.riskAssessment.riskScore > 4;
  };

  const calculateRiskScore = (patient, assessment) => {
    if (assessment && assessment.riskAssessment) {
      return {
        score: assessment.riskAssessment.riskScore,
        category: assessment.riskAssessment.riskCategory,
        recommendation: assessment.riskAssessment.recommendations
      };
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedAssessment(patient.assessment);
    setDoctorNote('');
  };

  const generatePDF = () => {
    const element = document.getElementById('report-section');
    html2pdf().from(element).save(`${selectedPatient.name}_Report.pdf`);
    setDoctorNote('');
  };

  useEffect(() => {
    fetchPatientsWithAssessments();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading patients and assessments...</p>
      </div>
    );
  }

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
                <p>Token: {patient.tokenNumber}</p>
                <p>Risk Score: {patient.assessment?.riskAssessment?.riskScore || 'N/A'}</p>
                <button onClick={() => handlePatientSelect(patient)}>View</button>
              </div>
            </div>
          ))}
          
          {patients.filter(isHighRisk).length === 0 && (
            <p>No high-risk patients found.</p>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2 className="section-title">Patient Details</h2>

          {selectedPatient && selectedAssessment ? (
            <>
              <div id="report-section">
                {/* Patient Basic Info */}
                <h3>Patient Information</h3>
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                <p><strong>Email:</strong> {selectedPatient.email}</p>
                <p><strong>Token Number:</strong> {selectedPatient.tokenNumber}</p>
                <p><strong>Locality:</strong> {selectedPatient.locality}</p>

                {/* Lab Results from Patients Collection */}
                <h3>Lab Results</h3>
                <p><strong>BMI:</strong> {selectedPatient.bmi}</p>
                <p><strong>Blood Pressure:</strong> {selectedPatient.bloodPressure}</p>
                <p><strong>HDL:</strong> {selectedPatient.hdl}</p>
                <p><strong>LDL:</strong> {selectedPatient.ldl}</p>
                <p><strong>Cholesterol:</strong> {selectedPatient.cholesterol}</p>
                <p><strong>Triglycerides:</strong> {selectedPatient.tg}</p>
                <p><strong>HbA1c:</strong> {selectedPatient.hba1c}</p>
                <p><strong>RBS:</strong> {selectedPatient.rbs}</p>
                <p><strong>CRP:</strong> {selectedPatient.crp}</p>
                <p><strong>Homocysteine:</strong> {selectedPatient.homocysteine}</p>
                <p><strong>Lipoprotein A:</strong> {selectedPatient.lipoprotein}</p>
                <p><strong>Hemoglobin:</strong> {selectedPatient.hemoglobin}</p>

                {/* Assessment Data */}
                <h3>Health Assessment</h3>
                <p><strong>Exercise:</strong> {selectedAssessment.exercise}</p>
                <p><strong>Exercise Frequency:</strong> {selectedAssessment.exerciseFrequency}</p>
                <p><strong>Diet:</strong> {selectedAssessment.diet}</p>
                <p><strong>Outside Food:</strong> {selectedAssessment.outsideFood}</p>
                <p><strong>Alcohol:</strong> {selectedAssessment.alcohol}</p>
                <p><strong>Smoking:</strong> {selectedAssessment.smoke}</p>
                <p><strong>Hypertension:</strong> {selectedAssessment.hypertension}</p>
                <p><strong>Diabetes:</strong> {selectedAssessment.diabetes}</p>
                <p><strong>Irregular Heartbeat:</strong> {selectedAssessment.irregularHeartbeat}</p>
                <p><strong>Family History:</strong> {selectedAssessment.familyHistory}</p>

                {/* Past Conditions */}
                {selectedAssessment.pastConditions && (
                  <>
                    <h4>Past Medical Conditions</h4>
                    <p><strong>Heart Disease:</strong> {selectedAssessment.pastConditions.heartDisease ? 'Yes' : 'No'}</p>
                    <p><strong>Thyroid Disease:</strong> {selectedAssessment.pastConditions.thyroidDisease ? 'Yes' : 'No'}</p>
                    <p><strong>Asthma:</strong> {selectedAssessment.pastConditions.asthma ? 'Yes' : 'No'}</p>
                    <p><strong>Migraine:</strong> {selectedAssessment.pastConditions.migraine ? 'Yes' : 'No'}</p>
                  </>
                )}

                {/* Symptoms */}
                {selectedAssessment.symptoms && selectedAssessment.symptoms.length > 0 && (
                  <>
                    <h4>Symptoms</h4>
                    <ul>
                      {selectedAssessment.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Risk Assessment */}
                <h3>Risk Assessment</h3>
                {(() => {
                  const { score, category, recommendation } = calculateRiskScore(selectedPatient, selectedAssessment);
                  return (
                    <>
                      <p><strong>Risk Score:</strong> {score}</p>
                      <p><strong>Risk Category:</strong> {category}</p>
                      <p><strong>System Recommendation:</strong> {recommendation}</p>
                    </>
                  );
                })()}

                <p><strong>Assessment Status:</strong> {selectedAssessment.status}</p>
                <p><strong>Last Updated:</strong> {selectedAssessment.lastUpdated}</p>

                {doctorNote && (
                  <>
                    <hr />
                    <h3>Doctor's Recommendation</h3>
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
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                />
              </div>

              <button className="submit-button" style={{ marginTop: '20px' }} onClick={generatePDF}>
                Generate PDF Report
              </button>
            </>
          ) : (
            <div>
              <p>Select a patient to view details and generate report.</p>
              {patients.length === 0 && !loading && (
                <p>No patients with medical assessments found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;

// import React, { useState, useEffect } from 'react';
// import { FaUserCircle, FaExclamationTriangle, FaHeartbeat, FaVial, FaClipboardList, FaSearch, FaFilter, FaBell, FaDownload, FaSave, FaEye, FaChevronDown, FaChevronRight } from "react-icons/fa";

// const DoctorDashboard = () => {
//   const [patients, setPatients] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [doctorNote, setDoctorNote] = useState('');
//   const [recommendedTests, setRecommendedTests] = useState([]);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [riskFilter, setRiskFilter] = useState('all');
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({});

//   // Mock data for demonstration
//   const mockPatients = [
//     {
//       id: '1',
//       name: 'John Doe',
//       age: '65',
//       phone: '+1-555-0123',
//       cbp: '140/90',
//       crp: '3.2',
//       rbs: '180',
//       hba1c: '7.8',
//       cholesterol: '240',
//       tg: '200',
//       homocysteine: '15',
//       lipoprotein: '50',
//       smoke: 'yes',
//       hypertension: 'yes',
//       alcohol: 'no',
//       irregularHeartbeat: 'yes',
//       diabetes: 'yes',
//       familyHistory: 'yes',
//       exercise: 'no',
//       symptoms: ['chest pain', 'shortness of breath'],
//       heartDisease: 'no',
//       thyroidDisease: 'no',
//       createdAt: new Date('2024-12-15')
//     },
//     {
//       id: '2',
//       name: 'Jane Smith',
//       age: '45',
//       phone: '+1-555-0124',
//       cbp: '120/80',
//       crp: '1.8',
//       rbs: '95',
//       hba1c: '5.2',
//       cholesterol: '180',
//       tg: '120',
//       homocysteine: '8',
//       lipoprotein: '25',
//       smoke: 'no',
//       hypertension: 'no',
//       alcohol: 'yes',
//       irregularHeartbeat: 'no',
//       diabetes: 'no',
//       familyHistory: 'no',
//       exercise: 'yes',
//       symptoms: ['fatigue'],
//       heartDisease: 'no',
//       thyroidDisease: 'yes',
//       createdAt: new Date('2024-12-14')
//     },
//     {
//       id: '3',
//       name: 'Robert Johnson',
//       age: '72',
//       phone: '+1-555-0125',
//       cbp: '160/95',
//       crp: '4.1',
//       rbs: '220',
//       hba1c: '8.5',
//       cholesterol: '280',
//       tg: '300',
//       homocysteine: '18',
//       lipoprotein: '65',
//       smoke: 'yes',
//       hypertension: 'yes',
//       alcohol: 'yes',
//       irregularHeartbeat: 'yes',
//       diabetes: 'yes',
//       familyHistory: 'yes',
//       exercise: 'no',
//       symptoms: ['chest pain', 'dizziness', 'palpitations'],
//       heartDisease: 'yes',
//       thyroidDisease: 'no',
//       createdAt: new Date('2024-12-13')
//     }
//   ];

//   const availableTests = [
//     { id: 'ecg', name: 'ECG/EKG', category: 'Cardiac', urgency: 'high' },
//     { id: 'echo', name: 'Echocardiogram', category: 'Cardiac', urgency: 'medium' },
//     { id: 'stress_test', name: 'Stress Test', category: 'Cardiac', urgency: 'medium' },
//     { id: 'lipid_profile', name: 'Complete Lipid Profile', category: 'Blood', urgency: 'low' },
//     { id: 'hba1c', name: 'HbA1c (Diabetes)', category: 'Blood', urgency: 'medium' },
//     { id: 'thyroid', name: 'Thyroid Function Test', category: 'Hormonal', urgency: 'low' },
//     { id: 'kidney', name: 'Kidney Function Test', category: 'Blood', urgency: 'medium' },
//     { id: 'liver', name: 'Liver Function Test', category: 'Blood', urgency: 'low' },
//     { id: 'vitamin_d', name: 'Vitamin D', category: 'Nutritional', urgency: 'low' },
//     { id: 'b12', name: 'Vitamin B12', category: 'Nutritional', urgency: 'low' },
//     { id: 'chest_xray', name: 'Chest X-Ray', category: 'Imaging', urgency: 'medium' },
//     { id: 'ct_angiogram', name: 'CT Angiogram', category: 'Imaging', urgency: 'high' }
//   ];

//   const handleLogout = () => {
//     alert("Logged out!");
//   };

//   const calculateRiskScore = (patient) => {
//     let score = 0;
//     const factors = [];
//     const ageNum = parseInt(patient.age) || 0;

//     if (patient.smoke === 'yes') {
//       score += 1;
//       factors.push({ factor: 'Smoking', points: 1, severity: 'moderate' });
//     }
//     if (patient.hypertension === 'yes') {
//       score += 4;
//       factors.push({ factor: 'Hypertension', points: 4, severity: 'high' });
//     }
//     if (ageNum > 60) {
//       score += 1;
//       factors.push({ factor: 'Age > 60', points: 1, severity: 'low' });
//     }
//     if (patient.alcohol === 'yes') {
//       score += 1;
//       factors.push({ factor: 'Alcohol Consumption', points: 1, severity: 'moderate' });
//     }
//     if (patient.irregularHeartbeat === 'yes') {
//       score += 4;
//       factors.push({ factor: 'Irregular Heartbeat', points: 4, severity: 'high' });
//     }
//     if (patient.diabetes === 'yes') {
//       score += 2;
//       factors.push({ factor: 'Diabetes', points: 2, severity: 'moderate' });
//     }
//     if (patient.familyHistory === 'yes') {
//       score += 1;
//       factors.push({ factor: 'Family History', points: 1, severity: 'low' });
//     }
//     if (patient.exercise === 'no') {
//       score += 1;
//       factors.push({ factor: 'Lack of Exercise', points: 1, severity: 'low' });
//     }
//     if ((patient.symptoms || []).length >= 2) {
//       score += 1;
//       factors.push({ factor: 'Multiple Symptoms', points: 1, severity: 'moderate' });
//     }
//     if (patient.heartDisease === 'yes') {
//       score += 1;
//       factors.push({ factor: 'Heart Disease', points: 1, severity: 'moderate' });
//     }
//     if (patient.thyroidDisease === 'yes') {
//       score += 1;
//       factors.push({ factor: 'Thyroid Disease', points: 1, severity: 'low' });
//     }

//     let category = '';
//     let recommendation = '';

//     if (score <= 3) {
//       category = 'Low';
//       recommendation = 'Maintain current lifestyle with regular check-ups.';
//     } else if (score >= 4 && score <= 7) {
//       category = 'Moderate';
//       recommendation = 'Consider lifestyle modifications and regular monitoring.';
//     } else {
//       category = 'High';
//       recommendation = 'Immediate consultation and comprehensive evaluation recommended.';
//     }

//     return { score, category, recommendation, factors };
//   };

//   const handleTestRecommendation = (testId) => {
//     setRecommendedTests(prev => 
//       prev.includes(testId) 
//         ? prev.filter(id => id !== testId)
//         : [...prev, testId]
//     );
//   };

//   const saveRecommendations = async () => {
//     if (!selectedPatient) return;
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       alert('Recommendations saved successfully!');
//     } catch (error) {
//       console.error('Error saving recommendations:', error);
//       alert('Error saving recommendations');
//     }
//   };

//   const generatePDF = () => {
//     alert('PDF generation functionality would be implemented here');
//   };

//   const getRiskColor = (category) => {
//     switch (category.toLowerCase()) {
//       case 'low': return 'text-green-600 bg-green-100';
//       case 'moderate': return 'text-orange-600 bg-orange-100';
//       case 'high': return 'text-red-600 bg-red-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case 'low': return 'bg-green-50 border-green-200';
//       case 'moderate': return 'bg-orange-50 border-orange-200';
//       case 'high': return 'bg-red-50 border-red-200';
//       default: return 'bg-gray-50 border-gray-200';
//     }
//   };

//   const getUrgencyColor = (urgency) => {
//     switch (urgency) {
//       case 'high': return 'bg-red-100 text-red-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   // Filter patients based on search and risk level
//   useEffect(() => {
//     let filtered = mockPatients.filter(patient => 
//       patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       patient.phone.includes(searchTerm)
//     );

//     if (riskFilter !== 'all') {
//       filtered = filtered.filter(patient => {
//         const risk = calculateRiskScore(patient);
//         return risk.category.toLowerCase() === riskFilter;
//       });
//     }

//     setFilteredPatients(filtered);
//     setPatients(mockPatients);
//   }, [searchTerm, riskFilter]);

//   useEffect(() => {
//     if (selectedPatient?.doctorRecommendations) {
//       setRecommendedTests(selectedPatient.doctorRecommendations.tests || []);
//       setDoctorNote(selectedPatient.doctorRecommendations.notes || '');
//     } else {
//       setRecommendedTests([]);
//       setDoctorNote('');
//     }
//   }, [selectedPatient]);

//   const riskAnalysis = selectedPatient ? calculateRiskScore(selectedPatient) : null;
//   const highRiskPatients = patients.filter(p => calculateRiskScore(p).category === 'High').length;

//   return (

//   <>
//     {/* Tailwind CSS CDN */}
//       <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
      
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {/* Navigation */}
//       <nav className="bg-slate-800 text-black shadow-lg">
//         <div className="px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//               <FaHeartbeat className="text-white text-xl" />
//             </div>
//             <h1 className="text-2xl font-bold">CardioMed Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <button 
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors"
//               >
//                 <FaBell className="text-xl" />
//                 {highRiskPatients > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {highRiskPatients}
//                   </span>
//                 )}
//               </button>
              
//               {showNotifications && (
//                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
//                   <div className="p-4 border-b">
//                     <h3 className="font-semibold text-gray-800">Notifications</h3>
//                   </div>
//                   <div className="p-4">
//                     <div className="text-red-600 flex items-center space-x-2">
//                       <FaExclamationTriangle />
//                       <span>{highRiskPatients} high-risk patients require immediate attention</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <button 
//               onClick={handleLogout}
//               className="flex items-center space-x-2 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
//             >
//               <FaUserCircle className="text-2xl" />
//               <span>Dr. Smith</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
//           {/* Search and Filter */}
//           <div className="p-6 border-b border-gray-200 space-y-4">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search patients..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <FaFilter className="text-gray-400" />
//               <select
//                 className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={riskFilter}
//                 onChange={(e) => setRiskFilter(e.target.value)}
//               >
//                 <option value="all">All Risk Levels</option>
//                 <option value="high">High Risk</option>
//                 <option value="moderate">Moderate Risk</option>
//                 <option value="low">Low Risk</option>
//               </select>
//             </div>
//           </div>

//           {/* Patient List */}
//           <div className="flex-1 overflow-y-auto">
//             <div className="p-4">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <FaClipboardList className="mr-2 text-blue-600" />
//                 Patients ({filteredPatients.length})
//               </h3>
//             </div>
            
//             {filteredPatients.map(patient => {
//               const risk = calculateRiskScore(patient);
//               const isSelected = selectedPatient?.id === patient.id;
              
//               return (
//                 <div 
//                   key={patient.id} 
//                   className={`mx-4 mb-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                     isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => setSelectedPatient(patient)}
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h4 className="font-semibold text-gray-800">{patient.name}</h4>
//                       <p className="text-sm text-gray-600">Age: {patient.age} | {patient.phone}</p>
//                     </div>
                    
//                     <div className="text-right">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(risk.category)}`}>
//                         {risk.category} Risk
//                       </span>
//                       <p className="text-xs text-gray-500 mt-1">Score: {risk.score}</p>
//                     </div>
//                   </div>
                  
//                   {risk.category === 'High' && (
//                     <div className="flex items-center text-red-600 text-sm mt-2">
//                       <FaExclamationTriangle className="mr-1" />
//                       Requires immediate attention
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 overflow-auto">
//           {selectedPatient ? (
//             <div className="p-6">
//               {/* Patient Header */}
//               <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedPatient.name}</h2>
//                     <div className="flex items-center space-x-4 text-gray-600">
//                       <span>Age: {selectedPatient.age}</span>
//                       <span>•</span>
//                       <span>{selectedPatient.phone}</span>
//                       <span>•</span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(riskAnalysis?.category)}`}>
//                         {riskAnalysis?.category} Risk Patient
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="flex space-x-2">
//                     <button 
//                       onClick={generatePDF}
//                       className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       <FaDownload />
//                       <span>Export PDF</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Tab Navigation */}
//               <div className="bg-white rounded-lg shadow-sm mb-6">
//                 <div className="border-b border-gray-200">
//                   <nav className="flex space-x-8 px-6">
//                     {[
//                       { id: 'overview', label: 'Patient Overview', icon: FaClipboardList },
//                       { id: 'risk', label: 'Risk Analysis', icon: FaHeartbeat },
//                       { id: 'tests', label: 'Test Recommendations', icon: FaVial }
//                     ].map(tab => (
//                       <button
//                         key={tab.id}
//                         onClick={() => setActiveTab(tab.id)}
//                         className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
//                           activeTab === tab.id 
//                             ? 'border-blue-500 text-blue-600' 
//                             : 'border-transparent text-gray-500 hover:text-gray-700'
//                         }`}
//                       >
//                         <tab.icon />
//                         <span>{tab.label}</span>
//                       </button>
//                     ))}
//                   </nav>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="p-6">
//                   {activeTab === 'overview' && (
//                     <div className="space-y-6">
//                       {/* Vital Signs */}
//                       <div>
//                         <button
//                           onClick={() => toggleSection('vitals')}
//                           className="flex items-center justify-between w-full text-left"
//                         >
//                           <h3 className="text-xl font-semibold text-gray-800">Vital Signs & Lab Results</h3>
//                           {expandedSections.vitals ? <FaChevronDown /> : <FaChevronRight />}
//                         </button>
                        
//                         {(expandedSections.vitals !== false) && (
//                           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {[
//                               { label: 'Blood Pressure', value: selectedPatient.cbp, unit: 'mmHg', status: 'high' },
//                               { label: 'C-Reactive Protein', value: selectedPatient.crp, unit: 'mg/L', status: 'normal' },
//                               { label: 'Random Blood Sugar', value: selectedPatient.rbs, unit: 'mg/dL', status: 'high' },
//                               { label: 'HbA1c', value: selectedPatient.hba1c, unit: '%', status: 'high' },
//                               { label: 'Total Cholesterol', value: selectedPatient.cholesterol, unit: 'mg/dL', status: 'high' },
//                               { label: 'Triglycerides', value: selectedPatient.tg, unit: 'mg/dL', status: 'normal' }
//                             ].map((vital, index) => (
//                               <div key={index} className="bg-gray-50 p-4 rounded-lg">
//                                 <div className="flex justify-between items-start">
//                                   <div>
//                                     <p className="text-sm text-gray-600">{vital.label}</p>
//                                     <p className="text-2xl font-bold text-gray-800">{vital.value}</p>
//                                     <p className="text-sm text-gray-500">{vital.unit}</p>
//                                   </div>
//                                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                                     vital.status === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                                   }`}>
//                                     {vital.status}
//                                   </span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>

//                       {/* Risk Summary */}
//                       <div className={`p-6 rounded-lg border-2 ${
//                         riskAnalysis?.category === 'High' ? 'bg-red-50 border-red-200' :
//                         riskAnalysis?.category === 'Moderate' ? 'bg-orange-50 border-orange-200' :
//                         'bg-green-50 border-green-200'
//                       }`}>
//                         <div className="flex items-center space-x-3 mb-4">
//                           <FaHeartbeat className={`text-2xl ${
//                             riskAnalysis?.category === 'High' ? 'text-red-600' :
//                             riskAnalysis?.category === 'Moderate' ? 'text-orange-600' :
//                             'text-green-600'
//                           }`} />
//                           <div>
//                             <h3 className="text-xl font-semibold text-gray-800">Risk Assessment Summary</h3>
//                             <p className="text-gray-600">Overall cardiovascular risk evaluation</p>
//                           </div>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                           <div>
//                             <p className="text-sm text-gray-600">Risk Score</p>
//                             <p className="text-3xl font-bold text-gray-800">{riskAnalysis?.score}</p>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-600">Risk Category</p>
//                             <p className={`text-lg font-semibold ${
//                               riskAnalysis?.category === 'High' ? 'text-red-600' :
//                               riskAnalysis?.category === 'Moderate' ? 'text-orange-600' :
//                               'text-green-600'
//                             }`}>
//                               {riskAnalysis?.category} Risk
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-600">Priority</p>
//                             <p className="text-lg font-semibold text-gray-800">
//                               {riskAnalysis?.category === 'High' ? 'Urgent' : 'Routine'}
//                             </p>
//                           </div>
//                         </div>
                        
//                         <div className="bg-white p-4 rounded-lg">
//                           <h4 className="font-semibold text-gray-800 mb-2">System Recommendation</h4>
//                           <p className="text-gray-700">{riskAnalysis?.recommendation}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeTab === 'risk' && riskAnalysis && (
//                     <div className="space-y-6">
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <div className="bg-gray-50 p-6 rounded-lg">
//                           <h3 className="text-xl font-semibold text-gray-800 mb-4">Risk Score Breakdown</h3>
//                           <div className="space-y-3">
//                             <div className="flex justify-between items-center">
//                               <span className="text-gray-600">Total Score</span>
//                               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.score}</span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                               <span className="text-gray-600">Risk Category</span>
//                               <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(riskAnalysis.category)}`}>
//                                 {riskAnalysis.category}
//                               </span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                               <span className="text-gray-600">Contributing Factors</span>
//                               <span className="text-lg font-semibold text-gray-800">{riskAnalysis.factors.length}</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-gray-50 p-6 rounded-lg">
//                           <h3 className="text-xl font-semibold text-gray-800 mb-4">Risk Distribution</h3>
//                           <div className="space-y-3">
//                             {['High', 'Moderate', 'Low'].map(severity => {
//                               const count = riskAnalysis.factors.filter(f => f.severity === severity.toLowerCase()).length;
//                               const percentage = riskAnalysis.factors.length > 0 ? (count / riskAnalysis.factors.length) * 100 : 0;
                              
//                               return (
//                                 <div key={severity}>
//                                   <div className="flex justify-between items-center mb-1">
//                                     <span className="text-sm text-gray-600">{severity} Severity</span>
//                                     <span className="text-sm font-semibold">{count} factors</span>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-2">
//                                     <div 
//                                       className={`h-2 rounded-full ${
//                                         severity === 'High' ? 'bg-red-500' :
//                                         severity === 'Moderate' ? 'bg-orange-500' :
//                                         'bg-green-500'
//                                       }`}
//                                       style={{ width: `${percentage}%` }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-4">Contributing Risk Factors</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {riskAnalysis.factors.map((factor, index) => (
//                             <div 
//                               key={index}
//                               className={`p-4 rounded-lg border-2 ${getSeverityColor(factor.severity)}`}
//                             >
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-800">{factor.factor}</h4>
//                                   <p className="text-sm text-gray-600 capitalize">{factor.severity} severity</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <span className="text-lg font-bold text-gray-800">+{factor.points}</span>
//                                   <p className="text-xs text-gray-500">points</p>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {riskAnalysis.factors.length === 0 && (
//                           <div className="text-center py-12 text-gray-500">
//                             <FaHeartbeat className="mx-auto text-4xl mb-4 text-green-500" />
//                             <p className="text-lg">No significant risk factors identified</p>
//                             <p>Patient appears to be in good health</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {activeTab === 'tests' && (
//                     <div className="space-y-6">
//                       {/* Test Categories */}
//                       <div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended Tests by Category</h3>
                        
//                         {['Cardiac', 'Blood', 'Imaging', 'Hormonal', 'Nutritional'].map(category => {
//                           const categoryTests = availableTests.filter(test => test.category === category);
//                           const categoryRecommended = categoryTests.filter(test => recommendedTests.includes(test.id));
                          
//                           return (
//                             <div key={category} className="mb-6">
//                               <button
//                                 onClick={() => toggleSection(category)}
//                                 className="flex items-center justify-between w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                               >
//                                 <div className="flex items-center space-x-3">
//                                   <span className="text-lg font-semibold text-gray-800">{category} Tests</span>
//                                   <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                                     {categoryRecommended.length}/{categoryTests.length} selected
//                                   </span>
//                                 </div>
//                                 {expandedSections[category] ? <FaChevronDown /> : <FaChevronRight />}
//                               </button>
                              
//                               {(expandedSections[category] !== false) && (
//                                 <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
//                                   {categoryTests.map(test => (
//                                     <label 
//                                       key={test.id}
//                                       className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
//                                         recommendedTests.includes(test.id) 
//                                           ? 'border-blue-500 bg-blue-50' 
//                                           : 'border-gray-200 hover:border-gray-300'
//                                       }`}
//                                     >
//                                       <input
//                                         type="checkbox"
//                                         checked={recommendedTests.includes(test.id)}
//                                         onChange={() => handleTestRecommendation(test.id)}
//                                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                                       />
//                                       <div className="ml-3 flex-1">
//                                         <div className="flex justify-between items-start">
//                                           <div>
//                                             <p className="font-semibold text-gray-800">{test.name}</p>
//                                             <p className="text-sm text-gray-600">{test.category}</p>
//                                           </div>
//                                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(test.urgency)}`}>
//                                             {test.urgency}
//                                           </span>
//                                         </div>
//                                       </div>
//                                     </label>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>

//                       {/* Selected Tests Summary */}
//                       {recommendedTests.length > 0 && (
//                         <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
//                           <h4 className="text-lg font-semibold text-blue-800 mb-3">Selected Tests Summary</h4>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             {recommendedTests.map(testId => {
//                               const test = availableTests.find(t => t.id === testId);
//                               return (
//                                 <div key={testId} className="flex items-center justify-between bg-white p-3 rounded-lg">
//                                   <div>
//                                     <p className="font-medium text-gray-800">{test?.name}</p>
//                                     <p className="text-sm text-gray-600">{test?.category}</p>
//                                   </div>
//                                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(test?.urgency)}`}>
//                                     {test?.urgency}
//                                   </span>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}

//                       {/* Doctor's Notes */}
//                       <div>
//                         <label className="block text-lg font-semibold text-gray-800 mb-3">
//                           Clinical Notes & Recommendations
//                         </label>
//                         <textarea
//                           rows="8"
//                           placeholder="Enter detailed clinical notes, lifestyle recommendations, follow-up instructions, medication adjustments, etc..."
//                           className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                           value={doctorNote}
//                           onChange={(e) => setDoctorNote(e.target.value)}
//                         />
//                         <p className="text-sm text-gray-500 mt-2">
//                           These notes will be included in the patient's medical record and PDF report.
//                         </p>
//                       </div>

//                       {/* Smart Recommendations */}
//                       {riskAnalysis?.category === 'High' && (
//                         <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
//                           <div className="flex items-start space-x-3">
//                             <FaExclamationTriangle className="text-red-600 text-xl mt-1" />
//                             <div>
//                               <h4 className="text-lg font-semibold text-red-800 mb-2">High-Risk Patient Alert</h4>
//                               <p className="text-red-700 mb-3">
//                                 This patient has been identified as high-risk. Consider prioritizing the following tests:
//                               </p>
//                               <div className="space-y-2">
//                                 {availableTests
//                                   .filter(test => test.urgency === 'high' && !recommendedTests.includes(test.id))
//                                   .map(test => (
//                                     <button
//                                       key={test.id}
//                                       onClick={() => handleTestRecommendation(test.id)}
//                                       className="block w-full text-left p-3 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
//                                     >
//                                       <div className="flex justify-between items-center">
//                                         <span className="font-medium text-gray-800">{test.name}</span>
//                                         <span className="text-sm text-red-600">Add to recommendations</span>
//                                       </div>
//                                     </button>
//                                   ))
//                                 }
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Action Buttons */}
//                       <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
//                         <button 
//                           onClick={saveRecommendations}
//                           className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
//                         >
//                           <FaSave />
//                           <span>Save Recommendations</span>
//                         </button>
                        
//                         <button 
//                           onClick={generatePDF}
//                           className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//                         >
//                           <FaDownload />
//                           <span>Generate PDF Report</span>
//                         </button>
                        
//                         <button 
//                           onClick={() => alert('Preview functionality would be implemented here')}
//                           className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
//                         >
//                           <FaEye />
//                           <span>Preview Report</span>
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
//                 <h3 className="text-2xl font-semibold text-gray-500 mb-2">No Patient Selected</h3>
//                 <p className="text-gray-400 max-w-md">
//                   Select a patient from the sidebar to view their medical information, 
//                   risk analysis, and provide recommendations.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </>
//   );
// };

// export default DoctorDashboard;