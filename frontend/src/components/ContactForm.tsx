/// <reference types="vite/client" />
import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

interface ContactFormProps {
  name: string;
  emailTo: string;
  color: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ name, emailTo, color }) => {
  const [formData, setFormData] = useState({
    senderEmail: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

      const templateParams = {
        to_name: name,
        to_email: emailTo, // Make sure your EmailJS template uses this variable to send to the correct person if needed, or route based on name.
        from_email: formData.senderEmail,
        subject: formData.subject,
        message: formData.message,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setStatus('success');
      setFormData({ senderEmail: '', subject: '', message: '' });
      
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <motion.div 
      className="contact-form-card"
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        borderTop: `4px solid ${color}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MessageSquare color={color} size={24} />
        Get in touch with {name}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <Mail size={16} /> Your Email
          </label>
          <input 
            type="email" 
            name="senderEmail"
            required
            value={formData.senderEmail}
            onChange={handleChange}
            placeholder="you@example.com"
            style={{ 
              width: '100%', padding: '12px 15px', borderRadius: '12px', 
              border: '1px solid #e2e8f0', background: '#f8fafc',
              outline: 'none', transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = color}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <User size={16} /> Subject (Object)
          </label>
          <input 
            type="text" 
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this regarding?"
            style={{ 
              width: '100%', padding: '12px 15px', borderRadius: '12px', 
              border: '1px solid #e2e8f0', background: '#f8fafc',
              outline: 'none', transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = color}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <MessageSquare size={16} /> Message
          </label>
          <textarea 
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            style={{ 
              width: '100%', flex: 1, minHeight: '120px', padding: '12px 15px', borderRadius: '12px', 
              border: '1px solid #e2e8f0', background: '#f8fafc',
              outline: 'none', resize: 'vertical', transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = color}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          style={{ 
            background: color, color: 'white', padding: '12px', 
            borderRadius: '12px', border: 'none', fontWeight: '700',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
            marginTop: '10px', transition: '0.3s'
          }}
        >
          {status === 'loading' ? (
            <Loader size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <><Send size={20} /> Send Message</>
          )}
        </button>

        {status === 'success' && (
          <div style={{ color: '#10b981', background: '#d1fae5', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>
            Message sent successfully!
          </div>
        )}
        
        {status === 'error' && (
          <div style={{ color: '#ef4444', background: '#fee2e2', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>
            {errorMessage}
          </div>
        )}
      </form>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default ContactForm;
