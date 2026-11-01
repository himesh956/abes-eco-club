import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeading } from '../components/SectionHeading';
import { Modal } from '../components/Modal';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ecoEvents as defaultEvents } from '../data/events';
import { EcoEvent, EventStatus } from '../types';
import { submitEventRegistration } from '../services/admin.service';

interface EventsProps {
  events?: EcoEvent[];
}

export const Events: React.FC<EventsProps> = ({ events = defaultEvents }) => {
  const [activeTab, setActiveTab] = useState<'All' | EventStatus>('All');
  const [selectedEvent, setSelectedEvent] = useState<EcoEvent | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<EcoEvent | null>(null);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const filteredEvents =
    activeTab === 'All'
      ? events
      : events.filter((event) => event.status === activeTab);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      if (registeringEvent) {
        await submitEventRegistration({
          eventId: registeringEvent.id,
          eventTitle: registeringEvent.title,
          name: formData.name.trim(),
          email: formData.email.trim(),
          studentId: formData.studentId.trim(),
          notes: formData.notes.trim(),
        });
      }
      setRegisteredSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Registration could not be recorded. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeRegistrationModal = () => {
    setRegisteringEvent(null);
    setRegisteredSuccess(false);
    setFormData({ name: '', email: '', studentId: '', notes: '' });
    setFormErrors({});
  };

  return (
    <section id="events" className="py-24 bg-[#F7F7EF]/60 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <SectionHeading
            kicker="Participate & Restore"
            title="Events & Campus Drives"
            subtitle="Get involved in on-ground plantation drives, sustainability workshops, campus cleanups, and green innovation hackathons."
            className="mb-0 md:mb-0"
          />

          {/* Tab Filter Control */}
          <div className="mt-6 md:mt-0 flex items-center p-1 bg-stone-200/70 rounded-xl">
            {(['All', 'Upcoming', 'Ongoing', 'Past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white text-[#173F35] shadow-xs'
                    : 'text-[#737D73] hover:text-[#173F35]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FCFCF8] rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Event Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                  <ImageWithFallback
                    src={event.imageUrl}
                    alt={event.title}
                    fallbackText={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-md ${
                        event.status === 'Upcoming'
                          ? 'bg-[#173F35]/85 text-[#C7E7A1]'
                          : event.status === 'Ongoing'
                          ? 'bg-emerald-700/85 text-white'
                          : 'bg-stone-800/80 text-stone-200'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/90 text-[#173F35] backdrop-blur-sm">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Event Summary Body */}
                <div className="p-6">
                  <div className="space-y-1.5 text-xs text-[#737D73] mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#7DAA65] shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7DAA65] shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#7DAA65] shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-[#173F35] leading-snug mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#737D73] leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3 border-t border-stone-100">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="text-xs font-semibold text-[#173F35] hover:text-[#7DAA65] transition-colors cursor-pointer"
                >
                  View Details
                </button>

                {event.registrationOpen ? (
                  <button
                    onClick={() => setRegisteringEvent(event)}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors cursor-pointer"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-xs text-stone-400 font-medium">Completed</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <ImageWithFallback
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F7F7EF] text-xs text-[#202C25]">
              <div>
                <strong className="text-[#173F35] block mb-0.5">Date & Time</strong>
                <span>{selectedEvent.date} · {selectedEvent.time}</span>
              </div>
              <div>
                <strong className="text-[#173F35] block mb-0.5">Location</strong>
                <span>{selectedEvent.location}</span>
              </div>
              <div>
                <strong className="text-[#173F35] block mb-0.5">Category & Status</strong>
                <span>{selectedEvent.category} ({selectedEvent.status})</span>
              </div>
              <div>
                <strong className="text-[#173F35] block mb-0.5">Capacity / Attendance</strong>
                <span>{selectedEvent.registeredCount} / {selectedEvent.maxAttendees} volunteers</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold text-[#173F35] mb-2">Program Overview</h4>
              <p className="text-sm text-[#202C25] leading-relaxed">
                {selectedEvent.fullDetails}
              </p>
            </div>

            {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#173F35] mb-2">Participant Checklist</h4>
                <ul className="space-y-1.5 text-xs text-[#737D73]">
                  {selectedEvent.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7DAA65]" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <span className="text-xs text-[#737D73]">Sample College Event</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-stone-200 text-[#173F35] hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  Close
                </button>
                {selectedEvent.registrationOpen && (
                  <button
                    onClick={() => {
                      const ev = selectedEvent;
                      setSelectedEvent(null);
                      setRegisteringEvent(ev);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors cursor-pointer"
                  >
                    Proceed to Register
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Event Registration Form Modal */}
      <Modal
        isOpen={!!registeringEvent}
        onClose={closeRegistrationModal}
        title={`Register: ${registeringEvent?.title || 'Eco Initiative'}`}
      >
        {registeredSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#C7E7A1] text-[#173F35] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#173F35]" />
            </div>
            <h4 className="font-serif text-2xl font-semibold text-[#173F35]">
              Demo Registration Confirmed!
            </h4>
            <p className="text-sm text-[#737D73] max-w-md mx-auto leading-relaxed">
              Thank you for registering for <strong>{registeringEvent?.title}</strong>. Your participation details have been saved locally in demo mode.
            </p>
            <p className="text-xs text-stone-500 italic">
              Note: This is a front-end simulation for the Eco Club showcase. No actual emails have been dispatched.
            </p>
            <button
              onClick={closeRegistrationModal}
              className="mt-4 px-6 py-2.5 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors cursor-pointer"
            >
              Back to Events
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-[#F7F7EF] border border-stone-200 text-xs text-[#737D73]">
              <strong>Event:</strong> {registeringEvent?.title} ({registeringEvent?.date})
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F35] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  formErrors.name
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-stone-200 focus:ring-[#7DAA65]'
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F35] mb-1">
                College Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. alex.morgan@campus.edu"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  formErrors.email
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-stone-200 focus:ring-[#7DAA65]'
                }`}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F35] mb-1">
                Student ID / Roll Number (Optional)
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="e.g. 2024-ENV-042"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7DAA65]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F35] mb-1">
                Special Dietary or Mobility Requirements (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any equipment needs or allergies..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7DAA65]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={closeRegistrationModal}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-stone-200 text-[#173F35] hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
};
