import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#technology', label: 'Tech' },
    { href: '#team', label: 'Our Team' },
    { href: '#events', label: 'Events' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#impact', label: 'Eco Impact' },
    { href: '#tips', label: 'Tips' },
    { href: '#challenges', label: 'Challenges' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FCFCF8]/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
            aria-label="Eco Club Home"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                isScrolled
                  ? 'bg-[#173F35] text-[#C7E7A1]'
                  : 'bg-white/90 backdrop-blur-sm text-[#173F35]'
              }`}
            >
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
            <div className="flex flex-col">
              <span
                className={`font-serif text-xl font-bold tracking-tight transition-colors ${
                  isScrolled ? 'text-[#173F35]' : 'text-white drop-shadow-sm'
                }`}
              >
                ECO CLUB
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                    isScrolled
                      ? isActive
                        ? 'text-[#173F35] font-semibold'
                        : 'text-stone-600 hover:text-[#173F35]'
                      : isActive
                      ? 'text-white font-semibold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isScrolled ? 'bg-[#7DAA65]' : 'bg-[#C7E7A1]'
                      }`}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className={`hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  isScrolled
                    ? 'text-stone-600 hover:text-[#173F35] hover:bg-stone-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Secure Admin Console"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            <a
              href="#join-us"
              onClick={(e) => handleNavClick(e, '#join-us')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm ${
                isScrolled
                  ? 'bg-[#173F35] text-[#F7F7EF] hover:bg-[#244F3D]'
                  : 'bg-[#C7E7A1] text-[#173F35] hover:bg-[#b8dc92]'
              }`}
            >
              <span>Join Us</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-[#173F35] hover:bg-stone-100'
                  : 'text-white bg-black/20 backdrop-blur-sm hover:bg-black/30'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[68px] bg-[#FCFCF8] border-b border-stone-200 shadow-xl px-6 py-6 transition-all duration-300 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F7F7EF] text-[#173F35] font-semibold'
                      : 'text-stone-700 hover:text-[#173F35] hover:bg-[#F7F7EF]/50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <a
                href="#join-us"
                onClick={(e) => handleNavClick(e, '#join-us')}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#173F35] rounded-xl hover:bg-[#244F3D] transition-colors"
              >
                <span>Be the Change · Join Us</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#173F35] bg-[#F7F7EF] hover:bg-stone-200 rounded-xl transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
