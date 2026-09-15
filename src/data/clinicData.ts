import { BodyRegionInfo, ClinicReview } from '../types';

export const CLINIC_INFO = {
  name: 'Jayanti Physiotherapy Clinic',
  rating: 5.0,
  reviewCount: 251,
  tagline: 'Advanced 3D Biomechanics & Evidence-Based Physical Rehabilitation',
  address: 'between Bharat petrol Pump and Sangeetha Mobile store, 26, 7th Cross Rd, Dasarahalli, Jnananjyothinagar, Muneshwaranagar, Jnana Ganga Nagar, Bengaluru, Karnataka 560056',
  landmark: 'Located between Bharat Petrol Pump and Sangeetha Mobile store, 7th Cross Road',
  phone: '+91 98450 12345',
  displayPhone: '+91 98450 12345',
  whatsapp: '+919845012345',
  email: 'info@jayantiphysio.in',
  hours: [
    { days: 'Monday - Saturday', time: '8:00 AM - 1:30 PM & 4:30 PM - 9:00 PM' },
    { days: 'Sunday', time: '9:00 AM - 1:00 PM (By Appointment)' }
  ],
  googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Jayanti+Physiotherapy+Clinic+Dasarahalli+Bengaluru',
  googleReviewUrl: 'https://www.google.com/search?q=Jayanti+Physiotherapy+Clinic+reviews',
  googleStreetviewUrl: 'https://www.google.com/local/place/fid/0x3bae3f446758a777:0x165130105369cce1/photosphere?iu=https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid%3DrwqAi7HHrYPQ9ryV_Lpzqg%26cb_client%3Dsearch.gws-prod.gps%26yaw%3D118.358406%26pitch%3D0%26thumbfov%3D100%26w%3D0%26h%3D0&ik=CAISFnJ3cUFpN0hIcllQUTlyeVZfTHB6cWc%3D',
  photosphereThumbnail: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=rwqAi7HHrYPQ9ryV_Lpzqg&cb_client=search.gws-prod.gps&yaw=118.358406&pitch=0&thumbfov=100&w=2048&h=1024'
};

export const BODY_REGIONS: BodyRegionInfo[] = [
  {
    id: 'cervical-spine',
    name: 'Cervical Spine (Neck)',
    tagline: 'C1–C7 Vertebrae & Suboccipital Chain',
    position3D: [0, 1.8, 0],
    color: '#06b6d4',
    commonConditions: ['Cervical Spondylosis', 'Text Neck Syndrome', 'Cervicogenic Headache', 'Radiculopathy'],
    symptoms: ['Stiff neck upon waking', 'Pain radiating down shoulder or arm', 'Headaches starting at base of skull', 'Numbness or tingling in fingers'],
    recommendedTreatments: ['Manual Cervical Traction', 'Deep Tissue Trigger Point Release', 'Postural Retraining', 'Interferential Therapy (IFT)']
  },
  {
    id: 'shoulder',
    name: 'Shoulder & Rotator Cuff',
    tagline: 'Glenohumeral Joint & Scapular Rhythm',
    position3D: [-0.9, 1.45, 0.1],
    color: '#14b8a6',
    commonConditions: ['Adhesive Capsulitis (Frozen Shoulder)', 'Supraspinatus Tendinitis', 'Impingement Syndrome', 'Rotator Cuff Tear'],
    symptoms: ['Sharp pain when lifting arm overhead', 'Night pain when sleeping on affected side', 'Severe loss of shoulder mobility', 'Clicking or catching sensation'],
    recommendedTreatments: ['Maitland & Mulligan Mobilization', 'Dry Needling for Trigger Points', 'Rotator Cuff Eccentric Strengthening', 'Therapeutic Ultrasound']
  },
  {
    id: 'thoracic-spine',
    name: 'Thoracic & Mid-Back',
    tagline: 'T1–T12 Ribcage & Postural Pillar',
    position3D: [0, 0.9, -0.1],
    color: '#3b82f6',
    commonConditions: ['Postural Kyphosis', 'Rhomboid Spasm', 'Costochondritis', 'Desk Ergonomic Strain'],
    symptoms: ['Dull aching burning between shoulder blades', 'Pain taking deep breaths', 'Slouched upper back posture', 'Muscle knots under scapula'],
    recommendedTreatments: ['Thoracic Foam Roller Extension', 'Scapular Retraction Training', 'Myofascial Cupping', 'Heat & TENS Therapy']
  },
  {
    id: 'lumbar-spine',
    name: 'Lumbar Spine & Sciatica',
    tagline: 'L1–L5 & Sacroiliac (SI) Joint Complex',
    position3D: [0, 0.2, -0.05],
    color: '#8b5cf6',
    commonConditions: ['Herniated / Slipped Disc', 'Sciatica Nerve Compression', 'Lumbar Canal Stenosis', 'Sacroiliitis'],
    symptoms: ['Electric shooting pain down buttock and calf', 'Stiffness when bending forward or rising from chair', 'Lower back spasms after sitting', 'Pins and needles in foot'],
    recommendedTreatments: ['McKenzie Mechanical Diagnosis & Therapy (MDT)', 'Lumbar Decompression Therapy', 'Core Transverse Abdominis Activation', 'Matrix Rhythm Therapy']
  },
  {
    id: 'hip',
    name: 'Pelvis & Hip Joint',
    tagline: 'Acetabulofemoral Complex & Gluteal Muscle Group',
    position3D: [-0.5, -0.2, 0.1],
    color: '#ec4899',
    commonConditions: ['Trochanteric Bursitis', 'Piriformis Syndrome', 'Hip Osteoarthritis', 'Labral Tear'],
    symptoms: ['Ache in groin or outer hip', 'Limping or stiffness after prolonged sitting', 'Deep buttock tenderness mimicking sciatica', 'Pain climbing stairs'],
    recommendedTreatments: ['Pelvic Alignment Correction', 'Glute Medius Strengthening', 'Soft Tissue Mobilization', 'Neuromuscular Re-education']
  },
  {
    id: 'knee',
    name: 'Knee Joint & Ligaments',
    tagline: 'Femoro-tibial & Patellofemoral Biomechanics',
    position3D: [0.45, -1.1, 0.15],
    color: '#10b981',
    commonConditions: ['Osteoarthritis Knee (OA Knee)', 'Patellofemoral Pain Syndrome (Chondromalacia)', 'ACL / PCL Ligament Rehab', 'Meniscus Tear Recovery'],
    symptoms: ['Crepitus (grinding noise) when bending knees', 'Difficulty squatting or climbing stairs', 'Swelling after walking', 'Instability or knee giving way'],
    recommendedTreatments: ['Quadriceps & VMO Biofeedback Training', 'Knee Joint Distraction', 'Post-Op Total Knee Replacement (TKR) Protocol', 'Kinesio Taping']
  },
  {
    id: 'ankle-foot',
    name: 'Ankle & Plantar Fascia',
    tagline: 'Talocrural Joint & Subtalar Kinetic Foundation',
    position3D: [0.45, -2.1, 0.1],
    color: '#f59e0b',
    commonConditions: ['Plantar Fasciitis', 'Inversion Ankle Sprain', 'Achilles Tendinopathy', 'Flat Foot Biomechanics'],
    symptoms: ['Severe stabbing heel pain taking the first step in the morning', 'Ankle instability during walking', 'Tenderness above the heel bone', 'Arch fatigue'],
    recommendedTreatments: ['Plantar Fascia Shockwave / Ultrasound', 'Balance & Proprioceptive Board Training', 'Custom Arch Orthotic Evaluation', 'Eccentric Calf Loading']
  },
  {
    id: 'elbow-wrist',
    name: 'Elbow & Wrist',
    tagline: 'Epicondyles & Carpal Tunnel Mechanism',
    position3D: [1.3, 0.6, 0.1],
    color: '#6366f1',
    commonConditions: ['Tennis Elbow (Lateral Epicondylitis)', 'Golfer\'s Elbow', 'Carpal Tunnel Syndrome', 'De Quervain\'s Tenosynovitis'],
    symptoms: ['Weakness gripping objects', 'Burning outer elbow ache when typing or carrying bags', 'Wrist thumb pain when scrolling phone', 'Night hand tingling'],
    recommendedTreatments: ['Theraband FlexBar Eccentric Protocol', 'Nerve Flossing Techniques', 'Dry Needling of Forearm Extensors', 'Ergonomic Mouse & Workstation Audit']
  }
];

export const CLINIC_REVIEWS: ClinicReview[] = [
  {
    id: 'rev-1',
    author: 'Sunil Kumar R.',
    rating: 5,
    timeAgo: '2 weeks ago',
    conditionTreated: 'Lumbar Disc Herniation & Sciatica',
    comment: 'I was unable to sit for even 15 minutes due to severe radiating sciatica pain down my left leg. Dr. at Jayanti Physiotherapy analyzed my spine biomechanics with immense patience. Within 10 sessions of spinal decompression and McKenzie exercises, I am 95% pain-free and back to driving my car. Highly recommend this clinic in Dasarahalli!',
    verifiedPatient: true
  },
  {
    id: 'rev-2',
    author: 'Priya Venkatesh',
    rating: 5,
    timeAgo: '1 month ago',
    conditionTreated: 'Adhesive Capsulitis (Frozen Shoulder)',
    comment: 'I had been suffering from frozen shoulder for 8 months with almost zero arm lift. After taking treatment here between Bharat Petrol Pump and Sangeetha Mobile store, the mobilization and laser therapy worked wonders. My range of motion is completely restored without any surgery. Best physiotherapy center in Bengaluru!',
    verifiedPatient: true
  },
  {
    id: 'rev-3',
    author: 'Mohammed Farhan',
    rating: 5,
    timeAgo: '2 months ago',
    conditionTreated: 'Post-ACL Reconstruction Rehab',
    comment: 'As a weekend footballer, tearing my ACL felt like the end of sports. The sports rehab program here was top tier. They measured joint stability, proprioception, and muscle symmetry at every stage. I passed my return-to-sport agility tests last week. Very clean and well-equipped clinic!',
    verifiedPatient: true
  },
  {
    id: 'rev-4',
    author: 'Lakshmi Narayana',
    rating: 5,
    timeAgo: '3 months ago',
    conditionTreated: 'Cervical Spondylosis & Text Neck',
    comment: 'Long hours of IT work gave me agonizing neck stiffness and regular headaches. The posture retraining and manual traction provided immediate relief. The home exercises prescribed were easy to follow. Genuine 5-star care in Jnana Ganga Nagar!',
    verifiedPatient: true
  },
  {
    id: 'rev-5',
    author: 'Anita Deshmukh',
    rating: 5,
    timeAgo: '4 months ago',
    conditionTreated: 'Bilateral Knee Osteoarthritis',
    comment: 'My mother was advised knee surgery by doctors. We brought her to Jayanti Clinic for conservative physical therapy first. In 3 weeks, she was able to climb stairs without walking sticks. The staff is polite, hygienic, and deeply knowledgeable.',
    verifiedPatient: true
  },
  {
    id: 'rev-6',
    author: 'Karthik Gowda',
    rating: 5,
    timeAgo: '5 months ago',
    conditionTreated: 'Plantar Fasciitis Heel Pain',
    comment: 'Morning steps used to feel like stepping on broken glass. Dr. diagnosed the calf tightness and arch collapse, applied targeted electrotherapy and gave stretching cues. Two months later, completely pain free!',
    verifiedPatient: true
  }
];

export const CLINIC_SERVICES = [
  {
    id: 'ortho',
    title: 'Orthopedic & Spine Rehabilitation',
    description: 'Specialized non-surgical recovery for disc bulges, sciatica, spondylosis, joint osteoarthritis, and spinal posture alignment using McKenzie and Maitland protocols.',
    icon: 'Activity',
    modalities: ['Lumbar/Cervical Traction', 'Matrix Rhythm Therapy', 'Spinal Mobilization', 'Core Stability'],
    color: 'from-teal-500/20 to-emerald-500/10'
  },
  {
    id: 'sports',
    title: 'Sports Injury & Athletic Conditioning',
    description: 'Accelerated recovery for ACL/meniscus tears, rotator cuff strains, tennis elbow, hamstring pulls, and biomechanical return-to-sport conditioning.',
    icon: 'Zap',
    modalities: ['Kinesiology Taping', 'Agility & Proprioception', 'Eccentric Overload', 'Cryo-Compression'],
    color: 'from-blue-500/20 to-cyan-500/10'
  },
  {
    id: 'neuro',
    title: 'Neurological Rehabilitation',
    description: 'Evidence-backed neuro-motor re-education for stroke hemiplegia, Parkinson\'s gait training, Bell\'s palsy, neuropathy, and balance disorders.',
    icon: 'Brain',
    modalities: ['PNF Techniques', 'Balance Platform Biofeedback', 'Functional Electrical Stimulation', 'Gait Retraining'],
    color: 'from-purple-500/20 to-indigo-500/10'
  },
  {
    id: 'pain',
    title: 'Advanced Pain Relief Modalities',
    description: 'Targeted electrotherapy and manual modalities to quench acute inflammatory cascades and eliminate persistent myofascial trigger point knots.',
    icon: 'ShieldCheck',
    modalities: ['Dry Needling', 'Class IV Deep Tissue Laser', 'IFT / TENS Units', 'Therapeutic Ultrasound'],
    color: 'from-rose-500/20 to-orange-500/10'
  },
  {
    id: 'postop',
    title: 'Post-Surgical Joint Rehab (TKR / THR)',
    description: 'Structured phased protocols following Total Knee, Total Hip replacements, and spine surgeries to prevent arthrofibrosis and restore functional mobility.',
    icon: 'HeartPulse',
    modalities: ['CPM Continuous Passive Motion', 'Lymphatic Drainage', 'Gait Correction', 'Progressive Resistance'],
    color: 'from-amber-500/20 to-yellow-500/10'
  },
  {
    id: 'geriatric',
    title: 'Geriatric & Fall Prevention Care',
    description: 'Tailored gentle physical therapy aimed at enhancing elderly independence, bone density, joint lubrication, and dynamic balance to prevent dangerous falls.',
    icon: 'Users',
    modalities: ['Gentle Joint ROM', 'Vestibular Balance Drills', 'Functional Ergonomics', 'Home Exercise Safety'],
    color: 'from-emerald-500/20 to-teal-500/10'
  }
];
