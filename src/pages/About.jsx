import { Users, Target, Heart, Award } from "lucide-react";
import "./About.css";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community",
      description:
        "Building strong connections between current students and alumni from Bogura district.",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "Promoting academic and professional excellence among our members.",
    },
    {
      icon: Heart,
      title: "Unity",
      description:
        "Fostering a sense of belonging and cultural identity away from home.",
    },
    {
      icon: Award,
      title: "Growth",
      description:
        "Supporting personal and professional development of our community members.",
    },
  ];

  return (
    <div className="about">
      <section className="about-hero">
        <div className="about-container">
          <h1 className="about-title">About BZA RUET</h1>
          <p className="about-subtitle">
            Connecting hearts, minds, and futures - The Bogura Zilla Association
            at RUET
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              The Bogura Zilla Association (BZA) at Rajshahi University of
              Engineering and Technology was established to create a supportive
              community for students from Bogura district. Since our inception,
              we have been dedicated to fostering connections between current
              students and alumni, providing academic support, cultural
              activities, and professional networking opportunities.
            </p>
            <p>
              Our association serves as a bridge between generations, helping
              students feel at home while pursuing their engineering dreams at
              RUET. We celebrate our rich cultural heritage while embracing
              modern educational and professional opportunities.
            </p>
          </div>

          <div className="values-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="value-card">
                    <div className="value-icon">
                      <Icon size={32} />
                    </div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mission-section">
            <div className="mission-vision">
              <div className="mission">
                <h3>Our Mission</h3>
                <p>
                  To create a supportive and inclusive community that connects
                  students and alumni from Bogura district, fostering academic
                  excellence, cultural preservation, and professional growth
                  while maintaining strong ties to our roots.
                </p>
              </div>
              <div className="vision">
                <h3>Our Vision</h3>
                <p>
                  To be the leading district-based student association at RUET,
                  known for our strong alumni network, cultural contributions,
                  and the success of our members in various fields of
                  engineering and technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
