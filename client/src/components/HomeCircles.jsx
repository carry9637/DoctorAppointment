import React from "react";
import CountUp from "react-countup";
import "../styles/homecircles.css";

const HomeCircles = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-header">
          <h2 className="section-title">Our Achievements</h2>
          <p className="section-subtitle">
            Numbers that speak for our commitment to excellence in healthcare
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="counter">
                <CountUp
                  start={0}
                  end={5000}
                  delay={0}
                  enableScrollSpy={true}
                  scrollSpyDelay={500}
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
                <span className="plus">+</span>
              </div>
              <h3>Satisfied Patients</h3>
              <p>Happy families we have served</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <div className="counter">
                <CountUp
                  start={0}
                  end={200}
                  delay={0}
                  enableScrollSpy={true}
                  scrollSpyDelay={500}
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
                <span className="plus">+</span>
              </div>
              <h3>Expert Doctors</h3>
              <p>Qualified medical professionals</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="counter">
                <CountUp
                  start={0}
                  end={50}
                  delay={0}
                  enableScrollSpy={true}
                  scrollSpyDelay={500}
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
                <span className="plus">+</span>
              </div>
              <h3>Specialist Doctors</h3>
              <p>Super specialists in various fields</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <div className="counter">
                <CountUp
                  start={0}
                  end={25}
                  delay={0}
                  enableScrollSpy={true}
                  scrollSpyDelay={500}
                >
                  {({ countUpRef }) => <span ref={countUpRef} />}
                </CountUp>
                <span className="plus">+</span>
              </div>
              <h3>Years Experience</h3>
              <p>Serving the community with excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCircles;
