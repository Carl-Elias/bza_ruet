import { useState } from "react";
import {
  Search,
  BookOpen,
  User,
  Calendar,
  Download,
  Filter,
  Star,
  ExternalLink,
} from "lucide-react";
import "./Books.css";

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock books data
  const books = [
    {
      id: 1,
      title: "Engineering Mathematics Volume 1",
      author: "B.S. Grewal",
      category: "Engineering",
      isbn: "978-8173716126",
      publisher: "Khanna Publishers",
      year: 2019,
      pages: 1232,
      status: "available",
      borrowedBy: null,
      dueDate: null,
      rating: 4.5,
      description:
        "Comprehensive mathematics textbook for engineering students covering calculus, differential equations, and more.",
      coverImage: null,
      addedDate: "2024-01-15",
      addedBy: "BZA Library Committee",
    },
    {
      id: 2,
      title: "Fundamentals of Computer Programming with C#",
      author: "Svetlin Nakov",
      category: "Computer Science",
      isbn: "978-9544007737",
      publisher: "Faber Publishing",
      year: 2018,
      pages: 1132,
      status: "borrowed",
      borrowedBy: "Md. Rahman Ahmed",
      dueDate: "2025-02-15",
      rating: 4.3,
      description:
        "Complete guide to programming fundamentals using C# programming language.",
      coverImage: null,
      addedDate: "2024-02-20",
      addedBy: "CSE Department",
    },
    {
      id: 3,
      title: "Strength of Materials",
      author: "R.K. Bansal",
      category: "Civil Engineering",
      isbn: "978-8131808825",
      publisher: "Laxmi Publications",
      year: 2020,
      pages: 864,
      status: "available",
      borrowedBy: null,
      dueDate: null,
      rating: 4.7,
      description:
        "Comprehensive study of mechanics of materials for civil engineering students.",
      coverImage: null,
      addedDate: "2024-03-10",
      addedBy: "Civil Engineering Department",
    },
    {
      id: 4,
      title: "Digital Signal Processing",
      author: "John G. Proakis",
      category: "Electrical Engineering",
      isbn: "978-0131873742",
      publisher: "Pearson",
      year: 2021,
      pages: 1024,
      status: "available",
      borrowedBy: null,
      dueDate: null,
      rating: 4.4,
      description:
        "Advanced concepts in digital signal processing with practical applications.",
      coverImage: null,
      addedDate: "2024-04-05",
      addedBy: "EEE Department",
    },
    {
      id: 5,
      title: "Manufacturing Processes",
      author: "Kalpakjian & Schmid",
      category: "Mechanical Engineering",
      isbn: "978-0134290553",
      publisher: "Pearson",
      year: 2019,
      pages: 1248,
      status: "borrowed",
      borrowedBy: "Fatima Khatun",
      dueDate: "2025-02-20",
      rating: 4.6,
      description:
        "Comprehensive coverage of manufacturing processes and materials technology.",
      coverImage: null,
      addedDate: "2024-05-12",
      addedBy: "ME Department",
    },
    {
      id: 6,
      title: "Bangla Sahityer Itihas",
      author: "Dr. Muhammad Shahidullah",
      category: "Literature",
      isbn: "978-9844120234",
      publisher: "Bangla Academy",
      year: 2018,
      pages: 456,
      status: "available",
      borrowedBy: null,
      dueDate: null,
      rating: 4.8,
      description:
        "History of Bengali literature by renowned scholar Dr. Muhammad Shahidullah.",
      coverImage: null,
      addedDate: "2024-06-01",
      addedBy: "BZA Cultural Committee",
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Engineering", label: "Engineering" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Civil Engineering", label: "Civil Engineering" },
    { value: "Electrical Engineering", label: "Electrical Engineering" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Literature", label: "Literature" },
  ];

  const statusOptions = [
    { value: "all", label: "All Books" },
    { value: "available", label: "Available" },
    { value: "borrowed", label: "Borrowed" },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || book.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const libraryStats = [
    { label: "Total Books", value: "500+", icon: BookOpen },
    { label: "Active Members", value: "150+", icon: User },
    { label: "Books Borrowed", value: "200+", icon: Download },
    { label: "Categories", value: "25+", icon: Filter },
  ];

  const formatDate = (dateString) => {
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

  const BookCard = ({ book }) => (
    <div className={`book-card ${book.status}`}>
      <div className="book-cover">
        <BookOpen size={40} className="book-icon" />
        <div className="book-status-badge">
          {book.status === "available" ? "Available" : "Borrowed"}
        </div>
      </div>

      <div className="book-content">
        <div className="book-header">
          <h3 className="book-title">{book.title}</h3>
          <div className="book-rating">
            {renderStars(book.rating)}
            <span className="rating-text">({book.rating})</span>
          </div>
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
            <strong>ISBN:</strong> {book.isbn}
          </div>
          <div className="book-detail">
            <strong>Publisher:</strong> {book.publisher}
          </div>
          <div className="book-detail">
            <strong>Pages:</strong> {book.pages}
          </div>
          {book.status === "borrowed" && (
            <div className="book-detail borrowed-info">
              <strong>Borrowed by:</strong> {book.borrowedBy}
              <br />
              <strong>Due Date:</strong> {formatDate(book.dueDate)}
            </div>
          )}
        </div>

        <div className="book-actions">
          {book.status === "available" ? (
            <button className="btn btn-primary">
              <Download size={16} />
              Borrow Book
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
              Currently Borrowed
            </button>
          )}
          <button className="btn btn-outline">
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
          {filteredBooks.length > 0 ? (
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
    </div>
  );
};

export default Books;
