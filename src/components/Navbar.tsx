import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { 
  Calendar, 
  Star, 
  Menu, 
  X, 
  Sparkles,
  Activity,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onNavigateToAI?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onNavigateToAI }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: '3D Anatomy', href: '#3d-anatomy' },
    { name: '360° Tour', href: '#clinic-tour' },
    { name: 'Spine Biomechanics', href: '#spine-rom' },
    { name: 'AI Symptom Check', href: '#ai-checker', isAI: true },
    { name: 'Treatments', href: '#treatments' },
    { name: 'Reviews (5.0★)', href: '#reviews' },
    { name: 'Location', href: '#location' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight group-hover:text-teal-400 transition-colors whitespace-nowrap">
                  Jayanti Physiotherapy
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  5.0 (251)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Advanced 3D Biomechanics & Rehabilitation Center
              </p>
            </div>
          </a>

          {/* Desktop Nav Links - Perfectly Centered and Spaced */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  link.isAI 
                    ? 'text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 bg-teal-950/40 border border-teal-500/20' 
                    : 'hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {link.isAI && <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />}
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition-all shadow-md shadow-teal-500/20 cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu trigger & mini book button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
            <span>Jayanti Physiotherapy Clinic</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" /> 5.0 (251 reviews)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl transition-colors ${
                  link.isAI 
                    ? 'bg-teal-950/60 text-teal-300 border border-teal-500/30 flex items-center gap-2' 
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {link.isAI && <Sparkles className="w-4 h-4 text-teal-400" />}
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
