import { useState, useEffect } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { alumniService, statsService } from "../services/firebase";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load stats
      const statsResult = await statsService.getAlumniStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Load alumni based on status filter
      let alumniResult;
      if (selectedStatus === "all") {
        alumniResult = await alumniService.getAllAlumni();
      } else {
        alumniResult = await alumniService.getAlumniByStatus(selectedStatus);
      }

      if (alumniResult.success) {
        setAlumni(alumniResult.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (alumniId, newStatus, note = "") => {
    try {
      const result = await alumniService.updateAlumniStatus(
        alumniId,
        newStatus,
        note
      );
      if (result.success) {
        loadData(); // Refresh data
        setShowModal(false);
        setSelectedAlumni(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (alumniId) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        const result = await alumniService.deleteAlumni(alumniId);
        if (result.success) {
          loadData(); // Refresh data
        }
      } catch (error) {
        console.error("Error deleting alumni:", error);
        alert("Failed to delete registration");
      }
    }
  };

  const filteredAlumni = alumni.filter(
    (alumnus) =>
      alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "pending":
        return "status-pending";
      default:
        return "status-pending";
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <RefreshCw className="loading-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Alumni Registration Dashboard</h1>
        <button onClick={loadData} className="refresh-btn">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <Users size={24} />
          <div className="stat-info">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Registrations</span>
          </div>
        </div>
        <div className="stat-card pending">
          <Clock size={24} />
          <div className="stat-info">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending Review</span>
          </div>
        </div>
        <div className="stat-card approved">
          <CheckCircle size={24} />
          <div className="stat-info">
            <span className="stat-number">{stats.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        <div className="stat-card rejected">
          <XCircle size={24} />
          <div className="stat-info">
            <span className="stat-number">{stats.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-controls">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <Filter size={18} />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="alumni-table-container">
        <table className="alumni-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Registration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlumni.map((alumnus) => (
              <tr key={alumnus.id}>
                <td>{alumnus.name}</td>
                <td>{alumnus.email}</td>
                <td>{alumnus.department}</td>
                <td>{alumnus.batch}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(alumnus.status)}`}
                  >
                    {alumnus.status.charAt(0).toUpperCase() +
                      alumnus.status.slice(1)}
                  </span>
                </td>
                <td>{formatDate(alumnus.registrationDate)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setSelectedAlumni(alumnus);
                        setShowModal(true);
                      }}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(alumnus.id)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAlumni.length === 0 && (
          <div className="no-data">
            <p>No alumni registrations found.</p>
          </div>
        )}
      </div>

      {/* Modal for viewing alumni details */}
      {showModal && selectedAlumni && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Alumni Details</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="alumni-details">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <p>
                    <strong>Name:</strong> {selectedAlumni.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedAlumni.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedAlumni.phone}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedAlumni.location}
                  </p>
                </div>
                <div className="detail-section">
                  <h3>Academic Details</h3>
                  <p>
                    <strong>Department:</strong> {selectedAlumni.department}
                  </p>
                  <p>
                    <strong>Batch:</strong> {selectedAlumni.batch}
                  </p>
                  <p>
                    <strong>Graduation Year:</strong>{" "}
                    {selectedAlumni.graduationYear}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {selectedAlumni.studentId}
                  </p>
                </div>
                <div className="detail-section">
                  <h3>Professional Information</h3>
                  <p>
                    <strong>Current Position:</strong>{" "}
                    {selectedAlumni.currentPosition}
                  </p>
                  <p>
                    <strong>Company:</strong> {selectedAlumni.company}
                  </p>
                  <p>
                    <strong>Work Location:</strong>{" "}
                    {selectedAlumni.workLocation}
                  </p>
                  <p>
                    <strong>Experience:</strong> {selectedAlumni.workExperience}
                  </p>
                </div>
              </div>
              <div className="modal-actions">
                {selectedAlumni.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedAlumni.id, "approved")
                      }
                      className="approve-btn"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedAlumni.id, "rejected")
                      }
                      className="reject-btn"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
