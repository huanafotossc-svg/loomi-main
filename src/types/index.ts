// User Types
export type UserRole = 'creator' | 'hotel' | 'admin';
export type VisualTag = 'photographer' | 'videomaker' | 'creator';
export type CreatorType = 'creator' | 'pro';
export type JobType = 'permuta' | 'cache' | 'hibrido';
export type JobStatus = 'active' | 'paused' | 'closed' | 'completed';
export type ApplicationStatus = 'sent' | 'under_review' | 'accepted' | 'rejected' | 'delivered' | 'approved';
export type DeliveryStatus = 'pending' | 'in_review' | 'approved' | 'needs_revision';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  tags?: VisualTag[];
  creatorType?: CreatorType;
  location?: string;
  bio?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Creator extends User {
  role: 'creator';
  tags: VisualTag[];
  creatorType: CreatorType;
  portfolio: PortfolioItem[];
  equipment: EquipmentTag[];
  styles: StyleTag[];
  rating: number;
  reviewCount: number;
  completedJobs: number;
  earnings: {
    cash: number;
    travelSavings: number;
  };
  availability: Availability;
}

export interface Hotel extends User {
  role: 'hotel';
  propertyType: string;
  address: string;
  city: string;
  state: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  mediaValue: number;
  estimatedSavings: number;
  rooms: number;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  images: string[];
  folder: string;
  tags: string[];
  createdAt: Date;
}

export type EquipmentTag = 'drone' | '4k' | 'gimbal' | 'lighting' | 'underwater' | '360' | 'dslr';
export type StyleTag = 'hotelaria' | 'lifestyle' | 'arquitetura' | 'gastronomia' | 'natureza' | 'aereo';

export interface Availability {
  dates: Date[];
  isFlexible: boolean;
}

// Job Types
export interface Job {
  id: string;
  hotelId: string;
  hotel?: Hotel;
  title: string;
  description: string;
  type: JobType;
  status: JobStatus;
  location: string;
  createdAt: Date;
  deadline?: Date;
  stayDates?: {
    checkIn: Date;
    checkOut: Date;
  };
  requirements: {
    equipment: EquipmentTag[];
    deliverables: Deliverable[];
    notes?: string;
  };
  benefits: {
    cashValue?: number;
    budgetRange?: {
      min: number;
      max: number;
    };
    stayNights?: number;
    extras?: string[];
    accommodationDetails?: {
      category: string;
      customName?: string;
      amenities: string[];
    };
  };
  applicationsCount: number;
  coverImage: string;
  gallery: string[];
}

export interface Deliverable {
  type: 'photos' | 'reels' | 'drone' | 'institutional' | 'tour';
  quantity: number;
  description?: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  creatorId: string;
  creator?: Creator;
  message: string;
  status: ApplicationStatus;
  proposedDates?: Date[];
  portfolioItems: string[];
  proposedAmount?: number;
  proposedJustification?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chat Types
export interface Chat {
  id: string;
  jobId: string;
  job?: Job;
  hotelId: string;
  hotel?: Hotel;
  creatorId: string;
  creator?: Creator;
  messages: Message[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'creator' | 'hotel';
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: Date;
  isRead: boolean;
}

// Delivery Types
export interface Delivery {
  id: string;
  jobId: string;
  applicationId: string;
  creatorId: string;
  previews: PreviewFile[];
  externalLink?: string;
  status: DeliveryStatus;
  notes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  feedback?: string;
}

export interface PreviewFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  thumbnail?: string;
}

// Review Types
export interface Review {
  id: string;
  jobId: string;
  fromId: string;
  fromType: 'creator' | 'hotel';
  toId: string;
  toType: 'creator' | 'hotel';
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Notification Types
export type NotificationType = 'job' | 'message' | 'application' | 'approval' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

// Filter Types
export interface JobFilters {
  type?: JobType[];
  location?: string;
  equipment?: EquipmentTag[];
  style?: StyleTag[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Analytics Types
export interface HotelAnalytics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  mediaValueGenerated: number;
  estimatedSavings: number;
  completedProjects: number;
  averageRating: number;
  monthlyStats: MonthlyStat[];
}

export interface MonthlyStat {
  month: string;
  jobs: number;
  applications: number;
  mediaValue: number;
}

// Wizard Types
export interface JobWizardData {
  step: number;
  needs: {
    photos: boolean;
    reels: boolean;
    drone: boolean;
    institutional: boolean;
  };
  objective: 'visibility' | 'professional';
  payment: {
    type: JobType;
    cashValue?: number;
    stayNights?: number;
    extras?: string[];
  };
  deliverables: Deliverable[];
  requirements: {
    equipment: EquipmentTag[];
    notes: string;
  };
  dates: {
    checkIn?: Date;
    checkOut?: Date;
    deadline?: Date;
  };
}

// Earnings Types
export interface EarningsData {
  totalCash: number;
  totalTravelSavings: number;
  monthlyEarnings: MonthlyEarning[];
  recentTransactions: Transaction[];
}

export interface MonthlyEarning {
  month: string;
  cash: number;
  travel: number;
}

export interface Transaction {
  id: string;
  type: 'cash' | 'permuta';
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed';
}

// Team Types
export interface TeamMember {
  id: string;
  hotelId: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'manager' | 'viewer';
  permissions: Permission[];
  joinedAt: Date;
}

export type Permission = 'jobs_create' | 'jobs_edit' | 'jobs_delete' | 'applications_view' | 'applications_approve' | 'billing_view' | 'billing_manage' | 'team_manage';

// Billing Types
export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
}

export interface Invoice {
  id: string;
  hotelId: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  paidAt?: Date;
  pdfUrl?: string;
}

export interface Contract {
  id: string;
  applicationId: string;
  jobId: string;
  hotelId: string;
  creatorId: string;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  terms: string;
  signedAt: Date;
  createdAt: Date;
}
