export const studioName = process.env.NEXT_PUBLIC_STUDIO_NAME || 'Your Web Studio';
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@yourdomain.com';

export const projectTypes = [
  'A new business website',
  'A redesign of an existing site',
  'A personal brand',
  'A portfolio',
  'An online store',
  'A platform or web app',
  'Something else',
];

export const outcomeOptions = [
  'People book with me',
  'People buy from me',
  'People contact me',
  'People understand what I do',
  'People trust my business',
  'People join or sign up',
  'People view my work',
  'Something else',
];

export const actionOptions = [
  'Book an appointment',
  'Buy something',
  'Contact me',
  'Apply',
  'Sign up',
  'Create an account',
  'Download something',
  'Read articles',
  'Watch content',
  'View my work',
  'Pay invoices',
  'Take an assessment',
  'Something custom',
];

export const pageOptions = [
  'Home',
  'About',
  'Services',
  'Pricing',
  'Contact',
  'Testimonials',
  'Portfolio / work',
  'FAQ',
  'Resources',
  'Team',
  'Blog',
  'Booking',
  'Shop',
  'Client area',
  'Legal / policies',
];

export const feelingOptions = [
  'Confident',
  'Calm',
  'Excited',
  'Safe',
  'Curious',
  'Inspired',
  'Impressed',
  'Energized',
  'Luxurious',
  'Welcomed',
];

export const styleOptions = [
  'Minimal',
  'Editorial',
  'Bold',
  'Premium',
  'Playful',
  'Technical',
  'Organic',
  'Modern',
  'Warm',
  'Masculine',
  'Feminine',
  'Corporate',
  'Experimental',
  'Soft',
  'Dark',
];

export const assetOptions = [
  'Logo',
  'Brand colors',
  'Photography',
  'Written copy',
  'Testimonials',
  'Product photos',
  'Videos',
  'Domain',
  'Social accounts',
  'Nothing yet',
];

export const budgetRanges = [
  'Under $1,000',
  '$1,000–$2,500',
  '$2,500–$5,000',
  '$5,000–$10,000',
  '$10,000+',
  "I'm not sure — recommend what makes sense",
];

export const collaborationOptions = [
  {
    title: 'Very involved',
    copy: 'I want to review and shape things as they develop.',
  },
  {
    title: 'Collaborative',
    copy: 'Show me meaningful progress and I’ll give focused feedback.',
  },
  {
    title: 'Mostly hands-off',
    copy: 'Use the brief and bring me in when there is something meaningful to review.',
  },
];

export const steps = [
  { id: 'need', label: 'Need' },
  { id: 'purpose', label: 'Purpose' },
  { id: 'audience', label: 'Audience' },
  { id: 'function', label: 'Function' },
  { id: 'content', label: 'Content' },
  { id: 'identity', label: 'Identity' },
  { id: 'proof', label: 'Proof' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'collaboration', label: 'Together' },
  { id: 'review', label: 'Review' },
] as const;
