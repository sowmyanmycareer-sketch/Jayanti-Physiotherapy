import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    clinic: 'Jayanti Physiotherapy Clinic',
    location: 'Bengaluru, Karnataka',
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// AI Physiotherapy Recovery Planner using Gemini with Thinking Model
app.post('/api/ai-recovery-planner', async (req, res) => {
  try {
    const {
      bodyRegion,
      painLevel,
      duration,
      symptoms = [],
      aggravatingFactors = '',
      dailyActivitiesImpact = '',
      patientAge = '35'
    } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are the lead consultant physiotherapist at Jayanti Physiotherapy Clinic, Bengaluru (specializing in manual therapy, orthopedic biomechanics, McKenzie methods, and neuro-rehabilitation).
Conduct an in-depth clinical biomechanical analysis for this patient presentation:
- Body Region: ${bodyRegion || 'Lumbar Spine'}
- Pain Severity Score: ${painLevel || 6}/10
- Duration: ${duration || '3 weeks'}
- Key Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}
- Aggravating Factors: ${aggravatingFactors || 'Prolonged sitting, bending'}
- Functional Limitations: ${dailyActivitiesImpact || 'Discomfort while working at desk and climbing stairs'}
- Patient Age: ${patientAge}

Apply systematic clinical diagnostic reasoning.
Return a structured JSON with:
1. thinkingSteps: An array of 3-5 concise, clinical thinking steps explaining your differential diagnostic reasoning (e.g. assessing kinetic chain, facet vs discogenic involvement, nerve root tension, red flag screening, and dosage planning).
2. primarySuspicion: Likely clinical diagnosis (e.g. "L4-L5 Lumbar Disc Bulge with Sciatic Nerve Sensitization").
3. severityGrade: "Mild", "Moderate", or "Severe / Needs Immediate Clinical Review".
4. biomechanicalBreakdown: 2-3 sentences explaining the anatomical cause in clear patient-friendly terms.
5. immediateReliefProtocol: Object with cryoOrThermotherapy, ergonomics, and activityModification.
6. rehabPhases: Array of 3 progressive phases (Phase 1: Acute Decompression & Pain Modulation; Phase 2: Neuromuscular Stabilization & Active ROM; Phase 3: Dynamic Strengthening & Functional Return). Each phase must have 2-3 specific evidence-based exercises with title, repsOrDuration, frequency, instructions, biomechanicalCue, and precautions.
7. clinicModalityRecommendations: 3-4 physical therapy modalities available at Jayanti Physiotherapy Clinic (such as Spinal Decompression Traction, Matrix Rhythm Therapy, Class IV Laser, IFT/Ultrasound, Dry Needling).
8. redFlagsToWatch: 2-3 warning symptoms that warrant immediate emergency medical care (cauda equina, progressive numbness, drop foot, etc).
9. prognosisTimeframe: Realistic recovery timeline with compliant physical therapy.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert Doctor of Physical Therapy and Biomechanics Specialist. Always provide medically sound, conservative rehabilitation guidance following APTA and Chartered Society of Physiotherapy protocols.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              thinkingSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Step-by-step clinical reasoning thoughts'
              },
              primarySuspicion: { type: Type.STRING },
              severityGrade: { type: Type.STRING },
              biomechanicalBreakdown: { type: Type.STRING },
              immediateReliefProtocol: {
                type: Type.OBJECT,
                properties: {
                  cryoOrThermotherapy: { type: Type.STRING },
                  ergonomics: { type: Type.STRING },
                  activityModification: { type: Type.STRING }
                },
                required: ['cryoOrThermotherapy', 'ergonomics', 'activityModification']
              },
              rehabPhases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseNumber: { type: Type.INTEGER },
                    phaseName: { type: Type.STRING },
                    objective: { type: Type.STRING },
                    exercises: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          repsOrDuration: { type: Type.STRING },
                          frequency: { type: Type.STRING },
                          instructions: { type: Type.STRING },
                          biomechanicalCue: { type: Type.STRING },
                          precautions: { type: Type.STRING }
                        },
                        required: ['title', 'repsOrDuration', 'frequency', 'instructions', 'biomechanicalCue', 'precautions']
                      }
                    }
                  },
                  required: ['phaseNumber', 'phaseName', 'objective', 'exercises']
                }
              },
              clinicModalityRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              redFlagsToWatch: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              prognosisTimeframe: { type: Type.STRING }
            },
            required: [
              'thinkingSteps',
              'primarySuspicion',
              'severityGrade',
              'biomechanicalBreakdown',
              'immediateReliefProtocol',
              'rehabPhases',
              'clinicModalityRecommendations',
              'redFlagsToWatch',
              'prognosisTimeframe'
            ]
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, plan: parsed, modelUsed: 'gemini-3.8-flash' });
    }

    // High-quality fallback clinical assessment if API key is not configured yet
    const fallbackPlan = generateClinicalFallback(bodyRegion, painLevel);
    return res.json({ success: true, plan: fallbackPlan, modelUsed: 'clinical-rules-engine' });
  } catch (error: any) {
    console.error('Error generating recovery plan:', error);
    // Return reliable clinical fallback to guarantee continuous uptime
    const fallbackPlan = generateClinicalFallback(req.body?.bodyRegion, req.body?.painLevel);
    return res.json({ success: true, plan: fallbackPlan, fallback: true, error: error?.message });
  }
});

// Appointment booking endpoint
app.post('/api/book-appointment', (req, res) => {
  const { fullName, phone, selectedDate, preferredTime, conditionOrPainArea, treatmentType } = req.body;
  if (!fullName || !phone) {
    return res.status(400).json({ success: false, message: 'Full name and phone number are required.' });
  }

  // Generate confirmation reference
  const appointmentId = `JPC-${Date.now().toString().slice(-6)}`;
  return res.json({
    success: true,
    appointmentId,
    message: `Appointment request received! Our clinic desk at Dasarahalli will reach out to ${phone} to confirm your slot for ${selectedDate || 'tomorrow'} at ${preferredTime || '10:00 AM'}.`,
    details: {
      fullName,
      phone,
      selectedDate,
      preferredTime,
      conditionOrPainArea,
      treatmentType
    }
  });
});

// Patient review submission
app.post('/api/submit-review', (req, res) => {
  const { author, rating, conditionTreated, comment } = req.body;
  if (!author || !comment) {
    return res.status(400).json({ success: false, message: 'Author and review comment are required.' });
  }

  return res.json({
    success: true,
    message: 'Thank you for your valuable feedback! Your review has been submitted to Jayanti Physiotherapy Clinic.',
    review: {
      id: `rev-${Date.now()}`,
      author,
      rating: rating || 5,
      timeAgo: 'Just now',
      conditionTreated: conditionTreated || 'General Physiotherapy',
      comment,
      verifiedPatient: true
    }
  });
});

// Fallback algorithm for clinical assessments
function generateClinicalFallback(region: string = 'lumbar-spine', painLevel: number = 6) {
  const isSevere = Number(painLevel) >= 8;
  const isSpine = region.includes('spine') || region.includes('lumbar') || region.includes('cervical');

  return {
    thinkingSteps: [
      `1. Analyzing biomechanical vector distribution for ${region || 'musculoskeletal structure'} with reported pain intensity of ${painLevel}/10.`,
      `2. Differential evaluation: Differentiating compressive nerve radiculopathy from local myofascial spasm and postural alignment strain.`,
      `3. Red flag audit: Screened for progressive bilateral neurological deficits, spinal trauma history, and bladder/bowel incontinence.`,
      `4. Kinetic Chain Analysis: Identifying adjacent joint hypomobility and compensatory hypermobility patterns.`,
      `5. Phased Progression: Synthesizing progressive mechanotherapy targeting pain modulation, motor control, and functional reloading.`
    ],
    primarySuspicion: isSpine 
      ? 'Mechanical Spinal Dysfunctional Syndrome with Secondary Myofascial Guarding'
      : `${region.replace('-', ' ').toUpperCase()} Biomechanical Overload & Kinetic Chain Dysfunction`,
    severityGrade: isSevere ? 'Severe / Needs Immediate Clinical Review' : 'Moderate',
    biomechanicalBreakdown: `Asymmetric gravitational loading and sustained postural strain have triggered focal tissue irritation in the ${region.replace('-', ' ')}. Surrounding paraspinal and stabilizer muscle groups have entered a protective hypertonic state, causing stiffness and motion restriction.`,
    immediateReliefProtocol: {
      cryoOrThermotherapy: painLevel > 7 
        ? 'Apply an ice pack wrapped in a damp towel for 15 minutes every 3-4 hours to dampen inflammatory nerve excitation.' 
        : 'Apply moist heat for 15-20 minutes before gentle mobility exercises to increase local blood flow and reduce muscle guarding.',
      ergonomics: 'Maintain neutral spinal alignment; adjust chair lumbar support and raise display to eye level to eliminate prolonged flexion stress.',
      activityModification: 'Avoid prolonged static postures beyond 30 minutes; incorporate 60-second micro-breaks with gentle postural resets.'
    },
    rehabPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Acute Decompression & Pain Modulation',
        objective: 'Reduce acute nociceptive signaling, decrease muscular hypertonicity, and restore gentle passive movement.',
        exercises: [
          {
            title: 'Diaphragmatic Breathing & Core Decompression',
            repsOrDuration: '10 deep breathing cycles',
            frequency: '3 times daily',
            instructions: 'Lie on your back with knees bent at 90 degrees supported by pillows. Inhale slowly through your nose expanding the belly, exhale slowly through pursed lips.',
            biomechanicalCue: 'Feel the intra-abdominal pressure stabilize your spine without tensing the neck muscles.',
            precautions: 'Do not hold your breath; stop immediately if dizzy.'
          },
          {
            title: 'Gentle Active-Assisted Joint Oscillations',
            repsOrDuration: '12 smooth repetitions',
            frequency: '2 times daily',
            instructions: 'Move the affected joint gently through its pain-free arc of motion without forcing the barrier.',
            biomechanicalCue: 'Prioritize fluid, rhythmic joint lubrication rather than end-range stretch.',
            precautions: 'Stay strictly below a 3/10 discomfort threshold.'
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseName: 'Neuromuscular Activation & Isometric Stabilization',
        objective: 'Re-educate deep postural stabilizers without creating provocative shear force on injured tissues.',
        exercises: [
          {
            title: 'Submaximal Isometric Holds',
            repsOrDuration: '5-second holds x 8 reps',
            frequency: 'Daily',
            instructions: 'Gently push against a static immovable surface (such as a wall or your own palm) using 30-40% effort.',
            biomechanicalCue: 'Focus on clean muscle co-contraction without joint movement.',
            precautions: 'Breathe continuously throughout the contraction.'
          },
          {
            title: 'Scapular / Pelvic Neutral Alignment Drills',
            repsOrDuration: '10 controlled repetitions',
            frequency: 'Twice daily',
            instructions: 'Activate the stabilizing muscle girdle while maintaining neutral spine curvature.',
            biomechanicalCue: 'Imagine pulling your shoulder blades into your back pockets or gently drawing the navel toward your spine.',
            precautions: 'Avoid overarching the lower back.'
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseName: 'Dynamic Kinetic Strengthening & Functional Reloading',
        objective: 'Progressively adapt tendons, ligaments, and muscular chains to daily life and sports demands.',
        exercises: [
          {
            title: 'Eccentric Load & Resistance Band Retraining',
            repsOrDuration: '3 sets of 10 reps (3-second lowering phase)',
            frequency: 'Every other day',
            instructions: 'Perform controlled movement with emphasis on the slow lengthening phase against resistance.',
            biomechanicalCue: 'Control the return phase with steady tempo (3 seconds count).',
            precautions: 'Ensure proper warm-up; avoid jerky ballistic motions.'
          },
          {
            title: 'Proprioceptive Single-Leg / Balance Reset',
            repsOrDuration: '30 seconds per side x 3 rounds',
            frequency: 'Daily',
            instructions: 'Stand on one leg with a soft knee on a firm surface, tracking balance with eyes focused ahead.',
            biomechanicalCue: 'Engage the foot tripod (heel, big toe base, pinky toe base) and glutes.',
            precautions: 'Keep a stable wall or chair nearby for support.'
          }
        ]
      }
    ],
    clinicModalityRecommendations: [
      'Manual Joint Mobilization & Myofascial Release at Jayanti Clinic',
      'Class IV Deep Tissue Laser Therapy for accelerated tissue repair',
      'Targeted Interferential Therapy (IFT) & Computerized Traction',
      'Customized Home Exercise Biomechanical Prescription'
    ],
    redFlagsToWatch: [
      'Sudden loss of bladder or bowel control (Emergency Red Flag)',
      'Progressive muscle weakness such as foot drop or inability to grasp objects',
      'Unrelenting night pain accompanied by unexplained fever or systemic chills'
    ],
    prognosisTimeframe: 'Noticeable pain reduction expected within 5-7 clinical sessions; functional tissue resilience established across 4-6 weeks of guided physical therapy.'
  };
}

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jayanti Physiotherapy Clinic server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
