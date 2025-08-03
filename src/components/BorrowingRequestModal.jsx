import { useState } from "react";
import { X, User, Mail, Phone, Calendar, BookOpen, Send } from "lucide-react";
import { libraryService } from "../pages/services/libraryService";
import "./BorrowingRequestModal.css";

const BorrowingRequestModal = ({ book, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    borrowerName: "",
    email: "",
    phone: "",
    studentId: "",
    department: "",
    requestDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const departments = [
    "Computer Science and Engineering",
    "Electrical and Electronic Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Industrial and Production Engineering",
    "Materials Science and Engineering",
    "Architecture",
    "Urban and Regional Planning",
    "Building Engineering and Construction Management",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        ...formData,
        status: "pending",
        requestDate: new Date().toISOString(),
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Save to Firebase (you'll need to add this to libraryService)
      const response = await libraryService.borrowingRequests.addRequest(
        requestData
      );

      if (response.success) {
        setSuccess(true);
        // Send email notification to librarian (optional)
        await sendNotificationEmail(requestData);

        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            borrowerName: "",
            email: "",
            phone: "",
            studentId: "",
            department: "",
            requestDate: new Date().toISOString().split("T")[0],
            notes: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting borrowing request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendNotificationEmail = async (requestData) => {
    // This would integrate with your email service
    const emailBody = `
New Book Borrowing Request

Book: ${requestData.bookTitle} by ${requestData.bookAuthor}
Requested by: ${requestData.borrowerName}
Email: ${requestData.email}
Phone: ${requestData.phone}
Student ID: ${requestData.studentId}
Department: ${requestData.department}
Request Date: ${new Date(requestData.requestDate).toLocaleDateString()}
Notes: ${requestData.notes}

Please review this request in the Librarian Dashboard.
    `;

    // You could use EmailJS or similar service here
    console.log("Email notification:", emailBody);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="borrowing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request to Borrow Book</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        {success ? (
          <div className="success-message">
            <BookOpen size={64} className="success-icon" />
            <h3>Request Submitted Successfully!</h3>
            <p>
              Your borrowing request has been sent to the librarian. You will be
              contacted within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="book-info-bar">
              <BookOpen size={20} />
              <div>
                <strong>{book.title}</strong> by {book.author}
                <span className="availability">
                  ({book.inventory?.available || 0} copies available)
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="borrowing-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="borrowerName">
                    <User size={16} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="borrowerName"
                    name="borrowerName"
                    value={formData.borrowerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="studentId">
                    <BookOpen size={16} />
                    Student/Alumni ID *
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1803001"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="department">
                  <BookOpen size={16} />
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">
                  <Calendar size={16} />
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any specific requirements or pickup preferences..."
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowingRequestModal;
