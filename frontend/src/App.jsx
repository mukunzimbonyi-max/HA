import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LanguageSelection from './pages/LanguageSelection';
import Home from './pages/Home';
import PharmacyLocator from './pages/PharmacyLocator';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import MentalHealthDashboard from './pages/MentalHealthDashboard';
import Psychologists from './pages/Psychologists';
import Auth from './pages/Auth';
import Cohorts from './pages/Cohorts';
import Protection from './pages/Protection';
import { LanguageProvider } from './context/LanguageContext';
import SkipLink from './components/SkipLink';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <LanguageProvider>
      <SkipLink />
      <Router>
        <Routes>
        <Route path="/" element={<LanguageSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pharmacies" element={<PharmacyLocator />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/mental-health-dashboard" element={<MentalHealthDashboard />} />
        <Route path="/help" element={<Psychologists />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cohorts" element={<Cohorts />} />
        <Route path="/protection" element={<Protection />} />
        {/* Redirect any unknown routes to language selection */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </LanguageProvider>
  );
}

export default App;
