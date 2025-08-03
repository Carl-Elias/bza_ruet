import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  User,
  Calendar,
  Download,
  Filter,
  ExternalLink,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { libraryService } from "./services/libraryService";
import ContactBorrowModal from "../components/ContactBorrowModal";
import "./Books.css";

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [bookToContact, setBookToContact] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingRecords, setBorrowingRecords] = useState([]);

  // Load books and borrowing records from Firebase
  useEffect(() => {
    let booksUnsubscribe;
    let borrowingRecordsUnsubscribe;

    const setupRealtimeListeners = async () => {
      try {
        // Subscribe to books
        booksUnsubscribe = libraryService.books.subscribeToBooks(
          (booksData) => {
            setBooks(booksData);
            setLoading(false);
          }
        );

        // Subscribe to borrowing records to get current status
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
  }, []);

  // Process books with current borrowing status
  const processedBooks = books.map((book) => {
    // Find active borrowing records for this book
    const activeBorrowings = borrowingRecords.filter(
      (record) => record.bookId === book.id && record.status === "active"
    );

    // Determine availability based on inventory and active borrowings
    const hasAvailableCopies = book.inventory && book.inventory.available > 0;
    const hasBorrowedCopies = book.inventory && book.inventory.borrowed > 0;

    // A book is considered "borrowed" if it has any borrowed copies
    // A book is considered "available" if it has available copies (even if some are borrowed)
    const status = hasBorrowedCopies ? "borrowed" : "available";

    // Get borrowing information if book is borrowed
    const currentBorrowing = activeBorrowings[0]; // Get first active borrowing

    return {
      ...book,
      status: status,
      borrowedBy: currentBorrowing?.borrowerName || null,
      dueDate: currentBorrowing?.dueDate || null,
      activeBorrowingsCount: activeBorrowings.length,
      hasAvailableCopies: hasAvailableCopies,
    };
  });

  // Generate categories dynamically from books
  const categories = [
    { value: "all", label: "All Categories" },
    ...Array.from(new Set(books.map((book) => book.category)))
      .filter(Boolean)
      .map((category) => ({ value: category, label: category })),
  ];

  const statusOptions = [
    { value: "all", label: "All Books" },
    { value: "available", label: "Available" },
    { value: "borrowed", label: "Borrowed" },
  ];

  const filteredBooks = processedBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    // Updated status filtering logic
    let matchesStatus = true;
    if (selectedStatus === "available") {
      // Show books that have available copies (even if some are borrowed)
      matchesStatus = book.hasAvailableCopies;
    } else if (selectedStatus === "borrowed") {
      // Show books that have any borrowed copies
      matchesStatus = book.inventory && book.inventory.borrowed > 0;
    }
    // "all" shows everything, so matchesStatus remains true

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate dynamic library stats
  const libraryStats = [
    {
      label: "Total Books",
      value: books.length.toString(),
      icon: BookOpen,
    },
    {
      label: "Total Copies",
      value: books
        .reduce((sum, book) => sum + (book.inventory?.total || 0), 0)
        .toString(),
      icon: BookOpen,
    },
    {
      label: "Available Copies",
      value: books
        .reduce((sum, book) => sum + (book.inventory?.available || 0), 0)
        .toString(),
      icon: Download,
    },
    {
      label: "Categories",
      value: new Set(books.map((book) => book.category)).size.toString(),
      icon: Filter,
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openDetailsModal = (book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBook(null);
  };

  const openBorrowingModal = (book) => {
    setBookToContact(book);
    setShowContactModal(true);
  };

  const closeBorrowingModal = () => {
    setShowContactModal(false);
    setBookToContact(null);
  };

  const BookCard = ({ book }) => (
    <div className={`book-card ${book.status}`}>
      <div className="book-cover">
        <BookOpen size={40} className="book-icon" />
        <div className="book-status-badge">
          {book.inventory?.available > 0
            ? `${book.inventory.available} Available`
            : book.inventory?.borrowed > 0
            ? `${book.inventory.borrowed} Borrowed`
            : "No Copies"}
        </div>
      </div>

      <div className="book-content">
        <div className="book-header">
          <h3 className="book-title">{book.title}</h3>
        </div>

        <div className="book-meta">
          <div className="book-author">
            <User size={14} />
            <span>{book.author}</span>
          </div>
          <div className="book-category">
            <Filter size={14} />
            <span>{book.category}</span>
          </div>
          <div className="book-year">
            <Calendar size={14} />
            <span>{book.year}</span>
          </div>
        </div>

        <p className="book-description">{book.description}</p>

        <div className="book-details">
          <div className="book-detail">
            <strong>Publisher:</strong> {book.publisher}
          </div>
          {book.inventory && (
            <div className="book-detail inventory-info">
              <strong>Inventory:</strong> {book.inventory.available} available
              of {book.inventory.total} total
            </div>
          )}
        </div>

        <div className="book-actions">
          {book.hasAvailableCopies ? (
            <button
              className="btn btn-primary"
              onClick={() => openBorrowingModal(book)}
            >
              <Download size={16} />
              Contact Librarian
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
              All Copies Borrowed
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={() => openDetailsModal(book)}
          >
            <ExternalLink size={16} />
            Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="books">
      {/* Header Section */}
      <section className="books-header">
        <div className="books-header-container">
          <h1 className="books-title">BZA Library</h1>
          <p className="books-subtitle">
            Access our comprehensive collection of books, journals, and
            resources. Building knowledge and supporting academic excellence for
            our community.
          </p>

          <div className="library-stats">
            {libraryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="library-stat">
                  <Icon size={24} className="stat-icon" />
                  <div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label_modify">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="books-filters">
        <div className="filters-container">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search books by title, author, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="books-grid-section">
        <div className="books-container">
          {loading ? (
            <div className="loading-state">
              <BookOpen size={64} className="loading-icon" />
              <h3>Loading books...</h3>
              <p>Please wait while we fetch the latest collection.</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="no-books">
              <BookOpen size={64} className="no-books-icon" />
              <h3>No books found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Library Info */}
      <section className="library-info">
        <div className="library-info-container">
          <div className="info-content">
            <h2>About BZA Library</h2>
            <div className="info-grid">
              <div className="info-item">
                <h3>Our Mission</h3>
                <p>
                  To provide comprehensive access to academic and cultural
                  resources that support the educational and personal
                  development of BZA members.
                </p>
              </div>
              <div className="info-item">
                <h3>Library Rules</h3>
                <ul>
                  <li>Books can be borrowed for up to 14 days</li>
                  <li>Maximum 3 books per member at a time</li>
                  <li>Late returns incur a fine of 5 Taka per day</li>
                  <li>Damaged books must be replaced</li>
                </ul>
              </div>
              <div className="info-item">
                <h3>How to Borrow</h3>
                <ol>
                  <li>Search for your desired book</li>
                  <li>Contact the library committee</li>
                  <li>Provide your student/alumni ID</li>
                  <li>Sign the borrowing register</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="books-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Contribute to Our Library</h2>
            <p>
              Help us expand our collection! Donate books or suggest new titles
              that would benefit our community.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">
                <BookOpen size={20} />
                Donate Books
              </a>
              <a href="/contact" className="btn btn-outline">
                Suggest a Book
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Book Details Modal */}
      {showDetailsModal && selectedBook && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Details</h2>
              <button onClick={closeDetailsModal} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              <div className="book-profile">
                <div className="book-cover-large">
                  <BookOpen size={80} className="book-icon-large" />
                </div>

                <div className="book-info-main">
                  <h3 className="book-title-large">{selectedBook.title}</h3>
                  <p className="book-author-large">by {selectedBook.author}</p>
                </div>
              </div>

              <div className="book-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <Filter size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">
                      {selectedBook.category}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Publisher</span>
                    <span className="detail-value">
                      {selectedBook.publisher}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Publication Year</span>
                    <span className="detail-value">{selectedBook.year}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Download size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Availability</span>
                    <span
                      className={`detail-value status-${selectedBook.status}`}
                    >
                      {selectedBook.inventory
                        ? `${selectedBook.inventory.available} of ${selectedBook.inventory.total} available`
                        : selectedBook.status === "available"
                        ? "Available"
                        : "Borrowed"}
                    </span>
                  </div>
                </div>

                {selectedBook.inventory && (
                  <div className="detail-item">
                    <div className="detail-icon">
                      <BookOpen size={20} />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Total Copies</span>
                      <span className="detail-value">
                        {selectedBook.inventory.total}
                        {selectedBook.inventory.borrowed > 0 &&
                          ` (${selectedBook.inventory.borrowed} borrowed)`}
                        {selectedBook.inventory.damaged > 0 &&
                          ` (${selectedBook.inventory.damaged} damaged)`}
                        {selectedBook.inventory.lost > 0 &&
                          ` (${selectedBook.inventory.lost} lost)`}
                      </span>
                    </div>
                  </div>
                )}

                {selectedBook.status === "borrowed" &&
                  selectedBook.activeBorrowingsCount > 0 && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <User size={20} />
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Active Borrowings</span>
                        <span className="detail-value">
                          {selectedBook.activeBorrowingsCount} borrower(s)
                        </span>
                      </div>
                    </div>
                  )}

                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Added Date</span>
                    <span className="detail-value">
                      {formatDate(selectedBook.addedDate)}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Added By</span>
                    <span className="detail-value">{selectedBook.addedBy}</span>
                  </div>
                </div>
              </div>

              {selectedBook.description && (
                <div className="description-section">
                  <h4>Description</h4>
                  <p>{selectedBook.description}</p>
                </div>
              )}

              <div className="modal-actions">
                {selectedBook.inventory?.available > 0 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      closeDetailsModal();
                      openBorrowingModal(selectedBook);
                    }}
                  >
                    <Download size={16} />
                    Contact for Borrowing ({
                      selectedBook.inventory.available
                    }{" "}
                    available)
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    All Copies Currently Borrowed
                  </button>
                )}
                <a href="/contact" className="btn btn-outline">
                  Contact Librarian
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Librarian Modal */}
      <ContactBorrowModal
        book={bookToContact}
        isOpen={showContactModal}
        onClose={closeBorrowingModal}
      />
    </div>
  );
};

export default Books;
