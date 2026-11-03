import { Book } from '../types/book';

export const BOOKS_DATA: Book[] = [
  // 1AP - Primary 1
  {
    id: 'book-1ap-arabic',
    educationLevelId: 'primary-1',
    title: {
      ar: 'كتابي في اللغة العربية',
      fr: 'Mon Livre d’Arabe',
      en: 'My Arabic Language Book'
    },
    subtitle: {
      ar: 'القراءة والكتابة والتعبير التواصلي',
      fr: 'Lecture, écriture et communication',
      en: 'Reading, writing and communication'
    },
    author: {
      ar: 'د. رشيد بنسالم ونخبة من المفتشين',
      fr: 'Dr. Rachid Bensalem et inspecteurs',
      en: 'Dr. Rachid Bensalem & Pedagogy Team'
    },
    subject: {
      ar: 'اللغة العربية',
      fr: 'Langue Arabe',
      en: 'Arabic Language'
    },
    isbn: '978-9954-1-0101-2',
    publishYear: 2024,
    price: 32.5,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.8,
    pagesCount: 128,
    coverStyle: {
      primaryColor: '#0f766e',
      secondaryColor: '#115e59',
      spineColor: '#134e4a',
      accentColor: '#2dd4bf',
      pattern: 'geometric',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.28 },
    synopsis: {
      ar: 'منهاج تربوي مصور ومبتكر لتعليم الأطفال الحروف والكلمات من خلال قصص شيقة ورسومات ملونة.',
      fr: 'Programme pédagogique illustré pour enseigner l’alphabet et les premiers mots avec plaisir.',
      en: 'An illustrated pedagogical curriculum teaching children letters and first words through stories.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'حرف الألف والباء', fr: 'Les Lettres Alif et Ba', en: 'Letters Alif & Ba' },
        content: {
          ar: 'أَنَا أَسَدٌ، أَرْنَبٌ يَجْرِي، بَيْتٌ جَمِيلٌ. رَدِّدْ مَعَ مُعَلِّمِكَ بِصَوْتٍ عَالٍ.',
          fr: 'Découverte des phonèmes initiaux avec illustrations vivantes et exercices guidés.',
          en: 'Phonics discovery with bright illustrations and guided interactive reading exercises.'
        }
      },
      {
        pageNumber: 2,
        title: { ar: 'تمارين التهجئة', fr: 'Exercices de syllabes', en: 'Spelling Exercises' },
        content: {
          ar: 'صِلْ بَيْنَ الْحَرْفِ وَالصُّورَةِ الْمُنَاسِبَةِ: (بَـ) بَطَّةٌ - (تَـ) تُفَّاحَةٌ.',
          fr: 'Associe la lettre à l’image correspondante pour enrichir ton vocabulaire.',
          en: 'Match letters with corresponding vibrant illustrations to expand vocabulary.'
        }
      },
      {
        pageNumber: 3,
        title: { ar: 'قصة الأرنب والسلحفاة', fr: 'Le Lièvre et la Tortue', en: 'The Hare & The Tortoise' },
        content: {
          ar: 'كَانَ يَا مَكَانَ، فِي قَدِيمِ الزَّمَانِ، أَرْنَبٌ مَغْرُورٌ يَتَبَاهَى بِسُرْعَتِهِ الْفَائِقَةِ.',
          fr: 'Conte moral classique invitant les élèves à la persévérance et au travail régulier.',
          en: 'Classic moral fable inspiring perseverance, patience, and joyful dedication.'
        }
      },
      {
        pageNumber: 4,
        title: { ar: 'أنشطة الفهم والتركيب', fr: 'Compréhension du texte', en: 'Comprehension & Activities' },
        content: {
          ar: 'أَجِبْ عَنِ الأَسْئِلَةِ: مَنْ فَازَ فِي السِّبَاقِ؟ وَمَاذَا تَعَلَّمْتَ مِنَ الْقِصَّةِ؟',
          fr: 'Questions guidées pour valider la mémorisation et la réflexion critique de l’élève.',
          en: 'Guided discussion questions evaluating critical thinking and reading mastery.'
        }
      }
    ]
  },
  {
    id: 'book-1ap-math',
    educationLevelId: 'primary-1',
    title: {
      ar: 'فضاء الرياضيات التفاعلي',
      fr: 'Espace Mathématiques Découverte',
      en: 'Interactive Mathematics Space'
    },
    subtitle: {
      ar: 'الأعداد من 0 إلى 99 والقياس والأشكال',
      fr: 'Nombres de 0 à 99, formes et grandeurs',
      en: 'Numbers 0 to 99, shapes and measurement'
    },
    author: {
      ar: 'أ. كريمة التازي',
      fr: 'Pr. Karima Tazi',
      en: 'Prof. Karima Tazi'
    },
    subject: {
      ar: 'الرياضيات',
      fr: 'Mathématiques',
      en: 'Mathematics'
    },
    isbn: '978-9954-1-0102-9',
    publishYear: 2024,
    price: 36.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.9,
    pagesCount: 144,
    coverStyle: {
      primaryColor: '#b45309',
      secondaryColor: '#92400e',
      spineColor: '#78350f',
      accentColor: '#fbbf24',
      pattern: 'classic',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.32 },
    synopsis: {
      ar: 'دليل الرياضيات الممتع والمشوق لتعلم العد والتصنيف ومبادئ الجمع والطرح المبسط.',
      fr: 'Manuel d’initiation aux mathématiques basé sur l’expérimentation ludique et les énigmes visuelles.',
      en: 'An engaging introduction to math with practical counting puzzles and spatial reasoning.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'مفهوم الجمع الأولي', fr: 'L’addition visuelle', en: 'Visual Addition' },
        content: {
          ar: 'تَفَّاحَتَانِ فِي السَّلَّةِ + ثَلَاثُ تَفَّاحَاتٍ = خَمْسُ تَفَّاحَاتٍ (2 + 3 = 5).',
          fr: 'Apprenez à regrouper les objets et à compter la somme totale avec aisance.',
          en: 'Learn to group objects together and compute totals using intuitive illustrations.'
        }
      }
    ]
  },
  {
    id: 'book-1ap-science',
    educationLevelId: 'primary-1',
    title: {
      ar: 'المفيد في النشاط العلمي',
      fr: 'L’Éveil Scientifique Utile',
      en: 'Everyday Scientific Discovery'
    },
    subtitle: {
      ar: 'الحواس الخمس، الحركة، والكائنات الحية',
      fr: 'Les 5 sens, le mouvement et la nature',
      en: 'The 5 senses, motion, and living things'
    },
    author: {
      ar: 'فريق خبراء البيداغوجيا العلمية',
      fr: 'Équipe Pédagogique des Sciences',
      en: 'Science Pedagogy Team'
    },
    subject: {
      ar: 'النشاط العلمي',
      fr: 'Sciences',
      en: 'Science'
    },
    isbn: '978-9954-1-0103-6',
    publishYear: 2024,
    price: 30.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.7,
    pagesCount: 96,
    coverStyle: {
      primaryColor: '#047857',
      secondaryColor: '#065f46',
      spineColor: '#064e3b',
      accentColor: '#34d399',
      pattern: 'science',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.25 },
    synopsis: {
      ar: 'تجارب بسيطة تحفز فضول الطفل الاستكشافي حول جسم الإنسان والبيئة المحيطة به.',
      fr: 'Expériences amusantes stimulant la curiosité de l’enfant sur la nature et le corps humain.',
      en: 'Fun hands-on experiments cultivating natural curiosity about the world and human senses.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'حواسي الخمس', fr: 'Mes cinq sens', en: 'My Five Senses' },
        content: {
          ar: 'أَرَى بِعَيْنِي، أَسْمَعُ بِأُذُنِي، أَتَذَوَّقُ بِلِسَانِي، أَشُمُّ بِأَنْفِي، وَأَلْمِسُ بِيَدِي.',
          fr: 'Observation et identification des organes des sens et de leur rôle protecteur.',
          en: 'Observe and identify sensory organs and their role in understanding our world.'
        }
      }
    ]
  },

  // 2AP - Primary 2
  {
    id: 'book-2ap-french',
    educationLevelId: 'primary-2',
    title: {
      ar: 'مساري في الفرنسية',
      fr: 'Mes Apprentissages en Français',
      en: 'French Language Journey'
    },
    subtitle: {
      ar: 'الاستماع والتحدث والقراءة المبكرة',
      fr: 'Oral, lecture guidée et écriture',
      en: 'Listening, speaking and early reading'
    },
    author: {
      ar: 'ميشيل ديبوا و وفاء الإدريسي',
      fr: 'Michel Dubois & Wafaa El Idrissi',
      en: 'Michel Dubois & Wafaa El Idrissi'
    },
    subject: {
      ar: 'اللغة الفرنسية',
      fr: 'Français',
      en: 'French'
    },
    isbn: '978-9954-1-0201-9',
    publishYear: 2024,
    price: 38.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.6,
    pagesCount: 120,
    coverStyle: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#1e40af',
      spineColor: '#1e3a8a',
      accentColor: '#60a5fa',
      pattern: 'academic',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.3 },
    synopsis: {
      ar: 'كتاب منهجي تفاعلي لتعلم الحوارات والعبارات الفرنسية اليومية بطريقة سلسة وممتعة.',
      fr: 'Méthode d’apprentissage du français articulée autour du dialogue vivant et des contes illustrés.',
      en: 'An immersive French curriculum focused on dynamic dialogues and illustrated short stories.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'في ساحة المدرسة', fr: 'Dans la cour de l’école', en: 'In the Schoolyard' },
        content: {
          ar: 'حوار بين أمين وسارة: «صباح الخير يا سارة! كيف حالك اليوم؟»',
          fr: 'Dialogue: « Bonjour Sarah ! Comment vas-tu ? — Bonjour Amine, je vais très bien ! »',
          en: 'Dialogue: "Good morning Sarah! How are you today? — Good morning Amine, I am doing great!"'
        }
      }
    ]
  },
  {
    id: 'book-2ap-arabic',
    educationLevelId: 'primary-2',
    title: {
      ar: 'مرشدي في اللغة العربية',
      fr: 'Mon Guide en Langue Arabe',
      en: 'My Guide in Arabic Language'
    },
    subtitle: {
      ar: 'القراءة المعبرة والظواهر اللغوية',
      fr: 'Lecture expressive et premières notions',
      en: 'Expressive reading and language foundations'
    },
    author: {
      ar: 'د. عبد القادر الفاسي',
      fr: 'Dr. Abdelkader El Fassi',
      en: 'Dr. Abdelkader El Fassi'
    },
    subject: {
      ar: 'اللغة العربية',
      fr: 'Langue Arabe',
      en: 'Arabic Language'
    },
    isbn: '978-9954-1-0202-6',
    publishYear: 2024,
    price: 35.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.9,
    pagesCount: 152,
    coverStyle: {
      primaryColor: '#4338ca',
      secondaryColor: '#3730a3',
      spineColor: '#312e81',
      accentColor: '#a5b4fc',
      pattern: 'classic',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.34 },
    synopsis: {
      ar: 'نصوص أدبية غنية بالأخلاق والقيم والتربية المدنية تعزز الرصيد المعجمي للطفل.',
      fr: 'Textes choisis pour fortifier le vocabulaire, la syntaxe et la compréhension de texte.',
      en: 'Selected reading texts nurturing cultural vocabulary and expressive linguistic fluidity.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'شجرة عائلتي', fr: 'Mon arbre généalogique', en: 'My Family Tree' },
        content: {
          ar: 'نَصٌّ تَطْبِيقِيٌّ يَصِفُ الروابط العائلية ودفء الاجتماع في بيت الجدين يوم العطلة.',
          fr: 'Texte narratif explorant l’entraide familiale et les souvenirs d’enfance.',
          en: 'A warm narrative text celebrating family bonds and intergenerational storytelling.'
        }
      }
    ]
  },

  // 3AP - Primary 3
  {
    id: 'book-3ap-math',
    educationLevelId: 'primary-3',
    title: {
      ar: 'المرجع في الرياضيات',
      fr: 'La Référence en Mathématiques',
      en: 'Mathematics Reference'
    },
    subtitle: {
      ar: 'الضرب والقسمة والهندسة المستوية',
      fr: 'Multiplication, division et géométrie',
      en: 'Multiplication, division and plane geometry'
    },
    author: {
      ar: 'أ.د. يوسف العلمي',
      fr: 'Pr. Youssef El Alami',
      en: 'Prof. Youssef El Alami'
    },
    subject: {
      ar: 'الرياضيات',
      fr: 'Mathématiques',
      en: 'Mathematics'
    },
    isbn: '978-9954-1-0301-6',
    publishYear: 2024,
    price: 42.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.8,
    pagesCount: 160,
    coverStyle: {
      primaryColor: '#7c2d12',
      secondaryColor: '#9a3412',
      spineColor: '#451a03',
      accentColor: '#fdba74',
      pattern: 'geometric',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.36 },
    synopsis: {
      ar: 'منهجية حديثة لحل المسائل الرياضية وبناء الجداول والتحويلات الهندسية.',
      fr: 'Résolution méthodique de problèmes et construction de figures géométriques fondamentales.',
      en: 'Methodical problem solving and essential geometric figures for developing logical acumen.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'جدول الضرب في 6 و 7', fr: 'Tables de multiplication', en: 'Multiplication Tables' },
        content: {
          ar: 'تَفْكِيكُ الْجُدَاءِ: 6 × 7 = (6 × 5) + (6 × 2) = 30 + 12 = 42.',
          fr: 'Décomposition du produit et stratégies mentales de calcul rapide.',
          en: 'Decomposing products and mastering mental speed calculation strategies.'
        }
      }
    ]
  },
  {
    id: 'book-3ap-french',
    educationLevelId: 'primary-3',
    title: {
      ar: 'واحة الكلمات الفرنسية',
      fr: 'L’Oasis des Mots',
      en: 'Oasis of French Words'
    },
    subtitle: {
      ar: 'القراءة والإنتاج الكتابي والمسرح',
      fr: 'Lecture, écriture et expression dramatique',
      en: 'Reading, creative writing and theatrical sketches'
    },
    author: {
      ar: 'فريق مفتشي اللغة الفرنسية',
      fr: 'Équipe d’Inspecteurs Pédagogiques',
      en: 'French Pedagogical Inspectors'
    },
    subject: {
      ar: 'اللغة الفرنسية',
      fr: 'Français',
      en: 'French'
    },
    isbn: '978-9954-1-0302-3',
    publishYear: 2024,
    price: 39.5,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.7,
    pagesCount: 140,
    coverStyle: {
      primaryColor: '#0284c7',
      secondaryColor: '#0369a1',
      spineColor: '#075985',
      accentColor: '#7dd3fc',
      pattern: 'modern',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.31 },
    synopsis: {
      ar: 'قصص وروايات قصيرة مشوقة تمكن التلميذ من تكوين فقرات متماسكة وقواعد لغوية سليمة.',
      fr: 'Lectures stimulantes développant l’imaginaire et la maîtrise de la structure de phrase.',
      en: 'Stimulating readings expanding narrative imagination and French sentence structure.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'مغامرة في الغابة', fr: 'Aventure en forêt', en: 'Forest Adventure' },
        content: {
          ar: 'قراءة نص قصير حول حماية الأشجار والتنوع البيولوجي في الطبيعة.',
          fr: 'Texte narratif sur la préservation de la biodiversité et le respect des arbres.',
          en: 'A narrative story exploring biodiversity preservation and forest ecology.'
        }
      }
    ]
  },

  // 4AP - Primary 4
  {
    id: 'book-4ap-social',
    educationLevelId: 'primary-4',
    title: {
      ar: 'النجاح في الاجتماعيات',
      fr: 'Réussir en Histoire-Géographie',
      en: 'Social Studies & Geography'
    },
    subtitle: {
      ar: 'التاريخ، الجغرافيا، والتربية المدنية',
      fr: 'Histoire, géographie et citoyenneté',
      en: 'History, geography and civics'
    },
    author: {
      ar: 'د. حسان المرابطي',
      fr: 'Dr. Hassan El Mourabiti',
      en: 'Dr. Hassan El Mourabiti'
    },
    subject: {
      ar: 'الاجتماعيات',
      fr: 'Histoire-Géo',
      en: 'Social Studies'
    },
    isbn: '978-9954-1-0401-3',
    publishYear: 2024,
    price: 45.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.9,
    pagesCount: 168,
    coverStyle: {
      primaryColor: '#701a75',
      secondaryColor: '#581c87',
      spineColor: '#3b0764',
      accentColor: '#e879f9',
      pattern: 'academic',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.38 },
    synopsis: {
      ar: 'أطلس تاريخي وجغرافي غني بالخرائط الوثائقية والآثار التاريخية والحضارات الإنسانية.',
      fr: 'Voyage à travers les époques historiques et cartographie du monde avec documents d’archives.',
      en: 'A vibrant journey through historical eras and global cartography with authentic archival maps.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'قراءة الخريطة والتضاريس', fr: 'Lire une carte géographique', en: 'Reading Topographic Maps' },
        content: {
          ar: 'مفتاح الخريطة، مقياس الرسم، والاتجاهات الجغرافية الأربعة الأساسية.',
          fr: 'Comprendre l’orientation, l’échelle et la légende cartographique moderne.',
          en: 'Understanding compass orientation, cartographic scales, and map legends.'
        }
      }
    ]
  },
  {
    id: 'book-4ap-math',
    educationLevelId: 'primary-4',
    title: {
      ar: 'الرياضيات الحديثة الشاملة',
      fr: 'Mathématiques Modernes 4AP',
      en: 'Modern Primary Math 4'
    },
    subtitle: {
      ar: 'الأعداد الكبيرة، الكسور، والقياسات المركبة',
      fr: 'Grands nombres, fractions et mesures',
      en: 'Large numbers, fractions and compound measures'
    },
    author: {
      ar: 'د. طارق العمراني',
      fr: 'Dr. Tarek El Omrani',
      en: 'Dr. Tarek El Omrani'
    },
    subject: {
      ar: 'الرياضيات',
      fr: 'Mathématiques',
      en: 'Mathematics'
    },
    isbn: '978-9954-1-0402-0',
    publishYear: 2024,
    price: 43.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.8,
    pagesCount: 160,
    coverStyle: {
      primaryColor: '#831843',
      secondaryColor: '#701a75',
      spineColor: '#4a044e',
      accentColor: '#f472b6',
      pattern: 'classic',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.35 },
    synopsis: {
      ar: 'شرح مفصل للكسور العشرية والعمليات الحسابية المتقدمة وحساب المساحات والمحيطات.',
      fr: 'Approfondissement des fractions décimales, surfaces et calculs de périmètres.',
      en: 'In-depth introduction to fractions, perimeter calculations, and polygon areas.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'الكسور المتكافئة', fr: 'Fractions équivalentes', en: 'Equivalent Fractions' },
        content: {
          ar: '1/2 = 2/4 = 4/8: التمثيل الهندسي للكسور على خط الأعداد.',
          fr: 'Visualisation graphique des fractions équivalentes et simplification.',
          en: 'Graphic representations of equivalent fractions and fraction reduction.'
        }
      }
    ]
  },

  // 5AP - Primary 5
  {
    id: 'book-5ap-arabic',
    educationLevelId: 'primary-5',
    title: {
      ar: 'المنير في اللغة العربية',
      fr: 'L’Éclairage en Langue Arabe',
      en: 'Illuminated Arabic Language'
    },
    subtitle: {
      ar: 'الصرف والتحويل والتراكيب والإملاء',
      fr: 'Grammaire approfondie, conjugaison et dictée',
      en: 'Morphology, grammar syntax, and spelling'
    },
    author: {
      ar: 'أ. د. فاطمة الزهراء الشريف',
      fr: 'Pr. Fatima Zahra Cherif',
      en: 'Prof. Fatima Zahra Cherif'
    },
    subject: {
      ar: 'اللغة العربية',
      fr: 'Langue Arabe',
      en: 'Arabic Language'
    },
    isbn: '978-9954-1-0501-0',
    publishYear: 2024,
    price: 46.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.9,
    pagesCount: 176,
    coverStyle: {
      primaryColor: '#991b1b',
      secondaryColor: '#7f1d1d',
      spineColor: '#450a0a',
      accentColor: '#f87171',
      pattern: 'academic',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.39 },
    synopsis: {
      ar: 'مرجع شامل في قواعد اللغة العربية والصرف ونصوص الإنشاء والتحليل البلاغي.',
      fr: 'Ouvrage d’excellence couvrant l’ensemble des règles grammaticales et stylistiques arabes.',
      en: 'Comprehensive reference text on classical Arabic grammar, syntax, and rhetorical essays.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'المفعول المطلق والمفعول لأجله', fr: 'Compléments d’objet et de cause', en: 'Verbal Cognates & Complements' },
        content: {
          ar: 'شَرِبْتُ الْمَاءَ شُرْبًا (مفعول مطلق) - وَقَفْتُ إِجْلَالًا لِلْمُعَلِّمِ (مفعول لأجله).',
          fr: 'Structure de la phrase et analyse des compléments circonstanciels.',
          en: 'Sentence anatomy and precise contextual noun complement parsing.'
        }
      }
    ]
  },
  {
    id: 'book-5ap-science',
    educationLevelId: 'primary-5',
    title: {
      ar: 'الواضح في العلوم والبيئة',
      fr: 'Sciences et Écologie 5AP',
      en: 'Science & Planetary Ecology'
    },
    subtitle: {
      ar: 'الطاقة، الدوائر الكهربائية، والتوازن البيئي',
      fr: 'Énergie, circuits électriques et écosystèmes',
      en: 'Energy, electrical circuits and ecosystems'
    },
    author: {
      ar: 'د. كمال بلقاسم',
      fr: 'Dr. Kamal Belkacem',
      en: 'Dr. Kamal Belkacem'
    },
    subject: {
      ar: 'النشاط العلمي',
      fr: 'Sciences',
      en: 'Science'
    },
    isbn: '978-9954-1-0502-7',
    publishYear: 2024,
    price: 41.5,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.8,
    pagesCount: 144,
    coverStyle: {
      primaryColor: '#065f46',
      secondaryColor: '#047857',
      spineColor: '#064e3b',
      accentColor: '#6ee7b7',
      pattern: 'science',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.33 },
    synopsis: {
      ar: 'تجارب عملية مشوقة لتركيب الدارات الكهربائية ودراسة السلاسل الغذائية وحماية الكوكب.',
      fr: 'Expérimentations de circuits électriques simples et étude approfondie des chaînes trophiques.',
      en: 'Circuit wiring workshops, ecosystem food webs, and practical climate preservation studies.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'الدارة الكهربائية البسيطة', fr: 'Le circuit électrique', en: 'Simple Electric Circuits' },
        content: {
          ar: 'تتكون الدارة المغلقة من: مولد (بطارية)، مصباح، قاطع تيار، وأسلاك توصيل نحاسية.',
          fr: 'Composants du circuit électrique: pile, interrupteur, ampoule et fils conducteurs.',
          en: 'Core circuit components: power cell, toggle switch, lamp, and copper conductors.'
        }
      }
    ]
  },

  // 6AP - Primary 6
  {
    id: 'book-6ap-math',
    educationLevelId: 'primary-6',
    title: {
      ar: 'الجديد في الرياضيات — شهادة الابتدائي',
      fr: 'Nouveau Mathématiques 6AP',
      en: 'Advanced Primary Mathematics 6'
    },
    subtitle: {
      ar: 'التناسبية، النسبة المئوية، والمجسمات الفضائية',
      fr: 'Proportionnalité, pourcentages et volumes 3D',
      en: 'Proportionality, percentages and 3D solids'
    },
    author: {
      ar: 'لجنة الامتحانات الوطنية الموحدة',
      fr: 'Comité National des Examens',
      en: 'National Examination Board'
    },
    subject: {
      ar: 'الرياضيات',
      fr: 'Mathématiques',
      en: 'Mathematics'
    },
    isbn: '978-9954-1-0601-7',
    publishYear: 2024,
    price: 48.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.9,
    pagesCount: 192,
    coverStyle: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#172554',
      spineColor: '#0f172a',
      accentColor: '#38bdf8',
      pattern: 'geometric',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.42 },
    synopsis: {
      ar: 'الكتاب المعتمد للتحضير للامتحان الإشهادي الموحد لنيل شهادة الدروس الابتدائية.',
      fr: 'Manuel de référence pour la préparation à l’examen certificatif de fin d’études primaires.',
      en: 'Standard certified handbook preparing students for final primary graduation exams.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'حساب الحجوم والمساحات الكلية', fr: 'Calcul des volumes et aires', en: '3D Volume & Surface Calculations' },
        content: {
          ar: 'حجم متوازي المستطيلات = الطول × العرض × الارتفاع (V = L × l × h).',
          fr: 'Formules de calcul des volumes pour le cube, pavé droit et cylindre.',
          en: 'Formulas and derivations for computing cubes, rectangular prisms, and cylinder volumes.'
        }
      }
    ]
  },
  {
    id: 'book-6ap-french',
    educationLevelId: 'primary-6',
    title: {
      ar: 'الفرنسية للجميع — السنة السادسة',
      fr: 'Le Français Pratique 6AP',
      en: 'French Mastery 6'
    },
    subtitle: {
      ar: 'التحليل الأدبي والإنشاء والتواصل الشفهي',
      fr: 'Compréhension textuelle, essai et expression',
      en: 'Textual analysis, essays and fluency'
    },
    author: {
      ar: 'د. سيلفي موران و عبد الحق الشرايبي',
      fr: 'Dr. Sylvie Morin & Abdelhak Chraibi',
      en: 'Dr. Sylvie Morin & Abdelhak Chraibi'
    },
    subject: {
      ar: 'اللغة الفرنسية',
      fr: 'Français',
      en: 'French'
    },
    isbn: '978-9954-1-0602-4',
    publishYear: 2024,
    price: 46.5,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.8,
    pagesCount: 180,
    coverStyle: {
      primaryColor: '#581c87',
      secondaryColor: '#3b0764',
      spineColor: '#2e1065',
      accentColor: '#c084fc',
      pattern: 'modern',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.4, height: 1.9, depth: 0.39 },
    synopsis: {
      ar: 'نصوص أدبية مختارة ومقالات فكرية تثري الحصيلة الثقافية وتعلم أصول التحرير والمناظرة.',
      fr: 'Textes d’auteurs classiques et contemporains avec fiches méthodologiques de rédaction.',
      en: 'Anthology of modern and classic prose with systematic essay composition templates.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'كتابة نص حجاجي', fr: 'Rédiger un texte argumentatif', en: 'Writing an Argumentative Essay' },
        content: {
          ar: 'بناء الأطروحة، تقديم الحجج والبراهين المنطقية، وصياغة خاتمة مقنعة.',
          fr: 'Méthodologie: introduction, thèse, arguments structurés avec connecteurs logiques.',
          en: 'Essay roadmap: thesis statement, connective transitions, and substantiated conclusions.'
        }
      }
    ]
  },

  // Secondary
  {
    id: 'book-sec-physics',
    educationLevelId: 'secondary-1',
    title: {
      ar: 'الفيزياء والكيمياء التجريبية',
      fr: 'Physique-Chimie Expérimentale',
      en: 'Experimental Physics & Chemistry'
    },
    subtitle: {
      ar: 'الميكانيكا الكلاسيكية والبصريات والتفاعلات الكيميائية',
      fr: 'Mécanique newtonienne, optique et chimie',
      en: 'Newtonian mechanics, optics and chemical reactions'
    },
    author: {
      ar: 'أ. د. عمر الفيلالي',
      fr: 'Pr. Omar El Filali',
      en: 'Prof. Omar El Filali'
    },
    subject: {
      ar: 'الفيزياء والكيمياء',
      fr: 'Physique-Chimie',
      en: 'Physics & Chemistry'
    },
    isbn: '978-9954-2-0101-8',
    publishYear: 2024,
    price: 65.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 5.0,
    pagesCount: 260,
    coverStyle: {
      primaryColor: '#0f172a',
      secondaryColor: '#1e293b',
      spineColor: '#020617',
      accentColor: '#38bdf8',
      pattern: 'science',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.5, height: 2.1, depth: 0.48 },
    synopsis: {
      ar: 'كتاب أكاديمي شامل يقدم المبادئ الفيزيائية الكونية وقوانين نيوتن وحركية التفاعلات.',
      fr: 'Manuel de référence pour le lycée: lois fondamentales de la dynamique, optique géométrique et bilan de matière.',
      en: 'Comprehensive secondary textbook covering classical mechanics, wave optics, and reaction kinetics.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'قوانين نيوتن في الحركة', fr: 'Lois de Newton du mouvement', en: 'Newton’s Laws of Motion' },
        content: {
          ar: 'القانون الثاني لنيوتن: مجموع القوى الخارجية يساوي جداء الكتلة في التسارع (∑F = m·a).',
          fr: 'Énoncé fondamental: la somme vectorielle des forces est proportionnelle à l’accélération.',
          en: 'The fundamental law of dynamics: the net vector force equals mass times acceleration.'
        }
      }
    ]
  },
  {
    id: 'book-sec-philosophy',
    educationLevelId: 'secondary-1',
    title: {
      ar: 'في رحاب الفلسفة والفكر النقدي',
      fr: 'Dans le Monde de la Philosophie',
      en: 'Foundations of Philosophy & Critical Thought'
    },
    subtitle: {
      ar: 'الوجود، المعرفة، الأخلاق، والسياسة',
      fr: 'L’existence, la connaissance et l’éthique',
      en: 'Existence, epistemology and political ethics'
    },
    author: {
      ar: 'د. عز الدين الخطابي',
      fr: 'Dr. Ezzeddine El Khattabi',
      en: 'Dr. Ezzeddine El Khattabi'
    },
    subject: {
      ar: 'الفلسفة',
      fr: 'Philosophie',
      en: 'Philosophy'
    },
    isbn: '978-9954-2-0102-5',
    publishYear: 2024,
    price: 55.0,
    currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
    rating: 4.9,
    pagesCount: 224,
    coverStyle: {
      primaryColor: '#312e81',
      secondaryColor: '#1e1b4b',
      spineColor: '#0f0e26',
      accentColor: '#e5b364',
      pattern: 'classic',
      textColor: '#ffffff'
    },
    dimensions: { width: 1.5, height: 2.1, depth: 0.44 },
    synopsis: {
      ar: 'استكشاف عميق لمفاهيم الحرية والعدالة والوعي الفردي وتطور الفكر الإنساني عبر العصور.',
      fr: 'Exploration des grands débats philosophiques: de la conscience à la justice et la liberté.',
      en: 'Deep examination of classic epistemology, ethics, social contracts, and the history of thought.'
    },
    samplePages: [
      {
        pageNumber: 1,
        title: { ar: 'الوعي واللاوعي', fr: 'La conscience et l’inconscient', en: 'Consciousness & The Mind' },
        content: {
          ar: 'تأملات في الكوجيطو الديكارتي: «أنا أفكر، إذن أنا موجود» ومدارس التحليل النفسي الحديث.',
          fr: 'Analyse du doute cartésien et des théories modernes de la perception et de la vérité.',
          en: 'Analysis of Cartesian foundationalism and modern psychological conceptions of self.'
        }
      }
    ]
  }
];
