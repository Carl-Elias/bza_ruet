# 🧪 Test Data Setup for Library Management System

## 📚 Sample Books to Add (for comprehensive testing)

Use these in the Librarian Dashboard to create a diverse test dataset:

### Book 1: Available Book

```
Title: Introduction to Data Structures
Author: Dr. Rahman Ahmed
Category: Computer Science
Publisher: Academic Press Bangladesh
Year: 2023
Description: Comprehensive guide to data structures and algorithms for computer science students.
Total Copies: 5
```

### Book 2: Partially Borrowed Book

```
Title: Engineering Mathematics
Author: Prof. Mahmud Hassan
Category: Engineering
Publisher: RUET Publications
Year: 2022
Description: Advanced mathematical concepts for engineering students covering calculus, linear algebra, and differential equations.
Total Copies: 3
```

### Book 3: All Copies Borrowed

```
Title: Bangladeshi Literature Anthology
Author: Dr. Fatima Khatun
Category: Literature
Publisher: Bangla Academy
Year: 2024
Description: Collection of modern Bangladeshi short stories and poems from contemporary writers.
Total Copies: 2
```

### Book 4: Single Copy Book

```
Title: Civil Engineering Handbook
Author: Eng. Abdul Karim
Category: Civil Engineering
Publisher: Engineering Books Ltd
Year: 2021
Description: Comprehensive handbook covering structural design, construction management, and building codes.
Total Copies: 1
```

### Book 5: Research Book

```
Title: Machine Learning Applications in Bangladesh
Author: Dr. Sarah Islam
Category: Computer Science
Publisher: Tech Research Publications
Year: 2024
Description: Cutting-edge research on ML applications in local industries and agriculture.
Total Copies: 4
```

## 🔄 Testing Scenarios

### Scenario 1: Fresh Database Test

1. Start with empty Firebase collections
2. Add the books above one by one
3. Test each step of the process
4. Verify real-time updates on public page

### Scenario 2: Borrowing Operations Test

1. Lend 2 copies of "Engineering Mathematics" to different borrowers:

   ```
   Borrower 1:
   - Name: Ahmed Hassan
   - Student ID: 1803045
   - Due Date: 2 weeks from today

   Borrower 2:
   - Name: Fatima Rahman
   - Student ID: 1903032
   - Due Date: 2 weeks from today
   ```

2. Lend both copies of "Bangladeshi Literature Anthology":

   ```
   Borrower 1:
   - Name: Karim Uddin
   - Student ID: 1703018
   - Due Date: 2 weeks from today

   Borrower 2:
   - Name: Rashida Begum
   - Student ID: 1803067
   - Due Date: 2 weeks from today
   ```

3. Lend the single copy of "Civil Engineering Handbook":
   ```
   Borrower:
   - Name: Nazrul Islam
   - Student ID: 1903089
   - Due Date: 2 weeks from today
   ```

### Scenario 3: Return Testing

1. Return one copy of "Engineering Mathematics"
2. Verify inventory updates correctly
3. Check book appears as partially available

### Scenario 4: Inventory Management Test

1. Add 2 more copies to "Introduction to Data Structures"
2. Mark 1 copy as damaged
3. Mark 1 copy as lost
4. Verify stats update correctly

## 🔍 Search & Filter Test Cases

### Search Terms to Test:

- "data" (should find "Data Structures")
- "Rahman" (should find books by both Rahman authors)
- "Engineering" (should find multiple books)
- "2024" (should find books from 2024)
- "xyz123" (should show no results)
- "" (empty - should show all)

### Filter Combinations to Test:

1. **Category: Computer Science, Status: Available**
2. **Category: Engineering, Status: Borrowed**
3. **Category: All, Status: Available**
4. **Category: Literature, Status: All**

## 📱 Contact Modal Test Cases

### Test Email Generation:

1. Select "Introduction to Data Structures"
2. Click "Contact Librarian"
3. Click "Email Librarian"
4. Verify email contains:
   - Subject: "Book Borrowing Request: Introduction to Data Structures"
   - Book details in body
   - Professional format
   - Availability information

### Test Phone Call:

1. Click "Call Librarian"
2. Verify phone dialer opens (or appropriate action)
3. Check correct phone number

## 🔐 Authentication Test Cases

### Password Tests:

- Correct: `bza_lib_2024`
- Incorrect: `wrong_password`
- Empty field
- Special characters: `bza@lib#2024`

### Session Tests:

1. Login → Close tab → Reopen → Should stay logged in
2. Login → Wait (modify expiry for quick test) → Should logout
3. Logout → Try direct access → Should require re-login

## 🐛 Error Scenarios to Test

### Network Issues:

1. Disconnect internet while adding book
2. Reconnect and verify behavior
3. Test with slow network (throttle in dev tools)

### Invalid Data:

1. Try negative numbers for total copies
2. Submit form with only spaces in required fields
3. Enter extremely long text (1000+ characters)

### Firebase Errors:

1. Temporarily modify Firebase rules to block access
2. Verify error handling is graceful
3. Restore rules and verify recovery

## 📊 Expected Results After Full Test

After running all tests, you should have:

### Books Collection:

- 5 books with different availability statuses
- Various categories represented
- Different inventory levels

### Borrowing Records:

- 5 active borrowing records
- 1 returned record
- Different borrowers and due dates

### Public Page Should Show:

- **Total Books**: 5
- **Total Copies**: 15 (or adjusted based on inventory changes)
- **Available Copies**: Varies based on borrowings
- **Categories**: 4 different categories

### Search Results:

- All search terms should return expected results
- Filters should work correctly with test data
- No console errors

## 🚀 Quick Setup Commands

```javascript
// Sample data object for quick Firebase import (if needed)
const testBooks = [
  {
    title: "Introduction to Data Structures",
    author: "Dr. Rahman Ahmed",
    category: "Computer Science",
    publisher: "Academic Press Bangladesh",
    year: "2023",
    description:
      "Comprehensive guide to data structures and algorithms for computer science students.",
    addedBy: "Test Admin",
    addedDate: new Date().toISOString(),
    inventory: {
      total: 5,
      available: 5,
      borrowed: 0,
      damaged: 0,
      lost: 0,
    },
  },
  // ... add other books
];
```

## ✅ Testing Completion Checklist

- [ ] All 5 test books added successfully
- [ ] Borrowing operations completed
- [ ] Return operations tested
- [ ] Inventory management verified
- [ ] Search functionality confirmed
- [ ] Filter combinations tested
- [ ] Authentication scenarios completed
- [ ] Contact modal functionality verified
- [ ] Error handling tested
- [ ] Mobile responsiveness confirmed
- [ ] Real-time sync verified
- [ ] No console errors found

**🎯 Ready for deployment when all checkboxes are complete!**
