import React, { useState, useEffect } from 'react';
import { Search, User, Heart, FileText, Save, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MiddlemanDashboard = () => {
  // State for patient data
  const [patients, setPatients] = useState([
    {
      tokenNumber: 'PAT001',
      name: 'John D.',
      age: 45,
      gender: 'Male',
      status: 'Pending',
      lastUpdated: '2025-06-10'
    },
    {
      tokenNumber: 'PAT002',
      name: 'Sarah M.',
      age: 32,
      gender: 'Female',
      status: 'Complete',
      lastUpdated: '2025-06-09'
    },
    {
      tokenNumber: 'PAT003',
      name: 'Robert K.',
      age: 58,
      gender: 'Male',
      status: 'In Progress',
      lastUpdated: '2025-06-10'
    },
    {
      tokenNumber: 'PAT004',
      name: 'Emily R.',
      age: 41,
      gender: 'Female',
      status: 'Pending',
      lastUpdated: '2025-06-08'
    }
  ]);

  const [searchToken, setSearchToken] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState(patients);

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

  const [saveStatus, setSaveStatus] = useState('');

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
    resetForm();
  };

  const resetForm = () => {
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
  };

  const toggleSymptom = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      // Update patient status
      setPatients(prev => prev.map(p => 
        p.tokenNumber === selectedPatient.tokenNumber 
          ? { ...p, status: 'Complete', lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      ));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-red-600 bg-red-100';
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
                <User className="w-4 h-4 text-white" />
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
                    <div className="flex items-center space-x-2">
                      {saveStatus === 'saving' && (
                        <div className="flex items-center text-blue-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">Saving...</span>
                        </div>
                      )}
                      {saveStatus === 'success' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Saved successfully</span>
                        </div>
                      )}
                      <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Data</span>
                      </button>
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
                        label="Do you consume alcohol?"
                        value={alcohol}
                        onChange={setAlcohol}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
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
                </div>
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