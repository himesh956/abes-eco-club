import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Send, Shield } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { JoinApplication } from '../types';
import { submitApplication } from '../services/admin.service';

export const JoinUs: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    collegeEmail: '',
    studentId: '',
    department: '',
    academicYear: '1st Year',
    interestedTeam: 'Environment Team',
    reasonToJoin: '',
    skills: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<JoinApplication | null>(null);

  const teamOptions = [
    'Environment Team',
    'Tech Team',
    'Event Management',
    'Social Media',
    'Creative Team',
  ];

  const yearOptions = [
    '1st Year (Freshman)',
    '2nd Year (Sophomore)',
    '3rd Year (Junior)',
    '4th Year (Senior)',
    'Postgraduate / Research Scholar',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Please enter at least 3 characters';
    }

    if (!formData.collegeEmail.trim()) {
      errs.collegeEmail = 'College Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.collegeEmail)) {
      errs.collegeEmail = 'Please provide a valid email format';
    }

    if (!formData.department.trim()) {
      errs.department = 'Department / Major is required';
    }

    if (!formData.reasonToJoin.trim()) {
      errs.reasonToJoin = 'Please share your motivation for joining Eco Club';
    } else if (formData.reasonToJoin.trim().length < 20) {
      errs.reasonToJoin = 'Please provide at least 20 characters of detail';
    }

    if (!formData.skills.trim()) {
      errs.skills = 'Please mention your relevant skills or interests';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const app = await submitApplication({
        fullName: formData.fullName.trim(),
        collegeEmail: formData.collegeEmail.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        academicYear: formData.academicYear,
        interestedTeam: formData.interestedTeam,
        reasonToJoin: formData.reasonToJoin.trim(),
        skills: formData.skills.trim(),
      });

      setSubmittedApp(app);
    } catch (err) {
      console.error(err);
      alert('Application could not be saved to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedApp(null);
    setFormData({
      fullName: '',
      collegeEmail: '',
      studentId: '',
      department: '',
      academicYear: '1st Year',
      interestedTeam: 'Environment Team',
      reasonToJoin: '',
      skills: '',
    });
    setErrors({});
  };

  return (
    <section id="join-us" className="py-24 bg-[#FCFCF8] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Student Recruitment"
          title="Be the Change. Join Our Movement."
          subtitle="Whether you cultivate native tree seedlings, program IoT environmental telemetry, or produce visual storytelling, there is a vital place for your talents in the Eco Club."
          centered
        />

        <div className="bg-[#FCFCF8] border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-lg">
          {submittedApp ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#C7E7A1] text-[#173F35] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-3xl font-semibold text-[#173F35]">
                Application Successfully Logged!
              </h3>
              <p className="text-base text-[#202C25] max-w-xl mx-auto leading-relaxed">
                Thank you, <strong>{submittedApp.fullName}</strong>. Your expression of interest for the <strong>{submittedApp.interestedTeam}</strong> has been saved in demo simulation storage.
              </p>

              <div className="p-4 rounded-2xl bg-[#F7F7EF] border border-stone-200 text-xs text-[#737D73] text-left max-w-lg mx-auto space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#173F35]">Application Ref:</span>
                  <span className="font-mono">{submittedApp.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#173F35]">College Email:</span>
                  <span>{submittedApp.collegeEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#173F35]">Department & Year:</span>
                  <span>{submittedApp.department} ({submittedApp.academicYear})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#173F35]">Submitted:</span>
                  <span>{submittedApp.submittedAt}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 max-w-lg mx-auto flex items-start gap-2 text-left">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Demo Mode Notice:</strong> In this showcase application, submissions are safely stored locally in your browser storage. Connect MongoDB / REST endpoint in production to receive live applicant emails.
                </span>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleResetForm}
                  className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] transition-colors cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Jordan Rivera"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-stone-200 focus:ring-[#7DAA65]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                    College Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.collegeEmail}
                    onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
                    placeholder="e.g. j.rivera@campus.edu"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                      errors.collegeEmail
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-stone-200 focus:ring-[#7DAA65]'
                    }`}
                  />
                  {errors.collegeEmail && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.collegeEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Academic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                    Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g. CS-2024-089"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7DAA65]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                    Department / Major <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Environmental Science"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                      errors.department
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-stone-200 focus:ring-[#7DAA65]'
                    }`}
                  />
                  {errors.department && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7DAA65] cursor-pointer"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Team Preference */}
              <div>
                <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                  Interested Team Division <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {teamOptions.map((team) => (
                    <button
                      type="button"
                      key={team}
                      onClick={() => setFormData({ ...formData, interestedTeam: team })}
                      className={`p-3 text-xs font-medium rounded-xl border text-left transition-all cursor-pointer ${
                        formData.interestedTeam === team
                          ? 'bg-[#173F35] text-white border-[#173F35] shadow-xs'
                          : 'bg-[#F7F7EF] text-[#202C25] border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                  Why do you want to join Eco Club? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.reasonToJoin}
                  onChange={(e) => setFormData({ ...formData, reasonToJoin: e.target.value })}
                  placeholder="Share what inspires your passion for sustainability and what you hope to accomplish together on campus..."
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                    errors.reasonToJoin
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-stone-200 focus:ring-[#7DAA65]'
                  }`}
                />
                {errors.reasonToJoin && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.reasonToJoin}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-[#173F35] mb-1.5">
                  Relevant Skills & Interests <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Gardening, Soil Testing, React/TypeScript, Photography, Event Logistics"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                    errors.skills
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-stone-200 focus:ring-[#7DAA65]'
                  }`}
                />
                {errors.skills && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.skills}
                  </p>
                )}
              </div>

              {/* Privacy Note */}
              <div className="p-3.5 rounded-xl bg-[#F7F7EF] border border-stone-200 text-xs text-[#737D73] flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#7DAA65] shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Commitment:</strong> Submitted applicant details are utilized strictly for student club volunteer allocation and coordination. Data is stored securely and never shared with commercial entities.
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl bg-[#173F35] text-white hover:bg-[#244F3D] transition-all transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Logging Application...</span>
                  ) : (
                    <>
                      <span>Submit Membership Application</span>
                      <Send className="w-4 h-4 text-[#C7E7A1]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
