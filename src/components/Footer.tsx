import React from 'react';
import { ArrowUp, Instagram, Linkedin, Mail, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About Us' },
    { href: '#technology', label: 'Tech Innovation' },
    { href: '#team', label: 'Our Team' },
    { href: '#events', label: 'Events & Drives' },
    { href: '#gallery', label: 'Photo Gallery' },
    { href: '#impact', label: 'Eco Impact Dashboard' },
    { href: '#tips', label: 'Sustainability Tips' },
    { href: '#challenges', label: 'Eco Challenges' },
    { href: '#join-us', label: 'Join Our Movement' },
    { href: '#contact', label: 'Contact Us' },
  ];

  return (
    <footer className="bg-[#173F35] text-stone-300 pt-16 pb-12 border-t border-[#244F3D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Vision Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#244F3D] text-[#C7E7A1] flex items-center justify-center">
                <svg
                  className="w-5 h-5 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ECO CLUB
              </span>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed max-w-sm">
              &ldquo;Together, We Grow a Greener Tomorrow.&rdquo;
            </p>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An active student-led environmental organization committed to campus rewilding, waste circularity, clean energy advocacy, and community conservation.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#C7E7A1] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#C7E7A1] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:ecoclub.secretariat@campus.edu.demo"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#C7E7A1] transition-colors"
                aria-label="Email Secretariat"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7E7A1] mb-4">
              Explore & Navigate
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors py-1 truncate"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Campus Initiatives & Secretariat */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7E7A1] mb-4">
              Campus Headquarters
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Room 102, Green Innovation Pavilion<br />
              East Botanical Quad, Campus Commons
            </p>
            <p className="text-xs text-stone-400">
              Weekly General Assembly: Wednesdays at 05:00 PM
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#C7E7A1] block">
                Official Club Motto:
              </span>
              <span className="text-xs italic text-stone-200">
                Think Green. Act Clean. Live Sustainable.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-4">
            <p>
              &copy; {new Date().getFullYear()} ECO CLUB. Campus Sustainability & Environmental Stewardship.
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[#C7E7A1] hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#C7E7A1]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
