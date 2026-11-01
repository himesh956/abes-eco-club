export type TeamCategory =
  | 'All'
  | 'Faculty Heads'
  | 'Core Members'
  | 'Tech Team'
  | 'Environment Team'
  | 'Event Management Team'
  | 'Social Media Team'
  | 'Creative Team';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  category: TeamCategory;
  bio: string;
  initials?: string;
  avatarUrl?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  isDemo?: boolean;
}

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Past';
export type EventCategory =
  | 'Plantation'
  | 'Cleanliness'
  | 'Awareness'
  | 'Workshop'
  | 'Innovation';

export interface EcoEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  status: EventStatus;
  description: string;
  fullDetails: string;
  imageUrl?: string;
  registrationOpen: boolean;
  maxAttendees?: number;
  registeredCount?: number;
  requirements?: string[];
  isDemo?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  studentId?: string;
  notes?: string;
  registeredAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Plantation' | 'Cleanliness Drives' | 'Awareness Campaigns' | 'Workshops' | 'Campus Activities';
  date: string;
  imageUrl: string;
  caption: string;
  location: string;
  isDemo?: boolean;
}

export interface ImpactStatistic {
  id: string;
  label: string;
  value: number;
  suffix: string;
  subtext: string;
  iconName: string;
}

export interface SustainabilityTip {
  id: string;
  title: string;
  category: 'Energy' | 'Waste' | 'Water' | 'Transportation' | 'Daily Lifestyle';
  summary: string;
  actionableStep: string;
  impactMetric: string;
  iconName: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  points: number;
  badge: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  priority: 'High' | 'Normal' | 'Opportunity';
  summary: string;
  details: string;
  ctaText?: string;
  ctaLink?: string;
  isDemo?: boolean;
}

export interface JoinApplication {
  id: string;
  fullName: string;
  collegeEmail: string;
  studentId?: string;
  department: string;
  academicYear: string;
  interestedTeam: string;
  reasonToJoin: string;
  skills: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  submittedAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'superadmin' | 'editor' | 'coordinator';
  addedAt: string;
}

export interface EcoImpactRecord {
  treesPlanted: number;
  studentsEngaged: number;
  eventsOrganized: number;
  plasticDivertedKg: number;
  isVerified: boolean;
  lastUpdated: string;
}
