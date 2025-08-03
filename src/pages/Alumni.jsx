import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Briefcase,
  Mail,
  Users,
  GraduationCap,
  UserPlus,
  Loader,
  Eye,
  X,
  Phone,
  Globe,
  Building,
} from "lucide-react";
import { alumniService } from "./services/firebase";
import "./Alumni.css";

const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load approved alumni data from Firebase
  useEffect(() => {
    const loadApprovedAlumni = async () => {
      try {
        setLoading(true);
        console.log("Loading approved alumni...");
        const result = await alumniService.getAlumniByStatus("approved");

        console.log("Firebase result:", result);

        if (result.success) {
          console.log("Alumni data received:", result.data);
          console.log("Number of approved alumni:", result.data.length);
          setAlumni(result.data);
        } else {
          console.error("Failed to load alumni:", result.error);
          // Fallback to mock data if Firebase fails
          setAlumni([]);
        }
      } catch (error) {
        console.error("Error loading alumni:", error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    loadApprovedAlumni();
  }, []);

  // Generate dynamic batch list from actual alumni data
  const availableBatches = [...new Set(alumni.map((person) => person.batch))]
    .filter((batch) => batch) // Remove any null/undefined batches
    .sort((a, b) => parseInt(a) - parseInt(b)); // Sort chronologically

  const batches = ["all", ...availableBatches];

  const filteredAlumni = alumni
    .filter((person) => {
      const matchesSearch =
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentPosition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBatch =
        selectedBatch === "all" || person.batch === selectedBatch;
      return matchesSearch && matchesBatch;
    })
    .sort((a, b) => {
      // Primary sort: by batch (chronologically, oldest first)
      const batchA = parseInt(a.batch) || 0;
      const batchB = parseInt(b.batch) || 0;
      if (batchA !== batchB) {
        return batchA - batchB;
      }
      // Secondary sort: by name (alphabetically) within same batch
      return a.name.localeCompare(b.name);
    });

  // Handle modal functions
  const openModal = (alumniData) => {
    setSelectedAlumni(alumniData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAlumni(null);
  };

  const stats = [
    { label: "Total Alumni", value: "200+", icon: GraduationCap },
    { label: "Countries", value: "15+", icon: MapPin },
    { label: "Companies", value: "100+", icon: Briefcase },
    { label: "Active Members", value: "150+", icon: Users },
  ];

  return (
    <div className="alumni">
      {/* Header Section */}
      <section className="alumni-header">
        <div className="alumni-header-container">
          <h1 className="alumni-title">Alumni Network</h1>
          <p className="alumni-subtitle">
            Connect with fellow Bogura district graduates who have made their
            mark in various fields around the world. Our alumni community spans
            across continents and industries.
          </p>

          <div className="alumni-stats">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="alumni-stat">
                  <Icon size={24} className="stat-icon" />
                  <div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label_modify">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="alumni-filters">
        <div className="filters-container">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, department, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="batch-filter">
            <label htmlFor="batch-select" className="filter-label">
              Filter by Series:
            </label>
            <select
              id="batch-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="batch-select"
            >
              <option value="all">All Series</option>
              {availableBatches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch} Series
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="alumni-grid-section">
        <div className="alumni-container">
          {loading ? (
            <div className="loading-container">
              <Loader className="loading-spinner" />
              <p>Loading approved alumni...</p>
            </div>
          ) : filteredAlumni.length > 0 ? (
            <div className="alumni-grid">
              {filteredAlumni.map((person) => (
                <div key={person.id} className="alumni-card">
                  <div className="alumni-avatar">
                    {person.profileImage ? (
                      <img
                        src={person.profileImage}
                        alt={person.name}
                        className="profile-image"
                      />
                    ) : (
                      <Users size={40} />
                    )}
                  </div>

                  <div className="alumni-info">
                    <h3 className="alumni-name">{person.name}</h3>
                    <p className="alumni-position">
                      {person.currentPosition}
                      {person.company && ` at ${person.company}`}
                    </p>
                    <p className="alumni-department">{person.department}</p>

                    <div className="alumni-details">
                      <div className="alumni-detail">
                        <Calendar size={16} />
                        <span>{person.batch} Series</span>
                      </div>
                      <div className="alumni-detail">
                        <MapPin size={16} />
                        <span>{person.workLocation || person.location}</span>
                      </div>
                      <div className="alumni-detail">
                        <GraduationCap size={16} />
                        <span>Graduated {person.graduationYear}</span>
                      </div>
                    </div>

                    <div className="alumni-actions">
                      <button
                        onClick={() => openModal(person)}
                        className="details-btn"
                        title="View Details"
                      >
                        <Eye size={16} />
                        Details
                      </button>
                      <a
                        href={`mailto:${person.email}`}
                        className="contact-btn"
                        title="Send Email"
                      >
                        <Mail size={16} />
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Users size={64} className="no-results-icon" />
              <h3>No alumni found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="alumni-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Join Our Alumni Network</h2>
            <p>
              Are you a RUET graduate from Bogura? Join our growing community
              and help connect with current students and fellow alumni.
            </p>
            <Link to="/alumni/register" className="btn btn-primary">
              <UserPlus size={20} />
              Register as Alumni
            </Link>
          </div>
        </div>
      </section>

      {/* Alumni Details Modal */}
      {showModal && selectedAlumni && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="alumni-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Alumni Details</h2>
              <button onClick={closeModal} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              <div className="alumni-profile">
                <div className="profile-avatar">
                  {selectedAlumni.profileImage ? (
                    <img
                      src={selectedAlumni.profileImage}
                      alt={selectedAlumni.name}
                      className="profile-image-large"
                    />
                  ) : (
                    <Users size={80} />
                  )}
                </div>

                <div className="profile-info">
                  <h3 className="profile-name">{selectedAlumni.name}</h3>
                  <p className="profile-position">
                    {selectedAlumni.currentPosition}
                    {selectedAlumni.company && ` at ${selectedAlumni.company}`}
                  </p>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <GraduationCap size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">
                      {selectedAlumni.department}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Batch</span>
                    <span className="detail-value">
                      Batch {selectedAlumni.batch}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Graduation Year</span>
                    <span className="detail-value">
                      {selectedAlumni.graduationYear}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Work Location</span>
                    <span className="detail-value">
                      {selectedAlumni.workLocation ||
                        selectedAlumni.location ||
                        "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Mail size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedAlumni.email}</span>
                  </div>
                </div>

                {selectedAlumni.phone && (
                  <div className="detail-item">
                    <div className="detail-icon">
                      <Phone size={20} />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">
                        {selectedAlumni.phone}
                      </span>
                    </div>
                  </div>
                )}

                {selectedAlumni.company && (
                  <div className="detail-item">
                    <div className="detail-icon">
                      <Building size={20} />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Company</span>
                      <span className="detail-value">
                        {selectedAlumni.company}
                      </span>
                    </div>
                  </div>
                )}

                {selectedAlumni.website && (
                  <div className="detail-item">
                    <div className="detail-icon">
                      <Globe size={20} />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Website</span>
                      <a
                        href={selectedAlumni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-link"
                      >
                        {selectedAlumni.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {selectedAlumni.bio && (
                <div className="bio-section">
                  <h4>About</h4>
                  <p>{selectedAlumni.bio}</p>
                </div>
              )}

              <div className="modal-actions">
                <a
                  href={`mailto:${selectedAlumni.email}`}
                  className="btn btn-primary"
                >
                  <Mail size={16} />
                  Send Email
                </a>
                {selectedAlumni.phone && (
                  <a
                    href={`tel:${selectedAlumni.phone}`}
                    className="btn btn-secondary"
                  >
                    <Phone size={16} />
                    Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumni;
