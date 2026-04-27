import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Heart, 
  Brain, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Protection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Sexual Health",
      icon: <Heart size={32} />,
      color: "#ff4d6d",
      topics: ["Safe Practices", "Contraception", "Consent Education", "STI Prevention"]
    },
    {
      title: "Mental Wellness",
      icon: <Brain size={32} />,
      color: "#4cc9f0",
      topics: ["Anxiety Support", "Self-Esteem", "Stigma Reduction", "Emotional Balance"]
    },
    {
      title: "Rights & Safety",
      icon: <Shield size={32} />,
      color: "#3a0ca3",
      topics: ["Body Autonomy", "Legal Support", "Safe Spaces", "Reporting Tools"]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfd' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #002060 0%, #0052cc 100%)', 
        padding: '6rem 2rem', 
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}
        >
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '10px', 
            background: 'rgba(255,255,255,0.1)', padding: '8px 20px', 
            borderRadius: '50px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Lock size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>100% Private & Anonymous</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Your Health, Your Privacy, <span style={{ color: '#00f2fe' }}>Our Priority</span>
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Access stigma-free SRH and mental health support. Designed by youth, for youth in Rwanda.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/help')}
              style={{ 
                background: 'white', color: '#002060', padding: '1rem 2rem', 
                borderRadius: '14px', fontWeight: '800', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              Talk to an Expert <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/home')}
              style={{ 
                background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem 2rem', 
                borderRadius: '14px', fontWeight: '800', border: '1px solid rgba(255,255,255,0.3)', 
                cursor: 'pointer', backdropFilter: 'blur(10px)'
              }}
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(0,242,254,0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,77,109,0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '-4rem auto 6rem', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        
        {/* Category Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              style={{
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                width: '80px', height: '80px', background: `${cat.color}15`, 
                color: cat.color, borderRadius: '24px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem'
              }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1rem' }}>{cat.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cat.topics.map((topic, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4a5568', fontSize: '1rem' }}>
                    <CheckCircle2 size={18} color={cat.color} />
                    {topic}
                  </div>
                ))}
              </div>
              <button style={{ 
                marginTop: '2rem', width: '100%', padding: '1rem', 
                borderRadius: '16px', border: `2px solid ${cat.color}30`, 
                background: 'transparent', color: cat.color, fontWeight: '700',
                cursor: 'pointer', transition: '0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = cat.color;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = cat.color;
              }}
              >
                Explore {cat.title}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Informational Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '40px', 
          padding: '4rem', 
          boxShadow: '0 4px 30px rgba(0,0,0,0.02)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#002060' }}>
              Breaking the Silence, <br/>Building the Future.
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.8', marginBottom: '2rem' }}>
              In Rwanda, 90% of adolescents feel held back by stigma when accessing health services. We are here to change that. 
              Our platform offers a safe digital bridge to the care you deserve, without judgment or fear.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { title: "Anonymous Chat", desc: "Speak with our AI assistant or professionals privately." },
                { title: "Verified Clinics", desc: "Find youth-friendly health centers near your location." },
                { title: "Accessible Content", desc: "Videos with sign language and subtitles for everyone." }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} color="#0052cc" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ color: '#718096', fontSize: '0.95rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              background: 'linear-gradient(45deg, #002060, #0052cc)', 
              borderRadius: '30px', 
              aspectRatio: '4/5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700',
              textAlign: 'center',
              padding: '2rem',
              boxShadow: '0 30px 60px rgba(0,82,204,0.2)'
            }}>
              "The power to take control of your health is now in your hands."
            </div>
            {/* Floating stats badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ 
                position: 'absolute', top: '-20px', right: '-20px', 
                background: 'white', padding: '1.5rem', borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9'
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#36b37e' }}>65%</div>
              <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: '600' }}>Youth Online <br/>in Rwanda</div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={{ 
          marginTop: '6rem', 
          textAlign: 'center',
          background: '#002060',
          borderRadius: '40px',
          padding: '5rem 2rem',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to take the first step?</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2.5rem' }}>Join thousands of Rwandan youth accessing safe health services.</p>
          <button 
            onClick={() => navigate('/auth')}
            style={{ 
              background: 'white', color: '#002060', padding: '1.2rem 3rem', 
              borderRadius: '16px', fontWeight: '800', border: 'none', cursor: 'pointer',
              fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(255,255,255,0.1)'
            }}
          >
            Create Private Account
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Protection;
