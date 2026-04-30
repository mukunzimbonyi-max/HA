import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Video, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  ChevronRight,
  Hospital,
  Stethoscope,
  Home as HomeIcon,
  Bell,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  XCircle,
  LogOut,
  UserX,
  UserCheck,
  BarChart,
  UserCog
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('facilities');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [facilities, setFacilities] = useState([]);
  const [videos, setVideos] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminCreds.username === 'Jeremie' && adminCreds.password === '123456') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Access denied.');
    }
  };

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    type: 'pharmacy',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    opening_hours: ''
  });

  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    url: '',
    language: 'en'
  });

  const [updateData, setUpdateData] = useState({
    title: '',
    content: '',
    file_url: ''
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [activeTab, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #f6f8fb 0%, #e9edf3 100%)',
        padding: '2rem'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'white', 
            padding: '3rem', 
            borderRadius: '24px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
          }}
        >
          <div style={{ background: 'var(--primary-blue)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white' }}>
            <LayoutDashboard size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Admin Access</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please enter your credentials to manage the platform.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>Username</label>
              <input 
                type="text" 
                required
                value={adminCreds.username}
                onChange={(e) => setAdminCreds({...adminCreds, username: e.target.value})}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                placeholder="Enter username"
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>Password</label>
              <input 
                type="password" 
                required
                value={adminCreds.password}
                onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                placeholder="••••••••"
              />
            </div>
            {loginError && <p style={{ color: '#ff5630', fontSize: '0.85rem', fontWeight: '600' }}>{loginError}</p>}
            <button 
              type="submit"
              style={{ 
                background: 'var(--primary-blue)', color: 'white', border: 'none', 
                padding: '1rem', borderRadius: '12px', fontWeight: '700', marginTop: '1rem',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 82, 204, 0.2)'
              }}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => navigate('/home')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              Back to Website
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'facilities') {
        const res = await fetch(`${API_URL}/facilities/nearby?lat=-1.94&lng=30.06&radius=100`);
        const data = await res.json();
        setFacilities(data);
      } else if (activeTab === 'videos') {
        const res = await fetch(`${API_URL}/videos`);
        const data = await res.json();
        setVideos(data);
      } else if (activeTab === 'updates' || activeTab === 'masterclasses') {
        const res = await fetch(`${API_URL}/updates`);
        const data = await res.json();
        setUpdates(data);
      } else if (activeTab === 'masterclasses') {
        const res = await fetch(`${API_URL}/cohorts`);
        const data = await res.json();
        setUpdates(data); // Reusing updates state for listing cohorts in this tab
      } else if (activeTab === 'applications') {
        const res = await fetch(`${API_URL}/cohorts/applications`);
        const data = await res.json();
        setApplications(data);
      } else if (activeTab === 'users') {
        const res = await fetch(`${API_URL}/admin/users`);
        const data = await res.json();
        setUsersData(data);
      } else if (activeTab === 'analytics') {
        const res = await fetch(`${API_URL}/admin/analytics`);
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = async (id) => {
    try {
      const res = await fetch(`${API_URL}/cohorts/applications/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        alert('Application approved!');
        fetchData();
      }
    } catch (err) {
      console.error('Error approving:', err);
    }
  };

  const handleRejectApplication = async (id) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;
    try {
      const res = await fetch(`${API_URL}/cohorts/applications/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        alert('Application rejected.');
        fetchData();
      }
    } catch (err) {
      console.error('Error rejecting:', err);
    }
  };

  const handleSuspendUser = async (id, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    if (!window.confirm(`Are you sure you want to ${currentStatus === 'suspended' ? 'activate' : 'suspend'} this user?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/suspend`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert(`User successfully ${newStatus}!`);
        fetchData();
      }
    } catch (err) {
      console.error('Error suspending user:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('WARNING: This will permanently delete this user. Are you sure?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('User deleted.');
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `${API_URL}/facilities/${editingId}` : `${API_URL}/facilities`;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert(editingId ? 'Facility information updated!' : 'Facility saved successfully!');
        closeModal();
        fetchData();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Network error. Please make sure the backend is running.');
      console.error('Error adding facility:', err);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `${API_URL}/videos/${editingId}` : `${API_URL}/videos`;

    const sanitizedData = {
      ...videoData,
      url: getEmbedUrl(videoData.url)
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      });
      if (response.ok) {
        alert(editingId ? 'Video updated successfully!' : 'Video saved successfully!');
        closeModal();
        fetchData();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Network error. Please make sure the backend is running.');
      console.error('Error adding video:', err);
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `${API_URL}/updates/${editingId}` : `${API_URL}/updates`;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (response.ok) {
        alert(editingId ? 'Update modified!' : 'Update posted successfully!');
        closeModal();
        fetchData();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Network error. Please make sure the backend is running.');
      console.error('Error adding update:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    if (activeTab === 'facilities') {
      setFormData({
        name: item.name,
        type: item.type,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        phone: item.phone || '',
        opening_hours: item.opening_hours || ''
      });
    } else if (activeTab === 'videos') {
      setVideoData({
        title: item.title,
        description: item.description,
        url: item.url,
        language: item.language
      });
    } else if (activeTab === 'updates') {
      setUpdateData({
        title: item.title,
        content: item.content,
        file_url: item.file_url || ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', type: 'pharmacy', address: '', latitude: '', longitude: '', phone: '', opening_hours: '' });
    setVideoData({ title: '', description: '', url: '', language: 'en' });
    setUpdateData({ title: '', content: '', file_url: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const endpoint = activeTab === 'facilities' ? 'facilities' : 
                      activeTab === 'videos' ? 'videos' : 
                      activeTab === 'masterclasses' ? 'cohorts' : 'updates';
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
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
    <div className="responsive-dashboard" style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: 'var(--white)', 
        borderRight: '1px solid #e2e8f0',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary-blue)', padding: '10px', borderRadius: '12px', color: 'white' }}>
            <LayoutDashboard size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-dark)' }}>Admin Console</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => navigate('/home')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              color: 'var(--text-dark)', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '700', transition: '0.3s',
              background: 'white', marginBottom: '1.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
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
          <button 
            onClick={() => setActiveTab('facilities')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              background: activeTab === 'facilities' ? 'var(--primary-blue)' : 'transparent',
              color: activeTab === 'facilities' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s'
            }}
          >
            <MapPin size={20} /> GPS Directory
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              background: activeTab === 'videos' ? 'var(--primary-blue)' : 'transparent',
              color: activeTab === 'videos' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s'
            }}
          >
            <Video size={20} /> Video Library
          </button>
          <button 
            onClick={() => setActiveTab('updates')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              background: activeTab === 'updates' ? 'var(--primary-blue)' : 'transparent',
              color: activeTab === 'updates' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s'
            }}
          >
            <Bell size={20} /> Platform Updates
          </button>
          <button 
            onClick={() => setActiveTab('masterclasses')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              background: activeTab === 'masterclasses' ? 'var(--primary-blue)' : 'transparent',
              color: activeTab === 'masterclasses' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s'
            }}
          >
            <Users size={20} /> Masterclasses
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              background: activeTab === 'applications' ? 'var(--primary-blue)' : 'transparent',
              color: activeTab === 'applications' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s'
            }}
          >
            <ShieldCheck size={20} /> Applications
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              background: activeTab === 'users' ? 'var(--primary-blue)' : 'transparent',
              color: activeTab === 'users' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s'
            }}
          >
            <UserCog size={20} /> User Management
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px',
              background: activeTab === 'analytics' ? 'var(--primary-blue)' : 'transparent',
              color: activeTab === 'analytics' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s'
            }}
          >
            <BarChart size={20} /> Analytics
          </button>

          {/* Logout button removed as per request */}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-dark)' }}>
              {activeTab === 'facilities' ? 'GPS Health Directory' : 
               activeTab === 'videos' ? 'Educational Library' : 
               activeTab === 'users' ? 'User Management' :
               activeTab === 'analytics' ? 'Platform Analytics' : 'Masterclass Cohorts'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage your platform content and services.</p>
          </div>
          {activeTab !== 'applications' && activeTab !== 'users' && activeTab !== 'analytics' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{ 
                background: 'var(--primary-blue)', color: 'white', border: 'none', 
                padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '700',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 82, 204, 0.3)'
              }}
            >
              <Plus size={20} /> Add New {activeTab === 'facilities' ? 'Facility' : 'Item'}
            </button>
          )}
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading content...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {activeTab === 'facilities' && facilities.map(f => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                  background: 'white', padding: '1.5rem', borderRadius: '16px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #edf2f7'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ 
                    background: f.type === 'hospital' ? '#fff0f0' : '#f0fff0', 
                    padding: '12px', borderRadius: '12px', color: f.type === 'hospital' ? '#ff5630' : '#36b37e'
                  }}>
                    {f.type === 'hospital' ? <Hospital size={24} /> : <Stethoscope size={24} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>{f.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{f.address} • {f.type}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(f)}
                    style={{ background: '#f8f9fa', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Edit size={18} color="var(--text-muted)" /></button>
                  <button 
                    onClick={() => handleDelete(f.id)}
                    style={{ background: '#fff0f0', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Trash2 size={18} color="#ff5630" /></button>
                </div>
              </motion.div>
            ))}

            {activeTab === 'videos' && videos.map(v => (
              <motion.div 
                key={v.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                  background: 'white', padding: '1.5rem', borderRadius: '16px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #edf2f7'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '12px', color: 'var(--primary-blue)' }}>
                    <Video size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>{v.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Language: {v.language.toUpperCase()}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(v)}
                    style={{ background: '#f8f9fa', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Edit size={18} color="var(--text-muted)" /></button>
                  <button 
                    onClick={() => handleDelete(v.id)}
                    style={{ background: '#fff0f0', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Trash2 size={18} color="#ff5630" /></button>
                </div>
              </motion.div>
            ))}

            {activeTab === 'updates' && updates.map(u => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                  background: 'white', padding: '1.5rem', borderRadius: '16px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #edf2f7'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: '#fdf2f2', padding: '12px', borderRadius: '12px', color: '#ff5630' }}>
                    <Bell size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>{u.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{u.content.substring(0, 60)}...</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(u)}
                    style={{ background: '#f8f9fa', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Edit size={18} color="var(--text-muted)" /></button>
                  <button 
                    onClick={() => handleDelete(u.id)}
                    style={{ background: '#fff0f0', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Trash2 size={18} color="#ff5630" /></button>
                </div>
              </motion.div>
            ))}

            {activeTab === 'masterclasses' && updates.map(c => (
              <motion.div 
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                  background: 'white', padding: '1.5rem', borderRadius: '16px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #edf2f7'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: '#eef2ff', padding: '12px', borderRadius: '12px', color: 'var(--primary-blue)' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>{c.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status: {c.status.toUpperCase()} • Starts: {new Date(c.start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(c)}
                    style={{ background: '#f8f9fa', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Edit size={18} color="var(--text-muted)" /></button>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    style={{ background: '#fff0f0', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  ><Trash2 size={18} color="#ff5630" /></button>
                </div>
              </motion.div>
            ))}

            {activeTab === 'masterclasses' && updates.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                <Users size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <h3>No cohorts created yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>Click "Add New Item" to start your first masterclass cohort.</p>
              </div>
            )}

            {activeTab === 'applications' && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px' }}>
                    <ShieldCheck size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                    <h3>No pending applications</h3>
                  </div>
                ) : (
                  applications.map(app => (
                    <motion.div 
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        background: 'white', padding: '2rem', borderRadius: '20px', 
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #edf2f7',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{app.full_name}</h3>
                          <span style={{ 
                            background: app.status === 'pending' ? '#fff9e6' : app.status === 'approved' ? '#e6fff0' : '#fff0f0',
                            color: app.status === 'pending' ? '#b78103' : app.status === 'approved' ? '#00875a' : '#ff5630',
                            padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase'
                          }}>
                            {app.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          <strong>Cohort:</strong> {app.cohort_name}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          <strong>Motivation:</strong> {app.motivation}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Submitted on: {new Date(app.created_at).toLocaleString()}</p>
                      </div>
                      
                      {app.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            onClick={() => handleApproveApplication(app.id)}
                            style={{ 
                              background: '#e6fff0', color: '#00875a', border: 'none', 
                              padding: '10px 20px', borderRadius: '12px', fontWeight: '700', 
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
                            }}
                          >
                            <CheckCircle size={18} /> Approve
                          </button>
                          <button 
                            onClick={() => handleRejectApplication(app.id)}
                            style={{ 
                              background: '#fff0f0', color: '#ff5630', border: 'none', 
                              padding: '10px 20px', borderRadius: '12px', fontWeight: '700', 
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
                            }}
                          >
                            <XCircle size={18} /> Reject
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {usersData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px' }}>
                    <Users size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                    <h3>No users found</h3>
                  </div>
                ) : (
                  usersData.map(u => (
                    <motion.div 
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        background: 'white', padding: '1.5rem', borderRadius: '20px', 
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #edf2f7',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ 
                          width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', 
                          background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {u.profile_picture ? (
                            <img src={u.profile_picture.startsWith('http') ? u.profile_picture : `${API_URL.replace('/api', '')}${u.profile_picture}`} alt={u.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <User size={24} color="var(--text-muted)" />
                          )}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {u.username} 
                            <span style={{ 
                              background: u.status === 'suspended' ? '#fff0f0' : '#e6fff0',
                              color: u.status === 'suspended' ? '#ff5630' : '#00875a',
                              padding: '2px 8px', borderRadius: '50px', fontSize: '0.7rem', textTransform: 'uppercase'
                            }}>
                              {u.status || 'active'}
                            </span>
                          </h3>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{u.email} • Role: {u.role}</p>
                          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Joined: {new Date(u.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleSuspendUser(u.id, u.status || 'active')}
                          style={{ 
                            background: u.status === 'suspended' ? '#e6fff0' : '#fff0f0', 
                            color: u.status === 'suspended' ? '#00875a' : '#ff5630', 
                            border: 'none', padding: '10px 15px', borderRadius: '12px', fontWeight: '700', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
                          }}
                        >
                          {u.status === 'suspended' ? <UserCheck size={18} /> : <UserX size={18} />}
                          {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          style={{ 
                            background: '#f8f9fa', color: '#ff5630', border: 'none', 
                            padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' 
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'analytics' && analyticsData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}
                  >
                    <h2 style={{ fontSize: '3rem', color: 'var(--primary-blue)', fontWeight: '800' }}>{analyticsData.totalUsers}</h2>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Total Registered Users</p>
                  </motion.div>
                  
                  {analyticsData.roles.map((r, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
                      style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}
                    >
                      <h2 style={{ fontSize: '3rem', color: '#36b37e', fontWeight: '800' }}>{r.count}</h2>
                      <p style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'capitalize' }}>{r.role}s</p>
                    </motion.div>
                  ))}
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>User Status Overview</h3>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    {analyticsData.statuses.map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: s.status === 'suspended' ? '#ff5630' : '#00875a' }}></div>
                        <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{s.status || 'active'}: {s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>Recent Signups (Last 7 Days)</h3>
                  {analyticsData.recentSignups.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No recent signups in the last 7 days.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {analyticsData.recentSignups.map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                          <span style={{ fontWeight: '600' }}>{new Date(s.date).toLocaleDateString()}</span>
                          <span style={{ color: 'var(--primary-blue)', fontWeight: '800' }}>+{s.count} users</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal Placeholder */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2000, padding: '2rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ 
                background: 'white', 
                borderRadius: '32px', 
                width: '95%', 
                maxWidth: '1200px', 
                padding: '3rem', 
                maxHeight: '90vh', 
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{editingId ? 'Edit' : 'Add New'} {activeTab === 'facilities' ? 'Facility' : activeTab === 'videos' ? 'Video' : 'Update'}</h2>
                <button 
                  onClick={closeModal}
                  style={{ background: '#f0f2f5', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', transition: '0.3s' }}
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={activeTab === 'facilities' ? handleAddFacility : activeTab === 'videos' ? handleAddVideo : handleAddUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {activeTab === 'facilities' ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Facility Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Kigali City Pharmacy" 
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Type</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      >
                        <option value="pharmacy">Pharmacy</option>
                        <option value="hospital">Hospital/Health Center</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Address</label>
                      <input 
                        type="text" 
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Street, City" 
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Latitude</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={formData.latitude}
                          onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                          placeholder="-1.94" 
                          style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Longitude</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={formData.longitude}
                          onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                          placeholder="30.06" 
                          style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                        />
                      </div>
                    </div>
                  </>
                ) : activeTab === 'videos' ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Video Title</label>
                      <input 
                        type="text" 
                        required
                        value={videoData.title}
                        onChange={(e) => setVideoData({...videoData, title: e.target.value})}
                        placeholder="e.g. Sexual Health Basics" 
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Description</label>
                      <textarea 
                        required
                        value={videoData.description}
                        onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                        placeholder="Short summary..." 
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>YouTube Embed URL</label>
                      <input 
                        type="url" 
                        required
                        value={videoData.url}
                        onChange={(e) => setVideoData({...videoData, url: e.target.value})}
                        placeholder="https://www.youtube.com/embed/..." 
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Language</label>
                      <select 
                        value={videoData.language}
                        onChange={(e) => setVideoData({...videoData, language: e.target.value})}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      >
                        <option value="en">English</option>
                        <option value="rw">Kinyarwanda</option>
                        <option value="fr">French</option>
                        <option value="sw">Kiswahili</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Update Title</label>
                      <input 
                        type="text" 
                        required
                        value={updateData.title}
                        onChange={(e) => setUpdateData({...updateData, title: e.target.value})}
                        placeholder="e.g. New Masterclass Cohort" 
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Full Content (Rich Text)</label>
                      <div style={{ background: 'white', borderRadius: '8px' }}>
                        <ReactQuill 
                          theme="snow"
                          value={updateData.content}
                          onChange={(content) => setUpdateData({...updateData, content})}
                          style={{ height: '400px', marginBottom: '50px' }}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                              ['link', 'image'],
                              ['clean']
                            ],
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Upload Resource (File/Image)</label>
                      <div style={{ 
                        border: '2px dashed #e2e8f0', padding: '1.5rem', borderRadius: '12px', 
                        textAlign: 'center', background: '#f8fafc', cursor: 'pointer' 
                      }}>
                        <input 
                          type="file" 
                          id="file-upload" 
                          hidden 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setUpdateData({...updateData, file_url: reader.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <Plus size={32} color="var(--text-muted)" />
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {updateData.file_url ? 'File Attached ✅' : 'Click to upload image or document'}
                          </span>
                        </label>
                      </div>
                    </div>
                    {updateData.file_url && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Preview: {updateData.file_url.substring(0, 50)}...
                      </div>
                    )}
                  </>
                )}
                <button 
                  type="submit"
                  style={{ 
                    background: 'var(--primary-blue)', color: 'white', border: 'none', 
                    padding: '1rem', borderRadius: '12px', fontWeight: '700', marginTop: '1rem',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 82, 204, 0.2)'
                  }}
                >
                  Save to Platform
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
