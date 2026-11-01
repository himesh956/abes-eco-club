import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { AnnouncementsSection } from './sections/Announcements';
import { About } from './sections/About';
import { Technology } from './sections/Technology';
import { Team } from './sections/Team';
import { Events } from './sections/Events';
import { Gallery } from './sections/Gallery';
import { EcoImpact } from './sections/EcoImpact';
import { SustainabilityTips } from './sections/SustainabilityTips';
import { Challenges } from './sections/Challenges';
import { JoinUs } from './sections/JoinUs';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';

import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { checkIsAuthorizedAdmin, getEvents, getTeamMembers, getEcoImpactRecord } from './services/admin.service';
import { EcoEvent, TeamMember, EcoImpactRecord } from './types';

type CurrentView = 'public' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('public');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Live Firestore data
  const [liveEvents, setLiveEvents] = useState<EcoEvent[]>([]);
  const [liveTeam, setLiveTeam] = useState<TeamMember[]>([]);
  const [liveImpact, setLiveImpact] = useState<EcoImpactRecord | undefined>(undefined);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin-login' || window.location.pathname === '/admin/login') {
        setCurrentView('admin-login');
      } else if (hash === '#admin-dashboard' || window.location.pathname === '/admin/dashboard') {
        setCurrentView('admin-dashboard');
      } else if (!hash.startsWith('#admin')) {
        setCurrentView('public');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const authorized = await checkIsAuthorizedAdmin(user);
        setIsAuthorized(authorized);
        if (authorized && currentView === 'admin-login') {
          setCurrentView('admin-dashboard');
          window.location.hash = '#admin-dashboard';
        }
      } else {
        setIsAuthorized(false);
        if (currentView === 'admin-dashboard') {
          setCurrentView('admin-login');
          window.location.hash = '#admin-login';
        }
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [currentView]);

  // Load public Firestore data
  useEffect(() => {
    async function loadPublicData() {
      try {
        const [evs, team, impact] = await Promise.all([
          getEvents(),
          getTeamMembers(),
          getEcoImpactRecord(),
        ]);
        if (evs && evs.length > 0) setLiveEvents(evs);
        if (team && team.length > 0) setLiveTeam(team);
        if (impact) setLiveImpact(impact);
      } catch (err) {
        console.warn('Using default fallback datasets for public display:', err);
      }
    }

    loadPublicData();
  }, []);

  // Section Observer for Public View
  useEffect(() => {
    if (currentView !== 'public') return;

    const sections = [
      'home',
      'intro-strip',
      'about',
      'announcements',
      'technology',
      'team',
      'events',
      'gallery',
      'impact',
      'tips',
      'challenges',
      'join-us',
      'contact',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const handleOpenAdmin = () => {
    if (currentUser && isAuthorized) {
      setCurrentView('admin-dashboard');
      window.location.hash = '#admin-dashboard';
    } else {
      setCurrentView('admin-login');
      window.location.hash = '#admin-login';
    }
  };

  const handleNavigateHome = () => {
    setCurrentView('public');
    window.location.hash = '#home';
  };

  // Render Admin Dashboard
  if (currentView === 'admin-dashboard') {
    if (!authChecked) {
      return (
        <div className="min-h-screen bg-[#F7F7EF] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#173F35] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#173F35]">Verifying Administrator Authorization...</p>
          </div>
        </div>
      );
    }

    if (!currentUser || !isAuthorized) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setCurrentView('admin-dashboard');
            window.location.hash = '#admin-dashboard';
          }}
          onNavigateHome={handleNavigateHome}
        />
      );
    }

    return (
      <AdminDashboard
        onNavigateHome={handleNavigateHome}
        onLogout={() => {
          setCurrentView('public');
          window.location.hash = '#home';
        }}
      />
    );
  }

  // Render Admin Login
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setCurrentView('admin-dashboard');
          window.location.hash = '#admin-dashboard';
        }}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  // Render Public Website
  return (
    <div className="min-h-screen bg-[#FCFCF8] text-[#202C25] font-sans antialiased selection:bg-[#C7E7A1] selection:text-[#173F35]">
      {/* Sticky Navigation with Admin Portal link */}
      <Navbar activeSection={activeSection} onOpenAdmin={handleOpenAdmin} />

      {/* Main Single-Page Sections */}
      <main>
        {/* 1. Hero Section + Operational Introduction Ribbon */}
        <Hero />

        {/* 2. Announcements Bulletin */}
        <AnnouncementsSection />

        {/* 3. About Us & Core Pillars */}
        <About />

        {/* 4. Technology for a Sustainable Tomorrow (Tech Team Feature) */}
        <Technology />

        {/* 5. Dedicated Committee Directory (Initials-based Avatars) */}
        <Team members={liveTeam.length > 0 ? liveTeam : undefined} />

        {/* 6. Events & Campus Cleanliness / Plantation Drives */}
        <Events events={liveEvents.length > 0 ? liveEvents : undefined} />

        {/* 7. Curated Photo Gallery & Lightbox */}
        <Gallery />

        {/* 8. Eco Impact Dashboard & Recharts */}
        <EcoImpact impactData={liveImpact} />

        {/* 9. Sustainability Tips ("Small Habits. Big Impact.") */}
        <SustainabilityTips />

        {/* 10. Eco Challenges & Gamified Habit Quests */}
        <Challenges />

        {/* 11. Join Us Membership Recruitment Form */}
        <JoinUs />

        {/* 12. Contact Hub & Campus Secretariat */}
        <Contact />
      </main>

      {/* Multi-column Footer with Admin Access Link */}
      <Footer onOpenAdmin={handleOpenAdmin} />
    </div>
  );
}
