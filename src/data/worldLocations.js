const WORLD_LOCATIONS = {
  India: {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kakinada", "Anantapur", "Kadapa"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Ziro", "Pasighat", "Bomdila", "Tezu"],
    Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur", "Tinsukia", "Karimganj"],
    Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Begusarai", "Katihar", "Ara", "Munger"],
    Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh"],
    Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Morbi"],
    Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal", "Rohtak", "Sonipat", "Yamunanagar", "Bhiwani"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Bilaspur", "Hamirpur"],
    Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Davanagere", "Ballari", "Shivamogga", "Tumakuru", "Udupi"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Palakkad", "Kottayam", "Malappuram"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna", "Ratlam", "Dewas"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded"],
    Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
    Meghalaya: ["Shillong", "Tura", "Jowai", "Nongpoh"],
    Mizoram: ["Aizawl", "Lunglei", "Champhai", "Kolasib"],
    Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
    Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur", "Balasore", "Puri", "Bhadrak"],
    Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Bhiwadi"],
    Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Nagercoil"],
    Telangana: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Ramagundam", "Mahbubnagar", "Adilabad"],
    Tripura: ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh", "Gorakhpur", "Moradabad"],
    Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Nainital", "Kashipur"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur", "Haldia"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    Chandigarh: ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    Delhi: ["New Delhi", "Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh"],
    Jammu: ["Jammu", "Srinagar", "Anantnag", "Baramulla"],
    Ladakh: ["Leh", "Kargil"],
    Lakshadweep: ["Kavaratti"],
    Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"]
  },

  "United States": {
    Alabama: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
    Alaska: ["Anchorage", "Fairbanks", "Juneau", "Sitka"],
    Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
    Arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"],
    California: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Sacramento", "Fresno", "Oakland", "Anaheim"],
    Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
    Connecticut: ["Bridgeport", "New Haven", "Hartford", "Stamford"],
    Delaware: ["Wilmington", "Dover", "Newark"],
    Florida: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah"],
    Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
    Hawaii: ["Honolulu", "Hilo", "Kailua", "Pearl City"],
    Idaho: ["Boise", "Meridian", "Nampa", "Idaho Falls"],
    Illinois: ["Chicago", "Aurora", "Rockford", "Naperville", "Springfield"],
    Indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"],
    Iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"],
    Kansas: ["Wichita", "Overland Park", "Kansas City", "Topeka"],
    Kentucky: ["Louisville", "Lexington", "Bowling Green", "Owensboro"],
    Louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"],
    Maine: ["Portland", "Lewiston", "Bangor", "Auburn"],
    Maryland: ["Baltimore", "Annapolis", "Frederick", "Rockville"],
    Massachusetts: ["Boston", "Worcester", "Springfield", "Cambridge"],
    Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
    Minnesota: ["Minneapolis", "Saint Paul", "Rochester", "Duluth"],
    Mississippi: ["Jackson", "Gulfport", "Southaven", "Biloxi"],
    Missouri: ["Kansas City", "St. Louis", "Springfield", "Columbia"],
    Montana: ["Billings", "Missoula", "Great Falls", "Bozeman"],
    Nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island"],
    Nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas"],
    "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry"],
    "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison"],
    "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot"],
    Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
    Oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"],
    Oregon: ["Portland", "Eugene", "Salem", "Gresham"],
    Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
    "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket"],
    "South Carolina": ["Columbia", "Charleston", "North Charleston", "Greenville"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"],
    Tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
    Texas: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Plano"],
    Utah: ["Salt Lake City", "West Valley City", "Provo", "Ogden"],
    Vermont: ["Burlington", "South Burlington", "Rutland", "Barre"],
    Virginia: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Arlington"],
    Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
    "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg"],
    Wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha"],
    Wyoming: ["Cheyenne", "Casper", "Laramie", "Gillette"]
  },

  "United Kingdom": {
    England: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Sheffield", "Bristol", "Newcastle"],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    Wales: ["Cardiff", "Swansea", "Newport", "Wrexham"],
    "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry"]
  },

  Canada: {
    Alberta: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Kelowna"],
    Manitoba: ["Winnipeg", "Brandon", "Steinbach"],
    "New Brunswick": ["Moncton", "Saint John", "Fredericton"],
    "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook"],
    "Nova Scotia": ["Halifax", "Sydney", "Dartmouth"],
    Ontario: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London"],
    "Prince Edward Island": ["Charlottetown", "Summerside"],
    Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau"],
    Saskatchewan: ["Saskatoon", "Regina", "Prince Albert"]
  },

  Australia: {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast"],
    Victoria: ["Melbourne", "Geelong", "Ballarat", "Bendigo"],
    Queensland: ["Brisbane", "Gold Coast", "Cairns", "Townsville", "Toowoomba"],
    "Western Australia": ["Perth", "Bunbury", "Albany", "Kalgoorlie"],
    "South Australia": ["Adelaide", "Mount Gambier", "Whyalla"],
    Tasmania: ["Hobart", "Launceston", "Devonport"],
    "Northern Territory": ["Darwin", "Alice Springs", "Palmerston"],
    "Australian Capital Territory": ["Canberra"]
  },

  Germany: {
    Bavaria: ["Munich", "Nuremberg", "Augsburg", "Regensburg"],
    Berlin: ["Berlin"],
    Hamburg: ["Hamburg"],
    Hesse: ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Bonn"],
    Saxony: ["Leipzig", "Dresden", "Chemnitz"],
    "Baden-Württemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Heidelberg"]
  },

  France: {
    "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis"],
    Provence: ["Marseille", "Nice", "Toulon", "Aix-en-Provence"],
    Occitanie: ["Toulouse", "Montpellier", "Nîmes"],
    Auvergne: ["Lyon", "Clermont-Ferrand", "Saint-Étienne"],
    Normandy: ["Rouen", "Caen", "Le Havre"]
  },

  Italy: {
    Lombardy: ["Milan", "Bergamo", "Brescia", "Monza"],
    Lazio: ["Rome", "Latina", "Frosinone"],
    Campania: ["Naples", "Salerno", "Caserta"],
    Sicily: ["Palermo", "Catania", "Messina"],
    Tuscany: ["Florence", "Pisa", "Siena"]
  },

  Spain: {
    Madrid: ["Madrid", "Móstoles", "Alcalá de Henares"],
    Catalonia: ["Barcelona", "Girona", "Tarragona", "Lleida"],
    Andalusia: ["Seville", "Málaga", "Granada", "Córdoba"],
    Valencia: ["Valencia", "Alicante", "Elche", "Castellón"]
  },

  Brazil: {
    "São Paulo": ["São Paulo", "Campinas", "Santos", "Guarulhos"],
    "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Petrópolis"],
    Minas: ["Belo Horizonte", "Uberlândia", "Contagem"],
    Bahia: ["Salvador", "Feira de Santana", "Ilhéus"],
    Paraná: ["Curitiba", "Londrina", "Maringá"]
  },

  Mexico: {
    "Mexico City": ["Mexico City"],
    Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque"],
    NuevoLeon: ["Monterrey", "San Nicolás", "Guadalupe"],
    Puebla: ["Puebla", "Tehuacán"],
    Yucatán: ["Mérida", "Valladolid"]
  },

  Japan: {
    Tokyo: ["Tokyo", "Shinjuku", "Shibuya", "Setagaya"],
    Osaka: ["Osaka", "Sakai", "Higashiosaka"],
    Kyoto: ["Kyoto", "Uji", "Kameoka"],
    Hokkaido: ["Sapporo", "Hakodate", "Asahikawa"],
    Aichi: ["Nagoya", "Toyota", "Okazaki"]
  },

  China: {
    Beijing: ["Beijing"],
    Shanghai: ["Shanghai"],
    Guangdong: ["Guangzhou", "Shenzhen", "Dongguan", "Foshan"],
    Sichuan: ["Chengdu", "Mianyang", "Deyang"],
    Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou"]
  },

  "South Africa": {
    Gauteng: ["Johannesburg", "Pretoria", "Soweto"],
    "Western Cape": ["Cape Town", "Stellenbosch", "George"],
    KwaZuluNatal: ["Durban", "Pietermaritzburg", "Richards Bay"],
    "Eastern Cape": ["Port Elizabeth", "East London", "Mthatha"]
  },

  UAE: {
    Dubai: ["Dubai"],
    AbuDhabi: ["Abu Dhabi", "Al Ain"],
    Sharjah: ["Sharjah", "Khor Fakkan"],
    Ajman: ["Ajman"]
  },

  Singapore: {
    Singapore: ["Singapore"]
  },

  Nepal: {
    Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur"],
    Gandaki: ["Pokhara", "Baglung"],
    Lumbini: ["Butwal", "Bhairahawa"],
    Koshi: ["Biratnagar", "Dharan"]
  },

  Bangladesh: {
    Dhaka: ["Dhaka", "Gazipur", "Narayanganj"],
    Chattogram: ["Chittagong", "Cox's Bazar"],
    Rajshahi: ["Rajshahi", "Bogra"],
    Khulna: ["Khulna", "Jessore"]
  },

  Pakistan: {
    Punjab: ["Lahore", "Rawalpindi", "Faisalabad", "Multan"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur"],
    KPK: ["Peshawar", "Abbottabad", "Mardan"],
    Balochistan: ["Quetta", "Gwadar"]
  },

  SriLanka: {
    Western: ["Colombo", "Negombo", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    Northern: ["Jaffna", "Kilinochchi"]
  },

  Nigeria: {
    Lagos: ["Lagos", "Ikeja", "Lekki"],
    Abuja: ["Abuja"],
    Kano: ["Kano"],
    Rivers: ["Port Harcourt"]
  },

  Kenya: {
    Nairobi: ["Nairobi"],
    Mombasa: ["Mombasa"],
    Kisumu: ["Kisumu"],
    Nakuru: ["Nakuru"]
  },

  Egypt: {
    Cairo: ["Cairo", "Giza"],
    Alexandria: ["Alexandria"],
    Gharbia: ["Tanta"],
    Dakahlia: ["Mansoura"]
  },

  Turkey: {
    Istanbul: ["Istanbul"],
    Ankara: ["Ankara"],
    Izmir: ["Izmir"],
    Bursa: ["Bursa"]
  },

  Russia: {
    Moscow: ["Moscow"],
    "Saint Petersburg": ["Saint Petersburg"],
    Tatarstan: ["Kazan"],
    Novosibirsk: ["Novosibirsk"]
  },

  Netherlands: {
    Holland: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
    Brabant: ["Eindhoven", "Tilburg"]
  },

  Belgium: {
    Brussels: ["Brussels"],
    Flanders: ["Antwerp", "Ghent", "Bruges"],
    Wallonia: ["Liège", "Namur"]
  },

  Switzerland: {
    Zurich: ["Zurich"],
    Geneva: ["Geneva"],
    Bern: ["Bern"],
    Basel: ["Basel"]
  },

  Sweden: {
    Stockholm: ["Stockholm"],
    Skane: ["Malmö", "Lund"],
    VastraGotaland: ["Gothenburg", "Borås"]
  },

  Norway: {
    Oslo: ["Oslo"],
    Vestland: ["Bergen"],
    Trondelag: ["Trondheim"]
  },

  Denmark: {
    Capital: ["Copenhagen"],
    Jutland: ["Aarhus", "Aalborg", "Odense"]
  },

  Finland: {
    Uusimaa: ["Helsinki", "Espoo", "Vantaa"],
    Pirkanmaa: ["Tampere"],
    "Northern Ostrobothnia": ["Oulu"]
  },

  Ireland: {
    Leinster: ["Dublin", "Kilkenny"],
    Munster: ["Cork", "Limerick"],
    Connacht: ["Galway"],
    Ulster: ["Letterkenny"]
  },

  "New Zealand": {
    Auckland: ["Auckland"],
    Wellington: ["Wellington"],
    Canterbury: ["Christchurch"],
    Otago: ["Dunedin"]
  },

  Indonesia: {
    Jakarta: ["Jakarta"],
    "West Java": ["Bandung", "Bekasi", "Bogor"],
    "East Java": ["Surabaya", "Malang"],
    Bali: ["Denpasar", "Ubud"]
  },

  Malaysia: {
    Selangor: ["Shah Alam", "Petaling Jaya", "Subang Jaya"],
    KualaLumpur: ["Kuala Lumpur"],
    Penang: ["George Town"],
    Johor: ["Johor Bahru"]
  },

  Thailand: {
    Bangkok: ["Bangkok"],
    ChiangMai: ["Chiang Mai"],
    Phuket: ["Phuket"],
    Chonburi: ["Pattaya"]
  },

  Vietnam: {
    Hanoi: ["Hanoi"],
    "Ho Chi Minh City": ["Ho Chi Minh City"],
    Danang: ["Da Nang"],
    CanTho: ["Can Tho"]
  },

  Philippines: {
    MetroManila: ["Manila", "Quezon City", "Makati", "Taguig"],
    Cebu: ["Cebu City"],
    Davao: ["Davao City"]
  },

  "Saudi Arabia": {
    Riyadh: ["Riyadh"],
    Makkah: ["Jeddah", "Mecca"],
    "Eastern Province": ["Dammam", "Khobar"],
    Madinah: ["Medina"]
  },

  Qatar: {
    Doha: ["Doha"],
    Rayyan: ["Al Rayyan"]
  },

  Oman: {
    Muscat: ["Muscat"],
    Dhofar: ["Salalah"]
  },

  Kuwait: {
    Capital: ["Kuwait City"],
    Hawalli: ["Hawalli"]
  },

  Argentina: {
    BuenosAires: ["Buenos Aires", "La Plata"],
    Cordoba: ["Córdoba"],
    SantaFe: ["Rosario"],
    Mendoza: ["Mendoza"]
  },

  Chile: {
    Santiago: ["Santiago"],
    Valparaiso: ["Valparaíso"],
    Biobio: ["Concepción"]
  },

  Colombia: {
    Bogota: ["Bogotá"],
    Antioquia: ["Medellín"],
    Valle: ["Cali"],
    Atlantico: ["Barranquilla"]
  },

  Peru: {
    Lima: ["Lima"],
    Arequipa: ["Arequipa"],
    Cusco: ["Cusco"],
    LaLibertad: ["Trujillo"]
  }
};

export default WORLD_LOCATIONS;