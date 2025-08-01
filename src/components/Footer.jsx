import { Facebook, Mail, Phone, MapPin, Users } from "lucide-react";
import bzaLogo from "../assets/bza_logo.jpeg";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo-section">
              <img src={bzaLogo} alt="BZA Logo" className="footer-logo" />
              <h3 className="footer-title">BZA RUET</h3>
            </div>
            <p className="footer-description">
              Connecting Bogura district students and alumni of Rajshahi
              University of Engineering and Technology (RUET), fostering
              community, growth, and lifelong relationships.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/alumni">Alumni Network</a>
              </li>
              <li>
                <a href="/events">Upcoming Events</a>
              </li>
              <li>
                <a href="/books">BZA Library</a>
              </li>
              <li>
                <a href="/announcements">Announcements</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={16} />
                <span>RUET Campus, Kazla, Rajshahi</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>info@bzaruet.org</span>
              </div>
              <div className="contact-item">
                <Users size={16} />
                <span>Bogura Zilla Association</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} Bogura Zilla Association, RUET. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
