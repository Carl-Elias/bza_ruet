import { useState } from "react";
import { Calendar, MapPin, Clock, Users, Filter, Search } from "lucide-react";
import "./Events.css";

const Events = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Annual BZA Reunion 2025",
      description:
        "Join us for our grand annual reunion bringing together alumni and current students from all batches.",
      date: "2025-03-15",
      time: "10:00 AM",
      location: "RUET Auditorium, Rajshahi",
      type: "reunion",
      attendees: 150,
      status: "upcoming",
      organizer: "BZA Executive Committee",
    },
    {
      id: 2,
      title: "Career Guidance Workshop",
      description:
        "Alumni professionals sharing insights about career paths in tech, engineering, and other fields.",
      date: "2025-02-20",
      time: "2:00 PM",
      location: "CSE Department, RUET",
      type: "workshop",
      attendees: 80,
      status: "upcoming",
      organizer: "BZA Career Development Wing",
    },
    {
      id: 3,
      title: "Cultural Night 2025",
      description:
        "A vibrant evening of music, dance, and cultural performances celebrating our Bogura heritage.",
      date: "2025-04-10",
      time: "6:00 PM",
      location: "RUET Central Field",
      type: "cultural",
      attendees: 200,
      status: "upcoming",
      organizer: "BZA Cultural Committee",
    },
    {
      id: 4,
      title: "Tech Talk: AI & Future",
      description:
        "Industry experts discussing the latest trends in AI and its impact on various engineering fields.",
      date: "2025-01-25",
      time: "3:00 PM",
      location: "Online (Zoom)",
      type: "seminar",
      attendees: 120,
      status: "past",
      organizer: "BZA Tech Wing",
    },
    {
      id: 5,
      title: "Freshers Welcome 2025",
      description:
        "Welcoming new students from Bogura district and introducing them to the BZA community.",
      date: "2025-01-10",
      time: "4:00 PM",
      location: "RUET Main Gate Area",
      type: "welcome",
      attendees: 50,
      status: "past",
      organizer: "BZA Student Affairs",
    },
  ];

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "reunion", label: "Reunions" },
    { value: "workshop", label: "Workshops" },
    { value: "cultural", label: "Cultural" },
    { value: "seminar", label: "Seminars" },
    { value: "welcome", label: "Welcome Events" },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(
    (event) => event.status === "upcoming"
  );
  const pastEvents = filteredEvents.filter((event) => event.status === "past");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const EventCard = ({ event }) => (
    <div className={`event-card ${event.status}`}>
      <div className="event-header">
        <div className="event-date">
          <div className="event-day">{new Date(event.date).getDate()}</div>
          <div className="event-month">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </div>
        </div>
        <div className="event-type-badge">{event.type}</div>
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
            <span>{event.time}</span>
          </div>
          <div className="event-detail">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="event-detail">
            <Users size={16} />
            <span>{event.attendees} attendees</span>
          </div>
        </div>

        <div className="event-organizer">
          <small>Organized by: {event.organizer}</small>
        </div>

        {event.status === "upcoming" && (
          <div className="event-actions">
            <button className="btn btn-primary">Register</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="events">
      {/* Header Section */}
      <section className="events-header">
        <div className="events-header-container">
          <h1 className="events-title">Events & Activities</h1>
          <p className="events-subtitle">
            Stay connected with our community through various events, workshops,
            cultural programs, and networking opportunities throughout the year.
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
    </div>
  );
};

export default Events;
