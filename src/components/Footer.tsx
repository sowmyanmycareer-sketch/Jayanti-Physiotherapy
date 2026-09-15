import React from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { 
  Activity, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ExternalLink, 
  ShieldCheck,
  Compass,
  Brain,
  Sliders,
  Calendar
} from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Clinic Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-white tracking-tight block">
                  Jayanti Physiotherapy
                </span>
                <span className="text-[11px] text-teal-400 font-medium tracking-wide">
                  Clinic & 3D Rehabilitation Center
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Premier physical therapy and spinal rehabilitation center in Bengaluru. 
              Combining state-of-the-art electrotherapy, laser therapy, and advanced 
              biomechanical manual therapy to restore pain-free, active living.
            </p>

            {/* Google Rating Mini Card */}
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-bold text-white">5.0 ★</div>
              <div className="text-[11px]">
                <span className="text-amber-400 font-semibold block">251 Google Reviews</span>
                <span className="text-slate-400">100% Verified Patients</span>
              </div>
            </div>
          </div>

          {/* Col 3: Interactive 3D Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              3D & AI Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero-3d" className="hover:text-teal-400 flex items-center gap-1.5 transition-colors">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span>3D Vertebral Column</span>
                </a>
              </li>
              <li>
                <a href="#anatomy-viewer" className="hover:text-teal-400 flex items-center gap-1.5 transition-colors">
                  <Brain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3D Body Joint Explorer</span>
                </a>
              </li>
              <li>
                <a href="#spine-rom" className="hover:text-teal-400 flex items-center gap-1.5 transition-colors">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Spine Kinematics & ROM</span>
                </a>
              </li>
              <li>
                <a href="#clinic-tour" className="hover:text-teal-400 flex items-center gap-1.5 transition-colors">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>360° Photosphere Tour</span>
                </a>
              </li>
              <li>
                <a href="#ai-checker" className="hover:text-teal-400 flex items-center gap-1.5 transition-colors">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gemini 3.5 AI Diagnostic</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Clinical Treatments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Specialized Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#treatments" className="hover:text-teal-400">Cervical & Lumbar Traction</a></li>
              <li><a href="#treatments" className="hover:text-teal-400">Class IV Laser Therapy</a></li>
              <li><a href="#treatments" className="hover:text-teal-400">Matrix Rhythm Therapy</a></li>
              <li><a href="#treatments" className="hover:text-teal-400">Post-Surgical TKR Rehab</a></li>
              <li><a href="#treatments" className="hover:text-teal-400">Sports Ligament Conditioning</a></li>
              <li><a href="#treatments" className="hover:text-teal-400">Neurological Hemiplegia Care</a></li>
            </ul>
          </div>

          {/* Col 5: Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Clinic Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Between Bharat Petrol Pump & Sangeetha Mobile, 26, 7th Cross Rd, Dasarahalli, Bengaluru 560056
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phone}`} className="hover:text-white font-mono">
                  {CLINIC_INFO.displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Mon–Sat: 8 AM–1:30 PM & 4:30 PM–9 PM</span>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment Slot</span>
            </button>
          </div>

        </div>

        {/* Clinical Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 space-y-3">
          <p className="text-[11px] text-slate-300 leading-relaxed text-center sm:text-left">
            <strong className="text-slate-200">Clinical & AI Guidance Disclaimer:</strong> The 3D biomechanical animations and 
            Gemini 3.5 thinking AI recovery planner are provided for patient education and preliminary insights. They do not constitute 
            a substitute for an in-person physical examination. Patients are strongly advised to undergo physical evaluation at 
            Jayanti Physiotherapy Clinic or consult a certified medical practitioner before initiating rigorous exercise routines.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300 pt-2">
            <div>
              © {new Date().getFullYear()} Jayanti Physiotherapy Clinic. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a 
                href={CLINIC_INFO.googleMapsDirectionsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-400 flex items-center gap-1"
              >
                <span>Google Maps Location</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href={CLINIC_INFO.googleReviewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-400 flex items-center gap-1"
              >
                <span>Google Reviews</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
