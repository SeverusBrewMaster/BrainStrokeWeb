import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Heart, FileText, Save, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { db } from "../firebase/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc,
  where,
  limit,
  deleteDoc
} from "firebase/firestore";
import { FaHeartbeat, FaUserCircle } from 'react-icons/fa';
import logo from '../components/logo1.png';

const MiddlemanDashboard = () => {
  // State for patient data
  const [patients, setPatients] = useState([]);

//useEffect FOR FETCHING PATIENTS
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          status: doc.data().status || 'Pending',
          lastUpdated: doc.data().lastUpdated || new Date().toISOString().split('T')[0]
        }));
        setPatients(data);
        calculatePeopleCount(data); // Use the new function
      } catch (error) {
        console.error("Error fetching patients:", error);
        showErrorModal(
          "Data Loading Error",
          "Failed to load patient data. Please check your internet connection and try again.",
          () => {
            setErrorModal({ isVisible: false, title: '', message: '', onRetry: null });
            // Retry the fetch
            fetchPatients();
          }
        );
      }
    };

    fetchPatients();
  }, []);

  // Update counts whenever patients array changes
  useEffect(() => {
    calculatePeopleCount(patients);
  }, [patients]);

  const [searchToken, setSearchToken] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState(patients);

  // New risk assessment parameters
  const [stressLevel, setStressLevel] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [tiaHistory, setTiaHistory] = useState('');
  const [alcoholFrequency, setAlcoholFrequency] = useState('');

  const [logoutModal, setLogoutModal] = useState({
    isVisible: false
  });

  const [errorModal, setErrorModal] = useState({
    isVisible: false,
    title: '',
    message: '',
    onRetry: null
  });

  const [successModal, setSuccessModal] = useState({
    isVisible: false,
    title: '',
    message: ''
  });

  // For storing patient's existing data
  const [patientVitals, setPatientVitals] = useState({
    age: '',
    aqi: '',
    bmi: '',
    bloodPressure: '',
    ldl: '',
    hdl: '',
    cholesterol: ''
  });

  // Medical form states
  const [exercise, setExercise] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [diet, setDiet] = useState('');
  const [outsideFood, setOutsideFood] = useState('');
  const [education, setEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [smoke, setSmoke] = useState('');

  // Medical History
  const [hypertension, setHypertension] = useState('');
  const [diabetes, setDiabetes] = useState('');
  const [rnddiabetesNum, setRnddiabetesNum] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [irregularHeartbeat, setIrregularHeartbeat] = useState('');
  const [snoring, setSnoring] = useState('');
  const [otherCondition, setOtherCondition] = useState('');
  const [bpCheckFrequency, setBpCheckFrequency] = useState('');

  // Female-specific
  const [contraceptives, setContraceptives] = useState('');
  const [hormoneTherapy, setHormoneTherapy] = useState('');
  const [pregnancyHypertension, setPregnancyHypertension] = useState('');

  // Family History
  const [familyHistory, setFamilyHistory] = useState('');
  const [dependents, setDependents] = useState('');
  const [insurance, setInsurance] = useState('');

  // Past History
  const [thyroidDisease, setThyroidDisease] = useState(false);
  const [heartDisease, setHeartDisease] = useState(false);
  const [asthma, setAsthma] = useState(false);
  const [migraine, setMigraine] = useState(false);

  // Symptoms
  const [symptoms, setSymptoms] = useState([]);

  // Add these state variables after the existing useState declarations
  const [peopleCount, setPeopleCount] = useState({
    inProgress: 0,
    pendingReview: 0,
    completed: 0,
    highRiskPatients: 0
  });

    // Add these missing state variables
  const [personalInfo, setPersonalInfo] = useState({
    name: '', age: '', gender: '', email: '', maritalStatus: '', locality: '', durationOfStay: ''
  });
  
  const [vitals, setVitals] = useState({
    bloodPressure: '', pulse: '', weight: '', height: '', bmi: ''
  });
  
  const [lifestyle, setLifestyle] = useState({
    exercise: '', exerciseFrequency: '', diet: '', outsideFood: '', education: '', profession: '', alcohol: '', smoke: ''
  });
  
  const [medicalHistory, setMedicalHistory] = useState({
    hypertension: '', diabetes: '', rnddiabetesNum: '', hba1c: '', cholesterol: '', irregularHeartbeat: '', snoring: '', otherCondition: '', bpCheckFrequency: '', contraceptives: '', hormoneTherapy: '', pregnancyHypertension: ''
  });
  
  const [familyhistory, setFamilyhistory] = useState({
    familyHistory: '', dependents: '', insurance: ''
  });
  
  const [pastConditions, setPastConditions] = useState({
    thyroidDisease: false, heartDisease: false, asthma: false, migraine: false
  });
  
  const [tiaData, setTiaData] = useState({
    tiaHistory: '', tiaFrequency: '', tiaSymptoms: [], lastTiaOccurrence: ''
  });
  
  const [results, setResults] = useState({
    modalVisible: false, riskScore: 0, riskCategory: '', recommendations: ''
  });

  const [showDoctorReferral, setShowDoctorReferral] = useState(false);

  const [saveStatus, setSaveStatus] = useState('');
  
  const [existingAssessmentId, setExistingAssessmentId] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isVisible: false,
    patientId: null,
    patientName: '',
    assessmentId: null
  });

  const navigate = useNavigate();

  const calculatePeopleCount = (patientsList) => {
    const progressReview = patientsList.filter(p => p.status === 'In Progress').length;
    const pendingReview = patientsList.filter(p => p.status === 'Pending').length;
    const completed = patientsList.filter(p => p.status === 'Complete').length;
    const highRiskPatients = 0; // This would need a separate query

    setPeopleCount({
      progressReview,
      pendingReview,
      completed,
      highRiskPatients
    });
  };

  // Filter patients based on search
  useEffect(() => {
    if (searchToken.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => 
        patient.tokenNumber.toLowerCase().includes(searchToken.toLowerCase()) ||
        patient.name.toLowerCase().includes(searchToken.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchToken, patients]);

  const handlePatientSelect = (patient) => {
  setSelectedPatient(patient);
  
  // Load patient's existing vital data
  setPatientVitals({
    age: patient.age || '',
    aqi: patient.aqi || '',
    bmi: patient.bmi || '',
    bloodPressure: patient.bloodPressure || '',
    ldl: patient.ldl || '',
    hdl: patient.hdl || '',
    cholesterol: patient.cholesterol || '',
    hba1c: patient.hba1c || ''  // ADD THIS LINE
  });

  // CHANGE: Load existing assessment FIRST, then reset only if no data found
  loadExistingAssessment(patient);
  checkRecentAssessment(patient);
};

  const resetForm = () => {
  console.log('Resetting form...');
  setExercise('');
  setExerciseFrequency('');
  setDiet('');
  setOutsideFood('');
  setEducation('');
  setProfession('');
  setAlcohol('');
  setSmoke('');
  setHypertension('');
  setDiabetes('');
  setRnddiabetesNum('');
  setCholesterol('');
  setIrregularHeartbeat('');
  setSnoring('');
  setOtherCondition('');
  setBpCheckFrequency('');
  setContraceptives('');
  setHormoneTherapy('');
  setPregnancyHypertension('');
  setFamilyHistory('');
  setDependents('');
  setInsurance('');
  setThyroidDisease(false);
  setHeartDisease(false);
  setAsthma(false);
  setMigraine(false);
  setSymptoms([]);
  setStressLevel('');
  setSleepHours('');
  setTiaHistory('');
  setAlcoholFrequency('');
  setSaveStatus('');
  setExistingAssessmentId(null);
  setResults({
    modalVisible: false,
    riskScore: 0,
    riskCategory: '',
    recommendations: ''
  });
};

  const toggleSymptom = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };
  
  const calculateRiskScore = () => {
    let score = 0;
    const ageNum = parseInt(patientVitals.age) || 0;
    const bmiNum = parseFloat(patientVitals.bmi) || 0;
    const stressNum = parseInt(stressLevel) || 0;
    const sleepNum = parseInt(sleepHours) || 8;
    const aqiNum = parseInt(patientVitals.aqi) || 0;
    
    // Parse blood pressure
    const bpParts = patientVitals.bloodPressure.split('/');
    const systolic = parseInt(bpParts[0]) || 0;
    const diastolic = parseInt(bpParts[1]) || 0;
    
    // Parse cholesterol values
    const ldlNum = parseFloat(patientVitals.ldl) || 0;
    const hdlNum = parseFloat(patientVitals.hdl) || 0;
    const cholesterolNum = parseFloat(patientVitals.cholesterol) || 0;
    const hba1cNum = parseFloat(patientVitals.hba1c) || 0;
    const rnddiabetesNum = parseFloat(patientVitals.rnddiabetes) || 0;

    // Risk scoring with controlled/uncontrolled differentiation
    
    // Smoking/Tobacco consumption
    if (smoke === 'yes') score += 1;
    
    // Hypertension - differentiate controlled vs uncontrolled
    if (systolic > 160 || diastolic > 100) {
        score += 3; // Uncontrolled hypertension
    } else if (systolic > 140 || diastolic > 90) {
        score += 2; // Controlled hypertension
    }
    
    // Age factor
    if (ageNum > 60) score += 1;
    
    // Alcohol abuse
    if (alcoholFrequency === 'daily' || alcoholFrequency === 'multiple-daily') score += 1;
    // Atrial fibrillation
    if (irregularHeartbeat === 'yes') score += 2;
    // Diabetes - differentiate controlled vs uncontrolled
    if (diabetes === 'yes' || rnddiabetesNum > 160) {
        if (hba1cNum >= 7) {
            score += 2; // Uncontrolled diabetes
        } else if (6.5 < hba1cNum < 7) {
            score += 1; // Controlled diabetes
        } else {
            score += 2; // Diabetes without HbA1c data (assume uncontrolled)
        }
    }
    // Lipid Profile - differentiate borderline vs high risk
    const hasHighCholesterol = cholesterolNum > 240;
    const hasHighLDL = ldlNum > 160;
    const hasLowHDL = hdlNum < 40; // Updated threshold for high risk
    const hasBorderlineCholesterol = cholesterolNum > 200 && cholesterolNum <= 240;
    const hasBorderlineLDL = ldlNum > 100 && ldlNum <= 160;
    const hasBorderlineHDL = hdlNum >= 40 && hdlNum < 60;
    if (hasHighCholesterol || hasHighLDL || hasLowHDL) {
        score += 2; // High risk lipid profile
    } else if (hasBorderlineCholesterol || hasBorderlineLDL || hasBorderlineHDL) {
        score += 1; // Borderline lipid profile
    }
    // High stress levels (PSS 3-4)
    if (stressNum >= 3) score += 1;
    // No exercise
    if (exercise === 'no') score += 1;
    // BMI >30 (obesity)
    if (bmiNum > 30) score += 1;
    // History of TIA
    if (tiaHistory === 'yes') score += 2;
    // Sleep deprivation
    if (sleepNum < 6) score += 1;
    // Air pollution - revised threshold for semi-rural settings
    if (aqiNum > 150) score += 1;
    // Family history
    if (familyHistory === 'yes') score += 2;
    // Standardized scoring interpretation (out of 21+ possible points)
    let category = '';
    let recommendationText = '';
    let rescreenInterval = '';
    let urgentReferral = false;
    if (score <= 5) {
        category = 'Low';
        recommendationText = 'You are a healthy individual. Maintain your current lifestyle with regular check-ups and preventive care.';
        rescreenInterval = 'Re-screen after 12 months';
    } else if (score >= 6 && score <= 12) {
        category = 'Moderate';
        recommendationText = 'Moderate risk detected. Consider dietary modifications, regular exercise, stress management, and follow-up with your physician for lifestyle counselling.';
        rescreenInterval = 'Lifestyle counselling recommended, re-check in 6 months';
    } else {
        category = 'High';
        recommendationText = 'High risk detected. Immediate consultation with a healthcare provider is strongly recommended for comprehensive evaluation and management.';
        rescreenInterval = 'Urgent referral to partner hospital';
        urgentReferral = true;
        setShowDoctorReferral(true);
    }
    return { 
        score, 
        category, 
        tips: recommendationText,
        rescreenInterval,
        urgentReferral,
        maxPossibleScore: 21 // For reference
    };
};

  const validateForm = () => {
    // Basic validation - can be enhanced
    if (!selectedPatient) {
      alert('Please select a patient first');
      return false;
    }
    return true;
  };

  // FUNCTION TO LOAD EXISTING ASSESSMENT DATA
  const loadExistingAssessment = async (patient) => {
  try {
    // Check if there's existing assessment data
    const q = query(
      collection(db, "medical_assessments"),
      where("patientId", "==", patient.id),
      orderBy("updatedAt", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Load the most recent assessment
      const assessmentDoc = snapshot.docs[0];
      const assessmentData = assessmentDoc.data();

      // Store the existing assessment ID
      setExistingAssessmentId(assessmentDoc.id);

      // Populate form fields with existing data
      setExercise(assessmentData.exercise || '');
      setExerciseFrequency(assessmentData.exerciseFrequency || '');
      setDiet(assessmentData.diet || '');
      setOutsideFood(assessmentData.outsideFood || '');
      setEducation(assessmentData.education || '');
      setProfession(assessmentData.profession || '');
      setAlcohol(assessmentData.alcohol || '');
      setSmoke(assessmentData.smoke || '');
      setHypertension(assessmentData.hypertension || '');
      setDiabetes(assessmentData.diabetes || '');
      setRnddiabetesNum(assessmentData.rnddiabetesNum || '');
      setCholesterol(assessmentData.cholesterol || '');
      setIrregularHeartbeat(assessmentData.irregularHeartbeat || '');
      setSnoring(assessmentData.snoring || '');
      setOtherCondition(assessmentData.otherCondition || '');
      setBpCheckFrequency(assessmentData.bpCheckFrequency || '');
      setContraceptives(assessmentData.contraceptives || '');
      setHormoneTherapy(assessmentData.hormoneTherapy || '');
      setPregnancyHypertension(assessmentData.pregnancyHypertension || '');
      setFamilyHistory(assessmentData.familyHistory || '');
      setDependents(assessmentData.dependents || '');
      setInsurance(assessmentData.insurance || '');

      // Load additional risk factors
      setStressLevel(assessmentData.stressLevel || '');
      setSleepHours(assessmentData.sleepHours || '');
      setTiaHistory(assessmentData.tiaHistory || '');
      setAlcoholFrequency(assessmentData.alcoholFrequency || '');

      if (assessmentData.pastConditions) {
        setThyroidDisease(assessmentData.pastConditions.thyroidDisease || false);
        setHeartDisease(assessmentData.pastConditions.heartDisease || false);
        setAsthma(assessmentData.pastConditions.asthma || false);
        setMigraine(assessmentData.pastConditions.migraine || false);
      }

      setSymptoms(assessmentData.symptoms || []);

      // Load risk assessment results if they exist
      if (assessmentData.riskAssessment) {
        setResults({
          modalVisible: false,
          riskScore: assessmentData.riskAssessment.riskScore || 0,
          riskCategory: assessmentData.riskAssessment.riskCategory || '',
          recommendations: assessmentData.riskAssessment.recommendations || ''
        });
      }

      console.log('Loaded existing assessment data for patient:', patient.tokenNumber);
    } else {
      // CHANGE: Only reset form when no existing data is found
      resetForm();
      console.log('No existing assessment found, form reset for patient:', patient.tokenNumber);
    }
  } catch (error) {
    console.error("Error loading existing assessment:", error);
    showErrorModal(
      "Assessment Loading Error",
      "Failed to load existing assessment data. The form will be reset to blank.",
      () => {
        setErrorModal({ isVisible: false, title: '', message: '', onRetry: null });
        // Retry loading
        loadExistingAssessment(patient);
      }
    );
    resetForm(); // Reset on error
  }
};

  // Function to check if patient has recent assessment (within 5 minutes)
  const checkRecentAssessment = async (patient) => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const q = query(
        collection(db, "medical_assessments"),
        where("patientId", "==", patient.id),
        where("updatedAt", ">=", fiveMinutesAgo),
        orderBy("updatedAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert(`Assessment for this patient was completed less than 5 minutes ago. Please wait before creating a new assessment.`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking recent assessments:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  const { score, category, tips } = calculateRiskScore();
  
  // First show the results modal
  setResults({
    modalVisible: true,
    riskScore: score,
    riskCategory: category,
    recommendations: tips
  });

  if (category === 'High') {
    setShowDoctorReferral(true);
  }
  
  console.log('Assessment completed for:', selectedPatient.tokenNumber);
};

const handleSaveAfterAssessment = async () => {
  if (!selectedPatient) {
    alert('Please select a patient first');
    return;
  }

  setSaveStatus('saving');

  try {
    // Prepare the data to save including risk assessment
    const medicalData = {
      patientId: selectedPatient.id,
      tokenNumber: selectedPatient.tokenNumber,

      // Patient's existing vital data
      patientVitals: {
        age: patientVitals.age,
        aqi: patientVitals.aqi,
        bmi: patientVitals.bmi,
        bloodPressure: patientVitals.bloodPressure,
        ldl: patientVitals.ldl,
        hdl: patientVitals.hdl,
        cholesterol: patientVitals.cholesterol,
        hba1c: patientVitals.hba1c
      },

      // Personal History
      exercise,
      exerciseFrequency,
      diet,
      outsideFood,
      education,
      profession,
      alcohol,
      smoke,

      // Medical History
      hypertension,
      diabetes,
      rnddiabetesNum,
      cholesterol,
      irregularHeartbeat,
      snoring,
      otherCondition,
      bpCheckFrequency,

      // Female-specific (if applicable)
      ...(selectedPatient.gender === 'Female' && {
        contraceptives,
        hormoneTherapy,
        pregnancyHypertension
      }),

      // Family History
      familyHistory,
      dependents,
      insurance,

      // Additional Risk Factors
      stressLevel,
      sleepHours,
      tiaHistory,
      alcoholFrequency,

      // Past History
      pastConditions: {
        thyroidDisease,
        heartDisease,
        asthma,
        migraine
      },

      // Symptoms
      symptoms,

      // Risk Assessment Results
      riskAssessment: {
        riskScore: results.riskScore,
        riskCategory: results.riskCategory,
        recommendations: results.recommendations,
        assessmentDate: new Date().toISOString()
      },

      // Metadata
      updatedAt: serverTimestamp(),
      updatedBy: 'middleman',
      status: 'Complete'
    };

    // CHANGE: Always check for existing assessment before saving
    if (!existingAssessmentId) {
      // Double-check for existing assessment
      const q = query(
        collection(db, "medical_assessments"),
        where("patientId", "==", selectedPatient.id),
        orderBy("updatedAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setExistingAssessmentId(snapshot.docs[0].id);
      }
    }

    if (existingAssessmentId) {
      // Update existing assessment
      const assessmentRef = doc(db, "medical_assessments", existingAssessmentId);
      await updateDoc(assessmentRef, medicalData);
      console.log('Updated existing assessment:', existingAssessmentId);
    } else {
      // Create new assessment only if absolutely no existing record
      const docRef = await addDoc(collection(db, "medical_assessments"), {
        ...medicalData,
        createdAt: serverTimestamp()
      });
      setExistingAssessmentId(docRef.id);
      console.log('Created new assessment:', docRef.id);
    }

    // Update patient status to Complete
    const patientRef = doc(db, "patients", selectedPatient.id);
    await updateDoc(patientRef, {
      status: 'Complete',
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedAt: serverTimestamp()
    });

    setSaveStatus('success');

    // Update local state
    const updatedPatients = patients.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, status: 'Complete', lastUpdated: new Date().toISOString().split('T')[0] }
        : patient
    );
    setPatients(updatedPatients);

    // Immediately update the selected patient as well
    setSelectedPatient(prev => ({
      ...prev,
      status: 'Complete',
      lastUpdated: new Date().toISOString().split('T')[0]
    }));

    // Close the modal after successful save
    setTimeout(() => {
      setResults({ ...results, modalVisible: false });
      setSaveStatus('');
    }, 2000);

  } catch (error) {
    console.error("Error saving data:", error);
    setSaveStatus('error');
    showErrorModal(
      "Save Error",
      "Failed to save the medical assessment. Please check your internet connection and try again.",
      () => {
        setErrorModal({ isVisible: false, title: '', message: '', onRetry: null });
        // Retry the save
        handleSaveAfterAssessment();
      }
    );
    setTimeout(() => setSaveStatus(''), 3000);
  }
};

  const handleDeleteAssessment = async (patient) => {
    try {
      // First, check if there's an existing assessment
      const q = query(
        collection(db, "medical_assessments"),
        where("patientId", "==", patient.id),
        orderBy("updatedAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("No medical assessment found for this patient.");
        return;
      }

      const assessmentDoc = snapshot.docs[0];

      // Show confirmation modal
      setDeleteConfirmation({
        isVisible: true,
        patientId: patient.id,
        patientName: patient.name,
        assessmentId: assessmentDoc.id
      });

    } catch (error) {
      console.error("Error checking for assessment:", error);
      alert("Error checking assessment data. Please try again.");
    }
  };

  const confirmDeleteAssessment = async () => {
    try {
      // Delete the medical assessment document
      await deleteDoc(doc(db, "medical_assessments", deleteConfirmation.assessmentId));
      
      // Update patient status back to 'Pending' (since assessment is deleted)
      const patientRef = doc(db, "patients", deleteConfirmation.patientId);
      await updateDoc(patientRef, {
        status: 'Pending',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedAt: serverTimestamp()
      });
    
      // Update local state
      const updatedPatients = patients.map(patient => 
        patient.id === deleteConfirmation.patientId 
          ? { ...patient, status: 'Pending', lastUpdated: new Date().toISOString().split('T')[0] }
          : patient
      );
      setPatients(updatedPatients);
    
      // Update selected patient if it's the one being deleted
      if (selectedPatient?.id === deleteConfirmation.patientId) {
        setSelectedPatient(prev => ({
          ...prev,
          status: 'Pending',
          lastUpdated: new Date().toISOString().split('T')[0]
        }));
        
        // Reset form and clear existing assessment ID
        resetForm();
        setExistingAssessmentId(null);
      }
    
      // Close confirmation modal
      setDeleteConfirmation({
        isVisible: false,
        patientId: null,
        patientName: '',
        assessmentId: null
      });
    
      alert("Medical assessment deleted successfully!");
    
    } catch (error) {
      console.error("Error deleting assessment:", error);
      showErrorModal(
        "Delete Error",
        "Failed to delete the medical assessment. Please try again.",
        () => {
          setErrorModal({ isVisible: false, title: '', message: '', onRetry: null });
          // Retry the delete
          confirmDeleteAssessment();
        }
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const RadioGroup = ({ label, value, onChange, options }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              value === option.value
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const CheckboxGroup = ({ label, items, selectedItems, onToggle }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="space-y-2">
        {items.map(item => (
          <label key={item} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => onToggle(item)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const handleLogout = () => {
    setLogoutModal({ isVisible: true });
  };

  const confirmLogout = () => {
    setLogoutModal({ isVisible: false });
    navigate('/');
  };

  const showErrorModal = (title, message, onRetry = null) => {
    setErrorModal({
      isVisible: true,
      title,
      message,
      onRetry
    });
  };
  
  const showSuccessModal = (title, message) => {
    setSuccessModal({
      isVisible: true,
      title,
      message
    });
  };

  // Logout Confirmation Modal
  const LogoutModal = () => (
    logoutModal.isVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to logout? Any unsaved changes will be lost.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setLogoutModal({ isVisible: false })}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Error Modal
  const ErrorModal = () => (
    errorModal.isVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">{errorModal.title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{errorModal.message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setErrorModal({ isVisible: false, title: '', message: '', onRetry: null })}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {errorModal.onRetry && (
              <button
                onClick={errorModal.onRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );

  // Success Modal
  const SuccessModal = () => (
    successModal.isVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">{successModal.title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{successModal.message}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setSuccessModal({ isVisible: false, title: '', message: '' })}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {/* Tailwind CSS CDN */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-xl font-bold text-gray-900">Medical Officer Dashboard</h1>
                <p className="text-sm text-gray-500">Patient Management System</p>
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

        {/* Assessment Statistics */}
        <div className="mb-6 bg-white rounded-lg px-4 py-4 border shadow-sm">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-semibold text-gray-800">Assessment Statistics</h2>
           <div className="flex items-center space-x-8">
             <div className="flex items-center bg-yellow-50 rounded-lg px-4 py-2 border border-yellow-200">
               <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
               <span className="text-sm font-medium text-gray-700 mr-3">Pending Review:</span>
               <div className="bg-yellow-500 text-white px-3 py-1 rounded-md font-bold text-lg">
                 {peopleCount.pendingReview}
               </div>
             </div>
             <div className="flex items-center bg-green-50 rounded-lg px-4 py-2 border border-green-200">
               <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
               <span className="text-sm font-medium text-gray-700 mr-3">Completed:</span>
               <div className="bg-green-500 text-white px-3 py-1 rounded-md font-bold text-lg">
                 {peopleCount.completed}
               </div>
             </div>
           </div>
         </div>
        </div>

        <div className="flex h-screen" style={{height: 'calc(100vh - 80px)'}}>
          {/* Sidebar - Patient List */}
          <div className="w-1/3 bg-white border-r p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by token number or name..."
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
              {filteredPatients.map(patient => (
                <div
                  key={patient.tokenNumber}
                  onClick={() => handlePatientSelect(patient)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.tokenNumber === patient.tokenNumber
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{patient.tokenNumber}</h3>
                    <span className={`px-2 py-1 text-xs ${getStatusColor(patient.status)} rounded-full `}>
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{patient.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {patient.age} years, {patient.gender} • Updated: {patient.lastUpdated}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedPatient ? (
              <div className="p-6">
                {/* Patient Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedPatient.tokenNumber}</h2>
                      <p className="text-gray-600">{selectedPatient.name} • {selectedPatient.age} years, {selectedPatient.gender}</p>
                    </div>

                    {/* Delete Assessment Button */}
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-sm ${getStatusColor(selectedPatient.status)} rounded-full`}>
                        {selectedPatient.status}
                      </span>

                      {selectedPatient.status === 'Complete' && (
                        <button
                          onClick={() => handleDeleteAssessment(selectedPatient)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                          title="Delete Medical Assessment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete Assessment
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Patient Vitals Display */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Patient Vitals (From Database)
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">Age</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.age || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">BMI</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.bmi || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">Blood Pressure</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.bloodPressure || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">LDL</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.ldl || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">HDL</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.hdl || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">Cholesterol</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.cholesterol || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">HbA1c (%)</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.hba1c || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">AQI</label>
                      <p className="text-lg font-semibold text-gray-900">{patientVitals.aqi || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Medical Forms */}
                <div className="space-y-6">
                  {/* Personal History */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal History
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <RadioGroup
                        label="Do you engage in regular physical activity or exercise?"
                        value={exercise}
                        onChange={setExercise}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />

                      <RadioGroup
                        label="What is your typical diet?"
                        value={diet}
                        onChange={setDiet}
                        options={[
                          { value: 'veg', label: 'Vegetarian' },
                          { value: 'non-veg', label: 'Non-Vegetarian' },
                          { value: 'mixed', label: 'Mixed' }
                        ]}
                      />

                      <RadioGroup
                        label="Educational Level"
                        value={education}
                        onChange={setEducation}
                        options={[
                          { value: 'high-school', label: 'High School' },
                          { value: 'undergraduate', label: 'Undergraduate' },
                          { value: 'graduate', label: 'Graduate' },
                          { value: 'specialty', label: 'Specialty' },
                          { value: 'other', label: 'Other' }
                        ]}
                      />
                    </div>
                      
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {exercise === 'yes' && (
                        <RadioGroup
                          label="How often do you exercise?"
                          value={exerciseFrequency}
                          onChange={setExerciseFrequency}
                          options={[
                            { value: 'daily', label: 'Daily' },
                            { value: '3-5', label: '3-5 times/week' },
                            { value: '1-2', label: '1-2 times/week' }
                          ]}
                        />
                      )}

                      <RadioGroup
                        label="How often do you order outside food?"
                        value={outsideFood}
                        onChange={setOutsideFood}
                        options={[
                          { value: 'never', label: 'Never' },
                          { value: 'rarely', label: 'Rarely' },
                          { value: 'occasionally', label: 'Occasionally' },
                          { value: 'regularly', label: 'Regularly' },
                          { value: 'frequently', label: 'Frequently' }
                        ]}
                      />

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                        <input
                          type="text"
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter profession"
                        />
                      </div>
                      
                      <RadioGroup
                        label="Do you smoke?"
                        value={smoke}
                        onChange={setSmoke}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />
                    </div>
                      
                    <div className="grid grid-cols-1 gap-6 mt-6">
                      <RadioGroup
                        label="Alcohol consumption frequency"
                        value={alcoholFrequency}
                        onChange={setAlcoholFrequency}
                        options={[
                          { value: 'never', label: 'Never' },
                          { value: 'occasional', label: 'Occasional' },
                          { value: 'daily', label: 'Daily (1-2 drinks)' },
                          { value: 'multiple-daily', label: 'Multiple daily (>2 drinks)' }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Additional Risk Factors */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Additional Risk Factors
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RadioGroup
                        label="Do you have Stress?"
                        value={stressLevel}
                        onChange={setStressLevel}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sleep hours per night</label>
                        <input
                          type="number"
                          value={sleepHours}
                          onChange={(e) => setSleepHours(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter hours (e.g., 7)"
                          min="0"
                          max="24"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Medical History
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RadioGroup
                        label="High Blood Pressure"
                        value={hypertension}
                        onChange={setHypertension}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />

                      <RadioGroup
                        label="Irregular Heartbeats"
                        value={irregularHeartbeat}
                        onChange={setIrregularHeartbeat}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />

                      <RadioGroup
                        label="Snoring"
                        value={snoring}
                        onChange={setSnoring}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />
                    </div>

                    {/* TIA History - NEW SECTION */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Neurological History</h4>
                      <div className="grid grid-cols-1 gap-6">
                        <RadioGroup
                          label="Have you experienced any episode of TIA (Transient Ischemic Attack) in the last 3 months?"
                          value={tiaHistory}
                          onChange={setTiaHistory}
                          options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Other medical conditions</label>
                        <textarea
                          value={otherCondition}
                          onChange={(e) => setOtherCondition(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter any other medical conditions"
                        />
                      </div>
                    </div>

                    {(hypertension === 'yes' || diabetes === 'yes') && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <RadioGroup
                          label="How often do you check your BP/Blood Sugar?"
                          value={bpCheckFrequency}
                          onChange={setBpCheckFrequency}
                          options={[
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'few-months', label: 'Every Few Months' },
                            { value: 'yearly', label: 'Yearly' }
                          ]}
                        />
                      </div>
                    )}

                    {selectedPatient.gender === 'Female' && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Female-Specific History</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <RadioGroup
                            label="Have you ever taken oral contraceptives?"
                            value={contraceptives}
                            onChange={setContraceptives}
                            options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' }
                            ]}
                          />

                          <RadioGroup
                            label="Do you currently take hormone therapy?"
                            value={hormoneTherapy}
                            onChange={setHormoneTherapy}
                            options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' }
                            ]}
                          />

                          <RadioGroup
                            label="History of hypertension during pregnancy?"
                            value={pregnancyHypertension}
                            onChange={setPregnancyHypertension}
                            options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' },
                              { value: 'na', label: 'N/A' }
                            ]}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Family History */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Family History
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RadioGroup
                        label="Family history of stroke, hypertension or diabetes?"
                        value={familyHistory}
                        onChange={setFamilyHistory}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">How many family members depend on you?</label>
                        <input
                          type="number"
                          value={dependents}
                          onChange={(e) => setDependents(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter number"
                        />
                      </div>

                      <RadioGroup
                        label="Do you currently have medical insurance?"
                        value={insurance}
                        onChange={setInsurance}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Past History */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Past History</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'thyroid', label: 'Thyroid disease', state: thyroidDisease, setter: setThyroidDisease },
                        { key: 'heart', label: 'CAD/IHD (Heart Disease)', state: heartDisease, setter: setHeartDisease },
                        { key: 'asthma', label: 'Bronchial asthma or OSA', state: asthma, setter: setAsthma },
                        { key: 'migraine', label: 'Migraine', state: migraine, setter: setMigraine }
                      ].map(condition => (
                        <label key={condition.key} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={condition.state}
                            onChange={(e) => condition.setter(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{condition.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Symptoms
                    </h3>
                    
                    <CheckboxGroup
                      label="Have you experienced any of the following symptoms?"
                      items={[
                        'Loss of balance or coordination',
                        'Sudden vision changes, such as blurred vision or loss of vision in one or both eyes',
                        'Tingling, numbness in the limbs',
                        'Sudden weakness or heaviness of the limbs or facial weakness',
                        'Difficulty speaking, slurred speech, or trouble understanding speech',
                        'Severe headache with no known cause',
                        'Repeated episodes of giddiness/early morning dizziness',
                        'Frequent episodes of severe fatigue'
                      ]}
                      selectedItems={symptoms}
                      onToggle={toggleSymptom}
                    />
                  </div>

                  {/* Submit Button - Add this after the Symptoms section */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
                    >
                      Calculate Risk Assessment
                    </button>
                  </div>

                </div>
                {/* Enhanced Results Modal - Add this before the closing </div> of the component */}
                {results.modalVisible && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                          results.riskCategory === 'Low' ? 'bg-green-300 text-green-700' :
                          results.riskCategory === 'Moderate' ? 'bg-yellow-300 text-yellow-700' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {results.riskCategory === 'Low' ? '✓' : 
                           results.riskCategory === 'Moderate' ? '⚠' : '⚠'}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete</h2>
                        <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          results.riskCategory === 'Low' ? 'bg-green-100 text-green-800' :
                          results.riskCategory === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {results.riskCategory} Risk Level
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Risk Score: {results.riskScore}</h3>
                        <p className="text-gray-600 leading-relaxed">{results.recommendations}</p>
                      </div>
                      
                      {showDoctorReferral && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Doctor Referral Recommended
                          </h3>
                          <p className="text-red-700 mb-4">
                            Based on your assessment, we strongly recommend consulting with a healthcare provider immediately.
                          </p>
                        </div>
                      )}

                      {/* Save Status Display */}
                      {saveStatus && (
                        <div className="mb-6">
                          {saveStatus === 'saving' && (
                            <div className="flex items-center justify-center text-blue-600 bg-blue-50 p-4 rounded-xl">
                              <Clock className="w-5 h-5 mr-2" />
                              <span>Saving assessment to database...</span>
                            </div>
                          )}
                          {saveStatus === 'success' && (
                            <div className="flex items-center justify-center text-green-600 bg-green-50 p-4 rounded-xl">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span>Assessment saved successfully!</span>
                            </div>
                          )}
                          {saveStatus === 'error' && (
                            <div className="flex items-center justify-center text-red-600 bg-red-50 p-4 rounded-xl">
                              <AlertCircle className="w-5 h-5 mr-2" />
                              <span>Error saving assessment</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-4">
                        {saveStatus !== 'success' && (
                          <button
                            onClick={handleSaveAfterAssessment}
                            disabled={saveStatus === 'saving'}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save Assessment Data
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {deleteConfirmation.isVisible && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Assessment</h2>
                        <p className="text-gray-600">
                          Are you sure you want to delete the medical assessment for{' '}
                          <span className="font-semibold">{deleteConfirmation.patientName}</span>?
                        </p>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                          <div>
                            <h3 className="font-semibold text-yellow-800 mb-1">Warning</h3>
                            <p className="text-sm text-yellow-700">
                              This will permanently delete the medical assessment data. The patient's basic information will remain unchanged, but all assessment results will be lost.
                            </p>
                          </div>
                        </div>
                      </div>
              
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirmation({
                            isVisible: false,
                            patientId: null,
                            patientName: '',
                            assessmentId: null
                          })}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        
                        <button
                          onClick={confirmDeleteAssessment}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors duration-200"
                        >
                          Delete Assessment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Search className="w-16 h-16 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                  <p className="text-black">Choose a patient from the list to enter their medical data</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <LogoutModal />
        <ErrorModal />
        <SuccessModal />
      </div>
    </>
  );
};

export default MiddlemanDashboard;