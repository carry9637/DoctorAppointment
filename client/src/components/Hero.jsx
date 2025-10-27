import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Caring for Your Health, <br />
          Every Step of the Way

        </h1>
        <p>
          Your health is our priority. We bring technology and trusted medical expertise together to make healthcare simple, quick, and accessible for everyone.
Book appointments, consult with top doctors, and manage your health records—all in one place.
Because your well-being deserves convenience and care that fits your lifestyle.
        </p>
      </div>
      <div className="hero-img">
        <img
          src={image}
          alt="hero"
        />
      </div>
    </section>
  );
};

export default Hero;
