import { useState, useEffect } from 'react';
import { Download, FileText, Shield, Clock, User, AlertCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import React from 'react';
import logo from '../components/logo1.png';
import qrcode from '../components/qr_code.png';
import payqr from '../components/payqr.jpg';
import { storage } from '../firebase/firebase'; // ✅ Correct import path
import { db } from '../firebase/firebase';
import { collection, getDocs,where, query, orderBy } from 'firebase/firestore';

const Report = () => {
  const [token, setToken] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [doctorNote, setDoctorNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportStatus, setReportStatus] = useState('ready'); // ready, loading, generating, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      fetchPatientByToken(tokenFromUrl);
    } else {
      setErrorMessage('No token provided in URL');
      setReportStatus('error');
      setIsLoading(false);
    }
  }, []);

  // Replace the existing fetchPatientByToken function with this:
  const fetchPatientByToken = async (tokenNumber) => {
    setIsLoading(true);
    setReportStatus('loading');
    
    try {
      // Query Firebase for patient with matching token
      const patientsRef = collection(db, 'patients');
      const patientQuery = query(patientsRef, where('tokenNumber', '==', tokenNumber));
      const patientSnapshot = await getDocs(patientQuery);

      if (patientSnapshot.empty) {
        throw new Error(`Patient not found with token: ${tokenNumber}`);
      }

      // Get the first matching patient document
      const patientDoc = patientSnapshot.docs[0];
      const patientData = { id: patientDoc.id, ...patientDoc.data() };

      // Query Firebase for assessment with matching token
      const assessmentsRef = collection(db, 'medical_assessments');
      const assessmentQuery = query(assessmentsRef, where('tokenNumber', '==', tokenNumber));
      const assessmentSnapshot = await getDocs(assessmentQuery);

      let assessmentData = null;
      if (!assessmentSnapshot.empty) {
        const assessmentDoc = assessmentSnapshot.docs[0];
        assessmentData = { id: assessmentDoc.id, ...assessmentDoc.data() };
      }

      // Set the patient and assessment data
      if (patientData) {
        setSelectedPatient(patientData);
        setSelectedAssessment(assessmentData);
        setDoctorNote(assessmentData?.doctorNote || '');
        setReportStatus('ready');
      } else {
        throw new Error('Invalid patient data received');
      }

    } catch (error) {
      console.error('Error fetching patient and assessment from Firebase:', error);
      setErrorMessage(`Failed to load patient data: ${error.message}`);
      setReportStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed generateChartImages function
const generateChartImages = async (patient, assessment, riskFactors) => {
  // Function to categorize risk factors
  const categorizeRiskFactors = (riskFactors) => {
    const categories = {
      Clinical: [],
      Lifestyle: [],
      Background: []
    };

    const clinicalFactors = ['Hypertension', 'Diabetes', 'High Cholesterol', 'Heart Disease', 'Atrial Fibrillation', 'Previous Stroke/TIA', 'Carotid Artery Disease'];
    const lifestyleFactors = ['Smoking', 'Physical Inactivity', 'Obesity', 'Excessive Alcohol', 'Poor Diet'];
    const backgroundFactors = ['Age > 65', 'Male Gender', 'Family History', 'Race/Ethnicity'];

    riskFactors.forEach(factor => {
      if (clinicalFactors.some(cf => factor.toLowerCase().includes(cf.toLowerCase()))) {
        categories.Clinical.push(factor);
      } else if (lifestyleFactors.some(lf => factor.toLowerCase().includes(lf.toLowerCase()))) {
        categories.Lifestyle.push(factor);
      } else {
        categories.Background.push(factor);
      }
    });

    return categories;
  };

  // Function to assign impact scores to risk factors
  const getRiskFactorImpacts = (riskFactors) => {
    const impactMap = {
      // Hypertension scoring
            'Controlled Hypertension': 2,
            'Uncontrolled Hypertension': 3,
            
            // Diabetes scoring
            'Controlled Diabetes': 1,
            'Uncontrolled Diabetes': 2,
            
            // Lipid profile scoring
            'Borderline Lipid Profile': 1,
            'High Risk Lipid Profile': 2,
            
            // Other clinical factors
            'Atrial Fibrillation': 2,
            'History of TIA': 2,
            
            // Lifestyle factors
            'Smoking/Tobacco': 1,
            'Alcohol Abuse': 1,
            'High Stress': 1,
            'Lack of Exercise': 1,
            'High BMI': 1,
            'Sleep Deprivation': 1,
            
            // Background factors
            'Age > 60': 1,
            'Poor Air Quality': 1,
            'Family History': 2
    };

    return riskFactors.map(factor => {
      // Find matching impact score
      const matchingKey = Object.keys(impactMap).find(key => 
        factor.toLowerCase().includes(key.toLowerCase())
      );
      return {
        factor: factor,
        impact: matchingKey ? impactMap[matchingKey] : 1
      };
    }).filter(item => item.impact > 0); // Filter out risk factors with 0 impact score
  };

  const riskFactorImpacts = getRiskFactorImpacts(riskFactors);
  const filteredRiskFactors = riskFactorImpacts.map(item => item.factor);
  const categories = categorizeRiskFactors(filteredRiskFactors);

  if (riskFactorImpacts.length === 0) {
    return {
      chart1Image: null,
      chart2Image: null,
      message: "No risk factors with impact scores greater than 0 found."
    };
  }

  // Create canvas elements with explicit styling
  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');
  canvas1.width = 400;
  canvas1.height = 400;
  canvas2.width = 400;
  canvas2.height = 400;
  
  // IMPORTANT: Set canvas background to white
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  
  // Fill canvas with white background before creating charts
  ctx1.fillStyle = 'white';
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
  ctx2.fillStyle = 'white';
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

  // Build category data arrays simultaneously
  const categoryData = [];
  const categoryLabels = [];
  const categoryColors = [];
  
  if (categories.Clinical.length > 0) {
    categoryData.push(categories.Clinical.length);
    categoryLabels.push('Clinical');
    categoryColors.push('#dc2626');
  }
  if (categories.Lifestyle.length > 0) {
    categoryData.push(categories.Lifestyle.length);
    categoryLabels.push('Lifestyle');
    categoryColors.push('#f59e0b');
  }
  if (categories.Background.length > 0) {
    categoryData.push(categories.Background.length);
    categoryLabels.push('Background');
    categoryColors.push('#2563eb');
  }

  let chart1 = null;
  if (categoryData.length > 0) {
    chart1 = new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryData,
          backgroundColor: categoryColors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        animation: {
          duration: 0 // Disable animations for cleaner export
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Risk Factors by Category',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: 20
          }
        }
      }
    });
  }

  // Chart 2: Risk Factor Impact Scores
  const impactLabels = riskFactorImpacts.map(item => item.factor);
  const impactData = riskFactorImpacts.map(item => item.impact);
  
  const impactColors = impactData.map(impact => {
    switch(impact) {
        case 4: return '#dc2626'; 
        case 3: return '#f59e0b'; 
        case 2: return '#10b981'; 
        case 1: return '#3b82f6'; 
        default: return '#8b5cf6'; 
      }
  });

  let chart2 = null;
  if (impactData.length > 0) {
    chart2 = new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: impactLabels,
        datasets: [{
          data: impactData,
          backgroundColor: impactColors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        animation: {
          duration: 0 // Disable animations for cleaner export
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 12
              },
              padding: 15,
              generateLabels: function(chart) {
                const data = chart.data;
                return data.labels.map((label, index) => ({
                  text: `${label} (${data.datasets[0].data[index]})`,
                  fillStyle: data.datasets[0].backgroundColor[index],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth
                }));
              }
            }
          },
          title: {
            display: true,
            text: 'Risk Factor Impact Scores (1-4)',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: 20
          }
        }
      }
    });
  }

  // Wait longer for charts to fully render
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Alternative approach: Force chart updates before export
  if (chart1) {
    chart1.update('none'); // Update without animation
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (chart2) {
    chart2.update('none'); // Update without animation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Convert charts to base64 images with higher quality
  const chart1Image = chart1 ? canvas1.toDataURL('image/png', 1.0) : null;
  const chart2Image = chart2 ? canvas2.toDataURL('image/png', 1.0) : null;

  // Clean up
  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();

  return { 
    chart1Image, 
    chart2Image,
    hasValidData: riskFactorImpacts.length > 0,
    filteredRiskFactorsCount: riskFactorImpacts.length
  };
};

const extractRiskFactors = (patient, assessment) => {
    const riskFactors = []; // Change to flat array

    const age = Number(patient.age);
    const bmi = Number(patient.bmi);
    const hba1c = Number(assessment.hba1c);
    const rbs = Number(assessment.rbs);
    const cholesterol = Number(assessment.cholesterol);
    const ldl = Number(patient.ldl);
    const hdl = Number(patient.hdl);
    const aqi = Number(patient.aqi);
    const sleep = Number(assessment.sleepHours);
    const stress = Number(assessment.stressLevel);
    const bp = patient.bloodPressure?.split('/');
    const systolic = bp && bp.length === 2 ? parseInt(bp[0]) : 0;
    const diastolic = bp && bp.length === 2 ? parseInt(bp[1]) : 0;

    // Smoking/Tobacco consumption
    if (assessment.smoke === 'yes') riskFactors.push("Smoking/Tobacco");
    
    // Hypertension - differentiate controlled vs uncontrolled
    if (systolic >= 160 || diastolic >= 100) {
        riskFactors.push("Uncontrolled Hypertension");
    } else if (systolic > 140 || diastolic > 90) {
        riskFactors.push("Controlled Hypertension");
    }
    
    // Age factor
    if (age > 60) riskFactors.push("Age > 60");
    
    // Alcohol abuse
    if (['daily', 'multiple-daily'].includes(assessment.alcoholFrequency)) riskFactors.push("Alcohol Abuse");
    
    // Atrial fibrillation
    if (assessment.irregularHeartbeat === 'yes') riskFactors.push("Atrial Fibrillation");
    
    // Diabetes - differentiate controlled vs uncontrolled
    if (assessment.diabetes === 'yes' || rbs > 160) {
        if (hba1c >= 7) {
            riskFactors.push("Uncontrolled Diabetes");
        } else if (hba1c > 0) {
            riskFactors.push("Controlled Diabetes");
        } else {
            riskFactors.push("Uncontrolled Diabetes"); // Assume uncontrolled if no HbA1c
        }
    }
    
    // Lipid Profile - differentiate borderline vs high risk
    const hasHighCholesterol = cholesterol > 240;
    const hasHighLDL = ldl > 160;
    const hasLowHDL = hdl < 40;
    const hasBorderlineCholesterol = cholesterol > 200 && cholesterol <= 240;
    const hasBorderlineLDL = ldl > 100 && ldl <= 160;
    const hasBorderlineHDL = hdl >= 40 && hdl < 60;
    
    if (hasHighCholesterol || hasHighLDL || hasLowHDL) {
        riskFactors.push("High Risk Lipid Profile");
    } else if (hasBorderlineCholesterol || hasBorderlineLDL || hasBorderlineHDL) {
        riskFactors.push("Borderline Lipid Profile");
    }
    
    // High stress levels (PSS 3-4)
    if (stress >= 3) riskFactors.push("High Stress");
    
    // No exercise
    if (assessment.exercise === 'no') riskFactors.push("Lack of Exercise");
    
    // BMI >30 (obesity)
    if (bmi > 30) riskFactors.push("High BMI");
    
    // History of TIA
    if (assessment.tiaHistory === 'yes') riskFactors.push("History of TIA");
    
    // Sleep deprivation
    if (sleep < 6) riskFactors.push("Sleep Deprivation");
    
    // Air pollution - revised threshold for semi-rural settings
    if (aqi > 150) riskFactors.push("Poor Air Quality");
    
    // Family history
    if (assessment.familyHistory === 'yes') riskFactors.push("Family History");

    return riskFactors; // Return flat array
};

  const handleGenerateReport = async () => {
    if (!token) {
      setErrorMessage('Invalid access token');
      setReportStatus('error');
      return;
    }

    setIsGenerating(true);
    setReportStatus('generating');
    setErrorMessage('');

    try {
              // Determine chart section content based on whether we have valid data
              const patient = selectedPatient;
              const assessment = selectedAssessment;
              const riskFactors = extractRiskFactors(patient, assessment);
              const note = doctorNote || "No specific recommendations provided at this time.";
              const logoUrl = logo;
              const timestamp = new Date().toLocaleString();
    
              // Add your WhatsApp community QR code URL here
              const whatsappQRCodeUrl = qrcode; // Replace with actual QR code URL
              const donationQRCodeUrl = payqr;
    
              // Generate chart images (same as generatePDF function)
              const { chart1Image, chart2Image, hasValidData, filteredRiskFactorsCount } = await generateChartImages(patient, assessment, riskFactors);
    
              // Sanitize patient name for filename
              const sanitizedPatientName = patient.name.replace(/[^a-zA-Z0-9]/g, '_');
              const fileName = `${sanitizedPatientName}_Brainline_Report_${Date.now()}.pdf`;
    
              // Create and style PDF content
              const pdfContainer = document.createElement('div');
              pdfContainer.style.fontFamily = 'Arial, sans-serif';
              pdfContainer.style.fontSize = '14px';
              pdfContainer.style.lineHeight = '1.5';
              pdfContainer.style.color = '#333';
              pdfContainer.style.padding = '20px';
              pdfContainer.style.backgroundColor = 'white';
    
              // Determine chart section content based on whether we have valid data
              let chartSectionHTML = '';
              if (hasValidData && chart1Image && chart2Image) {
                chartSectionHTML = `
                  <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1f2937; padding-bottom: 3px;">Risk Factor Analysis</h3>
                    <div style="display: flex; justify-content: space-between; gap: 20px;">
                      <div style="width: 48%; text-align: center;">
                        <img src="${chart1Image}" style="width: 100%; max-width: 300px; height: auto; border: 1px solid #e5e7eb; border-radius: 8px;" alt="Risk Factors by Category">
                      </div>
                      <div style="width: 48%; text-align: center;">
                        <img src="${chart2Image}" style="width: 100%; max-width: 300px; height: auto; border: 1px solid #e5e7eb; border-radius: 8px;" alt="Risk Factor Impact Scores">
                      </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 11px; color: #666; text-align: center;">
                      <p style="margin: 5px 0;"><strong>Left:</strong> Distribution of risk factors across Clinical, Lifestyle, and Background categories</p>
                      <p style="margin: 5px 0;"><strong>Right:</strong> Individual risk factor impact scores</p>
                    </div>
                  </div>
                `;
              } else {
                chartSectionHTML = `
                  <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1f2937; padding-bottom: 3px;">Risk Factor Analysis</h3>
                    <div style="background: #f9fafb; border: 2px dashed #d1d5db; padding: 30px; text-align: center; border-radius: 8px;">
                      <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        <strong>No significant risk factors detected</strong><br>
                        All identified risk factors have minimal impact scores (≤ 0). This indicates a lower risk profile.
                      </p>
                    </div>
                  </div>
                `;
              }
    
              // Enhanced PDF content with comprehensive Purva Medical Trust details
              pdfContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #2563eb; padding-bottom: 8px;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: white; font-weight: bold; font-size: 20px; overflow: hidden;">
                <img src="${logoUrl}" 
                     alt="Brainline Logo" 
                     style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;" 
                     crossorigin="anonymous"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='BL';" />
              </div>
              <div style="text-align: left;">
                <h1 style="margin: 0; color: #2563eb; font-size: 24px; font-weight: bold;">BRAINLINE</h1>
                <p style="margin: 2px 0; font-size: 14px; color: #666; font-weight: 500;">Purva Medical Trust</p>
                <p style="margin: 2px 0; font-size: 12px; color: #888;">A Mission to Spread Stroke Prevention Awareness</p>
              </div>
            </div>
            <h2 style="margin: 10px 0 0 0; color: #1f2937; font-size: 22px; font-weight: 600;">Brain Stroke Risk Assessment Report</h2>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Generated on ${timestamp}</p>
          </div>
    
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div style="width: 48%;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; padding-bottom: 3px;">Patient Information</h3>
              <table style="width: 100%; font-size: 13px;">
                <tr><td style="padding: 3px 0;"><strong>Name:</strong></td><td>${patient.name}</td></tr>
                <tr><td style="padding: 3px 0;"><strong>Token:</strong></td><td>${patient.tokenNumber}</td></tr>
                <tr><td style="padding: 3px 0;"><strong>Age/Gender:</strong></td><td>${patient.age} / ${patient.gender}</td></tr>
                <tr><td style="padding: 3px 0;"><strong>Phone:</strong></td><td>${patient.phone}</td></tr>
                <tr><td style="padding: 3px 0;"><strong>Location:</strong></td><td>${patient.locality}</td></tr>
              </table>
            </div>
    
            <div style="width: 48%;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; padding-bottom: 3px;">Risk Assessment</h3>
              <div style="background: ${assessment.riskAssessment?.riskCategory === 'High Risk' ? '#fef2f2' : '#fff7ed'}; 
                          border: 2px solid ${assessment.riskAssessment?.riskCategory === 'High Risk' ? '#dc2626' : '#f59e0b'}; 
                          padding: 15px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="font-size: 18px; font-weight: bold; color: ${assessment.riskAssessment?.riskCategory === 'High Risk' ? '#dc2626' : '#f59e0b'};">
                  ${assessment.riskAssessment?.riskCategory || 'N/A'}
                </div>
                <div style="font-size: 14px; margin-top: 5px;">Risk Score: ${assessment.riskAssessment?.riskScore || 'N/A'}</div>
              </div>
            </div>
          </div>
    
          <div style="margin-bottom: 15px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; padding-bottom: 3px;">Vital Signs & Key Tests</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 12px;">
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">BP</div>
                <div>${patient.bloodPressure}</div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">BMI</div>
                <div>${patient.bmi}</div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">RBS</div>
                <div>${patient.rbs || 'N/A'}</div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">HbA1c</div>
                <div>${patient.hba1c || 'N/A'}</div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">Cholesterol</div>
                <div>${patient.cholesterol || 'N/A'}</div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">HDL/LDL</div>
                <div>${patient.hdl}/${patient.ldl}</div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">Hemoglobin</div>
                <div>${patient.hemoglobin || 'N/A'}</div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
                <div style="font-weight: bold; margin-bottom: 4px;">Platelets</div>
                <div>${patient.platelets || 'N/A'}</div>
              </div>
            </div>
          </div>
    
          ${chartSectionHTML}
    
          <!-- PAGE BREAK - Forces new page before Risk Factor Analysis -->
          <div style="page-break-before: always;"></div>
    
          <div style="margin-bottom: 15px; page-break-inside: avoid;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; padding-bottom: 3px;">Risk Factors</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 12px;">
              ${riskFactors.map(factor => `
                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 6px; text-align: center; display: flex; justify-content: center; align-items: center; min-height: 35px;">
                  ${factor}
                </div>
              `).join('')}
            </div>
          </div>
              
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; padding-bottom: 3px;">Doctor's Recommendation</h3>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; font-size: 13px; min-height: 50px; display: flex; align-items: flex-start;">
              <div style="width: 100%;">${assessment.doctorRecommendation}</div>
            </div>
          </div>
              
          <!-- Disclaimer -->
          <div style="margin-bottom: 20px; background: #fffbeb; border: 2px solid #f59e0b; padding: 15px; border-radius: 8px; page-break-inside: avoid;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #92400e; display: flex; align-items: center;">
              <span style="margin-right: 8px;">⚠️</span>
              Important Disclaimer
            </h3>
            <div style="font-size: 12px; color: #78350f; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;">
                <strong>Risk Assessment Period:</strong> This Brainline Riskometer assessment estimates your stroke risk over the next <strong>5 years</strong> based on current risk factors. This timeframe is chosen because most risk factors (hypertension, diabetes, cholesterol levels) are dynamic and can be improved through lifestyle changes and medical intervention.
              </p>
              <p style="margin: 0 0 10px 0;">
                <strong>Clinical Limitations:</strong> This assessment is a screening tool and should not replace professional medical consultation. Individual risk may vary based on factors not captured in this assessment.
              </p>
              <p style="margin: 0;">
                <strong>Action Required:</strong> Consult with your healthcare provider to discuss these results and develop an appropriate prevention strategy tailored to your specific health profile.
              </p>
            </div>
          </div>
    
          <!-- PAGE BREAK - Forces new page before Social Media Section -->
          <div style="page-break-before: always;"></div>
    
          <!-- Enhanced Footer with Purva Medical Trust Details - NEW PAGE -->
          <div style="border-top: 2px solid #2563eb; padding-top: 20px; margin-top: 15px; background: #f8fafc; padding: 15px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 15px;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2563eb; font-weight: bold;">About Purva Medical Trust</h3>
              <p style="margin: 0 0 15px 0; font-size: 12px; color: #666; line-height: 1.5;">
                Purva Medical Trust is committed to spreading stroke prevention awareness and improving healthcare accessibility. 
                Our mission is to empower individuals with knowledge and tools for better health outcomes.
              </p>
            </div>
    
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
              <!-- Contact & Website Section -->
              <div style="text-align: center;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1f2937; font-weight: bold;">🌐 Online Resources</h4>
                <div style="font-size: 12px; color: #666; line-height: 1.8;">
                  <p style="margin: 2px 0;"><strong>Official Website:</strong><br>
                     <a href="https://brainline.info/" style="color: #2563eb; text-decoration: none; font-weight: 500;">brainline.info</a>
                  </p>
                  <p style="margin: 2px 0;"><strong>Email:</strong><br>
                     <a href="mailto:contact@brainline.info" style="color: #2563eb; text-decoration: none;">contact@brainline.info</a>
                  </p>
                </div>
              </div>
    
              <!-- Social Media & Content Section -->
              <div style="text-align: center;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1f2937; font-weight: bold;">📱 Follow Us</h4>
                <div style="font-size: 12px; color: #666; line-height: 1.8;">
                  <p style="margin: 2px 0;"><strong>YouTube Channel:</strong><br>
                     <a href="https://youtube.com/@BrainlinePodcast" style="color: #2563eb; text-decoration: none;">@BrainlinePodcast</a>
                  </p>
                  <p style="margin: 2px 0;"><strong>Instagram Page:</strong><br>
                     <a href="https://www.instagram.com/brainline.info/" style="color: #2563eb; text-decoration: none;">@brainlineinfo</a>
                  </p>
                </div>
              </div>
            </div>
    
            <!-- WhatsApp Community QR Code Section -->
            <div style="background: #ffffff; border: 2px solid #25d366; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <h4 style="margin: 0 0 15px 0; font-size: 16px; color: #25d366; font-weight: bold;">
                💬 Join Our WhatsApp Community
              </h4>
              <div style="display: flex; justify-content: center; align-items: center; gap: 30px;">
                <div style="text-align: center;">
                  <img src="${whatsappQRCodeUrl}" 
                       alt="WhatsApp Community QR Code" 
                       style="width: 120px; height: 120px; border: 2px solid #25d366; border-radius: 8px;" 
                       crossorigin="anonymous"
                       onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;width: 120px; height: 120px; background: #f0f0f0; border: 2px solid #25d366; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666;&quot;>QR Code<br>Not Available</div>';" />
                  <p style="margin: 8px 0 0 0; font-size: 10px; color: #666;">Scan to join</p>
                </div>
                <div style="text-align: left; flex: 1; max-width: 300px;">
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #333; line-height: 1.6;">
                    <strong>Join our health community for:</strong>
                  </p>
                  <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #666; line-height: 1.6;">
                    <li>Daily health tips & reminders</li>
                    <li>Expert medical advice</li>
                    <li>Stroke prevention updates</li>
                    <li>Community support & discussions</li>
                    <li>Live Q&A sessions with doctors</li>
                  </ul>
                </div>
              </div>
            </div>
    
            <!-- Donation Support QR Code Section -->
            <div style="background: #ffffff; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <h4 style="margin: 0 0 15px 0; font-size: 16px; color: #f59e0b; font-weight: bold;">
                🤝 Support Our Mission
              </h4>
              <div style="display: flex; justify-content: center; align-items: center; gap: 30px;">
                <div style="text-align: center;">
                  <img src="${donationQRCodeUrl}" 
                       alt="Donation QR Code" 
                       style="width: 120px; height: 120px; border: 2px solid #f59e0b; border-radius: 8px;" 
                       crossorigin="anonymous"
                       onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;width: 120px; height: 120px; background: #f0f0f0; border: 2px solid #f59e0b; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666;&quot;>Donation QR<br>Not Available</div>';" />
                  <p style="margin: 8px 0 0 0; font-size: 10px; color: #666;">Scan to donate</p>
                </div>
                <div style="text-align: left; flex: 1; max-width: 300px;">
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #333; line-height: 1.6;">
                    <strong>Help us expand our reach:</strong>
                  </p>
                  <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #666; line-height: 1.6;">
                    <li>Fund free health screenings</li>
                    <li>Support medical equipment</li>
                    <li>Sponsor awareness campaigns</li>
                    <li>Enable rural healthcare access</li>
                    <li>Train healthcare volunteers</li>
                  </ul>
                  <p style="margin: 10px 0 0 0; font-size: 11px; color: #f59e0b; font-weight: bold;">
                    Every contribution makes a difference! 🙏
                  </p>
                </div>
              </div>
            </div>
    
            <!-- Educational Content Section -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1f2937; font-weight: bold; text-align: center;">📚 Educational Resources Available</h4>
              <div style="font-size: 11px; color: #666; text-align: center; line-height: 1.6;">
                <p style="margin: 5px 0;">✓ Stroke Prevention Guides &nbsp;&nbsp; ✓ Healthy Lifestyle Tips &nbsp;&nbsp; ✓ Risk Assessment Tools</p>
                <p style="margin: 5px 0;">✓ Expert Interviews &nbsp;&nbsp; ✓ Patient Success Stories &nbsp;&nbsp; ✓ Medical Q&A Sessions</p>
                <p style="margin: 5px 0; font-style: italic;">Visit our website and subscribe to our channel for regular health updates!</p>
              </div>
            </div>
    
            <!-- Social Media Links Grid -->
            <div style="text-align: center; margin-bottom: 15px;">
              <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #1f2937; font-weight: bold;">Connect With Us</h4>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 11px;">
                <div style="background: #3b82f6; color: white; padding: 8px; border-radius: 4px; text-align: center;">
                  <div style="font-weight: bold; margin-bottom: 2px;">Facebook</div>
                  <div style="font-size: 10px;">@PurvaMedicalTrust</div>
                </div>
                <div style="background: #1da1f2; color: white; padding: 8px; border-radius: 4px; text-align: center;">
                  <div style="font-weight: bold; margin-bottom: 2px;">Twitter</div>
                  <div style="font-size: 10px;">@BrainlineInfo</div>
                </div>
                <div style="background: #0e76a8; color: white; padding: 8px; border-radius: 4px; text-align: center;">
                  <div style="font-weight: bold; margin-bottom: 2px;">LinkedIn</div>
                  <div style="font-size: 10px;">Purva Medical Trust</div>
                </div>
                <div style="background: #25d366; color: white; padding: 8px; border-radius: 4px; text-align: center;">
                  <div style="font-weight: bold; margin-bottom: 2px;">WhatsApp</div>
                  <div style="font-size: 10px;">Health Updates</div>
                </div>
              </div>
            </div>
    
            <!-- Report Generation Info -->
            <div style="text-align: center; font-size: 11px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 5px;">
              <p style="margin: 0 0 5px 0;">Report generated by <strong>Dr. Ashok Hande</strong> | Neurosurgeon, Purva Medical Trust</p>
              <p style="margin: 0 0 5px 0;"><strong>For medical consultations:</strong> Schedule an appointment through our website</p>
              <p style="margin: 0; font-style: italic;">This report is part of our commitment to preventive healthcare and community wellness.</p>
            </div>
          </div>
              `;
    
              // Append to body temporarily
              document.body.appendChild(pdfContainer);
    
              const pdfOptions = {
                margin: [10, 10, 10, 5],
                filename: `${patient.name}_Stroke_Risk_Report.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                  scale: 2,
                  useCORS: true,
                  letterRendering: true
                },
                jsPDF: {
                  unit: 'mm',
                  format: 'a4',
                  orientation: 'portrait'
                }
              };
    
              html2pdf().set(pdfOptions).from(pdfContainer).save().then(() => {
                // Clean up
                document.body.removeChild(pdfContainer);
              }).catch(error => {
                console.error('PDF generation failed:', error);
                document.body.removeChild(pdfContainer);
                showModal('error', 'PDF Generation Failed', 'Failed to generate PDF. Please try again.');
              });
    
          } catch (error) {
              console.error('Error generating charts or PDF:', error);
              showModal('error', 'PDF Generation Failed', 'Failed to generate charts for PDF. Please try again.');
          }
      };

  const getStatusMessage = () => {
    switch (reportStatus) {
      case 'generating':
        return 'Generating your medical report...';
      case 'success':
        return 'Report generated successfully!';
      case 'error':
        return errorMessage || 'Something went wrong';
      default:
        return 'Click below to generate and download your report';
    }
  };

  const getStatusColor = () => {
    switch (reportStatus) {
      case 'generating':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
        {/* Tailwind CSS CDN */}
          <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full p-8 relative overflow-hidden">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img 
                 src={logo} 
                 alt="Brainline Logo" 
                 className="w-28 h-28 lg:w-24 lg:h-24 object-contain"
               />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">BRAINLINE</h1>
          <p className="text-gray-600 text-sm font-medium">Purva Medical Trust</p>
          <p className="text-gray-500 text-xs italic">A Mission to Spread Stroke Prevention Awareness</p>
        </div>

        {/* Main Layout - Desktop: 3 columns, Mobile: stacked */}
        <div className="space-y-6 mb-8">
          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
            {/* Left QR Code - WhatsApp Community */}
            <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-200">
              <div className="w-48 h-48 bg-white rounded-xl shadow-lg mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://chat.whatsapp.com/your-group-link" 
                  alt="WhatsApp QR"
                  className="w-44 h-44 rounded-lg"
                />
              </div>
              <h3 className="text-green-700 font-bold text-lg mb-2">Join Our Community</h3>
              <p className="text-green-600 text-sm mb-3">Connect with other patients and families</p>
              <div className="bg-green-100 rounded-lg p-3">
                <p className="text-green-800 font-medium text-sm">WhatsApp Support Group</p>
                <p className="text-green-700 text-xs">24/7 Community Support</p>
              </div>
            </div>

            {/* Center - Download Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-blue-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Medical Report</h2>
              </div>

              {/* Token Display */}
              {token && (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
                  <p className="text-xs text-gray-500 mb-2">Access Token:</p>
                  <p className="font-mono text-sm font-bold text-gray-700 break-all bg-gray-50 p-2 rounded">{token}</p>
                </div>
              )}

              {/* Status Message */}
              <p className={`text-sm mb-6 text-center font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </p>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !token}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                  isGenerating || !token
                    ? 'bg-gray-400 cursor-not-allowed'
                    : reportStatus === 'success'
                    ? 'bg-green-500 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-1'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:-translate-y-1'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : reportStatus === 'success' ? (
                  <>
                    <Download className="w-6 h-6" />
                    Download Complete
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    Generate Report
                  </>
                )}
              </button>

              {/* Security Features */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-blue-700 font-medium text-xs">Secure Access</p>
                  <p className="text-blue-600 text-xs">Token Protected</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-green-700 font-medium text-xs">One-Time Use</p>
                  <p className="text-green-600 text-xs">Privacy Assured</p>
                </div>
              </div>
            </div>

            {/* Right QR Code - Donation */}
            <div className="bg-orange-50 rounded-2xl p-6 text-center border-2 border-orange-200">
              <div className="w-48 h-48 bg-white rounded-xl shadow-lg mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://your-donation-link.com" 
                  alt="Donation QR"
                  className="w-44 h-44 rounded-lg"
                />
              </div>
              <h3 className="text-orange-700 font-bold text-lg mb-2">Support Our Mission</h3>
              <p className="text-orange-600 text-sm mb-3">Help us spread stroke prevention awareness</p>
              <div className="bg-orange-100 rounded-lg p-3">
                <p className="text-orange-800 font-medium text-sm">Secure Donation Portal</p>
                <p className="text-orange-700 text-xs">Every contribution matters</p>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Stacked vertically */}
          <div className="lg:hidden space-y-6">
            {/* Mobile - Download Section First */}
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Medical Report</h2>
              </div>

              {/* Token Display */}
              {token && (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Access Token:</p>
                  <p className="font-mono text-xs font-bold text-gray-700 break-all bg-gray-50 p-2 rounded">{token}</p>
                </div>
              )}

              {/* Status Message */}
              <p className={`text-sm mb-4 text-center font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </p>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !token}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  isGenerating || !token
                    ? 'bg-gray-400 cursor-not-allowed'
                    : reportStatus === 'success'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : reportStatus === 'success' ? (
                  <>
                    <Download className="w-5 h-5" />
                    Download Complete
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate Report
                  </>
                )}
              </button>
            </div>

            {/* Mobile - QR Codes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Community */}
              <div className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200">
                <div className="w-32 h-32 bg-white rounded-lg shadow-md mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://chat.whatsapp.com/your-group-link" 
                    alt="WhatsApp QR"
                    className="w-28 h-28 rounded"
                  />
                </div>
                <h3 className="text-green-700 font-bold text-sm mb-1">Join Community</h3>
                <p className="text-green-600 text-xs">WhatsApp Support</p>
              </div>

              {/* Donation */}
              <div className="bg-orange-50 rounded-xl p-4 text-center border-2 border-orange-200">
                <div className="w-32 h-32 bg-white rounded-lg shadow-md mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://your-donation-link.com" 
                    alt="Donation QR"
                    className="w-28 h-28 rounded"
                  />
                </div>
                <h3 className="text-orange-700 font-bold text-sm mb-1">Support Mission</h3>
                <p className="text-orange-600 text-xs">Secure Donations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {reportStatus === 'error' && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{errorMessage}</p>
            <button
              onClick={() => setReportStatus('ready')}
              className="w-full mt-2 text-red-500 text-xs underline hover:text-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success Actions */}
        {reportStatus === 'success' && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium mb-3 text-center">
              🎉 Your report has been generated successfully!
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 px-4 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                Open Report
              </button>
              <button className="py-2 px-4 border border-green-500 text-green-500 rounded-lg text-sm hover:bg-green-50 transition-colors">
                Share Report
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-2">
            Report generated by <strong>Dr. Ashok Hande</strong>
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Neurosurgeon, Purva Medical Trust
          </p>
          <p className="text-xs text-gray-400">
            Visit <span className="text-blue-500 font-medium">brainline.info</span> for more health resources
          </p>
        </div>
      </div>
    </div>
</>
  );
};

export default Report;