# 🧪 BZA Library Management System - Complete Testing Guide

## 📋 Pre-Deployment Testing Checklist

### 🔥 **Firebase Configuration Test**

- [ ] Check Firebase project connection in browser dev tools
- [ ] Verify Firestore rules allow read/write operations
- [ ] Test data persistence after page refresh
- [ ] Confirm environment variables are properly set

---

## 🌐 **Public Books Page Testing**

### **📚 Basic Page Load**

- [ ] Navigate to `/books`
- [ ] Verify page loads without errors (check browser console)
- [ ] Confirm library stats display correctly (Total Books, Copies, etc.)
- [ ] Check if real data loads from Firebase (not mock data)

### **🔍 Search & Filter Testing**

- [ ] **Search Functionality:**

  - [ ] Search by book title (partial and full matches)
  - [ ] Search by author name
  - [ ] Search by category
  - [ ] Test with special characters and numbers
  - [ ] Verify case-insensitive search
  - [ ] Test empty search (should show all books)

- [ ] **Category Filter:**

  - [ ] Select "All Categories"
  - [ ] Test each individual category
  - [ ] Verify categories populate dynamically from Firebase data
  - [ ] Check filter with empty results

- [ ] **Status Filter:**
  - [ ] Select "All Books"
  - [ ] Select "Available" (should show books with available copies)
  - [ ] Select "Borrowed" (should show books with borrowed copies)
  - [ ] Verify correct book counts for each filter

### **📖 Book Cards Testing**

- [ ] **Visual Display:**

  - [ ] Book title displays correctly
  - [ ] Author, category, and year show properly
  - [ ] Description truncates appropriately
  - [ ] Publisher information displays
  - [ ] Inventory info shows correct available/total counts

- [ ] **Status Badges:**

  - [ ] "X Available" for books with available copies
  - [ ] "X Borrowed" for books with all copies borrowed
  - [ ] "No Copies" for books with zero inventory

- [ ] **Action Buttons:**
  - [ ] "Contact Librarian" appears for available books
  - [ ] "All Copies Borrowed" appears (disabled) for unavailable books
  - [ ] "Details" button works for all books

### **📋 Book Details Modal Testing**

- [ ] **Modal Opening/Closing:**

  - [ ] Click "Details" button opens modal
  - [ ] Click outside modal closes it
  - [ ] Click X button closes modal
  - [ ] Modal prevents background scrolling

- [ ] **Information Display:**

  - [ ] Book title and author display correctly
  - [ ] All metadata shows properly (category, publisher, year, etc.)
  - [ ] Availability status shows correct information
  - [ ] Total copies breakdown (borrowed/damaged/lost) displays
  - [ ] Active borrowings count (if applicable)
  - [ ] Added date and "Added By" information
  - [ ] Description section appears when available

- [ ] **Modal Actions:**
  - [ ] "Contact for Borrowing" button (for available books)
  - [ ] "All Copies Currently Borrowed" (disabled for unavailable)
  - [ ] "Contact Librarian" link works

### **📞 Contact Borrowing Modal Testing**

- [ ] **Modal Trigger:**

  - [ ] Opens from "Contact Librarian" button on book cards
  - [ ] Opens from "Contact for Borrowing" in details modal

- [ ] **Contact Options:**

  - [ ] **Email Option:**

    - [ ] Click "Email Librarian" opens email client
    - [ ] Pre-filled subject line includes book title
    - [ ] Pre-filled body includes all book details
    - [ ] Professional message format
    - [ ] Correct recipient email address

  - [ ] **Phone Option:**
    - [ ] Click "Call Librarian" initiates phone call
    - [ ] Correct phone number (update in code if needed)

- [ ] **UI Elements:**
  - [ ] Book information displays correctly
  - [ ] Availability info shows current stock
  - [ ] Library hours information
  - [ ] "Back to Library" link works
  - [ ] Modal closes after selecting option

### **📱 Mobile Responsiveness**

- [ ] Test on phone screen (320px-480px)
- [ ] Test on tablet screen (768px-1024px)
- [ ] Verify all buttons are touchable (minimum 44px)
- [ ] Check text readability on small screens
- [ ] Confirm modals work properly on mobile

---

## 🔐 **Librarian Authentication Testing**

### **🚪 Access Control**

- [ ] Navigate to `/librarian` directly
- [ ] Verify authentication screen appears
- [ ] Confirm public Books page has NO librarian dashboard link
- [ ] Test unauthorized access prevention

### **🔑 Login Process**

- [ ] **Correct Password:**

  - [ ] Enter correct password: `bza_lib_2024`
  - [ ] Click "Access Dashboard"
  - [ ] Verify successful authentication
  - [ ] Check dashboard loads properly

- [ ] **Incorrect Password:**

  - [ ] Enter wrong password
  - [ ] Verify error message appears
  - [ ] Check password field clears
  - [ ] Confirm no access granted

- [ ] **UI Elements:**
  - [ ] Password visibility toggle works
  - [ ] Loading state during verification
  - [ ] Responsive design on mobile
  - [ ] "Back to Library" link works

### **⏰ Session Management**

- [ ] **Session Persistence:**
  - [ ] Login and refresh page
  - [ ] Verify you stay logged in
  - [ ] Check localStorage contains auth data
- [ ] **Session Expiry (Optional - 24hr test):**
  - [ ] Modify expiry time in code for testing
  - [ ] Wait for session to expire
  - [ ] Verify automatic logout

---

## 🏪 **Librarian Dashboard Testing**

### **📊 Dashboard Load**

- [ ] Dashboard loads after authentication
- [ ] Stats display correctly
- [ ] Navigation tabs work (Books, Borrowing Records, etc.)
- [ ] Logout button appears in header

### **📚 Books Management**

- [ ] **Add New Book:**

  - [ ] Click "Add New Book" button
  - [ ] Fill all required fields
  - [ ] Test form validation (empty fields)
  - [ ] Submit form and verify book appears in list
  - [ ] Check book appears on public Books page
  - [ ] Verify Firebase data persistence

- [ ] **Edit Book:**

  - [ ] Click edit button on existing book
  - [ ] Modify information
  - [ ] Save changes
  - [ ] Verify updates appear immediately
  - [ ] Check changes persist after page refresh

- [ ] **Delete Book:**

  - [ ] Click delete button
  - [ ] Confirm deletion dialog
  - [ ] Verify book removes from list
  - [ ] Check book no longer appears on public page

- [ ] **Inventory Management:**
  - [ ] Test "Manage Inventory" button
  - [ ] Add copies to inventory
  - [ ] Mark copies as damaged/lost
  - [ ] Verify inventory counts update correctly
  - [ ] Check stats reflect changes

### **📝 Borrowing Records Management**

- [ ] **Lend Book:**

  - [ ] Click "Lend" button on available book
  - [ ] Fill borrower information
  - [ ] Set due date
  - [ ] Submit and verify record creation
  - [ ] Check available inventory decreases
  - [ ] Verify borrowed inventory increases

- [ ] **Return Book:**

  - [ ] Find active borrowing record
  - [ ] Click "Return" button
  - [ ] Confirm return
  - [ ] Verify record status changes to "returned"
  - [ ] Check inventory counts update
  - [ ] Confirm book shows as available again

- [ ] **Search Borrowing Records:**
  - [ ] Test search by borrower name
  - [ ] Test search by book title
  - [ ] Filter by status (active/returned)
  - [ ] Verify search results accuracy

### **🔄 Real-time Synchronization**

- [ ] **Cross-tab Testing:**
  - [ ] Open librarian dashboard in one tab
  - [ ] Open public books page in another
  - [ ] Add/edit book in dashboard
  - [ ] Verify changes appear on public page immediately
  - [ ] Test borrowing operations sync

### **🚪 Logout Function**

- [ ] Click "Logout" button
- [ ] Verify redirect to books page
- [ ] Check localStorage auth data removed
- [ ] Try accessing `/librarian` - should require re-authentication

---

## 🐛 **Error Handling & Edge Cases**

### **🌐 Network Issues**

- [ ] Disable internet connection
- [ ] Verify graceful error handling
- [ ] Check fallback behavior
- [ ] Test offline functionality

### **📊 Empty Data States**

- [ ] **No Books:**

  - [ ] Test with empty Firebase collection
  - [ ] Verify "No books found" message
  - [ ] Check search with no results

- [ ] **No Borrowing Records:**
  - [ ] Test with no borrowing history
  - [ ] Verify appropriate empty state

### **🔍 Invalid Inputs**

- [ ] **Forms:**

  - [ ] Submit forms with empty required fields
  - [ ] Test with extremely long text
  - [ ] Try special characters and numbers
  - [ ] Test negative numbers for inventory

- [ ] **Search:**
  - [ ] Search with very long strings
  - [ ] Search with only special characters
  - [ ] Test SQL injection patterns (should be safe with Firebase)

### **📱 Browser Compatibility**

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Check mobile browsers

---

## 🚀 **Performance Testing**

### **⚡ Load Times**

- [ ] Measure initial page load time
- [ ] Test with slow network (throttle in dev tools)
- [ ] Check loading states appear appropriately
- [ ] Verify images and assets load properly

### **📊 Data Handling**

- [ ] Test with large number of books (50+)
- [ ] Test with many borrowing records
- [ ] Check search performance with large dataset
- [ ] Verify pagination if implemented

---

## 🔍 **Console Testing**

### **🐛 Error Checking**

- [ ] Open browser developer tools
- [ ] Check Console tab for any errors
- [ ] Look for network failures in Network tab
- [ ] Verify no Firebase security rule violations

---

## ✅ **Final Deployment Checklist**

- [ ] All tests above completed successfully
- [ ] Firebase project configured for production
- [ ] Contact information updated (email, phone)
- [ ] Librarian password changed from default
- [ ] Environment variables set correctly
- [ ] All console errors resolved
- [ ] Mobile responsiveness confirmed
- [ ] Cross-browser compatibility verified

---

## 🛠️ **Quick Test Commands**

```bash
# Start development server
npm run dev

# Check for build errors
npm run build

# Preview production build
npm run preview
```

---

## 📞 **Test Scenarios to Run**

1. **Complete User Journey:**

   - Browse books → Search → View details → Contact librarian

2. **Complete Librarian Workflow:**

   - Login → Add book → Lend book → Return book → Logout

3. **Real-time Sync Test:**

   - Two browser tabs → Make changes in dashboard → Verify public page updates

4. **Mobile Experience:**
   - Complete user journey on mobile device

---

**🎯 Success Criteria:** All checkboxes above should be ✅ before deployment!

Let me know if you find any issues during testing - I'll help you fix them immediately!
