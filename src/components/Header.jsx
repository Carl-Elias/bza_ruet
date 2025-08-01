import { Link, useLocation } from "react-router-dom";
import { Menu, X, Users, Calendar, Bell, Mail, BookOpen } from "lucide-react";
import { useState } from "react";
import bzaLogo from "../assets/bza_logo.jpeg";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: null },
    { name: "About", href: "/about", icon: null },
    { name: "Alumni", href: "/alumni", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Announcements", href: "/announcements", icon: Bell },
    { name: "BZA Books", href: "/books", icon: BookOpen },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-container">
              <div className="logo-image">
                <img src={bzaLogo} alt="BZA Logo" className="logo-img" />
              </div>
              <div className="logo-text">
                <h1>BZA RUET</h1>
                <p>Bogura Zilla Association</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`nav-link ${
                        location.pathname === item.href ? "active" : ""
                      }`}
                    >
                      {Icon && <Icon size={18} />}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            <ul className="mobile-nav-links">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`mobile-nav-link ${
                        location.pathname === item.href ? "active" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {Icon && <Icon size={18} />}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
