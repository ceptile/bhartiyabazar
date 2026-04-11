export type Category = { id: string; name: string; slug: string; icon: string; count: number; color: string; };
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
export type Product = { id: string; name: string; price: number; originalPrice?: number; image: string; category: string; inStock: boolean; unit?: string; };
export type Review = { id: string; author: string; avatar: string; rating: number; text: string; date: string; helpful: number; verified: boolean; };

export const categories: Category[] = [
  { id:'1', name:'Restaurants & Food', slug:'restaurants', icon:'🍽️', count:4820, color:'#FF6B35' },
  { id:'2', name:'Electronics & Repair', slug:'electronics', icon:'📱', count:3240, color:'#4F8EF7' },
  { id:'3', name:'Health & Doctors', slug:'health', icon:'🏥', count:2980, color:'#00D68F' },
  { id:'4', name:'Home Services', slug:'home-services', icon:'🔧', count:5610, color:'#FFB800' },
  { id:'5', name:'Education & Tutors', slug:'education', icon:'📚', count:2140, color:'#8B5CF6' },
  { id:'6', name:'Salons & Beauty', slug:'salons', icon:'💇', count:3870, color:'#EC4899' },
  { id:'7', name:'Auto & Vehicles', slug:'auto', icon:'🚗', count:2760, color:'#14B8A6' },
  { id:'8', name:'Clothing & Fashion', slug:'fashion', icon:'👗', count:4320, color:'#F59E0B' },
  { id:'9', name:'Grocery & Kirana', slug:'grocery', icon:'🛒', count:6120, color:'#10B981' },
  { id:'10', name:'Jewellery & Gifts', slug:'jewellery', icon:'💎', count:1890, color:'#EAB308' },
  { id:'11', name:'Real Estate', slug:'real-estate', icon:'🏠', count:1450, color:'#6366F1' },
  { id:'12', name:'Events & Catering', slug:'events', icon:'🎉', count:2230, color:'#F43F5E' },
  { id:'13', name:'Fitness & Gym', slug:'fitness', icon:'💪', count:1780, color:'#84CC16' },
  { id:'14', name:'Travel & Tours', slug:'travel', icon:'✈️', count:980, color:'#22D3EE' },
  { id:'15', name:'Photography', slug:'photography', icon:'📷', count:1340, color:'#A78BFA' },
  { id:'16', name:'Legal & Finance', slug:'legal', icon:'⚖️', count:870, color:'#FB923C' },
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
    responseTime:'< 30 min', images:['https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800&q=80','https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80'],
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
    rating:4.9, reviewCount:512, verified:true, featured:true, trustScore:98,
    responseTime:'< 15 min', images:['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80','https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&q=80'],
    tags:['General Medicine','Diabetes','Hypertension','Home Visits'],
    openNow:true, established:2004, employees:'2-5',
    address:'304, Sunrise Building, Link Road, Andheri West', pincode:'400058',
    badge:'Most Trusted',
    services:['General Consultation','Diabetes Management','Blood Pressure Treatment','Preventive Health Check','Vaccination','Home Visits for Senior Citizens'],
    products:[
      { id:'p4', name:'General Consultation', price:500, image:'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80', category:'Consultation', inStock:true },
      { id:'p5', name:'Full Health Checkup Package', price:2499, originalPrice:3500, image:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80', category:'Checkup', inStock:true },
    ],
    reviews:[
      { id:'r4', author:'Suresh Mehta', avatar:'SM', rating:5, text:'Dr. Meera is incredibly caring and thorough. Best doctor I have visited in years.', date:'3 days ago', helpful:28, verified:true },
      { id:'r5', author:'Kavita Reddy', avatar:'KR', rating:5, text:'She takes time to explain everything. Very patient and knowledgeable.', date:'1 week ago', helpful:19, verified:true },
    ],
  },
  {
    id:'b3', name:'Spice Garden Restaurant', slug:'spice-garden',
    category:'Restaurants & Food', categorySlug:'restaurants',
    description:'Authentic North Indian cuisine with secret family recipes passed down for generations. Signature dishes include Dal Makhani, Butter Chicken, Biryani and Tandoori items. Takeaway, dine-in and home delivery available. Party hall for 50 guests.',
    shortDesc:'Authentic North Indian cuisine. Home delivery available. Party hall for 50.',
    city:'Bengaluru', area:'Koramangala', state:'Karnataka',
    phone:'+91-80-4567-8901', whatsapp:'918045678901', email:'spicegarden@gmail.com',
    rating:4.5, reviewCount:892, verified:true, featured:true, trustScore:88,
    responseTime:'< 45 min', images:['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'],
    tags:['North Indian','Delivery','Dine-in','Party Hall'],
    openNow:true, established:2015, employees:'10-20',
    address:'47, 5th Cross, Koramangala 4th Block', pincode:'560034',
    badge:'Popular',
    services:['Dine-In','Home Delivery','Takeaway','Catering','Party Hall Booking','Birthday Packages'],
    products:[
      { id:'p6', name:'Butter Chicken + 2 Roti', price:320, image:'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', category:'Main Course', inStock:true },
      { id:'p7', name:'Special Biryani', price:260, image:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', category:'Rice', inStock:true },
      { id:'p8', name:'Dal Makhani + Rice', price:180, originalPrice:220, image:'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80', category:'Main Course', inStock:true },
    ],
    reviews:[
      { id:'r6', author:'Deepak Nair', avatar:'DN', rating:5, text:'Best Dal Makhani in Koramangala! Delivery was on time and food was hot.', date:'1 day ago', helpful:22, verified:true },
      { id:'r7', author:'Anita Krishnan', avatar:'AK', rating:4, text:'Good food, consistent quality. Sunday biryani is a must try!', date:'5 days ago', helpful:14, verified:true },
    ],
  },
  {
    id:'b4', name:'QuickFix Plumbing & Home Solutions', slug:'quickfix-plumbing',
    category:'Home Services', categorySlug:'home-services',
    description:'Professional plumbing and home repair services. Available 24/7 for emergencies. Licensed plumbers with 10+ years experience. Services include pipe repair, bathroom fittings, water tank cleaning, electrical work and painting.',
    shortDesc:'24/7 emergency plumbing & home repairs. Licensed, insured professionals.',
    city:'Hyderabad', area:'Banjara Hills', state:'Telangana',
    phone:'+91-98400-78901', whatsapp:'919840078901', email:'quickfix.hyd@gmail.com',
    rating:4.6, reviewCount:347, verified:true, featured:false, trustScore:91,
    responseTime:'< 20 min', images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    tags:['24/7 Service','Emergency','Licensed','Home Repair'],
    openNow:true, established:2017, employees:'5-10',
    address:'Road No. 12, Banjara Hills', pincode:'500034',
    services:['Pipe Repair & Replacement','Bathroom Fittings','Water Tank Cleaning','Electrical Repair','Painting','Carpentry'],
    products:[
      { id:'p9', name:'Basic Plumbing Service', price:349, image:'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', category:'Plumbing', inStock:true },
      { id:'p10', name:'Bathroom Renovation Package', price:12999, originalPrice:16000, image:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80', category:'Renovation', inStock:true },
    ],
    reviews:[
      { id:'r8', author:'Vijay Rao', avatar:'VR', rating:5, text:'Called at midnight for emergency pipe burst. They arrived in 25 min. Lifesaver!', date:'4 days ago', helpful:31, verified:true },
    ],
  },
  {
    id:'b5', name:'Style Studio Unisex Salon', slug:'style-studio',
    category:'Salons & Beauty', categorySlug:'salons',
    description:'Premium unisex salon with internationally trained stylists. Services include haircuts, coloring, spa, bridal packages, threading, waxing, and nail art. Using only L\'Oreal and Wella products. Appointment booking available online.',
    shortDesc:'Premium unisex salon. International stylists. Bridal packages available.',
    city:'Pune', area:'Wakad', state:'Maharashtra',
    phone:'+91-98700-34567', whatsapp:'919870034567', email:'stylestudio.pune@gmail.com',
    rating:4.8, reviewCount:623, verified:true, featured:true, trustScore:95,
    responseTime:'< 1 hour', images:['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'],
    tags:['Unisex','Bridal','L\'Oreal Products','Appointment Available'],
    openNow:false, established:2018, employees:'5-10',
    address:'Shop 7, Wakad Main Road, near D-Mart', pincode:'411057',
    badge:'Premium',
    services:['Haircut & Styling','Hair Coloring','Bridal Makeup','Facial & Spa','Waxing','Nail Art','Keratin Treatment'],
    products:[
      { id:'p11', name:'Haircut & Blow Dry', price:499, image:'https://images.unsplash.com/photo-1562322140-8baeebebd7b1?w=400&q=80', category:'Hair', inStock:true },
      { id:'p12', name:'Full Bridal Package', price:14999, originalPrice:18000, image:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80', category:'Bridal', inStock:true },
    ],
    reviews:[
      { id:'r9', author:'Sneha Joshi', avatar:'SJ', rating:5, text:'Got my bridal makeup done here. Looked absolutely stunning! Highly recommend!', date:'3 days ago', helpful:41, verified:true },
    ],
  },
  {
    id:'b6', name:'Bright Minds Tuition Center', slug:'bright-minds',
    category:'Education & Tutors', categorySlug:'education',
    description:'Expert coaching for Classes 6-12 (CBSE, ICSE, State Board). Subjects: Math, Science, English, SST. Small batch sizes (max 8 students). Regular tests, doubt sessions, and parent meetings. Online classes available.',
    shortDesc:'Expert coaching for Class 6-12. Small batches, regular tests, doubt sessions.',
    city:'Chennai', area:'Anna Nagar', state:'Tamil Nadu',
    phone:'+91-98490-23456', whatsapp:'919849023456', email:'brightminds.chennai@gmail.com',
    rating:4.6, reviewCount:198, verified:true, featured:false, trustScore:87,
    responseTime:'< 2 hours', images:['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'],
    tags:['CBSE','ICSE','Online Classes','Small Batches'],
    openNow:true, established:2016, employees:'2-5',
    address:'A-Block, 12th Street, Anna Nagar', pincode:'600040',
    services:['Math Coaching','Science Coaching','English Grammar','Online Classes','Doubt Sessions','Study Material'],
    products:[
      { id:'p13', name:'Monthly Tuition Fee (1 Subject)', price:1800, image:'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80', category:'Coaching', inStock:true },
      { id:'p14', name:'Full Package (3 Subjects)', price:4500, originalPrice:5400, image:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', category:'Coaching', inStock:true },
    ],
    reviews:[
      { id:'r10', author:'Rajesh P', avatar:'RP', rating:5, text:'My daughter\'s grades improved from 65% to 89% in 3 months. Excellent teachers!', date:'1 week ago', helpful:27, verified:true },
    ],
  },
];

export const testimonials = [
  { id:'t1', name:'Ramesh Gupta', city:'Delhi', role:'Shop Owner', text:'Listed my hardware shop on BhartiyaBazar and started getting calls within 2 days. Now I get 15-20 enquiries per month completely free!', avatar:'RG', rating:5 },
  { id:'t2', name:'Sunita Sharma', city:'Mumbai', role:'Customer', text:'Found the best AC repair guy in my area within minutes. He came same day, fixed the AC, and charged a fair price. No middleman, no spam calls!', avatar:'SS', rating:5 },
  { id:'t3', name:'Arjun Mehta', city:'Bengaluru', role:'Restaurant Owner', text:'The verified badge really helped build trust with new customers. Our orders increased 40% in the first month after getting featured.', avatar:'AM', rating:5 },
  { id:'t4', name:'Priya Nair', city:'Chennai', role:'Customer', text:'Finally a platform that shows real businesses with real reviews. Compared 3 salons, read genuine reviews, and booked the best one. So easy!', avatar:'PN', rating:5 },
];

export const pricingPlans = [
  {
    id:'free', name:'Free', price:0, period:'forever',
    description:'Perfect for getting started',
    features:['1 Business Profile','5 Product Listings','Basic Search Visibility','Direct Contact (Call/WhatsApp)','Standard Support'],
    notIncluded:['Featured Listing','Verified Badge','Analytics Dashboard','Priority Support'],
    cta:'Get Started Free', popular:false,
  },
  {
    id:'starter', name:'Starter', price:499, period:'month',
    description:'Best for growing businesses',
    features:['1 Business Profile','25 Product Listings','Enhanced Search Visibility','Direct Contact (Call/WhatsApp/Email)','Basic Analytics (Views & Clicks)','Email Support'],
    notIncluded:['Featured Listing','Verified Badge','Priority Support'],
    cta:'Start Starter Plan', popular:false,
  },
  {
    id:'pro', name:'Pro', price:1499, period:'month',
    description:'Most popular for established businesses',
    features:['1 Business Profile','Unlimited Product Listings','Featured Listing Badge','Verified Badge','Full Analytics Dashboard','Lead Management','Priority Support','Homepage Visibility (Rotating)'],
    notIncluded:[],
    cta:'Go Pro', popular:true,
  },
  {
    id:'enterprise', name:'Enterprise', price:4999, period:'month',
    description:'For chains & multiple branches',
    features:['5 Business Profiles','Unlimited Products per Profile','Sponsored Top Position','Verified Badge (All Profiles)','Advanced Analytics & Reports','Dedicated Account Manager','API Access','Custom Integrations'],
    notIncluded:[],
    cta:'Contact Sales', popular:false,
  },
];
