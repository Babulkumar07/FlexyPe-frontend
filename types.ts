
export enum ProofType {
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  TESTIMONIAL = 'testimonial',
  VIDEO = 'video',
  REVIEW = 'review'
}

export interface User {
  name: string;
  handle?: string;
  avatar: string;
  isVerified?: boolean;
}

export interface SocialProofItem {
  id: string;
  type: ProofType;
  user: User;
  content: string;
  rating?: number;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: string;
  sourceUrl: string;
  tags: string[];
}

export type FilterType = 'all' | ProofType;
