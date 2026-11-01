import React from 'react';
import { Target, Compass, Award, Sprout, Recycle, Trash2, Home, Lightbulb, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeading } from '../components/SectionHeading';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const About: React.FC = () => {
  const objectives = [
    {
      icon: Sprout,
      title: 'Promote Environmental Awareness',
      description: 'Educate the campus community on ecological conservation, biodiversity preservation, and individual carbon responsibility.',
    },
    {
      icon: Recycle,
      title: 'Waste Reduction & Recycling',
      description: 'Implement rigorous source segregation, compost organic cafeteria waste, and divert recyclables away from municipal landfills.',
    },
    {
      icon: Trash2,
      title: 'Plantation & Cleanliness Drives',
      description: 'Host bi-weekly campus and trail clean-ups while reforesting perimeter lands with indigenous drought-hardy flora.',
    },
    {
      icon: Home,
      title: 'Sustainable Campus Practices',
      description: 'Advocate for solar infrastructure, rainwater retention, greywater treatment, and single-use plastic elimination.',
    },
    {
      icon: Lightbulb,
      title: 'Ecological Innovation & Research',
      description: 'Support student prototypes addressing energy efficiency, IoT soil telemetry, and zero-waste material alternatives.',
    },
    {
      icon: Users,
      title: 'Environmentally Responsible Community',
      description: 'Empower an interconnected network of active green volunteers across all faculties, dormitories, and student guilds.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#FCFCF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          kicker="Our Purpose & Foundation"
          title="More Than a Club. A Movement for Change."
          subtitle="Founded to transform academic spaces into self-sustaining ecological sanctuaries through student enthusiasm, scientific rigor, and collective responsibility."
        />

        {/* Split Screen Layout: Vision / Mission / Motto & Feature Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          {/* Left Column: Visual Documentary Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
                alt="Volunteers planting saplings in campus grounds"
                className="w-full h-[420px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                fallbackText="Campus Tree Planting Initiative"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173F35]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest text-[#C7E7A1] font-semibold">Campus Stewardship</p>
                <p className="text-sm font-medium mt-1 text-stone-100">
                  Every native sapling planted on campus represents our lifelong commitment to regional biodiversity.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Vision, Mission, Motto */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            {/* Vision */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F7EF] border border-stone-200/80">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#244F3D] text-[#C7E7A1] flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#173F35]">Our Vision</h3>
              </div>
              <p className="text-[#202C25] leading-relaxed text-base sm:text-lg">
                To inspire a generation that understands its deep responsibility towards nature and actively contributes to a sustainable, regenerative future for our college, local ecosystems, and society.
              </p>
            </div>

            {/* Mission */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F7EF] border border-stone-200/80">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#7DAA65] text-[#173F35] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#173F35]">Our Mission</h3>
              </div>
              <p className="text-[#202C25] leading-relaxed text-base sm:text-lg">
                To create tangible environmental awareness through student-led initiatives, practical green activities, experiential workshops, educational drives, and vibrant community participation.
              </p>
            </div>

            {/* Motto Callout */}
            <div className="p-6 rounded-2xl bg-[#173F35] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#C7E7A1] shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C7E7A1] font-semibold block">Official Club Motto</span>
                  <span className="font-serif text-lg sm:text-xl font-medium tracking-wide text-[#F7F7EF]">
                    &ldquo;Think Green. Act Clean. Live Sustainable.&rdquo;
                  </span>
                </div>
              </div>
              <a
                href="#join-us"
                className="self-start sm:self-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#C7E7A1] text-[#173F35] hover:bg-[#b5dc8c] transition-colors whitespace-nowrap"
              >
                Join Movement
              </a>
            </div>
          </div>
        </div>

        {/* Objectives Grid */}
        <div className="pt-8 border-t border-stone-200">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7DAA65] mb-2">Strategic Pillars</p>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#173F35]">Core Objectives of Eco Club</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, index) => {
              const Icon = obj.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-2xl bg-[#FCFCF8] border border-stone-200/90 shadow-sm hover:shadow-md hover:border-[#7DAA65]/50 transition-all flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F7F7EF] text-[#244F3D] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-[#173F35] mb-2">
                    {index + 1}. {obj.title}
                  </h4>
                  <p className="text-sm text-[#737D73] leading-relaxed">
                    {obj.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
