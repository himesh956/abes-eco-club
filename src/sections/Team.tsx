import React, { useState } from 'react';
import { Linkedin, Github, Mail, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeading } from '../components/SectionHeading';
import { teamMembers as defaultMembers } from '../data/team';
import { TeamCategory, TeamMember } from '../types';

interface TeamProps {
  members?: TeamMember[];
}

export const Team: React.FC<TeamProps> = ({ members = defaultMembers }) => {
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>('All');

  const categories: TeamCategory[] = [
    'All',
    'Faculty Heads',
    'Core Members',
    'Tech Team',
    'Environment Team',
    'Event Management Team',
    'Social Media Team',
    'Creative Team',
  ];

  const filteredMembers =
    selectedCategory === 'All'
      ? members
      : members.filter((member) => member.category === selectedCategory);

  // Elegant color assignment for initials badges based on category
  const getAvatarStyle = (category: TeamCategory) => {
    switch (category) {
      case 'Faculty Heads':
        return 'bg-[#173F35] text-[#C7E7A1] border-[#7DAA65]/30';
      case 'Core Members':
        return 'bg-[#244F3D] text-[#F7F7EF] border-stone-300';
      case 'Tech Team':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/40';
      case 'Environment Team':
        return 'bg-[#7DAA65] text-[#173F35] border-[#244F3D]/20';
      case 'Event Management Team':
        return 'bg-[#987653] text-[#F7F7EF] border-stone-300';
      case 'Social Media Team':
      case 'Creative Team':
        return 'bg-[#202C25] text-[#C7E7A1] border-stone-300';
      default:
        return 'bg-[#244F3D] text-[#C7E7A1] border-stone-300';
    }
  };

  return (
    <section id="team" className="py-24 bg-[#FCFCF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Editorial Polish */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <SectionHeading
            kicker="Our Committee"
            title="Advisors & Student Coordinators"
            subtitle="Faculty mentors and student organizers leading campus environmental initiatives, ecological research, and hands-on conservation."
            className="mb-0 md:mb-0"
          />

          <div className="mt-4 md:mt-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F7F7EF] border border-stone-200 text-xs text-[#737D73] max-w-sm">
            <Info className="w-4 h-4 text-[#7DAA65] shrink-0" />
            <span>Initials-based demo profiles. Replace with verified college faculty and student coordinators.</span>
          </div>
        </div>

        {/* Category Filters (Segmented Control) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#173F35] text-white shadow-xs'
                  : 'bg-[#F7F7EF] text-[#737D73] hover:text-[#173F35] hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Grid: 3 cols Desktop, 2 cols Tablet, 1 col Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="group bg-[#FCFCF8] rounded-2xl border border-stone-200/90 p-6 shadow-xs hover:shadow-md hover:border-[#7DAA65]/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Initials Avatar + Category & Demo Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif text-lg font-bold tracking-wider shadow-xs border ${getAvatarStyle(
                      member.category
                    )}`}
                  >
                    {member.initials ||
                      member.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-semibold text-[#173F35] bg-[#F7F7EF] px-2.5 py-1 rounded-md border border-stone-200">
                      {member.category}
                    </span>
                    {member.isDemo && (
                      <span className="text-[10px] uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Demo Profile
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <h3 className="font-serif text-xl font-semibold text-[#173F35] leading-snug">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-[#7DAA65] mt-1">
                  {member.role}
                </p>
                <p className="text-xs text-[#737D73] mt-0.5 font-medium">
                  {member.department}
                </p>

                <p className="text-sm text-[#202C25] mt-3.5 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Social and Communication Links */}
              <div className="flex items-center justify-between pt-4 mt-5 border-t border-stone-100 text-stone-500">
                <span className="text-[11px] text-[#737D73] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7DAA65]" />
                  <span>Eco Club Representative</span>
                </span>

                <div className="flex items-center gap-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:text-[#173F35] hover:bg-stone-100 transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:text-[#173F35] hover:bg-stone-100 transition-colors"
                      aria-label={`${member.name} GitHub`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-lg hover:text-[#173F35] hover:bg-stone-100 transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
