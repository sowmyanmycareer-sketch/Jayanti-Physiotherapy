import React from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Compass, 
  CheckCircle2,
  Building2,
  Fuel,
  Smartphone
} from 'lucide-react';

export const LocationDirections: React.FC = () => {
  return (
    <section id="location" className="py-16 md:py-24 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            Visit Our Bengaluru Clinic
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Prime Location in <span className="text-teal-400">Dasarahalli</span>, Bengaluru
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Conveniently situated on 7th Cross Road, situated right between Bharat Petrol Pump 
            and Sangeetha Mobile Store. Easy accessibility and parking available.
          </p>
        </div>

        {/* Grid: Details & Landmarks vs Map Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Location & Contact Cards */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Address Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center shrink-0 text-teal-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Jayanti Physiotherapy Clinic Address
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {CLINIC_INFO.address}
                  </p>
                </div>
              </div>

              {/* Landmark Callouts */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                  Key Visual Landmarks:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-200">
                    <Fuel className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Between Bharat Petrol Pump</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-200">
                    <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>And Sangeetha Mobile Store</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                Clinic Consultation Timings
              </h3>
              <div className="space-y-2">
                {CLINIC_INFO.hours.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-slate-200">{h.days}</span>
                    <span className="text-teal-400 font-mono">{h.time}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                * Prior appointment recommended to minimize waiting time in the consultation lounge.
              </p>
            </div>

            {/* Direct Quick Contact */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left space-y-1 group transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                  <Phone className="w-4 h-4" />
                  <span>Call Reception</span>
                </div>
                <div className="text-xs text-slate-300 font-mono group-hover:text-white">
                  {CLINIC_INFO.displayPhone}
                </div>
              </a>

              <a
                href={`https://wa.me/${CLINIC_INFO.whatsapp}?text=Hello%20Jayanti%20Physiotherapy%20Clinic,%20I%20need%20directions%20and%20an%20appointment.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-left space-y-1 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </div>
                <div className="text-xs text-slate-300">
                  Instant Support
                </div>
              </a>
            </div>

          </div>

          {/* Right: Interactive Directions & Visual Map */}
          <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            
            {/* Visual Map Representation */}
            <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
              
              {/* Stylized road & landmark map schematic */}
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Road */}
                  <line x1="10%" y1="65%" x2="90%" y2="65%" stroke="#0d9488" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
                  <line x1="50%" y1="20%" x2="50%" y2="90%" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </div>

              {/* Landmark Pins */}
              <div className="relative z-10 w-full max-w-sm space-y-3 text-center">
                {/* Clinic Pin */}
                <div className="inline-flex items-center gap-2 bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-2xl shadow-xl shadow-teal-500/40 animate-bounce">
                  <MapPin className="w-5 h-5 fill-slate-950" />
                  <span className="text-xs font-display">Jayanti Physiotherapy Clinic (No. 26)</span>
                </div>

                <div className="flex justify-between text-xs px-2 pt-4 text-slate-300">
                  <div className="bg-slate-900/90 border border-orange-500/40 px-3 py-1.5 rounded-xl text-orange-300 font-medium">
                    ← Bharat Petrol Pump
                  </div>
                  <div className="bg-slate-900/90 border border-blue-500/40 px-3 py-1.5 rounded-xl text-blue-300 font-medium">
                    Sangeetha Mobile →
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-mono pt-2">
                  7th Cross Rd, Dasarahalli, Jnana Ganga Nagar 560056
                </p>
              </div>

            </div>

            {/* Turn-by-Turn Actions */}
            <div className="space-y-3">
              <a
                href={CLINIC_INFO.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Driving / Walking Directions in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={CLINIC_INFO.googleStreetviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Open Google 360° Street View & Photosphere</span>
              </a>
            </div>

            {/* Commute Tips */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Easy Commute Options:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-400">
                <li>Buses available towards Dasarahalli & Jnananjyothinagar.</li>
                <li>Auto & Cab pickup/drop directly outside Sangeetha Mobile Store.</li>
                <li>Dedicated two-wheeler and patient car parking right in front of Clinic No. 26.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
