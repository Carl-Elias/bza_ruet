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
} from "lucide-react";
import { alumniService } from "../services/firebase";
import "./Alumni.css";

const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const batches = [
    "all",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
  ];

  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.currentPosition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch =
      selectedBatch === "all" || person.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

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
                    <div className="stat-label">{stat.label}</div>
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
              Filter by Batch:
            </label>
            <select
              id="batch-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="batch-select"
            >
              <option value="all">All Batches</option>
              {batches.slice(1).map((batch) => (
                <option key={batch} value={batch}>
                  Batch {batch}
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
                        <span>Batch {person.batch}</span>
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
    </div>
  );
};

export default Alumni;
