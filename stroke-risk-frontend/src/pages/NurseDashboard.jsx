import React, { useState } from 'react';
import './NurseDashboard.css';
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const NurseDashboard = () => {
  const navigate = useNavigate(); // ✅ Create navigate instance

  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    locality: '',
    phone: '',
    cbp: '',
    crp: '',
    rbs: '',
    hba1c: '',
    cholesterol: '',
    tg: '',
    homocysteine: '',
    lipoprotein: ''
  });

  const handleViewPatients = () => {
    navigate('/view-patients'); // ✅ Navigate to ViewPatients route
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "patients"), {
        ...patientData,
        createdAt: Timestamp.now()
      });
      alert("Patient added successfully!");
      setPatientData({
        name: '',
        age: '',
        locality: '',
        phone: '',
        cbp: '',
        crp: '',
        rbs: '',
        hba1c: '',
        cholesterol: '',
        tg: '',
        homocysteine: '',
        lipoprotein: ''
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Something went wrong while saving the patient.");
    }
  };

  return (
    <div className="nurse-dashboard">
      <div className="sidebar">
        <h1 className="gradient-text">NURSE<br />DASHBOARD</h1>
        <button onClick={handleViewPatients}>View Patients</button>
      </div>

      <div className="dashboard-content">
        <h2 className="dashboard-title gradient-text" style={{ textAlign: "center" }}>ADD PATIENT</h2>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2>Patient Information</h2>
            <div className="input-group">
              <input type="text" name="name" placeholder="Name" value={patientData.name} onChange={handleChange} required />
              <input type="number" name="age" placeholder="Age" value={patientData.age} onChange={handleChange} required />
              <input type="text" name="locality" placeholder="Locality" value={patientData.locality} onChange={handleChange} required />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                value={patientData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="section">
            <h2>Test Results</h2>
            <div className="input-group">
              <input type="text" name="cbp" placeholder="CBP" value={patientData.cbp} onChange={handleChange} />
              <input type="text" name="crp" placeholder="CRP" value={patientData.crp} onChange={handleChange} />
              <input type="text" name="rbs" placeholder="RBS" value={patientData.rbs} onChange={handleChange} />
              <input type="text" name="hba1c" placeholder="Hgl A1c" value={patientData.hba1c} onChange={handleChange} />
              <input type="text" name="cholesterol" placeholder="Cholesterol" value={patientData.cholesterol} onChange={handleChange} />
              <input type="text" name="tg" placeholder="Tg" value={patientData.tg} onChange={handleChange} />
              <input type="text" name="homocysteine" placeholder="Homocystein A" value={patientData.homocysteine} onChange={handleChange} />
              <input type="text" name="lipoprotein" placeholder="Lipoprotein A" value={patientData.lipoprotein} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NurseDashboard;
