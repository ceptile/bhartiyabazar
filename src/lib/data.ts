export type Category = {
  id: string;
  name: string;
  slug: string;
  iconPath: string;
  color: string;
  bg: string;
};

export type Business = {
  id: string; name: string; slug: string; category: string; categorySlug: string;
  description: string; shortDesc: string; city: string; area: string; state: string;
  phone: string; whatsapp: string; email: string; website?: string;
  rating: number; reviewCount: number; verified: boolean; featured: boolean;
  trustScore: number; responseTime: string; images: string[];
  tags: string[]; openNow: boolean; established: number; employees: string;
  products: Product[]; reviews: Review[]; services: string[];
  address: string; pincode: string; lat?: number; lng?: number;
  promoted?: boolean; badge?: string;
};

export type Product = {
  id: string; name: string; price: number; originalPrice?: number;
  image: string; category: string; inStock: boolean; unit?: string;
};

export type Review = {
  id: string; author: string; avatar: string; rating: number;
  text: string; date: string; helpful: number; verified: boolean;
};

export type Testimonial = {
  id: string; name: string; city: string; role: string;
  business: string; text: string; avatar: string; rating: number;
};

export const categoryIcons: Record<string, string> = {
  restaurants: 'M3 2v7c0 1.1.9 2 2 2h4v13h2V2H3zm16 0h-2v4h-2V2h-2v13h2v7h2v-7h2V2z',
  electronics: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
  health: 'M22 12h-4l-3 9L9 3l-3 9H2',
  'home-services': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  education: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  salons: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  auto: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5 M14 17H9 M17 17h.01 M6 17h.01 M3 9h18',
  fashion: 'M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z',
  grocery: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0',
  jewellery: 'M12 2l3 7h7l-5.5 4.5 2 7L12 17l-6.5 3.5 2-7L2 9h7z',
  'real-estate': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  events: 'M8 2v4 M16 2v4 M3 10h18 M21 6H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z',
  fitness: 'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3',
  travel: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  photography: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  legal: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

export const categories: Category[] = [
  { id:'1',  name:'Restaurants & Food',   slug:'restaurants',   iconPath: categoryIcons.restaurants,              color:'#FF6B35', bg:'rgba(255,107,53,0.08)' },
  { id:'2',  name:'Electronics & Repair', slug:'electronics',   iconPath: categoryIcons.electronics,              color:'#4F8EF7', bg:'rgba(79,142,247,0.08)' },
  { id:'3',  name:'Health & Doctors',     slug:'health',        iconPath: categoryIcons.health,                   color:'#00D68F', bg:'rgba(0,214,143,0.08)' },
  { id:'4',  name:'Home Services',        slug:'home-services', iconPath: categoryIcons['home-services'],          color:'#FFB800', bg:'rgba(255,184,0,0.08)' },
  { id:'5',  name:'Education & Tutors',   slug:'education',     iconPath: categoryIcons.education,                color:'#8B5CF6', bg:'rgba(139,92,246,0.08)' },
  { id:'6',  name:'Salons & Beauty',      slug:'salons',        iconPath: categoryIcons.salons,                   color:'#EC4899', bg:'rgba(236,72,153,0.08)' },
  { id:'7',  name:'Auto & Vehicles',      slug:'auto',          iconPath: categoryIcons.auto,                     color:'#14B8A6', bg:'rgba(20,184,166,0.08)' },
  { id:'8',  name:'Clothing & Fashion',   slug:'fashion',       iconPath: categoryIcons.fashion,                  color:'#F59E0B', bg:'rgba(245,158,11,0.08)' },
  { id:'9',  name:'Grocery & Kirana',     slug:'grocery',       iconPath: categoryIcons.grocery,                  color:'#10B981', bg:'rgba(16,185,129,0.08)' },
  { id:'10', name:'Jewellery & Gifts',    slug:'jewellery',     iconPath: categoryIcons.jewellery,                color:'#EAB308', bg:'rgba(234,179,8,0.08)' },
  { id:'11', name:'Real Estate',          slug:'real-estate',   iconPath: categoryIcons['real-estate'],            color:'#6366F1', bg:'rgba(99,102,241,0.08)' },
  { id:'12', name:'Events & Catering',    slug:'events',        iconPath: categoryIcons.events,                   color:'#F43F5E', bg:'rgba(244,63,94,0.08)' },
  { id:'13', name:'Fitness & Gym',        slug:'fitness',       iconPath: categoryIcons.fitness,                  color:'#84CC16', bg:'rgba(132,204,22,0.08)' },
  { id:'14', name:'Travel & Tours',       slug:'travel',        iconPath: categoryIcons.travel,                   color:'#22D3EE', bg:'rgba(34,211,238,0.08)' },
  { id:'15', name:'Photography',          slug:'photography',   iconPath: categoryIcons.photography,              color:'#A78BFA', bg:'rgba(167,139,250,0.08)' },
  { id:'16', name:'Legal & Finance',      slug:'legal',         iconPath: categoryIcons.legal,                    color:'#FB923C', bg:'rgba(251,146,60,0.08)' },
];

// Empty — real data comes from your database
export const businesses: Business[] = [];

export const testimonials: Testimonial[] = [];