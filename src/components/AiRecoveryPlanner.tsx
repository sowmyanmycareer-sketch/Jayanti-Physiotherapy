import React, { useState, useEffect } from 'react';
import { BODY_REGIONS, CLINIC_INFO } from '../data/clinicData';
import { BodyRegionId, AiRecoveryPlan } from '../types';
import { 
  Brain, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  MessageCircle,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
  Send
} from 'lucide-react';

interface AiRecoveryPlannerProps {
  initialRegionId?: BodyRegionId;
  onOpenBooking: () => void;
}

export const AiRecoveryPlanner: React.FC<AiRecoveryPlannerProps> = ({ 
  initialRegionId = 'lumbar-spine',
  onOpenBooking 
}) => {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegionId>(initialRegionId);
  const [painLevel, setPainLevel] = useState<number>(6);
  const [duration, setDuration] = useState<string>('3 to 6 weeks');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Stiffness in morning',
    'Pain radiating or shooting'
  ]);
  const [aggravatingFactors, setAggravatingFactors] = useState<string>('Prolonged sitting at desk, bending forward');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thinkingStepIndex, setThinkingStepIndex] = useState<number>(0);
  const [plan, setPlan] = useState<AiRecoveryPlan | null>(null);
  const [activePhaseTab, setActivePhaseTab] = useState<number>(1);
  const [showThinkingDetails, setShowThinkingDetails] = useState<boolean>(true);

  // Sync if initialRegionId changes from 3D Anatomy viewer
  useEffect(() => {
    if (initialRegionId) {
      setSelectedRegion(initialRegionId);
    }
  }, [initialRegionId]);

  const symptomOptions = [
    'Stiffness in morning',
    'Pain radiating or shooting',
    'Sharp catch during movement',
    'Dull persistent aching',
    'Pins and needles / Tingling',
    'Weakness when lifting or walking',
    'Clicking / Grinding sensation',
    'Disturbed sleep due to pain'
  ];

  const durationOptions = [
    'Acute (< 1 week)',
    'Sub-acute (1 to 4 weeks)',
    '3 to 6 weeks',
    'Chronic (> 3 months)'
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  // Thinking animation simulation steps
  const simulatedThinkingSteps = [
    'Parsing musculoskeletal vectors & anatomical innervation...',
    'Screening differential diagnoses (facet joint, nerve root tension, disc pathology)...',
    'Auditing safety thresholds & clinical red-flags...',
    'Synthesizing 3-phase kinetic chain mechanotherapy & exercises...'
  ];

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setPlan(null);
    setThinkingStepIndex(0);

    // Progressive thinking ticker
    const interval = setInterval(() => {
      setThinkingStepIndex(prev => (prev + 1) % simulatedThinkingSteps.length);
    }, 900);

    try {
      const response = await fetch('/api/ai-recovery-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyRegion: selectedRegion,
          painLevel,
          duration,
          symptoms: selectedSymptoms,
          aggravatingFactors
        })
      });

      const data = await response.json();
      if (data && data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  // WhatsApp share message
  const generateWhatsAppMessage = () => {
    if (!plan) return '';
    const text = `Hello Jayanti Physiotherapy Clinic, I used your 3D Gemini AI Recovery Planner for my ${selectedRegion.replace('-', ' ')} (Pain ${painLevel}/10). Suspicion: ${plan.primarySuspicion}. I would like to schedule an in-person assessment.`;
    return `https://wa.me/${CLINIC_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="ai-checker" className="py-16 md:py-24 bg-slate-900/40 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 animate-pulse" />
            Gemini 3.5 Thinking AI Diagnostic Model
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Physiotherapy Clinical Reasoning</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Powered by Google Gemini’s deep thinking model. Experience transparent step-by-step 
            clinical biomechanical reasoning, differential screening, and a tailored 3-phase exercise program.
          </p>
        </div>

        {/* Two Column Layout: Diagnostic Input Form vs AI Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-teal-400" />
                Patient Symptom Intake
              </span>
              <span className="text-[11px] text-teal-400 font-semibold bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/30">
                100% Confidential
              </span>
            </div>

            {/* 1. Body Region Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                1. Affected Anatomical Region:
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as BodyRegionId)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-teal-500"
              >
                {BODY_REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* 2. Pain Intensity Slider (1-10) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">2. Current Pain Intensity (VAS 1–10):</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
                  painLevel >= 8 ? 'bg-rose-500/20 text-rose-300' : painLevel >= 5 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {painLevel} / 10 • {painLevel >= 8 ? 'Severe' : painLevel >= 5 ? 'Moderate' : 'Mild'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>1 (Mild discomfort)</span>
                <span>5 (Distracting)</span>
                <span>10 (Severe debilitating)</span>
              </div>
            </div>

            {/* 3. Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                3. Symptom Duration:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDuration(opt)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-medium text-left transition-all cursor-pointer ${
                      duration === opt 
                        ? 'bg-teal-500 text-slate-950 font-bold border-teal-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Hallmark Symptoms Multi-select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                4. Check All Sensation Types:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {symptomOptions.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`text-left p-2 rounded-xl border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-teal-950/80 border-teal-500/50 text-teal-300 font-medium' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-teal-500 border-teal-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </span>
                      <span className="truncate">{sym}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Aggravating Factors */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                5. What Makes It Worse?
              </label>
              <input
                type="text"
                value={aggravatingFactors}
                onChange={(e) => setAggravatingFactors(e.target.value)}
                placeholder="e.g. Sitting over 30 mins, climbing stairs, lifting laptop bag"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Gemini Reasoning in Progress...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 text-slate-950" />
                  <span>Run Gemini 3.5 Clinical Analysis</span>
                </>
              )}
            </button>

          </div>

          {/* Right: AI Output Panel / Thinking Screen */}
          <div className="lg:col-span-7">
            
            {/* Loading State with Thinking Ticker */}
            {isLoading && (
              <div className="bg-slate-950 border border-teal-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6 animate-in fade-in">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-cyan-500/20 border-b-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.8s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-teal-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-teal-950 px-3 py-1 rounded-full border border-teal-500/30 text-teal-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                    Gemini 3.5 Thinking Engine Active
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Synthesizing Clinical Biomechanics
                  </h3>
                  <p className="text-sm font-mono text-cyan-300 min-h-[24px]">
                    {simulatedThinkingSteps[thinkingStepIndex]}
                  </p>
                </div>

                <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                    <Activity className="w-3.5 h-3.5" />
                    Jayanti Clinic Differential Logic:
                  </div>
                  <p>
                    Analyzing {selectedRegion.replace('-', ' ')} kinematics against evidence-based 
                    APTA guidelines and McKenzie Mechanical Diagnosis protocols.
                  </p>
                </div>
              </div>
            )}

            {/* Empty State Before Generation */}
            {!isLoading && !plan && (
              <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-teal-400">
                  <Brain className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white">
                    Ready to Generate Your Personalized Biomechanical Plan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fill in your pain metrics on the left, or pick any joint from our 3D Body Explorer above. 
                    Click <strong className="text-teal-400">Run Gemini 3.5 Clinical Analysis</strong> to view diagnostic thoughts, 
                    immediate pain relief protocols, and phased exercises.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Used by over 10,000 satisfied patients at Jayanti Clinic Bengaluru
                </div>
              </div>
            )}

            {/* Rendered Clinical Plan */}
            {!isLoading && plan && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3">
                
                {/* 1. Primary Suspicion & Severity Header */}
                <div className="bg-slate-950 border border-teal-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Primary Clinical Impression
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                      plan.severityGrade.includes('Severe') 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                    }`}>
                      Grade: {plan.severityGrade}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.primarySuspicion}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {plan.biomechanicalBreakdown}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <span>
                      <strong>Estimated Recovery Timeline:</strong> {plan.prognosisTimeframe}
                    </span>
                    <button
                      onClick={() => setShowThinkingDetails(!showThinkingDetails)}
                      className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showThinkingDetails ? 'Hide' : 'View'} AI Reasoning Steps</span>
                      {showThinkingDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 2. Thinking Steps Accordion (Clinical Reasoning Chain) */}
                {showThinkingDetails && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide">
                      <Brain className="w-4 h-4" />
                      Gemini 3.5 Clinical Chain of Thought:
                    </div>
                    <div className="space-y-2">
                      {plan.thinkingSteps.map((step, idx) => (
                        <div key={idx} className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Immediate Relief Protocol */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Immediate 24-Hour Relief Protocol
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="font-bold text-cyan-300">Thermal Modality</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {plan.immediateReliefProtocol.cryoOrThermotherapy}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="font-bold text-teal-300">Ergonomic Posture</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {plan.immediateReliefProtocol.ergonomics}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="font-bold text-emerald-300">Activity Guarding</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {plan.immediateReliefProtocol.activityModification}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Phased Exercise Rehabilitation Program */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-400" />
                      Phased Rehabilitation Progression
                    </h4>

                    {/* Phase Tabs */}
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                      {plan.rehabPhases.map((phase) => (
                        <button
                          key={phase.phaseNumber}
                          onClick={() => setActivePhaseTab(phase.phaseNumber)}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                            activePhaseTab === phase.phaseNumber
                              ? 'bg-teal-500 text-slate-950'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Phase {phase.phaseNumber}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Phase Details */}
                  {plan.rehabPhases.filter(p => p.phaseNumber === activePhaseTab).map((phase) => (
                    <div key={phase.phaseNumber} className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/30">
                        <div className="text-xs font-bold text-teal-300 mb-1">
                          Phase {phase.phaseNumber}: {phase.phaseName}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          <strong>Objective:</strong> {phase.objective}
                        </div>
                      </div>

                      {/* Exercises list */}
                      <div className="space-y-3">
                        {phase.exercises.map((ex, exIdx) => (
                          <div key={exIdx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800/90 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-bold text-sm text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-slate-800 text-teal-400 text-xs flex items-center justify-center font-mono">
                                  {exIdx + 1}
                                </span>
                                {ex.title}
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                                {ex.repsOrDuration} • {ex.frequency}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300">
                              {ex.instructions}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                              <div className="p-2 rounded-xl bg-teal-950/50 border border-teal-500/20 text-teal-300">
                                <strong>Biomechanical Cue:</strong> {ex.biomechanicalCue}
                              </div>
                              <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-500/20 text-amber-300">
                                <strong>Precaution:</strong> {ex.precautions}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5. In-Clinic Recommended Modalities */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Recommended In-Clinic Equipment at Jayanti Physiotherapy:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.clinicModalityRecommendations.map((mod, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-teal-500/30 text-teal-300 font-medium">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 6. Red Flags Warning Box */}
                {plan.redFlagsToWatch && plan.redFlagsToWatch.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Clinical Red Flags (Seek Immediate Medical Care If Experienced):
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                      {plan.redFlagsToWatch.map((rf, idx) => (
                        <li key={idx}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons: Book Consultation & Share on WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={onOpenBooking}
                    className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book In-Person Assessment</span>
                  </button>

                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Plan to Doctor on WhatsApp</span>
                  </a>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
