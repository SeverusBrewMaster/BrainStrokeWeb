// import React, { useState, useEffect } from 'react';
// import logo from '../components/logo1.png';
// import './NurseDashboard.css';
// import { db } from "../firebase/firebase";
// import { collection, addDoc, Timestamp, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { useNavigate } from 'react-router-dom';
// import { FaUserCircle } from "react-icons/fa";

// const NurseDashboard = () => {
//   const navigate = useNavigate();

//   const [patientData, setPatientData] = useState({
//     name: '', age: '', locality: '', phone: '', email: '', aqi: '',
//     weight: '', height: '', bmi: '', waist: '',
//     hdl: '', ldl: '',
//     cbp: '', crp: '', rbs: '', hba1c: '',
//     cholesterol: '', tg: '', homocysteine: '', lipoprotein: '',
//     bloodPressure: '',
//     onBloodThinner: false
//   });

//   const [recentPatients, setRecentPatients] = useState([]);
//   const [expandedId, setExpandedId] = useState(null);

//   const handleLogout = () => {
//     alert("Logged out!");
//     navigate('/');
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const newValue = type === 'checkbox' ? checked : value;

//     let updatedData = { ...patientData, [name]: newValue };

//     if (name === 'weight' || name === 'height') {
//       const weight = parseFloat(name === 'weight' ? value : updatedData.weight);
//       const height = parseFloat(name === 'height' ? value : updatedData.height);

//       if (weight > 0 && height > 0) {
//         const heightInMeters = height / 100;
//         const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
//         const waist = (0.45 * height).toFixed(1);
//         updatedData.bmi = bmi;
//         updatedData.waist = waist;
//       }
//     }

//     setPatientData(updatedData);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate Blood Pressure format (e.g., 120/80)
//     const bpPattern = /^\d{2,3}\/\d{2,3}$/;
//     if (!bpPattern.test(patientData.bloodPressure)) {
//       alert("Please enter valid blood pressure in the format systolic/diastolic (e.g., 120/80).");
//       return;
//     }

//     const token = `PAT${Date.now()}`;
//     const defaultStatus = "Pending";

//     try {
//       await addDoc(collection(db, "patients"), {
//         ...patientData,
//         tokenNumber: token,
//         status: defaultStatus,
//         createdAt: Timestamp.now()
//       });

//       alert("Patient added!");

//       setPatientData({
//         name: '', age: '', locality: '', phone: '', email: '', aqi: '',
//         weight: '', height: '', bmi: '', waist: '',
//         hdl: '', ldl: '',
//         cbp: '', crp: '', rbs: '', hba1c: '',
//         cholesterol: '', tg: '', homocysteine: '', lipoprotein: '',
//         bloodPressure: '',
//         onBloodThinner: false
//       });

//       fetchRecentPatients();
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to save patient.");
//     }
//   };

//   const fetchRecentPatients = async () => {
//     const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
//     const snapshot = await getDocs(q);
//     const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setRecentPatients(data.slice(0, 3));
//   };

//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this patient permanently?");
//     if (!confirmDelete) return;

//     try {
//       await deleteDoc(doc(db, "patients", id));
//       alert("Patient deleted successfully!");
//       fetchRecentPatients();
//     } catch (error) {
//       console.error("Error deleting patient:", error);
//       alert("Failed to delete patient.");
//     }
//   };

//   useEffect(() => {
//     fetchRecentPatients();
//   }, []);

//   return (
//     <>
//       <div className="navbar">
//         <div className="nav-left">
//           <img src={logo} alt="Logo" className="nav-logo" />
//           <h2 className="nav-title">Nurse Dashboard</h2>
//         </div>
//         <FaUserCircle size={30} className="profile-icon" onClick={handleLogout} title="Logout" />
//       </div>

//       <div className="dashboard-container">
//         <div className="sidebar">
//           <h1 className="sidebar-title">Recently Added</h1>
//           {recentPatients.map(patient => (
//             <div key={patient.id} className="horizontal-card">
//               <div className="card-main-info">
//                 <p><strong>{patient.name}</strong> | Age: {patient.age} | Ph: {patient.phone}</p>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button onClick={() => toggleExpand(patient.id)}>
//                     {expandedId === patient.id ? 'Hide' : 'More'}
//                   </button>
//                   <button className="delete-button" onClick={() => handleDelete(patient.id)}>
//                     Delete
//                   </button>
//                 </div>
//               </div>
//               {expandedId === patient.id && (
//                 <div className="card-expanded-info">
//                   <p><strong>Email:</strong> {patient.email}</p>
//                   <p><strong>AQI:</strong> {patient.aqi}</p>
//                   <p><strong>Locality:</strong> {patient.locality}</p>
//                   <p><strong>Weight:</strong> {patient.weight} kg</p>
//                   <p><strong>Height:</strong> {patient.height} cm</p>
//                   <p><strong>BMI:</strong> {patient.bmi}</p>
//                   <p><strong>Waist Circumference:</strong> {patient.waist} cm</p>
//                   <p><strong>Blood Pressure:</strong> {patient.bloodPressure}</p>
//                   <p><strong>HDL:</strong> {patient.hdl}</p>
//                   <p><strong>LDL:</strong> {patient.ldl}</p>
//                   <p><strong>CBP:</strong> {patient.cbp}</p>
//                   <p><strong>CRP:</strong> {patient.crp}</p>
//                   <p><strong>RBS:</strong> {patient.rbs}</p>
//                   <p><strong>HbA1c:</strong> {patient.hba1c}</p>
//                   <p><strong>Cholesterol:</strong> {patient.cholesterol}</p>
//                   <p><strong>TG:</strong> {patient.tg}</p>
//                   <p><strong>Homocysteine:</strong> {patient.homocysteine}</p>
//                   <p><strong>Lipoprotein A:</strong> {patient.lipoprotein}</p>
//                   <p><strong>Blood Thinner:</strong> {patient.onBloodThinner ? 'Yes' : 'No'}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="main-content">
//           <h2 className="section-title">Add Patient</h2>
//           <form onSubmit={handleSubmit} className="patient-form">
//             <div className="input-group">
//               <input type="text" name="name" placeholder="Name" value={patientData.name} onChange={handleChange} required />
//               <input type="number" name="age" placeholder="Age" value={patientData.age} onChange={handleChange} required />
//             </div>
//             <div className="input-group">
//               <input type="text" name="locality" placeholder="Locality" value={patientData.locality} onChange={handleChange} required />
//               <input type="tel" name="phone" placeholder="Phone Number" pattern="[0-9]{10}" value={patientData.phone} onChange={handleChange} required />
//             </div>
//             <div className="input-group">
//               <input type="email" name="email" placeholder="Email ID" value={patientData.email} onChange={handleChange} required />
//               <input type="text" name="aqi" placeholder="AQI (Manual)" value={patientData.aqi} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <input type="number" name="weight" placeholder="Weight (kg)" value={patientData.weight} onChange={handleChange} />
//               <input type="number" name="height" placeholder="Height (cm)" value={patientData.height} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <input type="text" name="bmi" placeholder="BMI (auto)" value={patientData.bmi} disabled />
//               <input type="text" name="waist" placeholder="Waist Circumference (auto)" value={patientData.waist} disabled />
//             </div>
//             <div className="input-group">
//               <input type="text" name="hdl" placeholder="HDL" value={patientData.hdl} onChange={handleChange} />
//               <input type="text" name="ldl" placeholder="LDL" value={patientData.ldl} onChange={handleChange} />
//             </div>

//             <h3 className="section-title">Test Results</h3>
//             <div className="input-group">
//               <input type="text" name="bloodPressure" placeholder="Blood Pressure (e.g. 120/80)" value={patientData.bloodPressure} onChange={handleChange} required />
//               <input type="text" name="cbp" placeholder="CBP" value={patientData.cbp} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <input type="text" name="crp" placeholder="CRP" value={patientData.crp} onChange={handleChange} />
//               <input type="text" name="rbs" placeholder="RBS" value={patientData.rbs} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <input type="text" name="hba1c" placeholder="HbA1c" value={patientData.hba1c} onChange={handleChange} />
//               <input type="text" name="cholesterol" placeholder="Cholesterol" value={patientData.cholesterol} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <input type="text" name="tg" placeholder="TG" value={patientData.tg} onChange={handleChange} />
//               <input type="text" name="homocysteine" placeholder="Homocysteine" value={patientData.homocysteine} onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <input type="text" name="lipoprotein" placeholder="Lipoprotein A" value={patientData.lipoprotein} onChange={handleChange} />
//             </div>

//             <div className="checkbox-group">
//               <input
//                 type="checkbox"
//                 name="onBloodThinner"
//                 checked={patientData.onBloodThinner}
//                 onChange={handleChange}
//               />
//               <label htmlFor="onBloodThinner">On Blood Thinner</label>
//             </div>


//             <div className="submit-wrapper">
//               <button type="submit" className="submit-button">Submit</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NurseDashboard;
import React, { useState, useEffect } from 'react';
import logo from '../components/logo1.png';
import './NurseDashboard.css';
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const NurseDashboard = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    name: '', age: '', locality: '', phone: '', email: '', aqi: '',
    weight: '', height: '', bmi: '', waist: '',
    hdl: '', ldl: '',
    // cbp: '',
    hemoglobin: '', wbc: '', platelets: '', rbc: '', hematocrit: '',
    crp: '', rbs: '', hba1c: '',
    cholesterol: '', tg: '', homocysteine: '', lipoprotein: '',
    bloodPressure: '',
    onBloodThinner: false
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const handleLogout = () => {
    alert("Logged out!");
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    let updatedData = { ...patientData, [name]: newValue };

    if (name === 'weight' || name === 'height') {
      const weight = parseFloat(name === 'weight' ? value : updatedData.weight);
      const height = parseFloat(name === 'height' ? value : updatedData.height);

      if (weight > 0 && height > 0) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        const waist = (0.45 * height).toFixed(1);
        updatedData.bmi = bmi;
        updatedData.waist = waist;
      }
    }

    setPatientData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bpPattern = /^\d{2,3}\/\d{2,3}$/;
    if (!bpPattern.test(patientData.bloodPressure)) {
      alert("Please enter valid blood pressure in the format systolic/diastolic (e.g., 120/80).");
      return;
    }

    const token = `PAT${Date.now()}`;
    const defaultStatus = "Pending";

    try {
      await addDoc(collection(db, "patients"), {
        ...patientData,
        tokenNumber: token,
        status: defaultStatus,
        createdAt: Timestamp.now()
      });

      alert("Patient added!");

      setPatientData({
        name: '', age: '', locality: '', phone: '', email: '', aqi: '',
        weight: '', height: '', bmi: '', waist: '',
        hdl: '', ldl: '',
        // cbp: '',
        hemoglobin: '', wbc: '', platelets: '', rbc: '', hematocrit: '',
        crp: '', rbs: '', hba1c: '',
        cholesterol: '', tg: '', homocysteine: '', lipoprotein: '',
        bloodPressure: '',
        onBloodThinner: false
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
      <div className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="nav-logo" />
          <h2 className="nav-title">Nurse Dashboard</h2>
        </div>
        <FaUserCircle size={30} className="profile-icon" onClick={handleLogout} title="Logout" />
      </div>

      <div className="dashboard-container">
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
                  <p><strong>Email:</strong> {patient.email}</p>
                  <p><strong>AQI:</strong> {patient.aqi}</p>
                  <p><strong>Locality:</strong> {patient.locality}</p>
                  <p><strong>Weight:</strong> {patient.weight} kg</p>
                  <p><strong>Height:</strong> {patient.height} cm</p>
                  <p><strong>BMI:</strong> {patient.bmi}</p>
                  <p><strong>Waist Circumference:</strong> {patient.waist} cm</p>
                  <p><strong>Blood Pressure:</strong> {patient.bloodPressure}</p>
                  <p><strong>HDL:</strong> {patient.hdl}</p>
                  <p><strong>LDL:</strong> {patient.ldl}</p>
                  {/* <p><strong>CBP:</strong> {patient.cbp}</p> */}
                  <p><strong>Hemoglobin:</strong> {patient.hemoglobin}</p>
                  <p><strong>WBC:</strong> {patient.wbc}</p>
                  <p><strong>Platelets:</strong> {patient.platelets}</p>
                  <p><strong>RBC:</strong> {patient.rbc}</p>
                  <p><strong>Hematocrit:</strong> {patient.hematocrit}</p>
                  <p><strong>CRP:</strong> {patient.crp}</p>
                  <p><strong>RBS:</strong> {patient.rbs}</p>
                  <p><strong>HbA1c:</strong> {patient.hba1c}</p>
                  <p><strong>Cholesterol:</strong> {patient.cholesterol}</p>
                  <p><strong>TG:</strong> {patient.tg}</p>
                  <p><strong>Homocysteine:</strong> {patient.homocysteine}</p>
                  <p><strong>Lipoprotein A:</strong> {patient.lipoprotein}</p>
                  <p><strong>Blood Thinner:</strong> {patient.onBloodThinner ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          ))}
        </div>

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
            <div className="input-group">
              <input type="email" name="email" placeholder="Email ID" value={patientData.email} onChange={handleChange} required />
              <input type="text" name="aqi" placeholder="AQI (Manual)" value={patientData.aqi} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="number" name="weight" placeholder="Weight (kg)" value={patientData.weight} onChange={handleChange} />
              <input type="number" name="height" placeholder="Height (cm)" value={patientData.height} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="bmi" placeholder="BMI (auto)" value={patientData.bmi} disabled />
              <input type="text" name="waist" placeholder="Waist Circumference (auto)" value={patientData.waist} disabled />
            </div>
            <div className="input-group">
              <input type="text" name="hdl" placeholder="HDL" value={patientData.hdl} onChange={handleChange} />
              <input type="text" name="ldl" placeholder="LDL" value={patientData.ldl} onChange={handleChange} />
            </div>

            <h3 className="section-title">Test Results</h3>
            <div className="input-group">
              <input type="text" name="bloodPressure" placeholder="Blood Pressure (e.g. 120/80)" value={patientData.bloodPressure} onChange={handleChange} required />
              {/* <input type="text" name="cbp" placeholder="CBP" value={patientData.cbp} onChange={handleChange} /> */}
              <input type="text" name="hemoglobin" placeholder="Hemoglobin" value={patientData.hemoglobin} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="wbc" placeholder="WBC" value={patientData.wbc} onChange={handleChange} />
              <input type="text" name="platelets" placeholder="Platelets" value={patientData.platelets} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="rbc" placeholder="RBC" value={patientData.rbc} onChange={handleChange} />
              <input type="text" name="hematocrit" placeholder="Hematocrit" value={patientData.hematocrit} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="crp" placeholder="CRP" value={patientData.crp} onChange={handleChange} />
              <input type="text" name="rbs" placeholder="RBS" value={patientData.rbs} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="hba1c" placeholder="HbA1c" value={patientData.hba1c} onChange={handleChange} />
              <input type="text" name="cholesterol" placeholder="Cholesterol" value={patientData.cholesterol} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="tg" placeholder="TG" value={patientData.tg} onChange={handleChange} />
              <input type="text" name="homocysteine" placeholder="Homocysteine" value={patientData.homocysteine} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="text" name="lipoprotein" placeholder="Lipoprotein A" value={patientData.lipoprotein} onChange={handleChange} />
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                name="onBloodThinner"
                checked={patientData.onBloodThinner}
                onChange={handleChange}
              />
              <label htmlFor="onBloodThinner">On Blood Thinner</label>
            </div>

            <div className="submit-wrapper">
              <button type="submit" className="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NurseDashboard;
