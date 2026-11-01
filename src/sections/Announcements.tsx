import React, { useState } from 'react';
import { Calendar, ArrowRight, Bell } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Modal } from '../components/Modal';
import { announcements } from '../data/announcements';
import { Announcement } from '../types';

export const AnnouncementsSection: React.FC = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const getPriorityStyle = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Opportunity':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      default:
        return 'text-stone-700 bg-stone-100 border-stone-200';
    }
  };

  return (
    <section id="announcements" className="py-20 bg-[#F7F7EF]/50 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            kicker="Campus Bulletin"
            title="Latest Announcements & Calls"
            subtitle="Stay informed about active recruitment drives, weekend field expeditions, and campus ecological milestones."
            className="mb-0 md:mb-0"
          />
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-[#737D73]">
            <Bell className="w-4 h-4 text-[#7DAA65]" />
            <span>Updated weekly by the Media Desk</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#FCFCF8] border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority === 'High' ? 'Important Notice' : item.priority === 'Opportunity' ? 'Volunteer Call' : 'Bulletin'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#737D73]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#173F35] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[#737D73] leading-relaxed mb-6">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={() => setSelectedAnnouncement(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244F3D] hover:text-[#7DAA65] transition-colors cursor-pointer"
                >
                  <span>Read Full Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {item.ctaText && (
                  <a
                    href={item.ctaLink || '#join-us'}
                    className="text-xs font-medium text-[#173F35] hover:underline"
                  >
                    {item.ctaText} &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Detail Modal */}
      <Modal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.title || 'Notice Details'}
      >
        {selectedAnnouncement && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs text-[#737D73] border-b border-stone-200 pb-3">
              <span>Published: {selectedAnnouncement.date}</span>
              <span>·</span>
              <span className="capitalize">{selectedAnnouncement.priority} Priority Bulletin</span>
            </div>

            <p className="text-base text-[#202C25] leading-relaxed">
              {selectedAnnouncement.details}
            </p>

            <div className="p-4 rounded-xl bg-[#F7F7EF] border border-stone-200 text-xs text-[#737D73]">
              <strong className="text-[#173F35] font-semibold block mb-1">
                Notice Verification
              </strong>
              Issued by the Eco Club Communications Office under faculty advisement. For queries regarding this dispatch, reach out through the contact portal below.
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-stone-200 text-[#173F35] hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedAnnouncement.ctaLink && (
                <a
                  href={selectedAnnouncement.ctaLink}
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors"
                >
                  {selectedAnnouncement.ctaText || 'Proceed'}
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
