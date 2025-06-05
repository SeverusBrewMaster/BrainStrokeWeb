const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Data file path
const DATA_FILE = path.join(__dirname, 'stroke-assessments.json');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    console.log('Created new data file:', DATA_FILE);
  }
}

// Helper function to read data from file
async function readDataFile() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

// Helper function to write data to file
async function writeDataFile(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// Validation middleware for stroke assessment
const validateStrokeAssessment = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('gender').isIn(['male', 'female']).withMessage('Gender must be either male or female'),
  body('email').optional().isEmail().withMessage('Must be a valid email address'),
  body('bloodPressure').optional().matches(/^\d{2,3}\/\d{2,3}$/).withMessage('Blood pressure must be in format XXX/XX'),
  body('pulse').optional().isInt({ min: 30, max: 200 }).withMessage('Pulse must be between 30 and 200'),
  body('weight').optional().isFloat({ min: 20, max: 300 }).withMessage('Weight must be between 20 and 300 kg'),
  body('height').optional().isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
  body('exercise').optional().isIn(['yes', 'no']).withMessage('Exercise must be yes or no'),
  body('smoke').optional().isIn(['yes', 'no']).withMessage('Smoke must be yes or no'),
  body('alcohol').optional().isIn(['yes', 'no']).withMessage('Alcohol must be yes or no'),
  body('hypertension').optional().isIn(['yes', 'no']).withMessage('Hypertension must be yes or no'),
  body('diabetes').optional().isIn(['yes', 'no']).withMessage('Diabetes must be yes or no'),
  body('familyHistory').optional().isIn(['yes', 'no']).withMessage('Family history must be yes or no'),
  body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
  body('tiaHistory').optional().isIn(['yes', 'no']).withMessage('TIA history must be yes or no'),
  body('riskScore').isInt({ min: 0, max: 50 }).withMessage('Risk score must be between 0 and 50'),
  body('riskCategory').isIn(['Low', 'Moderate', 'High']).withMessage('Risk category must be Low, Moderate, or High')
];

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Stroke Risk Assessment API'
  });
});

// Get all assessments (for admin purposes - you may want to add authentication)
app.get('/api/assessments', async (req, res) => {
  try {
    const assessments = await readDataFile();
    
    // Optional: Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedAssessments = assessments.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedAssessments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(assessments.length / limit),
        totalItems: assessments.length,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments'
    });
  }
});

// Get assessment by ID
app.get('/api/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const assessments = await readDataFile();
    const assessment = assessments.find(a => a.id === id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment'
    });
  }
});

// Submit new stroke assessment
app.post('/api/assessments', validateStrokeAssessment, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Create new assessment object
    const assessment = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      
      // Personal Information
      name: req.body.name,
      age: parseInt(req.body.age),
      gender: req.body.gender,
      email: req.body.email || '',
      maritalStatus: req.body.maritalStatus || '',
      locality: req.body.locality || '',
      durationOfStay: req.body.durationOfStay || '',
      
      // Basic Parameters
      bloodPressure: req.body.bloodPressure || '',
      pulse: req.body.pulse || '',
      weight: req.body.weight || '',
      height: req.body.height || '',
      bmi: req.body.bmi || '',
      
      // Personal History
      exercise: req.body.exercise || '',
      exerciseFrequency: req.body.exerciseFrequency || '',
      diet: req.body.diet || '',
      outsideFood: req.body.outsideFood || '',
      education: req.body.education || '',
      profession: req.body.profession || '',
      alcohol: req.body.alcohol || '',
      smoke: req.body.smoke || '',
      
      // Medical History
      hypertension: req.body.hypertension || '',
      diabetes: req.body.diabetes || '',
      cholesterol: req.body.cholesterol || '',
      irregularHeartbeat: req.body.irregularHeartbeat || '',
      snoring: req.body.snoring || '',
      otherCondition: req.body.otherCondition || '',
      bpCheckFrequency: req.body.bpCheckFrequency || '',
      
      // Female-specific (if applicable)
      contraceptives: req.body.contraceptives || '',
      hormoneTherapy: req.body.hormoneTherapy || '',
      pregnancyHypertension: req.body.pregnancyHypertension || '',
      
      // Family History
      familyHistory: req.body.familyHistory || '',
      dependents: req.body.dependents || '',
      insurance: req.body.insurance || '',
      
      // Past History
      thyroidDisease: req.body.thyroidDisease || false,
      heartDisease: req.body.heartDisease || false,
      asthma: req.body.asthma || false,
      migraine: req.body.migraine || false,
      
      // TIA History
      tiaHistory: req.body.tiaHistory || '',
      tiaFrequency: req.body.tiaFrequency || '',
      tiaSymptoms: req.body.tiaSymptoms || [],
      lastTiaOccurrence: req.body.lastTiaOccurrence || '',
      
      // Symptoms
      symptoms: req.body.symptoms || [],
      
      // Risk Assessment Results
      riskScore: parseInt(req.body.riskScore),
      riskCategory: req.body.riskCategory,
      recommendations: req.body.recommendations || ''
    };

    // Read existing data
    const assessments = await readDataFile();
    
    // Add new assessment
    assessments.push(assessment);
    
    // Write back to file
    const writeSuccess = await writeDataFile(assessments);
    
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save assessment'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assessment saved successfully',
      data: {
        id: assessment.id,
        timestamp: assessment.timestamp,
        riskScore: assessment.riskScore,
        riskCategory: assessment.riskCategory
      }
    });
    
  } catch (error) {
    console.error('Error saving assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get statistics (for dashboard)
app.get('/api/statistics', async (req, res) => {
  try {
    const assessments = await readDataFile();
    
    const stats = {
      totalAssessments: assessments.length,
      riskCategories: {
        low: assessments.filter(a => a.riskCategory === 'Low').length,
        moderate: assessments.filter(a => a.riskCategory === 'Moderate').length,
        high: assessments.filter(a => a.riskCategory === 'High').length
      },
      averageAge: assessments.length > 0 ? 
        assessments.reduce((sum, a) => sum + a.age, 0) / assessments.length : 0,
      genderDistribution: {
        male: assessments.filter(a => a.gender === 'male').length,
        female: assessments.filter(a => a.gender === 'female').length
      },
      recentAssessments: assessments
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(a => ({
          id: a.id,
          name: a.name,
          age: a.age,
          riskCategory: a.riskCategory,
          timestamp: a.timestamp
        }))
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Delete assessment (for admin purposes)
app.delete('/api/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const assessments = await readDataFile();
    const assessmentIndex = assessments.findIndex(a => a.id === id);
    
    if (assessmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    assessments.splice(assessmentIndex, 1);
    const writeSuccess = await writeDataFile(assessments);
    
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete assessment'
      });
    }
    
    res.json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assessment'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Initialize and start server
async function startServer() {
  try {
    await initializeDataFile();
    
    app.listen(PORT, () => {
      console.log(`🚀 Stroke Risk Assessment API running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`💾 Data file: ${DATA_FILE}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();