import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Shield, 
  Clock, 
  Send,
  User,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';

const Psychologists = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [psychologists, setPsychologists] = useState([]);
  const [selectedPsych, setSelectedPsych] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
   const [loading, setLoading] = useState(true);
   const messagesEndRef = useRef(null);
   
   const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
     scrollToBottom();
   }, [messages]);
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [userId] = useState(() => {
    const saved = localStorage.getItem('chat_user_id');
    if (saved) return saved;
    const newUser = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_user_id', newUser);
    return newUser;
  });

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    try {
      const res = await fetch(`${apiUrl}/psychologists`);
      const data = await res.json();
      setPsychologists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (selectedPsych) {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`${apiUrl}/psychologists/chat/${userId}/${selectedPsych.id}`);
          const data = await res.json();
          setMessages(data);
        } catch (err) {
          console.error(err);
        }
      };
      
      fetchMessages();
      interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [selectedPsych, userId, apiUrl]);

  const openChat = (psych) => {
    setSelectedPsych(psych);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      sender_id: userId,
      receiver_id: selectedPsych.id,
      message: newMessage
    };

    try {
      const res = await fetch(`${apiUrl}/psychologists/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      if (res.ok) {
        const savedMsg = await res.json();
        setMessages([...messages, savedMsg]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar />
      <header style={{ maxWidth: '1000px', margin: '2rem auto 3rem', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'var(--white)', border: '1px solid #e2e8f0', 
            cursor: 'pointer', color: 'var(--text-dark)', fontWeight: '700',
            padding: '0.8rem 1.2rem', borderRadius: '12px',
            boxShadow: 'var(--shadow)', transition: '0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-5px)';
            e.currentTarget.style.borderColor = 'var(--primary-blue)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <ArrowLeft size={20} color="var(--primary-blue)" /> Back to Home
        </button>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Ask a Professional</h1>
          <p style={{ color: 'var(--text-muted)' }}>Private and anonymous counseling with qualified experts.</p>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading professionals...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {psychologists.map((psych) => (
              <motion.div 
                key={psych.id}
                whileHover={{ y: -10 }}
                style={{ 
                  background: 'white', borderRadius: '24px', padding: '2rem', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                }}
              >
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <img 
                    src={psych.image_url} 
                    alt={psych.name} 
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f2f5' }}
                  />
                  <div style={{ 
                    position: 'absolute', bottom: '5px', right: '5px', 
                    width: '20px', height: '20px', borderRadius: '50%', 
                    background: psych.is_online ? '#36b37e' : '#ffab00',
                    border: '3px solid white'
                  }} title={psych.is_online ? 'Online' : 'Away'} />
                </div>
                
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{psych.name}</h3>
                <span style={{ 
                  background: '#f0f2f5', padding: '4px 12px', borderRadius: '50px', 
                  fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: '700', marginBottom: '1rem'
                }}>
                  {psych.specialty}
                </span>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {psych.bio}
                </p>

                <div style={{ width: '100%', borderTop: '1px solid #f0f2f5', paddingTop: '1.5rem', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <Clock size={16} /> {psych.availability}
                  </div>
                  <button 
                    onClick={() => openChat(psych)}
                    style={{ 
                      width: '100%', background: 'var(--primary-blue)', color: 'white', 
                      border: 'none', padding: '1rem', borderRadius: '14px', fontWeight: '700',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 82, 204, 0.2)'
                    }}
                  >
                    <MessageSquare size={18} /> Chat Privately
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Private Chat Drawer */}
      <AnimatePresence>
        {selectedPsych && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
              zIndex: 4000, display: 'flex', justifyContent: 'flex-end'
            }}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                background: 'white', width: '100%', maxWidth: '450px', height: '100vh',
                display: 'flex', flexDirection: 'column', position: 'relative'
              }}
            >
              {/* Chat Header */}
              <div style={{ 
                padding: '1.5rem 2rem', borderBottom: '1px solid #f0f2f5', 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={selectedPsych.image_url} alt="" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                  <div>
                    <h4 style={{ margin: 0 }}>{selectedPsych.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#36b37e', fontWeight: '600' }}>Active Now</span>
                  </div>
                </div>
                <X style={{ cursor: 'pointer' }} onClick={() => setSelectedPsych(null)} />
              </div>

              {/* Chat Privacy Notice */}
              <div style={{ background: '#fdf2f2', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff5630', fontSize: '0.8rem' }}>
                <Shield size={16} />
                <span>End-to-end private chat. Your identity is hidden.</span>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: '#f0f2f5', padding: '4px 12px', borderRadius: '50px' }}>
                    Chat started with {selectedPsych.name}
                  </span>
                </div>
                   {messages.map((m, i) => (
                   <div key={i} style={{ 
                     alignSelf: m.sender_id === userId ? 'flex-end' : 'flex-start',
                     maxWidth: '80%',
                     background: m.sender_id === userId ? 'var(--primary-blue)' : '#f0f2f5',
                     color: m.sender_id === userId ? 'white' : 'var(--text-dark)',
                     padding: '1rem',
                     borderRadius: m.sender_id === userId ? '18px 18px 0 18px' : '18px 18px 18px 0',
                     fontSize: '0.95rem',
                     lineHeight: '1.5'
                   }}>
                     {m.message}
                   </div>
                 ))}
                 <div ref={messagesEndRef} />
               </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '2rem', borderTop: '1px solid #f0f2f5' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your private message..."
                    style={{ 
                      width: '100%', padding: '1.2rem 4rem 1.2rem 1.5rem', borderRadius: '16px', 
                      border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button 
                    type="submit"
                    style={{ 
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'var(--primary-blue)', color: 'white', border: 'none',
                      width: '45px', height: '45px', borderRadius: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Psychologists;
