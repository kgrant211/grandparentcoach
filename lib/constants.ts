export const FREE_TRIAL_DAYS = 7;
export const MONTHLY_PRICE = 9.99;
export const MAX_FREE_SESSIONS = 3;

export const AGE_RANGES = [
  { value: '0-2', label: '0-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '6-9', label: '6-9 years' },
  { value: '10-12', label: '10-12 years' },
  { value: 'teen', label: 'Teen' },
] as const;

export const SITUATION_TYPES = [
  { value: 'tantrum', label: 'Tantrum' },
  { value: 'bedtime', label: 'Bedtime resistance' },
  { value: 'sibling-conflict', label: 'Sibling conflict' },
  { value: 'screens', label: 'Screen time limits' },
  { value: 'boundaries', label: 'Setting boundaries' },
  { value: 'transitions', label: 'Transitions' },
  { value: 'public-meltdown', label: 'Public meltdown' },
  { value: 'potty-training', label: 'Potty training' },
  { value: 'sharing', label: 'Sharing' },
  { value: 'listening', label: 'Not listening' },
  { value: 'other', label: 'Other' },
] as const;

export const POPULAR_SITUATIONS = [
  {
    id: 'tantrum',
    title: 'Tantrum Help',
    description: 'When your grandchild has a meltdown',
    icon: '😤',
  },
  {
    id: 'bedtime',
    title: 'Bedtime Struggles',
    description: 'Getting them to sleep peacefully',
    icon: '😴',
  },
  {
    id: 'sharing',
    title: 'Sharing Issues',
    description: 'When they won\'t share toys',
    icon: '🤝',
  },
  {
    id: 'transitions',
    title: 'Smooth Transitions',
    description: 'Moving from one activity to another',
    icon: '🔄',
  },
] as const;

export const SAFETY_KEYWORDS = [
  'emergency', 'urgent', 'danger', 'harm', 'hurt', 'injury',
  'medical', 'doctor', 'hospital', 'medicine', 'medication',
  'crisis', 'suicide', 'self-harm', 'abuse', 'neglect'
];

export const MEDICAL_KEYWORDS = [
  'diagnosis', 'symptoms', 'treatment', 'therapy', 'medication',
  'doctor', 'pediatrician', 'medical', 'health', 'illness',
  'disease', 'condition', 'disorder', 'syndrome'
];
