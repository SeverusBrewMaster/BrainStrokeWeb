import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  FEEDBACK: 'feedback',
  RISK_ASSESSMENTS: 'riskAssessments',
  SYMPTOMS: 'symptoms',
  PATIENTS: 'patients',
  MEDICAL_DATA: 'medicalData'
};

// Generic CRUD operations
export const firestoreService = {
  // Create a new document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Get all documents from a collection
  async getAll(collectionName, orderField = 'updatedAt', orderDirection = 'desc') {
    try {
      const q = query(
        collection(db, collectionName), 
        orderBy(orderField, orderDirection)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  },

  // Get a single document by ID
  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Update a document
  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Query documents with conditions
  async query(collectionName, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      conditions.forEach(condition => {
        if (condition.type === 'where') {
          q = query(q, where(condition.field, condition.operator, condition.value));
        } else if (condition.type === 'orderBy') {
          q = query(q, orderBy(condition.field, condition.direction || 'asc'));
        }
      });

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  },

  // Search documents with text matching
  async search(collectionName, field, searchTerm) {
    try {
      const q = query(
        collection(db, collectionName),
        where(field, '>=', searchTerm),
        where(field, '<=', searchTerm + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  },

  // Real-time listener
  subscribe(collectionName, callback, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      conditions.forEach(condition => {
        if (condition.type === 'where') {
          q = query(q, where(condition.field, condition.operator, condition.value));
        } else if (condition.type === 'orderBy') {
          q = query(q, orderBy(condition.field, condition.direction || 'asc'));
        }
      });

      return onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(documents);
      }, (error) => {
        console.error('Error in subscription:', error);
      });
    } catch (error) {
      console.error('Error setting up subscription:', error);
      throw error;
    }
  }
};

// Existing service functions
export const feedbackService = {
  async submitFeedback(feedbackData) {
    return await firestoreService.create(COLLECTIONS.FEEDBACK, feedbackData);
  },

  async getAllFeedback() {
    return await firestoreService.getAll(COLLECTIONS.FEEDBACK);
  }
};

export const userService = {
  async createUser(userData) {
    return await firestoreService.create(COLLECTIONS.USERS, userData);
  },

  async getUserById(userId) {
    return await firestoreService.getById(COLLECTIONS.USERS, userId);
  },

  async updateUser(userId, userData) {
    return await firestoreService.update(COLLECTIONS.USERS, userId, userData);
  }
};

export const riskAssessmentService = {
  async saveAssessment(assessmentData) {
    return await firestoreService.create(COLLECTIONS.RISK_ASSESSMENTS, assessmentData);
  },

  async getUserAssessments(userId) {
    return await firestoreService.query(COLLECTIONS.RISK_ASSESSMENTS, [
      { type: 'where', field: 'userId', operator: '==', value: userId },
      { type: 'orderBy', field: 'createdAt', direction: 'desc' }
    ]);
  }
};

// New patient service functions
export const patientsService = {
  // Get all patients
  async getAllPatients() {
    return await firestoreService.getAll(COLLECTIONS.PATIENTS, 'lastUpdated', 'desc');
  },

  // Get patient by ID
  async getPatientById(patientId) {
    const patient = await firestoreService.getById(COLLECTIONS.PATIENTS, patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  },

  // Search patients by token number or name
  async searchPatients(searchTerm) {
    try {
      const [tokenResults, nameResults] = await Promise.all([
        firestoreService.search(COLLECTIONS.PATIENTS, 'tokenNumber', searchTerm.toUpperCase()),
        firestoreService.search(COLLECTIONS.PATIENTS, 'name', searchTerm)
      ]);
      
      const results = new Map();
      
      tokenResults.forEach(doc => {
        results.set(doc.id, doc);
      });
      
      nameResults.forEach(doc => {
        results.set(doc.id, doc);
      });
      
      return Array.from(results.values());
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  },

  // Add new patient
  async addPatient(patientData) {
    return await firestoreService.create(COLLECTIONS.PATIENTS, {
      ...patientData,
      lastUpdated: new Date().toISOString()
    });
  },

  // Update patient
  async updatePatient(patientId, patientData) {
    return await firestoreService.update(COLLECTIONS.PATIENTS, patientId, {
      ...patientData,
      lastUpdated: new Date().toISOString()
    });
  },

  // Delete patient
  async deletePatient(patientId) {
    return await firestoreService.delete(COLLECTIONS.PATIENTS, patientId);
  },

  // Listen to patients changes (real-time)
  subscribeToPatients(callback) {
    return firestoreService.subscribe(COLLECTIONS.PATIENTS, callback, [
      { type: 'orderBy', field: 'lastUpdated', direction: 'desc' }
    ]);
  }
};

// Medical data operations
export const medicalDataService = {
  // Save medical data for a patient
  async saveMedicalData(patientId, medicalData) {
    return await firestoreService.create(COLLECTIONS.MEDICAL_DATA, {
      patientId,
      ...medicalData,
      lastUpdated: new Date().toISOString()
    });
  },

  // Get medical data for a patient
  async getMedicalData(patientId) {
    return await firestoreService.query(COLLECTIONS.MEDICAL_DATA, [
      { type: 'where', field: 'patientId', operator: '==', value: patientId },
      { type: 'orderBy', field: 'lastUpdated', direction: 'desc' }
    ]);
  },

  // Update medical data
  async updateMedicalData(medicalDataId, medicalData) {
    return await firestoreService.update(COLLECTIONS.MEDICAL_DATA, medicalDataId, {
      ...medicalData,
      lastUpdated: new Date().toISOString()
    });
  }
};

// Statistics operations
export const statisticsService = {
  // Get dashboard statistics
  async getStatistics() {
    try {
      const [patients, medicalData] = await Promise.all([
        firestoreService.getAll(COLLECTIONS.PATIENTS),
        firestoreService.getAll(COLLECTIONS.MEDICAL_DATA)
      ]);
      
      // Calculate statistics
      const totalAssessed = medicalData.length;
      const completed = patients.filter(p => p.status === 'Complete').length;
      const pendingReview = patients.filter(p => p.status === 'Pending').length;
      const highRiskPatients = medicalData.filter(
        data => data.calculatedResults?.riskCategory === 'High'
      ).length;
      
      return {
        totalAssessed,
        pendingReview,
        completed,
        highRiskPatients
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Listen to statistics changes (real-time)
  subscribeToStatistics(callback) {
    const patientsUnsubscribe = firestoreService.subscribe(COLLECTIONS.PATIENTS, () => {
      this.getStatistics().then(callback);
    });
    
    const medicalDataUnsubscribe = firestoreService.subscribe(COLLECTIONS.MEDICAL_DATA, () => {
      this.getStatistics().then(callback);
    });
    
    // Return combined unsubscribe function
    return () => {
      patientsUnsubscribe();
      medicalDataUnsubscribe();
    };
  }
};