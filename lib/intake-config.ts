export const studioName = process.env.NEXT_PUBLIC_STUDIO_NAME || 'Your Web Studio';
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@yourdomain.com';

export const budgetRanges = [
  'Under $1,000',
  '$1,000–$2,500',
  '$2,500–$5,000',
  '$5,000–$10,000',
  '$10,000+',
  "I'm not sure — recommend what makes sense",
];

export const pageOptions = [
  'Home',
  'About',
  'Services',
  'Individual service pages',
  'Pricing',
  'Portfolio / work',
  'Testimonials / results',
  'FAQ',
  'Contact',
  'Booking',
  'Blog / insights',
  'Resources / downloads',
  'Shop / product pages',
  'Client portal',
  'Privacy / terms / legal',
];

export const featureOptions = [
  'Contact or lead form',
  'Booking / calendar',
  'Stripe payments',
  'E-commerce / cart',
  'Subscriptions / memberships',
  'Client accounts / login',
  'Email signup / newsletter',
  'CRM integration',
  'Blog / CMS',
  'Search',
  'File downloads / lead magnets',
  'Video / media library',
  'Interactive quiz / assessment',
  'AI feature',
  'Analytics / conversion tracking',
  'Multilingual content',
  'Third-party API integration',
];

export const goalOptions = [
  'Generate leads',
  'Book appointments',
  'Sell products or services',
  'Build credibility',
  'Explain what we do',
  'Grow an email list',
  'Showcase work / portfolio',
  'Educate customers',
  'Support existing clients',
  'Recruit / hire',
];

export const brandVibes = [
  'Minimal & editorial',
  'Premium & sophisticated',
  'Bold & energetic',
  'Warm & human',
  'Modern & technical',
  'Playful & creative',
  'Calm & wellness-focused',
  'Corporate & established',
];

export const steps = [
  { id: 'basics', label: 'Basics', eyebrow: '01' },
  { id: 'strategy', label: 'Strategy', eyebrow: '02' },
  { id: 'scope', label: 'Scope', eyebrow: '03' },
  { id: 'brand', label: 'Brand', eyebrow: '04' },
  { id: 'content', label: 'Content', eyebrow: '05' },
  { id: 'logistics', label: 'Logistics', eyebrow: '06' },
  { id: 'review', label: 'Review', eyebrow: '07' },
] as const;
