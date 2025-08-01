import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Bell,
  ArrowRight,
  GraduationCap,
  MapPin,
  Heart,
  BookOpen,
} from "lucide-react";
import bzaLogo from "../assets/bza_logo.jpeg";
import "./Home.css";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Alumni Network",
      description:
        "Connect with fellow Bogura district alumni and build lasting professional relationships.",
      link: "/alumni",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "BZA Library",
      description:
        "Access our comprehensive collection of books, journals, and educational resources.",
      link: "/books",
      color: "orange",
    },
    {
      icon: Calendar,
      title: "Events & Activities",
      description:
        "Stay updated with upcoming events, cultural programs, and social gatherings.",
      link: "/events",
      color: "green",
    },
    {
      icon: Bell,
      title: "Announcements",
      description:
        "Get the latest news, updates, and important announcements from BZA.",
      link: "/announcements",
      color: "purple",
    },
  ];

  const stats = [
    { label: "Active Members", value: "350+", icon: Users },
    { label: "Alumni Connected", value: "200+", icon: GraduationCap },
    { label: "Events Organized", value: "50+", icon: Calendar },
    { label: "Years of Service", value: "10+", icon: Heart },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to{" "}
              <span className="highlight">Bogura Zilla Association</span>
            </h1>
            <p className="hero-subtitle">
              Connecting students and alumni from Bogura district at Rajshahi
              University of Engineering & Technology (RUET). Building bridges
              between generations and fostering a strong community bond.
            </p>
            <div className="hero-buttons">
              <Link to="/alumni/register" className="btn btn-primary">
                <Users size={20} />
                Join Alumni Network
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">
              <img src={bzaLogo} alt="BZA Logo" className="hero-logo" />
              <div className="hero-badge">
                <MapPin size={16} />
                Bogura → RUET
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <Icon size={24} className="stat-icon" />
                  <div className="stat-content">
                    <h3 className="stat-value">{stat.value}</h3>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">
              Discover the various ways BZA RUET helps connect and support our
              community
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`feature-card ${feature.color}`}>
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <Link to={feature.link} className="feature-link">
                    Explore <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Join Our Community?</h2>
            <p className="cta-description">
              Whether you're a current student or an alumni, BZA RUET welcomes
              you to be part of our growing family.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                Get In Touch
              </Link>
              <Link to="/events" className="btn btn-outline">
                View Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
