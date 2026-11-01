import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  Bell,
  FileText,
  Mail,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  RefreshCw,
  Eye,
  Check,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { Modal } from '../components/Modal';
import {
  logoutUser,
  seedInitialFirestoreData,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getContactMessages,
  markContactMessageRead,
  deleteContactMessage,
  getEvents,
  saveEvent,
  deleteEvent,
  getEventRegistrations,
  getTeamMembers,
  saveTeamMember,
  deleteTeamMember,
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  getEcoImpactRecord,
  saveEcoImpactRecord,
  getAdminList,
  addAdminEmail,
  removeAdminEmail,
} from '../services/admin.service';
import {
  EcoEvent,
  EventRegistration,
  TeamMember,
  GalleryItem,
  Announcement,
  JoinApplication,
  ContactMessage,
  EcoImpactRecord,
  AdminUser,
  TeamCategory,
  EventCategory,
  EventStatus,
} from '../types';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onLogout: () => void;
}

type TabType =
  | 'overview'
  | 'events'
  | 'registrations'
  | 'team'
  | 'gallery'
  | 'announcements'
  | 'applications'
  | 'messages'
  | 'impact'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data states
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [events, setEvents] = useState<EcoEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [impactRecord, setImpactRecord] = useState<EcoImpactRecord>({
    treesPlanted: 1240,
    studentsEngaged: 3850,
    eventsOrganized: 48,
    plasticDivertedKg: 1850,
    isVerified: false,
    lastUpdated: new Date().toISOString(),
  });
  const [adminList, setAdminList] = useState<AdminUser[]>([]);

  // Modals and Active Edit Objects
  const [editingEvent, setEditingEvent] = useState<EcoEvent | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [viewingApplication, setViewingApplication] = useState<JoinApplication | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');

  // Filters & search
  const [appSearch, setAppSearch] = useState('');
  const [appTeamFilter, setAppTeamFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [apps, msgs, evs, regs, team, gall, anns, imp, admins] = await Promise.all([
        getApplications(),
        getContactMessages(),
        getEvents(),
        getEventRegistrations(),
        getTeamMembers(),
        getGalleryItems(),
        getAnnouncements(),
        getEcoImpactRecord(),
        getAdminList(),
      ]);

      setApplications(apps);
      setMessages(msgs);
      setEvents(evs);
      setRegistrations(regs);
      setTeamMembersList(team);
      setGalleryList(gall);
      setAnnouncementsList(anns);
      setImpactRecord(imp);
      setAdminList(admins);
    } catch (err) {
      console.error(err);
      showNotification('Failed to synchronize some collections from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSeedData = async () => {
    setLoading(true);
    const res = await seedInitialFirestoreData();
    if (res.success) {
      showNotification(res.message);
      await loadAllData();
    } else {
      showNotification(res.message, 'error');
    }
    setLoading(false);
  };

  // Nav Items
  const navTabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Student Applications', icon: FileText },
    { id: 'events', label: 'Events & Drives', icon: Calendar },
    { id: 'registrations', label: 'Event Registrations', icon: CheckCircle2 },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'gallery', label: 'Photo Gallery', icon: Image },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'messages', label: 'Contact Messages', icon: Mail },
    { id: 'impact', label: 'Eco Impact Telemetry', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Admin Access', icon: Settings },
  ];

  // Calculated Stats
  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;
  const unreadMessagesCount = messages.filter((m) => !m.read).length;
  const upcomingEventsCount = events.filter((e) => e.status === 'Upcoming').length;

  return (
    <div className="min-h-screen bg-[#F7F7EF] flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            notification.type === 'success'
              ? 'bg-[#173F35] text-[#C7E7A1] border-[#7DAA65]'
              : 'bg-red-800 text-white border-red-600'
          }`}
        >
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#173F35] text-white shrink-0 flex flex-col justify-between border-r border-[#244F3D]">
        <div>
          {/* Brand & Mobile Hamburger */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#244F3D] text-[#C7E7A1] flex items-center justify-center">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white block">
                  ECO CLUB
                </span>
                <span className="text-[10px] text-[#C7E7A1] uppercase tracking-widest block">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-white/10 text-stone-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`p-4 space-y-1 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              let badge: number | null = null;
              if (tab.id === 'applications' && pendingAppsCount > 0) badge = pendingAppsCount;
              if (tab.id === 'messages' && unreadMessagesCount > 0) badge = unreadMessagesCount;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C7E7A1] text-[#173F35] shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {badge !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#173F35] text-[#C7E7A1]' : 'bg-[#7DAA65] text-white'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className={`p-4 border-t border-white/10 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="mb-3 px-2 text-[11px] text-stone-300 truncate">
            <span className="block text-[10px] uppercase tracking-wider text-stone-400">Signed in as</span>
            <span className="font-semibold text-white truncate block">
              {auth.currentUser?.email || 'admin@campus.edu'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNavigateHome}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
            <button
              onClick={async () => {
                await logoutUser();
                onLogout();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Header bar with refresh & seed actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">
              {navTabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#737D73] mt-1">
              Active Eco Club Firestore Database Management & Telemetry
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-stone-200 text-[#173F35] hover:bg-stone-50 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <button
              onClick={handleSeedData}
              disabled={loading}
              title="Populates initial collections into Firestore if empty"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <span>Sync / Seed Firestore</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: OVERVIEW
        ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] font-semibold text-[#737D73] block">Total Applications</span>
                <span className="font-serif text-2xl font-bold text-[#173F35] mt-1 block">
                  {applications.length}
                </span>
                <span className="text-[10px] text-amber-700">{pendingAppsCount} Pending</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] font-semibold text-[#737D73] block">Active Events</span>
                <span className="font-serif text-2xl font-bold text-[#173F35] mt-1 block">
                  {events.length}
                </span>
                <span className="text-[10px] text-emerald-700">{upcomingEventsCount} Upcoming</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] font-semibold text-[#737D73] block">Registrations</span>
                <span className="font-serif text-2xl font-bold text-[#173F35] mt-1 block">
                  {registrations.length}
                </span>
                <span className="text-[10px] text-[#737D73]">Drive signups</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] font-semibold text-[#737D73] block">Team Roster</span>
                <span className="font-serif text-2xl font-bold text-[#173F35] mt-1 block">
                  {teamMembersList.length}
                </span>
                <span className="text-[10px] text-[#737D73]">Initials Profiles</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] font-semibold text-[#737D73] block">Contact Inquiries</span>
                <span className="font-serif text-2xl font-bold text-[#173F35] mt-1 block">
                  {messages.length}
                </span>
                <span className="text-[10px] text-amber-700">{unreadMessagesCount} Unread</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] font-semibold text-[#737D73] block">Gallery Photos</span>
                <span className="font-serif text-2xl font-bold text-[#173F35] mt-1 block">
                  {galleryList.length}
                </span>
                <span className="text-[10px] text-[#737D73]">Documented drives</span>
              </div>
            </div>

            {/* Quick Action Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications Panel */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-[#173F35]">
                    Recent Student Recruitment Submissions
                  </h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-semibold text-[#7DAA65] hover:text-[#173F35]"
                  >
                    View All &rarr;
                  </button>
                </div>

                {applications.length === 0 ? (
                  <p className="text-xs text-stone-400 py-6 text-center">No student applications recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 4).map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-xl bg-[#F7F7EF] border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-[#173F35] block">{app.fullName}</strong>
                          <span className="text-[#737D73]">{app.department} · {app.interestedTeam}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                              app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status}
                          </span>
                          <button
                            onClick={() => setViewingApplication(app)}
                            className="p-1 rounded text-stone-500 hover:text-[#173F35]"
                            title="Inspect application"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Messages & System Status */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-semibold text-[#173F35]">
                      Latest Campus Inquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs font-semibold text-[#7DAA65] hover:text-[#173F35]"
                    >
                      View All &rarr;
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">No contact inquiries yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.slice(0, 3).map((msg) => (
                        <div
                          key={msg.id}
                          className="p-3 rounded-xl bg-[#F7F7EF] border border-stone-200 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-[#173F35]">{msg.name} ({msg.email})</strong>
                            {!msg.read && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[#202C25] font-medium">{msg.subject}</p>
                          <p className="text-stone-500 truncate mt-0.5">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-[#737D73]">
                  <span>Database: Cloud Firestore (Active)</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: STUDENT APPLICATIONS
        ======================================================== */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            {/* Filters & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search student name or email..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
                />
              </div>

              <div>
                <select
                  value={appTeamFilter}
                  onChange={(e) => setAppTeamFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
                >
                  <option value="All">All Divisions</option>
                  <option value="Tech Team">Tech Team</option>
                  <option value="Environment Team">Environment Team</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Creative Team">Creative Team</option>
                </select>
              </div>

              <div>
                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
                >
                  <option value="All">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-[#737D73] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Applicant</th>
                    <th className="py-3 px-3">Academic Info</th>
                    <th className="py-3 px-3">Desired Team</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Submitted</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {applications
                    .filter((a) => {
                      const matchSearch =
                        a.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
                        a.collegeEmail.toLowerCase().includes(appSearch.toLowerCase());
                      const matchTeam = appTeamFilter === 'All' || a.interestedTeam === appTeamFilter;
                      const matchStatus = appStatusFilter === 'All' || a.status === appStatusFilter;
                      return matchSearch && matchTeam && matchStatus;
                    })
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#173F35]">
                          <div>{app.fullName}</div>
                          <span className="text-[11px] font-normal text-stone-500">{app.collegeEmail}</span>
                        </td>
                        <td className="py-3 px-3 text-[#202C25]">
                          <div>{app.department}</div>
                          <span className="text-[11px] text-stone-500">{app.academicYear}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-[#F7F7EF] font-medium text-[#173F35] border border-stone-200">
                            {app.interestedTeam}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-500 text-[11px]">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => setViewingApplication(app)}
                            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200"
                            title="Inspect details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              await updateApplicationStatus(app.id, 'approved');
                              showNotification(`Approved ${app.fullName}`);
                              await loadAllData();
                            }}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100"
                            title="Approve student"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              await updateApplicationStatus(app.id, 'rejected');
                              showNotification(`Rejected ${app.fullName}`);
                              await loadAllData();
                            }}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100"
                            title="Reject student"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete application from ${app.fullName}?`)) {
                                await deleteApplication(app.id);
                                showNotification('Application deleted');
                                await loadAllData();
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-100"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: EVENTS CRUD
        ======================================================== */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#737D73] font-medium">Manage eco drives, workshops, and campaigns.</span>
              <button
                onClick={() => setIsAddingEvent(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#7DAA65]">{event.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 font-bold">{event.status}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#173F35] leading-snug">{event.title}</h3>
                    <p className="text-xs text-[#737D73] mt-1">{event.date} · {event.time}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{event.location}</p>
                    <p className="text-xs text-[#202C25] mt-3 line-clamp-3 leading-relaxed">{event.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">
                      {event.registrationOpen ? 'Open for RSVP' : 'RSVP Closed'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="p-1.5 rounded-lg text-[#173F35] hover:bg-stone-100"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete event "${event.title}"?`)) {
                            await deleteEvent(event.id);
                            showNotification('Event removed');
                            await loadAllData();
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-100"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: EVENT REGISTRATIONS
        ======================================================== */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#173F35]">
              Attendee Signups for Eco Drives & Workshops
            </h3>
            {registrations.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No attendee registrations recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-[#737D73] uppercase font-semibold">
                      <th className="py-2.5 px-3">Event Title</th>
                      <th className="py-2.5 px-3">Participant Name</th>
                      <th className="py-2.5 px-3">College Email</th>
                      <th className="py-2.5 px-3">Student ID</th>
                      <th className="py-2.5 px-3">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-semibold text-[#173F35]">{reg.eventTitle || reg.eventId}</td>
                        <td className="py-2.5 px-3 text-[#202C25]">{reg.name}</td>
                        <td className="py-2.5 px-3 text-stone-500">{reg.email}</td>
                        <td className="py-2.5 px-3 text-stone-500">{reg.studentId || '—'}</td>
                        <td className="py-2.5 px-3 text-stone-500">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: TEAM MEMBERS CRUD
        ======================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#737D73]">Manage official advisors and student team coordinators.</span>
              <button
                onClick={() => setIsAddingMember(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembersList.map((member) => (
                <div key={member.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#173F35] text-[#C7E7A1] font-serif font-bold text-base flex items-center justify-center">
                        {member.initials || member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#F7F7EF] font-bold text-[#173F35]">
                        {member.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-[#173F35]">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#7DAA65]">{member.role}</p>
                    <p className="text-xs text-[#737D73]">{member.department}</p>
                    <p className="text-xs text-[#202C25] mt-2.5 line-clamp-3 leading-relaxed">{member.bio}</p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">
                      {member.isDemo ? 'Demo Profile' : 'Verified'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingTeamMember(member)}
                        className="p-1.5 rounded-lg text-[#173F35] hover:bg-stone-100"
                        title="Edit profile"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Remove ${member.name} from team directory?`)) {
                            await deleteTeamMember(member.id);
                            showNotification('Member removed');
                            await loadAllData();
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-100"
                        title="Delete profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: GALLERY CRUD
        ======================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#737D73]">Manage curated photographs documenting fieldwork and drives.</span>
              <button
                onClick={() => setIsAddingGallery(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Gallery Photograph</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryList.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-[#7DAA65] uppercase">{item.category}</span>
                    <h4 className="font-serif text-sm font-semibold text-[#173F35] mt-0.5 truncate">{item.title}</h4>
                    <p className="text-[11px] text-[#737D73] line-clamp-2 mt-1">{item.caption}</p>
                  </div>

                  <div className="pt-2 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-stone-400">{item.location}</span>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete photograph "${item.title}"?`)) {
                          await deleteGalleryItem(item.id);
                          showNotification('Photograph deleted');
                          await loadAllData();
                        }
                      }}
                      className="p-1 rounded text-red-600 hover:bg-red-50"
                      title="Delete photograph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: ANNOUNCEMENTS CRUD
        ======================================================== */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#737D73]">Publish campus bulletins, recruitment notices, and field updates.</span>
              <button
                onClick={() => setIsAddingAnnouncement(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            </div>

            <div className="space-y-4">
              {announcementsList.map((ann) => (
                <div key={ann.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {ann.priority} Priority
                      </span>
                      <span className="text-xs text-[#737D73]">{ann.date}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#173F35]">{ann.title}</h3>
                    <p className="text-xs text-[#202C25] mt-1 leading-relaxed">{ann.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingAnnouncement(ann)}
                      className="p-2 rounded-lg text-[#173F35] hover:bg-stone-100"
                      title="Edit bulletin"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete announcement "${ann.title}"?`)) {
                          await deleteAnnouncement(ann.id);
                          showNotification('Announcement deleted');
                          await loadAllData();
                        }
                      }}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-100"
                      title="Delete bulletin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: CONTACT MESSAGES
        ======================================================== */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#173F35]">
              Public Inquiries & Secretariat Dispatches
            </h3>

            {messages.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No messages received yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border transition-all ${
                      msg.read ? 'bg-[#FCFCF8] border-stone-200' : 'bg-emerald-50/50 border-emerald-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-semibold text-[#173F35]">{msg.name}</strong>
                        <span className="text-xs text-stone-500">({msg.email})</span>
                        {!msg.read && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Unread
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">{msg.submittedAt}</span>
                    </div>

                    <p className="text-xs font-semibold text-[#202C25] mb-1">Subject: {msg.subject}</p>
                    <p className="text-xs text-[#737D73] leading-relaxed mb-3 whitespace-pre-wrap">{msg.message}</p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                      {!msg.read ? (
                        <button
                          onClick={async () => {
                            await markContactMessageRead(msg.id, true);
                            showNotification('Marked as read');
                            await loadAllData();
                          }}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await markContactMessageRead(msg.id, false);
                            showNotification('Marked as unread');
                            await loadAllData();
                          }}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300"
                        >
                          Mark Unread
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (confirm('Delete this message?')) {
                            await deleteContactMessage(msg.id);
                            showNotification('Message deleted');
                            await loadAllData();
                          }
                        }}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 9: ECO IMPACT TELEMETRY DATA
        ======================================================== */}
        {activeTab === 'impact' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#173F35]">
                Update Campus Eco Impact Statistics
              </h3>
              <p className="text-xs text-[#737D73] mt-1">
                Values configured here are stored directly in Firestore and reflected live across the public Eco Impact Dashboard.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveEcoImpactRecord(impactRecord);
                showNotification('Impact records updated in Firestore!');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#173F35] mb-1">Trees Planted</label>
                <input
                  type="number"
                  value={impactRecord.treesPlanted}
                  onChange={(e) => setImpactRecord({ ...impactRecord, treesPlanted: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173F35] mb-1">Students Engaged</label>
                <input
                  type="number"
                  value={impactRecord.studentsEngaged}
                  onChange={(e) => setImpactRecord({ ...impactRecord, studentsEngaged: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173F35] mb-1">Eco Initiatives / Events</label>
                <input
                  type="number"
                  value={impactRecord.eventsOrganized}
                  onChange={(e) => setImpactRecord({ ...impactRecord, eventsOrganized: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173F35] mb-1">Plastic Diverted (kg)</label>
                <input
                  type="number"
                  value={impactRecord.plasticDivertedKg}
                  onChange={(e) => setImpactRecord({ ...impactRecord, plasticDivertedKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verifiedCheck"
                  checked={impactRecord.isVerified}
                  onChange={(e) => setImpactRecord({ ...impactRecord, isVerified: e.target.checked })}
                  className="rounded text-[#173F35] focus:ring-[#7DAA65]"
                />
                <label htmlFor="verifiedCheck" className="text-xs font-semibold text-[#173F35]">
                  Mark metrics as officially verified by Campus Sustainability Office (removes DEMO label)
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] cursor-pointer"
                >
                  Save Metrics to Database
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 10: SETTINGS & ADMIN ACCESS
        ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#173F35]">
                Authorized Administrator Accounts
              </h3>
              <p className="text-xs text-[#737D73] mt-1">
                Only users signed in with Google accounts listed below are allowed to access this dashboard and modify data.
              </p>
            </div>

            {/* Add Admin Email */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@campus.edu"
                value={newAdminEmailInput}
                onChange={(e) => setNewAdminEmailInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7DAA65]"
              />
              <button
                onClick={async () => {
                  if (!newAdminEmailInput.trim() || !newAdminEmailInput.includes('@')) {
                    alert('Please provide a valid email');
                    return;
                  }
                  await addAdminEmail(newAdminEmailInput.trim());
                  showNotification(`Added ${newAdminEmailInput} to admin allowlist`);
                  setNewAdminEmailInput('');
                  await loadAllData();
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D]"
              >
                Grant Admin Access
              </button>
            </div>

            {/* Admin Allowlist */}
            <div className="space-y-2 pt-2">
              {adminList.map((adm) => (
                <div
                  key={adm.uid}
                  className="p-3 rounded-xl bg-[#F7F7EF] border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-[#173F35] block">{adm.email}</strong>
                    <span className="text-stone-500 text-[11px] capitalize">{adm.role} · Added: {adm.addedAt}</span>
                  </div>

                  {adm.role !== 'superadmin' && (
                    <button
                      onClick={async () => {
                        if (confirm(`Revoke admin access for ${adm.email}?`)) {
                          await removeAdminEmail(adm.email);
                          showNotification('Admin access revoked');
                          await loadAllData();
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Revoke access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODALS
      ======================================================== */}

      {/* View Application Modal */}
      <Modal
        isOpen={!!viewingApplication}
        onClose={() => setViewingApplication(null)}
        title={`Application: ${viewingApplication?.fullName}`}
      >
        {viewingApplication && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F7F7EF]">
              <div>
                <span className="text-[#737D73] block">Email:</span>
                <strong className="text-[#173F35]">{viewingApplication.collegeEmail}</strong>
              </div>
              <div>
                <span className="text-[#737D73] block">Student ID:</span>
                <strong className="text-[#173F35]">{viewingApplication.studentId || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-[#737D73] block">Department & Year:</span>
                <strong className="text-[#173F35]">{viewingApplication.department} ({viewingApplication.academicYear})</strong>
              </div>
              <div>
                <span className="text-[#737D73] block">Interested Team:</span>
                <strong className="text-[#7DAA65]">{viewingApplication.interestedTeam}</strong>
              </div>
            </div>

            <div>
              <span className="text-[#737D73] font-semibold block mb-1">Reason to Join:</span>
              <p className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[#202C25] leading-relaxed">
                {viewingApplication.reasonToJoin}
              </p>
            </div>

            <div>
              <span className="text-[#737D73] font-semibold block mb-1">Skills & Eco Experience:</span>
              <p className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[#202C25] leading-relaxed">
                {viewingApplication.skills}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stone-200">
              <span className="text-[11px] text-stone-400">Current Status: {viewingApplication.status}</span>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await updateApplicationStatus(viewingApplication.id, 'approved');
                    showNotification('Application approved');
                    setViewingApplication(null);
                    await loadAllData();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold"
                >
                  Approve
                </button>
                <button
                  onClick={async () => {
                    await updateApplicationStatus(viewingApplication.id, 'rejected');
                    showNotification('Application rejected');
                    setViewingApplication(null);
                    await loadAllData();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-700 text-white font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Event Modal */}
      {(isAddingEvent || editingEvent) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddingEvent(false);
            setEditingEvent(null);
          }}
          title={editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New Event'}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const eventPayload: EcoEvent = {
                id: editingEvent ? editingEvent.id : `event-${Date.now()}`,
                title: formData.get('title') as string,
                date: formData.get('date') as string,
                time: formData.get('time') as string,
                location: formData.get('location') as string,
                category: formData.get('category') as EventCategory,
                status: formData.get('status') as EventStatus,
                description: formData.get('description') as string,
                fullDetails: formData.get('fullDetails') as string,
                imageUrl: formData.get('imageUrl') as string || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
                registrationOpen: formData.get('registrationOpen') === 'on',
                maxAttendees: Number(formData.get('maxAttendees') || 100),
                registeredCount: editingEvent ? editingEvent.registeredCount : 0,
              };

              await saveEvent(eventPayload);
              showNotification(editingEvent ? 'Event updated' : 'Event created');
              setIsAddingEvent(false);
              setEditingEvent(null);
              await loadAllData();
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="block font-semibold mb-1">Event Title *</label>
              <input
                name="title"
                defaultValue={editingEvent?.title || ''}
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Date *</label>
                <input
                  name="date"
                  defaultValue={editingEvent?.date || ''}
                  required
                  placeholder="e.g. November 22, 2026"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Time *</label>
                <input
                  name="time"
                  defaultValue={editingEvent?.time || ''}
                  required
                  placeholder="e.g. 09:00 AM – 01:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select name="category" defaultValue={editingEvent?.category || 'Plantation'} className="w-full px-2 py-2 rounded-xl border border-stone-200">
                  <option value="Plantation">Plantation</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Awareness">Awareness</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Innovation">Innovation</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select name="status" defaultValue={editingEvent?.status || 'Upcoming'} className="w-full px-2 py-2 rounded-xl border border-stone-200">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Past">Past</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Capacity</label>
                <input
                  type="number"
                  name="maxAttendees"
                  defaultValue={editingEvent?.maxAttendees || 100}
                  className="w-full px-2 py-2 rounded-xl border border-stone-200"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Location / Venue *</label>
              <input
                name="location"
                defaultValue={editingEvent?.location || ''}
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Short Description</label>
              <textarea
                name="description"
                rows={2}
                defaultValue={editingEvent?.description || ''}
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Full Program Details</label>
              <textarea
                name="fullDetails"
                rows={3}
                defaultValue={editingEvent?.fullDetails || ''}
                className="w-full px-3 py-2 rounded-xl border border-stone-200"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Cover Image URL</label>
              <input
                name="imageUrl"
                defaultValue={editingEvent?.imageUrl || ''}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="registrationOpen"
                defaultChecked={editingEvent ? editingEvent.registrationOpen : true}
                id="regOpen"
              />
              <label htmlFor="regOpen" className="font-semibold">Open for Attendee Registration</label>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsAddingEvent(false);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#173F35] text-white font-semibold">
                Save Event
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add / Edit Team Member Modal */}
      {(isAddingMember || editingTeamMember) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddingMember(false);
            setEditingTeamMember(null);
          }}
          title={editingTeamMember ? `Edit Member: ${editingTeamMember.name}` : 'Add New Team Member'}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name') as string;
              const memberPayload: TeamMember = {
                id: editingTeamMember ? editingTeamMember.id : `member-${Date.now()}`,
                name,
                role: formData.get('role') as string,
                department: formData.get('department') as string,
                category: formData.get('category') as TeamCategory,
                initials: (formData.get('initials') as string) || name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase(),
                bio: formData.get('bio') as string,
                linkedin: formData.get('linkedin') as string,
                github: formData.get('github') as string,
                email: formData.get('email') as string,
                isDemo: false,
              };

              await saveTeamMember(memberPayload);
              showNotification(editingTeamMember ? 'Profile updated' : 'Member added');
              setIsAddingMember(false);
              setEditingTeamMember(null);
              await loadAllData();
            }}
            className="space-y-3 text-xs"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-semibold mb-1">Full Name *</label>
                <input name="name" defaultValue={editingTeamMember?.name || ''} required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Initials (Badge)</label>
                <input name="initials" defaultValue={editingTeamMember?.initials || ''} placeholder="e.g. JS" className="w-full px-3 py-2 rounded-xl border border-stone-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Role / Designation *</label>
                <input name="role" defaultValue={editingTeamMember?.role || ''} required placeholder="e.g. Lead Coordinator" className="w-full px-3 py-2 rounded-xl border border-stone-200" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Division *</label>
                <select name="category" defaultValue={editingTeamMember?.category || 'Environment Team'} className="w-full px-2 py-2 rounded-xl border border-stone-200">
                  <option value="Faculty Heads">Faculty Heads</option>
                  <option value="Core Members">Core Members</option>
                  <option value="Tech Team">Tech Team</option>
                  <option value="Environment Team">Environment Team</option>
                  <option value="Event Management Team">Event Management Team</option>
                  <option value="Social Media Team">Social Media Team</option>
                  <option value="Creative Team">Creative Team</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Department & Academic Year *</label>
              <input name="department" defaultValue={editingTeamMember?.department || ''} required placeholder="e.g. Computer Science, 3rd Year" className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Bio / Responsibilities</label>
              <textarea name="bio" rows={3} defaultValue={editingTeamMember?.bio || ''} required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input name="email" defaultValue={editingTeamMember?.email || ''} placeholder="name@campus.edu" className="w-full px-2 py-2 rounded-xl border border-stone-200" />
              </div>
              <div>
                <label className="block font-semibold mb-1">LinkedIn URL</label>
                <input name="linkedin" defaultValue={editingTeamMember?.linkedin || ''} placeholder="https://linkedin..." className="w-full px-2 py-2 rounded-xl border border-stone-200" />
              </div>
              <div>
                <label className="block font-semibold mb-1">GitHub URL</label>
                <input name="github" defaultValue={editingTeamMember?.github || ''} placeholder="https://github..." className="w-full px-2 py-2 rounded-xl border border-stone-200" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsAddingMember(false);
                  setEditingTeamMember(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-200"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#173F35] text-white font-semibold">
                Save Member
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Gallery Item Modal */}
      {isAddingGallery && (
        <Modal isOpen={true} onClose={() => setIsAddingGallery(false)} title="Add Photograph to Gallery">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const itemPayload: GalleryItem = {
                id: `gal-${Date.now()}`,
                title: formData.get('title') as string,
                category: formData.get('category') as any,
                date: formData.get('date') as string,
                location: formData.get('location') as string,
                imageUrl: formData.get('imageUrl') as string,
                caption: formData.get('caption') as string,
                isDemo: false,
              };

              await saveGalleryItem(itemPayload);
              showNotification('Photograph added to gallery');
              setIsAddingGallery(false);
              await loadAllData();
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="block font-semibold mb-1">Title *</label>
              <input name="title" required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select name="category" className="w-full px-2 py-2 rounded-xl border border-stone-200">
                  <option value="Plantation">Plantation</option>
                  <option value="Cleanliness Drives">Cleanliness Drives</option>
                  <option value="Awareness Campaigns">Awareness Campaigns</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Campus Activities">Campus Activities</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Date</label>
                <input name="date" placeholder="e.g. November 2026" required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input name="location" placeholder="e.g. North Arboretum" required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Image URL *</label>
              <input name="imageUrl" required placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Caption</label>
              <textarea name="caption" rows={2} required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setIsAddingGallery(false)} className="px-4 py-2 rounded-xl bg-stone-200">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#173F35] text-white font-semibold">Save Photograph</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add / Edit Announcement Modal */}
      {(isAddingAnnouncement || editingAnnouncement) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddingAnnouncement(false);
            setEditingAnnouncement(null);
          }}
          title={editingAnnouncement ? 'Edit Bulletin' : 'Post New Announcement'}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const annPayload: Announcement = {
                id: editingAnnouncement ? editingAnnouncement.id : `ann-${Date.now()}`,
                title: formData.get('title') as string,
                date: formData.get('date') as string,
                priority: formData.get('priority') as any,
                summary: formData.get('summary') as string,
                details: formData.get('details') as string,
                ctaText: formData.get('ctaText') as string,
                ctaLink: formData.get('ctaLink') as string,
                isDemo: false,
              };

              await saveAnnouncement(annPayload);
              showNotification(editingAnnouncement ? 'Announcement updated' : 'Announcement posted');
              setIsAddingAnnouncement(false);
              setEditingAnnouncement(null);
              await loadAllData();
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="block font-semibold mb-1">Title *</label>
              <input name="title" defaultValue={editingAnnouncement?.title || ''} required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Priority</label>
                <select name="priority" defaultValue={editingAnnouncement?.priority || 'Normal'} className="w-full px-2 py-2 rounded-xl border border-stone-200">
                  <option value="High">High (Important Notice)</option>
                  <option value="Opportunity">Opportunity (Volunteer Call)</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Publication Date</label>
                <input name="date" defaultValue={editingAnnouncement?.date || ''} required placeholder="e.g. November 2026" className="w-full px-3 py-2 rounded-xl border border-stone-200" />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Summary (Short Deck)</label>
              <textarea name="summary" rows={2} defaultValue={editingAnnouncement?.summary || ''} required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Full Bulletin Details</label>
              <textarea name="details" rows={3} defaultValue={editingAnnouncement?.details || ''} required className="w-full px-3 py-2 rounded-xl border border-stone-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">CTA Button Text (Optional)</label>
                <input name="ctaText" defaultValue={editingAnnouncement?.ctaText || ''} placeholder="e.g. Apply Now" className="w-full px-3 py-2 rounded-xl border border-stone-200" />
              </div>
              <div>
                <label className="block font-semibold mb-1">CTA Link (Optional)</label>
                <input name="ctaLink" defaultValue={editingAnnouncement?.ctaLink || ''} placeholder="#join-us" className="w-full px-3 py-2 rounded-xl border border-stone-200" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsAddingAnnouncement(false);
                  setEditingAnnouncement(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-200"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#173F35] text-white font-semibold">
                Post Bulletin
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
