import { useState, useEffect } from "react";
import { Bell, Calendar, Pin, AlertCircle } from "lucide-react";
import { announcementsService } from "../services/firebase";
import "./Announcements.css";

const Announcements = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load announcements from Firebase
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        console.log("Loading announcements for Announcements page...");
        const result = await announcementsService.getActiveAnnouncements();

        if (result.success) {
          console.log("Announcements loaded successfully:", result.data);
          setAnnouncements(result.data);
        } else {
          console.error("Failed to load announcements:", result.error);
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Error loading announcements:", error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  const categories = [
    { value: "all", label: "All Announcements" },
    { value: "general", label: "General" },
    { value: "events", label: "Events" },
    { value: "academic", label: "Academic" },
    { value: "administrative", label: "Administrative" },
    { value: "urgent", label: "Urgent" },
  ];

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      selectedCategory === "all" || announcement.category === selectedCategory
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    // Handle Firebase Timestamp or regular date
    let date;
    if (dateString && typeof dateString.toDate === "function") {
      date = dateString.toDate();
    } else if (dateString instanceof Date) {
      date = dateString;
    } else {
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle size={16} className="priority-icon urgent" />;
      case "high":
        return <AlertCircle size={16} className="priority-icon high" />;
      case "normal":
        return <Bell size={16} className="priority-icon normal" />;
      case "low":
        return <Pin size={16} className="priority-icon low" />;
      default:
        return <Bell size={16} className="priority-icon normal" />;
    }
  };

  const getPriorityClass = (priority) => {
    return `announcement-card ${priority || "normal"}-priority`;
  };

  return (
    <div className="announcements">
      {/* Header Section */}
      <section className="announcements-header">
        <div className="announcements-header-container">
          <h1 className="announcements-title">Announcements</h1>
          <p className="announcements-subtitle">
            Stay up to date with the latest news, updates, and important
            information from BZA RUET.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="announcements-filters">
        <div className="filters-container">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`category-tab ${
                  selectedCategory === category.value ? "active" : ""
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="announcements-list">
        <div className="announcements-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            <div className="announcements-grid">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={getPriorityClass(announcement.priority)}
                >
                  <div className="announcement-header">
                    <div className="announcement-meta">
                      {getPriorityIcon(announcement.priority)}
                      <span className="announcement-category">
                        {
                          categories.find(
                            (cat) => cat.value === announcement.category
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="announcement-date">
                      <Calendar size={16} />
                      {formatDate(announcement.createdAt)}
                    </div>
                  </div>

                  <div className="announcement-content">
                    <h3 className="announcement-title">{announcement.title}</h3>
                    <p className="announcement-text">{announcement.content}</p>
                    <div className="announcement-author">
                      <small>
                        Posted by: {announcement.author || "BZA Admin"}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-announcements">
              <Bell size={64} className="no-announcements-icon" />
              <h3>No announcements found</h3>
              <p>There are no announcements in this category at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="subscribe-section">
        <div className="subscribe-container">
          <div className="subscribe-content">
            <h2>Stay Informed</h2>
            <p>
              Never miss important updates! Subscribe to our newsletter to
              receive announcements directly in your inbox.
            </p>
            <div className="subscribe-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="subscribe-input"
              />
              <button className="btn btn-primary">
                <Bell size={20} />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Announcements;
