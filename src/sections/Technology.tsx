import React from 'react';
import { Cpu, BarChart3, Radio, Database, ShieldAlert, Laptop, Terminal, Sparkles } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';

export const Technology: React.FC = () => {
  const techPillars = [
    {
      icon: Radio,
      title: 'Campus Environmental IoT & Telemetry',
      description:
        'Deploying open-source sensor nodes across campus botanical groves to monitor real-time soil moisture, canopy humidity, ambient temperature, and particulate air quality.',
      badge: 'Hardware & IoT',
    },
    {
      icon: BarChart3,
      title: 'Environmental Data Visualization',
      description:
        'Transforming raw utility records, composting logs, and water meter data into clear, actionable campus sustainability dashboards that inspire behavioral change.',
      badge: 'Data Science',
    },
    {
      icon: Laptop,
      title: 'Digital Campaign & Drive Management',
      description:
        'Developing frictionless web portals for tree plantation registration, volunteer shift check-ins, and automated plastic-free pledge verification across student dorms.',
      badge: 'Web Architecture',
    },
    {
      icon: Database,
      title: 'Campus Biodiversity Registry',
      description:
        'Building an interactive digital catalog with QR code plaques mounted on heritage trees, mapping 80+ indigenous species across the college arboretum.',
      badge: 'Digital Herbarium',
    },
    {
      icon: ShieldAlert,
      title: 'E-Waste Lifecycle Auditing',
      description:
        'Tracking retired computers, circuit boards, and lead-acid batteries with verifiable digital audit trails to prevent toxic heavy metal landfill leakage.',
      badge: 'Circularity Tech',
    },
    {
      icon: Terminal,
      title: 'Open Source Ecological Tooling',
      description:
        'Mentoring student developers to contribute to open-source climate and sustainability repositories, bridging computer science curriculum with environmental stewardship.',
      badge: 'Open Source',
    },
  ];

  return (
    <section id="technology" className="py-24 bg-[#FCFCF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          kicker="Engineering & Innovation"
          title="Technology for a Sustainable Tomorrow"
          subtitle="How the Eco Club Tech Division bridges modern software engineering, telemetry sensors, and environmental science to amplify campus conservation."
        />

        {/* Highlight Architecture Banner */}
        <div className="mb-12 p-8 rounded-3xl bg-[#173F35] text-white border border-[#244F3D] relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#C7E7A1] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student-Engineered Sustainability Tech Stack</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F7F7EF] leading-snug mb-3">
              Code, Hardware & Data in Service of the Biosphere
            </h3>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
              We believe environmental advocacy must be backed by measurable data. Our Tech Team designs automated telemetry, real-time dashboards, and collaborative web platforms that measure actual ecological recovery and empower hundreds of student volunteers.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="block text-[#C7E7A1] font-semibold">Sensor Network</span>
              <span className="text-stone-300">Micro-climate nodes</span>
            </div>
            <div>
              <span className="block text-[#C7E7A1] font-semibold">Web Platform</span>
              <span className="text-stone-300">Vite + React + Firebase</span>
            </div>
            <div>
              <span className="block text-[#C7E7A1] font-semibold">Data Accuracy</span>
              <span className="text-stone-300">Calibrated field probes</span>
            </div>
            <div>
              <span className="block text-[#C7E7A1] font-semibold">Student Built</span>
              <span className="text-stone-300">100% Peer-led research</span>
            </div>
          </div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#FCFCF8] border border-stone-200/90 shadow-xs hover:shadow-md hover:border-[#7DAA65]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F7EF] text-[#244F3D] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#F7F7EF] text-[#173F35] border border-stone-200">
                      {pillar.badge}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-semibold text-[#173F35] mb-2 leading-snug">
                    {pillar.title}
                  </h4>
                  <p className="text-sm text-[#737D73] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs text-[#244F3D] font-medium">
                  <Cpu className="w-3.5 h-3.5 text-[#7DAA65]" />
                  <span>Eco Club Tech Initiative</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
