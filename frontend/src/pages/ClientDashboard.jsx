import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, Upload, TrendingUp, CheckCircle, Clock, XCircle,
  Download, Eye, LogOut, ArrowLeft, Plus, MessageSquare, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState({
    documents_submitted: 0,
    documents_reviewed: 0,
    admission_status: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    documentType: 'chart',
    description: '',
    file: null
  });

  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchAnalytics(parsedUser.id);
    fetchDocuments(parsedUser.id);
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch(`${API_URL}/mental-health/mentors`);
      const data = await response.json();
      setMentors(data);
    } catch (err) {
      console.error('Error fetching mentors:', err);
    }
  };

  const fetchChats = async (clientId, mentorId) => {
    try {
      const response = await fetch(`${API_URL}/mental-health/chats/${clientId}/${mentorId}`);
      const data = await response.json();
      setChatMessages(data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMentor) return;
    try {
      const response = await fetch(`${API_URL}/mental-health/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: selectedMentor.id,
          message: newMessage
        })
      });
      if (response.ok) {
        setNewMessage('');
        fetchChats(user.id, selectedMentor.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const fetchAnalytics = async (clientId) => {
    try {
      const response = await fetch(`${API_URL}/mental-health/analytics/${clientId}`);
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setLoading(false);
    }
  };

  const fetchDocuments = async (clientId) => {
    try {
      const response = await fetch(`${API_URL}/mental-health/documents/client/${clientId}`);
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      alert('Please select a file');
      return;
    }

    try {
      // In a real app, you'd upload to a file server first, then get the URL
      // For now, we'll use a mock URL
      const fileUrl = URL.createObjectURL(uploadData.file);
      
      const response = await fetch(`${API_URL}/mental-health/submit-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: user.id,
          file_url: fileUrl,
          document_type: uploadData.documentType,
          description: uploadData.description
        })
      });

      if (response.ok) {
        alert('Document submitted successfully!');
        setUploadData({ documentType: 'assessment', description: '', file: null });
        setShowUploadModal(false);
        fetchDocuments(user.id);
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Error uploading document');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'admitted':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'admitted':
        return <CheckCircle size={24} color={getStatusColor(status)} />;
      case 'pending':
        return <Clock size={24} color={getStatusColor(status)} />;
      case 'rejected':
        return <XCircle size={24} color={getStatusColor(status)} />;
      default:
        return null;
    }
  };

  const statusData = [
    { name: 'Submitted', value: analytics.documents_submitted, color: '#3b82f6' },
    { name: 'Reviewed', value: analytics.documents_reviewed, color: '#10b981' }
  ];

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-dark)' }}>
            My Health Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Welcome, {user.username}
          </p>
        </motion.div>
        <button
          onClick={() => {
            navigate('/home');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--primary-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: `3px solid ${getStatusColor(analytics.admission_status)}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Admission Status
            </h2>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'capitalize' }}>
              {analytics.admission_status}
            </p>
          </div>
          <div style={{ fontSize: '3rem' }}>
            {getStatusIcon(analytics.admission_status)}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '0.5rem' }}>
        {['overview', 'documents', 'chat'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--primary-blue)' : 'none',
              color: activeTab === tab ? 'var(--primary-blue)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}
        >
          {/* Stats Cards */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>
                  Documents Submitted
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#3b82f6' }}>
                  {analytics.documents_submitted}
                </p>
              </div>
              <FileText size={40} color='#3b82f6' style={{ opacity: 0.8 }} />
            </div>
          </div>

          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>
                  Documents Reviewed
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981' }}>
                  {analytics.documents_reviewed}
                </p>
              </div>
              <CheckCircle size={40} color='#10b981' style={{ opacity: 0.8 }} />
            </div>
          </div>

          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>
                  Review Rate
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6' }}>
                  {analytics.documents_submitted > 0
                    ? Math.round((analytics.documents_reviewed / analytics.documents_submitted) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp size={40} color='#8b5cf6' style={{ opacity: 0.8 }} />
            </div>
          </div>

          {/* Actual Chart Implementation */}
          <div style={{
            gridColumn: '1 / -1',
            background: 'var(--card-bg)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
              Document Activity Chart
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '2rem'
            }}
          >
            <Plus size={20} /> Upload Document
          </button>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${doc.status === 'responded' ? '#10b981' : '#f59e0b'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                      {doc.document_type}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {doc.description}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Submitted: {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: doc.status === 'responded' ? '#d1fae5' : '#fef3c7',
                      color: doc.status === 'responded' ? '#10b981' : '#f59e0b',
                      textTransform: 'capitalize'
                    }}
                  >
                    {doc.status}
                  </div>
                </div>
              </motion.div>
            ))}
            {documents.length === 0 && (
              <div
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <FileText size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
                <p>No documents submitted yet</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <motion.div className="responsive-chat-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '2rem', height: '600px' }}>
          {/* Mentors List */}
          <div style={{ width: '300px', background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Mentors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mentors.map(mentor => (
                <button
                  key={mentor.id}
                  onClick={() => {
                    setSelectedMentor(mentor);
                    fetchChats(user.id, mentor.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '12px',
                    background: selectedMentor?.id === mentor.id ? 'var(--primary-blue)' : '#f8fafc',
                    color: selectedMentor?.id === mentor.id ? 'white' : 'var(--text-dark)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: selectedMentor?.id === mentor.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
                  }}>
                    {mentor.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700' }}>{mentor.username}</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Professional Mentor</p>
                  </div>
                </button>
              ))}
              {mentors.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No mentors available yet.</p>}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, background: 'var(--card-bg)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {selectedMentor ? (
              <>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                    {selectedMentor.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: '700' }}>{selectedMentor.username}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Secure connection</p>
                  </div>
                </div>
                
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f0f4f8' }}>
                  {chatMessages.map(msg => {
                    const isMine = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '70%',
                          padding: '1rem 1.2rem',
                          borderRadius: '16px',
                          background: isMine ? 'var(--primary-blue)' : 'white',
                          color: isMine ? 'white' : 'var(--text-dark)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                          borderBottomRightRadius: isMine ? '4px' : '16px',
                          borderBottomLeftRadius: isMine ? '16px' : '4px'
                        }}>
                          <p style={{ lineHeight: '1.5' }}>{msg.message}</p>
                          <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.7, marginTop: '0.5rem', textAlign: isMine ? 'right' : 'left' }}>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {chatMessages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                      <MessageSquare size={40} style={{ margin: '0 auto', opacity: 0.5, marginBottom: '1rem' }} />
                      <p>Send a message to start chatting with your mentor.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem', background: 'white' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '50px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem' }}
                  />
                  <button type="submit" disabled={!newMessage.trim()} style={{
                    width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    opacity: newMessage.trim() ? 1 : 0.5, transition: '0.2s'
                  }}>
                    <Send size={20} style={{ transform: 'translateX(-2px)' }} />
                  </button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <MessageSquare size={60} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3>Select a Mentor</h3>
                <p>Choose a mentor from the list to start chatting.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem'
            }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
                Upload Document
              </h2>
              <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Document Type
                  </label>
                  <select
                    value={uploadData.documentType}
                    onChange={(e) => setUploadData({ ...uploadData, documentType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value='assessment'>Assessment</option>
                    <option value='chart'>Chart</option>
                    <option value='report'>Report</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Description
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    placeholder='Describe the document...'
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      minHeight: '100px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    File
                  </label>
                  <input
                    type='file'
                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type='submit'
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--primary-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Upload
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowUploadModal(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#e5e7eb',
                      color: 'var(--text-dark)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
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

export default ClientDashboard;
