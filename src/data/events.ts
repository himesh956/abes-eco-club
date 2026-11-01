import { EcoEvent } from '../types';

/**
 * DEMO DATA NOTICE:
 * All events listed below represent sample demonstration initiatives.
 * Event dates, venue schedules, and registration forms reflect realistic campus programs.
 */
export const ecoEvents: EcoEvent[] = [
  {
    id: 'event-1',
    title: 'Green Campus Native Plantation Drive',
    date: 'November 15, 2026',
    time: '08:30 AM – 01:00 PM',
    location: 'North Campus Botanical Grove & Quad C',
    category: 'Plantation',
    status: 'Upcoming',
    description: 'Join hands to plant 250+ native saplings, establish a medicinal herb patch, and build organic mulch barriers.',
    fullDetails:
      'The Annual Native Plantation Drive brings students and faculty together to rewild urban campus edges with drought-tolerant indigenous saplings (Oak, Neem, Jacaranda, and Gulmohar). Organic compost produced right from our campus cafeteria leaf waste will be utilized. Gardening gloves, saplings, soil trowels, and herbal refreshments will be provided to all registered participants.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    maxAttendees: 120,
    registeredCount: 84,
    requirements: ['Comfortable outdoor attire & sturdy shoes', 'Personal refillable water flask', 'Sun protection hat'],
  },
  {
    id: 'event-2',
    title: 'Plastic-Free Campus Action Month',
    date: 'November 01 – November 30, 2026',
    time: 'All Day (Active Month-Long Campaign)',
    location: 'All Campus Cafeterias, Dining Halls & Student Union',
    category: 'Cleanliness',
    status: 'Ongoing',
    description: 'A month-long initiative transitioning our food courts from single-use plastics to compostable bagasseware and stainless steel.',
    fullDetails:
      'We are conducting daily audits across 6 campus dining establishments, offering free bamboo sporks and canvas tote bags to students taking the 30-day zero single-use plastic pledge. Weekly raffle drawings reward students carrying reusable thermal bottles and tiffin boxes.',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    maxAttendees: 500,
    registeredCount: 382,
    requirements: ['Commit to refusing disposable cutlery & plastic bags', 'Share your plastic-free habit with #EcoCampus2026'],
  },
  {
    id: 'event-3',
    title: 'Sustainable Living & Zero-Waste Workshop',
    date: 'December 05, 2026',
    time: '02:00 PM – 05:30 PM',
    location: 'Design & Innovation Lab, Room 204',
    category: 'Workshop',
    status: 'Upcoming',
    description: 'Hands-on masterclass on DIY beeswax wraps, micro-greens cultivation in dorm rooms, and natural citrus bio-enzymes.',
    fullDetails:
      'Learn how to turn kitchen scraps into high-potency organic enzyme cleaners, construct miniature self-watering sub-irrigated dorm planters out of recycled glass jars, and sew reusable produce pouches from scrap fabric. Facilitated by eco-design practitioners and certified permaculturists.',
    imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1200&q=80',
    registrationOpen: true,
    maxAttendees: 45,
    registeredCount: 39,
    requirements: ['Bring an empty clean glass jar (500ml or 1L)', 'Old cotton t-shirt for upcycling'],
  },
  
];
