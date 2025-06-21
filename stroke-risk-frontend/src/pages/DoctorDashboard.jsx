import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/firebase'; // ✅ Correct import path
import { db } from '../firebase/firebase';
import { 
  FaUserCircle, FaHeartbeat, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClipboardList, FaExclamationTriangle, FaWeight, FaRulerHorizontal, FaFlask, FaFilePdf, FaWhatsapp, FaTimes, FaCheckCircle,FaInfoCircle, FaExclamationCircle} from "react-icons/fa";
import html2pdf from 'html2pdf.js';
import logo from '../components/logo1.png';
import axios from 'axios';
import './DoctorDashboard.css';

// Add this Modal component after your imports
const Modal = ({ isOpen, onClose, type = 'info', title, message, showConfirm = false, onConfirm }) => {
  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-500 text-4xl" />,
          borderColor: 'border-green-200',
          bgColor: 'bg-green-50',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          icon: <FaExclamationCircle className="text-red-500 text-4xl" />,
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle className="text-yellow-500 text-4xl" />,
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          icon: <FaInfoCircle className="text-blue-500 text-4xl" />,
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-50',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getModalStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 ${styles.borderColor}`}>
        <div className={`${styles.bgColor} px-6 py-4 rounded-t-xl border-b ${styles.borderColor}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {styles.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            {showConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${styles.buttonColor}`}
              >
                Confirm
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              {showConfirm ? 'Cancel' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [doctorNote, setDoctorNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
const [generatedPDFBlob, setGeneratedPDFBlob] = useState(null);
const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  // ADD THESE NEW STATE VARIABLES FOR MODAL
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    showConfirm: false,
    onConfirm: null
  });

  // ADD THIS HELPER FUNCTION
  const showModal = (type, title, message, showConfirm = false, onConfirm = null) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      showConfirm,
      onConfirm
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const fetchPatientsWithAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const patientsQuery = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
      const patientsSnapshot = await getDocs(patientsQuery);
      const patientsData = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const assessmentsQuery = query(collection(db, 'medical_assessments'), orderBy('updatedAt', 'desc'));
      const assessmentsSnapshot = await getDocs(assessmentsQuery);
      const assessmentsData = assessmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const patientsWithAssessments = patientsData.map(patient => {
        const assessment = assessmentsData.find(assess => assess.tokenNumber === patient.tokenNumber);
        return {
          ...patient,
          assessment: assessment || null
        };
      }).filter(patient => patient.assessment !== null);

      setPatients(patientsWithAssessments);
    } catch (error) {
        console.error('Error fetching patients and assessments:', error);
        setError('Failed to fetch patient data. Please try again.');
        showModal('error', 'Data Loading Error', 'Failed to fetch patient data. Please try again.');
      }finally {
      setLoading(false);
    }
  };

  const getRiskClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'risk-badge risk-low';
      case 'moderate':
      case 'medium': return 'risk-badge risk-medium';
      case 'high': return 'risk-badge risk-high';
      default: return 'risk-badge';
    }
  };

  const isHighOrModerateRisk = (patient) => {
    const score = patient?.assessment?.riskAssessment?.riskScore;
    return score >= 5;
  };

  const extractRiskFactors = (patient, assessment) => {
    const contributing = [];
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

    if (assessment.smoke === 'yes') contributing.push("Smoking/Tobacco");
    if (systolic > 140 || diastolic > 90) contributing.push("High Blood Pressure");
    if (age > 60) contributing.push("Age > 60");
    if (['daily', 'multiple-daily'].includes(assessment.alcoholFrequency)) contributing.push("Alcohol abuse");
    if (assessment.irregularHeartbeat === 'yes') contributing.push("Atrial Fibrillation");
    if (assessment.diabetes === 'yes' || rbs > 160 || hba1c > 6.5) contributing.push("Diabetes");
    if (cholesterol > 200 || ldl > 100 || hdl < 60) contributing.push("Abnormal Lipid Profile");
    if (stress >= 3) contributing.push("High Stress");
    if (assessment.exercise === 'no') contributing.push("Lack of Exercise");
    if (bmi > 30) contributing.push("High BMI");
    if (assessment.tiaHistory === 'yes') contributing.push("History of TIA");
    if (sleep < 6) contributing.push("Sleep Deprivation");
    if (aqi > 200) contributing.push("Poor Air Quality");
    if (assessment.familyHistory === 'yes') contributing.push("Family History");

    return contributing;
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedAssessment(patient.assessment);
    setDoctorNote('');
  };

const generatePDF = () => {
    const patient = selectedPatient;
    const assessment = selectedAssessment;
    const riskFactors = extractRiskFactors(patient, assessment);
    
    // Create a temporary container for PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    pdfContainer.style.fontSize = '14px'; // Increased from 12px
    pdfContainer.style.lineHeight = '1.5'; // Increased from 1.4
    pdfContainer.style.color = '#333';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.backgroundColor = 'white';

    const timestamp = new Date().toLocaleString();
    
    // Compact PDF content
    pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
        <h2 style="margin: 0; color: #2563eb; font-size: 22px;">Brain Stroke Risk Assessment Report</h2>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Generated on ${timestamp} | brainline.info</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <div style="width: 48%;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Patient Information</h3>
          <table style="width: 100%; font-size: 13px;">
            <tr><td style="padding: 3px 0;"><strong>Name:</strong></td><td>${patient.name}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Token:</strong></td><td>${patient.tokenNumber}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Age/Gender:</strong></td><td>${patient.age} / ${patient.gender}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Phone:</strong></td><td>${patient.phone}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Location:</strong></td><td>${patient.locality}</td></tr>
          </table>
        </div>

        <div style="width: 48%;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Risk Assessment</h3>
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
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Vital Signs & Key Tests</h3>
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

      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Risk Factors</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 12px;">
          ${riskFactors.map(factor => `
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 6px; text-align: center; display: flex; justify-content: center; align-items: center; min-height: 35px;">
              ${factor}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Doctor's Recommendation</h3>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; font-size: 13px; min-height: 50px; display: flex; align-items: flex-start;">
          <div style="width: 100%;">${doctorNote || 'No specific recommendations provided at this time.'}</div>
        </div>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">Report generated by <strong>Dr. Ashok Hande</strong></p>
        <p style="margin: 8px 0 0 0;">For queries, visit: <a href="https://brainline.info/" style="color: #2563eb;">brainline.info</a></p>
      </div>
    `;

    // Append to body temporarily
    document.body.appendChild(pdfContainer);

    const pdfOptions = {
      margin: [10, 10, 10, 10],
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
  };

  const sendToWhatsApp = async () => {
  if (!selectedPatient?.phone) {
    alert("Phone number is missing.");
    return;
  }

  try {
    const patient = selectedPatient;
    const assessment = selectedAssessment;
    const riskFactors = extractRiskFactors(patient, assessment);
    const doctorNote = assessment?.riskAssessment?.recommendations || "No specific recommendations provided at this time.";
    const timestamp = new Date().toLocaleString();
    const fileName = `${patient.tokenNumber}_Report_${Date.now()}.pdf`;

    // ✅ Create and style PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    pdfContainer.style.fontSize = '14px';
    pdfContainer.style.lineHeight = '1.5';
    pdfContainer.style.color = '#333';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.backgroundColor = 'white';

    pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
        <h2 style="margin: 0; color: #2563eb; font-size: 22px;">Brain Stroke Risk Assessment Report</h2>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Generated on ${timestamp} | brainline.info</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <div style="width: 48%;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Patient Information</h3>
          <table style="width: 100%; font-size: 13px;">
            <tr><td style="padding: 3px 0;"><strong>Name:</strong></td><td>${patient.name}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Token:</strong></td><td>${patient.tokenNumber}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Age/Gender:</strong></td><td>${patient.age} / ${patient.gender}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Phone:</strong></td><td>${patient.phone}</td></tr>
            <tr><td style="padding: 3px 0;"><strong>Location:</strong></td><td>${patient.locality}</td></tr>
          </table>
        </div>

        <div style="width: 48%;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Risk Assessment</h3>
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
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Vital Signs & Key Tests</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 12px;">
          ${[
            { label: 'BP', value: patient.bloodPressure },
            { label: 'BMI', value: patient.bmi },
            { label: 'RBS', value: patient.rbs || 'N/A' },
            { label: 'HbA1c', value: patient.hba1c || 'N/A' },
            { label: 'Cholesterol', value: patient.cholesterol || 'N/A' },
            { label: 'HDL/LDL', value: `${patient.hdl}/${patient.ldl}` },
            { label: 'Hemoglobin', value: patient.hemoglobin || 'N/A' },
            { label: 'Platelets', value: patient.platelets || 'N/A' }
          ].map(test => `
            <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 50px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${test.label}</div>
              <div>${test.value}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Risk Factors</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 12px;">
          ${riskFactors.map(factor => `
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 6px; text-align: center; display: flex; justify-content: center; align-items: center; min-height: 35px;">
              ${factor}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">Doctor's Recommendation</h3>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; font-size: 13px; min-height: 50px; display: flex; align-items: flex-start;">
          <div style="width: 100%;">${doctorNote}</div>
        </div>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">Report generated by <strong>Dr. Ashok Hande</strong></p>
        <p style="margin: 8px 0 0 0;">For queries, visit: <a href="https://brainline.info/" style="color: #2563eb;">brainline.info</a></p>
      </div>
    `;

    document.body.appendChild(pdfContainer);

    // ✅ Generate PDF as a Blob
    const pdfBlob = await html2pdf()
      .from(pdfContainer)
      .set({
        margin: 10,
        jsPDF: { format: 'a4' }
      })
      .outputPdf('blob');

    document.body.removeChild(pdfContainer);

    // ✅ Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', pdfBlob);
    formData.append('upload_preset', 'unsigned_pdf');
    formData.append('public_id', fileName.replace('.pdf', ''));

    const uploadRes = await axios.post(
      'https://api.cloudinary.com/v1_1/dcyyf8odw/raw/upload',
      formData
    );

    // ✅ Generate downloadable link
    const downloadURL = uploadRes.data.secure_url + `?fl_attachment=${fileName}`;

    // ✅ Open WhatsApp with link
    const phone = patient.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`
Hello ${patient.name},

Your brain stroke risk report has been generated. 🧠

📊 Risk Level: ${assessment?.riskAssessment?.riskCategory || 'N/A'}
📋 Risk Score: ${assessment?.riskAssessment?.riskScore || 'N/A'}

📥 Download your report:
${downloadURL}

Stay healthy,
Dr. Ashok Hande
brainline.info
    `);

    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');

  } catch (error) {
    console.error("Failed to generate/send report:", error);
    alert("Something went wrong. Please try again.");
  }
};

  const handleLogout = () => {
  showModal('info', 'Logout Confirmation', 'Are you sure you want to logout?', true, () => {
    window.location.href = '/';
  });
};

  useEffect(() => {
    fetchPatientsWithAssessments();
  }, []);

  const filteredPatients = patients.filter(isHighOrModerateRisk);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchPatientsWithAssessments}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
  <>
    {/* Tailwind CSS CDN */}
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/4.0.4/colors.min.js" rel="stylesheet" />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaHeartbeat className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Dr. Hande</p>
            </div>
            <FaUserCircle 
              size={40} 
              className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200" 
              onClick={handleLogout} 
              title="Logout" 
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-1/3 bg-white shadow-xl border-r border-gray-200 overflow-y-auto">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              High/Moderate Risk Patients ({filteredPatients.length})
            </h1>
          </div>
          
          <div className="p-4 space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <FaClipboardList className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-600">No high/moderate risk patients found</p>
              </div>
            ) : (
              filteredPatients.map(patient => {
                const { riskScore, riskCategory } = patient.assessment?.riskAssessment || {};
                const isHighRisk = riskCategory === 'High Risk';
                
                return (
                  <div 
                    key={patient.id} 
                    className={`bg-white border-2 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
                      selectedPatient?.id === patient.id 
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-800 text-lg">
                        {patient.tokenNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isHighRisk 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}>
                        {riskCategory}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900 flex items-center">
                        <FaUser className="text-gray-500 mr-2 text-sm" />
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center justify-between">
                        <span className="flex items-center">
                          <FaHeartbeat className="text-red-500 mr-2" />
                          Risk Score:
                        </span>
                        <span className={`font-bold ${isHighRisk ? 'text-red-600' : 'text-orange-600'}`}>
                          {riskScore ?? 'N/A'}
                        </span>
                      </p>
                    </div>
                    
                    <button className={`w-full mt-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedPatient?.id === patient.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                    }`}>
                      {selectedPatient?.id === patient.id ? 'Selected' : 'View Details'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedPatient && selectedAssessment ? (
            <div className="p-6 space-y-6">
              {/* Patient Header */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaUser className="text-blue-600 mr-3" />
                    {selectedPatient.name}
                  </h2>
                  <div className={`px-4 py-2 rounded-full font-bold ${
                    selectedPatient.assessment?.riskAssessment?.riskCategory === 'High Risk'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-orange-100 text-orange-800 border border-orange-200'
                  }`}>
                    {selectedPatient.assessment?.riskAssessment?.riskCategory}
                  </div>
                </div>
              </div>

              <div id="report-section" className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaClipboardList className="text-blue-600 mr-3" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaUser className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold text-gray-800">{selectedPatient.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-semibold text-gray-800">{selectedPatient.age}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-semibold text-gray-800">{selectedPatient.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-800">{selectedPatient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-800">{selectedPatient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaMapMarkerAlt className="text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Locality</p>
                        <p className="font-semibold text-gray-800">{selectedPatient.locality}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaHeartbeat className="text-red-500 mr-3" />
                    Vital Signs & Measurements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <FaHeartbeat className="text-red-500 text-xl" />
                        <span className="text-xs text-red-600 font-medium">mmHg</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Blood Pressure</p>
                      <p className="font-bold text-gray-800 text-lg">{selectedPatient.bloodPressure}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <FaWeight className="text-blue-500 text-xl" />
                        <span className="text-xs text-blue-600 font-medium">kg/m²</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">BMI</p>
                      <p className="font-bold text-gray-800 text-lg">{selectedPatient.bmi}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <FaRulerHorizontal className="text-green-500 text-xl" />
                        <span className="text-xs text-green-600 font-medium">cm</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Waist</p>
                      <p className="font-bold text-gray-800 text-lg">{selectedPatient.waist}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <FaFlask className="text-purple-500 text-xl" />
                        <span className="text-xs text-purple-600 font-medium">mg/dL</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">HDL / LDL</p>
                      <p className="font-bold text-gray-800 text-lg">{selectedPatient.hdl} / {selectedPatient.ldl}</p>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaFlask className="text-green-600 mr-3" />
                    Laboratory Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[
                      { label: 'Hemoglobin', value: selectedPatient.hemoglobin, unit: 'g/dL', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-600' },
                      { label: 'WBC', value: selectedPatient.wbc, unit: '/μL', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-600' },
                      { label: 'Platelets', value: selectedPatient.platelets, unit: '/μL', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-600' },
                      { label: 'RBC', value: selectedPatient.rbc, unit: 'M/μL', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-600' },
                      { label: 'Hematocrit', value: selectedPatient.hematocrit, unit: '%', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-600' },
                      { label: 'CRP', value: selectedPatient.crp, unit: 'mg/L', bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-600' },
                      { label: 'RBS', value: selectedPatient.rbs, unit: 'mg/dL', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-600' },
                      { label: 'HbA1c', value: selectedPatient.hba1c, unit: '%', bgColor: 'bg-red-50', borderColor: 'border-orange-200', textColor: 'text-orange-600' },
                      { label: 'Cholesterol', value: selectedPatient.cholesterol, unit: 'mg/dL', bgColor: 'bg-purple-50', borderColor: 'border-teal-200', textColor: 'text-teal-600' },
                      { label: 'TG', value: selectedPatient.tg, unit: 'mg/dL', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-cyan-600' },
                      { label: 'Homocysteine', value: selectedPatient.homocysteine, unit: 'μmol/L', bgColor: 'bg-blue-50', borderColor: 'border-lime-200', textColor: 'text-lime-600' },
                      { label: 'Lipoprotein A', value: selectedPatient.lipoprotein, unit: 'mg/dL', bgColor: 'bg-pink-50', borderColor: 'border-rose-200', textColor: 'text-rose-600' }
                    ].map((test, index) => (
                      <div key={index} className={`${test.bgColor} ${test.borderColor} border p-3 rounded-lg`}>
                        <p className={`text-sm ${test.textColor} font-medium`}>{test.label}</p>
                        <p className="font-bold text-gray-800 text-lg">{test.value || 'N/A'}</p>
                        <p className={`text-xs ${test.textColor}`}>{test.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-3" />
                    Contributing Risk Factors
                  </h3>
                  <div className="space-y-2">
                    {extractRiskFactors(selectedPatient, selectedAssessment).map((factor, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 border border-red-200 rounded-lg">
  <svg
    className="w-4 h-4 text-red-600"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 5l6 10H4l6-10z" />
  </svg>
  <span className="text-gray-800">{factor}</span>
</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctor's Recommendation */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <label htmlFor="doctor-note" className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaClipboardList className="text-blue-600 mr-3" />
                  Doctor's Recommendation
                </label>
                <textarea
                  id="doctor-note"
                  rows="4"
                  placeholder="Write your detailed recommendation for the patient..."
                  className="w-full mt-3 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
<div className="flex flex-col sm:flex-row gap-4">
  <button 
    className={`flex-1 ${isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-3`}
    onClick={generatePDF}
    disabled={isGeneratingPDF}
  >
    {isGeneratingPDF ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>Generating PDF...</span>
      </>
    ) : (
      <>
        <FaFilePdf className="text-xl" />
        <span>Generate PDF Report</span>
      </>
    )}
  </button>
  <button
    className={`flex-1 ${isSendingWhatsApp ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-3`}
    onClick={sendToWhatsApp}
    disabled={isSendingWhatsApp}
  >
    {isSendingWhatsApp ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>Preparing...</span>
      </>
    ) : (
      <>
        <FaWhatsapp className="text-xl" />
        <span>Send to Patient</span>
      </>
    )}
  </button>
</div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center m-16">
              <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md">
                <FaClipboardList className="text-6xl text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">No Patient Selected</h3>
                <p className="text-gray-600">Select a patient from the sidebar to view their details and generate a medical report.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <Modal
      isOpen={modalConfig.isOpen}
      onClose={closeModal}
      type={modalConfig.type}
      title={modalConfig.title}
      message={modalConfig.message}
      showConfirm={modalConfig.showConfirm}
      onConfirm={modalConfig.onConfirm}
    />
  </>
  );
};

export default DoctorDashboard;