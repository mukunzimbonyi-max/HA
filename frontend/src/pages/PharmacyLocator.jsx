import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Phone, Clock, Search, Navigation, Volume2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '20px'
};

const PharmacyLocator = () => {
  const navigate = useNavigate();
  const { t, speak } = useLanguage();
  const [userLocation, setUserLocation] = useState({ lat: -1.9441, lng: 30.0619 }); // Default: Kigali
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const fetchNearbyFacilities = async (lat, lng, type = '') => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const typeParam = type && type !== 'all' ? `&type=${type}` : '';
      const response = await fetch(`${apiUrl}/facilities/nearby?lat=${lat}&lng=${lng}&radius=10${typeParam}`);
      const data = await response.json();
      setFacilities(data);
    } catch (err) {
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(pos);
          fetchNearbyFacilities(pos.lat, pos.lng, filter);
        },
        () => fetchNearbyFacilities(userLocation.lat, userLocation.lng, filter)
      );
    }
  }, [filter]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      <div className="container" style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'var(--white)', border: '1px solid #e2e8f0', 
            cursor: 'pointer', color: 'var(--text-dark)', fontWeight: '700',
            marginBottom: '2rem', padding: '0.8rem 1.2rem', borderRadius: '12px',
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

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Find Pharmacies & Hospitals</h1>
          <p style={{ color: 'var(--text-muted)' }}>Get instant access to medical assistance near you.</p>
        </div>
        <button
          onClick={() => speak("Find Pharmacies and Hospitals page. Use the filters to choose between all facilities, pharmacies, or hospitals. We have found " + facilities.length + " medical centers near you.")}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--primary-blue)',
            color: 'var(--primary-blue)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
          aria-label="Read page summary aloud"
        >
          <Volume2 size={18} /> Read Page
        </button>
      </motion.div>

      {/* Type Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['all', 'pharmacy', 'hospital'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '50px',
              background: filter === type ? 'var(--primary-blue)' : 'var(--white)',
              color: filter === type ? 'white' : 'var(--text-dark)',
              boxShadow: 'var(--shadow)',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}
          >
            {type}s
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', minHeight: '600px' }}>
        {/* Map Section */}
        <div style={{ background: 'var(--white)', borderRadius: '24px', padding: '1rem', boxShadow: 'var(--shadow)' }}>
          {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'your_google_maps_key_here' ? (
            <div style={{ height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
              <MapPin size={48} color="var(--primary-blue)" style={{ marginBottom: '1rem' }} />
              <h3>Google Maps Key Missing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>
                Please add your Google Maps API key to the <code>frontend/.env</code> file to see the interactive map.
              </p>
            </div>
          ) : isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation}
              zoom={13}
            >
              {/* User Marker */}
              <Marker 
                position={userLocation} 
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
              />
              
              {/* Facility Markers */}
              {facilities.map((facility) => (
                <Marker
                  key={facility.id}
                  position={{ lat: parseFloat(facility.latitude), lng: parseFloat(facility.longitude) }}
                  onClick={() => setSelectedFacility(facility)}
                  icon={facility.type === 'hospital' ? "http://maps.google.com/mapfiles/ms/icons/hospitals.png" : undefined}
                />
              ))}

              {selectedFacility && (
                <InfoWindow
                  position={{ lat: parseFloat(selectedFacility.latitude), lng: parseFloat(selectedFacility.longitude) }}
                  onCloseClick={() => setSelectedFacility(null)}
                >
                  <div style={{ padding: '5px' }}>
                    <h4 style={{ color: 'var(--primary-blue)' }}>{selectedFacility.name}</h4>
                    <p style={{ fontSize: '0.8rem', margin: '5px 0' }}>{selectedFacility.address}</p>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: '#eee', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      textTransform: 'capitalize'
                    }}>{selectedFacility.type}</span>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Loading Map...
            </div>
          )}
        </div>

        {/* List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            background: 'var(--white)', 
            padding: '1rem', 
            borderRadius: '16px', 
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              style={{ border: 'none', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '530px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {facilities.length > 0 ? facilities.map((facility) => (
              <motion.div
                key={facility.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedFacility(facility)}
                style={{
                  background: 'var(--white)',
                  padding: '1.2rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow)',
                  cursor: 'pointer',
                  border: selectedFacility?.id === facility.id ? '2px solid var(--primary-blue)' : '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{facility.name}</h3>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    background: facility.type === 'hospital' ? '#fff0f0' : '#f0fff0', 
                    color: facility.type === 'hospital' ? '#ff5630' : '#36b37e',
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>{facility.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <MapPin size={14} /> {facility.address}
                </div>
                {facility.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <Phone size={14} /> {facility.phone}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-green)', fontSize: '0.85rem', fontWeight: '600' }}>
                  <Clock size={14} /> {facility.opening_hours || 'Open 24/7'}
                </div>
              </motion.div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                {loading ? 'Finding nearby facilities...' : 'No facilities found in your area.'}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyLocator;
