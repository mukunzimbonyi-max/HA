import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '2rem 0' }} className="container">
        <motion.div 
          className="about-card-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--white)',
            padding: '3rem',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            marginBottom: '3rem'
          }}
        >
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-blue)', marginBottom: '1.5rem', fontWeight: '800' }}>
            About My Health My Friend
          </h1>
          
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '3px solid var(--primary-green)', display: 'inline-block', paddingBottom: '0.3rem' }}>
              Our Objective
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
              My Health My Friend is dedicated to empowering Rwandan youth with safe, private, and stigma-free access to sexual and reproductive health information and professional support. Our objective is to bridge the gap between youth and reliable health resources, fostering a healthier and more informed generation. We strive to create an inclusive environment where young people can ask questions without fear of judgment.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '3px solid var(--primary-green)', display: 'inline-block', paddingBottom: '0.3rem' }}>
              Foundation
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
              Built upon a strong foundation of community engagement and technological innovation, this project was initiated to address critical health challenges faced by young people. Through dedicated effort, collaboration, and education, we have built a secure digital platform that prioritizes privacy, comprehensive education, and direct access to healthcare professionals and psychologists.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '2rem', borderBottom: '3px solid var(--primary-green)', display: 'inline-block', paddingBottom: '0.3rem' }}>
              Meet The Team
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              {/* Founder 1 */}
              <motion.div 
                className="founder-card"
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                style={{
                  background: '#f8fafc',
                  padding: '2rem',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  border: '4px solid white',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src="/assets/cheretien.jpg" 
                    alt="Munezero Cheretien"
                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Munezero+Cheretien&background=0D8ABC&color=fff&size=150' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Munezero Cheretien</h3>
                <span style={{ 
                  background: 'var(--primary-blue)', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '50px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}>
                  Founder & Initiator
                </span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  The visionary who initiated the idea and founder of the project, driving the mission to create a safe space for youth health education.
                </p>
              </motion.div>

              {/* Founder 2 */}
              <motion.div 
                className="founder-card"
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                style={{
                  background: '#f8fafc',
                  padding: '2rem',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  border: '4px solid white',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src="/assets/jeremie.jpg" 
                    alt="Niyogisubizo Jeremie"
                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Niyogisubizo+Jeremie&background=36b37e&color=fff&size=150' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Niyogisubizo Jeremie</h3>
                <span style={{ 
                  background: 'var(--primary-green)', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '50px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}>
                  Full Stack Developer
                </span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Full Stack Developer who pursues Mathematics and Computer Science with Education, bringing the technical foundation to life.
                </p>
              </motion.div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              {/* Contact Cheretien */}
              <ContactForm 
                name="Cheretien" 
                emailTo="munezerocheretien@gmail.com" 
                color="var(--primary-blue)" 
              />
              
              {/* Contact Jeremie */}
              <ContactForm 
                name="Jeremie" 
                emailTo="niyogisubizojeremie73@gmail.com" 
                color="var(--primary-green)" 
              />
            </div>
          </section>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
