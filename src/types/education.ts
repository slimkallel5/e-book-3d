export type Language = 'ar' | 'fr' | 'en';

export interface LocalizedString {
  ar: string;
  fr: string;
  en: string;
}

export type EducationTier = 'primary' | 'secondary' | 'preparatory';

export interface EducationLevel {
  id: string;
  code: string;
  name: LocalizedString;
  shortName: LocalizedString;
  description: LocalizedString;
  tier: EducationTier;
  order: number;
  shelfIndex: number;
  badgeColor: string;
  accentColor: string;
}
