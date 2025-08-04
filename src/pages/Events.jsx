import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Filter, Search } from "lucide-react";
import { eventsService } from "./services/firebase";
import "./Events.css";

const Events = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from Firebase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log("Loading events for Events page...");
        const result = await eventsService.getAllEvents();

        if (result.success) {
          console.log("Events loaded successfully:", result.data);
          setEvents(result.data);
        } else {
          console.error("Failed to load events:", result.error);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "reunion", label: "Reunions" },
    { value: "workshop", label: "Workshops" },
    { value: "cultural", label: "Cultural" },
    { value: "seminar", label: "Seminars" },
    { value: "welcome", label: "Welcome Events" },
    { value: "general", label: "General" },
    { value: "social", label: "Social" },
    { value: "educational", label: "Educational" },
    { value: "sports", label: "Sports" },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesType =
      selectedType === "all" || event.category === selectedType;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(
    (event) => event.status === "upcoming" || event.status === "ongoing"
  );
  const pastEvents = filteredEvents.filter(
    (event) => event.status === "completed"
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return { day: "--", month: "---" };

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { day: "--", month: "---" };
    }

    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  };

  const EventCard = ({ event }) => {
    const dateInfo = formatDateShort(event.date);

    return (
      <div className={`event-card ${event.status || "upcoming"}`}>
        <div className="event-header">
          <div className="event-date">
            <div className="event-day">{dateInfo.day}</div>
            <div className="event-month">{dateInfo.month}</div>
          </div>
          <div className="event-type-badge">{event.category || "General"}</div>
        </div>

        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-description">{event.description}</p>

          <div className="event-details">
            <div className="event-detail">
              <Calendar size={16} />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="event-detail">
              <Clock size={16} />
              <span>{event.time || "Time TBA"}</span>
            </div>
            <div className="event-detail">
              <MapPin size={16} />
              <span>{event.location || "Location TBA"}</span>
            </div>
            {event.attendees && (
              <div className="event-detail">
                <Users size={16} />
                <span>{event.attendees} attendees</span>
              </div>
            )}
          </div>

          {event.organizer && (
            <div className="event-organizer">
              <small>Organized by: {event.organizer}</small>
            </div>
          )}

          {(event.status === "upcoming" || event.status === "ongoing") && (
            <div className="event-actions">
              {event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: "none" }}
                >
                  Register
                </a>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled
                  title="Registration link not available"
                >
                  Register
                </button>
              )}
              <button className="btn btn-secondary">Learn More</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="events">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <section className="events-header">
            <div className="events-header-container">
              <h1 className="events-title">Events & Activities</h1>
              <p className="events-subtitle">
                Stay connected with our community through various events,
                workshops, cultural programs, and networking opportunities
                throughout the year.
              </p>
            </div>
          </section>

          {/* Filters Section */}
          <section className="events-filters">
            <div className="filters-container">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="type-filter">
                <Filter size={20} />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="type-select"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section className="events-section">
              <div className="events-container">
                <h2 className="section-title">Upcoming Events</h2>
                <div className="events-grid">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section className="events-section">
              <div className="events-container">
                <h2 className="section-title">Past Events</h2>
                <div className="events-grid">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* No Events Found */}
          {filteredEvents.length === 0 && (
            <section className="no-events">
              <div className="no-events-container">
                <Calendar size={64} className="no-events-icon" />
                <h3>No events found</h3>
                <p>Try adjusting your search terms or filters.</p>
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="events-cta">
            <div className="cta-container">
              <div className="cta-content">
                <h2>Want to Organize an Event?</h2>
                <p>
                  Have an idea for a workshop, cultural program, or networking
                  event? We'd love to hear from you and help make it happen!
                </p>
                <a href="/contact" className="btn btn-primary">
                  <Calendar size={20} />
                  Propose an Event
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Events;
