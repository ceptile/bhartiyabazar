// ============================================================
// BhartiyaBazar — Master Data Store
// ============================================================

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  count: number;
  slug: string;
};

export type Business = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  description: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  trustScore: number;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isTrusted: boolean;
  established: string;
  timings: string;
  tags: string[];
  products: Product[];
  reviews: Review[];
  images: string[];
  lat?: number;
  lng?: number;
  responseTime: string;
  leadCount: number;
  viewCount: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  description: string;
  inStock: boolean;
  image?: string;
};

export type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
};

// ── Categories ──────────────────────────────────────────────
export const categories: Category[] = [
  { id:'cat1', name:'Electronics & Repair', icon:'📱', color:'#3b82f6', bg:'rgba(59,130,246,0.1)', count:2840, slug:'electronics' },
  { id:'cat2', name:'Food & Restaurants',   icon:'🍽️', color:'#ef4444', bg:'rgba(239,68,68,0.1)',  count:5120, slug:'food' },
  { id:'cat3', name:'Health & Hospitals',   icon:'🏥', color:'#10b981', bg:'rgba(16,185,129,0.1)', count:1960, slug:'health' },
  { id:'cat4', name:'Education & Coaching', icon:'📚', color:'#8b5cf6', bg:'rgba(139,92,246,0.1)', count:3310, slug:'education' },
  { id:'cat5', name:'Clothing & Fashion',   icon:'👗', color:'#ec4899', bg:'rgba(236,72,153,0.1)', count:4450, slug:'clothing' },
  { id:'cat6', name:'Real Estate',          icon:'🏠', color:'#f59e0b', bg:'rgba(245,158,11,0.1)', count:1780, slug:'realestate' },
  { id:'cat7', name:'Automotive',           icon:'🚗', color:'#6366f1', bg:'rgba(99,102,241,0.1)', count:2230, slug:'automotive' },
  { id:'cat8', name:'Beauty & Salons',      icon:'💄', color:'#f43f5e', bg:'rgba(244,63,94,0.1)',  count:3670, slug:'beauty' },
  { id:'cat9', name:'Home Services',        icon:'🔧', color:'#14b8a6', bg:'rgba(20,184,166,0.1)', count:4100, slug:'homeservices' },
  { id:'cat10',name:'Grocery & Kirana',     icon:'🛒', color:'#84cc16', bg:'rgba(132,204,22,0.1)', count:6200, slug:'grocery' },
  { id:'cat11',name:'Travel & Transport',   icon:'✈️', color:'#0ea5e9', bg:'rgba(14,165,233,0.1)', count:1540, slug:'travel' },
  { id:'cat12',name:'Finance & Insurance',  icon:'💰', color:'#22c55e', bg:'rgba(34,197,94,0.1)',  count:890,  slug:'finance' },
];

// ── Featured Businesses ──────────────────────────────────────
export const businesses: Business[] = [
  {
    id: 'biz1',
    name: 'Sharma Electronics & Repairs',
    slug: 'sharma-electronics-repairs',
    category: 'Electronics & Repair',
    categoryId: 'cat1',
    description: 'Trusted electronics repair shop in Bhiwadi. We repair mobile phones, laptops, TVs, and all home appliances with genuine parts and 6-month warranty.',
    tagline: 'Genuine Parts · 6-Month Warranty · Same Day Repair',
    address: 'Shop 12, Main Market, Sector 4',
    city: 'Bhiwadi',
    state: 'Rajasthan',
    pincode: '301019',
    phone: '+91 94140 00001',
    whatsapp: '9414000001',
    email: 'sharma.electronics@email.com',
    rating: 4.8,
    reviewCount: 312,
    trustScore: 96,
    isVerified: true,
    isFeatured: true,
    isNew: false,
    isTrusted: true,
    established: '2012',
    timings: 'Mon–Sat 9am–8pm',
    tags: ['mobile repair','laptop repair','TV repair','AC repair','same day'],
    responseTime: '< 15 min',
    leadCount: 1840,
    viewCount: 24300,
    images: [],
    reviews: [
      { id:'r1', author:'Rahul Verma', avatar:'RV', rating:5, text:'Excellent service! Got my iPhone screen replaced in 2 hours. Very professional.', date:'2 days ago', helpful:24 },
      { id:'r2', author:'Priya Sharma', avatar:'PS', rating:5, text:'Fixed my laptop motherboard issue. Saved me ₹15,000 vs buying new. Highly recommend!', date:'1 week ago', helpful:18 },
      { id:'r3', author:'Amit Kumar', avatar:'AK', rating:4, text:'Good service. Repaired my TV quickly. Prices are reasonable.', date:'2 weeks ago', helpful:9 },
    ],
    products: [
      { id:'p1', name:'Mobile Screen Replacement', price:799, originalPrice:1200, unit:'per repair', description:'Original quality screens for all brands', inStock:true },
      { id:'p2', name:'Laptop Service & Cleaning', price:499, unit:'per service', description:'Deep cleaning + performance optimization', inStock:true },
      { id:'p3', name:'TV Repair (any brand)', price:599, originalPrice:800, unit:'per repair', description:'LED/LCD/Smart TV repair with warranty', inStock:true },
    ],
  },
  {
    id: 'biz2',
    name: 'Rajwadi Dhaba & Restaurant',
    slug: 'rajwadi-dhaba-restaurant',
    category: 'Food & Restaurants',
    categoryId: 'cat2',
    description: 'Authentic Rajasthani cuisine in Bhiwadi. Serving dal baati churma, laal maas, and fresh home-style food since 2008.',
    tagline: 'Pure Veg · Home Style · Dal Baati Churma',
    address: 'Near RIICO Chowk, NH-48',
    city: 'Bhiwadi',
    state: 'Rajasthan',
    pincode: '301019',
    phone: '+91 94140 00002',
    whatsapp: '9414000002',
    email: 'rajwadi.dhaba@email.com',
    rating: 4.6,
    reviewCount: 528,
    trustScore: 92,
    isVerified: true,
    isFeatured: true,
    isNew: false,
    isTrusted: false,
    established: '2008',
    timings: 'Daily 7am–11pm',
    tags: ['dal baati','rajasthani food','pure veg','thali','home delivery'],
    responseTime: '< 5 min',
    leadCount: 3200,
    viewCount: 45100,
    images: [],
    reviews: [
      { id:'r1', author:'Sunita Agarwal', avatar:'SA', rating:5, text:'Best dal baati churma in Bhiwadi! Feels like home food. Amazing taste and very affordable.', date:'3 days ago', helpful:41 },
      { id:'r2', author:'Vikram Singh', avatar:'VS', rating:5, text:'Wonderful thali experience. The laal maas was outstanding. Will definitely come back!', date:'1 week ago', helpful:28 },
    ],
    products: [
      { id:'p1', name:'Rajasthani Thali', price:180, unit:'per plate', description:'Complete thali with dal, baati, churma, sabzi, roti', inStock:true },
      { id:'p2', name:'Dal Baati Churma', price:160, originalPrice:200, unit:'per plate', description:'Traditional Rajasthani specialty', inStock:true },
      { id:'p3', name:'Special Laal Maas', price:280, unit:'per plate', description:'Authentic spicy mutton curry', inStock:false },
    ],
  },
  {
    id: 'biz3',
    name: 'Dr. Mehta Multi-Speciality Clinic',
    slug: 'dr-mehta-clinic',
    category: 'Health & Hospitals',
    categoryId: 'cat3',
    description: 'Complete healthcare facility with experienced doctors. Offering general medicine, pediatrics, gynecology, and diagnostic services.',
    tagline: 'Expert Doctors · Modern Equipment · Affordable Care',
    address: 'Plot 7, Central Market, Phase 2',
    city: 'Bhiwadi',
    state: 'Rajasthan',
    pincode: '301019',
    phone: '+91 94140 00003',
    whatsapp: '9414000003',
    email: 'drmehta.clinic@email.com',
    rating: 4.9,
    reviewCount: 189,
    trustScore: 98,
    isVerified: true,
    isFeatured: true,
    isNew: false,
    isTrusted: true,
    established: '2015',
    timings: 'Mon–Sat 9am–7pm | Sun 9am–1pm',
    tags: ['general medicine','pediatric','gynecology','blood test','ECG','home visit'],
    responseTime: 'Same day appt',
    leadCount: 960,
    viewCount: 18700,
    images: [],
    reviews: [
      { id:'r1', author:'Neha Joshi', avatar:'NJ', rating:5, text:'Dr. Mehta is very knowledgeable and caring. Explained everything clearly. Very satisfied.', date:'1 day ago', helpful:32 },
    ],
    products: [
      { id:'p1', name:'General Consultation', price:300, unit:'per visit', description:'With Dr. Mehta or associated doctors', inStock:true },
      { id:'p2', name:'Complete Blood Count', price:250, originalPrice:400, unit:'per test', description:'Results in 2 hours', inStock:true },
      { id:'p3', name:'Home Visit', price:600, unit:'per visit', description:'Doctor comes to your home', inStock:true },
    ],
  },
  {
    id: 'biz4',
    name: 'Smart Tutor Academy',
    slug: 'smart-tutor-academy',
    category: 'Education & Coaching',
    categoryId: 'cat4',
    description: 'Expert coaching for Class 6–12, JEE, NEET, and competitive exams. Small batches, individual attention, proven results.',
    tagline: 'Small Batches · IIT/AIIMS Qualified Faculty · Results Guaranteed',
    address: 'Near Bus Stand, Sector 6',
    city: 'Bhiwadi',
    state: 'Rajasthan',
    pincode: '301019',
    phone: '+91 94140 00004',
    whatsapp: '9414000004',
    email: 'smarttutor@email.com',
    rating: 4.7,
    reviewCount: 143,
    trustScore: 91,
    isVerified: true,
    isFeatured: false,
    isNew: true,
    isTrusted: false,
    established: '2019',
    timings: 'Mon–Sun 7am–9pm',
    tags: ['JEE coaching','NEET coaching','Class 10','Class 12','home tutor','online classes'],
    responseTime: '< 30 min',
    leadCount: 620,
    viewCount: 9800,
    images: [],
    reviews: [
      { id:'r1', author:'Pooja Yadav', avatar:'PY', rating:5, text:'My daughter improved from 60% to 92% in maths. Excellent teaching methods!', date:'5 days ago', helpful:45 },
    ],
    products: [
      { id:'p1', name:'JEE Coaching (Monthly)', price:3500, unit:'per month', description:'Physics, Chemistry, Math — 3 days/week', inStock:true },
      { id:'p2', name:'NEET Coaching (Monthly)', price:3500, unit:'per month', description:'Physics, Chemistry, Biology', inStock:true },
      { id:'p3', name:'Home Tuition (1-on-1)', price:800, unit:'per hour', description:'Any subject, any class', inStock:true },
    ],
  },
  {
    id: 'biz5',
    name: 'Kapoor Fashion House',
    slug: 'kapoor-fashion-house',
    category: 'Clothing & Fashion',
    categoryId: 'cat5',
    description: 'Premium clothing store with the latest Indian and western wear. Men, women, and kids sections. Custom tailoring available.',
    tagline: 'Latest Trends · Custom Stitching · Festival Collections',
    address: 'Main Market, Sector 3',
    city: 'Bhiwadi',
    state: 'Rajasthan',
    pincode: '301019',
    phone: '+91 94140 00005',
    whatsapp: '9414000005',
    email: 'kapoor.fashion@email.com',
    rating: 4.5,
    reviewCount: 267,
    trustScore: 88,
    isVerified: true,
    isFeatured: false,
    isNew: false,
    isTrusted: false,
    established: '2011',
    timings: 'Mon–Sun 10am–9pm',
    tags: ['saree','lehenga','suits','shirt','jeans','bridal wear','kids wear'],
    responseTime: '< 1 hour',
    leadCount: 1100,
    viewCount: 15600,
    images: [],
    reviews: [
      { id:'r1', author:'Anita Singh', avatar:'AS', rating:5, text:'Amazing collection! Got my wedding lehenga here. Very cooperative staff.', date:'1 week ago', helpful:21 },
    ],
    products: [
      { id:'p1', name:'Bridal Lehenga', price:8500, originalPrice:12000, unit:'per piece', description:'Designer collection with embroidery', inStock:true },
      { id:'p2', name:'Cotton Sarees', price:650, unit:'per piece', description:'Pure cotton, multiple designs', inStock:true },
      { id:'p3', name:'Custom Stitching', price:350, unit:'per piece', description:'Salwar, kurti, blouse — 3-day delivery', inStock:true },
    ],
  },
  {
    id: 'biz6',
    name: 'QuickFix Home Services',
    slug: 'quickfix-home-services',
    category: 'Home Services',
    categoryId: 'cat9',
    description: 'Professional plumbing, electrical, and AC repair services. Verified technicians, transparent pricing, and on-time service guaranteed.',
    tagline: 'Verified Technicians · Fixed Pricing · On-Time Guarantee',
    address: 'Sector 8, Industrial Area',
    city: 'Bhiwadi',
    state: 'Rajasthan',
    pincode: '301019',
    phone: '+91 94140 00006',
    whatsapp: '9414000006',
    email: 'quickfix.services@email.com',
    rating: 4.7,
    reviewCount: 398,
    trustScore: 94,
    isVerified: true,
    isFeatured: true,
    isNew: false,
    isTrusted: true,
    established: '2017',
    timings: 'Daily 8am–10pm | Emergency 24/7',
    tags: ['plumber','electrician','AC repair','carpenter','painter','pest control'],
    responseTime: '< 1 hour',
    leadCount: 2800,
    viewCount: 38200,
    images: [],
    reviews: [
      { id:'r1', author:'Rajesh Gupta', avatar:'RG', rating:5, text:'AC stopped working at midnight. QuickFix sent a technician in 45 minutes. Lifesaver!', date:'3 days ago', helpful:56 },
    ],
    products: [
      { id:'p1', name:'AC Service & Gas Refill', price:799, originalPrice:1200, unit:'per service', description:'Complete AC servicing with gas top-up', inStock:true },
      { id:'p2', name:'Plumbing Repair', price:399, unit:'per visit', description:'Leaks, blockages, tap replacement', inStock:true },
      { id:'p3', name:'Electrical Work', price:299, unit:'per visit', description:'Wiring, switches, fan installation', inStock:true },
    ],
  },
];

export const stats = [
  { value: '50,000+', label: 'Businesses Listed', icon: '🏢' },
  { value: '2,80,000+', label: 'Happy Users',       icon: '😊' },
  { value: '500+',    label: 'Cities Covered',     icon: '📍' },
  { value: '4.8★',    label: 'Average Rating',     icon: '⭐' },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Ramesh Agarwal',
    business: 'Agarwal Hardware Store, Jaipur',
    avatar: 'RA',
    rating: 5,
    text: 'BhartiyaBazar ne meri dukaan ko online la diya! Ab roz 10-15 naye customers aate hain. Bahut behtareen platform hai.',
    leads: 142,
  },
  {
    id: 't2',
    name: 'Sunita Devi',
    business: 'Sunita Beauty Parlour, Alwar',
    avatar: 'SD',
    rating: 5,
    text: 'Maine free mein apna business list kiya aur 2 hafton mein 50 se zyada inquiries aai. Koi commission nahi, seedha customers!',
    leads: 89,
  },
  {
    id: 't3',
    name: 'Vijay Mehta',
    business: 'Mehta Auto Works, Bhiwadi',
    avatar: 'VM',
    rating: 5,
    text: 'Best business directory for India. Very easy to use and the trust score system is excellent. Customers trust us more now.',
    leads: 218,
  },
];
