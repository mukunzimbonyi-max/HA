import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Wifi, 
  Clock, 
  Trophy, 
  CreditCard, 
  Smartphone,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Cohorts = () => {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('list'); // list, requirements, application, payment
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const [checkedReqs, setCheckedReqs] = useState({});
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await fetch(`${API_URL}/cohorts`);
        if (!response.ok) throw new Error('Fetch failed');
        const data = await response.json();
        if (data && data.length > 0) {
          setCohorts(data);
        } else {
          throw new Error('Empty data');
        }
      } catch (err) {
        console.error('Error fetching cohorts:', err);
        // Robust frontend fallback
        setCohorts([
          { id: 4, name: 'SRH Empowerment Cohort 1', description: 'Comprehensive SRH education for youth across Rwanda. Focus on rights and healthy choices.', start_date: '2024-06-01', status: 'open' },
          { id: 5, name: 'Mental Health Resilience', description: 'Building emotional strength and community support systems in a safe space.', start_date: '2024-07-15', status: 'open' },
          { id: 6, name: 'Healthy Relationships', description: 'Navigating boundaries, consent, and effective communication with experts.', start_date: '2024-08-20', status: 'open' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCohorts();
  }, []);

  const handleApplyClick = (cohort) => {
    setSelectedCohort(cohort);
    setStep('requirements');
    setCheckedReqs({});
  };

  const handleToggleReq = (index) => {
    setCheckedReqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const requirements = [
    { icon: <Wifi size={20} />, text: "Access to stable internet" },
    { icon: <Clock size={20} />, text: "Available for 24+ hours per week" },
    { icon: <Zap size={20} />, text: "Understanding of expected outcomes" },
    { icon: <Calendar size={20} />, text: "Minimum 3 months commitment" },
    { icon: <Trophy size={20} />, text: "Professional certificate upon completion" }
  ];

  const allChecked = requirements.length > 0 && 
    Object.keys(checkedReqs).filter(k => checkedReqs[k]).length === requirements.length;

  const handleProceedToAuth = () => {
    if (!user) {
      navigate('/auth');
    } else {
      setStep('application');
    }
  };

  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/cohorts/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohort_id: selectedCohort?.id,
          user_id: user?.id,
          full_name: user?.username,
          email: user?.email,
          motivation: motivation
        })
      });
      if (response.ok) {
        setStep('payment');
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.error || 'Server error'}. Please try logging out and back in.`);
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('An error occurred. Please make sure the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [paymentPhone, setPaymentPhone] = useState(user?.phone || '');
  const [isPaying, setIsPaying] = useState(false);

  const handleInitiatePayment = async () => {
    if (!paymentPhone || paymentPhone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    setIsPaying(true);
    try {
      // Step 1: Create Invoice
      const invRes = await fetch(`${API_URL}/payments/create-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 5000,
          description: `Application Fee for ${selectedCohort.name}`,
          customer: {
            name: user.username,
            email: user.email,
            phoneNumber: paymentPhone
          }
        })
      });
      const invData = await invRes.json();
      
      if (!invData.success) throw new Error('Invoice creation failed');

      // Step 2: Initiate Push
      const pushRes = await fetch(`${API_URL}/payments/initiate-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: paymentPhone,
          provider: paymentMethod === 'momo' ? 'MTN' : 'AIRTEL',
          invoiceNumber: invData.data.invoiceNumber
        })
      });
      const pushData = await pushRes.json();

      if (pushData.success) {
        alert(`Payment initiated! Please check your phone (${paymentPhone}) for the ${paymentMethod.toUpperCase()} prompt.`);
        navigate('/home');
      } else {
        alert('Payment initiation failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      alert('An error occurred during payment. Please contact support.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      
      <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem', paddingBottom: '5rem' }}>
        <AnimatePresence mode="wait">
          {step === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button 
                  onClick={() => navigate('/home')}
                  style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}
                >
                  <ArrowLeft size={24} color="var(--primary-blue)" />
                </button>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Platform Masterclasses</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Choose your path and start your journey today.</p>
                </div>
              </header>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>Loading cohorts...</div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {cohorts.map((cohort, i) => (
                    <motion.div
                      key={cohort.id}
                      whileHover={{ y: -5 }}
                      style={{
                        background: 'white', padding: '2.5rem', borderRadius: '24px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', 
                        justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{cohort.name}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{cohort.description}</p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600' }}>
                            Starts: {new Date(cohort.start_date).toLocaleDateString()}
                          </span>
                          <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {cohort.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleApplyClick(cohort)}
                        style={{ background: 'var(--primary-blue)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Apply Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {step === 'requirements' && (
            <motion.div 
              key="requirements"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', padding: '4rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}
            >
              <button onClick={() => setStep('list')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: '700', cursor: 'pointer', marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to List
              </button>
              
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1rem' }}>Application Requirements</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>Please review the following requirements before proceeding with your application for <strong style={{ color: 'var(--text-dark)' }}>{selectedCohort.name}</strong>.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {requirements.map((req, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleToggleReq(i)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem', 
                      background: checkedReqs[i] ? '#eef2ff' : '#f8fafc', 
                      borderRadius: '16px', cursor: 'pointer', transition: '0.3s',
                      border: checkedReqs[i] ? '2px solid var(--primary-blue)' : '2px solid transparent'
                    }}
                  >
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '6px', 
                      border: '2px solid var(--primary-blue)', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      background: checkedReqs[i] ? 'var(--primary-blue)' : 'transparent',
                      color: 'white', transition: '0.2s'
                    }}>
                      {checkedReqs[i] && <CheckCircle2 size={16} />}
                    </div>
                    <div style={{ color: 'var(--primary-blue)' }}>{req.icon}</div>
                    <span style={{ fontWeight: '600', color: checkedReqs[i] ? 'var(--primary-blue)' : 'var(--text-muted)' }}>{req.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff0f0', padding: '2rem', borderRadius: '20px', border: '1px solid #ffdbdb', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                  <Info size={20} color="#ff5630" />
                  <h4 style={{ color: '#ff5630', fontWeight: '800' }}>Registration Fee</h4>
                </div>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  After submitting your application, you will be required to pay a one-time application fee of <strong style={{ color: '#ff5630', fontSize: '1.2rem' }}>5,000 RWF</strong> to secure your spot.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                {user ? (
                  <button 
                    disabled={!allChecked}
                    onClick={() => setStep('application')}
                    style={{ 
                      background: allChecked ? 'var(--primary-blue)' : '#cbd5e1', 
                      color: 'white', border: 'none', padding: '1.2rem 3rem', 
                      borderRadius: '16px', fontWeight: '800', 
                      cursor: allChecked ? 'pointer' : 'not-allowed', flex: 1,
                      transition: '0.3s'
                    }}
                  >
                    Continue to Application
                  </button>
                ) : (
                  <>
                    <button 
                      disabled={!allChecked}
                      onClick={() => navigate('/auth')}
                      style={{ 
                        background: allChecked ? 'var(--primary-blue)' : '#cbd5e1', 
                        color: 'white', border: 'none', padding: '1.2rem 2rem', 
                        borderRadius: '16px', fontWeight: '800', 
                        cursor: allChecked ? 'pointer' : 'not-allowed', flex: 1,
                        transition: '0.3s'
                      }}
                    >
                      Login to Apply
                    </button>
                    <button 
                      disabled={!allChecked}
                      onClick={() => navigate('/auth')}
                      style={{ 
                        background: 'white', 
                        color: allChecked ? 'var(--primary-blue)' : '#cbd5e1', 
                        border: allChecked ? '2px solid var(--primary-blue)' : '2px solid #cbd5e1', 
                        padding: '1.2rem 2rem', borderRadius: '16px', fontWeight: '800', 
                        cursor: allChecked ? 'pointer' : 'not-allowed', flex: 1,
                        transition: '0.3s'
                      }}
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {step === 'application' && (
            <motion.div 
              key="application"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'white', padding: '4rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}
            >
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem' }}>Complete Application</h2>
              <form onSubmit={handleApplicationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Full Name</label>
                    <input type="text" readOnly value={user?.username} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Email Address</label>
                    <input type="email" readOnly value={user?.email} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Why do you want to join this cohort?</label>
                  <textarea 
                    required 
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Tell us about your interest..." 
                    style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '120px' }} 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ 
                    background: isSubmitting ? '#cbd5e1' : 'var(--primary-blue)', 
                    color: 'white', border: 'none', padding: '1.2rem', 
                    borderRadius: '16px', fontWeight: '800', 
                    cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '1rem' 
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit & Proceed to Payment'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div 
              key="payment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'white', padding: '4rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center' }}
            >
              <div style={{ background: '#dcfce7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#15803d' }}>
                <ShieldCheck size={40} />
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1rem' }}>Application Submitted!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Final step: Pay the application fee via **IremboPay** to activate your enrollment.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                {[
                  { id: 'momo', label: 'MTN Mobile Money', icon: <Smartphone />, color: '#ffcc00', official: '0787065284' },
                  { id: 'airtel', label: 'Airtel Money', icon: <Smartphone />, color: '#ff0000', official: '0721151169' }
                ].map(method => (
                  <div 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{ 
                      padding: '2rem 1.5rem', borderRadius: '24px', border: paymentMethod === method.id ? `3px solid ${method.color}` : '1px solid #e2e8f0',
                      cursor: 'pointer', transition: '0.3s', background: paymentMethod === method.id ? `${method.color}05` : 'white',
                      position: 'relative', overflow: 'hidden'
                    }}
                  >
                    {paymentMethod === method.id && <div style={{ position: 'absolute', top: 0, right: 0, background: method.color, color: 'white', padding: '4px 12px', fontSize: '0.7rem', fontWeight: '800' }}>SELECTED</div>}
                    <div style={{ color: method.color, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{method.icon}</div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{method.label}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Official: {method.official}</p>
                  </div>
                ))}
              </div>

              {paymentMethod && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>Enter Your Phone Number</label>
                    <input 
                      type="text" 
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      placeholder="07********"
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1.1rem', fontWeight: '600' }}
                    />
                  </div>
                  <button 
                    disabled={isPaying}
                    onClick={handleInitiatePayment}
                    style={{ 
                      background: 'var(--primary-blue)', color: 'white', border: 'none', 
                      padding: '1.2rem 4rem', borderRadius: '16px', fontWeight: '800', 
                      cursor: isPaying ? 'not-allowed' : 'pointer', fontSize: '1.1rem', width: '100%',
                      boxShadow: '0 10px 20px rgba(0, 82, 204, 0.2)'
                    }}
                  >
                    {isPaying ? 'Processing Push...' : 'Pay 5,000 RWF Now'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Cohorts;
