import { ImpactStatistic } from '../types';

/**
 * DEMO DATA NOTICE:
 * All environmental metrics below represent illustrative simulated campus impact figures.
 * Connect with the campus sustainability audit office or sensor telemetry in production.
 */
export const impactStats: ImpactStatistic[] = [
  {
    id: 'stat-trees',
    label: 'Native Trees Planted',
    value: 1240,
    suffix: '+',
    subtext: '88% survival rate across campus groves',
    iconName: 'Sprout',
  },
  {
    id: 'stat-students',
    label: 'Students Engaged',
    value: 3850,
    suffix: '+',
    subtext: 'Across 14 departments and residence halls',
    iconName: 'Users',
  },
  {
    id: 'stat-events',
    label: 'Eco Initiatives Organized',
    value: 48,
    suffix: '+',
    subtext: 'Workshops, drives, hackathons & rallies',
    iconName: 'CalendarCheck',
  },
  {
    id: 'stat-plastic',
    label: 'Plastic Waste Diverted',
    value: 1850,
    suffix: ' kg',
    subtext: 'Redirected to certified recycling partners',
    iconName: 'Trash2',
  },
];

export const monthlyImpactData = [
  { month: 'Jun', treesPlanted: 140, volunteerHours: 320, wasteCollectedKg: 190 },
  { month: 'Jul', treesPlanted: 190, volunteerHours: 410, wasteCollectedKg: 240 },
  { month: 'Aug', treesPlanted: 160, volunteerHours: 380, wasteCollectedKg: 210 },
  { month: 'Sep', treesPlanted: 280, volunteerHours: 540, wasteCollectedKg: 350 },
  { month: 'Oct', treesPlanted: 310, volunteerHours: 620, wasteCollectedKg: 420 },
  { month: 'Nov (Proj)', treesPlanted: 160, volunteerHours: 490, wasteCollectedKg: 440 },
];

export const activityDistribution = [
  { name: 'Native Afforestation', value: 35, color: '#244F3D' },
  { name: 'Waste & Plastic Audits', value: 25, color: '#7DAA65' },
  { name: 'Student Workshops & DIY', value: 20, color: '#C7E7A1' },
  { name: 'Wetland & Trail Cleanups', value: 12, color: '#987653' },
  { name: 'Green Policy Advocacy', value: 8, color: '#173F35' },
];

export const milestoneAchievements = [
  {
    year: '2024',
    title: 'Plastic-Free Dining Policy',
    description: 'Collaborated with campus governance to ban single-use styrofoam and disposable plastic cutlery in all college food kiosks.',
  },
  {
    year: '2025',
    title: 'Rainwater Harvesting Cistern',
    description: 'Designed and installed a 25,000-liter sub-surface rainwater reservoir replenishing local groundwater reserves.',
  },
  {
    year: '2026',
    title: 'Autonomous Campus Herbarium',
    description: 'Planted 1,200+ indigenous trees and launched a student-led micro-nursery supporting local pollinator species.',
  },
];
