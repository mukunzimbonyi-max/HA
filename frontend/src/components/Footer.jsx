import React from 'react';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  MessageCircle,
  PhoneCall,
  Video,
  Camera,
  Send,
  Share2
} from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: '#002060', 
      padding: '2rem 1rem 1rem', 
      borderTop: 'none',
      marginTop: '2rem',
      color: 'white'
    }}>
      <div className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Branding Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'white', padding: '8px', borderRadius: '10px', color: 'var(--primary-blue)' }}>
              <Heart size={24} fill="var(--primary-blue)" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>My Health My Friend</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Empowering Rwandan youth with safe, private, and stigma-free access to sexual and reproductive health information and professional support.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>Home</a></li>
            <li><a href="/help" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>Ask a Psychologist</a></li>
            <li><a href="/pharmacies" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>Find a Facility</a></li>
            <li><a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>Educational Videos</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Get in Touch</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li>
              <a href="mailto:contact@myhealthmyfriend.rw" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', textDecoration: 'none' }}>
                <Mail size={18} color="white" /> contact@myhealthmyfriend.rw
              </a>
            </li>
            <li>
              <a href="tel:+250788000000" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', textDecoration: 'none' }}>
                <PhoneCall size={18} color="white" /> Phone: +250 788 000 000
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              <MapPin size={18} color="white" /> Kigali, Rwanda
            </li>
          </ul>
        </div>

        {/* Legal & Language */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Platform</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>Privacy Policy</a></li>
            <li><a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>Terms of Service</a></li>
            <li style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px' }}>
                <Globe size={16} color="white" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Ikinyarwanda / English</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Centered Social Media Card */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '1rem 1.5rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '500px',
          width: '90%'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Follow Our Community</h3>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: <Share2 size={18} />, label: 'Facebook', color: '#1877F2' },
              { icon: <Send size={18} />, label: 'X (Twitter)', color: '#FFFFFF' },
              { icon: <MessageCircle size={18} />, label: 'WhatsApp', color: '#25D366' },
              { icon: <Camera size={18} />, label: 'Instagram', color: '#E4405F' },
              { icon: <Video size={18} />, label: 'Youtube', color: '#FF0000' },
              { icon: <Send size={18} style={{ transform: 'rotate(-20deg)' }} />, label: 'Telegram', color: '#0088cc' }
            ].map((social, i) => (
              <a 
                key={i}
                href="#" 
                style={{ 
                  color: 'white',
                  transition: '0.3s',
                  background: 'rgba(255,255,255,0.1)',
                  width: '35px',
                  height: '35px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = social.color;
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
                  e.currentTarget.style.boxShadow = `0 10px 20px ${social.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        paddingTop: '1rem', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: '700' }}>
          &copy; {new Date().getFullYear()} My Health My Friend. All Rights Reserved.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
          Building a healthier future for Rwandan youth.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
