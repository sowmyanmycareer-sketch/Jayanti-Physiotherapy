/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero3D } from './components/Hero3D';
import { Anatomy3DViewer } from './components/Anatomy3DViewer';
import { SpineRangeOfMotion3D } from './components/SpineRangeOfMotion3D';
import { ClinicPhotosphere3D } from './components/ClinicPhotosphere3D';
import { AiRecoveryPlanner } from './components/AiRecoveryPlanner';
import { TreatmentsSection } from './components/TreatmentsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationDirections } from './components/LocationDirections';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BodyRegionId } from './types';
import { CLINIC_INFO } from './data/clinicData';
import { Phone, MessageCircle, Calendar, Sparkles } from 'lucide-react';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState('Comprehensive Initial Assessment');
  const [activeRegionForAi, setActiveRegionForAi] = useState<BodyRegionId>('lumbar-spine');

  const handleOpenBooking = (treatmentTitle?: string) => {
    if (treatmentTitle) {
      setSelectedTreatment(treatmentTitle);
    }
    setIsBookingOpen(true);
  };

  const handleSelectRegionFromAnatomy = (regionId: BodyRegionId) => {
    setActiveRegionForAi(regionId);
    // Smooth scroll to AI section
    const elem = document.getElementById('ai-checker');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Sticky Top Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main>
        {/* 1. Interactive 3D Spine & Hero */}
        <Hero3D onOpenBooking={() => handleOpenBooking()} />

        {/* 2. Interactive 3D Human Anatomy Joint Explorer */}
        <Anatomy3DViewer onSelectRegionForAi={handleSelectRegionFromAnatomy} />

        {/* 3. 3D Spine Range-of-Motion (ROM) & Biomechanics Simulator */}
        <SpineRangeOfMotion3D />

        {/* 4. Google 360° Photosphere Virtual Clinic Tour */}
        <ClinicPhotosphere3D />

        {/* 5. Gemini 3.5 Thinking AI Diagnostic & Rehabilitation Planner */}
        <AiRecoveryPlanner 
          initialRegionId={activeRegionForAi} 
          onOpenBooking={() => handleOpenBooking()} 
        />

        {/* 6. Comprehensive Clinical Treatments */}
        <TreatmentsSection onSelectTreatmentForBooking={handleOpenBooking} />

        {/* 7. 5.0 Star Verified Patient Reviews (251 Google Reviews) */}
        <ReviewsSection />

        {/* 8. Clinic Location, Street Landmarks & Directions */}
        <LocationDirections />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Consultation Booking Modal Dialog */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        preselectedTreatment={selectedTreatment} 
      />

      {/* Floating Bottom Quick Action Bar (Mobile & Desktop) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-2xl flex items-center justify-between gap-2">
        <a
          href={`tel:${CLINIC_INFO.phone}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          title="Call Jayanti Clinic"
        >
          <Phone className="w-3.5 h-3.5 text-teal-400" />
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${CLINIC_INFO.whatsapp}?text=Hello%20Jayanti%20Physiotherapy%20Clinic,%20I%20would%20like%20to%20inquire%20about%20a%20consultation.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-900/80 transition-colors"
          title="WhatsApp Jayanti Clinic"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => handleOpenBooking()}
          className="flex-[1.5] py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Visit</span>
        </button>
      </div>
    </div>
  );
}

