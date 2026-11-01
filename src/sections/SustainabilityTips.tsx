import React, { useState } from 'react';
import { Zap, Droplet, Recycle, Waves, Bike, FileText, Utensils, Shuffle, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from '../components/SectionHeading';
import { sustainabilityTips } from '../data/tips';

export const SustainabilityTips: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pledgedTips, setPledgedTips] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('eco_club_pledged_tips') || '[]');
    } catch {
      return [];
    }
  });

  const getTipIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return Zap;
      case 'Droplet':
        return Droplet;
      case 'Recycle':
        return Recycle;
      case 'Waves':
        return Waves;
      case 'Bike':
        return Bike;
      case 'FileText':
        return FileText;
      case 'Utensils':
        return Utensils;
      default:
        return Recycle;
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sustainabilityTips.length);
  };

  const handleRandom = () => {
    let nextIdx = Math.floor(Math.random() * sustainabilityTips.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % sustainabilityTips.length;
    }
    setCurrentIndex(nextIdx);
  };

  const togglePledge = (id: string) => {
    const updated = pledgedTips.includes(id)
      ? pledgedTips.filter((item) => item !== id)
      : [...pledgedTips, id];
    setPledgedTips(updated);
    try {
      localStorage.setItem('eco_club_pledged_tips', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const currentTip = sustainabilityTips[currentIndex];
  const Icon = getTipIcon(currentTip.iconName);
  const isPledged = pledgedTips.includes(currentTip.id);

  return (
    <section id="tips" className="py-24 bg-[#FCFCF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Daily Sustainable Living"
          title="Small Habits. Big Impact."
          subtitle="Transforming campus sustainability does not require heroic single efforts—it blossoms through thousands of quiet, mindful student choices every day."
        />

        {/* Interactive Spotlight Card & Category Thumbnails */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Main Featured Interactive Spotlight Card */}
          <div className="lg:col-span-7 bg-[#F7F7EF] border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7DAA65] bg-white px-3 py-1 rounded-full border border-stone-200">
                  {currentTip.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRandom}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-stone-200 text-[#173F35] hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Explore a random eco habit"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Random Tip</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors cursor-pointer"
                    title="View next habit"
                  >
                    <span>Next Habit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#244F3D] text-[#C7E7A1] flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#173F35] leading-tight">
                      {currentTip.title}
                    </h3>
                  </div>

                  <p className="text-base text-[#202C25] leading-relaxed mb-6">
                    {currentTip.summary}
                  </p>

                  <div className="p-4 rounded-xl bg-white border border-stone-200/80 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#173F35] mb-1">
                      Actionable Step for Students
                    </h4>
                    <p className="text-sm text-[#737D73] leading-relaxed">
                      {currentTip.actionableStep}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#173F35] bg-[#C7E7A1]/40 border border-[#C7E7A1] px-3.5 py-1.5 rounded-lg">
                    <span>Measurable Impact:</span>
                    <span className="font-normal text-[#202C25]">{currentTip.impactMetric}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom pledge interaction */}
            <div className="pt-6 border-t border-stone-200/80 flex items-center justify-between gap-4 mt-6">
              <span className="text-xs text-[#737D73]">
                Tip {currentIndex + 1} of {sustainabilityTips.length}
              </span>

              <button
                onClick={() => togglePledge(currentTip.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isPledged
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-[#173F35] border border-stone-200 hover:border-[#7DAA65]'
                }`}
              >
                {isPledged ? (
                  <>
                    <Check className="w-4 h-4 text-[#C7E7A1]" />
                    <span>Pledged to Practice</span>
                  </>
                ) : (
                  <span>Take the Habit Pledge</span>
                )}
              </button>
            </div>
          </div>

          {/* Quick List of All Tips */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-serif text-lg font-semibold text-[#173F35] mb-4">
              All Campus Living Guidelines
            </h4>
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-2">
              {sustainabilityTips.map((tip, idx) => {
                const ItemIcon = getTipIcon(tip.iconName);
                const isSelected = idx === currentIndex;
                const pledged = pledgedTips.includes(tip.id);

                return (
                  <button
                    key={tip.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#173F35] text-white border-[#173F35] shadow-xs'
                        : 'bg-[#FCFCF8] text-[#202C25] border-stone-200 hover:border-[#7DAA65]/60 hover:bg-[#F7F7EF]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#244F3D] text-[#C7E7A1]'
                            : 'bg-[#F7F7EF] text-[#244F3D]'
                        }`}
                      >
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold truncate leading-tight">
                          {tip.title}
                        </p>
                        <span
                          className={`text-[11px] block mt-0.5 ${
                            isSelected ? 'text-stone-300' : 'text-[#737D73]'
                          }`}
                        >
                          {tip.category}
                        </span>
                      </div>
                    </div>

                    {pledged && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? 'bg-[#C7E7A1] text-[#173F35]'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Pledged
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
