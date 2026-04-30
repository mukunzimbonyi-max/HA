import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Eye, Send, Download, CheckCircle, Clock, XCircle,
  LogOut, Filter, Search, MessageSquare, User, Calendar, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MentalHealthDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState([]);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentPanel, setShowDocumentPanel] = useState(false);
  const [showAdmissionPanel, setShowAdmissionPanel] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [admissionData, setAdmissionData] = useState({
    status: 'pending',
    notes: ''
  });

  // Chat States
  const [activeChatClient, setActiveChatClient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'mentor') {
      navigate('/home');
      return;
    }
    setUser(parsedUser);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, docsRes] = await Promise.all([
        fetch(`${API_URL}/mental-health/clients`),
        fetch(`${API_URL}/mental-health/documents/pending`)
      ]);

      const clientsData = await clientsRes.json();
      const docsData = await docsRes.json();

      setClients(clientsData);
      setPendingDocuments(docsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const fetchChats = async (clientId) => {
    try {
      const response = await fetch(`${API_URL}/mental-health/chats/${user.id}/${clientId}`);
      const data = await response.json();
      setChatMessages(data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatClient) return;
    try {
      const response = await fetch(`${API_URL}/mental-health/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: activeChatClient.id,
          message: newMessage
        })
      });
      if (response.ok) {
        setNewMessage('');
        fetchChats(activeChatClient.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleViewDocument = async (doc) => {
    setSelectedDocument(doc);
    setShowDocumentPanel(true);
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      alert('Please enter a response');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/mental-health/document-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: selectedDocument.id,
          professional_id: user.id,
          response_text: responseText,
          status: 'responded'
        })
      });

      if (response.ok) {
        alert('Response submitted successfully!');
        setResponseText('');
        setShowDocumentPanel(false);
        setSelectedDocument(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error submitting response:', err);
      alert('Error submitting response');
    }
  };

  const handleSetAdmissionStatus = async () => {
    if (!selectedClient) return;

    try {
      const response = await fetch(`${API_URL}/mental-health/admission-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient.id,
          status: admissionData.status,
          notes: admissionData.notes
        })
      });

      if (response.ok) {
        alert('Admission status updated successfully!');
        setShowAdmissionPanel(false);
        setAdmissionData({ status: 'pending', notes: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Error updating admission status:', err);
      alert('Error updating admission status');
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
      case 'submitted':
        return '#3b82f6';
      case 'reviewed':
        return '#8b5cf6';
      case 'responded':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'admitted':
      case 'responded':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'submitted':
        return <FileText size={16} />;
      default:
        return null;
    }
  };

  const filteredClients = clients.filter(client =>
    client.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-dark)' }}>
            Mental Health Professional Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Dr. {user.username} - Review & Support
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

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}
      >
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
                Total Clients
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#3b82f6' }}>
                {clients.length}
              </p>
            </div>
            <User size={40} color='#3b82f6' style={{ opacity: 0.8 }} />
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
                Pending Reviews
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b' }}>
                {pendingDocuments.length}
              </p>
            </div>
            <FileText size={40} color='#f59e0b' style={{ opacity: 0.8 }} />
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
                Response Rate
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981' }}>
                {clients.length > 0
                  ? Math.round((clients.filter(c => c.documents_count > 0).length / clients.length) * 100)
                  : 0}%
              </p>
            </div>
            <CheckCircle size={40} color='#10b981' style={{ opacity: 0.8 }} />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '0.5rem' }}>
        {['clients', 'pending', 'chat'].map((tab) => (
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
            {tab === 'pending' && (
              <span style={{
                marginLeft: '0.5rem',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {pendingDocuments.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type='text'
              placeholder='Search clients by name or email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredClients.map((client) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setSelectedClient(client);
                  setShowAdmissionPanel(true);
                }}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onHover={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                      {client.username}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {client.email}
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <span>📄 {client.documents_count} Documents</span>
                      {client.last_submission && (
                        <span>📅 Last: {new Date(client.last_submission).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setShowAdmissionPanel(true);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--primary-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    Set Status
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredClients.length === 0 && (
              <div
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <User size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
                <p>No clients found</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Pending Documents Tab */}
      {activeTab === 'pending' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${getStatusColor(doc.status)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                        {doc.username}
                      </h3>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: '#e0e7ff',
                          color: '#3b82f6',
                          textTransform: 'capitalize'
                        }}
                      >
                        {doc.document_type}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {doc.description}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      📧 {doc.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDocument(doc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'var(--primary-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    <Eye size={16} /> Review
                  </button>
                </div>
              </motion.div>
            ))}
            {pendingDocuments.length === 0 && (
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
                <p>No pending documents to review</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <motion.div className="responsive-chat-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '2rem', height: '600px' }}>
          {/* Clients List */}
          <div style={{ width: '300px', background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Clients</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {clients.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveChatClient(c);
                    fetchChats(c.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '12px',
                    background: activeChatClient?.id === c.id ? 'var(--primary-blue)' : '#f8fafc',
                    color: activeChatClient?.id === c.id ? 'white' : 'var(--text-dark)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: activeChatClient?.id === c.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
                  }}>
                    {c.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700' }}>{c.username}</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Client</p>
                  </div>
                </button>
              ))}
              {clients.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No clients assigned yet.</p>}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, background: 'var(--card-bg)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {activeChatClient ? (
              <>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                    {activeChatClient.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: '700' }}>{activeChatClient.username}</h3>
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
                      <p>Send a message to start chatting with {activeChatClient.username}.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendChatMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem', background: 'white' }}>
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
                <h3>Select a Client</h3>
                <p>Choose a client from the list to start chatting.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Document Review Panel */}
      <AnimatePresence>
        {showDocumentPanel && selectedDocument && (
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
            onClick={() => setShowDocumentPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="responsive-modal-inner"
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                {selectedDocument.username} - {selectedDocument.document_type}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {selectedDocument.description}
              </p>
              <div
                style={{
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  minHeight: '200px'
                }}
              >
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  📎 Document Preview<br/>
                  <a href={selectedDocument.file_url} target='_blank' rel='noopener noreferrer'
                    style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>
                    View Full Document
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder='Provide feedback, recommendations, or next steps...'
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    minHeight: '150px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSubmitResponse}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--primary-blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Send size={18} /> Send Response
                </button>
                <button
                  onClick={() => setShowDocumentPanel(false)}
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
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admission Status Panel */}
      <AnimatePresence>
        {showAdmissionPanel && selectedClient && (
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
            onClick={() => setShowAdmissionPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="responsive-modal-inner"
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                Set Admission Status
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Client: {selectedClient.username}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Status
                </label>
                <select
                  value={admissionData.status}
                  onChange={(e) => setAdmissionData({ ...admissionData, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value='pending'>Pending</option>
                  <option value='admitted'>Admitted</option>
                  <option value='rejected'>Rejected</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Notes
                </label>
                <textarea
                  value={admissionData.notes}
                  onChange={(e) => setAdmissionData({ ...admissionData, notes: e.target.value })}
                  placeholder='Add comments or recommendations...'
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

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSetAdmissionStatus}
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
                  Save Status
                </button>
                <button
                  onClick={() => setShowAdmissionPanel(false)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentalHealthDashboard;
