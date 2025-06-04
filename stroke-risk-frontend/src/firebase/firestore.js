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
  orderBy 
} from 'firebase/firestore';
import { db } from './config';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  FEEDBACK: 'feedback',
  RISK_ASSESSMENTS: 'riskAssessments',
  SYMPTOMS: 'symptoms'
};

// Generic CRUD operations
export const firestoreService = {
  // Create a new document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Get all documents from a collection
  async getAll(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
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
        updatedAt: new Date()
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
  }
};

// Specific service functions
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