export interface Speaker {
  id: number;
  name: string;
  title_fr: string;
  title_en: string;
  category_fr: string;
  category_en: string;
  image_url: string;
  twitter_url?: string;
  linkedin_url?: string;
  is_active: boolean;
  display_order: number;
}

export interface ProgramItem {
    id: number;
    day: number;
    start_time: string;
    end_time: string;
    title_fr: string;
    title_en: string;
    description_fr?: string;
    description_en?: string;
    icon_class?: string;
    is_active: boolean;
}

export interface Sponsor {
    id: number;
    name: string;
    logo_url: string;
    website_url?: string;
    tier: 'platinum' | 'gold' | 'silver' | 'community';
    display_order: number;
    is_active: boolean;
}

export interface TeamMember {
    id: number;
    name: string;
    role_fr: string;
    role_en: string;
    image_url: string;
    linkedin_url?: string;
    twitter_url?: string;
    display_order: number;
    is_active: boolean;
}

export interface Faq {
    id: number;
    question_fr: string;
    question_en: string;
    answer_fr: string;
    answer_en: string;
    category: string;
    display_order: number;
    is_active: boolean;
}

export interface GalleryImage {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    image_date?: string;
    display_order: number;
    is_active: boolean;
}

export interface Testimonial {
    id: number;
    author_name: string;
    author_title_fr: string;
    author_title_en: string;
    author_image_url?: string;
    quote_fr: string;
    quote_en: string;
    display_order: number;
    is_active: boolean;
}

export interface SeoSettings {
    seo_meta_title_fr: string;
    seo_meta_title_en: string;
    seo_meta_description_fr: string;
    seo_meta_description_en: string;
    seo_meta_keywords_fr: string;
    seo_meta_keywords_en: string;
}

export interface Registration {
    job_title: string;
    country: string;
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    pass_type: string;
    registration_date: string;
    is_checked_in?: boolean; // New field
    check_in_time?: string;  // New field
}

export interface PassType {
    id: number;
    name_fr: string;
    name_en: string;
    description_fr: string;
    description_en: string;
    price_fr: string;
    price_en: string;
    features_fr: string[];
    features_en: string[];
    tag_fr?: string;
    tag_en?: string;
    is_active: boolean;
    display_order: number;
}