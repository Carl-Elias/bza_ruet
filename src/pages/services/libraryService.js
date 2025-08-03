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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";

// Library Management Services
export const libraryService = {
  // Books Management
  books: {
    // Add new book
    async addBook(bookData) {
      try {
        const docRef = await addDoc(collection(db, "books"), {
          ...bookData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error("Error adding book:", error);
        return { success: false, error: error.message };
      }
    },

    // Get all books
    async getAllBooks() {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "books"), orderBy("title", "asc"))
        );

        const books = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          books.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          });
        });

        return { success: true, data: books };
      } catch (error) {
        console.error("Error fetching books:", error);
        return { success: false, error: error.message };
      }
    },

    // Update book
    async updateBook(bookId, bookData) {
      try {
        const bookRef = doc(db, "books", bookId);
        await updateDoc(bookRef, {
          ...bookData,
          updatedAt: serverTimestamp(),
        });
        return { success: true };
      } catch (error) {
        console.error("Error updating book:", error);
        return { success: false, error: error.message };
      }
    },

    // Delete book
    async deleteBook(bookId) {
      try {
        await deleteDoc(doc(db, "books", bookId));
        return { success: true };
      } catch (error) {
        console.error("Error deleting book:", error);
        return { success: false, error: error.message };
      }
    },

    // Real-time listener for books
    subscribeToBooks(callback) {
      return onSnapshot(
        query(collection(db, "books"), orderBy("title", "asc")),
        (querySnapshot) => {
          const books = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            books.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() || data.createdAt,
              updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
            });
          });
          callback(books);
        },
        (error) => {
          console.error("Error in books subscription:", error);
          callback([]);
        }
      );
    },
  },

  // Borrowing Records Management
  borrowingRecords: {
    // Add new borrowing record
    async addBorrowingRecord(recordData) {
      try {
        const docRef = await addDoc(collection(db, "borrowingRecords"), {
          ...recordData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error("Error adding borrowing record:", error);
        return { success: false, error: error.message };
      }
    },

    // Get all borrowing records
    async getAllBorrowingRecords() {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "borrowingRecords"),
            orderBy("borrowDate", "desc")
          )
        );

        const records = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          });
        });

        return { success: true, data: records };
      } catch (error) {
        console.error("Error fetching borrowing records:", error);
        return { success: false, error: error.message };
      }
    },

    // Update borrowing record
    async updateBorrowingRecord(recordId, recordData) {
      try {
        const recordRef = doc(db, "borrowingRecords", recordId);
        await updateDoc(recordRef, {
          ...recordData,
          updatedAt: serverTimestamp(),
        });
        return { success: true };
      } catch (error) {
        console.error("Error updating borrowing record:", error);
        return { success: false, error: error.message };
      }
    },

    // Get active borrowings for a book
    async getActiveBorrowingsForBook(bookId) {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "borrowingRecords"),
            where("bookId", "==", bookId),
            where("status", "==", "active")
          )
        );

        const records = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          });
        });

        return { success: true, data: records };
      } catch (error) {
        console.error("Error fetching active borrowings:", error);
        return { success: false, error: error.message };
      }
    },

    // Delete borrowing record
    async deleteBorrowingRecord(recordId) {
      try {
        await deleteDoc(doc(db, "borrowingRecords", recordId));
        return { success: true };
      } catch (error) {
        console.error("Error deleting borrowing record:", error);
        return { success: false, error: error.message };
      }
    },

    // Real-time listener for borrowing records
    subscribeToBorrowingRecords(callback) {
      return onSnapshot(
        query(
          collection(db, "borrowingRecords"),
          orderBy("borrowDate", "desc")
        ),
        (querySnapshot) => {
          const records = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            records.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() || data.createdAt,
              updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
            });
          });
          callback(records);
        },
        (error) => {
          console.error("Error in borrowing records subscription:", error);
          callback([]);
        }
      );
    },
  },

  // Borrowing Requests Management
  borrowingRequests: {
    // Add new borrowing request
    async addRequest(requestData) {
      try {
        const docRef = await addDoc(collection(db, "borrowingRequests"), {
          ...requestData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error("Error adding borrowing request:", error);
        return { success: false, error: error.message };
      }
    },

    // Get all borrowing requests
    async getAllRequests() {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "borrowingRequests"),
            orderBy("requestDate", "desc")
          )
        );

        const requests = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          requests.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          });
        });

        return { success: true, data: requests };
      } catch (error) {
        console.error("Error fetching borrowing requests:", error);
        return { success: false, error: error.message };
      }
    },

    // Update request status
    async updateRequestStatus(requestId, status, notes = "") {
      try {
        const requestRef = doc(db, "borrowingRequests", requestId);
        await updateDoc(requestRef, {
          status: status,
          statusNotes: notes,
          statusUpdatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { success: true };
      } catch (error) {
        console.error("Error updating request status:", error);
        return { success: false, error: error.message };
      }
    },

    // Delete borrowing request
    async deleteRequest(requestId) {
      try {
        await deleteDoc(doc(db, "borrowingRequests", requestId));
        return { success: true };
      } catch (error) {
        console.error("Error deleting borrowing request:", error);
        return { success: false, error: error.message };
      }
    },

    // Real-time listener for borrowing requests
    subscribeToRequests(callback) {
      return onSnapshot(
        query(
          collection(db, "borrowingRequests"),
          orderBy("requestDate", "desc")
        ),
        (querySnapshot) => {
          const requests = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            requests.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() || data.createdAt,
              updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
            });
          });
          callback(requests);
        },
        (error) => {
          console.error("Error in borrowing requests subscription:", error);
          callback([]);
        }
      );
    },
  },
};
