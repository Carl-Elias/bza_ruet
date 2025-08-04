import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Building,
  Camera,
  Linkedin,
  Github,
  Twitter,
  ArrowLeft,
  CheckCircle,
  Loader,
} from "lucide-react";
import { alumniService } from "./services/firebase";
import "./AlumniRegister.css";

const AlumniRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    location: "",
    profileImage: null,

    // Academic Details
    batch: "",
    department: "",
    studentId: "",

    // Professional Information
    currentPosition: "",
    company: "",
    workLocation: "",
    workExperience: "",

    // Social Links
    linkedin: "",
    github: "",
    twitter: "",
    website: "",

    // Additional Info
    bio: "",
    achievements: "",
  });

  const departments = [
    "Computer Science & Engineering",
    "Electrical & Electronic Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Materials Science & Engineering",
    "Industrial & Production Engineering",
    "Mechatronics Engineering",
    "Glass & Ceramic Engineering",
    "Urban & Regional Planning",
    "Building Engineering & Construction Management",
    "Architecture",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Electronics & Telecommunication Engineering",
    "Electrical & Computer Engineering",
    "Humanities",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Starting registration process...");
      console.log("Form data:", formData);

      // Validate required fields
      const requiredFields = ["name", "email", "department", "batch"];
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === "") {
          throw new Error(`${field} is required`);
        }
      }

      // Check image size (Base64 should be less than 1MB for Firestore)
      if (formData.profileImage && formData.profileImage.length > 1000000) {
        throw new Error(
          "Profile image is too large. Please choose a smaller image."
        );
      }

      // Prepare alumni data for Firebase
      const alumniData = {
        ...formData,
        // Ensure all fields are properly formatted
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
      };

      console.log("Submitting data to Firebase:", alumniData);

      // Register alumni in Firebase
      const result = await alumniService.registerAlumni(alumniData);

      console.log("Firebase result:", result);

      if (result.success) {
        console.log("Registration successful!");
        setSubmitSuccess(true);

        // Redirect to alumni page after 2 seconds
        setTimeout(() => {
          navigate("/alumni");
        }, 5000);
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="alumni-register">
        <div className="success-container">
          <div className="success-content">
            <CheckCircle size={64} className="success-icon" />
            <h1>Registration Successful!</h1>

            <p>Welcome to the BZA RUET Alumni Network! Your Profile will be added to alumni page after approval.</p>
            <p>You will be redirected to the alumni directory shortly...</p>
            <Link to="/alumni" className="btn btn-primary">
              View Alumni Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="alumni-register">
      <div className="register-container">
        <div className="register-header">
          <Link to="/alumni" className="back-link">
            <ArrowLeft size={20} />
            Back to Alumni
          </Link>
          <h1 className="register-title">Join Alumni Network</h1>
          <p className="register-subtitle">
            Register to connect with fellow BZA RUET alumni and expand your
            professional network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">
              <User size={24} />
              Personal Information
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <div className="input-with-icon">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="input-with-icon">
                  <Phone size={20} className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Current Location
                </label>
                <div className="input-with-icon">
                  <MapPin size={20} className="input-icon" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profileImage" className="form-label">
                Profile Photo ( Your profile photo must be less than 1MB )
              </label>
              <div className="image-upload">
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  onChange={handleImageChange}
                  className="image-input"
                  accept="image/*"
                />
                <label htmlFor="profileImage" className="image-upload-label">
                  <Camera size={24} />
                  {formData.profileImage ? "Change Photo" : "Upload Photo"}
                </label>
                {formData.profileImage && (
                  <div className="image-preview">
                    <img src={formData.profileImage} alt="Profile Preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="form-section">
            <h2 className="section-title">
              <GraduationCap size={24} />
              Academic Details
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="batch" className="form-label">
                  Series *
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="e.g., 2018"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="studentId" className="form-label">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 1803XXX"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="form-section">
            <h2 className="section-title">
              <Briefcase size={24} />
              Professional Information
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="currentPosition" className="form-label">
                  Current Position
                </label>
                <input
                  type="text"
                  id="currentPosition"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  Company/Organization
                </label>
                <div className="input-with-icon">
                  <Building size={20} className="input-icon" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="workLocation" className="form-label">
                  Work Location
                </label>
                <input
                  type="text"
                  id="workLocation"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="City, Country"
                />
              </div>

              <div className="form-group">
                <label htmlFor="workExperience" className="form-label">
                  Years of Experience
                </label>
                <input
                  type="text"
                  id="workExperience"
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 3 years"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="form-section">
            <h2 className="section-title">
              <Linkedin size={24} />
              Social Links
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="linkedin" className="form-label">
                  LinkedIn Profile
                </label>
                <div className="input-with-icon">
                  <Linkedin size={20} className="input-icon" />
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="github" className="form-label">
                  GitHub Profile
                </label>
                <div className="input-with-icon">
                  <Github size={20} className="input-icon" />
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="twitter" className="form-label">
                  Twitter/X Profile
                </label>
                <div className="input-with-icon">
                  <Twitter size={20} className="input-icon" />
                  <input
                    type="url"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="website" className="form-label">
                  Personal Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h2 className="section-title">Additional Information</h2>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Bio/About
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                placeholder="Tell us about yourself, your interests, and what you're working on..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="achievements" className="form-label">
                Notable Achievements
              </label>
              <textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
                placeholder="Awards, publications, certifications, or other achievements..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Registering...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Register as Alumni
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlumniRegister;
