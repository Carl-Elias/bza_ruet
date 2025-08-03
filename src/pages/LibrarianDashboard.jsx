import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Users,
  Calendar,
  Download,
  Upload,
  Star,
  X,
  Save,
  AlertCircle,
  BookCheck,
  BookX,
  Package,
  UserPlus,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { libraryService } from "./services/libraryService";
import LibrarianAuth, {
  checkLibrarianAuth,
  logoutLibrarian,
} from "../components/LibrarianAuth";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import "./LibrarianDashboard.css";

const LibrarianDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLendModal, setShowLendModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showBorrowingDetailsModal, setShowBorrowingDetailsModal] =
    useState(false);
  const [showExtendDueDateModal, setShowExtendDueDateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBorrowingRecord, setSelectedBorrowingRecord] = useState(null);
  const [borrowingRecords, setBorrowingRecords] = useState([]);
  const [extendDueDateFormData, setExtendDueDateFormData] = useState({
    newDueDate: "",
    reason: "",
  });
  const [inventoryFormData, setInventoryFormData] = useState({
    addCopies: 0,
    markDamaged: 0,
    markLost: 0,
    reason: "",
  });
  const [lendFormData, setLendFormData] = useState({
    borrowerName: "",
    studentId: "",
    department: "",
    borrowDate: "",
    dueDate: "",
  });
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    publisher: "",
    description: "",
    totalCopies: 1,
  });

  const categories = [
    "Engineering",
    "Computer Science",
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Literature",
    "Mathematics",
    "Physics",
    "Chemistry",
  ];

  // Fallback mock data for when Firebase is unavailable
  const mockBooks = [
    {
      id: "mock-1",
      title: "Engineering Mathematics Volume 1",
      author: "B.S. Grewal",
      category: "Engineering",
      isbn: "978-8173716126",
      publisher: "Khanna Publishers",
      year: 2019,
      pages: 1232,
      rating: 4.5,
      description:
        "Comprehensive mathematics textbook for engineering students covering calculus, differential equations, and more.",
      addedDate: "2024-01-15",
      addedBy: "BZA Library Committee",
      inventory: {
        total: 10,
        available: 8,
        borrowed: 2,
        damaged: 0,
        lost: 0,
      },
    },
    {
      id: "mock-2",
      title: "Fundamentals of Computer Programming with C#",
      author: "Svetlin Nakov",
      category: "Computer Science",
      isbn: "978-9544007737",
      publisher: "Faber Publishing",
      year: 2018,
      pages: 1132,
      rating: 4.3,
      description:
        "Complete guide to programming fundamentals using C# programming language.",
      addedDate: "2024-02-20",
      addedBy: "CSE Department",
      inventory: {
        total: 5,
        available: 2,
        borrowed: 3,
        damaged: 0,
        lost: 0,
      },
    },
    {
      id: "mock-3",
      title: "Strength of Materials",
      author: "R.K. Bansal",
      category: "Civil Engineering",
      isbn: "978-8131808825",
      publisher: "Laxmi Publications",
      year: 2020,
      pages: 864,
      rating: 4.7,
      description:
        "Comprehensive study of mechanics of materials for civil engineering students.",
      addedDate: "2024-03-10",
      addedBy: "Civil Engineering Department",
      inventory: {
        total: 7,
        available: 7,
        borrowed: 0,
        damaged: 0,
        lost: 0,
      },
    },
  ];

  // Mock borrowing records - fallback for when Firebase is unavailable
  const mockBorrowingRecords = [
    {
      id: "BOR-001",
      bookId: "mock-1",
      bookTitle: "Engineering Mathematics Volume 1",
      borrowerName: "Rahim Ahmed",
      studentId: "2021-04-001",
      department: "Civil Engineering",
      borrowDate: "2025-01-15",
      dueDate: "2025-02-15",
      status: "active",
      returnDate: null,
    },
    {
      id: "BOR-002",
      bookId: "mock-1",
      bookTitle: "Engineering Mathematics Volume 1",
      borrowerName: "Karim Hassan",
      studentId: "2021-04-002",
      department: "Mechanical Engineering",
      borrowDate: "2025-01-20",
      dueDate: "2025-02-20",
      status: "active",
      returnDate: null,
    },
    {
      id: "BOR-003",
      bookId: "mock-2",
      bookTitle: "Fundamentals of Computer Programming with C#",
      borrowerName: "Fatima Rahman",
      studentId: "2021-02-015",
      department: "Computer Science & Engineering",
      borrowDate: "2025-01-10",
      dueDate: "2025-02-10",
      status: "active",
      returnDate: null,
    },
    {
      id: "BOR-004",
      bookId: "mock-2",
      bookTitle: "Fundamentals of Computer Programming with C#",
      borrowerName: "Nasir Khan",
      studentId: "2021-02-033",
      department: "Computer Science & Engineering",
      borrowDate: "2025-01-12",
      dueDate: "2025-02-12",
      status: "active",
      returnDate: null,
    },
    {
      id: "BOR-005",
      bookId: "mock-2",
      bookTitle: "Fundamentals of Computer Programming with C#",
      borrowerName: "Sadia Islam",
      studentId: "2021-02-044",
      department: "Computer Science & Engineering",
      borrowDate: "2025-01-18",
      dueDate: "2025-02-18",
      status: "active",
      returnDate: null,
    },
  ];

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = checkLibrarianAuth();
    setIsAuthenticated(authStatus);
  }, []);

  useEffect(() => {
    // Only load data if authenticated
    if (!isAuthenticated) return;

    let booksUnsubscribe;
    let borrowingRecordsUnsubscribe;

    // Set up real-time listeners for books and borrowing records
    const setupRealtimeListeners = async () => {
      setLoading(true);

      try {
        // Subscribe to books
        booksUnsubscribe = libraryService.books.subscribeToBooks(
          (booksData) => {
            setBooks(booksData);
            setLoading(false);
          }
        );

        // Subscribe to borrowing records
        borrowingRecordsUnsubscribe =
          libraryService.borrowingRecords.subscribeToBorrowingRecords(
            (recordsData) => {
              setBorrowingRecords(recordsData);
            }
          );
      } catch (error) {
        console.error("Error setting up Firebase listeners:", error);
        setLoading(false);

        // Fallback to initial load if real-time fails
        loadInitialData();
      }
    };

    // Fallback function for initial load
    const loadInitialData = async () => {
      try {
        // Load books
        const booksResponse = await libraryService.books.getAllBooks();
        if (booksResponse.success) {
          setBooks(booksResponse.data);
        }

        // Load borrowing records
        const recordsResponse =
          await libraryService.borrowingRecords.getAllBorrowingRecords();
        if (recordsResponse.success) {
          setBorrowingRecords(recordsResponse.data);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        // Use mock data as final fallback
        setBooks(mockBooks);
        setBorrowingRecords(mockBorrowingRecords);
      } finally {
        setLoading(false);
      }
    };

    setupRealtimeListeners();

    // Cleanup function
    return () => {
      if (booksUnsubscribe) {
        booksUnsubscribe();
      }
      if (borrowingRecordsUnsubscribe) {
        borrowingRecordsUnsubscribe();
      }
    };
  }, [isAuthenticated]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    // Update status filtering to work with inventory
    let matchesStatus = true;
    if (selectedStatus === "available") {
      matchesStatus = book.inventory && book.inventory.available > 0;
    } else if (selectedStatus === "borrowed") {
      matchesStatus = book.inventory && book.inventory.borrowed > 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddBook = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      publisher: "",
      description: "",
      totalCopies: 1,
    });
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setFormData({ ...book });
    setShowEditModal(true);
  };

  const handleDeleteBook = async (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const confirmDeleteBook = async () => {
    if (!selectedBook) return;

    // Check for active borrowings
    const activeBorrowings = borrowingRecords.filter(
      (record) =>
        record.bookId === selectedBook.id && record.status === "active"
    );

    setLoading(true);
    try {
      // Delete the book (Firebase will handle cascade deletion if configured)
      const response = await libraryService.books.deleteBook(selectedBook.id);

      if (response.success) {
        // If there were active borrowings, we should also clean up borrowing records
        if (activeBorrowings.length > 0) {
          // Delete related borrowing records
          const deletePromises = activeBorrowings.map((record) =>
            libraryService.borrowingRecords.deleteBorrowingRecord(record.id)
          );

          await Promise.all(deletePromises);
        }

        alert(`"${selectedBook.title}" has been successfully deleted.`);
        console.log("Book and related records deleted successfully");
        setShowDeleteModal(false);
        setSelectedBook(null);
      } else {
        alert("Error deleting book: " + response.error);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error deleting book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const handleLendBook = (book) => {
    if (!book.inventory || book.inventory.available === 0) {
      alert("No copies available for lending!");
      return;
    }
    setSelectedBook(book);
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 30); // 30 days loan period

    setLendFormData({
      borrowerName: "",
      studentId: "",
      department: "",
      borrowDate: today.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
    });
    setShowLendModal(true);
  };

  const handleReturnBook = (book) => {
    const activeBorrowings = borrowingRecords.filter(
      (record) => record.bookId === book.id && record.status === "active"
    );

    if (activeBorrowings.length === 0) {
      alert("No active borrowings found for this book!");
      return;
    }

    setSelectedBook(book);
    setShowReturnModal(true);
  };

  const handleManageInventory = (book) => {
    setSelectedBook(book);
    setInventoryFormData({
      addCopies: 0,
      markDamaged: 0,
      markLost: 0,
      reason: "",
    });
    setShowInventoryModal(true);
  };

  const handleInventoryUpdate = async (action) => {
    const { addCopies, markDamaged, markLost, reason } = inventoryFormData;
    const selectedInventory = selectedBook.inventory;

    let newInventory = { ...selectedInventory };

    switch (action) {
      case "addCopies":
        if (addCopies > 0) {
          newInventory.total += parseInt(addCopies);
          newInventory.available += parseInt(addCopies);
        }
        break;

      case "markDamaged":
        if (markDamaged > 0 && markDamaged <= selectedInventory.available) {
          newInventory.available -= parseInt(markDamaged);
          newInventory.damaged += parseInt(markDamaged);
        } else {
          alert("Cannot mark more copies as damaged than available!");
          return;
        }
        break;

      case "markLost":
        if (markLost > 0 && markLost <= selectedInventory.available) {
          newInventory.available -= parseInt(markLost);
          newInventory.lost += parseInt(markLost);
        } else {
          alert("Cannot mark more copies as lost than available!");
          return;
        }
        break;

      case "restoreDamaged":
        if (selectedInventory.damaged > 0) {
          newInventory.damaged -= 1;
          newInventory.available += 1;
        }
        break;

      default:
        return;
    }

    setLoading(true);
    try {
      // Update the book inventory in Firebase
      const updatedBook = {
        ...selectedBook,
        inventory: newInventory,
      };

      const response = await libraryService.books.updateBook(
        selectedBook.id,
        updatedBook
      );

      if (response.success) {
        // Reset form data
        setInventoryFormData({
          addCopies: 0,
          markDamaged: 0,
          markLost: 0,
          reason: "",
        });

        // Show success message
        alert(`Inventory updated successfully!`);
      } else {
        alert("Error updating inventory: " + response.error);
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Error updating inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLendSubmit = async () => {
    if (
      !lendFormData.borrowerName ||
      !lendFormData.studentId ||
      !lendFormData.department
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      // Create new borrowing record
      const newBorrowing = {
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        borrowerName: lendFormData.borrowerName,
        studentId: lendFormData.studentId,
        department: lendFormData.department,
        borrowDate: lendFormData.borrowDate,
        dueDate: lendFormData.dueDate,
        status: "active",
        returnDate: null,
      };

      // Add borrowing record to Firebase
      const borrowingResponse =
        await libraryService.borrowingRecords.addBorrowingRecord(newBorrowing);

      if (borrowingResponse.success) {
        // Update book inventory in Firebase
        const updatedInventory = {
          ...selectedBook.inventory,
          available: selectedBook.inventory.available - 1,
          borrowed: selectedBook.inventory.borrowed + 1,
        };

        const bookUpdateResponse = await libraryService.books.updateBook(
          selectedBook.id,
          {
            ...selectedBook,
            inventory: updatedInventory,
          }
        );

        if (bookUpdateResponse.success) {
          setShowLendModal(false);
          setLendFormData({
            borrowerName: "",
            studentId: "",
            borrowDate: "",
            dueDate: "",
          });
          alert("Book lent successfully!");
        } else {
          alert("Error updating book inventory: " + bookUpdateResponse.error);
        }
      } else {
        alert("Error creating borrowing record: " + borrowingResponse.error);
      }
    } catch (error) {
      console.error("Error in lending process:", error);
      alert("Error lending book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (borrowingId) => {
    const today = new Date().toISOString().split("T")[0];

    // If called from borrowing records tab, use selectedBorrowingRecord
    const recordId = borrowingId || selectedBorrowingRecord?.id;

    if (!recordId) {
      alert("No borrowing record selected!");
      return;
    }

    setLoading(true);
    try {
      // Find the borrowing record to return
      const recordToReturn = borrowingRecords.find((r) => r.id === recordId);
      if (!recordToReturn) {
        alert("Borrowing record not found!");
        setLoading(false);
        return;
      }

      // Update borrowing record in Firebase
      const updatedBorrowing = {
        ...recordToReturn,
        status: "returned",
        returnDate: today,
      };

      const borrowingResponse =
        await libraryService.borrowingRecords.updateBorrowingRecord(
          recordId,
          updatedBorrowing
        );

      if (borrowingResponse.success) {
        // Update book inventory in Firebase
        const bookToUpdate = books.find(
          (book) => book.id === recordToReturn.bookId
        );
        if (bookToUpdate) {
          const updatedInventory = {
            ...bookToUpdate.inventory,
            available: bookToUpdate.inventory.available + 1,
            borrowed: bookToUpdate.inventory.borrowed - 1,
          };

          const bookUpdateResponse = await libraryService.books.updateBook(
            recordToReturn.bookId,
            {
              ...bookToUpdate,
              inventory: updatedInventory,
            }
          );

          if (bookUpdateResponse.success) {
            setShowReturnModal(false);
            alert("Book returned successfully!");
          } else {
            alert("Error updating book inventory: " + bookUpdateResponse.error);
          }
        }
      } else {
        alert("Error updating borrowing record: " + borrowingResponse.error);
      }
    } catch (error) {
      console.error("Error in return process:", error);
      alert("Error returning book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async () => {
    setLoading(true);
    try {
      if (showAddModal) {
        // Add new book with inventory structure
        const totalCopies = parseInt(formData.totalCopies) || 1;
        const newBook = {
          ...formData,
          isbn: `ISBN-${Date.now()}`, // Auto-generate ISBN
          year: new Date().getFullYear(), // Default to current year
          pages: 0, // Default pages
          rating: 0, // Default rating
          addedDate: new Date().toISOString().split("T")[0],
          addedBy: "Librarian",
          inventory: {
            total: totalCopies,
            available: totalCopies,
            borrowed: 0,
            damaged: 0,
            lost: 0,
          },
        };

        const response = await libraryService.books.addBook(newBook);
        if (response.success) {
          setShowAddModal(false);
          alert("Book added successfully!");
        } else {
          alert("Error adding book: " + response.error);
        }
      } else if (showEditModal) {
        // Update existing book
        const updatedBook = { ...selectedBook, ...formData };
        const response = await libraryService.books.updateBook(
          selectedBook.id,
          updatedBook
        );

        if (response.success) {
          setShowEditModal(false);
          alert("Book updated successfully!");
        } else {
          alert("Error updating book: " + response.error);
        }
      }

      setFormData({
        title: "",
        author: "",
        category: "",
        publisher: "",
        description: "",
        totalCopies: 1,
      });
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Error saving book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailsModal(false);
    setShowLendModal(false);
    setShowReturnModal(false);
    setShowInventoryModal(false);
    setShowBorrowingDetailsModal(false);
    setShowExtendDueDateModal(false);
    setShowDeleteModal(false);
    setSelectedBook(null);
    setSelectedBorrowingRecord(null);
    setFormData({
      title: "",
      author: "",
      category: "",
      publisher: "",
      description: "",
      totalCopies: 1,
    });
    setLendFormData({
      borrowerName: "",
      studentId: "",
      department: "",
      borrowDate: "",
      dueDate: "",
    });
    setInventoryFormData({
      addCopies: 0,
      markDamaged: 0,
      markLost: 0,
      reason: "",
    });
    setExtendDueDateFormData({
      newDueDate: "",
      reason: "",
    });
  };

  const stats = [
    {
      title: "Total Books",
      count: books.length,
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Total Copies",
      count: books.reduce((sum, book) => sum + (book.inventory?.total || 0), 0),
      icon: BookOpen,
      color: "green",
    },
    {
      title: "Available Copies",
      count: books.reduce(
        (sum, book) => sum + (book.inventory?.available || 0),
        0
      ),
      icon: BookOpen,
      color: "green",
    },
    {
      title: "Borrowed Copies",
      count: books.reduce(
        (sum, book) => sum + (book.inventory?.borrowed || 0),
        0
      ),
      icon: Download,
      color: "orange",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="star" />);
    }

    return stars;
  };

  const getFilteredBorrowingRecords = () => {
    return borrowingRecords.filter((record) => {
      const matchesSearch =
        record.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.department &&
          record.department.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesStatus = true;
      if (selectedStatus === "active") {
        matchesStatus = record.status === "active";
      } else if (selectedStatus === "returned") {
        matchesStatus = record.status === "returned";
      } else if (selectedStatus === "overdue") {
        matchesStatus =
          record.status === "active" && new Date(record.dueDate) < new Date();
      }

      return matchesSearch && matchesStatus;
    });
  };

  const getBorrowingStatusBadge = (record) => {
    if (record.status === "returned") {
      return <span className="status-badge returned">Returned</span>;
    }

    if (record.status === "active") {
      const isOverdue = new Date(record.dueDate) < new Date();
      if (isOverdue) {
        const daysOverdue = Math.ceil(
          (new Date() - new Date(record.dueDate)) / (1000 * 60 * 60 * 24)
        );
        return (
          <span className="status-badge overdue">
            Overdue ({daysOverdue} days)
          </span>
        );
      }
      return <span className="status-badge active">Active</span>;
    }

    return <span className="status-badge unknown">Unknown</span>;
  };

  const handleViewBorrowingDetails = (record) => {
    setSelectedBorrowingRecord(record);
    setShowBorrowingDetailsModal(true);
  };

  const handleReturnFromRecord = (record) => {
    // Find the book associated with this record
    const book = books.find((b) => b.id === record.bookId);
    if (book) {
      setSelectedBook(book);
      setSelectedBorrowingRecord(record);
      setShowReturnModal(true);
    }
  };

  const handleExtendDueDate = (record) => {
    setSelectedBorrowingRecord(record);
    const currentDueDate = new Date(record.dueDate);
    const extendedDate = new Date(currentDueDate);
    extendedDate.setDate(currentDueDate.getDate() + 14); // Default 14 days extension

    setExtendDueDateFormData({
      newDueDate: extendedDate.toISOString().split("T")[0],
      reason: "",
    });
    setShowExtendDueDateModal(true);
  };

  const handleExtendDueDateSubmit = async () => {
    if (!extendDueDateFormData.newDueDate) {
      alert("Please select a new due date!");
      return;
    }

    setLoading(true);
    try {
      // Update the borrowing record in Firebase
      const updatedRecord = {
        ...selectedBorrowingRecord,
        dueDate: extendDueDateFormData.newDueDate,
      };

      const response =
        await libraryService.borrowingRecords.updateBorrowingRecord(
          selectedBorrowingRecord.id,
          updatedRecord
        );

      if (response.success) {
        setShowExtendDueDateModal(false);
        setExtendDueDateFormData({
          newDueDate: "",
          reason: "",
        });
        alert("Due date extended successfully!");
      } else {
        alert("Error extending due date: " + response.error);
      }
    } catch (error) {
      console.error("Error extending due date:", error);
      alert("Error extending due date. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderAvailability = (inventory) => {
    if (!inventory) {
      return (
        <div className="librarian-availability-display">
          <span className="librarian-status-badge unavailable">No Data</span>
        </div>
      );
    }

    const { available, total, borrowed } = inventory;
    const availabilityPercentage = total > 0 ? (available / total) * 100 : 0;

    return (
      <div className="librarian-availability-display">
        <div className="librarian-availability-text">
          <span
            className={`librarian-availability-badge ${
              available > 0 ? "available" : "unavailable"
            }`}
          >
            {available}/{total} Available
          </span>
        </div>
        {borrowed > 0 && (
          <div className="librarian-borrowed-summary">
            <small>{borrowed} borrowed</small>
          </div>
        )}
        <div className="librarian-availability-bar">
          <div
            className="librarian-availability-fill"
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <LibrarianAuth onAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="librarian-dashboard">
      {/* Header */}
      <div className="librarian-dashboard-header">
        <div className="librarian-header-content">
          <h1>Librarian Dashboard</h1>
          <p>Manage books, track borrowing, and maintain the library system</p>
          <button
            className="logout-btn"
            onClick={logoutLibrarian}
            title="Logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="librarian-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`librarian-stat-card ${stat.color}`}>
              <div className="librarian-stat-icon">
                <Icon size={24} />
              </div>
              <div className="librarian-stat-content">
                <div className="librarian-stat-number">{stat.count}</div>
                <div className="librarian-stat-title">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="librarian-dashboard-tabs">
        <button
          className={`librarian-tab ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          <BookOpen size={20} />
          Books Management
        </button>
        <button
          className={`librarian-tab ${
            activeTab === "borrowing" ? "active" : ""
          }`}
          onClick={() => setActiveTab("borrowing")}
        >
          <Users size={20} />
          Borrowing Records
        </button>
      </div>

      {/* Books Management Tab */}
      {activeTab === "books" && (
        <div className="librarian-tab-content">
          {/* Controls */}
          <div className="librarian-controls-section">
            <div className="librarian-search-controls">
              <div className="librarian-search-box">
                <Search size={20} className="librarian-search-icon" />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="librarian-search-input"
                />
              </div>

              <div className="librarian-filters-group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="librarian-filter-select"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="librarian-filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                </select>
              </div>
            </div>

            <div className="librarian-action-controls">
              <button className="librarian-create-btn" onClick={handleAddBook}>
                <Plus size={20} />
                Add New Book
              </button>
            </div>
          </div>

          {/* Books Table */}
          <div className="librarian-content-section">
            <div className="librarian-books-table">
              <div className="librarian-table-header">
                <div className="librarian-table-row">
                  <div className="librarian-table-cell">Book Details</div>
                  <div className="librarian-table-cell">Category</div>
                  <div className="librarian-table-cell">Availability</div>
                  <div className="librarian-table-cell">Actions</div>
                </div>
              </div>
              <div className="librarian-table-body">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="librarian-table-row">
                    <div
                      className="librarian-table-cell"
                      data-label="Book Details"
                    >
                      <div className="librarian-book-info">
                        <div className="librarian-book-icon">
                          <BookOpen size={24} />
                        </div>
                        <div className="librarian-book-details">
                          <h4>{book.title}</h4>
                          <p>by {book.author}</p>
                        </div>
                      </div>
                    </div>
                    <div className="librarian-table-cell" data-label="Category">
                      <span className="librarian-category-badge">
                        {book.category}
                      </span>
                    </div>
                    <div
                      className="librarian-table-cell"
                      data-label="Availability"
                    >
                      <div className="librarian-availability-display">
                        {renderAvailability(book.inventory)}
                      </div>
                    </div>
                    <div className="librarian-table-cell" data-label="Actions">
                      <div className="mobile-actions-section">
                        <div className="librarian-action-buttons">
                          <button
                            className="librarian-action-btn lend"
                            onClick={() => handleLendBook(book)}
                            title="Lend Book"
                            disabled={
                              !book.inventory || book.inventory.available === 0
                            }
                          >
                            <BookCheck size={16} />
                          </button>
                          <button
                            className="librarian-action-btn return"
                            onClick={() => handleReturnBook(book)}
                            title="Return Book"
                            disabled={
                              !book.inventory || book.inventory.borrowed === 0
                            }
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            className="librarian-action-btn inventory"
                            onClick={() => handleManageInventory(book)}
                            title="Manage Inventory"
                          >
                            <Package size={16} />
                          </button>
                          <button
                            className="librarian-action-btn view"
                            onClick={() => handleViewDetails(book)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="librarian-action-btn edit"
                            onClick={() => handleEditBook(book)}
                            title="Edit Book"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="librarian-action-btn delete"
                            onClick={() => handleDeleteBook(book)}
                            title="Delete Book"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredBooks.length === 0 && (
              <div className="librarian-no-content">
                <BookOpen size={64} />
                <h3>No books found</h3>
                <p>Try adjusting your search terms or add a new book.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Borrowing Records Tab */}
      {activeTab === "borrowing" && (
        <div className="librarian-tab-content">
          {/* Borrowing Records Controls */}
          <div className="librarian-controls-section">
            <div className="librarian-search-controls">
              <div className="librarian-search-box">
                <Search size={20} className="librarian-search-icon" />
                <input
                  type="text"
                  placeholder="Search by borrower name, student ID, department, or book title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="librarian-search-input"
                />
              </div>

              <div className="librarian-filters-group">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="librarian-filter-select"
                >
                  <option value="all">All Records</option>
                  <option value="active">Active Loans</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Borrowing Records Stats */}
          <div className="librarian-borrowing-stats">
            <div className="borrowing-stat-card active">
              <div className="stat-icon">
                <BookCheck size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {borrowingRecords.filter((r) => r.status === "active").length}
                </div>
                <div className="stat-title">Active Loans</div>
              </div>
            </div>
            <div className="borrowing-stat-card overdue">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {
                    borrowingRecords.filter(
                      (r) =>
                        r.status === "active" &&
                        new Date(r.dueDate) < new Date()
                    ).length
                  }
                </div>
                <div className="stat-title">Overdue</div>
              </div>
            </div>
            <div className="borrowing-stat-card returned">
              <div className="stat-icon">
                <RotateCcw size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {
                    borrowingRecords.filter((r) => r.status === "returned")
                      .length
                  }
                </div>
                <div className="stat-title">Returned</div>
              </div>
            </div>
            <div className="borrowing-stat-card total">
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{borrowingRecords.length}</div>
                <div className="stat-title">Total Records</div>
              </div>
            </div>
          </div>

          {/* Borrowing Records Table */}
          <div className="librarian-content-section">
            <div className="librarian-borrowing-table">
              <div className="librarian-table-header">
                <div className="librarian-table-row">
                  <div className="librarian-table-cell">Borrower Details</div>
                  <div className="librarian-table-cell">Book Information</div>
                  <div className="librarian-table-cell">Loan Details</div>
                  <div className="librarian-table-cell">Status</div>
                  <div className="librarian-table-cell">Actions</div>
                </div>
              </div>
              <div className="librarian-table-body">
                {getFilteredBorrowingRecords().map((record) => (
                  <div key={record.id} className="librarian-table-row">
                    <div
                      className="librarian-table-cell"
                      data-label="Borrower Details"
                    >
                      <div className="borrower-info">
                        <div className="borrower-icon">
                          <Users size={20} />
                        </div>
                        <div className="borrower-details">
                          <h4>{record.borrowerName}</h4>
                          <p>ID: {record.studentId}</p>
                          {record.department && (
                            <p>Dept: {record.department}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="librarian-table-cell"
                      data-label="Book Information"
                    >
                      <div className="book-info-minimal">
                        <div className="book-icon-small">
                          <BookOpen size={16} />
                        </div>
                        <div className="book-title-minimal">
                          <strong>{record.bookTitle}</strong>
                        </div>
                      </div>
                    </div>
                    <div
                      className="librarian-table-cell"
                      data-label="Loan Details"
                    >
                      <div className="loan-dates">
                        <div className="date-item">
                          <small>Borrowed:</small>
                          <span>{formatDate(record.borrowDate)}</span>
                        </div>
                        <div className="date-item">
                          <small>Due:</small>
                          <span
                            className={
                              new Date(record.dueDate) < new Date() &&
                              record.status === "active"
                                ? "overdue-date"
                                : ""
                            }
                          >
                            {formatDate(record.dueDate)}
                          </span>
                        </div>
                        {record.returnDate && (
                          <div className="date-item">
                            <small>Returned:</small>
                            <span>{formatDate(record.returnDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="librarian-table-cell" data-label="Status">
                      <div className="status-display">
                        {getBorrowingStatusBadge(record)}
                      </div>
                    </div>
                    <div className="librarian-table-cell" data-label="Actions">
                      <div className="mobile-actions-section">
                        <div className="librarian-action-buttons">
                          {record.status === "active" && (
                            <button
                              className="librarian-action-btn return"
                              onClick={() => handleReturnFromRecord(record)}
                              title="Return Book"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                          <button
                            className="librarian-action-btn view"
                            onClick={() => handleViewBorrowingDetails(record)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {record.status === "active" &&
                            new Date(record.dueDate) < new Date() && (
                              <button
                                className="librarian-action-btn edit"
                                onClick={() => handleExtendDueDate(record)}
                                title="Extend Due Date"
                              >
                                <Calendar size={16} />
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {getFilteredBorrowingRecords().length === 0 && (
              <div className="librarian-no-content">
                <Calendar size={64} />
                <h3>No borrowing records found</h3>
                <p>Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Book Modal */}
      {(showAddModal || showEditModal) && (
        <div className="librarian-modal-overlay" onClick={closeModal}>
          <div className="librarian-modal" onClick={(e) => e.stopPropagation()}>
            <div className="librarian-modal-header">
              <h2>{showAddModal ? "Add New Book" : "Edit Book"}</h2>
              <button onClick={closeModal} className="librarian-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="librarian-modal-content">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="librarian-form-grid">
                  <div className="librarian-form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="librarian-form-group">
                    <label htmlFor="author">Author *</label>
                    <input
                      type="text"
                      id="author"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="librarian-form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="librarian-form-group">
                    <label htmlFor="publisher">Publisher</label>
                    <input
                      type="text"
                      id="publisher"
                      value={formData.publisher}
                      onChange={(e) =>
                        setFormData({ ...formData, publisher: e.target.value })
                      }
                    />
                  </div>
                  {showAddModal && (
                    <div className="librarian-form-group">
                      <label htmlFor="totalCopies">Total Copies *</label>
                      <input
                        type="number"
                        id="totalCopies"
                        min="1"
                        value={formData.totalCopies}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalCopies: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="librarian-form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="4"
                  />
                </div>
              </form>
            </div>
            <div className="librarian-modal-actions">
              <button
                className="librarian-btn librarian-btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="librarian-btn librarian-btn-primary"
                onClick={handleSaveBook}
              >
                <Save size={16} />
                {showAddModal ? "Add Book" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {showDetailsModal && selectedBook && (
        <div className="librarian-modal-overlay" onClick={closeModal}>
          <div
            className="librarian-modal librarian-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="librarian-modal-header">
              <h2>Book Details</h2>
              <button onClick={closeModal} className="librarian-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="librarian-modal-content">
              <div className="librarian-book-details-grid">
                <div className="librarian-detail-item">
                  <strong>Title:</strong>
                  <span>{selectedBook.title}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Author:</strong>
                  <span>{selectedBook.author}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Category:</strong>
                  <span>{selectedBook.category}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Publisher:</strong>
                  <span>{selectedBook.publisher}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Pages:</strong>
                  <span>{selectedBook.pages}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Added Date:</strong>
                  <span>{formatDate(selectedBook.addedDate)}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Added By:</strong>
                  <span>{selectedBook.addedBy}</span>
                </div>
              </div>
              {selectedBook.description && (
                <div className="librarian-description-section">
                  <strong>Description:</strong>
                  <p>{selectedBook.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lend Book Modal */}
      {showLendModal && selectedBook && (
        <div className="librarian-modal-overlay" onClick={closeModal}>
          <div className="librarian-modal" onClick={(e) => e.stopPropagation()}>
            <div className="librarian-modal-header">
              <h2>Lend Book</h2>
              <button onClick={closeModal} className="librarian-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="librarian-modal-content">
              <div className="librarian-book-summary">
                <h3>{selectedBook.title}</h3>
                <p>by {selectedBook.author}</p>
                <div className="availability-info">
                  <span className="available-count">
                    {selectedBook.inventory.available} copies available
                  </span>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="librarian-form-grid">
                  <div className="librarian-form-group">
                    <label htmlFor="borrowerName">Borrower Name *</label>
                    <input
                      type="text"
                      id="borrowerName"
                      value={lendFormData.borrowerName}
                      onChange={(e) =>
                        setLendFormData({
                          ...lendFormData,
                          borrowerName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="librarian-form-group">
                    <label htmlFor="studentId">Student ID *</label>
                    <input
                      type="text"
                      id="studentId"
                      value={lendFormData.studentId}
                      onChange={(e) =>
                        setLendFormData({
                          ...lendFormData,
                          studentId: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="librarian-form-group">
                    <label htmlFor="department">Department *</label>
                    <select
                      id="department"
                      value={lendFormData.department}
                      onChange={(e) =>
                        setLendFormData({
                          ...lendFormData,
                          department: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Civil Engineering">
                        Civil Engineering
                      </option>
                      <option value="Computer Science & Engineering">
                        Computer Science & Engineering
                      </option>
                      <option value="Electrical & Electronic Engineering">
                        Electrical & Electronic Engineering
                      </option>
                      <option value="Mechanical Engineering">
                        Mechanical Engineering
                      </option>
                      <option value="Industrial & Production Engineering">
                        Industrial & Production Engineering
                      </option>
                      <option value="Chemical Engineering">
                        Chemical Engineering
                      </option>
                      <option value="Materials Science & Engineering">
                        Materials Science & Engineering
                      </option>
                      <option value="Ceramic & Metallurgical Engineering">
                        Ceramic & Metallurgical Engineering
                      </option>
                      <option value="Mechatronics Engineering">
                        Mechatronics Engineering
                      </option>
                      <option value="Architecture">Architecture</option>
                      <option value="Urban & Regional Planning">
                        Urban & Regional Planning
                      </option>
                      <option value="Building Engineering & Construction Management">
                        Building Engineering & Construction Management
                      </option>
                      <option value="Electrical & Computer Engineering">
                        Electrical & Computer Engineering
                      </option>
                      <option value="Electronics & Telecommunication Engineering">
                        Electronics & Telecommunication Engineering
                      </option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Humanities">Humanities</option>

                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>
                  <div className="librarian-form-group">
                    <label htmlFor="borrowDate">Borrow Date</label>
                    <input
                      type="date"
                      id="borrowDate"
                      value={lendFormData.borrowDate}
                      onChange={(e) =>
                        setLendFormData({
                          ...lendFormData,
                          borrowDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="librarian-form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      value={lendFormData.dueDate}
                      onChange={(e) =>
                        setLendFormData({
                          ...lendFormData,
                          dueDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="librarian-modal-actions">
              <button
                className="librarian-btn librarian-btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="librarian-btn librarian-btn-primary"
                onClick={handleLendSubmit}
              >
                <BookCheck size={16} />
                Lend Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Book Modal */}
      {showReturnModal && selectedBook && (
        <div className="librarian-modal-overlay" onClick={closeModal}>
          <div className="librarian-modal" onClick={(e) => e.stopPropagation()}>
            <div className="librarian-modal-header">
              <h2>Return Book</h2>
              <button onClick={closeModal} className="librarian-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="librarian-modal-content">
              <div className="librarian-book-summary">
                <h3>{selectedBook.title}</h3>
                <p>by {selectedBook.author}</p>
              </div>

              <h4>Active Borrowings:</h4>
              <div className="borrowing-list">
                {borrowingRecords
                  .filter(
                    (record) =>
                      record.bookId === selectedBook.id &&
                      record.status === "active"
                  )
                  .map((record) => (
                    <div key={record.id} className="borrowing-item">
                      <div className="borrower-info">
                        <strong>{record.borrowerName}</strong>
                        <span>ID: {record.studentId}</span>
                        {record.department && (
                          <span>Dept: {record.department}</span>
                        )}
                        <small>Due: {formatDate(record.dueDate)}</small>
                        {new Date(record.dueDate) < new Date() && (
                          <span className="overdue-badge">OVERDUE</span>
                        )}
                      </div>
                      <button
                        className="librarian-btn librarian-btn-primary"
                        onClick={() => handleReturnSubmit(record.id)}
                      >
                        <RotateCcw size={16} />
                        Return
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Management Modal */}
      {showInventoryModal && selectedBook && (
        <div className="librarian-modal-overlay" onClick={closeModal}>
          <div
            className="librarian-modal librarian-inventory-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="librarian-modal-header">
              <h2>Manage Inventory</h2>
              <button onClick={closeModal} className="librarian-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="librarian-modal-content">
              <div className="librarian-book-summary">
                <h3>{selectedBook.title}</h3>
                <p>by {selectedBook.author}</p>
              </div>

              {/* Current Inventory Overview */}
              <div className="inventory-overview">
                <h4>Current Inventory Status</h4>
                <div className="inventory-stats">
                  <div className="inventory-stat">
                    <span className="stat-label">Total Copies</span>
                    <span className="stat-value">
                      {selectedBook.inventory.total}
                    </span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Available</span>
                    <span className="stat-value available">
                      {selectedBook.inventory.available}
                    </span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Borrowed</span>
                    <span className="stat-value borrowed">
                      {selectedBook.inventory.borrowed}
                    </span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Damaged</span>
                    <span className="stat-value damaged">
                      {selectedBook.inventory.damaged}
                    </span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Lost</span>
                    <span className="stat-value lost">
                      {selectedBook.inventory.lost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inventory Actions */}
              <div className="inventory-actions">
                <h4>Inventory Actions</h4>

                {/* Add New Copies */}
                <div className="inventory-action-section">
                  <div className="action-header">
                    <Package className="action-icon" size={20} />
                    <h5>Add New Copies</h5>
                  </div>
                  <div className="action-form">
                    <div className="librarian-form-group">
                      <label>Number of copies to add:</label>
                      <input
                        type="number"
                        min="0"
                        value={inventoryFormData.addCopies}
                        onChange={(e) =>
                          setInventoryFormData({
                            ...inventoryFormData,
                            addCopies: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <button
                      className="librarian-btn librarian-btn-primary"
                      onClick={() => handleInventoryUpdate("addCopies")}
                      disabled={inventoryFormData.addCopies <= 0}
                    >
                      <Plus size={16} />
                      Add {inventoryFormData.addCopies} Copies
                    </button>
                  </div>
                </div>

                {/* Mark as Damaged */}
                <div className="inventory-action-section">
                  <div className="action-header">
                    <AlertCircle className="action-icon damaged" size={20} />
                    <h5>Mark as Damaged</h5>
                  </div>
                  <div className="action-form">
                    <div className="librarian-form-group">
                      <label>Number of copies to mark as damaged:</label>
                      <input
                        type="number"
                        min="0"
                        max={selectedBook.inventory.available}
                        value={inventoryFormData.markDamaged}
                        onChange={(e) =>
                          setInventoryFormData({
                            ...inventoryFormData,
                            markDamaged: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="librarian-form-group">
                      <label>Reason for damage:</label>
                      <textarea
                        value={inventoryFormData.reason}
                        onChange={(e) =>
                          setInventoryFormData({
                            ...inventoryFormData,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Describe the damage..."
                        rows="2"
                      />
                    </div>
                    <button
                      className="librarian-btn librarian-btn-warning"
                      onClick={() => handleInventoryUpdate("markDamaged")}
                      disabled={
                        inventoryFormData.markDamaged <= 0 ||
                        selectedBook.inventory.available === 0
                      }
                    >
                      <AlertCircle size={16} />
                      Mark {inventoryFormData.markDamaged} as Damaged
                    </button>
                  </div>
                </div>

                {/* Mark as Lost */}
                <div className="inventory-action-section">
                  <div className="action-header">
                    <X className="action-icon lost" size={20} />
                    <h5>Mark as Lost</h5>
                  </div>
                  <div className="action-form">
                    <div className="librarian-form-group">
                      <label>Number of copies to mark as lost:</label>
                      <input
                        type="number"
                        min="0"
                        max={selectedBook.inventory.available}
                        value={inventoryFormData.markLost}
                        onChange={(e) =>
                          setInventoryFormData({
                            ...inventoryFormData,
                            markLost: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="librarian-form-group">
                      <label>Reason for loss:</label>
                      <textarea
                        value={inventoryFormData.reason}
                        onChange={(e) =>
                          setInventoryFormData({
                            ...inventoryFormData,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Describe how the book was lost..."
                        rows="2"
                      />
                    </div>
                    <button
                      className="librarian-btn librarian-btn-danger"
                      onClick={() => handleInventoryUpdate("markLost")}
                      disabled={
                        inventoryFormData.markLost <= 0 ||
                        selectedBook.inventory.available === 0
                      }
                    >
                      <X size={16} />
                      Mark {inventoryFormData.markLost} as Lost
                    </button>
                  </div>
                </div>

                {/* Restore Damaged Books */}
                {selectedBook.inventory.damaged > 0 && (
                  <div className="inventory-action-section">
                    <div className="action-header">
                      <RotateCcw className="action-icon restore" size={20} />
                      <h5>Restore Damaged Books</h5>
                    </div>
                    <div className="action-form">
                      <p>Restore repaired books back to available inventory.</p>
                      <button
                        className="librarian-btn librarian-btn-success"
                        onClick={() => handleInventoryUpdate("restoreDamaged")}
                      >
                        <RotateCcw size={16} />
                        Restore 1 Damaged Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Borrowing Details Modal */}
      {showBorrowingDetailsModal && selectedBorrowingRecord && (
        <div className="librarian-modal-overlay" onClick={closeModal}>
          <div
            className="librarian-modal librarian-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="librarian-modal-header">
              <h2>Borrowing Record Details</h2>
              <button onClick={closeModal} className="librarian-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="librarian-modal-content">
              <div className="librarian-book-details-grid">
                <div className="librarian-detail-item">
                  <strong>Record ID:</strong>
                  <span>{selectedBorrowingRecord.id}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Book Title:</strong>
                  <span>{selectedBorrowingRecord.bookTitle}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Borrower Name:</strong>
                  <span>{selectedBorrowingRecord.borrowerName}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Student ID:</strong>
                  <span>{selectedBorrowingRecord.studentId}</span>
                </div>
                {selectedBorrowingRecord.department && (
                  <div className="librarian-detail-item">
                    <strong>Department:</strong>
                    <span>{selectedBorrowingRecord.department}</span>
                  </div>
                )}
                <div className="librarian-detail-item">
                  <strong>Borrow Date:</strong>
                  <span>{formatDate(selectedBorrowingRecord.borrowDate)}</span>
                </div>
                <div className="librarian-detail-item">
                  <strong>Due Date:</strong>
                  <span
                    className={
                      new Date(selectedBorrowingRecord.dueDate) < new Date() &&
                      selectedBorrowingRecord.status === "active"
                        ? "overdue-date"
                        : ""
                    }
                  >
                    {formatDate(selectedBorrowingRecord.dueDate)}
                  </span>
                </div>
                {selectedBorrowingRecord.returnDate && (
                  <div className="librarian-detail-item">
                    <strong>Return Date:</strong>
                    <span>
                      {formatDate(selectedBorrowingRecord.returnDate)}
                    </span>
                  </div>
                )}
                <div className="librarian-detail-item">
                  <strong>Status:</strong>
                  <span>
                    {getBorrowingStatusBadge(selectedBorrowingRecord)}
                  </span>
                </div>
              </div>

              {/* Calculate loan duration */}
              <div className="loan-duration-info">
                <strong>Loan Duration:</strong>
                <div className="duration-details">
                  {selectedBorrowingRecord.status === "returned" ? (
                    <span className="duration-completed">
                      {Math.ceil(
                        (new Date(selectedBorrowingRecord.returnDate) -
                          new Date(selectedBorrowingRecord.borrowDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days (Completed)
                    </span>
                  ) : (
                    <span className="duration-ongoing">
                      {Math.ceil(
                        (new Date() -
                          new Date(selectedBorrowingRecord.borrowDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days (Ongoing)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Due Date Modal */}
      {showExtendDueDateModal && selectedBorrowingRecord && (
        <div className="librarian-modal-overlay" onClick={closeModal}>
          <div className="librarian-modal" onClick={(e) => e.stopPropagation()}>
            <div className="librarian-modal-header">
              <h2>Extend Due Date</h2>
              <button onClick={closeModal} className="librarian-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="librarian-modal-content">
              <div className="librarian-book-summary">
                <h3>{selectedBorrowingRecord.bookTitle}</h3>
                <p>Borrower: {selectedBorrowingRecord.borrowerName}</p>
                <p>Student ID: {selectedBorrowingRecord.studentId}</p>
                <div className="current-due-date">
                  <strong>Current Due Date: </strong>
                  <span className="overdue-date">
                    {formatDate(selectedBorrowingRecord.dueDate)}
                  </span>
                  <span className="overdue-badge">
                    (Overdue by{" "}
                    {Math.ceil(
                      (new Date() - new Date(selectedBorrowingRecord.dueDate)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days)
                  </span>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="librarian-form-group">
                  <label htmlFor="newDueDate">New Due Date *</label>
                  <input
                    type="date"
                    id="newDueDate"
                    value={extendDueDateFormData.newDueDate}
                    onChange={(e) =>
                      setExtendDueDateFormData({
                        ...extendDueDateFormData,
                        newDueDate: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="librarian-form-group">
                  <label htmlFor="reason">Reason for Extension</label>
                  <textarea
                    id="reason"
                    value={extendDueDateFormData.reason}
                    onChange={(e) =>
                      setExtendDueDateFormData({
                        ...extendDueDateFormData,
                        reason: e.target.value,
                      })
                    }
                    placeholder="Explain why the due date is being extended..."
                    rows="3"
                  />
                </div>
              </form>
            </div>
            <div className="librarian-modal-actions">
              <button
                className="librarian-btn librarian-btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="librarian-btn librarian-btn-primary"
                onClick={handleExtendDueDateSubmit}
              >
                <Calendar size={16} />
                Extend Due Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBook && (
        <DeleteConfirmationModal
          book={selectedBook}
          activeBorrowings={borrowingRecords.filter(
            (record) =>
              record.bookId === selectedBook.id && record.status === "active"
          )}
          isOpen={showDeleteModal}
          onConfirm={confirmDeleteBook}
          onCancel={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default LibrarianDashboard;
