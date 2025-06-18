import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './TAHomePage.css';

const TAHomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Strategic Sourcing',
      desc: 'Proactively identifying and engaging with top talent across platforms.',
    },
    {
      title: 'Full-Cycle Recruitment',
      desc: 'Managing the complete recruitment lifecycle from intake to onboarding.',
    },
    {
      title: 'Employer Branding',
      desc: 'Promoting our company as a top employer in the industry.',
    },
    {
      title: 'Stakeholder Collaboration',
      desc: 'Partnering closely with hiring managers and leadership teams.',
    },
    {
      title: 'Diversity Hiring',
      desc: 'Ensuring inclusive and equitable hiring practices.',
    },
    {
      title: 'Candidate Experience',
      desc: 'Providing a smooth and engaging experience for all candidates.',
    },
  ];

  return (
    <div className="ta-container">
      <motion.header
        className="ta-hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to the Talent Acquisition Team</h1>
        <p>
          We power business growth by hiring top talent, building strong relationships, and creating meaningful candidate experiences.
        </p>
        <button onClick={() => navigate('/allsubmissions')}>
          Visit Dashboard
        </button>
      </motion.header>

      <motion.section
        className="ta-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h2>What We Do</h2>
        <div className="ta-features">
          {features.map((item, index) => (
            <motion.div
              className="ta-card"
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="ta-mission"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h2>Our Mission</h2>
        <p>
          To align business needs with exceptional talent by using innovative strategies, data-driven insights, and human-first hiring.
        </p>
      </motion.section>

      <footer className="ta-footer">
        &copy; {new Date().getFullYear()} Talent Acquisition Team | All rights reserved
      </footer>
    </div>
  );
};

export default TAHomePage;
