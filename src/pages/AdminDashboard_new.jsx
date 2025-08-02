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
  Calendar,
  Megaphone,
  Plus,
  Edit,
  Settings,
  BarChart3,
  Save,
  X,
} from "lucide-react";
import { alumniService, statsService } from "../services/firebase";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
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

  // Event management state
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "general",
    status: "upcoming",
  });

  // Announcement management state
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    status: "active",
    category: "general",
  });

  useEffect(() => {
    loadData();
    loadEvents();
    loadAnnouncements();
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

  const loadEvents = async () => {
    // Mock events data for now
    setEvents([
      {
        id: 1,
        title: "Annual Alumni Meetup 2025",
        description: "Join us for our annual alumni gathering",
        date: "2025-03-15",
        time: "10:00 AM",
        location: "RUET Campus",
        category: "social",
        status: "upcoming",
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Career Development Workshop",
        description: "Professional development session for alumni",
        date: "2025-02-20",
        time: "2:00 PM",
        location: "Online",
        category: "educational",
        status: "upcoming",
        createdAt: new Date(),
      },
    ]);
  };

  const loadAnnouncements = async () => {
    // Mock announcements data for now
    setAnnouncements([
      {
        id: 1,
        title: "New Alumni Registration Process",
        content:
          "We have updated our alumni registration process to make it more streamlined...",
        priority: "high",
        status: "active",
        category: "general",
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Upcoming Cultural Program",
        content:
          "BZA is organizing a cultural program next month. Stay tuned for more details...",
        priority: "normal",
        status: "active",
        category: "events",
        createdAt: new Date(),
      },
    ]);
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

  // Event handlers
  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      ...eventForm,
      createdAt: editingEvent ? editingEvent.createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (editingEvent) {
      setEvents(
        events.map((event) => (event.id === editingEvent.id ? newEvent : event))
      );
    } else {
      setEvents([newEvent, ...events]);
    }

    setShowEventForm(false);
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "general",
      status: "upcoming",
    });
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      id: editingAnnouncement ? editingAnnouncement.id : Date.now(),
      ...announcementForm,
      createdAt: editingAnnouncement
        ? editingAnnouncement.createdAt
        : new Date(),
      updatedAt: new Date(),
    };

    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === editingAnnouncement.id ? newAnnouncement : ann
        )
      );
    } else {
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    setShowAnnouncementForm(false);
    setEditingAnnouncement(null);
    setAnnouncementForm({
      title: "",
      content: "",
      priority: "normal",
      status: "active",
      category: "general",
    });
  };

  const filteredAlumni = alumni.filter(
    (alumnus) =>
      alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
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
        <h1>BZA Admin Dashboard</h1>
        <button onClick={loadData} className="refresh-btn">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <BarChart3 size={18} />
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === "alumni" ? "active" : ""}`}
          onClick={() => setActiveTab("alumni")}
        >
          <Users size={18} />
          Alumni Management
        </button>
        <button
          className={`nav-tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          <Calendar size={18} />
          Events
        </button>
        <button
          className={`nav-tab ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => setActiveTab("announcements")}
        >
          <Megaphone size={18} />
          Announcements
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "alumni" && renderAlumniTab()}
        {activeTab === "events" && renderEventsTab()}
        {activeTab === "announcements" && renderAnnouncementsTab()}
      </div>

      {/* Modals */}
      {showModal && renderAlumniModal()}
      {showEventForm && renderEventForm()}
      {showAnnouncementForm && renderAnnouncementForm()}
    </div>
  );

  // Overview Tab Content
  function renderOverviewTab() {
    return (
      <div className="overview-tab">
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
              <span className="stat-label">Pending Approval</span>
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

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button
              className="action-btn primary"
              onClick={() => setActiveTab("alumni")}
            >
              <Users size={20} />
              Manage Alumni
            </button>
            <button
              className="action-btn secondary"
              onClick={() => {
                setActiveTab("events");
                setShowEventForm(true);
              }}
            >
              <Plus size={20} />
              Create Event
            </button>
            <button
              className="action-btn secondary"
              onClick={() => {
                setActiveTab("announcements");
                setShowAnnouncementForm(true);
              }}
            >
              <Plus size={20} />
              Create Announcement
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Alumni Registrations</h3>
          <div className="activity-list">
            {alumni.slice(0, 5).map((alumnus) => (
              <div key={alumnus.id} className="activity-item">
                <div className="activity-info">
                  <span className="activity-name">{alumnus.name}</span>
                  <span className="activity-department">
                    {alumnus.department}
                  </span>
                </div>
                <span
                  className={`activity-status ${getStatusColor(
                    alumnus.status
                  )}`}
                >
                  {alumnus.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Alumni Management Tab Content
  function renderAlumniTab() {
    return (
      <div className="alumni-tab">
        {/* Filters and Search */}
        <div className="controls-section">
          <div className="search-filter-group">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search alumni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
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
                <th>Year</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.map((alumnus) => (
                <tr key={alumnus.id}>
                  <td>{alumnus.name}</td>
                  <td>{alumnus.email}</td>
                  <td>{alumnus.department}</td>
                  <td>{alumnus.graduationYear}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusColor(
                        alumnus.status
                      )}`}
                    >
                      {alumnus.status}
                    </span>
                  </td>
                  <td>{formatDate(alumnus.submittedAt)}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => {
                        setSelectedAlumni(alumnus);
                        setShowModal(true);
                      }}
                      className="action-btn-small view"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(alumnus.id)}
                      className="action-btn-small delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Events Tab Content
  function renderEventsTab() {
    return (
      <div className="events-tab">
        <div className="tab-header">
          <h3>Event Management</h3>
          <button className="create-btn" onClick={() => setShowEventForm(true)}>
            <Plus size={18} />
            Create Event
          </button>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h4>{event.title}</h4>
                <div className="event-actions">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setEventForm(event);
                      setShowEventForm(true);
                    }}
                    className="edit-btn"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this event?")) {
                        setEvents(events.filter((e) => e.id !== event.id));
                      }
                    }}
                    className="delete-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <span className="event-date">📅 {event.date}</span>
                <span className="event-time">🕐 {event.time}</span>
                <span className="event-location">📍 {event.location}</span>
              </div>
              <div className="event-meta">
                <span className={`event-category ${event.category}`}>
                  {event.category}
                </span>
                <span className={`event-status ${event.status}`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Announcements Tab Content
  function renderAnnouncementsTab() {
    return (
      <div className="announcements-tab">
        <div className="tab-header">
          <h3>Announcement Management</h3>
          <button
            className="create-btn"
            onClick={() => setShowAnnouncementForm(true)}
          >
            <Plus size={18} />
            Create Announcement
          </button>
        </div>

        <div className="announcements-list">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <h4>{announcement.title}</h4>
                <div className="announcement-actions">
                  <button
                    onClick={() => {
                      setEditingAnnouncement(announcement);
                      setAnnouncementForm(announcement);
                      setShowAnnouncementForm(true);
                    }}
                    className="edit-btn"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this announcement?")) {
                        setAnnouncements(
                          announcements.filter((a) => a.id !== announcement.id)
                        );
                      }
                    }}
                    className="delete-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="announcement-content">{announcement.content}</p>
              <div className="announcement-meta">
                <span className={`priority-badge ${announcement.priority}`}>
                  {announcement.priority}
                </span>
                <span className={`status-badge ${announcement.status}`}>
                  {announcement.status}
                </span>
                <span className="announcement-date">
                  {formatDate(announcement.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Event Form Modal
  function renderEventForm() {
    return (
      <div className="modal-overlay">
        <div className="modal event-form-modal">
          <div className="modal-header">
            <h3>{editingEvent ? "Edit Event" : "Create New Event"}</h3>
            <button
              onClick={() => {
                setShowEventForm(false);
                setEditingEvent(null);
                setEventForm({
                  title: "",
                  description: "",
                  date: "",
                  time: "",
                  location: "",
                  category: "general",
                  status: "upcoming",
                });
              }}
              className="close-btn"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleEventSubmit} className="event-form">
            <div className="form-group">
              <label>Event Title *</label>
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={eventForm.location}
                onChange={(e) =>
                  setEventForm({ ...eventForm, location: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, category: e.target.value })
                  }
                >
                  <option value="general">General</option>
                  <option value="social">Social</option>
                  <option value="educational">Educational</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={eventForm.status}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, status: e.target.value })
                  }
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <Save size={18} />
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Announcement Form Modal
  function renderAnnouncementForm() {
    return (
      <div className="modal-overlay">
        <div className="modal announcement-form-modal">
          <div className="modal-header">
            <h3>
              {editingAnnouncement
                ? "Edit Announcement"
                : "Create New Announcement"}
            </h3>
            <button
              onClick={() => {
                setShowAnnouncementForm(false);
                setEditingAnnouncement(null);
                setAnnouncementForm({
                  title: "",
                  content: "",
                  priority: "normal",
                  status: "active",
                  category: "general",
                });
              }}
              className="close-btn"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleAnnouncementSubmit}
            className="announcement-form"
          >
            <div className="form-group">
              <label>Announcement Title *</label>
              <input
                type="text"
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={announcementForm.content}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    content: e.target.value,
                  })
                }
                rows="6"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={announcementForm.priority}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={announcementForm.status}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={announcementForm.category}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    category: e.target.value,
                  })
                }
              >
                <option value="general">General</option>
                <option value="events">Events</option>
                <option value="academic">Academic</option>
                <option value="administrative">Administrative</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <Save size={18} />
                {editingAnnouncement
                  ? "Update Announcement"
                  : "Create Announcement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Alumni Modal (existing)
  function renderAlumniModal() {
    if (!selectedAlumni) return null;

    return (
      <div className="modal-overlay">
        <div className="modal alumni-modal">
          <div className="modal-header">
            <h3>Alumni Details</h3>
            <button onClick={() => setShowModal(false)} className="close-btn">
              <X size={20} />
            </button>
          </div>

          <div className="modal-content">
            <div className="alumni-details">
              <div className="detail-group">
                <label>Name:</label>
                <span>{selectedAlumni.name}</span>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <span>{selectedAlumni.email}</span>
              </div>
              <div className="detail-group">
                <label>Phone:</label>
                <span>{selectedAlumni.phone}</span>
              </div>
              <div className="detail-group">
                <label>Department:</label>
                <span>{selectedAlumni.department}</span>
              </div>
              <div className="detail-group">
                <label>Graduation Year:</label>
                <span>{selectedAlumni.graduationYear}</span>
              </div>
              <div className="detail-group">
                <label>Current Status:</label>
                <span
                  className={`status-badge ${getStatusColor(
                    selectedAlumni.status
                  )}`}
                >
                  {selectedAlumni.status}
                </span>
              </div>
              <div className="detail-group">
                <label>Submitted:</label>
                <span>{formatDate(selectedAlumni.submittedAt)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() =>
                  handleStatusUpdate(selectedAlumni.id, "approved")
                }
                className="approve-btn"
                disabled={selectedAlumni.status === "approved"}
              >
                <CheckCircle size={18} />
                Approve
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(selectedAlumni.id, "rejected")
                }
                className="reject-btn"
                disabled={selectedAlumni.status === "rejected"}
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminDashboard;
