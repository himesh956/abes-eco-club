import React, { useState } from 'react';
import { Mail, MapPin, Phone, Instagram, Linkedin, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ContactMessage } from '../types';
import { submitContactMessage } from '../services/admin.service';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<ContactMessage | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errs.message = 'Message cannot be empty';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide a message with at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const msg = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setSubmittedMessage(msg);
    } catch (err) {
      console.error(err);
      alert('Unable to dispatch message to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedMessage(null);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <section id="contact" className="py-24 bg-[#F7F7EF]/60 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Get in Touch"
          title="Connect with Our Campus Hub"
          subtitle="Have questions regarding upcoming sapling drives, campus green audits, student research collaborations, or visiting our nursery? Send us a dispatch."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Social Links */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#FCFCF8] p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-semibold text-[#173F35]">
                Eco Club Secretariat
              </h3>

              <div className="space-y-5 text-sm text-[#202C25]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F7EF] text-[#244F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#173F35] font-semibold">Campus Office</strong>
                    <span className="text-[#737D73]">
                      Green Innovation Pavilion, Room 102<br />
                      East Botanical Quad, University Main Campus
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F7EF] text-[#244F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#173F35] font-semibold">Official Club Email</strong>
                    <span className="text-[#737D73] font-mono text-xs">
                      ecoclub.secretariat@campus.edu.demo
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F7EF] text-[#244F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#173F35] font-semibold">Helpline & Volunteer Desk</strong>
                    <span className="text-[#737D73]">
                      +1 (555) 234-ECO-HELP (Demo Line)
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-stone-100">
                <span className="text-xs uppercase tracking-wider text-[#737D73] font-semibold block mb-3">
                  Follow Our Fieldwork
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#F7F7EF] border border-stone-200 flex items-center justify-center text-[#173F35] hover:bg-[#173F35] hover:text-white transition-colors"
                    aria-label="Eco Club Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#F7F7EF] border border-stone-200 flex items-center justify-center text-[#173F35] hover:bg-[#173F35] hover:text-white transition-colors"
                    aria-label="Eco Club LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:ecoclub.secretariat@campus.edu.demo"
                    className="w-10 h-10 rounded-xl bg-[#F7F7EF] border border-stone-200 flex items-center justify-center text-[#173F35] hover:bg-[#173F35] hover:text-white transition-colors"
                    aria-label="Eco Club Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F7EF] border border-stone-200 text-xs text-[#737D73] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#7DAA65] shrink-0 mt-0.5" />
                <span>
                  <strong>Placeholder Notice:</strong> Contact details represent prototype sample placeholders. Replace with actual university department rooms and verified student guild contacts.
                </span>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FCFCF8] p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm">
              <h3 className="font-serif text-2xl font-semibold text-[#173F35] mb-2">
                Send a Message to the Committee
              </h3>
              <p className="text-sm text-[#737D73] mb-6">
                Fill in the form below and our student coordinators will reply within 48 campus hours.
              </p>

              {submittedMessage ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#C7E7A1] text-[#173F35] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#173F35]" />
                  </div>
                  <h4 className="font-serif text-2xl font-semibold text-[#173F35]">
                    Message Saved in Demo Mode!
                  </h4>
                  <p className="text-sm text-[#737D73] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{submittedMessage.name}</strong>. Your inquiry regarding &ldquo;{submittedMessage.subject}&rdquo; has been safely logged in local demo storage.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-2.5 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors cursor-pointer"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Taylor Reed"
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                          errors.name
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-stone-200 focus:ring-[#7DAA65]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. taylor.reed@campus.edu"
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-stone-200 focus:ring-[#7DAA65]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Inquiry regarding Saturday Plantation Drive"
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                        errors.subject
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-stone-200 focus:ring-[#7DAA65]'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Type your message, query, or campus initiative proposal..."
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                        errors.message
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-stone-200 focus:ring-[#7DAA65]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] transition-all transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Sending Dispatch...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4 text-[#C7E7A1]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
