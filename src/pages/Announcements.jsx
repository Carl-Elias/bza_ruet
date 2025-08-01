import { useState } from "react";
import { Bell, Calendar, Pin, AlertCircle } from "lucide-react";
import "./Announcements.css";

const Announcements = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const announcements = [
    {
      id: 1,
      title: "Registration Open: Annual BZA Reunion 2025",
      content:
        "We are excited to announce that registration is now open for our Annual BZA Reunion 2025! Join us on March 15th for a day of networking, cultural activities, and reconnecting with old friends.",
      date: "2025-01-20",
      category: "event",
      priority: "high",
      author: "BZA Executive Committee",
    },
    {
      id: 2,
      title: "New Alumni Directory Launch",
      content:
        "Our new online alumni directory is now live! Alumni can update their profiles and current students can connect with professionals in their field of interest.",
      date: "2025-01-18",
      category: "general",
      priority: "medium",
      author: "BZA Tech Team",
    },
    {
      id: 3,
      title: "Scholarship Opportunity: BZA Merit Award 2025",
      content:
        "Applications are now being accepted for the BZA Merit Award 2025. This scholarship is available for current RUET students from Bogura district who demonstrate academic excellence and community involvement.",
      date: "2025-01-15",
      category: "academic",
      priority: "high",
      author: "BZA Academic Committee",
    },
    {
      id: 4,
      title: "Cultural Night 2025 - Call for Performers",
      content:
        "Calling all talented performers! We are looking for musicians, dancers, and other cultural performers for our upcoming Cultural Night on April 10th. Registration deadline: February 20th.",
      date: "2025-01-12",
      category: "cultural",
      priority: "medium",
      author: "BZA Cultural Committee",
    },
    {
      id: 5,
      title: "Monthly Meeting Reminder",
      content:
        "Reminder: Our monthly general meeting is scheduled for January 30th at 7:00 PM in the CSE Department seminar room. All members are encouraged to attend.",
      date: "2025-01-10",
      category: "meeting",
      priority: "low",
      author: "BZA Secretary",
    },
  ];

  const categories = [
    { value: "all", label: "All Announcements" },
    { value: "event", label: "Events" },
    { value: "academic", label: "Academic" },
    { value: "cultural", label: "Cultural" },
    { value: "meeting", label: "Meetings" },
    { value: "general", label: "General" },
  ];

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      selectedCategory === "all" || announcement.category === selectedCategory
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle size={16} className="priority-icon high" />;
      case "medium":
        return <Bell size={16} className="priority-icon medium" />;
      default:
        return <Pin size={16} className="priority-icon low" />;
    }
  };

  const getPriorityClass = (priority) => {
    return `announcement-card ${priority}-priority`;
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
          {filteredAnnouncements.length > 0 ? (
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
                      {formatDate(announcement.date)}
                    </div>
                  </div>

                  <div className="announcement-content">
                    <h3 className="announcement-title">{announcement.title}</h3>
                    <p className="announcement-text">{announcement.content}</p>
                    <div className="announcement-author">
                      <small>Posted by: {announcement.author}</small>
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
