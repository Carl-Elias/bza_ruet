import { AlertTriangle, Trash2, X, User, Calendar } from "lucide-react";
import "./DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({
  book,
  activeBorrowings = [],
  isOpen,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen || !book) return null;

  const hasActiveBorrowings = activeBorrowings.length > 0;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="delete-confirmation-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-header">
          <div className="delete-warning-icon">
            <AlertTriangle size={32} />
          </div>
          <h2>Delete Book Confirmation</h2>
          <button onClick={onCancel} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="delete-modal-content">
          {/* Book Information */}
          <div className="book-to-delete">
            <h3>You are about to delete:</h3>
            <div className="book-info">
              <strong>{book.title}</strong>
              <span>by {book.author}</span>
              <span>Category: {book.category}</span>
              <span>Total Copies: {book.inventory?.total || 0}</span>
            </div>
          </div>

          {/* Warning Section */}
          {hasActiveBorrowings ? (
            <div className="danger-warning">
              <AlertTriangle size={20} />
              <div className="warning-content">
                <h4>⚠️ Critical Warning</h4>
                <p>
                  This book has{" "}
                  <strong>{activeBorrowings.length} active borrowing(s)</strong>
                  . Deleting it will also remove all associated borrowing
                  records.
                </p>
              </div>
            </div>
          ) : (
            <div className="info-warning">
              <AlertTriangle size={20} />
              <div className="warning-content">
                <h4>Permanent Deletion</h4>
                <p>
                  This will permanently remove the book and all its data from
                  the system.
                </p>
              </div>
            </div>
          )}

          {/* Active Borrowings List */}
          {hasActiveBorrowings && (
            <div className="active-borrowings">
              <h4>Active Borrowers:</h4>
              <div className="borrowers-list">
                {activeBorrowings.map((record, index) => (
                  <div key={record.id} className="borrower-item">
                    <User size={16} />
                    <div className="borrower-info">
                      <strong>{record.borrowerName}</strong>
                      <span>ID: {record.studentId}</span>
                      <div className="due-date">
                        <Calendar size={14} />
                        Due: {new Date(record.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consequences */}
          <div className="deletion-consequences">
            <h4>This action will:</h4>
            <ul>
              <li>❌ Permanently delete the book from the library</li>
              <li>❌ Remove all inventory records</li>
              {hasActiveBorrowings && (
                <li>
                  ❌ Delete {activeBorrowings.length} active borrowing record(s)
                </li>
              )}
              <li>❌ Cannot be undone</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="confirmation-section">
            <p>
              {hasActiveBorrowings
                ? "Are you absolutely sure you want to proceed with this deletion?"
                : "Are you sure you want to delete this book?"}
            </p>
          </div>
        </div>

        <div className="delete-modal-actions">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? (
              <>Deleting...</>
            ) : (
              <>
                <Trash2 size={16} />
                {hasActiveBorrowings ? "Delete Book & Records" : "Delete Book"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
