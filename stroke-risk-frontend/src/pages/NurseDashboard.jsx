import React, { useState, useEffect } from 'react';
import { db } from "../firebase/firebase";
import {collection, addDoc, Timestamp, query, orderBy, where, getDoc,setDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import logo from '../components/logo1.png';
import { updateDoc } from "firebase/firestore";
import { FaUserCircle, FaTrashAlt, FaChevronDown, FaChevronUp, FaPlus, FaEdit, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWeight, FaRuler, FaHeartbeat, FaFlask } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'bg-green-100 text-green-600',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          icon: '⚠',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'bg-red-100 text-red-600',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          icon: '⚠',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'bg-yellow-100 text-yellow-600',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          icon: 'ℹ',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'bg-blue-100 text-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const { icon, bgColor, borderColor, iconColor, buttonColor } = getIconAndColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full border-2 ${borderColor} transform transition-all duration-300 scale-100`}>
        <div className={`${bgColor} px-6 py-4 rounded-t-xl border-b ${borderColor}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center font-bold text-xl`}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 ${buttonColor} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const NurseDashboard = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    name: '', age: '', locality: '', phone: '', email: '', aqi: '',
    weight: '', height: '', bmi: '', waist: '',
    hdl: '', ldl: '', gender: '',
    hemoglobin: '', wbc: '', platelets: '', rbc: '', hematocrit: '',
    crp: '', rbs: '', hba1c: '',
    cholesterol: '', tg: '', homocysteine: '', lipoprotein: '',
    bloodPressure: '',
    onBloodThinner: false
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);


  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: '',
      message: '',
      type: 'info'
    });
  };

  const handleLogout = () => {
  showModal('Logout', 'You have been successfully logged out!', 'info');
  // Add a timeout to redirect after showing the modal
  setTimeout(() => {
    closeModal();
    navigate('/');
  }, 1500);
};

  const handleEdit = (patient) => {
  setPatientData({
    name: patient.name,
    age: patient.age,
    locality: patient.locality,
    phone: patient.phone,
    email: patient.email,
    aqi: patient.aqi,
    weight: patient.weight,
    height: patient.height,
    bmi: patient.bmi,
    waist: patient.waist,
    hdl: patient.hdl,
    ldl: patient.ldl,
    gender: patient.gender,
    hemoglobin: patient.hemoglobin,
    wbc: patient.wbc,
    platelets: patient.platelets,
    rbc: patient.rbc,
    hematocrit: patient.hematocrit,
    crp: patient.crp,
    rbs: patient.rbs,
    hba1c: patient.hba1c,
    cholesterol: patient.cholesterol,
    tg: patient.tg,
    atherogenicRisk: patient.atherogenicRisk,
    homocysteine: patient.homocysteine,
    lipoprotein: patient.lipoprotein,
    bloodPressure: patient.bloodPressure,
    onBloodThinner: patient.onBloodThinner
  });
  setIsEditing(true);
  setEditingPatientId(patient.id); // should match global ID
};

const handleCancelEdit = () => {
  setIsEditing(false);
  setEditingPatientId(null);
  setPatientData({
    name: '', age: '', locality: '', phone: '', email: '', aqi: '',
    weight: '', height: '', bmi: '', waist: '',
    hdl: '', ldl: '', gender: '',
    hemoglobin: '', wbc: '', platelets: '', rbc: '', hematocrit: '',
    crp: '', rbs: '', hba1c: '',
    cholesterol: '', tg: '', homocysteine: '', lipoprotein: '',
    bloodPressure: '',atherogenicRisk: '',
    onBloodThinner: false
  });
};

const handleSearch = (query) => {
  setSearchQuery(query);

  if (!query.trim()) {
    setFilteredPatients(recentPatients);
    return;
  }

  const filtered = recentPatients.filter(patient => {
    const searchTerm = query.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm) ||
      patient.locality.toLowerCase().includes(searchTerm) ||
      patient.age.toString().includes(searchTerm) ||
      patient.gender.toLowerCase().includes(searchTerm)
    );
  });

  setFilteredPatients(filtered);
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
      updatedData.bmi = bmi;
    }
  }
  // Calculate Atherogenic Risk (AIP) when TG or HDL changes
  if (name === 'tg' || name === 'hdl') {
    const tg = parseFloat(name === 'tg' ? value : updatedData.tg);
    const hdl = parseFloat(name === 'hdl' ? value : updatedData.hdl);

    if (tg > 0 && hdl > 0) {
      const aip = Math.log10(tg / hdl).toFixed(3);
      updatedData.atherogenicRisk = aip;
    }
  }

  setPatientData(updatedData);
};

const fetchTotalPatients = async () => {
  try {
    const selectedCamp = localStorage.getItem("selectedCamp");
    if (!selectedCamp) return;

    const snapshot = await getDocs(collection(db, `camps_metadata/${selectedCamp}/patients`));
    setTotalPatients(snapshot.docs.length);
  } catch (error) {
    console.error("Error fetching total patients:", error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const bpPattern = /^\d{2,3}\/\d{2,3}$/;
  if (!bpPattern.test(patientData.bloodPressure)) {
    showModal('Invalid Blood Pressure', 'Please enter valid blood pressure in the format systolic/diastolic (e.g., 120/80).', 'error');
    return;
  }

  try {
    const selectedCamp = localStorage.getItem("selectedCamp");
    if (!selectedCamp) {
      showModal('Error', 'Camp not selected. Please log in again.', 'error');
      return;
    }

    if (isEditing) {
      // Update patient in global collection
      const patientRef = doc(db, "patients", editingPatientId);
      const patientSnap = await getDoc(patientRef);

      if (!patientSnap.exists()) {
        console.error("Global patient document not found, cannot update.");
        showModal("Error", "Patient does not exist in global collection.", "error");
        return;
      }

      await updateDoc(patientRef, {
        ...patientData,
        updatedAt: Timestamp.now()
      });

      // Update patient in camp collection
      const campRef = doc(db, `camps_metadata/${selectedCamp}/patients`, editingPatientId);
      await updateDoc(campRef, {
        ...patientData,
        updatedAt: Timestamp.now()
      });

      showModal('Success', 'Patient updated successfully!', 'success');
      setIsEditing(false);
      setEditingPatientId(null);
    } else {
      const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const snapshot = await getDocs(collection(db, `camps_metadata/${selectedCamp}/patients`));
  const todayPatients = snapshot.docs.filter(doc => {
    const createdAt = doc.data().createdAt?.toDate?.();
    return createdAt &&
           createdAt.getFullYear() === now.getFullYear() &&
           createdAt.getMonth() === now.getMonth() &&
           createdAt.getDate() === now.getDate();
  });

  const serial = String(todayPatients.length + 1).padStart(2, '0');
  const token = `BC${year}${month}${day}${serial}`;
  const defaultStatus = "Pending";

  const patientDataWithMeta = {
    ...patientData,
    tokenNumber: token,
    status: defaultStatus,
    createdAt: Timestamp.now(),
    camp: selectedCamp
  };

  const globalDocRef = doc(collection(db, "patients"));
  await setDoc(globalDocRef, patientDataWithMeta);

  const campDocRef = doc(db, `camps_metadata/${selectedCamp}/patients`, globalDocRef.id);
  await setDoc(campDocRef, patientDataWithMeta);

  showModal('Success', 'Patient added successfully!', 'success');
}

    // Reset form
    setPatientData({
      name: '', age: '', locality: '', phone: '', email: '', aqi: '',
      weight: '', height: '', bmi: '', waist: '',
      hdl: '', ldl: '', gender: '',
      hemoglobin: '', wbc: '', platelets: '', rbc: '', hematocrit: '',
      crp: '', rbs: '', hba1c: '',
      cholesterol: '', tg: '', homocysteine: '', lipoprotein: '',
      bloodPressure: '',atherogenicRisk: '',
      onBloodThinner: false
    });

    fetchRecentPatients();
    fetchTotalPatients();
  } catch (error) {
    console.error("Error:", error);
    showModal('Error', 'Failed to save patient information. Please try again.', 'error');
  }
};

  const fetchRecentPatients = async () => {
  const selectedCamp = localStorage.getItem("selectedCamp");
  if (!selectedCamp) return;

  const q = query(collection(db, `camps_metadata/${selectedCamp}/patients`), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // <== KEEP this 'id'

  setRecentPatients(data);
  setFilteredPatients(data);
  setTotalPatients(snapshot.docs.length);
};



  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
  try {
    const selectedCamp = localStorage.getItem("selectedCamp");
    if (!selectedCamp) {
      showModal('Error', 'Camp not selected. Cannot delete patient.', 'error');
      return;
    }

    // Delete from global patients collection
    const patientRef = doc(db, "patients", id);
    await deleteDoc(patientRef);

    // Delete from camp-specific subcollection
    const campPatientRef = doc(db, `camps_metadata/${selectedCamp}/patients`, id);
    await deleteDoc(campPatientRef);

    // Immediately remove from UI
    setRecentPatients(prev => prev.filter(patient => patient.id !== id));
    fetchTotalPatients();

    showModal('Success', 'Patient has been successfully deleted from the system.', 'success');
  } catch (error) {
    console.error("Error deleting patient:", error);
    showModal('Error', 'An error occurred while deleting the patient. Please try again.', 'error');
  }
};


  useEffect(() => {
    fetchRecentPatients();
  }, []);

  useEffect(() => {
    setFilteredPatients(recentPatients);
  }, [recentPatients]);

  return (
    <>
      {/* Tailwind CSS CDN */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex-shrink-0">
                   <img 
                     src={logo} 
                     alt="Brainline Logo" 
                     className="w-16 h-16 lg:w-16 lg:h-16 object-contain"
                   />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nurse Dashboard</h1>
                <p className="text-sm text-gray-500">Patient Management System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold text-blue-800">{totalPatients}</div>
                    <div className="text-xs text-blue-600">Total Patients</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <FaUserCircle size={24} />
              <span className="hidden sm:block text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Recent Patients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaUser className="mr-3" />
                    Recent Patients
                  </h2>
                  <span className="bg-white/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {totalPatients}
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients by name, phone, email..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-xs text-gray-500 mt-2">
                    Showing {filteredPatients.length} of {recentPatients.length} patients
                  </p>
                )}
              </div>
              
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {filteredPatients.length === 0 && searchQuery ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No patients found matching "{searchQuery}"</p>
                    <button
                      onClick={() => handleSearch('')}
                      className="text-blue-500 text-sm hover:text-blue-700 mt-2"
                    >
                      Clear search
                    </button>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No patients added yet</p>
                  </div>
                ) : (
                  filteredPatients.map(patient => (
                    <div key={patient.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                      {/* Rest of your existing patient card JSX remains the same */}
                      <div className="bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <FaUser className="mr-2 text-blue-500" />
                              {patient.name}
                            </h3>
                            <div className="text-sm text-gray-600 mt-1 space-y-1">
                              <p className="flex items-center">
                                <span className="font-medium mr-2">Age:</span> {patient.age}
                              </p>
                              <p className="flex items-center">
                                <FaPhone className="mr-2 text-green-500" />
                                {patient.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleExpand(patient.id)}
                            className="flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors duration-200"
                          >
                            {expandedId === patient.id ? (
                              <>
                                <FaChevronUp className="mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <FaChevronDown className="mr-1" />
                                More
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(patient)}
                            className="flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors duration-200"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="flex items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors duration-200"
                          >
                            <FaTrashAlt className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                          
                      {expandedId === patient.id && (
                        <div className="bg-white p-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex items-center">
                              <FaEnvelope className="mr-2 text-blue-500" />
                              <span className="font-medium mr-2">Email:</span>
                              <span className="text-gray-600">{patient.email}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Gender:</span>
                              <span className="text-gray-600">{patient.gender}</span>
                            </div>
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-2 text-red-500" />
                              <span className="font-medium mr-2">Locality:</span>
                              <span className="text-gray-600">{patient.locality}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <div>
                                <span className="font-medium">Weight:</span>
                                <span className="text-gray-600 ml-1">{patient.weight} kg</span>
                              </div>
                              <div>
                                <span className="font-medium">Height:</span>
                                <span className="text-gray-600 ml-1">{patient.height} cm</span>
                              </div>
                              <div>
                                <span className="font-medium">BMI:</span>
                                <span className="text-gray-600 ml-1">{patient.bmi}</span>
                              </div>
                              <div>
                                <span className="font-medium">BP:</span>
                                <span className="text-gray-600 ml-1">{patient.bloodPressure}</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                              <p className="font-medium text-gray-700 mb-2">Lab Results:</p>
                              <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                                <div>HDL: {patient.hdl}</div>
                                <div>LDL: {patient.ldl}</div>
                                <div>Hb: {patient.hemoglobin}</div>
                                <div>WBC: {patient.wbc}</div>
                                <div>RBC: {patient.rbc}</div>
                                <div>HbA1c: {patient.hba1c}</div>
                                <div>AIP: {patient.atherogenicRisk}</div>
                              </div>
                            </div>
                            <div className="pt-2">
                              <span className="font-medium">Blood Thinner:</span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${patient.onBloodThinner ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {patient.onBloodThinner ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Add Patient Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <FaPlus className="mr-2" />
                    {isEditing ? 'Edit Patient' : 'Add New Patient'}
                  </h2>
                  {isEditing && (
                    <button
                      onClick={handleCancelEdit}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Gender Selection */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={patientData.gender}
                    onChange={handleChange}
                     
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="" disabled hidden>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={patientData.name}
                        onChange={handleChange}
                         
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        placeholder="Enter age"
                        value={patientData.age}
                        onChange={handleChange}
                         
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Locality</label>
                      <input
                        type="text"
                        name="locality"
                        placeholder="Enter locality"
                        value={patientData.locality}
                        onChange={handleChange}
                         
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter 10-digit phone number"
                        pattern="[0-9]{10}"
                        value={patientData.phone}
                        onChange={handleChange}
                         
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={patientData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AQI (Manual)</label>
                      <input
                        type="text"
                        name="aqi"
                        placeholder="Enter AQI value"
                        value={patientData.aqi}
                         
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Measurements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                    <FaWeight className="mr-2 text-blue-500" />
                    Physical Measurements
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        placeholder="Enter weight in kg"
                        value={patientData.weight}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        placeholder="Enter height in cm"
                        value={patientData.height}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">BMI (Auto-calculated)</label>
                      <input
                        type="text"
                        name="bmi"
                        placeholder="BMI will be calculated automatically"
                        value={patientData.bmi}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Waist (cm)</label>
                      <input
                        type="number"
                        name="waist"
                        placeholder="Enter waist in cm"
                        value={patientData.waist}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">HDL</label>
                      <input
                        type="text"
                        name="hdl"
                        placeholder="Enter HDL value"
                        value={patientData.hdl}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LDL</label>
                      <input
                        type="text"
                        name="ldl"
                        placeholder="Enter LDL value"
                        value={patientData.ldl}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cholesterol</label>
                      <input
                        type="text"
                        name="cholesterol"
                        placeholder="Enter cholesterol value"
                        value={patientData.cholesterol}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TG</label>
                      <input
                        type="text"
                        name="tg"
                        placeholder="Enter TG value"
                        value={patientData.tg}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Homocysteine</label>
                      <input
                        type="text"
                        name="homocysteine"
                        placeholder="Enter homocysteine value"
                        value={patientData.homocysteine}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lipoprotein A</label>
                      <input
                        type="text"
                        name="lipoprotein"
                        placeholder="Enter Lipoprotein A value"
                        value={patientData.lipoprotein}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Atherogenic Risk (AIP)</label>
                      <input
                        type="text"
                        name="atherogenicRisk"
                        placeholder="Auto-calculated from TG/HDL"
                        value={patientData.atherogenicRisk}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                    <FaFlask className="mr-2 text-green-500" />
                    Test Results
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure *</label>
                      <input
                        type="text"
                        name="bloodPressure"
                        placeholder="e.g., 120/80"
                        value={patientData.bloodPressure}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hemoglobin</label>
                      <input
                        type="text"
                        name="hemoglobin"
                        placeholder="Enter hemoglobin level"
                        value={patientData.hemoglobin}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WBC</label>
                      <input
                        type="text"
                        name="wbc"
                        placeholder="Enter WBC count"
                        value={patientData.wbc}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platelets</label>
                      <input
                        type="text"
                        name="platelets"
                        placeholder="Enter platelet count"
                        value={patientData.platelets}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hematocrit</label>
                      <input
                        type="text"
                        name="hematocrit"
                        placeholder="Enter hematocrit value"
                        value={patientData.hematocrit}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CRP</label>
                      <input
                        type="text"
                        name="crp"
                        placeholder="Enter CRP value"
                        value={patientData.crp}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RBS</label>
                      <input
                        type="text"
                        name="rbs"
                        placeholder="Enter RBS value"
                        value={patientData.rbs}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">HbA1c</label>
                      <input
                        type="text"
                        name="hba1c"
                        placeholder="Enter HbA1c value"
                        value={patientData.hba1c}
                        onChange={handleChange}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      name="onBloodThinner"
                      id="onBloodThinner"
                      checked={patientData.onBloodThinner}
                      onChange={handleChange}
                      className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <label 
                      htmlFor="onBloodThinner" 
                      className="text-sm font-medium text-gray-700 flex items-center cursor-pointer"
                    >
                      <FaHeartbeat className="mr-2 text-red-500" />
                      Patient is currently on blood thinner medication
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaPlus className="text-lg" />
                    <span className="text-lg">{isEditing ? 'Update Patient' : 'Add Patient'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      isOpen={modal.isOpen}
      onClose={closeModal}
      title={modal.title}
      message={modal.message}
      type={modal.type}
    />
    </>
  );
};

export default NurseDashboard;