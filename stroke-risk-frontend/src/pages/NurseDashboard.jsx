import React, { useState } from "react";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    phone: "",
    locality: ""
  });

  const [testResults, setTestResults] = useState({
    CBC: "",
    CRP: "",
    RBS: "",
    HbA1C: "",
    Cholesterol: "",
    Triglycerides: "",
    Lipoprotein: "",
    LDL: "",
    Homocysteine: "",
    Creatinine: ""
  });

  const handlePatientChange = (e) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
  };

  const handleTestChange = (e) => {
    setTestResults({ ...testResults, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Patient Info:", patientInfo);
    console.log("Test Results:", testResults);
    alert("Data submitted (check console)");
  };

  return (
    <div className="nurse-dashboard">
      <h1 className="dashboard-title">Nurse Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <div className="section patient-info">
          <h2>Patient Information</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={patientInfo.name}
            onChange={handlePatientChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={patientInfo.age}
            onChange={handlePatientChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={patientInfo.phone}
            onChange={handlePatientChange}
          />
          <input
            type="text"
            name="locality"
            placeholder="Locality"
            value={patientInfo.locality}
            onChange={handlePatientChange}
          />
        </div>

        <div className="section test-results">
          <h2>Test Results</h2>
          {Object.keys(testResults).map((test, index) => (
            <input
              key={test}
              type="text"
              name={test}
              placeholder={test}
              value={testResults[test]}
              onChange={handleTestChange}
              className={index === 0 ? "first-test-input" : ""}
            />
          ))}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NurseDashboard;
