export const villageInfo = {
  name: "Lodhaura",
  tagline: "Where tradition meets tomorrow",
  postOffice: "Atraulit",
  tehsil: "Sandila",
  district: "Hardoi",
  state: "Uttar Pradesh",
  country: "India",
  pincode: "241204",
  population: "1500+",
  households: "100+",
  families: "100+",
  schools: "1+",
  temples: "1+",
  area: "4.8 km²",
  establishedYear: 1852,
  primaryLanguage: "Hindi & Awadhi",
  coordinates: {
    lat: 27.2964,
    lng: 80.3478,
  },
  description:
    "Lodhaura is a vibrant rural community in Sandila tehsil, Hardoi district, Uttar Pradesh. Known for its agricultural heritage, Mata Rani Mandir, warm hospitality, and active gram panchayat governance.",
  history:
    "Founded in the mid-19th century, Lodhaura grew around farming cooperatives in the fertile Awadh plains. Today it balances timeless village life with modern connectivity through the Lodhaura Village Portal.",
  geography:
    "Lodhaura lies near Atraulit post office in Sandila tehsil, Hardoi district. The village is surrounded by fertile agricultural fields ideal for wheat, rice, sugarcane, and mustard cultivation.",
  culture:
    "Hindi and Awadhi folk traditions, harvest festivals, and community gatherings define Lodhaura's cultural rhythm. Mata Rani Mandir and Navratri celebrations draw families from across the region.",
  highlights: [
    "Award-winning gram panchayat initiatives",
    "Annual harvest festival & cultural mela",
    "Community health & education programs",
    "Digital literacy center for youth",
  ],
};

export const villageStats = [
  { label: "Population", value: "1,500+", icon: "users" as const },
  { label: "Families", value: "100+", icon: "home" as const },
  { label: "Schools", value: "1", icon: "school" as const },
  { label: "Temples", value: "1", icon: "landmark" as const },
  { label: "Area", value: "4.8 km²", icon: "sparkles" as const },
  { label: "Years of Heritage", value: "170+", icon: "heart" as const },
];

export const timeline = [
  { year: "1852", title: "Village Founded", description: "Lodhaura established as an agricultural settlement along the Ganga basin." },
  { year: "1947", title: "Independence Era", description: "Community leaders organized cooperative farming and local governance structures." },
  { year: "1975", title: "Primary School Opened", description: "Lodhaura Primary School began educating the first generation of village children." },
  { year: "2005", title: "Panchayat Bhawan", description: "New gram panchayat building inaugurated with public meeting halls." },
  { year: "2018", title: "Digital Literacy Drive", description: "Youth volunteers launched computer training for students and farmers." },
  { year: "2024", title: "Village Portal Launch", description: "Lodhaura Village Portal connects diaspora, services, and community updates online." },
];

export const villageLeaders = [
  { name: "Shri Ram Prasad Yadav", role: "Sarpanch", tenure: "2021–Present", image: null },
  { name: "Smt. Geeta Devi", role: "Up-Sarpanch", tenure: "2021–Present", image: null },
  { name: "Shri Mohan Singh", role: "Panchayat Secretary", tenure: "2019–Present", image: null },
  { name: "Shri Anil Kumar", role: "Ward Member — North", tenure: "2021–Present", image: null },
];

export const quickLinks = [
  { title: "Village Directory", description: "Find shops, services, officials & emergency contacts", href: "/directory", icon: "book" as const, gradient: "from-primary to-secondary" },
  { title: "Events & Mela", description: "Festivals, panchayat meetings & community gatherings", href: "/events", icon: "calendar" as const, gradient: "from-secondary to-accent" },
  { title: "Gallery", description: "Photos of Lodhaura's fields, festivals & daily life", href: "/gallery", icon: "camera" as const, gradient: "from-accent to-primary" },
  { title: "Services", description: "Apply for certificates, schemes & panchayat services", href: "/services", icon: "file" as const, gradient: "from-primary via-secondary to-accent" },
  { title: "News & Updates", description: "Latest announcements from gram panchayat", href: "/news", icon: "newspaper" as const, gradient: "from-secondary to-primary" },
  { title: "Contact Panchayat", description: "Reach sarpanch office, helplines & feedback", href: "/contact", icon: "phone" as const, gradient: "from-accent to-secondary" },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Videos", href: "/videos" },
  { label: "Blogs", href: "/blogs" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Panchayat", href: "/panchayat" },
  { label: "Contact", href: "/contact" },
];

export const moreNavLinks = [
  { label: "Development", href: "/development-projects" },
  { label: "Schemes", href: "/government-schemes" },
  { label: "Temple", href: "/temple" },
  { label: "School", href: "/school" },
  { label: "Investors", href: "/investors" },
  { label: "Donate", href: "/donation" },
  { label: "Search", href: "/search" },
];

export const footerLinks = {
  explore: [
    { label: "About Lodhaura", href: "/about" },
    { label: "Photo Gallery", href: "/gallery" },
    { label: "Videos", href: "/videos" },
    { label: "Events Calendar", href: "/events" },
    { label: "Blogs", href: "/blogs" },
    { label: "Investors", href: "/investors" },
  ],
  services: [
    { label: "Panchayat Services", href: "/services" },
    { label: "Government Schemes", href: "/government-schemes" },
    { label: "Development Projects", href: "/development-projects" },
    { label: "Donate", href: "/donation" },
  ],
  connect: [
    { label: "Contact Us", href: "/contact" },
    { label: "Panchayat", href: "/panchayat" },
    { label: "Sign Up", href: "/signup" },
    { label: "Login", href: "/login" },
  ],
};

export const onlineServices = [
  { title: "Birth Certificate", description: "Apply for birth registration and certified copies", icon: "file" as const, status: "available" as const },
  { title: "Income Certificate", description: "Request income proof for schemes and scholarships", icon: "file" as const, status: "available" as const },
  { title: "Caste Certificate", description: "Apply for scheduled caste/tribe certificates", icon: "file" as const, status: "available" as const },
  { title: "Residence Certificate", description: "Proof of residence for government applications", icon: "home" as const, status: "available" as const },
  { title: "Property Mutation", description: "Land record updates and mutation requests", icon: "landmark" as const, status: "coming" as const },
  { title: "Grievance Redressal", description: "Submit complaints and track resolution status", icon: "phone" as const, status: "available" as const },
];

export const galleryCategories = ["All", "Festivals", "Agriculture", "Temple", "School", "Community"];

export const galleryImages = [
  { id: "1", title: "Harvest Festival 2025", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", category: "Festivals", likes: 124, comments: 18 },
  { id: "2", title: "Golden Wheat Fields", url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80", category: "Agriculture", likes: 89, comments: 12 },
  { id: "3", title: "Mata Rani Mandir", url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", category: "Temple", likes: 210, comments: 34 },
  { id: "4", title: "School Morning Assembly", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", category: "School", likes: 67, comments: 8 },
  { id: "5", title: "Panchayat Meeting", url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80", category: "Community", likes: 45, comments: 6 },
  { id: "6", title: "Chhath Puja Ghat", url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&q=80", category: "Festivals", likes: 156, comments: 22 },
  { id: "7", title: "Sugarcane Harvest", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", category: "Agriculture", likes: 72, comments: 9 },
  { id: "8", title: "Village Sports Day", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba9681?w=600&q=80", category: "Community", likes: 98, comments: 14 },
];

export const villageVideos = [
  { id: "1", title: "Lodhaura Harvest Mela 2025", thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", views: 2400, duration: "2:45" },
  { id: "2", title: "Mata Rani Mandir Aarti", thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", views: 5200, duration: "4:12" },
  { id: "3", title: "Primary School Annual Day", thumbnail: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", views: 1800, duration: "3:30" },
  { id: "4", title: "Panchayat Development Tour", thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", views: 980, duration: "5:08" },
];

export const blogs = [
  { slug: "digital-village-future", title: "Building a Digital Future for Rural India", excerpt: "How Lodhaura is bridging tradition and technology through community-driven digital initiatives.", content: "Lodhaura's journey toward digital empowerment began with a simple idea: every villager deserves access to information, services, and connection.\n\nFrom the first computer training sessions in 2018 to today's full-featured village portal, our community has embraced change while honoring its roots.\n\nKey milestones include the digital literacy center, online panchayat services, and a growing network of youth volunteers who teach elders to use smartphones for banking and government schemes.\n\nThe future holds promise — smart farming advisories, telemedicine links, and diaspora engagement through this very portal.", author: "Panchayat Media Team", publishedAt: "2025-05-12", coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80", tags: ["Digital", "Community"], readTime: "5 min" },
  { slug: "harvest-festival-2025", title: "Harvest Festival 2025: A Celebration of Abundance", excerpt: "Thousands gathered for Lodhaura's annual harvest mela featuring folk music, local cuisine, and cooperative awards.", content: "The 2025 Harvest Festival brought together families from across Ghazipur district for three days of celebration.\n\nFarmers showcased their finest produce, youth performed Bhojpuri folk dances, and the panchayat honored outstanding contributors to village development.\n\nHighlights included the tractor parade, traditional wrestling matches, and a community feast prepared by local women's self-help groups.", author: "Smt. Geeta Devi", publishedAt: "2025-04-20", coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", tags: ["Festival", "Culture"], readTime: "4 min" },
  { slug: "water-conservation-drive", title: "Community Water Conservation: Every Drop Counts", excerpt: "Lodhaura farmers adopt drip irrigation and rainwater harvesting with panchayat support.", content: "Water scarcity during summer months prompted the gram panchayat to launch a comprehensive conservation program.\n\nOver 40 households installed rainwater harvesting systems, and cooperative farming groups transitioned 120 acres to drip irrigation.\n\nThe initiative, supported by state agriculture extension officers, has reduced water usage by 30% while maintaining crop yields.", author: "Shri Mohan Singh", publishedAt: "2025-03-08", coverImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", tags: ["Agriculture", "Environment"], readTime: "6 min" },
  { slug: "school-education-milestone", title: "Primary School Achieves 100% Enrollment", excerpt: "Lodhaura Primary School celebrates full enrollment with improved facilities and midday meal program.", content: "For the first time in village history, every school-age child in Lodhaura is enrolled in formal education.\n\nNew classrooms, a library corner, and digital learning tablets — funded through panchayat and CSR partnerships — have transformed the learning environment.\n\nTeachers credit the door-to-door awareness campaign led by mothers' groups for the enrollment milestone.", author: "School Committee", publishedAt: "2025-02-14", coverImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80", tags: ["Education", "School"], readTime: "3 min" },
];

export const events = [
  { id: "1", title: "Gram Sabha Meeting", date: "2025-06-28", time: "10:00 AM", location: "Panchayat Bhawan", type: "meeting" as const, description: "Monthly open gram sabha for budget review and community proposals." },
  { id: "2", title: "Monsoon Plantation Drive", date: "2025-07-15", time: "7:00 AM", location: "Village Perimeter", type: "community" as const, description: "Community tree plantation along roads and school boundary." },
  { id: "3", title: "Chhath Puja Preparation", date: "2025-10-25", time: "5:00 AM", location: "Community Ghat", type: "festival" as const, description: "Annual Chhath Puja preparations and ghat cleaning." },
  { id: "4", title: "Harvest Mela 2024", date: "2024-11-18", time: "9:00 AM", location: "Main Ground", type: "festival" as const, description: "Annual harvest celebration with folk performances and food stalls." },
  { id: "5", title: "Health Camp", date: "2024-09-05", time: "8:00 AM", location: "Primary Health Center", type: "community" as const, description: "Free health checkups and vaccination drive." },
];

export const newsItems = [
  { id: "1", title: "New Solar Street Lights Installed on Main Road", excerpt: "Panchayat completes installation of 45 solar-powered street lights improving safety.", date: "2025-06-10", category: "Infrastructure", isBreaking: true },
  { id: "2", title: "PM-KISAN Installment Disbursed to 520 Farmers", excerpt: "Latest installment credited to eligible farmer accounts in Lodhaura.", date: "2025-06-05", category: "Schemes", isBreaking: false },
  { id: "3", title: "Digital Literacy Center Expands Hours", excerpt: "Computer training now available evenings for working adults.", date: "2025-05-28", category: "Education", isBreaking: false },
  { id: "4", title: "Water Tank Renovation Completed", excerpt: "Overhead tank repair ensures uninterrupted supply during summer.", date: "2025-05-15", category: "Infrastructure", isBreaking: false },
  { id: "5", title: "Inter-Village Cricket Tournament Winners", excerpt: "Lodhaura team wins Ghazipur block-level cricket championship.", date: "2025-04-30", category: "Sports", isBreaking: false },
];

export const developmentProjects = [
  { id: "1", title: "Village Road Asphalting", description: "2.5 km internal road upgrade with drainage", progress: 85, budget: "₹42 Lakhs", status: "ongoing" as const, deadline: "Jul 2025" },
  { id: "2", title: "Community Health Center Upgrade", description: "New equipment and staff quarters renovation", progress: 60, budget: "₹18 Lakhs", status: "ongoing" as const, deadline: "Sep 2025" },
  { id: "3", title: "Smart Classroom — Primary School", description: "Digital boards, tablets, and internet connectivity", progress: 100, budget: "₹8 Lakhs", status: "completed" as const, deadline: "Mar 2025" },
  { id: "4", title: "Waste Management System", description: "Segregation bins and composting unit", progress: 35, budget: "₹5 Lakhs", status: "ongoing" as const, deadline: "Dec 2025" },
];

export const governmentSchemes = [
  { id: "1", title: "PM-KISAN", level: "central" as const, description: "Direct income support of ₹6,000/year to eligible farmer families.", eligibility: "Small and marginal farmers with valid land records", benefits: "₹2,000 per installment, 3 times a year" },
  { id: "2", title: "PM Awas Yojana (Gramin)", level: "central" as const, description: "Financial assistance for construction of pucca houses.", eligibility: "Families without pucca house per SECC data", benefits: "Up to ₹1.2 lakh assistance" },
  { id: "3", title: "Mukhyamantri Kanya Sumangala Yojana", level: "state" as const, description: "Financial support for girl child education and marriage.", eligibility: "Families with girl children born in UP", benefits: "₹15,000–₹51,000 in installments" },
  { id: "4", title: "Swachh Bharat Mission (Gramin)", level: "central" as const, description: "Toilet construction and sanitation awareness.", eligibility: "Households without individual toilets", benefits: "Incentive for toilet construction" },
  { id: "5", title: "UP FPO Promotion Scheme", level: "state" as const, description: "Support for farmer producer organizations.", eligibility: "Farmer groups with minimum membership", benefits: "Grants and market linkage support" },
  { id: "6", title: "Ayushman Bharat", level: "central" as const, description: "Health insurance coverage for vulnerable families.", eligibility: "SECC-identified eligible families", benefits: "₹5 lakh/year family floater cover" },
];

export const panchayatMembers = [
  { name: "Shri Ram Prasad Yadav", role: "Sarpanch", ward: "—", phone: "+91 98765 43210" },
  { name: "Smt. Geeta Devi", role: "Up-Sarpanch", ward: "—", phone: "+91 98765 43211" },
  { name: "Shri Anil Kumar", role: "Ward Member", ward: "Ward 1 — North", phone: "+91 98765 43212" },
  { name: "Smt. Radha Devi", role: "Ward Member", ward: "Ward 2 — South", phone: "+91 98765 43213" },
  { name: "Shri Suresh Maurya", role: "Ward Member", ward: "Ward 3 — East", phone: "+91 98765 43214" },
  { name: "Shri Mohan Singh", role: "Secretary", ward: "—", phone: "+91 98765 43215" },
];

export const panchayatMeetings = [
  { date: "2025-06-28", agenda: "Gram Sabha — Annual budget review", status: "upcoming" as const },
  { date: "2025-05-30", agenda: "Road project progress & contractor review", status: "completed" as const },
  { date: "2025-04-15", agenda: "Water conservation scheme approval", status: "completed" as const },
];

export const panchayatNotices = [
  { id: "1", title: "Gram Sabha Notice — June 28", date: "2025-06-20", urgent: true },
  { id: "2", title: "Property Tax Collection Schedule", date: "2025-06-01", urgent: false },
  { id: "3", title: "Monsoon Preparedness Advisory", date: "2025-05-25", urgent: false },
];

export const emergencyContacts = [
  { name: "Police", number: "100", icon: "shield" as const },
  { name: "Ambulance", number: "108", icon: "heart" as const },
  { name: "Fire", number: "101", icon: "flame" as const },
  { name: "Panchayat Helpline", number: "+91 8188898587", icon: "phone" as const },
  { name: "Health Center", number: "+91 98765 43220", icon: "heart" as const },
  { name: "Electricity Complaint", number: "1912", icon: "zap" as const },
];

export const donationCampaign = {
  title: "School Library Fund 2025",
  description: "Help us build a community library at Lodhaura Primary School with books, shelves, and reading corners.",
  goal: 250000,
  raised: 178500,
  donors: 142,
  upiId: "lodhaura.panchayat@upi",
};

export const topDonors = [
  { name: "Shri Rajesh Kumar (Diaspora)", amount: 25000, date: "2025-06-01" },
  { name: "Lodhaura Youth Club", amount: 15000, date: "2025-05-20" },
  { name: "Anonymous", amount: 10000, date: "2025-05-15" },
  { name: "Smt. Kamla Devi", amount: 5000, date: "2025-05-10" },
];

export const testimonials = [
  { name: "Shri Vijay Yadav", role: "Farmer", quote: "The village portal helped me apply for PM-KISAN and track my application without visiting the block office.", avatar: null },
  { name: "Smt. Priya Singh", role: "Teacher", quote: "Our students use the portal to read news and learn about local history. It's become part of our digital literacy classes.", avatar: null },
  { name: "Shri Amit Kumar", role: "Diaspora Member", quote: "Living in Mumbai, I stay connected to Lodhaura through events and gallery updates. Proud of our village's progress.", avatar: null },
];

export const templeInfo = {
  name: "Mata Rani Mandir",
  description: "The heart of Lodhaura's spiritual life, Mata Rani Mandir has served devotees for over a century. Daily aarti, Navratri celebrations, and community feasts draw visitors from neighboring villages.",
  timings: "5:00 AM – 12:00 PM, 4:00 PM – 9:00 PM",
  festivals: ["Navratri", "Chhath Puja", "Makar Sankranti", "Sharad Purnima"],
  history: "Built in the early 1900s by village elders, the temple was renovated in 2015 with community contributions and panchayat support.",
  image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
};

export const schoolInfo = {
  name: "Lodhaura Primary School",
  description: "Established in 1975, Lodhaura Primary School provides quality education to 280+ students from Classes 1–8 with dedicated teachers and modern learning facilities.",
  principal: "Shri Devendra Prasad",
  students: 285,
  teachers: 12,
  facilities: ["Smart Classrooms", "Library", "Midday Meal Kitchen", "Sports Ground", "Computer Lab"],
  achievements: ["100% enrollment 2025", "Block-level science fair winners", "Swachh Vidyalaya award"],
  image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
};

export const searchSuggestions = [
  "PM-KISAN", "Gram Sabha", "Birth Certificate", "Mata Rani Mandir", "Harvest Festival", "Health Camp", "Panchayat Meeting",
];

export type Blog = (typeof blogs)[number];
export type Event = (typeof events)[number];
export type NewsItem = (typeof newsItems)[number];
export type Scheme = (typeof governmentSchemes)[number];

export function getBlogBySlug(slug: string) {
  return blogs.find((b) => b.slug === slug);
}

export function getUpcomingEvents() {
  const now = new Date();
  return events.filter((e) => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEvents() {
  const now = new Date();
  return events.filter((e) => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Investors Page Data
export const whyInvestReasons = [
  { title: "Growing Local Economy", description: "Our village is experiencing steady economic growth, backed by local panchayat initiatives and digital connectivity.", icon: "trending-up" as const },
  { title: "Skilled Local Workforce", description: "A young, educated, and eager workforce ready to contribute to manufacturing, services, and agricultural sectors.", icon: "users" as const },
  { title: "Strategic Location", description: "Well-connected to major highways and district centers, making logistics and transportation efficient.", icon: "map-pin" as const },
  { title: "Community Support", description: "A welcoming local community and supportive gram panchayat that actively encourages sustainable development.", icon: "heart-handshake" as const },
  { title: "Available Resources", description: "Rich agricultural land, ample water supply, and growing solar infrastructure to support new ventures.", icon: "leaf" as const },
  { title: "Long-Term Growth", description: "Invest in a community that is building for the future. Early partnerships offer significant long-term potential.", icon: "line-chart" as const },
];

export const investmentOpportunities = [
  { title: "Agriculture & Farming", description: "Modern farming techniques, organic produce, and agro-processing units.", icon: "tractor" as const },
  { title: "Small-Scale Manufacturing", description: "Local production facilities utilizing our skilled workforce.", icon: "factory" as const },
  { title: "Tourism & Hospitality", description: "Eco-tourism, rural homestays, and cultural heritage experiences.", icon: "tent" as const },
  { title: "Dairy & Livestock", description: "Milk processing, veterinary services, and modern dairy farms.", icon: "milk" as const },
  { title: "Digital & Tech Services", description: "BPOs, IT training centers, and digital service hubs.", icon: "laptop" as const },
  { title: "Renewable Energy", description: "Solar power installations and sustainable energy projects.", icon: "sun" as const },
];

export const investmentBenefits = [
  "Access to untapped local markets",
  "Dedicated support from the Gram Panchayat",
  "Lower operational and establishment costs",
  "Opportunity for significant social impact",
  "Building long-lasting community partnerships",
  "Contributing to sustainable rural development",
];

export const communityImpacts = [
  { title: "Employment Generation", value: "Providing jobs to local youth prevents urban migration." },
  { title: "Skill Development", value: "Training local workers creates a highly capable workforce." },
  { title: "Better Infrastructure", value: "Investments often lead to improved roads, power, and facilities." },
  { title: "Economic Resilience", value: "Diversified businesses strengthen the entire village economy." },
];
