import React, { useState } from 'react';
import { Trophy, Clock, CheckCircle2, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Modal } from '../components/Modal';
import { ecoChallenges } from '../data/challenges';
import { EcoChallenge } from '../types';

export const Challenges: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<EcoChallenge | null>(null);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('eco_club_joined_challenges') || '[]');
    } catch {
      return [];
    }
  });

  const toggleJoinChallenge = (challengeId: string) => {
    const updated = joinedChallenges.includes(challengeId)
      ? joinedChallenges.filter((id) => id !== challengeId)
      : [...joinedChallenges, challengeId];

    setJoinedChallenges(updated);
    try {
      localStorage.setItem('eco_club_joined_challenges', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const getDifficultyColor = (difficulty: EcoChallenge['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Intermediate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Advanced':
        return 'text-stone-700 bg-stone-100 border-stone-200';
      default:
        return 'text-stone-700 bg-stone-100 border-stone-200';
    }
  };

  return (
    <section id="challenges" className="py-24 bg-[#F7F7EF]/50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <SectionHeading
            kicker="Gamified Student Action"
            title="Campus Eco Challenges"
            subtitle="Engage in weekly environmental quests, track sustainable habits, earn demo sustainability badges, and inspire fellow students."
            className="mb-0 md:mb-0"
          />

          <div className="mt-4 md:mt-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-[#737D73] max-w-sm">
            <Info className="w-4 h-4 text-[#7DAA65] shrink-0" />
            <span>Habit tracking runs locally in browser storage for demonstration.</span>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecoChallenges.map((challenge) => {
            const isJoined = joinedChallenges.includes(challenge.id);

            return (
              <div
                key={challenge.id}
                className="bg-[#FCFCF8] rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#737D73]">
                      <Clock className="w-3.5 h-3.5 text-[#7DAA65]" />
                      <span>{challenge.duration}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-[#173F35] mb-2 leading-snug">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-[#737D73] leading-relaxed mb-6">
                    {challenge.description}
                  </p>

                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-[#F7F7EF] border border-stone-200/60 text-xs text-[#173F35] mb-6">
                    <Trophy className="w-4 h-4 text-[#987653] shrink-0" />
                    <span>Reward Badge: <strong>{challenge.badge}</strong> ({challenge.points} pts)</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedChallenge(challenge)}
                      className="text-xs font-semibold text-[#7DAA65] hover:text-[#173F35] transition-colors cursor-pointer"
                    >
                      Instructions & Checklist
                    </button>

                    <button
                      onClick={() => toggleJoinChallenge(challenge.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        isJoined
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-[#173F35] text-white hover:bg-[#244F3D]'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C7E7A1]" />
                          <span>Active Quest</span>
                        </>
                      ) : (
                        <>
                          <span>Join Challenge</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Guide Modal */}
      <Modal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        title={selectedChallenge?.title || 'Challenge Guidelines'}
      >
        {selectedChallenge && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#737D73] border-b border-stone-200 pb-3">
              <span>Duration: {selectedChallenge.duration}</span>
              <span>·</span>
              <span>Level: {selectedChallenge.difficulty}</span>
              <span>·</span>
              <span>Reward Badge: {selectedChallenge.badge}</span>
            </div>

            <p className="text-base text-[#202C25] leading-relaxed">
              {selectedChallenge.description}
            </p>

            <div>
              <h4 className="font-serif text-sm font-semibold text-[#173F35] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7DAA65]" />
                Daily Checklist & Rules
              </h4>
              <ul className="space-y-2">
                {selectedChallenge.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#202C25]">
                    <span className="w-5 h-5 rounded-full bg-[#C7E7A1]/50 text-[#173F35] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7EF] border border-stone-200 text-xs text-[#737D73]">
              <strong>Demo Participation Notice:</strong> This activity is a student-led initiative. Progress is persisted locally in your browser session for personal goal-tracking.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-stone-200 text-[#173F35] hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toggleJoinChallenge(selectedChallenge.id);
                  setSelectedChallenge(null);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors cursor-pointer ${
                  joinedChallenges.includes(selectedChallenge.id)
                    ? 'bg-stone-600 hover:bg-stone-700'
                    : 'bg-[#173F35] hover:bg-[#244F3D]'
                }`}
              >
                {joinedChallenges.includes(selectedChallenge.id)
                  ? 'Leave Quest'
                  : 'Start Challenge Now'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
