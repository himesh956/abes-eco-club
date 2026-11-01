# ECO CLUB — Digital Platform & Administrative Management Hub

> **"Small Actions. Greener Tomorrow."**  
> A full-stack, responsive web application and secure administrative console engineered for college eco clubs, campus green audits, ecological drives, and community conservation.

---

## 🌿 1. Overview & Key Experiences

The platform provides two experiences:

1. **Public Eco Club Website**: A high-contrast single-page experience showcasing the club's mission, objectives, dedicated committee directory (using initials-based avatars, eliminating random stock human portraits), environmental drives, photo gallery with lightbox, eco impact telemetry, sustainability tips, gamified eco challenges, tech team feature, and membership application form.
2. **Secure Admin Dashboard (`/admin/dashboard`)**: A protected administrative suite powered by **Firebase Authentication** and **Cloud Firestore**, enabling authorized faculty advisors and student coordinators to manage events, attendee registrations, committee members, gallery media, announcements, student applications (approve/reject), contact inquiries, and live impact telemetry.

---

## 🚀 2. Architecture & Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 with custom nature-inspired theme tokens (`--color-forest: #173F35`, `--color-deep-green: #244F3D`, `--color-fresh-green: #7DAA65`, `--color-lime-accent: #C7E7A1`, `--color-warm-cream: #F7F7EF`)
- **Typography**: Playfair Display (editorial serif) & Plus Jakarta Sans / DM Sans (body)
- **Database**: Google Cloud Firestore (Enterprise Edition)
- **Authentication**: Firebase Authentication (Google Sign-In with Zero-Trust RBAC allowlist)
- **Visual Analytics**: Recharts
- **Icons & Motion**: Lucide React & Motion

---

## 📁 3. Folder Structure

```text
├── firebase-blueprint.json      # Intermediate Representation (IR) defining Firestore schema
├── firebase-applet-config.json  # Firebase SDK credentials & project identifiers
├── firestore.rules              # Hardened production security rules
├── index.html                   # Entry point with Google Fonts & SEO metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── src/
│   ├── main.tsx                 # Application mounting
│   ├── App.tsx                  # Root router orchestrating Public View & Admin routes
│   ├── index.css                # Global Tailwind CSS definitions & typography
│   ├── lib/
│   │   └── firebase.ts          # Firebase SDK initialization, Auth, & db instances
│   ├── types/
│   │   └── index.ts             # Centralized TypeScript interfaces
│   ├── services/
│   │   └── admin.service.ts     # Firestore CRUD, Google Auth, and Seeding engine
│   ├── data/
│   │   ├── team.ts              # Committee roster with initials-based avatars (no stock portraits)
│   │   ├── events.ts            # Eco drives, cleanliness campaigns, and workshops
│   │   ├── gallery.ts           # Photo gallery records with captions
│   │   ├── impact.ts            # Eco metrics, monthly charts & milestone data
│   │   ├── tips.ts              # Daily sustainable living tips
│   │   ├── challenges.ts        # Gamified student quests
│   │   └── announcements.ts     # Campus bulletins & priority notices
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky navigation with mobile drawer & Admin trigger
│   │   ├── Footer.tsx           # Multi-column footer with Admin Login link
│   │   ├── SectionHeading.tsx   # Balanced editorial headings
│   │   ├── Modal.tsx            # Accessible modal dialog with backdrop/ESC close
│   │   └── ImageWithFallback.tsx# Zero broken images fallback component
│   ├── sections/
│   │   ├── Hero.tsx             # Full-width cinematic hero with intro operational ribbon
│   │   ├── Announcements.tsx    # Campus bulletins & modal reader
│   │   ├── About.tsx            # Vision, mission, motto, and 6 core strategic pillars
│   │   ├── Technology.tsx       # Tech Team feature (IoT telemetry, data viz, circularity)
│   │   ├── Team.tsx             # Clean 3-col roster with category filters & initials badges
│   │   ├── Events.tsx           # Event cards, detail modal & registration form
│   │   ├── Gallery.tsx          # Curated photo masonry & keyboard-navigable lightbox
│   │   ├── EcoImpact.tsx        # Impact metrics & Recharts visualizer
│   │   ├── SustainabilityTips.tsx# Interactive habit switcher with pledge tracking
│   │   ├── Challenges.tsx       # Gamified student quests
│   │   ├── JoinUs.tsx           # Validated membership application connected to Firestore
│   │   └── Contact.tsx          # Campus office details & dispatch message form
│   └── pages/
│       ├── AdminLogin.tsx       # Secure Google Sign-In with unauthorized access guard
│       └── AdminDashboard.tsx   # Full CRUD console across 10 operational sections
```

---

## 🔒 4. Firebase Authentication & Authorization Setup

### How Authorization Works
1. When an administrator signs in via Google (`signInWithPopup`), their email is checked against:
   - The root bootstrap superadmin: `himeshrajput956@gmail.com`
   - The `/admins/{adminId}` collection in Cloud Firestore.
2. If the email is present in the allowlist, access to the dashboard is granted.
3. If an unauthorized Google account attempts sign in, an **Access Denied** notice is displayed, and Firestore Security Rules reject all write/PII access.

### Adding New Administrators
Administrators can grant access to faculty advisors or student coordinators directly from **Admin Dashboard &rarr; Settings & Admin Access** by inputting their verified Google email address.

---

## 🛡️ 5. Firestore Collections & Security Rules

The database uses the following collections in Cloud Firestore:

| Collection | Public Read | Public Write | Admin Only Access |
| :--- | :---: | :---: | :---: |
| `/events` | ✅ | ❌ | Full CRUD |
| `/teamMembers` | ✅ | ❌ | Full CRUD |
| `/gallery` | ✅ | ❌ | Full CRUD |
| `/announcements` | ✅ | ❌ | Full CRUD |
| `/ecoImpact` | ✅ | ❌ | Full CRUD |
| `/applications` | ❌ | ✅ (Validated Create) | Read / Status Update / Delete |
| `/contactMessages` | ❌ | ✅ (Validated Create) | Read / Mark Read / Delete |
| `/eventRegistrations` | ❌ | ✅ (Validated Create) | Read / Delete |
| `/admins` | ❌ | ❌ | Read & Write (Admin only) |

Security rules enforce catch-all default deny and field-level size and type constraints:
```bash
# Deployed via AI Studio fax.DeployRules RPC
```

---

## 💻 6. Running Locally

### Prerequisites
- Node.js (v18+)
- npm or bun

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run TypeScript typechecks
npm run lint

# Build optimized production bundle
npm run build
```

---

## 🌐 7. Navigating Between Experiences

- **Public Website**: Navigate to `http://localhost:3000/` or click *"Return to Public Website"* from any admin screen.
- **Admin Portal**: Click the *"Admin"* button in the top navigation or the *"Admin Login"* link in the footer, or open `http://localhost:3000/#admin-login`.
- **One-Click Data Seeding**: Inside the Admin Dashboard, click **"Sync / Seed Firestore"** in the top bar to initialize default campus events, team members, gallery items, and announcements into your Firestore database.

---

## 🔄 8. Replacing Demo Data with Real College Information

1. **Committee Members**:
   - Use the **Admin Dashboard &rarr; Team Members** tab to add, edit, or remove faculty advisors and student coordinators.
   - Or modify `src/data/team.ts` before initial seeding.
2. **Upcoming Events**:
   - Create or update dates and venues in **Admin Dashboard &rarr; Events**.
3. **Contact Details & Office Location**:
   - Update room numbers and email placeholders in `src/sections/Contact.tsx`.
4. **Verifying Eco Impact**:
   - In **Admin Dashboard &rarr; Eco Impact Telemetry**, enter verified figures and check *"Mark metrics as officially verified"* to update the public banner.

---

## 📜 License
Apache-2.0
