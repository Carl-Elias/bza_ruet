import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import "./LibrarianAuth.css";

const LibrarianAuth = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // You can change this password or make it more secure
  const LIBRARIAN_PASSWORD = "bza_lib_2024"; // Change this to your desired password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === LIBRARIAN_PASSWORD) {
        // Store authentication in localStorage (expires in 24 hours)
        const authData = {
          authenticated: true,
          timestamp: new Date().getTime(),
          expiresIn: 24 * 60 * 60 * 1000, // 24 hours
        };
        localStorage.setItem("librarianAuth", JSON.stringify(authData));
        onAuthenticated(true);
      } else {
        setError(
          "Incorrect password. Please contact the library administrator."
        );
        setPassword("");
      }
      setLoading(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="librarian-auth">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">
            <Lock size={32} />
          </div>
          <h1>Librarian Access</h1>
          <p>Enter the password to access the librarian dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">
              <User size={16} />
              Librarian Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter librarian password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <Lock size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || !password}
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            🔒 This area is restricted to authorized library staff only.
            <br />
            If you don't have access, please contact the library administrator.
          </p>
          <a href="/books" className="back-link">
            ← Back to Library
          </a>
        </div>
      </div>
    </div>
  );
};

// Utility function to check if user is authenticated
export const checkLibrarianAuth = () => {
  try {
    const authData = localStorage.getItem("librarianAuth");
    if (!authData) return false;

    const parsed = JSON.parse(authData);
    const now = new Date().getTime();

    // Check if authentication has expired
    if (now - parsed.timestamp > parsed.expiresIn) {
      localStorage.removeItem("librarianAuth");
      return false;
    }

    return parsed.authenticated;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Utility function to logout
export const logoutLibrarian = () => {
  localStorage.removeItem("librarianAuth");
  window.location.href = "/books";
};

export default LibrarianAuth;
