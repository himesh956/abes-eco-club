import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
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
} from '../types';

import { teamMembers as initialTeam } from '../data/team';
import { ecoEvents as initialEvents } from '../data/events';
import { galleryItems as initialGallery } from '../data/gallery';
import { announcements as initialAnnouncements } from '../data/announcements';
import { impactStats } from '../data/impact';

const BOOTSTRAP_ADMIN_EMAIL = 'himeshrajput956@gmail.com';

// ==========================================
// AUTHENTICATION & AUTHORIZATION
// ==========================================

export async function loginWithGoogle(): Promise<User> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function checkIsAuthorizedAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;

  const emailLower = user.email.toLowerCase();

  // Root bootstrap superadmin
  if (emailLower === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  try {
    // Check by UID
    const adminDocRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminDocRef);
    if (adminSnap.exists()) return true;

    // Check by Email
    const emailDocRef = doc(db, 'admins', emailLower);
    const emailSnap = await getDoc(emailDocRef);
    if (emailSnap.exists()) return true;

    return false;
  } catch {
    // Fallback: only bootstrap email
    return emailLower === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
  }
}

// ==========================================
// SEEDING UTILITY
// ==========================================

export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  try {
    // Seed Events
    const eventsSnap = await getDocs(collection(db, 'events'));
    if (eventsSnap.empty) {
      for (const ev of initialEvents) {
        await setDoc(doc(db, 'events', ev.id), ev);
      }
    }

    // Seed Team
    const teamSnap = await getDocs(collection(db, 'teamMembers'));
    if (teamSnap.empty) {
      for (const tm of initialTeam) {
        await setDoc(doc(db, 'teamMembers', tm.id), tm);
      }
    }

    // Seed Gallery
    const gallerySnap = await getDocs(collection(db, 'gallery'));
    if (gallerySnap.empty) {
      for (const gi of initialGallery) {
        await setDoc(doc(db, 'gallery', gi.id), gi);
      }
    }

    // Seed Announcements
    const annSnap = await getDocs(collection(db, 'announcements'));
    if (annSnap.empty) {
      for (const an of initialAnnouncements) {
        await setDoc(doc(db, 'announcements', an.id), an);
      }
    }

    // Seed EcoImpact
    const impactDocRef = doc(db, 'ecoImpact', 'current');
    const impactSnap = await getDoc(impactDocRef);
    if (!impactSnap.exists()) {
      const initialRecord: EcoImpactRecord = {
        treesPlanted: 1240,
        studentsEngaged: 3850,
        eventsOrganized: 48,
        plasticDivertedKg: 1850,
        isVerified: false,
        lastUpdated: new Date().toISOString(),
      };
      await setDoc(impactDocRef, initialRecord);
    }

    // Ensure bootstrap admin document
    await setDoc(
      doc(db, 'admins', BOOTSTRAP_ADMIN_EMAIL.toLowerCase()),
      {
        email: BOOTSTRAP_ADMIN_EMAIL.toLowerCase(),
        role: 'superadmin',
        addedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true, message: 'Initial collections successfully synchronized with Firestore!' };
  } catch (error) {
    console.error('Seeding error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Seeding failed' };
  }
}

// ==========================================
// APPLICATIONS (Join Us)
// ==========================================

export async function submitApplication(appData: Omit<JoinApplication, 'id' | 'status' | 'submittedAt'>): Promise<JoinApplication> {
  const newId = `app-${Date.now()}`;
  const fullApp: JoinApplication = {
    ...appData,
    id: newId,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'applications', newId), fullApp);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `applications/${newId}`);
  }

  // Also maintain local copy for redundancy
  try {
    const local = JSON.parse(localStorage.getItem('eco_club_member_applications') || '[]');
    local.push(fullApp);
    localStorage.setItem('eco_club_member_applications', JSON.stringify(local));
  } catch {
    // Ignore
  }

  return fullApp;
}

export async function getApplications(): Promise<JoinApplication[]> {
  try {
    const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    if (snap.empty) {
      // Fallback to local storage if Firestore is empty
      const local = JSON.parse(localStorage.getItem('eco_club_member_applications') || '[]');
      return local;
    }
    return snap.docs.map((d) => d.data() as JoinApplication);
  } catch (error) {
    console.warn('Falling back to local applications:', error);
    return JSON.parse(localStorage.getItem('eco_club_member_applications') || '[]');
  }
}

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> {
  try {
    await updateDoc(doc(db, 'applications', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `applications/${id}`);
  }
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'applications', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `applications/${id}`);
  }
}

// ==========================================
// CONTACT MESSAGES
// ==========================================

export async function submitContactMessage(msgData: Omit<ContactMessage, 'id' | 'read' | 'submittedAt'>): Promise<ContactMessage> {
  const newId = `msg-${Date.now()}`;
  const fullMsg: ContactMessage = {
    ...msgData,
    id: newId,
    read: false,
    submittedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'contactMessages', newId), fullMsg);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `contactMessages/${newId}`);
  }

  try {
    const local = JSON.parse(localStorage.getItem('eco_club_contact_messages') || '[]');
    local.push(fullMsg);
    localStorage.setItem('eco_club_contact_messages', JSON.stringify(local));
  } catch {
    // Ignore
  }

  return fullMsg;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, 'contactMessages'), orderBy('submittedAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    if (snap.empty) {
      return JSON.parse(localStorage.getItem('eco_club_contact_messages') || '[]');
    }
    return snap.docs.map((d) => d.data() as ContactMessage);
  } catch (error) {
    console.warn('Falling back to local messages:', error);
    return JSON.parse(localStorage.getItem('eco_club_contact_messages') || '[]');
  }
}

export async function markContactMessageRead(id: string, read: boolean = true): Promise<void> {
  try {
    await updateDoc(doc(db, 'contactMessages', id), { read });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contactMessages/${id}`);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'contactMessages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `contactMessages/${id}`);
  }
}

// ==========================================
// EVENTS & REGISTRATIONS
// ==========================================

export async function submitEventRegistration(regData: Omit<EventRegistration, 'id' | 'registeredAt'>): Promise<EventRegistration> {
  const newId = `reg-${Date.now()}`;
  const fullReg: EventRegistration = {
    ...regData,
    id: newId,
    registeredAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'eventRegistrations', newId), fullReg);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `eventRegistrations/${newId}`);
  }

  try {
    const local = JSON.parse(localStorage.getItem('eco_club_event_registrations') || '[]');
    local.push(fullReg);
    localStorage.setItem('eco_club_event_registrations', JSON.stringify(local));
  } catch {
    // Ignore
  }

  return fullReg;
}

export async function getEventRegistrations(): Promise<EventRegistration[]> {
  try {
    const q = query(collection(db, 'eventRegistrations'), orderBy('registeredAt', 'desc'), limit(200));
    const snap = await getDocs(q);
    if (snap.empty) {
      return JSON.parse(localStorage.getItem('eco_club_event_registrations') || '[]');
    }
    return snap.docs.map((d) => d.data() as EventRegistration);
  } catch (error) {
    return JSON.parse(localStorage.getItem('eco_club_event_registrations') || '[]');
  }
}

export async function getEvents(): Promise<EcoEvent[]> {
  try {
    const snap = await getDocs(collection(db, 'events'));
    if (snap.empty) return initialEvents;
    return snap.docs.map((d) => d.data() as EcoEvent);
  } catch (error) {
    return initialEvents;
  }
}

export async function saveEvent(event: EcoEvent): Promise<void> {
  try {
    await setDoc(doc(db, 'events', event.id), event);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `events/${event.id}`);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
  }
}

// ==========================================
// TEAM MEMBERS
// ==========================================

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const snap = await getDocs(collection(db, 'teamMembers'));
    if (snap.empty) return initialTeam;
    return snap.docs.map((d) => d.data() as TeamMember);
  } catch (error) {
    return initialTeam;
  }
}

export async function saveTeamMember(member: TeamMember): Promise<void> {
  try {
    await setDoc(doc(db, 'teamMembers', member.id), member);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `teamMembers/${member.id}`);
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'teamMembers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `teamMembers/${id}`);
  }
}

// ==========================================
// GALLERY
// ==========================================

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const snap = await getDocs(collection(db, 'gallery'));
    if (snap.empty) return initialGallery;
    return snap.docs.map((d) => d.data() as GalleryItem);
  } catch (error) {
    return initialGallery;
  }
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  try {
    await setDoc(doc(db, 'gallery', item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `gallery/${item.id}`);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
  }
}

// ==========================================
// ANNOUNCEMENTS
// ==========================================

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const snap = await getDocs(collection(db, 'announcements'));
    if (snap.empty) return initialAnnouncements;
    return snap.docs.map((d) => d.data() as Announcement);
  } catch (error) {
    return initialAnnouncements;
  }
}

export async function saveAnnouncement(ann: Announcement): Promise<void> {
  try {
    await setDoc(doc(db, 'announcements', ann.id), ann);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `announcements/${ann.id}`);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
  }
}

// ==========================================
// ECO IMPACT DATA
// ==========================================

export async function getEcoImpactRecord(): Promise<EcoImpactRecord> {
  try {
    const snap = await getDoc(doc(db, 'ecoImpact', 'current'));
    if (snap.exists()) {
      return snap.data() as EcoImpactRecord;
    }
  } catch (error) {
    console.warn('Failed to load eco impact from Firestore:', error);
  }

  return {
    treesPlanted: 1240,
    studentsEngaged: 3850,
    eventsOrganized: 48,
    plasticDivertedKg: 1850,
    isVerified: false,
    lastUpdated: new Date().toISOString(),
  };
}

export async function saveEcoImpactRecord(record: EcoImpactRecord): Promise<void> {
  try {
    await setDoc(doc(db, 'ecoImpact', 'current'), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'ecoImpact/current');
  }
}

// ==========================================
// ADMIN USER MANAGEMENT
// ==========================================

export async function getAdminList(): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(collection(db, 'admins'));
    const list = snap.docs.map((d) => {
      const data = d.data();
      return {
        uid: d.id,
        email: data.email || d.id,
        displayName: data.displayName || 'Authorized Admin',
        role: data.role || 'editor',
        addedAt: data.addedAt || new Date().toISOString(),
      } as AdminUser;
    });

    if (!list.some((a) => a.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase())) {
      list.unshift({
        uid: BOOTSTRAP_ADMIN_EMAIL,
        email: BOOTSTRAP_ADMIN_EMAIL,
        displayName: 'Platform Lead (Root Admin)',
        role: 'superadmin',
        addedAt: 'System Initialized',
      });
    }

    return list;
  } catch (error) {
    return [
      {
        uid: BOOTSTRAP_ADMIN_EMAIL,
        email: BOOTSTRAP_ADMIN_EMAIL,
        displayName: 'Platform Lead (Root Admin)',
        role: 'superadmin',
        addedAt: 'System Initialized',
      },
    ];
  }
}

export async function addAdminEmail(email: string, role: 'superadmin' | 'editor' | 'coordinator' = 'editor'): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    await setDoc(doc(db, 'admins', cleanEmail), {
      email: cleanEmail,
      role,
      addedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admins/${cleanEmail}`);
  }
}

export async function removeAdminEmail(emailOrUid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'admins', emailOrUid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admins/${emailOrUid}`);
  }
}
