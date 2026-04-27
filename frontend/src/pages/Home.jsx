import React, { useEffect, useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Video, 
  Bell, 
  Menu, 
  User,
  Mic,
  Send,
  Volume2,
  X,
  VolumeX,
  ChevronRight,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const SkeletonCard = () => (
  <div style={{ 
    background: 'var(--white)', 
    borderRadius: '24px', 
    padding: '1.2rem',
    boxShadow: 'var(--shadow)',
    aspectRatio: '1 / 1',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  }}>
    <div style={{ 
      height: '60%', 
      background: '#f0f2f5', 
      borderRadius: '16px',
      animation: 'pulse 1.5s infinite' 
    }} />
    <div style={{ height: '20px', width: '70%', background: '#f0f2f5', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
    <div style={{ height: '15px', width: '90%', background: '#f0f2f5', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
  </div>
);

const SkeletonUpdate = () => (
  <div style={{ 
    background: 'var(--white)', padding: '1.5rem', borderRadius: '20px', 
    boxShadow: 'var(--shadow)', border: '1px solid #edf2f7',
    display: 'flex', flexDirection: 'column', gap: '15px'
  }}>
    <div style={{ height: '20px', width: '60%', background: '#f0f2f5', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
    <div style={{ height: '60px', width: '100%', background: '#f0f2f5', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
    <div style={{ height: '15px', width: '30%', background: '#f0f2f5', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
  </div>
);

const Home = () => {
  const { language, t, speak } = useLanguage();
  const navigate = useNavigate();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem('aiMuted') === 'true');
  const [aiInput, setAiInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hello! I am your health assistant. How can I help you today?' }
  ]);
  const [videos, setVideos] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAiLoading, setIsAiLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${apiUrl}/videos?language=${language}`);
        const data = await res.json();
        console.log('Videos loaded:', data);
        setVideos(data);
      } catch (err) {
        console.error('Video fetch error:', err);
      }
    };

    const fetchUpdates = async () => {
      try {
        const res = await fetch(`${apiUrl}/updates`);
        const data = await res.json();
        console.log('Updates loaded:', data);
        setUpdates(data);
      } catch (err) {
        console.error('Update fetch error:', err);
      }
    };

    const loadAll = async () => {
      setLoading(true);
      await Promise.allSettled([fetchVideos(), fetchUpdates()]);
      setLoading(false);
    };

    loadAll();
  }, [language, apiUrl]);

  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'rw' ? 'sw-TZ' : (language === 'fr' ? 'fr-FR' : 'en-US');
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAiInput(transcript);
      // Auto-submit after voice input
      handleAiSubmit(null, transcript);
    };

    recognition.start();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('aiMuted', nextMuted);
    if (nextMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleAiSubmit = async (e, overrideInput = null) => {
    if (e) e.preventDefault();
    const input = overrideInput || aiInput;
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setChatHistory(prev => [...prev, userMessage]);
    setAiInput('');
    setIsListening(false);
    setIsAiLoading(true);

    try {
      const response = await fetch(`${apiUrl}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, language })
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
      if (!isMuted) {
        speak(data.answer);
      }
    } catch (err) {
      console.error('AI Error:', err);
      const errorMsg = 'Sorry, I am having trouble connecting right now.';
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      if (!isMuted) {
        speak(errorMsg);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const quickActions = [
    { id: 'pharmacy', icon: <MapPin size={24} />, title: t.findPharmacy, color: '#0052cc', desc: 'GPS Health Directory', path: '/pharmacies' },
    { id: 'protection', icon: <ShieldCheck size={24} />, title: t.protection, color: '#36b37e', desc: 'Private SRH & Mental Health', path: '/protection' },
    { id: 'help', icon: <MessageSquare size={24} />, title: t.getHelp, color: '#ff5630', desc: 'Talk to qualified professionals', path: '/help' }
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <Navbar />

      <main id="main-content" className="container" style={{ marginTop: '2rem' }}>
        {/* Welcome Hero */}
        <section style={{ marginBottom: '3rem', position: 'relative' }}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}
          >
            {t.welcome}
          </motion.h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{t.subtitle}</p>
        </section>

        <section 
          aria-label="Quick Actions"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '4rem'
          }}
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              role="button"
              aria-label={`${action.title}: ${action.desc}`}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleActionClick(action.path);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-hover)' }}
              onClick={() => handleActionClick(action.path)}
              style={{
                background: 'var(--white)',
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: 'var(--shadow)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '1rem',
                borderBottom: `6px solid ${action.color}`,
                aspectRatio: '1 / 1'
              }}
            >
              <div style={{ 
                background: `${action.color}15`, 
                padding: '1.2rem', 
                borderRadius: '16px',
                color: action.color
              }}>
                {action.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{action.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{action.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Featured Videos Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video color="var(--primary-green)" /> {t.featuredVideos}
            </h2>
            <button style={{ color: 'var(--primary-blue)', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer' }}>View Library</button>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {loading ? (
              [1, 2, 3].map(i => <SkeletonCard key={i} />)
            ) : videos.length > 0 ? videos.map((video) => (
              <motion.div 
                key={video.id} 
                whileHover={{ y: -10 }}
                style={{ 
                  background: 'var(--white)', 
                  borderRadius: '24px', 
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                  aspectRatio: '1 / 1', // Make it square
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ 
                  height: '60%', 
                  background: '#000',
                  position: 'relative'
                }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={getEmbedUrl(video.url)} 
                    title={video.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  ></iframe>
                </div>
                <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{video.title}</h4>
                  <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem', 
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{video.description}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>SIGN</span>
                    <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>CC</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <p style={{ color: 'var(--text-muted)' }}>No videos available for this language yet.</p>
            )}
          </div>
        </section>

        {/* Masterclasses Section */}
        <section style={{ 
          marginBottom: '4rem', 
          background: 'linear-gradient(135deg, var(--primary-blue) 0%, #003d99 100%)', 
          borderRadius: '24px', 
          padding: '3rem', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{t.latestUpdates}</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px' }}>
              Join our biannual online masterclasses on SRH and mental health. Connect with youth across Rwanda in a safe, judgment-free space.
            </p>
            <button 
              onClick={() => navigate('/cohorts')}
              style={{ 
                background: 'white', 
                color: 'var(--primary-blue)', 
                padding: '1rem 2.5rem', 
                borderRadius: '50px', 
                fontWeight: '700', 
                border: 'none', 
                cursor: 'pointer'
              }}
            >
              Join the Next Cohort
            </button>
          </div>
          <div style={{ 
            position: 'absolute', 
            right: '-50px', 
            bottom: '-50px', 
            width: '250px', 
            height: '250px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '50%' 
          }} />
        </section>

        {/* Update News Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ background: '#ff5630', padding: '10px', borderRadius: '10px', color: 'white' }}>
              <Bell size={24} />
            </div>
            <h2 style={{ fontSize: '1.8rem' }}>Update News</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {loading ? (
              [1, 2, 3].map(i => <SkeletonUpdate key={i} />)
            ) : updates.length > 0 ? updates.map((update) => (
              <motion.div 
                key={update.id}
                whileHover={{ y: -5 }}
                style={{ 
                  background: 'var(--white)', padding: '1.5rem', borderRadius: '20px', 
                  boxShadow: 'var(--shadow)', border: '1px solid #edf2f7',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--text-dark)' }}>{update.title}</h3>
                  <p 
                    style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: update.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' }}
                  />
                </div>
                <button 
                  onClick={() => setSelectedUpdate(update)}
                  style={{ 
                    alignSelf: 'flex-start', color: 'var(--primary-blue)', fontWeight: '700', 
                    border: 'none', background: 'none', cursor: 'pointer', display: 'flex', 
                    alignItems: 'center', gap: '5px', padding: 0
                  }}
                >
                  Read More <ChevronRight size={18} />
                </button>
              </motion.div>
            )) : (
              <p style={{ color: 'var(--text-muted)' }}>No news updates at the moment.</p>
            )}
          </div>
        </section>

        {/* Update Detail Side Drawer */}
        <AnimatePresence>
          {selectedUpdate && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUpdate(null)}
              style={{ 
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                zIndex: 3000, display: 'flex', justifyContent: 'flex-end'
              }}
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  background: 'white', width: '100%', maxWidth: '500px', height: '100vh',
                  padding: '3rem 2.5rem', position: 'relative', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                  display: 'flex', flexDirection: 'column', overflowY: 'auto'
                }}
              >
                <button 
                  onClick={() => setSelectedUpdate(null)}
                  style={{ 
                    position: 'absolute', top: '30px', right: '30px', border: 'none', 
                    background: '#f0f2f5', borderRadius: '50%', padding: '10px', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: '0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.target.style.background = '#f0f2f5'}
                >
                  <X size={24} />
                </button>

                <div style={{ marginTop: '2rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <span style={{ 
                      background: 'var(--primary-blue)', color: 'white', padding: '4px 12px', 
                      borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase'
                    }}>
                      Platform News
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(selectedUpdate.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 style={{ fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '1.5rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                    {selectedUpdate.title}
                  </h2>
                  
                  <div 
                    className="rich-text-content"
                    style={{ 
                      fontSize: '1.1rem', lineHeight: '1.8', color: '#4a5568', 
                      marginBottom: '3rem', borderLeft: '4px solid #edf2f7', paddingLeft: '1.5rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedUpdate.content }}
                  />

                  {selectedUpdate.file_url && (
                    <div style={{ 
                      marginTop: 'auto', padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                      borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center'
                    }}>
                      <div style={{ background: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Save size={24} color="var(--primary-blue)" />
                      </div>
                      <h4 style={{ marginBottom: '0.5rem' }}>Attached Document</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Download the full resource for this update.</p>
                      <a 
                        href={selectedUpdate.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: 'block', padding: '1rem', background: 'var(--primary-blue)', 
                          color: 'white', textDecoration: 'none', fontWeight: '700', borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 82, 204, 0.2)', transition: '0.3s'
                        }}
                      >
                        Open Resource
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />

      {/* Ask AI Assistant Floating Widget */}
      <div style={{ 
        position: 'fixed', 
        bottom: '40px', 
        right: '40px', 
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}>
        <AnimatePresence>
          {isAiOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              style={{
                width: '350px',
                height: '500px',
                background: 'var(--white)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '20px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ 
                background: 'var(--primary-blue)', 
                padding: '1.5rem', 
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={20} />
                  <span style={{ fontWeight: '600' }}>{t.askAi}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div 
                    onClick={toggleMute}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </div>
                  <X 
                    size={20} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setIsAiOpen(false)}
                    aria-label="Close Ask AI"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setIsAiOpen(false);
                    }}
                  />
                </div>
              </div>

              <div 
                aria-live="polite"
                style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}
              >
                {chatHistory.map((msg, idx) => (
                  <div key={idx} style={{ 
                    background: msg.role === 'user' ? 'var(--primary-blue)' : 'var(--bg-gray)', 
                    color: msg.role === 'user' ? 'white' : 'var(--text-dark)',
                    padding: '1rem', 
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    fontSize: '0.95rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    {msg.content}
                  </div>
                ))}
                {isAiLoading && (
                  <div style={{ 
                    background: 'var(--bg-gray)', 
                    color: 'var(--text-muted)',
                    padding: '0.8rem 1rem', 
                    borderRadius: '12px 12px 12px 2px',
                    alignSelf: 'flex-start',
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}>
                    Thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleAiSubmit} style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  background: 'var(--bg-gray)',
                  padding: '0.5rem 1rem',
                  borderRadius: '50px'
                }}>
                  <input 
                    type="text" 
                    placeholder={t.typeQuestion} 
                    aria-label="Ask a health question"
                    style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none' }}
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                  />
                  <Mic 
                    size={20} 
                    color={isListening ? "var(--primary-green)" : "var(--text-muted)"} 
                    style={{ cursor: 'pointer', animation: isListening ? 'pulse 1.5s infinite' : 'none' }} 
                    role="button"
                    aria-label={isListening ? "Listening..." : "Use voice input"}
                    tabIndex={0}
                    onClick={startListening}
                    onKeyPress={(e) => { if (e.key === 'Enter') startListening(); }}
                  />
                  <button 
                    type="submit" 
                    aria-label="Send message"
                    style={{ 
                      background: 'var(--primary-blue)', 
                      color: 'white', 
                      width: '35px', 
                      height: '35px', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none'
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => speak(`${t.welcome}. ${t.subtitle}. ${t.askAi} is available in the top right.`)}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--primary-blue)',
              color: 'var(--primary-blue)',
              padding: '0.8rem 1.2rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: 'var(--shadow)',
            }}
            aria-label="Read page summary aloud"
          >
            <Volume2 size={18} /> Read Page
          </button>

          <AnimatePresence>
            {!isAiOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  background: 'var(--white)',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  fontWeight: '600',
                  color: 'var(--primary-blue)',
                  border: '1px solid #e2e8f0'
                }}
              >
                {t.askAi}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAiOpen(!isAiOpen)}
            aria-label={isAiOpen ? "Close AI Assistant" : "Open AI Assistant"}
            aria-expanded={isAiOpen}
            style={{
              width: '65px',
              height: '65px',
              borderRadius: '50%',
              background: 'var(--primary-blue)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 82, 204, 0.4)',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            {isAiOpen ? <X size={28} /> : <MessageSquare size={28} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Home;
