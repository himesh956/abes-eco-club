import React from 'react';
import { Sprout, Users, CalendarCheck, Trash2, Info, TrendingUp, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SectionHeading } from '../components/SectionHeading';
import { impactStats as defaultStats, monthlyImpactData, activityDistribution, milestoneAchievements } from '../data/impact';
import { EcoImpactRecord } from '../types';

interface EcoImpactProps {
  impactData?: EcoImpactRecord;
}

export const EcoImpact: React.FC<EcoImpactProps> = ({ impactData }) => {
  const isVerified = impactData?.isVerified ?? false;

  const currentStats = [
    {
      id: 'stat-trees',
      label: 'Native Trees Planted',
      value: impactData ? impactData.treesPlanted : 1240,
      suffix: '+',
      subtext: '88% survival rate across campus groves',
      iconName: 'Sprout',
    },
    {
      id: 'stat-students',
      label: 'Students Engaged',
      value: impactData ? impactData.studentsEngaged : 3850,
      suffix: '+',
      subtext: 'Across 14 departments and residence halls',
      iconName: 'Users',
    },
    {
      id: 'stat-events',
      label: 'Eco Initiatives Organized',
      value: impactData ? impactData.eventsOrganized : 48,
      suffix: '+',
      subtext: 'Workshops, drives, hackathons & rallies',
      iconName: 'CalendarCheck',
    },
    {
      id: 'stat-plastic',
      label: 'Plastic Waste Diverted',
      value: impactData ? impactData.plasticDivertedKg : 1850,
      suffix: ' kg',
      subtext: 'Redirected to certified recycling partners',
      iconName: 'Trash2',
    },
  ];

  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return Sprout;
      case 'Users':
        return Users;
      case 'CalendarCheck':
        return CalendarCheck;
      case 'Trash2':
        return Trash2;
      default:
        return Sprout;
    }
  };

  return (
    <section id="impact" className="py-24 bg-[#173F35] text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7DAA65]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C7E7A1]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Demo Data Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            kicker="Quantifiable Progress"
            title="Every Action Creates an Impact."
            subtitle="Explore how student volunteer hours, sapling drives, and campus waste reduction initiatives translate into cumulative ecological restoration."
            dark
            className="mb-0 md:mb-0"
          />

          <div
            className={`mt-6 md:mt-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs self-start md:self-auto backdrop-blur-md ${
              isVerified
                ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/50'
                : 'bg-white/10 text-[#C7E7A1] border-white/20'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="font-medium">
              {isVerified ? 'VERIFIED CAMPUS AUDIT DATA' : 'DEMO DATASET · Illustrative Campus Simulation'}
            </span>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {currentStats.map((stat) => {
            const Icon = getStatIcon(stat.iconName);
            return (
              <div
                key={stat.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest text-stone-300 font-semibold">
                    {stat.label}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#7DAA65]/20 text-[#C7E7A1] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-white tabular-nums tracking-tight">
                    {stat.value.toLocaleString()}
                    <span className="text-[#C7E7A1]">{stat.suffix}</span>
                  </div>
                  <p className="text-xs text-stone-300 mt-2 font-medium">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Monthly Activity Bar Chart */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#C7E7A1]" />
                  Monthly Field Activity & Volunteer Hours
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Recorded volunteer hours and saplings planted per semester month
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyImpactData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#A8B5AA" fontSize={12} tickLine={false} />
                  <YAxis stroke="#A8B5AA" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#173F35',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#C7E7A1', fontWeight: 600 }}
                  />
                  <Bar dataKey="volunteerHours" name="Volunteer Hours" fill="#7DAA65" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="treesPlanted" name="Trees Planted" fill="#C7E7A1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-stone-300">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#7DAA65]" /> Volunteer Hours
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#C7E7A1]" /> Trees Planted
              </span>
            </div>
          </div>

          {/* Environmental Activity Distribution Donut Chart */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-semibold text-white">
                Initiative Distribution
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Resource allocation across ecological focus areas
              </p>
            </div>

            <div className="h-64 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    innerRadius={60}
                    outerRadius={88}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#173F35" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Allocation']}
                    contentStyle={{
                      backgroundColor: '#173F35',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-serif font-bold text-white tabular-nums">100%</span>
                <span className="text-[11px] text-[#C7E7A1]">Campus Led</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/10">
              {activityDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs text-stone-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold tabular-nums text-[#C7E7A1]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Achievements */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Award className="w-5 h-5 text-[#C7E7A1]" />
            <h3 className="font-serif text-xl font-semibold text-white">
              Institutional Sustainability Milestones
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestoneAchievements.map((milestone) => (
              <div key={milestone.year} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-[#C7E7A1] tracking-wider uppercase block mb-1">
                  Year {milestone.year}
                </span>
                <h4 className="font-serif text-base font-semibold text-white mb-1.5">
                  {milestone.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
