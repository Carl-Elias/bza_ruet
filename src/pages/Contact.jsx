import { Mail, Phone, MapPin, Users, Send } from "lucide-react";
import { useState } from "react";
import emailjs from "emailjs-com";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Create mailto link with proper encoding
    const subject = `Contact from ${formData.name} - ${formData.subject}`;
    const body = `Hello BZA Team,

I would like to contact you regarding: ${formData.category}

From: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

Best regards,
${formData.name}`;

    const mailtoLink = `mailto:bogurazillaassociation@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    try {
      // Store form data for preview before clearing
      setSubmittedData({ ...formData });

      // Try to open mailto link
      const link = document.createElement("a");
      link.href = mailtoLink;
      link.click();

      // Alternative: try window.open
      // window.open(mailtoLink, '_blank');

      // Show success message after a short delay
      setTimeout(() => {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "general",
        });
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Error opening email client:", error);
      setSubmitStatus("error");
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      detail: "bogurazillaassociation@gmail.com",
      link: "mailto:bogurazillaassociation@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      detail: "+880 1934207178",
      link: "tel:+8801934207178",
    },
    {
      icon: MapPin,
      title: "Address",
      detail: "RUET Campus, Kazla, Rajshahi-6204",
      link: null,
    },
    {
      icon: Users,
      title: "Office",
      detail: "Student Residential Hall, RUET",
      link: null,
    },
  ];

  return (
    <div className="contact">
      {/* Header Section */}
      <section className="contact-header">
        <div className="contact-header-container">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">
            Have questions, suggestions, or want to get involved? We'd love to
            hear from you!
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-container">
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <p className="contact-info-description">
              Reach out to us through any of the following channels. We're here
              to help and support our community members.
            </p>

            <div className="contact-info-grid">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="contact-info-item">
                    <div className="contact-info-icon">
                      <Icon size={24} />
                    </div>
                    <div className="contact-info-details">
                      <h4>{info.title}</h4>
                      {info.link ? (
                        <a href={info.link} className="contact-info-link">
                          {info.detail}
                        </a>
                      ) : (
                        <p>{info.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="executive-committee">
              <h3>Executive Committee</h3>
              <div className="committee-members">
                <div className="committee-member">
                  <h4>President</h4>
                  <p style={{ whiteSpace: "nowrap" }}>Md. Shakibul Hasan</p>
                  <small>
                    <a href="tel:+8801934207178">01934207178</a>
                  </small>
                </div>
                <div className="committee-member">
                  <h4>General Secretary</h4>
                  <p style={{ whiteSpace: "nowrap" }}>Alamin Islam Roky</p>
                  <small>
                    <a href="tel:+8801749278539">01749278539</a>
                  </small>
                </div>
                <div className="committee-member">
                  <h4>Treasurer</h4>
                  <p style={{ whiteSpace: "nowrap" }}>Md. Tauhedur Rahman</p>
                  <small>
                    <a href="tel:+8801567977852">01567977852</a>
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="general">General Inquiry</option>
                  <option value="alumni">Alumni Registration</option>
                  <option value="event">Event Related</option>
                  <option value="membership">Membership</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="form-textarea"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={isSubmitting}
              >
                <Send size={20} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && submittedData && (
                <div className="submit-message success">
                  ✅ Email client should have opened! If it didn't, please copy
                  this message and email us:
                  <div className="message-preview">
                    <strong>To:</strong> bogurazillaassociation@gmail.com
                    <br />
                    <strong>Subject:</strong> Contact from {submittedData.name}{" "}
                    - {submittedData.subject}
                    <br />
                    <strong>Message:</strong>
                    <br />
                    Hello BZA Team,
                    <br />
                    <br />I would like to contact you regarding:{" "}
                    {submittedData.category}
                    <br />
                    <br />
                    From: {submittedData.name}
                    <br />
                    Email: {submittedData.email}
                    <br />
                    <br />
                    Message:
                    <br />
                    {submittedData.message}
                    <br />
                    <br />
                    Best regards,
                    <br />
                    {submittedData.name}
                  </div>
                  <small>Or call: +880 1934207178</small>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="submit-message error">
                  ❌ Unable to open email client. Please contact us directly:
                  <br />
                  <strong>Email:</strong> bogurazillaassociation@gmail.com
                  <br />
                  <strong>Phone:</strong> +880 1934207178
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How can I join BZA?</h4>
              <p>
                Any current or former RUET student from Bogura district can join
                BZA. Contact us for membership details.
              </p>
            </div>
            <div className="faq-item">
              <h4>How can alumni get involved?</h4>
              <p>
                Alumni can participate in events, mentor current students, or
                join our alumni network directory.
              </p>
            </div>
            <div className="faq-item">
              <h4>Are there any membership fees?</h4>
              <p>
                We have a nominal annual fee to support our activities. Contact
                us for current fee structure.
              </p>
            </div>
            <div className="faq-item">
              <h4>How often do you organize events?</h4>
              <p>
                We organize various events throughout the year including
                cultural programs, workshops, and networking sessions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
