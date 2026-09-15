import React from 'react';
import { CLINIC_SERVICES } from '../data/clinicData';
import { 
  Activity, 
  Zap, 
  Brain, 
  ShieldCheck, 
  HeartPulse, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface TreatmentsSectionProps {
  onSelectTreatmentForBooking: (treatmentTitle: string) => void;
}

export const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({ 
  onSelectTreatmentForBooking 
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-6 h-6 text-teal-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'Brain': return <Brain className="w-6 h-6 text-purple-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-rose-400" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-amber-400" />;
      case 'Users': return <Users className="w-6 h-6 text-emerald-400" />;
      default: return <Activity className="w-6 h-6 text-teal-400" />;
    }
  };

  return (
    <section id="treatments" className="py-16 md:py-24 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            Specialized Clinical Physical Therapy
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Evidence-Based Treatments at <span className="text-teal-400">Jayanti Clinic</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Targeting the root biomechanical source of pain through computerized modalities, 
            manual mobilization techniques, and neuro-muscular retraining.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLINIC_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-teal-950/40 relative overflow-hidden"
            >
              {/* Background ambient corner gradient */}
              <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${service.color} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-teal-500/40 transition-colors">
                  {getIcon(service.icon)}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Modality Tags */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Core Clinical Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.modalities.map((mod, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-medium"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-6 mt-4 border-t border-slate-800/80 relative z-10">
                <button
                  onClick={() => onSelectTreatmentForBooking(service.title)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-teal-500 hover:text-slate-950 border border-slate-800 hover:border-teal-400 text-teal-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation for this Care</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              Not sure which treatment matches your condition?
            </h4>
            <p className="text-xs text-slate-300">
              Our Senior Physiotherapist conducts a thorough 45-minute physical & orthopaedic biomechanical examination.
            </p>
          </div>
          <button
            onClick={() => onSelectTreatmentForBooking('Comprehensive Initial Assessment')}
            className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors cursor-pointer"
          >
            Schedule Assessment Slot
          </button>
        </div>

      </div>
    </section>
  );
};
