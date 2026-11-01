import React from 'react';
import { ArrowDown, ArrowRight, Sparkles, Sprout, Recycle, Cpu, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const introPillars = [
    {
      icon: Sprout,
      label: 'Campus Afforestation',
      desc: 'Native tree sapling cultivation & botanical corridors',
    },
    {
      icon: Recycle,
      label: 'Waste Circularity',
      desc: 'Source segregation, composting & zero-plastic dining',
    },
    {
      icon: Cpu,
      label: 'Green Tech Innovation',
      desc: 'IoT soil telemetry, air quality monitoring & analytics',
    },
    {
      icon: Globe2,
      label: 'Community Engagement',
      desc: 'Student-led eco drives, workshops & policy advocacy',
    },
  ];

  return (
    <>
      <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-20">
        {/* Background Image with Rich Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=85"
            alt="Lush green canopy and sunlight filtering through campus forest grove"
            className="w-full h-full object-cover scale-102 transition-transform duration-1000 ease-out"
            containerClassName="w-full h-full"
          />
          {/* Multilayered rich scrim to guarantee WCAG AA contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#173F35] via-[#173F35]/80 to-[#173F35]/55 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Sustainability Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-[#C7E7A1] mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#C7E7A1]" />
            <span>Small Actions. Greener Tomorrow.</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
            style={{ textWrap: 'balance' }}
          >
            Together, Let&apos;s Make Our Campus Greener.
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-stone-200 font-normal leading-relaxed mb-10"
            style={{ textWrap: 'balance' }}
          >
            Building a sustainable tomorrow through awareness, innovation, and meaningful student action.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <button
              onClick={() => scrollToSection('about')}
              className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-semibold text-[#173F35] bg-[#C7E7A1] rounded-xl hover:bg-[#bde393] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-black/20 cursor-pointer"
            >
              Explore Our Mission
            </button>
            <button
              onClick={() => scrollToSection('join-us')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md rounded-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Join the Movement</span>
              <ArrowRight className="w-4 h-4 text-[#C7E7A1]" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer text-white/80 hover:text-white transition-colors"
          onClick={() => scrollToSection('intro-strip')}
          role="button"
          tabIndex={0}
          aria-label="Scroll to introduction"
        >
          <span className="text-[11px] uppercase tracking-widest font-medium">Scroll Down</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#C7E7A1]" />
        </motion.div>
      </section>

      {/* Tasteful Operational Introduction Ribbon */}
      <section id="intro-strip" className="bg-[#173F35] border-t border-[#244F3D] py-8 text-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {introPillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#C7E7A1] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#F7F7EF]">
                      {item.label}
                    </h4>
                    <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
