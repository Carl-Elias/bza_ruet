import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
// Removed Firebase Storage imports since we'll work without it
import { db } from "../config/firebase";

// Alumni registration service
export const alumniService = {
  // Add new alumni registration
  async registerAlumni(alumniData) {
    try {
      console.log("Firebase service: Starting registration...");
      console.log("Data to be saved:", alumniData);

      const docRef = await addDoc(collection(db, "alumni"), {
        ...alumniData,
        registrationDate: serverTimestamp(),
        status: "pending", // pending, approved, rejected
        createdAt: serverTimestamp(),
      });

      console.log("Firebase service: Registration successful, ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Firebase service: Error registering alumni:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Get all alumni registrations
  async getAllAlumni() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "alumni"), orderBy("createdAt", "desc"))
      );

      const alumni = [];
      querySnapshot.forEach((doc) => {
        alumni.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: alumni };
    } catch (error) {
      console.error("Error fetching alumni:", error);
      return { success: false, error: error.message };
    }
  },

  // Get alumni by status
  async getAlumniByStatus(status) {
    try {
      console.log("Querying Firebase for status:", status);
      // Simplified query without orderBy to avoid index issues
      const querySnapshot = await getDocs(
        query(collection(db, "alumni"), where("status", "==", status))
      );

      const alumni = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Document found:", doc.id, "Status:", data.status);
        alumni.push({ id: doc.id, ...data });
      });

      // Sort by createdAt in JavaScript instead
      alumni.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });

      console.log("Total alumni found for status", status + ":", alumni.length);
      return { success: true, data: alumni };
    } catch (error) {
      console.error("Error fetching alumni by status:", error);
      return { success: false, error: error.message };
    }
  },

  // Update alumni status (approve/reject)
  async updateAlumniStatus(alumniId, status, reviewNote = "") {
    try {
      const alumniRef = doc(db, "alumni", alumniId);
      await updateDoc(alumniRef, {
        status,
        reviewNote,
        reviewedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating alumni status:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete alumni registration
  async deleteAlumni(alumniId) {
    try {
      await deleteDoc(doc(db, "alumni", alumniId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting alumni:", error);
      return { success: false, error: error.message };
    }
  },

  // Convert image to Base64 (alternative to Firebase Storage)
  async convertImageToBase64(file) {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Error converting image:", error);
      return { success: false, error: error.message };
    }
  },
};

// Statistics service
export const statsService = {
  // Get alumni statistics
  async getAlumniStats() {
    try {
      const allAlumni = await getDocs(collection(db, "alumni"));
      const pendingAlumni = await getDocs(
        query(collection(db, "alumni"), where("status", "==", "pending"))
      );
      const approvedAlumni = await getDocs(
        query(collection(db, "alumni"), where("status", "==", "approved"))
      );

      return {
        success: true,
        data: {
          total: allAlumni.size,
          pending: pendingAlumni.size,
          approved: approvedAlumni.size,
          rejected: allAlumni.size - pendingAlumni.size - approvedAlumni.size,
        },
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { success: false, error: error.message };
    }
  },
};
