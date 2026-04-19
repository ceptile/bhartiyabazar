export type Category = {
  id: string;
  name: string;
  slug: string;
  iconPath: string; // SVG path data instead of emoji
  count: number;
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
  business: string; leads: number; text: string; avatar: string; rating: number;
};

// Lucide-style SVG paths for category icons
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

export const stats = [
  { id: 's1', value: 50000,   suffix: '+', label: 'Verified Businesses', color: 'var(--amber)' },
  { id: 's2', value: 280000,  suffix: '+', label: 'Happy Users',          color: 'var(--success)' },
  { id: 's3', value: 500,     suffix: '+', label: 'Cities Covered',       color: 'var(--info)' },
  { id: 's4', value: 1200000, suffix: '+', label: 'Monthly Searches',     color: 'var(--gold)' },
];

export const categories: Category[] = [
  { id:'1',  name:'Restaurants & Food',   slug:'restaurants',   iconPath: categoryIcons.restaurants,   count:4820, color:'#FF6B35', bg:'rgba(255,107,53,0.08)' },
  { id:'2',  name:'Electronics & Repair', slug:'electronics',   iconPath: categoryIcons.electronics,   count:3240, color:'#4F8EF7', bg:'rgba(79,142,247,0.08)' },
  { id:'3',  name:'Health & Doctors',     slug:'health',        iconPath: categoryIcons.health,        count:2980, color:'#00D68F', bg:'rgba(0,214,143,0.08)' },
  { id:'4',  name:'Home Services',        slug:'home-services', iconPath: categoryIcons['home-services'], count:5610, color:'#FFB800', bg:'rgba(255,184,0,0.08)' },
  { id:'5',  name:'Education & Tutors',   slug:'education',     iconPath: categoryIcons.education,     count:2140, color:'#8B5CF6', bg:'rgba(139,92,246,0.08)' },
  { id:'6',  name:'Salons & Beauty',      slug:'salons',        iconPath: categoryIcons.salons,        count:3870, color:'#EC4899', bg:'rgba(236,72,153,0.08)' },
  { id:'7',  name:'Auto & Vehicles',      slug:'auto',          iconPath: categoryIcons.auto,          count:2760, color:'#14B8A6', bg:'rgba(20,184,166,0.08)' },
  { id:'8',  name:'Clothing & Fashion',   slug:'fashion',       iconPath: categoryIcons.fashion,       count:4320, color:'#F59E0B', bg:'rgba(245,158,11,0.08)' },
  { id:'9',  name:'Grocery & Kirana',     slug:'grocery',       iconPath: categoryIcons.grocery,       count:6120, color:'#10B981', bg:'rgba(16,185,129,0.08)' },
  { id:'10', name:'Jewellery & Gifts',    slug:'jewellery',     iconPath: categoryIcons.jewellery,     count:1890, color:'#EAB308', bg:'rgba(234,179,8,0.08)' },
  { id:'11', name:'Real Estate',          slug:'real-estate',   iconPath: categoryIcons['real-estate'],count:1450, color:'#6366F1', bg:'rgba(99,102,241,0.08)' },
  { id:'12', name:'Events & Catering',    slug:'events',        iconPath: categoryIcons.events,        count:2230, color:'#F43F5E', bg:'rgba(244,63,94,0.08)' },
  { id:'13', name:'Fitness & Gym',        slug:'fitness',       iconPath: categoryIcons.fitness,       count:1780, color:'#84CC16', bg:'rgba(132,204,22,0.08)' },
  { id:'14', name:'Travel & Tours',       slug:'travel',        iconPath: categoryIcons.travel,        count:980,  color:'#22D3EE', bg:'rgba(34,211,238,0.08)' },
  { id:'15', name:'Photography',          slug:'photography',   iconPath: categoryIcons.photography,   count:1340, color:'#A78BFA', bg:'rgba(167,139,250,0.08)' },
  { id:'16', name:'Legal & Finance',      slug:'legal',         iconPath: categoryIcons.legal,         count:870,  color:'#FB923C', bg:'rgba(251,146,60,0.08)' },
];

export const businesses: Business[] = [
  {
    id:'b1', name:'Sharma Electronics & Repair Hub', slug:'sharma-electronics',
    category:'Electronics & Repair', categorySlug:'electronics',
    description:'Trusted electronics repair shop with 15+ years experience. We repair all brands of smartphones, laptops, TVs, ACs, washing machines and more. Genuine spare parts, warranty on all repairs. Home service available.',
    shortDesc:'15+ years of trusted electronics repair. All brands, genuine parts, warranty.',
    city:'Delhi', area:'Karol Bagh', state:'Delhi',
    phone:'+91-98100-12345', whatsapp:'919810012345', email:'sharma.electronics@gmail.com',
    website:'https://sharmaelectronics.in',
    rating:4.7, reviewCount:284, verified:true, featured:true, trustScore:94,
    responseTime:'< 30 min',
    images:[
      'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800&q=80',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80',
    ],
    tags:['Mobile Repair','Laptop Repair','AC Repair','Same Day Service'],
    openNow:true, established:2009, employees:'5-10',
    address:'42, Ajmal Khan Road, Karol Bagh', pincode:'110005',
    badge:'Top Rated',
    services:['Mobile Screen Replacement','Battery Replacement','Laptop Motherboard Repair','AC Gas Refilling','Washing Machine Repair','Home Service Available'],
    products:[
      { id:'p1', name:'Mobile Screen Replacement', price:799, originalPrice:1200, image:'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80', category:'Repair', inStock:true },
      { id:'p2', name:'Laptop Battery Replacement', price:1499, originalPrice:2000, image:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80', category:'Repair', inStock:true },
      { id:'p3', name:'AC Gas Refilling', price:599, image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category:'Service', inStock:true },
    ],
    reviews:[
      { id:'r1', author:'Rahul Sharma', avatar:'RS', rating:5, text:'Excellent service! Fixed my phone screen in 1 hour. Price was fair and quality is great.', date:'2 days ago', helpful:12, verified:true },
      { id:'r2', author:'Priya Singh', avatar:'PS', rating:4, text:'Good repair work on my laptop. Little wait time but result was perfect.', date:'1 week ago', helpful:8, verified:true },
      { id:'r3', author:'Amit Kumar', avatar:'AK', rating:5, text:'Best electronics shop in Karol Bagh. Honest and professional. Highly recommended!', date:'2 weeks ago', helpful:15, verified:false },
    ],
  },
  {
    id:'b2', name:'Dr. Meera Patel – Family Clinic', slug:'dr-meera-patel',
    category:'Health & Doctors', categorySlug:'health',
    description:'Board-certified family physician with 20 years of experience. Specializes in general medicine, diabetes management, hypertension, and preventive healthcare. Evening appointments available. Home visits for senior citizens.',
    shortDesc:'20 years experienced family doctor. Diabetes, BP specialist. Home visits available.',
    city:'Mumbai', area:'Andheri West', state:'Maharashtra',
    phone:'+91-98200-56789', whatsapp:'919820056789', email:'dr.meera.patel@clinic.in',
    rating:4.9, reviewCount:412, verified:true, featured:true, trustScore:98,
    responseTime:'< 2 hrs',
    images:['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80'],
    tags:['General Medicine','Diabetes','Hypertension','Home Visits'],
    openNow:false, established:2004, employees:'1-5',
    address:'304, Versova Link Road, Andheri West', pincode:'400053',
    badge:'Highly Rated',
    services:['General Consultation','Diabetes Management','Blood Pressure Monitoring','Health Checkups','Home Visits – Senior Citizens'],
    products:[],
    reviews:[
      { id:'r4', author:'Sunita Verma', avatar:'SV', rating:5, text:'Dr. Meera is extremely thorough and patient. Best doctor in Andheri!', date:'3 days ago', helpful:20, verified:true },
    ],
  },
  {
    id:'b3', name:'Green Leaf Pure Veg Restaurant', slug:'green-leaf-restaurant',
    category:'Restaurants & Food', categorySlug:'restaurants',
    description:'Authentic North and South Indian vegetarian cuisine made with fresh ingredients. Special thali meals, buffet on weekends, catering available for events up to 500 guests.',
    shortDesc:'Pure veg North & South Indian. Weekend buffet. Event catering up to 500 pax.',
    city:'Jaipur', area:'Malviya Nagar', state:'Rajasthan',
    phone:'+91-94140-78901', whatsapp:'919414078901', email:'greenleaf.jaipur@gmail.com',
    rating:4.6, reviewCount:189, verified:true, featured:true, trustScore:88,
    responseTime:'< 1 hr',
    images:['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80'],
    tags:['Pure Veg','North Indian','South Indian','Catering'],
    openNow:true, established:2015, employees:'10-20',
    address:'12, Govind Marg, Malviya Nagar', pincode:'302017',
    badge:'Popular',
    services:['Dine In','Takeaway','Event Catering','Home Delivery','Weekend Buffet'],
    products:[
      { id:'p4', name:'Special Thali', price:220, originalPrice:280, image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', category:'Food', inStock:true, unit:'per plate' },
    ],
    reviews:[
      { id:'r5', author:'Kavita Joshi', avatar:'KJ', rating:5, text:'Best thali in Jaipur! Fresh, wholesome food at reasonable prices.', date:'1 week ago', helpful:18, verified:true },
    ],
  },
  {
    id:'b4', name:'SpeedFix Home Services', slug:'speedfix-home-services',
    category:'Home Services', categorySlug:'home-services',
    description:'Professional plumbing, electrical, carpentry, and painting services. Trained technicians, transparent pricing, no hidden charges. Available 7 days a week including holidays.',
    shortDesc:'Plumbing, electrical, carpentry. Trained technicians. 7-day availability.',
    city:'Bangalore', area:'Koramangala', state:'Karnataka',
    phone:'+91-80001-23456', whatsapp:'918000123456', email:'speedfix.blr@gmail.com',
    rating:4.4, reviewCount:97, verified:true, featured:false, trustScore:82,
    responseTime:'< 1 hr',
    images:['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'],
    tags:['Plumbing','Electrical','Carpentry','Weekend Available'],
    openNow:true, established:2018, employees:'10-20',
    address:'47, 5th Cross, Koramangala 4th Block', pincode:'560034',
    services:['Plumbing Repair','Electrical Fittings','Carpentry Work','Wall Painting','Deep Cleaning'],
    products:[],
    reviews:[
      { id:'r6', author:'Ramesh Nair', avatar:'RN', rating:4, text:'Quick response, fair pricing. Fixed my leaking pipe within the hour.', date:'4 days ago', helpful:9, verified:true },
    ],
  },
  {
    id:'b5', name:'Glow Up Unisex Salon', slug:'glow-up-salon',
    category:'Salons & Beauty', categorySlug:'salons',
    description:'Premium unisex salon with trained stylists. Hair, skin, nail, and bridal services. Uses only branded products. Appointment-based for zero wait time.',
    shortDesc:'Premium unisex salon. Hair, skin, nails, bridal. Branded products. By appointment.',
    city:'Mumbai', area:'Bandra West', state:'Maharashtra',
    phone:'+91-98201-34567', whatsapp:'919820134567', email:'glowup.bandra@gmail.com',
    rating:4.8, reviewCount:231, verified:true, featured:true, trustScore:92,
    responseTime:'< 30 min',
    images:['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80'],
    tags:['Haircut','Facial','Bridal','Nail Art'],
    openNow:true, established:2017, employees:'5-10',
    address:'15, Hill Road, Bandra West', pincode:'400050',
    badge:'Featured',
    services:['Haircut & Styling','Hair Colour','Facial & Cleanup','Manicure & Pedicure','Bridal Makeup','Keratin Treatment'],
    products:[],
    reviews:[
      { id:'r7', author:'Neha Kapoor', avatar:'NK', rating:5, text:'Amazing salon! The staff is skilled and the ambience is lovely. My go-to place.', date:'2 days ago', helpful:22, verified:true },
    ],
  },
  {
    id:'b6', name:'Aakash Coaching Institute', slug:'aakash-coaching',
    category:'Education & Tutors', categorySlug:'education',
    description:'Specialised coaching for Class 10–12 CBSE, JEE, NEET, and board exams. Small batch sizes (max 15 students), experienced faculty, free doubt sessions on weekends.',
    shortDesc:'CBSE, JEE, NEET coaching. Max 15 per batch. Free weekend doubt sessions.',
    city:'Delhi', area:'Laxmi Nagar', state:'Delhi',
    phone:'+91-98101-67890', whatsapp:'919810167890', email:'aakash.laxminagar@edu.in',
    rating:4.6, reviewCount:143, verified:true, featured:false, trustScore:86,
    responseTime:'< 2 hrs',
    images:['https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80'],
    tags:['JEE','NEET','CBSE','Small Batches'],
    openNow:true, established:2012, employees:'5-10',
    address:'Pocket 2, Mayur Vihar Phase 1, Laxmi Nagar', pincode:'110091',
    services:['Class 10 CBSE','Class 11–12 Science','JEE Mains & Advanced','NEET Preparation','Weekend Doubt Sessions'],
    products:[],
    reviews:[
      { id:'r8', author:'Vikram Tiwari', avatar:'VT', rating:5, text:'My son scored 94% after joining Aakash sir. Faculty is excellent.', date:'1 month ago', helpful:31, verified:true },
    ],
  },
];

export const testimonials: Testimonial[] = [
  { id:'t1', name:'Rajesh Gupta', city:'Delhi', role:'Owner', business:'Gupta Sweets & Namkeen', leads:147, text:'BhartiyaBazar gave my 40-year-old sweet shop a digital presence for the first time. We now get 15–20 new customers every week just from the listing.', avatar:'RG', rating:5 },
  { id:'t2', name:'Priya Sharma', city:'Jaipur', role:'Founder', business:'PriyaFit Studio', leads:89, text:'As a new gym owner, I was struggling to get clients. Within 3 months of listing, my studio was full. The platform is genuinely free and easy to use.', avatar:'PS', rating:5 },
  { id:'t3', name:'Mohammed Salim', city:'Mumbai', role:'Manager', business:'Al-Baraka Electronics', leads:203, text:'We went from 5 walk-ins a day to 25+. BhartiyaBazar customers are serious buyers, not window shoppers. Best ROI we have ever seen for marketing.', avatar:'MS', rating:5 },
];