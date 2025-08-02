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

// Events service
export const eventsService = {
  // Add new event
  async createEvent(eventData) {
    try {
      console.log("Firebase service: Creating event...");
      console.log("Event data:", eventData);

      const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(
        "Firebase service: Event created successfully, ID:",
        docRef.id
      );
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Firebase service: Error creating event:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all events
  async getAllEvents() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "events"), orderBy("createdAt", "desc"))
      );

      const events = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to readable dates if needed
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      });

      return { success: true, data: events };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { success: false, error: error.message };
    }
  },

  // Get events by status
  async getEventsByStatus(status) {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "events"), where("status", "==", status))
      );

      const events = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      });

      // Sort by date
      events.sort((a, b) => new Date(a.date) - new Date(b.date));

      return { success: true, data: events };
    } catch (error) {
      console.error("Error fetching events by status:", error);
      return { success: false, error: error.message };
    }
  },

  // Update event
  async updateEvent(eventId, eventData) {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating event:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete event
  async deleteEvent(eventId) {
    try {
      await deleteDoc(doc(db, "events", eventId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error);
      return { success: false, error: error.message };
    }
  },

  // Get upcoming events (for public Events page)
  async getUpcomingEvents() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "events"),
          where("status", "in", ["upcoming", "ongoing"]),
          orderBy("date", "asc")
        )
      );

      const events = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      });

      return { success: true, data: events };
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      // Fallback without orderBy if index doesn't exist
      try {
        const fallbackQuery = await getDocs(
          query(
            collection(db, "events"),
            where("status", "in", ["upcoming", "ongoing"])
          )
        );

        const events = [];
        fallbackQuery.forEach((doc) => {
          const data = doc.data();
          events.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          });
        });

        // Sort by date in JavaScript
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        return { success: true, data: events };
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        return { success: false, error: fallbackError.message };
      }
    }
  },
};

// Announcements service
export const announcementsService = {
  // Add new announcement
  async createAnnouncement(announcementData) {
    try {
      console.log("Firebase service: Creating announcement...");
      console.log("Announcement data:", announcementData);

      const docRef = await addDoc(collection(db, "announcements"), {
        ...announcementData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(
        "Firebase service: Announcement created successfully, ID:",
        docRef.id
      );
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Firebase service: Error creating announcement:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all announcements
  async getAllAnnouncements() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "announcements"), orderBy("createdAt", "desc"))
      );

      const announcements = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to readable dates if needed
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      });

      return { success: true, data: announcements };
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return { success: false, error: error.message };
    }
  },

  // Get announcements by status
  async getAnnouncementsByStatus(status) {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "announcements"), where("status", "==", status))
      );

      const announcements = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      });

      // Sort by created date
      announcements.sort((a, b) => {
        const dateA =
          a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB =
          b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB - dateA;
      });

      return { success: true, data: announcements };
    } catch (error) {
      console.error("Error fetching announcements by status:", error);
      return { success: false, error: error.message };
    }
  },

  // Update announcement
  async updateAnnouncement(announcementId, announcementData) {
    try {
      const announcementRef = doc(db, "announcements", announcementId);
      await updateDoc(announcementRef, {
        ...announcementData,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating announcement:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete announcement
  async deleteAnnouncement(announcementId) {
    try {
      await deleteDoc(doc(db, "announcements", announcementId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting announcement:", error);
      return { success: false, error: error.message };
    }
  },

  // Get active announcements (for public Announcements page)
  async getActiveAnnouncements() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "announcements"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        )
      );

      const announcements = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      });

      return { success: true, data: announcements };
    } catch (error) {
      console.error("Error fetching active announcements:", error);
      // Fallback without orderBy if index doesn't exist
      try {
        const fallbackQuery = await getDocs(
          query(
            collection(db, "announcements"),
            where("status", "==", "active")
          )
        );

        const announcements = [];
        fallbackQuery.forEach((doc) => {
          const data = doc.data();
          announcements.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          });
        });

        // Sort by created date in JavaScript
        announcements.sort((a, b) => {
          const dateA =
            a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB =
            b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB - dateA;
        });

        return { success: true, data: announcements };
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        return { success: false, error: fallbackError.message };
      }
    }
  },
};
