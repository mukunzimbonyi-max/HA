import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    brandName: "My Health My Friend",
    selectLanguage: "Select Language",
    welcome: "Welcome to My Health My Friend",
    subtitle: "Safe, private, and stigma-free SRH services for you.",
    findPharmacy: "Health Facilities",
    protection: "SRH & Mental Health",
    getHelp: "Ask a Psychologist",
    askAi: "Ask AI Friend",
    featuredVideos: "Educational Library",
    latestUpdates: "Upcoming Masterclasses",
    continue: "Continue",
    typeQuestion: "Ask anything privately...",
    pharmacyTitle: "GPS Health Directory",
    adminTitle: "Management Console"
  },
  rw: {
    brandName: "My Health My Friend",
    selectLanguage: "Hitamo Ururimi",
    welcome: "Murakaza neza kuri My Health My Friend",
    subtitle: "Serivisi z'ubuzima bw'imyororokere zizewe kandi zihishe.",
    findPharmacy: "Ivuriro & Farumasi",
    protection: "Imyororokere & Ubuzima bwo mu mutwe",
    getHelp: "Baza Inzobere mu mutwe",
    askAi: "Baza AI",
    featuredVideos: "Amavidewo Yigisha",
    latestUpdates: "Amasomo y'Inzobere",
    continue: "Komeza",
    typeQuestion: "Baza ikibazo icyo ari cyo cyose mu ibanga...",
    pharmacyTitle: "Indangamatsiko y'ubuzima",
    adminTitle: "Igenzurwa"
  },
  fr: {
    brandName: "My Health My Friend",
    selectLanguage: "Choisir la langue",
    welcome: "Bienvenue sur My Health My Friend",
    subtitle: "Services de santé reproductive sûrs et privés.",
    findPharmacy: "Centres de Santé",
    protection: "Santé & Mental",
    getHelp: "Demander à un Psychologue",
    askAi: "Demander à l'IA",
    featuredVideos: "Bibliothèque Vidéo",
    latestUpdates: "Masterclasses à venir",
    continue: "Continuer",
    typeQuestion: "Posez votre question en toute confidentialité...",
    pharmacyTitle: "Répertoire de santé GPS",
    adminTitle: "Tableau de bord"
  },
  sw: {
    brandName: "My Health My Friend",
    selectLanguage: "Chagua Lugha",
    welcome: "Karibu My Health My Friend",
    subtitle: "Huduma za afya ya uzazi salama na za siri.",
    findPharmacy: "Vituo vya Afya",
    protection: "Afya ya Uzazi na Akili",
    getHelp: "Uliza Mwanasaikolojia",
    askAi: "Uliza AI",
    featuredVideos: "Maktaba ya Video",
    latestUpdates: "Masomo ya Kitaalam",
    continue: "Endelea",
    typeQuestion: "Uliza chochote kwa siri...",
    pharmacyTitle: "Saraka ya Afya ya GPS",
    adminTitle: "Dashibodi ya Admin"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('userLanguage') || 'en');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('userLanguage', lang);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = translations[language] || translations.en;

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = {
      'rw': 'sw-TZ',
      'sw': 'sw-TZ',
      'fr': 'fr-FR',
      'en': 'en-US'
    };
    utterance.lang = langMap[language] || 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, speak, theme, toggleTheme }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
