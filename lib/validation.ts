import { z } from 'zod';

// Safety and content validation schemas
export const safetyKeywords = [
  'emergency', 'urgent', 'danger', 'harm', 'hurt', 'injury',
  'medical', 'doctor', 'hospital', 'medicine', 'medication',
  'crisis', 'suicide', 'self-harm', 'abuse', 'neglect'
];

export const medicalKeywords = [
  'diagnosis', 'symptoms', 'treatment', 'therapy', 'medication',
  'doctor', 'pediatrician', 'medical', 'health', 'illness',
  'disease', 'condition', 'disorder', 'syndrome'
];

export const containsSafetyKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return safetyKeywords.some(keyword => lowerText.includes(keyword));
};

export const containsMedicalKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return medicalKeywords.some(keyword => lowerText.includes(keyword));
};

// Validation schemas
export const contextSchema = z.object({
  ageRange: z.string().optional(),
  situationType: z.string().optional(),
  attempted: z.string().optional(),
  urgency: z.boolean().optional(),
  userNotes: z.string().optional(),
});

export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(4000),
  metadata: z.record(z.any()).optional(),
});

export const sessionSchema = z.object({
  title: z.string().optional(),
  context: contextSchema.optional(),
});

export const favoriteSchema = z.object({
  title: z.string().min(1).max(100),
  summary: z.string().optional(),
});

// Safety response templates
export const SAFETY_RESPONSE = `I'm not able to help with emergencies. If anyone is in immediate danger or at risk of harm, please contact local emergency services or a licensed professional right away. You're not alone, and there are people who can help immediately.

For immediate safety concerns:
• Call 911 or your local emergency number
• Contact your local crisis hotline
• Reach out to a trusted family member or friend
• Go to your nearest emergency room

I'm here to help with everyday parenting challenges when it's safe to do so.`;

export const MEDICAL_RESPONSE = `I can't provide medical or diagnostic advice. A licensed healthcare professional is the best resource for that. If it helps, I can offer general communication and boundary-setting tips for everyday situations.

For medical concerns:
• Contact your pediatrician or family doctor
• Use your health insurance's nurse line
• Visit an urgent care center if needed
• In emergencies, call 911

I'm happy to help with behavioral and communication strategies once you've addressed any medical needs with a professional.`;

// Content filtering function
export const filterContent = (content: string): { 
  isSafe: boolean; 
  response?: string; 
  filteredContent?: string 
} => {
  const lowerContent = content.toLowerCase();
  
  // Check for safety concerns first
  if (containsSafetyKeywords(lowerContent)) {
    return {
      isSafe: false,
      response: SAFETY_RESPONSE,
    };
  }
  
  // Check for medical advice requests
  if (containsMedicalKeywords(lowerContent)) {
    return {
      isSafe: false,
      response: MEDICAL_RESPONSE,
    };
  }
  
  // Basic content sanitization
  const filteredContent = content
    .replace(/[<>]/g, '') // Remove potential HTML
    .trim();
  
  return {
    isSafe: true,
    filteredContent,
  };
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (userId: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(userId) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limited
    }
    
    validRequests.push(now);
    requests.set(userId, validRequests);
    return true; // Allowed
  };
};
