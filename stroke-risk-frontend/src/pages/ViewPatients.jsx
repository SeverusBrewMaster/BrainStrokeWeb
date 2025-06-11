import React, { useEffect, useState } from 'react';
import './ViewPatients.css';
import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchPatients = async () => {
    const q = query(collection(db, "patients"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to permanently delete this patient's data?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "patients", id));
        alert("Patient deleted successfully!");
        fetchPatients(); // refresh data
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Something went wrong while deleting.");
      }
    }
  };

  return (
    <div className="horizontal-card-container">
      {patients.map((patient) => (
        <div className="horizontal-card" key={patient.id}>
          <div className="card-main-info">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => toggleExpand(patient.id)}>
                {expandedId === patient.id ? 'Hide Details' : 'View More'}
              </button>
              <button
                style={{
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => handleDelete(patient.id)}
              >
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
              <p><strong>Lipoprotein:</strong> {patient.lipoprotein}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewPatients;
