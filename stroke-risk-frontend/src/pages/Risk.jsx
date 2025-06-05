import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { CheckCircle, Heart, User, Activity, FileText, Users, Clock, AlertTriangle, Info } from 'lucide-react';

const StrokeRiskAssessmentScreen = () => {
  // State variables for form inputs - GENERAL INFORMATION
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [locality, setLocality] = useState('');
  const [durationOfStay, setDurationOfStay] = useState('');

  // BASIC PARAMETERS
  const [bloodPressure, setBloodPressure] = useState('');
  const [pulse, setPulse] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState('');

  // PERSONAL HISTORY
  const [exercise, setExercise] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [diet, setDiet] = useState('');
  const [outsideFood, setOutsideFood] = useState('');
  const [education, setEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [smoke, setSmoke] = useState('');

  // MEDICAL HISTORY
  const [hypertension, setHypertension] = useState('');
  const [diabetes, setDiabetes] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [irregularHeartbeat, setIrregularHeartbeat] = useState('');
  const [snoring, setSnoring] = useState('');
  const [otherCondition, setOtherCondition] = useState('');
  const [bpCheckFrequency, setBpCheckFrequency] = useState('');
  
  // FEMALE-SPECIFIC HISTORY
  const [contraceptives, setContraceptives] = useState('');
  const [hormoneTherapy, setHormoneTherapy] = useState('');
  const [pregnancyHypertension, setPregnancyHypertension] = useState('');

  // FAMILY HISTORY
  const [familyHistory, setFamilyHistory] = useState('');
  const [dependents, setDependents] = useState('');
  const [insurance, setInsurance] = useState('');

  // PAST HISTORY
  const [thyroidDisease, setThyroidDisease] = useState(false);
  const [heartDisease, setHeartDisease] = useState(false);
  const [asthma, setAsthma] = useState(false);
  const [migraine, setMigraine] = useState(false);

// TIA HISTORY
  const [tiaHistory, setTiaHistory] = useState('');
  const [tiaFrequency, setTiaFrequency] = useState('');
  const [tiaSymptoms, setTiaSymptoms] = useState([]);
  const [lastTiaOccurrence, setLastTiaOccurrence] = useState('');

  // SYMPTOMS
  const [symptoms, setSymptoms] = useState([]);

  // Result modal state
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [riskCategory, setRiskCategory] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // Calculate BMI
  useEffect(() => {
    if (weight && height) {
      const heightInMeters = parseFloat(height) / 100;
      const calculatedBMI = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
      setBMI(calculatedBMI);
    }
  }, [weight, height]);

  // Toggle symptom selection
  const toggleSymptom = (symptom) => {
    setSymptoms(prevSymptoms => 
      prevSymptoms.includes(symptom)
        ? prevSymptoms.filter(s => s !== symptom)
        : [...prevSymptoms, symptom]
    );
  };

  // Toggle TIA symptom selection
  const toggleTiaSymptom = (symptom) => {
    setTiaSymptoms(prevSymptoms => 
    prevSymptoms.includes(symptom)
      ? prevSymptoms.filter(s => s !== symptom)
      : [...prevSymptoms, symptom]
    );
  };

  // Toggle past history condition
  const togglePastCondition = (condition, setter) => {
    setter(prev => !prev);
  };

  const calculateRiskScore = () => {
    let score = 0;
    
    // Basic risk factor calculations based on the provided scoring system
    const ageNum = parseInt(age) || 0;
    const bmiNum = parseFloat(bmi) || 0;
    
    // SMOKING (1 point)
    if (smoke === 'yes') score += 1;
    
    // HYPERTENSION (4 points)
    if (hypertension === 'yes' || (bloodPressure && parseFloat(bloodPressure.split('/')[0]) > 140)) score += 4;
    
    // AGE more than 60 (1 point)
    if (ageNum > 60) score += 1;
    
    // ALCOHOL ABUSE (1 point)
    if (alcohol === 'yes') score += 1;
    
    // ATRIAL FIBRILLATION - irregular pulse (4 points)
    if (irregularHeartbeat === 'yes') score += 4;
    
    // DIABETES (2 points)
    if (diabetes === 'yes') score += 2;
    
    // OBESITY (BMI > 30) (1 point)
    if (bmiNum > 30) score += 1;
    
    // FAMILY HISTORY (1 point)
    if (familyHistory === 'yes') score += 1;
    
    // SEDENTARY LIFESTYLE (1 point)
    if (exercise === 'no') score += 1;
    
    // HISTORY OF TIA (Symptoms suggesting TIA) (1 point)
    if (symptoms.length >= 2) score += 1;
    
    // HISTORY of previous brain stroke, Coronary or Kidney disease (1 point)
    if (heartDisease) score += 1;

    // TIA specific scoring
    if (tiaHistory === 'yes') score += 1;

    // Determine risk category and recommendations
    let category = '';
    let recommendationText = '';

    if (score <= 3) {
      category = 'Low';
      recommendationText = 'You are a healthy individual. Maintain your current lifestyle with regular check-ups.';
    } else if (score >= 4 && score <= 7) {
      category = 'Moderate';
      recommendationText = 'Moderate risk detected. Consider dietary modifications, regular exercise, and follow-up with your physician.';
    } else {
      category = 'High';
      recommendationText = 'High risk detected. Immediate consultation with a healthcare provider is recommended. Consider comprehensive medical investigations including ECG, fundoscopy, and relevant lab tests.';
    }

    setRiskScore(score);
    setRiskCategory(category);
    setRecommendations(recommendationText);
    setResultModalVisible(true);
  };

  // Form validation
  const validateForm = () => {
    if (!name || !age || !gender) {
      alert('Please fill in your name, age, and gender.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      calculateRiskScore();
    }
  };

  const RadioGroup = ({ options, value, onChange, name }) => (
    <div className="radio-group">
      {options.map((option) => (
        <label key={option.value} className={`radio-option ${value === option.value ? 'selected' : ''}`}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="radio-input"
          />
          <span className="radio-label">{option.label}</span>
        </label>
      ))}
    </div>
  );

  const CheckBox = ({ title, checked, onPress }) => (
    <label className={`checkbox-item ${checked ? 'checked' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onPress}
        className="checkbox-input"
      />
      <CheckCircle className={`checkbox-icon ${checked ? 'visible' : ''}`} size={20} />
      <span className="checkbox-label">{title}</span>
    </label>
  );

  return (
      <>
        <Header />
        <div className="form-container">
          {/* GENERAL INFORMATION Section */}
          <div className="form-section">
            <div className="section-header">
              <User className="section-icon" size={24} />
              <h2 className="section-title">Personal Information</h2>
            </div>
            
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">Name (Initials)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your initials"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Age (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div className="input-group full-width">
                <label className="input-label">Email ID</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="radio-section">
              <label className="input-label">Gender</label>
              <RadioGroup
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
                value={gender}
                onChange={setGender}
                name="gender"
              />
            </div>
            
            <div className="radio-section">
              <label className="input-label">Marital Status</label>
              <RadioGroup
                options={[
                  { value: 'single', label: 'Single' },
                  { value: 'married', label: 'Married' }
                ]}
                value={maritalStatus}
                onChange={setMaritalStatus}
                name="maritalStatus"
              />
            </div>
            
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">Locality</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your locality"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Duration of stay (years)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Years"
                  value={durationOfStay}
                  onChange={(e) => setDurationOfStay(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* BASIC PARAMETERS */}
          <div className="form-section">
            <div className="section-header">
              <Activity className="section-icon" size={24} />
              <h2 className="section-title">Basic Parameters</h2>
            </div>
            
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">Blood Pressure</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 120/80"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Pulse (bpm)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Beats per minute"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">BMI (Auto-calculated)</label>
                <input
                  type="text"
                  className="form-input bmi-input"
                  placeholder="BMI"
                  value={bmi}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* PERSONAL HISTORY Section */}
          <div className="form-section">
            <div className="section-header">
              <FileText className="section-icon" size={24} />
              <h2 className="section-title">Personal History</h2>
            </div>
            
            <div className="radio-section">
              <label className="input-label">Do you engage in regular physical activity or exercise?</label>
              <RadioGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={exercise}
                onChange={setExercise}
                name="exercise"
              />
            </div>
            
            {exercise === 'yes' && (
              <div className="radio-section">
                <label className="input-label">How often?</label>
                <RadioGroup
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: '3-5', label: '3-5 times/week' },
                    { value: '1-2', label: '1-2 times/week' }
                  ]}
                  value={exerciseFrequency}
                  onChange={setExerciseFrequency}
                  name="exerciseFrequency"
                />
              </div>
            )}
            
            <div className="radio-section">
              <label className="input-label">What is your typical diet?</label>
              <RadioGroup
                options={[
                  { value: 'veg', label: 'Vegetarian' },
                  { value: 'non-veg', label: 'Non-Vegetarian' },
                  { value: 'mixed', label: 'Mixed' }
                ]}
                value={diet}
                onChange={setDiet}
                name="diet"
              />
            </div>
            
            <div className="radio-section">
              <label className="input-label">How often do you order outside food?</label>
              <RadioGroup
                options={[
                  { value: 'never', label: 'Never' },
                  { value: 'rarely', label: 'Rarely' },
                  { value: 'occasionally', label: 'Occasionally' },
                  { value: 'regularly', label: 'Regularly' },
                  { value: 'frequently', label: 'Frequently' }
                ]}
                value={outsideFood}
                onChange={setOutsideFood}
                name="outsideFood"
              />
            </div>
            
            <div className="radio-section">
              <label className="input-label">Educational Level</label>
              <RadioGroup
                options={[
                  { value: 'high-school', label: 'High School' },
                  { value: 'undergraduate', label: 'Undergraduate' },
                  { value: 'graduate', label: 'Graduate' },
                  { value: 'specialty', label: 'Specialty' },
                  { value: 'other', label: 'Other' }
                ]}
                value={education}
                onChange={setEducation}
                name="education"
              />
            </div>
            
            <div className="input-group full-width">
              <label className="input-label">Profession</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
            
            <div className="radio-section">
              <label className="input-label">Do you consume alcohol?</label>
              <RadioGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={alcohol}
                onChange={setAlcohol}
                name="alcohol"
              />
            </div>
            
            <div className="radio-section">
              <label className="input-label">Do you smoke?</label>
              <RadioGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={smoke}
                onChange={setSmoke}
                name="smoke"
              />
            </div>
          </div>

          {/* MEDICAL HISTORY Section */}
          <div className="form-section">
            <div className="section-header">
              <Heart className="section-icon" size={24} />
              <h2 className="section-title">Medical History</h2>
            </div>
            
            <div className="medical-grid">
              <div className="radio-section">
                <label className="input-label">High Blood Pressure</label>
                <RadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={hypertension}
                  onChange={setHypertension}
                  name="hypertension"
                />
              </div>

              <div className="radio-section">
                <label className="input-label">Diabetes</label>
                <RadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={diabetes}
                  onChange={setDiabetes}
                  name="diabetes"
                />
              </div>
              
              <div className="radio-section">
                <label className="input-label">High Cholesterol</label>
                <RadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={cholesterol}
                  onChange={setCholesterol}
                  name="cholesterol"
                />
              </div>
              
              <div className="radio-section">
                <label className="input-label">Irregular Heartbeats</label>
                <RadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={irregularHeartbeat}
                  onChange={setIrregularHeartbeat}
                  name="irregularHeartbeat"
                />
              </div>
              
              <div className="radio-section">
                <label className="input-label">Snoring</label>
                <RadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={snoring}
                  onChange={setSnoring}
                  name="snoring"
                />
              </div>
            </div>
            
            <div className="input-group full-width">
              <label className="input-label">Other medical conditions</label>
              <textarea
                className="form-textarea"
                placeholder="Please describe any other medical conditions"
                value={otherCondition}
                onChange={(e) => setOtherCondition(e.target.value)}
                rows={3}
              />
            </div>
            
            {(hypertension === 'yes' || diabetes === 'yes') && (
              <div className="radio-section">
                <label className="input-label">How often do you check your BP/Blood Sugar?</label>
                <RadioGroup
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'few-months', label: 'Every Few Months' },
                    { value: 'yearly', label: 'Yearly' }
                  ]}
                  value={bpCheckFrequency}
                  onChange={setBpCheckFrequency}
                  name="bpCheckFrequency"
                />
              </div>
            )}
            
            {gender === 'female' && (
              <div className="female-section">
                <h3 className="subsection-title">Female-Specific Questions</h3>
                
                <div className="radio-section">
                  <label className="input-label">Have you ever taken oral contraceptives?</label>
                  <RadioGroup
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                    value={contraceptives}
                    onChange={setContraceptives}
                    name="contraceptives"
                  />
                </div>
                
                <div className="radio-section">
                  <label className="input-label">Do you currently take hormone therapy?</label>
                  <RadioGroup
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                    value={hormoneTherapy}
                    onChange={setHormoneTherapy}
                    name="hormoneTherapy"
                  />
                </div>
                
                <div className="radio-section">
                  <label className="input-label">History of hypertension during pregnancy?</label>
                  <RadioGroup
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                      { value: 'na', label: 'N/A' }
                    ]}
                    value={pregnancyHypertension}
                    onChange={setPregnancyHypertension}
                    name="pregnancyHypertension"
                  />
                </div>
              </div>
            )}
          </div>

          {/* FAMILY HISTORY Section */}
          <div className="form-section">
            <div className="section-header">
              <Users className="section-icon" size={24} />
              <h2 className="section-title">Family History</h2>
            </div>
            
            <div className="radio-section">
              <label className="input-label">Family history of stroke, hypertension or diabetes?</label>
              <RadioGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={familyHistory}
                onChange={setFamilyHistory}
                name="familyHistory"
              />
            </div>
            
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">How many family members depend on you?</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Number of dependents"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                />
              </div>
            </div>
            
            <div className="radio-section">
              <label className="input-label">Do you currently have medical insurance?</label>
              <RadioGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={insurance}
                onChange={setInsurance}
                name="insurance"
              />
            </div>
          </div>

          {/* PAST HISTORY Section */}
          <div className="form-section">
            <div className="section-header">
              <Clock className="section-icon" size={24} />
              <h2 className="section-title">Past History</h2>
            </div>
            
            <div className="checkbox-grid">
              <CheckBox
                title="Thyroid disease"
                checked={thyroidDisease}
                onPress={() => togglePastCondition("thyroid", setThyroidDisease)}
              />
              
              <CheckBox
                title="CAD/IHD (Heart Disease)"
                checked={heartDisease}
                onPress={() => togglePastCondition("heart", setHeartDisease)}
              />
              
              <CheckBox
                title="Bronchial asthma or OSA"
                checked={asthma}
                onPress={() => togglePastCondition("asthma", setAsthma)}
              />
              
              <CheckBox
                title="Migraine"
                checked={migraine}
                onPress={() => togglePastCondition("migraine", setMigraine)}
              />
            </div>
          </div>

          {/* TIA HISTORY Section */}
          <div className="form-section">
            <div className="section-header">
              <AlertTriangle className="section-icon" size={24} />
              <h2 className="section-title">TIA (Transient Ischemic Attack) History</h2>
            </div>
            <p className="section-description">
              TIA is often called a "mini-stroke" and can be a warning sign for future strokes.
            </p>

            <div className="radio-section">
              <div className="label-with-info">
                <label className="input-label">Have you ever been diagnosed with or experienced a TIA?</label>
                <div className="info-tooltip-container">
                  <Info className="info-tooltip-icon" size={16} />
                  <div className="tooltip">
                    <div className="tooltip-content">
                      <h4>What is a TIA?</h4>
                      <p>
                        A TIA (Transient Ischemic Attack) is often called a "mini-stroke". It causes temporary 
                        symptoms similar to a stroke but typically lasts only a few minutes to hours and doesn't 
                        cause permanent damage. Common signs include sudden weakness, speech difficulties, 
                        vision changes, or severe headache that resolves quickly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <RadioGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={tiaHistory}
                onChange={setTiaHistory}
                name="tiaHistory"
              />
            </div>
              
            {tiaHistory === 'yes' && (
              <>
                <div className="radio-section">
                  <label className="input-label">How many TIA episodes have you experienced?</label>
                  <RadioGroup
                    options={[
                      { value: 'single', label: 'Single episode' },
                      { value: 'multiple', label: 'Multiple episodes (2-5)' },
                      { value: 'frequent', label: 'Frequent (>5)' }
                    ]}
                    value={tiaFrequency}
                    onChange={setTiaFrequency}
                    name="tiaFrequency"
                  />
                </div>
                  
                <div className="radio-section">
                  <label className="input-label">When did your last TIA occur?</label>
                  <RadioGroup
                    options={[
                      { value: 'recent', label: 'Within last 6 months' },
                      { value: 'year', label: '6 months - 1 year ago' },
                      { value: 'years', label: 'More than 1 year ago' }
                    ]}
                    value={lastTiaOccurrence}
                    onChange={setLastTiaOccurrence}
                    name="lastTiaOccurrence"
                  />
                </div>
                  
                <div className="tia-symptoms-section">
                  <label className="input-label">Which symptoms did you experience during your TIA? (Select all that apply)</label>
                  <div className="checkbox-grid">
                    {[
                      'Sudden weakness or numbness in face, arm, or leg',
                      'Sudden confusion or trouble understanding',
                      'Sudden trouble speaking or slurred speech',
                      'Sudden vision problems in one or both eyes',
                      'Sudden severe headache',
                      'Sudden trouble walking or loss of balance',
                      'Sudden dizziness or coordination problems'
                    ].map((symptom) => (
                      <CheckBox
                        key={symptom}
                        title={symptom}
                        checked={tiaSymptoms.includes(symptom)}
                        onPress={() => toggleTiaSymptom(symptom)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* SYMPTOMS Section */}
          <div className="form-section">
            <div className="section-header">
              <AlertTriangle className="section-icon" size={24} />
              <h2 className="section-title">Symptoms</h2>
            </div>
            <p className="section-description">Have you experienced any of the following symptoms?</p>
            
            <div className="checkbox-grid">
              {[
                'Loss of balance or coordination', 
                'Sudden vision changes, such as blurred vision or loss of vision in one or both eyes', 
                'Tingling, numbness in the limbs', 
                'Sudden weakness or heaviness of the limbs or facial weakness', 
                'Difficulty speaking, slurred speech, or trouble understanding speech', 
                'Severe headache with no known cause', 
                'Repeated episodes of giddiness/early morning dizziness', 
                'Frequent episodes of severe fatigue'
              ].map((symptom) => (
                <CheckBox
                  key={symptom}
                  title={symptom}
                  checked={symptoms.includes(symptom)}
                  onPress={() => toggleSymptom(symptom)}
                />
              ))}
            </div>
          </div>

          {/* Calculate Risk Button */}
          <div className="submit-section">
            <button 
              className="calculate-button"
              onClick={handleSubmit}
            >
              <Heart className="button-icon" size={20} />
              Calculate Risk Score
            </button>
          </div>
        </div>

        {/* Risk Result Modal */}
        {resultModalVisible && (
          <div className="modal-overlay" onClick={() => setResultModalVisible(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <Info className="modal-icon" size={32} />
                <h2 className="modal-title">Stroke Risk Assessment Result</h2>
              </div>
              
              <div className="modal-body">
                <div className="risk-score">
                  <span className="score-label">Risk Score</span>
                  <span className="score-value">{riskScore}</span>
                </div>
                
                <div className={`risk-category ${riskCategory.toLowerCase()}-risk`}>
                  <span className="category-label">Risk Category</span>
                  <span className="category-value">{riskCategory}</span>
                </div>
                
                <div className="recommendations">
                  <h3>Recommendations</h3>
                  <p>{recommendations}</p>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  className="modal-close-button"
                  onClick={() => setResultModalVisible(false)}
                >
                  Close Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
        }

        .app-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .app-header {
          text-align: center;
          margin-bottom: 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .header-icon {
          color: #ff6b6b;
          margin-bottom: 16px;
          filter: drop-shadow(0 4px 8px rgba(255, 107, 107, 0.3));
        }

        .app-title {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 12px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .app-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 300;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .section-icon {
          color: #667eea;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .section-description {
          color: #718096;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .input-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group.full-width {
          grid-column: 1 / -1;
        }

        .input-label {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.bmi-input {
          background: #f7fafc;
          font-weight: 600;
          color: #4a5568;
        }

        .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .radio-section {
          margin-bottom: 20px;
        }

        .radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          min-width: 100px;
        }

        .radio-option:hover {
          border-color: #cbd5e0;
          background: #f7fafc;
        }

        .radio-option.selected {
          border-color: #667eea;
          background: #eef2ff;
          color: #667eea;
        }

        .radio-input {
          margin: 0;
        }

        .radio-label {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .medical-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .female-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #fed7d7;
          background: #fef5e7;
          border-radius: 12px;
          padding: 20px;
        }

        .subsection-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #d69e2e;
          margin-bottom: 16px;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 12px;
        }

        .checkbox-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .checkbox-item:hover {
          border-color: #cbd5e0;
          background: #f7fafc;
        }

        .checkbox-item.checked {
          border-color: #48bb78;
          background: #f0fff4;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .checkbox-icon {
          color: #48bb78;
          opacity: 0;
          transition: opacity 0.3s ease;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .checkbox-icon.visible {
          opacity: 1;
        }

        .checkbox-label {
          font-size: 0.9rem;
          line-height: 1.4;
          color: #2d3748;
        }
        .tia-symptoms-section {
          margin-top: 20px;
          padding: 20px;
          background: #fef5e7;
          border-radius: 12px;
          border-left: 4px solid #d69e2e;
        }

        .label-with-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-tooltip-container {
          position: relative;
          display: inline-block;
        }

        .info-tooltip-icon {
          color: #667eea;
          cursor: help;
          transition: color 0.3s ease;
        }

        .info-tooltip-icon:hover {
          color: #5a67d8;
        }

        .tooltip {
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          visibility: hidden;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 100;
          pointer-events: none;
        }

        .info-tooltip-container:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }

        .tooltip-content {
          background: #2d3748;
          color: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          width: 300px;
          position: relative;
        }

        .tooltip-content::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 8px solid transparent;
          border-top-color: #2d3748;
        }

        .tooltip-content h4 {
          color: #e2e8f0;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .tooltip-content p {
          color: #cbd5e0;
          line-height: 1.4;
          font-size: 0.8rem;
          margin: 0;
        }

        .submit-section {
          text-align: center;
          margin-top: 40px;
          padding: 30px;
        }

        .calculate-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
        }

        .calculate-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
        }

        .calculate-button:active {
          transform: translateY(0);
        }

        .button-icon {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 30px 30px 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .modal-icon {
          color: #667eea;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .modal-body {
          padding: 30px;
        }

        .risk-score {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f7fafc;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .score-label {
          font-weight: 600;
          color: #4a5568;
        }

        .score-value {
          font-size: 2rem;
          font-weight: 800;
          color: #2d3748;
        }

        .risk-category {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .low-risk {
          background: linear-gradient(135deg, #c6f6d5, #9ae6b4);
          color: #22543d;
        }

        .moderate-risk {
          background: linear-gradient(135deg, #fef5e7, #fbd38d);
          color: #7b341e;
        }

        .high-risk {
          background: linear-gradient(135deg, #fed7d7, #feb2b2);
          color: #742a2a;
        }

        .category-label {
          font-weight: 600;
        }

        .category-value {
          font-size: 1.3rem;
          font-weight: 800;
        }

        .recommendations {
          background: #eef2ff;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .recommendations h3 {
          color: #2d3748;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .recommendations p {
          color: #4a5568;
          line-height: 1.6;
        }

        .modal-footer {
          padding: 20px 30px 30px;
          text-align: center;
        }

        .modal-close-button {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close-button:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 10px;
          }

          .app-title {
            font-size: 2rem;
          }

          .input-grid {
            grid-template-columns: 1fr;
          }

          .radio-group {
            flex-direction: column;
          }

          .checkbox-grid {
            grid-template-columns: 1fr;
          }

          .medical-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            margin: 10px;
            max-height: 95vh;
          }
        }
      `}</style>
    </>
  );
};

export default StrokeRiskAssessmentScreen;