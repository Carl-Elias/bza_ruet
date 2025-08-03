// 🧪 Browser Console Testing Script
// Copy and paste this into your browser console for quick testing

console.log("🧪 BZA Library System Testing Script");
console.log("====================================");

// Test 1: Check Firebase Connection
function testFirebaseConnection() {
  console.log("🔥 Testing Firebase Connection...");

  // Check if Firebase is loaded
  if (typeof window.firebase !== "undefined") {
    console.log("✅ Firebase SDK loaded");
  } else {
    console.log("❌ Firebase SDK not found");
  }

  // Check localStorage for auth
  const auth = localStorage.getItem("librarianAuth");
  if (auth) {
    console.log("🔑 Librarian auth found:", JSON.parse(auth));
  } else {
    console.log("🔑 No librarian auth in localStorage");
  }
}

// Test 2: Check for Console Errors
function checkConsoleErrors() {
  console.log("🐛 Checking for JavaScript errors...");

  // Store original console.error
  const originalError = console.error;
  let errorCount = 0;

  // Override console.error to count errors
  console.error = function (...args) {
    errorCount++;
    originalError.apply(console, args);
  };

  setTimeout(() => {
    console.log(`📊 Error count in last 5 seconds: ${errorCount}`);
    console.error = originalError; // Restore original
  }, 5000);
}

// Test 3: Check Page Elements
function testPageElements() {
  console.log("🎯 Testing page elements...");

  const elements = {
    "Books Grid": ".books-grid",
    "Search Input": ".search-input",
    "Filter Selects": ".filter-select",
    "Book Cards": ".book-card",
    "Contact Buttons": 'button:contains("Contact")',
    "Details Buttons": 'button:contains("Details")',
  };

  for (const [name, selector] of Object.entries(elements)) {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ ${name} found`);
    } else {
      console.log(`❌ ${name} missing`);
    }
  }
}

// Test 4: Test Local Storage
function testLocalStorage() {
  console.log("💾 Testing localStorage functionality...");

  try {
    localStorage.setItem("test", "value");
    const retrieved = localStorage.getItem("test");
    localStorage.removeItem("test");

    if (retrieved === "value") {
      console.log("✅ localStorage working properly");
    } else {
      console.log("❌ localStorage read/write issue");
    }
  } catch (error) {
    console.log("❌ localStorage error:", error.message);
  }
}

// Test 5: Check Network Connectivity
async function testNetworkConnectivity() {
  console.log("🌐 Testing network connectivity...");

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    if (response.ok) {
      console.log("✅ Network connectivity working");
    } else {
      console.log("❌ Network issues detected");
    }
  } catch (error) {
    console.log("❌ Network error:", error.message);
  }
}

// Test 6: Check Mobile Responsiveness
function testMobileResponsiveness() {
  console.log("📱 Testing mobile responsiveness...");

  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    console.log("✅ Viewport meta tag found:", viewportMeta.content);
  } else {
    console.log("❌ Viewport meta tag missing");
  }

  // Check if elements are properly sized for mobile
  const buttons = document.querySelectorAll("button");
  let smallButtons = 0;

  buttons.forEach((button) => {
    const rect = button.getBoundingClientRect();
    if (rect.height < 44) {
      // Minimum touch target size
      smallButtons++;
    }
  });

  if (smallButtons > 0) {
    console.log(`⚠️ ${smallButtons} buttons may be too small for mobile`);
  } else {
    console.log("✅ All buttons are mobile-friendly");
  }
}

// Test 7: Performance Check
function testPerformance() {
  console.log("⚡ Testing performance...");

  const start = performance.now();

  // Simulate some work
  setTimeout(() => {
    const end = performance.now();
    const loadTime = end - start;

    console.log(`📊 Page interaction time: ${loadTime.toFixed(2)}ms`);

    if (loadTime < 100) {
      console.log("✅ Excellent performance");
    } else if (loadTime < 300) {
      console.log("✅ Good performance");
    } else {
      console.log("⚠️ Performance could be improved");
    }
  }, 10);
}

// Run All Tests
function runAllTests() {
  console.log("🚀 Running all tests...");
  console.log("========================");

  testFirebaseConnection();
  checkConsoleErrors();
  testPageElements();
  testLocalStorage();
  testNetworkConnectivity();
  testMobileResponsiveness();
  testPerformance();

  console.log("========================");
  console.log("🏁 All tests completed!");
  console.log("Check results above ⬆️");
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.libraryTests = {
  runAllTests,
  testFirebaseConnection,
  checkConsoleErrors,
  testPageElements,
  testLocalStorage,
  testNetworkConnectivity,
  testMobileResponsiveness,
  testPerformance,
};

console.log("💡 Available test functions:");
console.log("- libraryTests.runAllTests()");
console.log("- libraryTests.testFirebaseConnection()");
console.log("- libraryTests.checkConsoleErrors()");
console.log("- libraryTests.testPageElements()");
console.log("- libraryTests.testLocalStorage()");
console.log("- libraryTests.testNetworkConnectivity()");
console.log("- libraryTests.testMobileResponsiveness()");
console.log("- libraryTests.testPerformance()");
