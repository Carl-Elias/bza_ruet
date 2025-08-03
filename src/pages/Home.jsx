import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Users,
  Calendar,
  Bell,
  ArrowRight,
  GraduationCap,
  MapPin,
  Heart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import bzaLogo from "../assets/bza_logo.jpeg";
import carousel1 from "../assets/carosal_1.jpg";
import carousel2 from "../assets/alumni.jpg";
import carousel3 from "../assets/bza.jpg";

import carousel4 from "../assets/24_series.jpg";

import carousel5 from "../assets/books.jpg";

import "./Home.css";


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      id: 1,
      title: "Welcome to BZA RUET",
      subtitle: "Connecting Hearts, Building Futures",
      description:
        "Join our vibrant community of students and alumni from Bogura district studying at RUET.",
      image: carousel3,
      cta: "Join Us",
      ctaLink: "https://www.facebook.com/groups/253753094642184",
      color: "blue",
    },
    {
      id: 2,
      title: "Alumni Meetup",
      subtitle: "Inspiring Moments",
      description:
        "On a iftar gathering, our alumni shared their success stories and experiences, inspiring the next generation of students.",
      image: carousel2,
      cta: "Read Stories",
      ctaLink: "/alumni",
      color: "green",
    },
    {
      id: 3,
      title: "BZA Library",
      subtitle: "Knowledge at Your Fingertips",
      description:
        "Access our comprehensive collection of books, journals, and educational resources for your academic journey.",
      image: carousel5,
      cta: "Browse Books",
      ctaLink: "/books",
      color: "orange",
    },
    {
      id: 4,
      title: "24 series Reciption",
      subtitle: "Welcome 24 series to our beloved BZA,RUET Family",
      description:
        "Hopefully you will enjoy your time with us and make the most of your university life.",
      image: carousel4,
      cta: "View Events",
      ctaLink:
        "https://www.facebook.com/groups/bograzilasomity/permalink/31496681303255955/?rdid=2EoFKl9MV6UxSCtQ#",
      color: "purple",
    },
  ];

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

  // Carousel functionality
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

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

      {/* Carousel Section */}
      <section className="carousel">
        <div className="carousel-container">
          <div className="carousel-wrapper">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div key={slide.id} className={`carousel-slide ${slide.color}`}>
                  <div className="carousel-content">
                    <div className="carousel-text">
                      <h2 className="carousel-title">{slide.title}</h2>
                      <h3 className="carousel-subtitle">{slide.subtitle}</h3>
                      <p className="carousel-description">
                        {slide.description}
                      </p>
                      <Link to={slide.ctaLink} className="carousel-cta">
                        {slide.cta}
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                    <div className="carousel-image">
                      <img src={slide.image} alt={slide.title} />
                      <div className="carousel-overlay"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <button
              className="carousel-nav carousel-nav-prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="carousel-nav carousel-nav-next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="carousel-indicators">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
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
