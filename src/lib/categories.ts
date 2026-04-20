export interface Category {
  id: string;
  name: string;
  group: string;
  keywords: string[];
}

export const ALL_CATEGORIES: Category[] = [
  // ── Food & Dining ──────────────────────────────────────────────────────
  { id: 'restaurant', name: 'Restaurant', group: 'Food & Dining', keywords: ['food', 'eat', 'dine', 'lunch', 'dinner', 'restaurant', 'meals', 'cuisine'] },
  { id: 'cafe', name: 'Café / Coffee Shop', group: 'Food & Dining', keywords: ['coffee', 'cafe', 'cappuccino', 'espresso', 'tea', 'bakery', 'snacks'] },
  { id: 'fastfood', name: 'Fast Food', group: 'Food & Dining', keywords: ['burger', 'pizza', 'fast food', 'fries', 'quick bite', 'takeaway'] },
  { id: 'dhaba', name: 'Dhaba', group: 'Food & Dining', keywords: ['dhaba', 'highway food', 'punjabi', 'dal makhani', 'roti', 'thali'] },
  { id: 'sweets', name: 'Sweets & Mithai', group: 'Food & Dining', keywords: ['sweets', 'mithai', 'halwai', 'ladoo', 'barfi', 'dessert'] },
  { id: 'icecream', name: 'Ice Cream & Desserts', group: 'Food & Dining', keywords: ['ice cream', 'kulfi', 'gelato', 'dessert', 'sundae'] },
  { id: 'bakery', name: 'Bakery', group: 'Food & Dining', keywords: ['bakery', 'bread', 'cake', 'pastry', 'biscuit', 'patisserie'] },
  { id: 'juice', name: 'Juice Bar', group: 'Food & Dining', keywords: ['juice', 'smoothie', 'fresh juice', 'sugarcane', 'lassi', 'nimbu pani'] },
  { id: 'tiffin', name: 'Tiffin / Home Food', group: 'Food & Dining', keywords: ['tiffin', 'home food', 'dabba', 'homemade', 'meal delivery', 'subscription meals'] },
  { id: 'catering', name: 'Catering', group: 'Food & Dining', keywords: ['catering', 'wedding food', 'event food', 'buffet', 'party food'] },
  { id: 'cloud-kitchen', name: 'Cloud Kitchen', group: 'Food & Dining', keywords: ['cloud kitchen', 'online food', 'delivery kitchen', 'ghost kitchen'] },
  { id: 'bar', name: 'Bar & Pub', group: 'Food & Dining', keywords: ['bar', 'pub', 'lounge', 'nightclub', 'cocktails', 'beer', 'drinks'] },

  // ── Retail & Shopping ──────────────────────────────────────────────────
  { id: 'grocery', name: 'Grocery / Kirana', group: 'Retail', keywords: ['grocery', 'kirana', 'supermarket', 'vegetables', 'fruits', 'daily needs', 'provisions'] },
  { id: 'clothing', name: 'Clothing & Apparel', group: 'Retail', keywords: ['clothes', 'fashion', 'apparel', 'garments', 'boutique', 'saree', 'kurta', 'shirt', 'dress'] },
  { id: 'electronics', name: 'Electronics Store', group: 'Retail', keywords: ['electronics', 'mobile', 'laptop', 'tv', 'ac', 'fridge', 'appliances', 'gadgets'] },
  { id: 'mobile-shop', name: 'Mobile Shop', group: 'Retail', keywords: ['mobile', 'phone', 'smartphone', 'accessories', 'recharge', 'sim card'] },
  { id: 'jewellery', name: 'Jewellery', group: 'Retail', keywords: ['jewellery', 'gold', 'silver', 'diamond', 'rings', 'necklace', 'ornaments'] },
  { id: 'furniture', name: 'Furniture', group: 'Retail', keywords: ['furniture', 'sofa', 'bed', 'table', 'chair', 'almirah', 'wardrobe', 'interior'] },
  { id: 'hardware', name: 'Hardware & Tools', group: 'Retail', keywords: ['hardware', 'tools', 'nuts', 'bolts', 'plumbing', 'electrical items', 'workshop'] },
  { id: 'stationery', name: 'Stationery & Books', group: 'Retail', keywords: ['stationery', 'books', 'pen', 'notebook', 'school supplies', 'office supplies'] },
  { id: 'toy-store', name: 'Toy Store', group: 'Retail', keywords: ['toys', 'games', 'kids', 'children', 'board games', 'lego', 'action figures'] },
  { id: 'sports-store', name: 'Sports & Fitness Store', group: 'Retail', keywords: ['sports', 'gym equipment', 'cricket bat', 'football', 'fitness gear', 'cycling'] },
  { id: 'pharma-retail', name: 'Pharmacy / Medical Store', group: 'Retail', keywords: ['pharmacy', 'medical store', 'medicine', 'chemist', 'drugs', 'health products'] },
  { id: 'pet-store', name: 'Pet Store', group: 'Retail', keywords: ['pet', 'dog', 'cat', 'aquarium', 'pet food', 'pet accessories', 'birds'] },
  { id: 'gift-shop', name: 'Gift Shop', group: 'Retail', keywords: ['gifts', 'presents', 'souvenirs', 'hampers', 'greeting cards', 'wrapping'] },
  { id: 'optician', name: 'Optician / Eyewear', group: 'Retail', keywords: ['optician', 'eyeglasses', 'spectacles', 'sunglasses', 'contact lenses', 'eye care'] },
  { id: 'footwear', name: 'Footwear', group: 'Retail', keywords: ['shoes', 'footwear', 'sandals', 'boots', 'chappals', 'sneakers'] },
  { id: 'saree-shop', name: 'Saree / Ethnic Wear', group: 'Retail', keywords: ['saree', 'lehenga', 'ethnic', 'traditional', 'salwar', 'dupatta', 'kurti'] },

  // ── Health & Medical ───────────────────────────────────────────────────
  { id: 'doctor', name: 'Doctor / Clinic', group: 'Health', keywords: ['doctor', 'clinic', 'physician', 'consultation', 'gp', 'general practitioner', 'medical'] },
  { id: 'dentist', name: 'Dentist', group: 'Health', keywords: ['dentist', 'dental', 'teeth', 'orthodontist', 'braces', 'root canal', 'tooth'] },
  { id: 'hospital', name: 'Hospital', group: 'Health', keywords: ['hospital', 'emergency', 'icu', 'surgery', 'inpatient', 'specialist'] },
  { id: 'ayurveda', name: 'Ayurveda / Naturopathy', group: 'Health', keywords: ['ayurveda', 'naturopathy', 'herbal', 'panchakarma', 'vaidya', 'traditional medicine'] },
  { id: 'homeopathy', name: 'Homeopathy', group: 'Health', keywords: ['homeopathy', 'homoeopathy', 'homeopath', 'homeopathic doctor'] },
  { id: 'physiotherapy', name: 'Physiotherapy', group: 'Health', keywords: ['physiotherapy', 'physio', 'rehabilitation', 'sports injury', 'back pain', 'joint pain'] },
  { id: 'pathology', name: 'Pathology / Lab', group: 'Health', keywords: ['pathology', 'blood test', 'lab', 'diagnostic', 'x-ray', 'mri', 'scan', 'test'] },
  { id: 'eye-doctor', name: 'Eye Doctor / Ophthalmologist', group: 'Health', keywords: ['eye doctor', 'ophthalmologist', 'eye check', 'lasik', 'cataract', 'vision'] },
  { id: 'skin-doctor', name: 'Dermatologist / Skin', group: 'Health', keywords: ['dermatologist', 'skin doctor', 'acne', 'skin care', 'cosmetic dermatology'] },
  { id: 'cardiologist', name: 'Cardiologist', group: 'Health', keywords: ['cardiologist', 'heart doctor', 'ecg', 'heart specialist'] },
  { id: 'gynecologist', name: 'Gynaecologist', group: 'Health', keywords: ['gynaecologist', 'gynecologist', 'obstetrician', 'womens health', 'maternity'] },
  { id: 'pediatrician', name: 'Paediatrician', group: 'Health', keywords: ['pediatrician', 'paediatrician', 'child doctor', 'kids health', 'vaccination'] },
  { id: 'psychiatrist', name: 'Psychiatrist / Psychologist', group: 'Health', keywords: ['psychiatrist', 'psychologist', 'mental health', 'counselling', 'therapy', 'depression', 'anxiety'] },
  { id: 'nursing', name: 'Nursing / Home Care', group: 'Health', keywords: ['nurse', 'home care', 'patient care', 'attendant', 'caregiver', 'elderly care'] },
  { id: 'ambulance', name: 'Ambulance Service', group: 'Health', keywords: ['ambulance', 'emergency transport', 'medical transport'] },
  { id: 'vet', name: 'Veterinarian', group: 'Health', keywords: ['vet', 'veterinarian', 'animal doctor', 'pet clinic', 'dog doctor', 'cat doctor'] },

  // ── Beauty & Wellness ──────────────────────────────────────────────────
  { id: 'salon', name: 'Salon / Hair Studio', group: 'Beauty', keywords: ['salon', 'hair', 'haircut', 'hair color', 'hairdresser', 'blow dry', 'keratin'] },
  { id: 'spa', name: 'Spa & Massage', group: 'Beauty', keywords: ['spa', 'massage', 'relaxation', 'body massage', 'aromatherapy', 'wellness'] },
  { id: 'beauty-parlour', name: 'Beauty Parlour', group: 'Beauty', keywords: ['beauty parlour', 'makeup', 'facial', 'threading', 'waxing', 'pedicure', 'manicure'] },
  { id: 'nail-art', name: 'Nail Art / Nail Studio', group: 'Beauty', keywords: ['nail art', 'nails', 'gel nails', 'nail extension', 'nail salon'] },
  { id: 'tattoo', name: 'Tattoo Studio', group: 'Beauty', keywords: ['tattoo', 'piercing', 'body art', 'ink', 'tattoo artist'] },
  { id: 'mehndi', name: 'Mehndi Artist', group: 'Beauty', keywords: ['mehndi', 'henna', 'bridal mehndi', 'mehendi'] },
  { id: 'barber', name: 'Barber Shop', group: 'Beauty', keywords: ['barber', 'shave', 'beard trim', 'mens salon', 'grooming'] },
  { id: 'makeup-artist', name: 'Makeup Artist', group: 'Beauty', keywords: ['makeup artist', 'bridal makeup', 'party makeup', 'mua'] },
  { id: 'yoga', name: 'Yoga Studio', group: 'Beauty', keywords: ['yoga', 'meditation', 'pranayama', 'asana', 'mindfulness', 'wellness'] },
  { id: 'gym', name: 'Gym / Fitness Center', group: 'Beauty', keywords: ['gym', 'fitness', 'workout', 'bodybuilding', 'crossfit', 'weights', 'cardio'] },
  { id: 'zumba', name: 'Zumba / Dance Fitness', group: 'Beauty', keywords: ['zumba', 'aerobics', 'dance fitness', 'cardio dance'] },

  // ── Education ──────────────────────────────────────────────────────────
  { id: 'tutor', name: 'Tutor / Home Tuition', group: 'Education', keywords: ['tutor', 'tuition', 'home tuition', 'coaching', 'private teacher', 'homework help'] },
  { id: 'coaching', name: 'Coaching Institute', group: 'Education', keywords: ['coaching', 'institute', 'jee', 'neet', 'upsc', 'competitive exam', 'entrance'] },
  { id: 'school', name: 'School', group: 'Education', keywords: ['school', 'primary', 'secondary', 'cbse', 'icse', 'kids education', 'kindergarten'] },
  { id: 'college', name: 'College / University', group: 'Education', keywords: ['college', 'university', 'degree', 'bachelors', 'masters', 'higher education'] },
  { id: 'music-class', name: 'Music Classes', group: 'Education', keywords: ['music', 'guitar', 'piano', 'singing', 'vocal', 'tabla', 'harmonium', 'music teacher'] },
  { id: 'dance-class', name: 'Dance Classes', group: 'Education', keywords: ['dance', 'bharatnatyam', 'kathak', 'hip hop', 'western dance', 'bollywood dance'] },
  { id: 'art-class', name: 'Art & Drawing Classes', group: 'Education', keywords: ['art', 'drawing', 'painting', 'sketch', 'art class', 'fine arts'] },
  { id: 'language-class', name: 'Language Classes', group: 'Education', keywords: ['language', 'english speaking', 'french', 'german', 'spanish', 'hindi', 'ielts', 'spoken english'] },
  { id: 'computer-class', name: 'Computer / IT Classes', group: 'Education', keywords: ['computer', 'it', 'programming', 'coding', 'python', 'web development', 'tally', 'ms office'] },
  { id: 'driving-school', name: 'Driving School', group: 'Education', keywords: ['driving', 'driving school', 'car driving', 'bike riding', 'licence'] },
  { id: 'preschool', name: 'Preschool / Playschool', group: 'Education', keywords: ['preschool', 'playschool', 'daycare', 'toddler', 'nursery', 'montessori', 'lkg', 'ukg'] },
  { id: 'ielts', name: 'IELTS / TOEFL / Study Abroad', group: 'Education', keywords: ['ielts', 'toefl', 'study abroad', 'visa counselling', 'gre', 'gmat', 'overseas education'] },

  // ── Home Services ──────────────────────────────────────────────────────
  { id: 'plumber', name: 'Plumber', group: 'Home Services', keywords: ['plumber', 'plumbing', 'pipe repair', 'leakage', 'tap', 'drainage', 'water tank'] },
  { id: 'electrician', name: 'Electrician', group: 'Home Services', keywords: ['electrician', 'wiring', 'electrical', 'switchboard', 'short circuit', 'fan installation'] },
  { id: 'carpenter', name: 'Carpenter', group: 'Home Services', keywords: ['carpenter', 'woodwork', 'furniture repair', 'door fitting', 'cabinet', 'wood polish'] },
  { id: 'painter', name: 'Painter / Wall Painting', group: 'Home Services', keywords: ['painter', 'wall painting', 'house painting', 'interior paint', 'exterior paint', 'texture paint'] },
  { id: 'ac-repair', name: 'AC Repair & Service', group: 'Home Services', keywords: ['ac repair', 'air conditioner', 'ac service', 'cooling', 'ac installation', 'split ac'] },
  { id: 'appliance-repair', name: 'Appliance Repair', group: 'Home Services', keywords: ['appliance repair', 'washing machine', 'fridge repair', 'microwave repair', 'tv repair'] },
  { id: 'pest-control', name: 'Pest Control', group: 'Home Services', keywords: ['pest control', 'cockroach', 'termite', 'rat', 'mosquito', 'fumigation', 'exterminator'] },
  { id: 'cleaning', name: 'Home Cleaning / Housekeeping', group: 'Home Services', keywords: ['cleaning', 'housekeeping', 'maid', 'deep clean', 'sofa cleaning', 'bathroom cleaning'] },
  { id: 'security', name: 'Security Guard / Agency', group: 'Home Services', keywords: ['security', 'guard', 'watchman', 'security agency', 'cctv installation'] },
  { id: 'interior-design', name: 'Interior Design', group: 'Home Services', keywords: ['interior design', 'interior decorator', 'modular kitchen', 'false ceiling', 'wallpaper'] },
  { id: 'architect', name: 'Architect', group: 'Home Services', keywords: ['architect', 'architecture', 'building design', 'house plan', 'construction plan', 'blueprint'] },
  { id: 'construction', name: 'Construction / Contractor', group: 'Home Services', keywords: ['construction', 'contractor', 'building', 'renovation', 'civil work', 'mason'] },
  { id: 'movers', name: 'Movers & Packers', group: 'Home Services', keywords: ['movers', 'packers', 'relocation', 'shifting', 'home shifting', 'transport goods'] },
  { id: 'waterproofing', name: 'Waterproofing', group: 'Home Services', keywords: ['waterproofing', 'roof leak', 'damp', 'seepage', 'terrace waterproofing'] },
  { id: 'cook', name: 'Cook / Chef at Home', group: 'Home Services', keywords: ['cook', 'home chef', 'personal chef', 'cooking service', 'part time cook'] },
  { id: 'gardening', name: 'Gardening / Landscaping', group: 'Home Services', keywords: ['gardening', 'landscape', 'plant care', 'lawn', 'garden maintenance', 'nursery'] },
  { id: 'solar', name: 'Solar Panel Installation', group: 'Home Services', keywords: ['solar', 'solar panel', 'rooftop solar', 'solar installation', 'solar energy'] },

  // ── Automotive ────────────────────────────────────────────────────────
  { id: 'car-repair', name: 'Car Repair / Garage', group: 'Automotive', keywords: ['car repair', 'garage', 'mechanic', 'engine repair', 'car service', 'dent removal'] },
  { id: 'bike-repair', name: 'Bike / Two-wheeler Repair', group: 'Automotive', keywords: ['bike repair', 'motorcycle repair', 'scooter repair', 'two wheeler', 'puncture'] },
  { id: 'car-wash', name: 'Car Wash / Detailing', group: 'Automotive', keywords: ['car wash', 'detailing', 'polishing', 'steam clean', 'auto spa'] },
  { id: 'driving', name: 'Cab / Taxi', group: 'Automotive', keywords: ['cab', 'taxi', 'ride', 'auto', 'driver', 'chauffeur', 'car rental'] },
  { id: 'tyre-shop', name: 'Tyre Shop', group: 'Automotive', keywords: ['tyre', 'tire', 'puncture repair', 'wheel balancing', 'alignment'] },
  { id: 'car-accessories', name: 'Car Accessories', group: 'Automotive', keywords: ['car accessories', 'seat cover', 'stereo', 'dash cam', 'car audio', 'alloy wheels'] },
  { id: 'fuel-station', name: 'Petrol / CNG Station', group: 'Automotive', keywords: ['petrol', 'fuel', 'cng', 'diesel', 'gas station', 'filling station'] },
  { id: 'ev-charging', name: 'EV Charging Station', group: 'Automotive', keywords: ['ev charging', 'electric vehicle', 'ev station', 'charger', 'tesla charging'] },
  { id: 'second-hand-cars', name: 'Used Cars Dealer', group: 'Automotive', keywords: ['used cars', 'second hand car', 'pre-owned', 'car dealer', 'old cars'] },
  { id: 'driving-school-auto', name: 'Driving School (Auto)', group: 'Automotive', keywords: ['driving school', 'learn driving', 'car training', 'rto'] },

  // ── Real Estate ────────────────────────────────────────────────────────
  { id: 'property-agent', name: 'Property Agent / Broker', group: 'Real Estate', keywords: ['property agent', 'broker', 'real estate', 'buy flat', 'rent house', 'property dealer'] },
  { id: 'pg', name: 'PG / Hostel', group: 'Real Estate', keywords: ['pg', 'paying guest', 'hostel', 'accommodation', 'room rent', 'boys hostel', 'girls hostel'] },
  { id: 'co-working', name: 'Co-working Space', group: 'Real Estate', keywords: ['coworking', 'co-working', 'office space', 'shared office', 'startup office', 'hot desk'] },
  { id: 'warehouse', name: 'Warehouse / Storage', group: 'Real Estate', keywords: ['warehouse', 'storage', 'godown', 'cold storage', 'logistics space'] },
  { id: 'property-developer', name: 'Real Estate Developer', group: 'Real Estate', keywords: ['builder', 'developer', 'new flat', 'new project', 'apartment', 'township'] },

  // ── Finance & Legal ────────────────────────────────────────────────────
  { id: 'ca', name: 'CA / Chartered Accountant', group: 'Finance', keywords: ['ca', 'chartered accountant', 'income tax', 'gst', 'audit', 'tax filing', 'accounting'] },
  { id: 'insurance', name: 'Insurance Agent', group: 'Finance', keywords: ['insurance', 'life insurance', 'health insurance', 'term plan', 'lic', 'policy'] },
  { id: 'bank', name: 'Bank / Financial Services', group: 'Finance', keywords: ['bank', 'loan', 'fixed deposit', 'savings', 'nri', 'nbfc', 'microfinance'] },
  { id: 'lawyer', name: 'Lawyer / Advocate', group: 'Finance', keywords: ['lawyer', 'advocate', 'legal', 'court', 'property dispute', 'divorce', 'criminal lawyer'] },
  { id: 'loan', name: 'Loan Agent', group: 'Finance', keywords: ['loan', 'personal loan', 'home loan', 'business loan', 'mortgage', 'finance'] },
  { id: 'investment', name: 'Investment / Mutual Funds', group: 'Finance', keywords: ['investment', 'mutual fund', 'sip', 'stocks', 'equity', 'financial advisor', 'portfolio'] },
  { id: 'tax-consultant', name: 'Tax Consultant', group: 'Finance', keywords: ['tax', 'income tax', 'tds', 'gst return', 'itr', 'tax consultant'] },
  { id: 'notary', name: 'Notary / Stamp Paper', group: 'Finance', keywords: ['notary', 'stamp paper', 'affidavit', 'attestation', 'legal document'] },

  // ── Events & Entertainment ─────────────────────────────────────────────
  { id: 'event-planner', name: 'Event Planner', group: 'Events', keywords: ['event planner', 'event management', 'wedding planner', 'birthday party', 'corporate event'] },
  { id: 'photographer', name: 'Photographer', group: 'Events', keywords: ['photographer', 'photography', 'wedding photography', 'portrait', 'product photography', 'photo shoot'] },
  { id: 'videographer', name: 'Videographer', group: 'Events', keywords: ['videographer', 'video', 'wedding video', 'drone video', 'film making', 'reels'] },
  { id: 'dj', name: 'DJ / Sound System', group: 'Events', keywords: ['dj', 'disc jockey', 'sound system', 'music', 'party dj', 'wedding dj'] },
  { id: 'tent-decoration', name: 'Tent / Decoration', group: 'Events', keywords: ['tent', 'decoration', 'mandap', 'flower decoration', 'lighting', 'stage'] },
  { id: 'band-baja', name: 'Band / Baja', group: 'Events', keywords: ['band', 'baja', 'baraat', 'wedding band', 'dhol', 'music band'] },
  { id: 'cinema', name: 'Cinema / Movie Theatre', group: 'Events', keywords: ['cinema', 'movie', 'theatre', 'multiplex', 'pvr', 'film'] },
  { id: 'amusement', name: 'Amusement / Theme Park', group: 'Events', keywords: ['amusement park', 'theme park', 'rides', 'waterpark', 'entertainment park'] },
  { id: 'gaming-zone', name: 'Gaming Zone', group: 'Events', keywords: ['gaming zone', 'video games', 'arcade', 'esports', 'gaming cafe', 'playstation'] },
  { id: 'comedy-show', name: 'Comedy / Live Show', group: 'Events', keywords: ['comedy', 'stand up', 'live show', 'concert', 'performance', 'entertainment'] },

  // ── Travel & Hospitality ───────────────────────────────────────────────
  { id: 'hotel', name: 'Hotel', group: 'Travel', keywords: ['hotel', 'stay', 'accommodation', 'room', 'resort', 'lodge', 'inn', 'check in'] },
  { id: 'travel-agent', name: 'Travel Agent', group: 'Travel', keywords: ['travel agent', 'tour package', 'holiday', 'vacation', 'flight booking', 'hotel booking'] },
  { id: 'tour-operator', name: 'Tour Operator', group: 'Travel', keywords: ['tour operator', 'group tour', 'pilgrimage', 'honeymoon package', 'hill station', 'international tour'] },
  { id: 'visa', name: 'Visa Consultant', group: 'Travel', keywords: ['visa', 'passport', 'visa consultant', 'immigration', 'study visa', 'work permit'] },
  { id: 'homestay', name: 'Homestay / Airbnb', group: 'Travel', keywords: ['homestay', 'airbnb', 'vacation rental', 'villa', 'farmstay', 'cottage'] },
  { id: 'bus-travel', name: 'Bus / Volvo Booking', group: 'Travel', keywords: ['bus', 'volvo', 'coach', 'sleeper bus', 'bus booking', 'interstate travel'] },
  { id: 'car-rental', name: 'Car Rental / Self Drive', group: 'Travel', keywords: ['car rental', 'self drive', 'hire a car', 'tempo traveller', 'innova hire'] },

  // ── Technology & Digital ───────────────────────────────────────────────
  { id: 'web-dev', name: 'Web Development', group: 'Technology', keywords: ['web development', 'website', 'frontend', 'backend', 'react', 'nextjs', 'wordpress'] },
  { id: 'app-dev', name: 'App Development', group: 'Technology', keywords: ['app development', 'mobile app', 'android', 'ios', 'flutter', 'react native'] },
  { id: 'seo', name: 'SEO / Digital Marketing', group: 'Technology', keywords: ['seo', 'digital marketing', 'google ads', 'facebook ads', 'social media', 'sem', 'ppc'] },
  { id: 'graphic-design', name: 'Graphic Design', group: 'Technology', keywords: ['graphic design', 'logo design', 'branding', 'poster', 'banner', 'ui design', 'illustration'] },
  { id: 'it-support', name: 'IT Support / Networking', group: 'Technology', keywords: ['it support', 'networking', 'server', 'wifi', 'firewall', 'it maintenance'] },
  { id: 'software', name: 'Software Development', group: 'Technology', keywords: ['software', 'erp', 'crm', 'custom software', 'saas', 'product development'] },
  { id: 'cybersecurity', name: 'Cybersecurity', group: 'Technology', keywords: ['cybersecurity', 'security audit', 'penetration testing', 'ethical hacking', 'data protection'] },
  { id: 'cloud', name: 'Cloud Services', group: 'Technology', keywords: ['cloud', 'aws', 'azure', 'google cloud', 'hosting', 'devops', 'cloud migration'] },
  { id: 'data-analytics', name: 'Data Analytics / AI', group: 'Technology', keywords: ['data analytics', 'machine learning', 'ai', 'data science', 'business intelligence', 'python'] },
  { id: 'cctv', name: 'CCTV / Surveillance', group: 'Technology', keywords: ['cctv', 'surveillance', 'camera installation', 'security camera', 'nvr', 'dvr'] },
  { id: 'printing', name: 'Printing & Advertising', group: 'Technology', keywords: ['printing', 'flex', 'banner', 'visiting card', 'pamphlet', 'brochure', 'offset printing'] },
  { id: 'youtube-channel', name: 'YouTube Channel', group: 'Technology', keywords: ['youtube', 'channel', 'video creator', 'content creator', 'youtuber', 'streaming', 'vlog'] },
  { id: 'podcast', name: 'Podcast', group: 'Technology', keywords: ['podcast', 'podcaster', 'audio show', 'spotify podcast', 'radio show'] },
  { id: 'influencer', name: 'Social Media Influencer', group: 'Technology', keywords: ['influencer', 'instagram', 'reels', 'social media', 'brand ambassador', 'ugc'] },
  { id: 'ecommerce', name: 'E-commerce Store', group: 'Technology', keywords: ['ecommerce', 'online shop', 'shopify', 'amazon seller', 'flipkart seller', 'online store'] },
  { id: 'domain-hosting', name: 'Domain & Hosting', group: 'Technology', keywords: ['domain', 'hosting', 'godaddy', 'namecheap', 'cpanel', 'vps', 'dedicated server'] },

  // ── Professional Services ──────────────────────────────────────────────
  { id: 'hr-consultant', name: 'HR / Recruitment', group: 'Professional', keywords: ['hr', 'recruitment', 'staffing', 'placement', 'hiring', 'manpower', 'jobs'] },
  { id: 'business-consultant', name: 'Business Consultant', group: 'Professional', keywords: ['business consultant', 'management consultant', 'strategy', 'startup advisor', 'mentor'] },
  { id: 'translation', name: 'Translation / Interpretation', group: 'Professional', keywords: ['translation', 'interpreter', 'hindi english', 'document translation', 'certified translation'] },
  { id: 'courier', name: 'Courier / Delivery', group: 'Professional', keywords: ['courier', 'delivery', 'parcel', 'logistics', 'express delivery', 'last mile'] },
  { id: 'laundry', name: 'Laundry / Dry Cleaning', group: 'Professional', keywords: ['laundry', 'dry cleaning', 'wash iron', 'steam press', 'clothes cleaning'] },
  { id: 'tailoring', name: 'Tailor / Stitching', group: 'Professional', keywords: ['tailor', 'stitching', 'alterations', 'blouse stitching', 'suit stitching', 'boutique'] },
  { id: 'photography-studio', name: 'Photography Studio', group: 'Professional', keywords: ['photography studio', 'passport photo', 'id photo', 'studio shoot', 'photo studio'] },
  { id: 'astrologer', name: 'Astrologer / Pandit', group: 'Professional', keywords: ['astrologer', 'pandit', 'jyotish', 'kundali', 'vastu', 'numerology', 'horoscope'] },
  { id: 'ngo', name: 'NGO / Charity', group: 'Professional', keywords: ['ngo', 'charity', 'donation', 'social work', 'nonprofit', 'foundation', 'trust'] },
  { id: 'govt-service', name: 'Govt Services / Documentation', group: 'Professional', keywords: ['government', 'aadhar', 'pan card', 'ration card', 'affidavit', 'documentation', 'csc', 'e-mitra'] },

  // ── Sports & Recreation ────────────────────────────────────────────────
  { id: 'sports-academy', name: 'Sports Academy', group: 'Sports', keywords: ['sports academy', 'cricket coaching', 'football training', 'badminton', 'tennis coaching'] },
  { id: 'swimming', name: 'Swimming Pool / Academy', group: 'Sports', keywords: ['swimming', 'pool', 'swim coaching', 'water sports', 'aquatics'] },
  { id: 'martial-arts', name: 'Martial Arts', group: 'Sports', keywords: ['martial arts', 'karate', 'taekwondo', 'judo', 'boxing', 'mma', 'kung fu', 'self defense'] },
  { id: 'chess-academy', name: 'Chess Academy', group: 'Sports', keywords: ['chess', 'chess coaching', 'chess club', 'online chess'] },
  { id: 'esports', name: 'Esports / Gaming', group: 'Sports', keywords: ['esports', 'gaming', 'bgmi', 'pubg', 'free fire', 'valorant', 'tournament', 'competitive gaming'] },
  { id: 'cycling-club', name: 'Cycling Club / Rentals', group: 'Sports', keywords: ['cycling', 'bicycle rental', 'cycle club', 'mountain bike', 'cycling tour'] },
  { id: 'trekking', name: 'Trekking / Adventure', group: 'Sports', keywords: ['trekking', 'hiking', 'adventure', 'camping', 'rock climbing', 'rappelling', 'paragliding'] },

  // ── Media & Creative ───────────────────────────────────────────────────
  { id: 'news-channel', name: 'News Channel / Portal', group: 'Media', keywords: ['news', 'journalism', 'media', 'online news', 'digital news', 'tv channel'] },
  { id: 'magazine', name: 'Magazine / Blog', group: 'Media', keywords: ['magazine', 'blog', 'editorial', 'publication', 'article', 'content'] },
  { id: 'ad-agency', name: 'Advertising Agency', group: 'Media', keywords: ['advertising', 'agency', 'brand', 'campaign', 'ad agency', 'marketing agency', 'creative agency'] },
  { id: 'film-production', name: 'Film / Video Production', group: 'Media', keywords: ['film production', 'video production', 'short film', 'documentary', 'ad film', 'corporate video'] },
  { id: 'music-studio', name: 'Music Studio / Recording', group: 'Media', keywords: ['music studio', 'recording studio', 'mixing', 'mastering', 'beat making', 'music production'] },
  { id: 'animation', name: 'Animation Studio', group: 'Media', keywords: ['animation', '2d animation', '3d animation', 'motion graphics', 'vfx', 'cartoon'] },
  { id: 'writer', name: 'Content Writer / Copywriter', group: 'Media', keywords: ['content writer', 'copywriter', 'seo writer', 'blog writer', 'ghostwriter', 'content creation'] },

  // ── Agriculture & Nature ───────────────────────────────────────────────
  { id: 'farm', name: 'Farm / Organic Farm', group: 'Agriculture', keywords: ['farm', 'organic', 'vegetables', 'fruits', 'dairy', 'fresh produce', 'agri'] },
  { id: 'nursery', name: 'Plant Nursery', group: 'Agriculture', keywords: ['nursery', 'plants', 'saplings', 'seeds', 'flowers', 'indoor plants', 'garden'] },
  { id: 'agri-equipment', name: 'Agriculture Equipment', group: 'Agriculture', keywords: ['tractor', 'agriculture equipment', 'irrigation', 'farm tools', 'harvester'] },
  { id: 'veterinary-farm', name: 'Dairy / Poultry Farm', group: 'Agriculture', keywords: ['dairy', 'poultry', 'eggs', 'milk', 'chicken', 'cattle', 'goat farm'] },
  { id: 'fishing', name: 'Fishing / Seafood', group: 'Agriculture', keywords: ['fish', 'seafood', 'aquaculture', 'prawn', 'fishing', 'fish market'] },
];

// Smart search — scores a category by how well it matches the query
export function searchCategories(query: string, limit = 10): Category[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  const scored = ALL_CATEGORIES.map(cat => {
    let score = 0;
    const nameL = cat.name.toLowerCase();
    const groupL = cat.group.toLowerCase();
    const allText = [nameL, groupL, ...cat.keywords].join(' ');

    // Exact name match
    if (nameL === q) score += 100;
    // Name starts with
    else if (nameL.startsWith(q)) score += 60;
    // Name contains
    else if (nameL.includes(q)) score += 40;
    // Keyword exact match
    if (cat.keywords.some(k => k === q)) score += 50;
    // Keyword starts with
    if (cat.keywords.some(k => k.startsWith(q))) score += 30;
    // Keyword contains
    if (cat.keywords.some(k => k.includes(q))) score += 20;
    // Group contains
    if (groupL.includes(q)) score += 15;
    // Word-by-word
    words.forEach(w => {
      if (w.length < 2) return;
      if (allText.includes(w)) score += 5;
    });

    return { cat, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.cat);
}

export const CATEGORY_GROUPS = [...new Set(ALL_CATEGORIES.map(c => c.group))];