import { useState } from "react";
import { Eye, EyeOff, Shield, User } from "lucide-react";
import "./AdminAuth.css";

const AdminAuth = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin password - you can change this or make it more secure
  const ADMIN_PASSWORD = "bza_admin_2024"; // Change this to your desired password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store authentication in localStorage (expires in 24 hours)
        const authData = {
          authenticated: true,
          timestamp: new Date().getTime(),
          expiresIn: 24 * 60 * 60 * 1000, // 24 hours
        };
        localStorage.setItem("adminAuth", JSON.stringify(authData));
        onAuthenticated(true);
      } else {
        setError(
          "Incorrect password. Please contact the system administrator."
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
    <div className="admin-auth">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">
            <Shield size={32} />
          </div>
          <h1>Admin Dashboard Access</h1>
          <p>Enter the admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Authenticating...
              </>
            ) : (
              <>
                <Shield size={20} />
                Access Admin Dashboard
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            🔒 This area is restricted to authorized administrators only.
            <br />
            If you don't have access, please contact the system administrator.
          </p>
          <a href="/" className="back-link">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

// Utility function to check if admin is authenticated
export const checkAdminAuth = () => {
  try {
    const authData = localStorage.getItem("adminAuth");
    if (!authData) return false;

    const parsed = JSON.parse(authData);
    const now = new Date().getTime();

    // Check if authentication has expired
    if (now - parsed.timestamp > parsed.expiresIn) {
      localStorage.removeItem("adminAuth");
      return false;
    }

    return parsed.authenticated;
  } catch (error) {
    console.error("Error checking admin authentication:", error);
    return false;
  }
};

// Utility function to logout admin
export const logoutAdmin = () => {
  localStorage.removeItem("adminAuth");
  window.location.href = "/";
};

export default AdminAuth;
