import { Book } from '../types/book';
import { GlassyCarouselItem } from '../components/ui/glassy-coverflow-carousel';
import { Language } from '../types/education';

// Real, tested Unsplash high-resolution book / education cover photos
const BOOK_COVER_IMAGES: Record<string, string> = {
  'book-1ap-arabic': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'book-1ap-math': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
  'book-1ap-science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  'book-1ap-islamic': 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
  'book-1ap-art': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
  'book-2ap-french': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'book-2ap-arabic': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'book-2ap-math': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  'book-2ap-science': 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
  'book-3ap-math': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
  'book-3ap-french': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
  'book-3ap-arabic': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  'book-3ap-science': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
  'book-4ap-social': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
  'book-4ap-math': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'book-4ap-arabic': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  'book-4ap-french': 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80',
  'book-5ap-arabic': 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80',
  'book-5ap-science': 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80',
  'book-5ap-math': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'book-5ap-social': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
  'book-6ap-math': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  'book-6ap-french': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
  'book-6ap-arabic': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  'book-6ap-science': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
  'book-sec-physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
  'book-sec-philosophy': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
  'book-sec-math': 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80',
  'book-sec-svt': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
  'book-sec-english': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
};

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80';

export function bookToCarouselItem(book: Book, lang: Language): GlassyCarouselItem {
  const title = book.title[lang] || book.title.ar;
  const subtitle = `${book.subject[lang] || book.subject.ar} · ${book.price} ${book.currency[lang] || book.currency.ar}`;
  const description = book.synopsis[lang] || book.synopsis.ar;
  const image = BOOK_COVER_IMAGES[book.id] || DEFAULT_COVER_IMAGE;
  const accent = book.coverStyle.accentColor || book.coverStyle.primaryColor || '#e5b364';

  return {
    id: book.id,
    title,
    subtitle,
    image,
    accent,
    description,
    href: `#book-${book.id}`,
    linkLabel: lang === 'ar' ? 'فحص الكتاب بالأبعاد الثلاثية' : lang === 'fr' ? 'Examiner le livre en 3D' : 'Inspect Book in 3D'
  };
}
