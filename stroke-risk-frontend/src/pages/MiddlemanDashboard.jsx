import React, { useState, useEffect } from 'react';
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
  limit
} from "firebase/firestore";

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
        // Ensure all required fields have default values
        status: doc.data().status || 'Pending',
        lastUpdated: doc.data().lastUpdated || new Date().toISOString().split('T')[0]
      }));
      setPatients(data);

      // Update people count based on fetched data
      const progressReview = data.filter(p => p.status === 'In Progress').length;
      const pendingReview = data.filter(p => p.status === 'Pending').length;
      const completed = data.filter(p => p.status === 'Complete').length;
      
      // To get high risk patients, you'd need to query the medical_assessments collection
      // For now, we'll set it to 0 or calculate it separately
      const highRiskPatients = 0; // This would need a separate query

      setPeopleCount({
        progressReview, // CHANGE: Use progressReview instead of inProgress
        pendingReview,
        completed,
        highRiskPatients
      });
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert("Error loading patient data. Please refresh the page.");
    }
  };

  fetchPatients();
}, []);

  const [searchToken, setSearchToken] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState(patients);

  // New risk assessment parameters
  const [stressLevel, setStressLevel] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [tiaHistory, setTiaHistory] = useState('');
  const [alcoholFrequency, setAlcoholFrequency] = useState('');

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

    // Risk scoring based on new parameters
    if (smoke === 'yes') score += 1; // Smoking/Tobacco consumption
    if (systolic > 140 || diastolic > 90) score += 3; // Blood Pressure >140/90
    if (ageNum > 60) score += 1; // Age > 60
    if (alcoholFrequency === 'daily' || alcoholFrequency === 'multiple-daily') score += 1; // Alcohol abuse
    if (irregularHeartbeat === 'yes') score += 2; // Atrial fibrillation
    if (diabetes === 'yes' || rnddiabetesNum > 160 || hba1cNum > 6.5) score += 2; // Diabetes
    if (cholesterolNum > 200 || ldlNum > 100 || hdlNum < 60) score += 2; // Abnormal Lipid profile
    if (stressNum >= 3) score += 1; // High stress levels (PSS 3-4)
    if (exercise === 'no') score += 1; // No exercise
    if (bmiNum > 30) score += 1; // BMI >30
    if (tiaHistory === 'yes') score += 2; // History of TIA
    if (sleepNum < 6) score += 1; // Sleep deprivation
    if (aqiNum > 200) score += 1; // Air pollution
    if (familyHistory === 'yes') score += 2; // Family history

    let category = '';
    let recommendationText = '';

    if (score < 5) {
      category = 'Low';
      recommendationText = 'You are a healthy individual. Maintain your current lifestyle with regular check-ups.';
    } else if (score >= 5 && score <= 8) {
      category = 'Moderate';
      recommendationText = 'Moderate risk detected. Consider dietary modifications, regular exercise, and follow-up with your physician.';
    } else {
      category = 'High';
      recommendationText = 'High risk detected. Immediate consultation with a healthcare provider is recommended.';
      setShowDoctorReferral(true);
    }

    return { score, category, tips: recommendationText };
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
    setPatients(prev => prev.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, status: 'Complete', lastUpdated: new Date().toISOString().split('T')[0] }
        : patient
    ));

    // Close the modal after successful save
    setTimeout(() => {
      setResults({ ...results, modalVisible: false });
      setSaveStatus('');
    }, 2000);

  } catch (error) {
    console.error("Error saving data:", error);
    setSaveStatus('error');
    alert("Error saving data. Please try again.");
    setTimeout(() => setSaveStatus(''), 3000);
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-red-500 bg-red-100';
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
    alert("Logged out!");
    navigate('/');
  };

  return (
    <>
      {/* Tailwind CSS CDN */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Medical Data Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Middleman Portal</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-black" onClick={handleLogout} />
              </div>
            </div>
          </div>
        </div>

        {/* People Count Dashboard - Add this after the header section */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-black mb-4 text-center">Assessment Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-yellow-500 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-400/30">
              <div className="text-2xl font-bold text-white">{peopleCount.pendingReview}</div>
              <div className="text-yellow-700 text-sm font-medium">Pending Review</div>
            </div>
            <div className="bg-blue-500 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-400/30">
              <div className="text-2xl font-bold text-white">{peopleCount.progressReview}</div>
              <div className="text-blue-700 text-sm font-medium">In Progress</div>
            </div>
            <div className="bg-green-500 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/30">
              <div className="text-2xl font-bold text-white">{peopleCount.completed}</div>
              <div className="text-green-700 text-sm font-medium">Completed</div>
            </div>
            {/* <div className="bg-red-500 backdrop-blur-sm rounded-xl p-4 text-center border border-red-400/30">
              <div className="text-2xl font-bold text-white">{peopleCount.highRiskPatients}</div>
              <div className="text-red-700 text-sm font-medium">High Risk</div>
            </div> */}
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RadioGroup
                        label="Do you engage in regular physical activity or exercise?"
                        value={exercise}
                        onChange={setExercise}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />

                      {exercise === 'yes' && (
                        <RadioGroup
                          label="How often?"
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
                  </div>

                  {/* Additional Risk Factors */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Additional Risk Factors
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RadioGroup
                        label="Stress Level (PSS Scale 0-4)"
                        value={stressLevel}
                        onChange={setStressLevel}
                        options={[
                          { value: '0', label: '0 - No stress' },
                          { value: '1', label: '1 - Low stress' },
                          { value: '2', label: '2 - Moderate stress' },
                          { value: '3', label: '3 - High stress' },
                          { value: '4', label: '4 - Very high stress' }
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
                        label="Diabetes"
                        value={diabetes}
                        onChange={setDiabetes}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Random Blood Sugar</label>
                        <input
                          type="number"
                          value={rnddiabetesNum}
                          onChange={(e) => setRnddiabetesNum(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter sugar"
                        />
                      </div>

                      <RadioGroup
                        label="High Cholesterol"
                        value={cholesterol}
                        onChange={setCholesterol}
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
                    )}

                    {selectedPatient.gender === 'Female' && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Female-Specific History</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <button
                            onClick={() => {
                              alert('Patient flagged for doctor consultation. Referral sent to medical team.');
                              setShowDoctorReferral(false);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
                          >
                            <Heart className="w-4 h-4" />
                            Forward to Doctor
                          </button>
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
                        <button
                          onClick={() => {
                            setResults({ ...results, modalVisible: false });
                            setSaveStatus('');
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                        >
                          Close Without Saving
                        </button>
                        
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
      </div>
    </>
  );
};

export default MiddlemanDashboard;