import { EducationLevel } from '../types/education';

export const EDUCATION_LEVELS: EducationLevel[] = [
  {
    id: 'primary-1',
    code: '1AP',
    order: 1,
    shelfIndex: 0,
    tier: 'primary',
    name: {
      ar: 'السنة الأولى ابتدائي',
      fr: '1ère Année Primaire',
      en: '1st Year Primary'
    },
    shortName: {
      ar: 'الأولى ابتدائي',
      fr: '1ère AP',
      en: '1st Primary'
    },
    description: {
      ar: 'مرحلة الاكتشاف والتعلم التأسيسي في القراءة والحساب والنشاط العلمي',
      fr: 'Apprentissage fondamental de la lecture, du calcul et de l’éveil scientifique',
      en: 'Foundational learning in reading, arithmetic, and basic discovery'
    },
    badgeColor: '#10b981',
    accentColor: '#34d399'
  },
  {
    id: 'primary-2',
    code: '2AP',
    order: 2,
    shelfIndex: 1,
    tier: 'primary',
    name: {
      ar: 'السنة الثانية ابتدائي',
      fr: '2ème Année Primaire',
      en: '2nd Year Primary'
    },
    shortName: {
      ar: 'الثانية ابتدائي',
      fr: '2ème AP',
      en: '2nd Primary'
    },
    description: {
      ar: 'تطوير المهارات اللغوية والرياضية والتعبير التواصلي',
      fr: 'Développement des compétences linguistiques, mathématiques et d’expression',
      en: 'Developing language, mathematical reasoning, and communication skills'
    },
    badgeColor: '#0ea5e9',
    accentColor: '#38bdf8'
  },
  {
    id: 'primary-3',
    code: '3AP',
    order: 3,
    shelfIndex: 2,
    tier: 'primary',
    name: {
      ar: 'السنة الثالثة ابتدائي',
      fr: '3ème Année Primaire',
      en: '3rd Year Primary'
    },
    shortName: {
      ar: 'الثالثة ابتدائي',
      fr: '3ème AP',
      en: '3rd Primary'
    },
    description: {
      ar: 'الانتقال إلى القراءة الاستيعابية وقواعد اللغة والعلوم التجريبية',
      fr: 'Transition vers la lecture de compréhension, la grammaire et les sciences',
      en: 'Transition to comprehensive reading, grammar, and observational sciences'
    },
    badgeColor: '#6366f1',
    accentColor: '#818cf8'
  },
  {
    id: 'primary-4',
    code: '4AP',
    order: 4,
    shelfIndex: 3,
    tier: 'primary',
    name: {
      ar: 'السنة الرابعة ابتدائي',
      fr: '4ème Année Primaire',
      en: '4th Year Primary'
    },
    shortName: {
      ar: 'الرابعة ابتدائي',
      fr: '4ème AP',
      en: '4th Primary'
    },
    description: {
      ar: 'ترسيخ المفاهيم الرياضية المعمقة والتاريخ والجغرافيا واللغات',
      fr: 'Consolidation des concepts mathématiques, histoire-géo et langues vivantes',
      en: 'Consolidating mathematical concepts, geography, history, and languages'
    },
    badgeColor: '#8b5cf6',
    accentColor: '#a78bfa'
  },
  {
    id: 'primary-5',
    code: '5AP',
    order: 5,
    shelfIndex: 4,
    tier: 'primary',
    name: {
      ar: 'السنة الخامسة ابتدائي',
      fr: '5ème Année Primaire',
      en: '5th Year Primary'
    },
    shortName: {
      ar: 'الخامسة ابتدائي',
      fr: '5ème AP',
      en: '5th Primary'
    },
    description: {
      ar: 'التحضير لشهادة التعليم الابتدائي والتحليل العلمي والإنشاء',
      fr: 'Préparation et maîtrise de la rédaction, analyse et sciences appliquées',
      en: 'Advanced synthesis, essay composition, and applied science concepts'
    },
    badgeColor: '#ec4899',
    accentColor: '#f472b6'
  },
  {
    id: 'primary-6',
    code: '6AP',
    order: 6,
    shelfIndex: 5,
    tier: 'primary',
    name: {
      ar: 'السنة السادسة ابتدائي',
      fr: '6ème Année Primaire',
      en: '6th Year Primary'
    },
    shortName: {
      ar: 'السادسة ابتدائي',
      fr: '6ème AP',
      en: '6th Primary'
    },
    description: {
      ar: 'إتمام المرحلة الابتدائية والتمكن من الكفايات المنهجية الأساسية',
      fr: 'Cycle d’achèvement du primaire et maîtrise des compétences méthodologiques',
      en: 'Completion of primary cycle with focus on methodological competency'
    },
    badgeColor: '#f97316',
    accentColor: '#fb923c'
  },
  {
    id: 'secondary-1',
    code: '1AS',
    order: 7,
    shelfIndex: 6,
    tier: 'secondary',
    name: {
      ar: 'التعليم الثانوي',
      fr: 'Enseignement Secondaire',
      en: 'Secondary Education'
    },
    shortName: {
      ar: 'الثانوي',
      fr: 'Secondaire',
      en: 'Secondary'
    },
    description: {
      ar: 'المناهج المتخصصة في العلوم الدقيقة والآداب والعلوم الإنسانية والتكنولوجيا',
      fr: 'Filières spécialisées en sciences exactes, lettres et technologies',
      en: 'Specialized disciplines in exact sciences, literature, humanities and tech'
    },
    badgeColor: '#d97706',
    accentColor: '#fbbf24'
  }
];
