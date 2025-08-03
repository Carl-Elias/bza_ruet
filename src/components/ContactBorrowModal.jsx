import { X, Mail, Phone } from "lucide-react";
import "./ContactBorrowModal.css";

const ContactBorrowModal = ({ book, isOpen, onClose }) => {
  if (!isOpen || !book) return null;

  const handleEmailLibrarian = () => {
    const subject = `Book Borrowing Request: ${book.title}`;
    const body = `Dear BZA Librarian,

I hope this message finds you well.

I would like to request to borrow the following book from the BZA Library:

📚 Book Details:
• Title: ${book.title}
• Author: ${book.author}
• Category: ${book.category}
• Publisher: ${book.publisher}
• Publication Year: ${book.year}
• Available Copies: ${book.inventory?.available || 0} out of ${
      book.inventory?.total || 0
    }

📝 Borrower Information:
Please let me know what information you need from me to process this borrowing request, such as:
• Student/Alumni ID
• Contact details
• Preferred pickup time
• Any other requirements

I understand the library rules regarding borrowing period (14 days) and late return fines. I am committed to returning the book on time and in good condition.

Please let me know the next steps and when I can collect the book.

Thank you for maintaining such a wonderful resource for our BZA community.

Best regards,
[Your Name]
[Your Student/Alumni ID]
[Your Phone Number]
[Your Department/Batch]

---
This request was generated from the BZA Library website.`;

    const mailtoUrl = `mailto:library@bzaruet.org?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    onClose();
  };

  const handleCallLibrarian = () => {
    // You can replace this with the actual librarian's phone number
    const phoneNumber = "tel:+8801XXXXXXXXX"; // Replace with actual number
    window.open(phoneNumber);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="contact-borrow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Contact Librarian</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* Book Info */}
          <div className="book-info-section">
            <h3>Book Request</h3>
            <div className="book-summary">
              <strong>{book.title}</strong>
              <span>by {book.author}</span>
              <span className="availability-info">
                {book.inventory?.available > 0
                  ? `${book.inventory.available} copies available`
                  : "Currently unavailable"}
              </span>
            </div>
          </div>

          {/* Contact Options */}
          <div className="contact-options">
            <h3>Choose your preferred contact method:</h3>

            <div className="contact-buttons">
              <button
                className="contact-btn email-btn"
                onClick={handleEmailLibrarian}
              >
                <Mail size={24} />
                <div className="btn-content">
                  <span className="btn-title">Email Librarian</span>
                  <span className="btn-description">
                    Send a pre-filled email with book details
                  </span>
                </div>
              </button>

              <button
                className="contact-btn phone-btn"
                onClick={handleCallLibrarian}
              >
                <Phone size={24} />
                <div className="btn-content">
                  <span className="btn-title">Call Librarian</span>
                  <span className="btn-description">
                    Speak directly with the librarian
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <h4>📋 What to expect:</h4>
            <ul>
              <li>
                <strong>Email:</strong> Opens your email client with a
                pre-filled professional message
              </li>
              <li>
                <strong>Call:</strong> Direct phone connection to discuss
                availability and pickup
              </li>
              <li>
                <strong>Response:</strong> The librarian will get back to you
                within 24 hours
              </li>
              <li>
                <strong>Pickup:</strong> Books can be collected during library
                hours
              </li>
            </ul>
          </div>

          <div className="library-hours">
            <h4>📅 Library Hours:</h4>
            <p>
              Monday - Friday: 9:00 AM - 6:00 PM
              <br />
              Saturday: 10:00 AM - 4:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBorrowModal;
