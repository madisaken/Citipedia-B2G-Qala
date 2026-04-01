
export type Language = 'en' | 'ru';
export type Theme = 'light' | 'dark'; // Note: theme is handled by class 'dark' on html

export type UserRole = 'steward' | 'owner' | 'analyst' | 'admin';

export interface User {
  name: string;
  email: string;
  department: string;
  role: string;
  userRole: UserRole;
  avatar?: string;
}

export interface UserReview {
  id: string;
  userName: string;
  department: { en: string; ru: string };
  rating: number;
  comment: string;
  date: string;
}

export interface ExpertAssessment {
  expertName: string;
  accuracy: number;
  relevance: number;
  comment: { en: string; ru: string };
  stewardReview: 'approved' | 'pending' | 'challenged';
  stewardComment?: { en: string; ru: string };
  lastAssessed: string;
  date: string;
}

export type DataFormat = 'SHP' | 'GeoJSON' | 'GeoTIFF' | 'CSV' | 'Excel' | 'PDF' | 'JSON' | 'GTFS' | 'PostGIS' | 'API';
export type DataType = 'Geodata' | 'Table' | 'Document' | 'Raster' | 'Stream';
export type UpdateFrequency = 'Realtime' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Once' | 'As needed';
export type AccessLevel = 'Open' | 'By Request' | 'Restricted';

export interface Dataset {
  id: string;
  name: { en: string; ru: string };
  description: { en: string; ru: string };
  departmentId: string;
  domainId: string;
  categoryId: string;
  type: DataType;
  format: DataFormat;
  qualityScore: number;
  lastUpdated: string;
  frequency: UpdateFrequency;
  access: AccessLevel;
  status: 'active' | 'archived' | 'draft';
  isPrivate: boolean;
  tags: string[];
  popularity?: number;
  ownerName?: string;
  userRating?: number;
  userReviewsCount?: number;
  completenessScore?: number;
  // Extended metadata for Passport
  steward?: { en: string; ru: string; role: { en: string; ru: string }; email: string; phone: string };
  volume?: string;
  crs?: string;
  source?: { en: string; ru: string };
  publishedDate?: string;
  license?: { en: string; ru: string };
  coverageArea?: string; // GeoJSON or similar
  schema?: DataField[];
  lineage?: {
    sources: LineageNode[];
    consumers: LineageNode[];
  };
  previewRows?: any[];
  statistics?: {
    totalRecords: number;
    min?: number;
    max?: number;
    avg?: number;
    sum?: number;
    unit?: { en: string; ru: string };
  };
  expertAssessment?: ExpertAssessment;
  userReviews?: UserReview[];
}

export interface DataField {
  id: number;
  name: string;
  type: string;
  description: { en: string; ru: string };
  example: string;
  required: boolean;
  completeness: number;
  source?: 'auto' | 'owner' | 'steward' | 'system' | 'manual';
}

export interface LineageNode {
  id: string;
  name: { en: string; ru: string };
  type: 'external' | 'internal' | 'system' | 'analysis' | 'report';
  owner: { en: string; ru: string };
  method?: { en: string; ru: string };
  frequency?: { en: string; ru: string };
}

export interface Domain {
  id: string;
  name: { en: string; ru: string };
  icon: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: { en: string; ru: string };
}

export interface Department {
  id: string;
  name: { en: string; ru: string };
}

export interface GovernanceTask {
  id: string;
  title: { en: string; ru: string };
  datasetId: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
}
