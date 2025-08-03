// Alternative simpler implementations for borrow functionality

// 1. EMAIL-BASED BORROWING
export const emailBorrowRequest = (book) => {
  const subject = `Book Borrowing Request: ${book.title}`;
  const body = `Dear Librarian,

I would like to request to borrow the following book:

Title: ${book.title}
Author: ${book.author}
Category: ${book.category}
Available Copies: ${book.inventory?.available || 0}

Please let me know the process for borrowing this book.

Thank you,
[Your Name]
[Your Student/Alumni ID]
[Your Contact Information]`;

  const mailtoUrl = `mailto:library@bzaruet.org?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl);
};

// 2. WHATSAPP-BASED BORROWING
export const whatsappBorrowRequest = (book) => {
  const message = `Hi! I'd like to borrow "${book.title}" by ${book.author}. ${
    book.inventory?.available || 0
  } copies are available. Please let me know the process. Thanks!`;
  const phoneNumber = "8801XXXXXXXXX"; // Replace with actual librarian WhatsApp number
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
};

// 3. SIMPLE CONTACT FORM REDIRECT
export const redirectToContactForm = (book) => {
  const params = new URLSearchParams({
    subject: "Book Borrowing Request",
    bookTitle: book.title,
    bookAuthor: book.author,
    bookId: book.id,
  });
  window.location.href = `/contact?${params.toString()}`;
};

// 4. PHONE CALL FUNCTION
export const callLibrarian = () => {
  window.open("tel:+8801XXXXXXXXX"); // Replace with actual number
};

// Usage in Books.jsx:
// Instead of opening the modal, you can use:
// onClick={() => emailBorrowRequest(book)}
// onClick={() => whatsappBorrowRequest(book)}
// onClick={() => redirectToContactForm(book)}
// onClick={() => callLibrarian()}
