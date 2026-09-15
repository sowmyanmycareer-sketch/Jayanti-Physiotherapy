export type BodyRegionId = 
  | 'cervical-spine'
  | 'shoulder'
  | 'thoracic-spine'
  | 'lumbar-spine'
  | 'hip'
  | 'knee'
  | 'ankle-foot'
  | 'elbow-wrist';

export interface BodyRegionInfo {
  id: BodyRegionId;
  name: string;
  tagline: string;
  position3D: [number, number, number]; // [x, y, z] for 3D marker
  color: string;
  commonConditions: string[];
  symptoms: string[];
  recommendedTreatments: string[];
}

export interface ExercisePrescription {
  title: string;
  repsOrDuration: string;
  frequency: string;
  instructions: string;
  biomechanicalCue: string;
  precautions: string;
}

export interface RehabPhase {
  phaseNumber: number;
  phaseName: string;
  objective: string;
  exercises: ExercisePrescription[];
}

export interface AiRecoveryPlan {
  primarySuspicion: string;
  severityGrade: 'Mild' | 'Moderate' | 'Severe / Needs Immediate Clinical Review';
  thinkingSteps: string[];
  biomechanicalBreakdown: string;
  immediateReliefProtocol: {
    cryoOrThermotherapy: string;
    ergonomics: string;
    activityModification: string;
  };
  rehabPhases: RehabPhase[];
  clinicModalityRecommendations: string[];
  redFlagsToWatch: string[];
  prognosisTimeframe: string;
}

export interface ClinicReview {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  conditionTreated: string;
  comment: string;
  verifiedPatient: boolean;
}

export interface AppointmentFormData {
  fullName: string;
  phone: string;
  email?: string;
  selectedDate: string;
  preferredTime: string;
  conditionOrPainArea: string;
  treatmentType: string;
  notes?: string;
}
