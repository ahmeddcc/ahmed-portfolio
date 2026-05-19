export const initialData = {
  personal: {
    name: "Ahmed Hamed",
    title: "IT Support Specialist | AI-Powered Solutions Builder | Self-Published Author",
    phone: "+201014093162",
    email: "ahmeddcc@gmail.com",
    location: "Kafr El-Sheikh, Egypt",
    linkedin: "linkedin.com/in/ahmed-hamed-it",
    image: "/assets/profile.jpg",
    bio: `I have been working in IT for over 20 years. Not through a structured career — mostly on my own, taking on whatever came my way and learning as I went.

That has meant repairing computers for hundreds of clients, training people who had never touched a keyboard, managing data for companies in the field, and keeping satellite internet systems running in places with no other connection.

Over the past two years I pushed into something new. Using AI tools, I built a live business website for a client, a 14-module ERP system for a service center that is running today, and a full ticketing platform I designed from scratch in PHP and MySQL. I also published a children's book series on Amazon KDP and I am building a web companion system to go with the next edition.`
  },

  pages: [
    { id: "home", title: "Home", path: "/", icon: "Home", order: 1, visible: true },
    { id: "about", title: "About Me", path: "/about", icon: "User", order: 2, visible: true },
    { id: "projects", title: "Projects", path: "/projects", icon: "Briefcase", order: 3, visible: true },
    { id: "experience", title: "Experience", path: "/experience", icon: "History", order: 4, visible: true },
    { id: "skills", title: "Skills", path: "/skills", icon: "Zap", order: 5, visible: true },
    { id: "contact", title: "Contact", path: "/contact", icon: "Mail", order: 6, visible: true }
  ],

  projects: [
    {
      id: 1,
      title: "Puzzle Key",
      subtitle: "Interactive Book Companion",
      type: "Personal Project",
      tech: "PHP / MySQL",
      status: "In Development",
      period: "2026 - Present",
      description: "A website companion for children's puzzle books. Each chapter ends with a puzzle — solve it, get the code, and unlock answers online. The child earns access rather than just flipping to the back of the book.",
      features: [
        "Word Search grids with color-highlighted solutions",
        "Admin panel for books, answer files, access codes",
        "Usage stats and download tracking",
        "QR code integration per chapter"
      ],
      color: "#6366f1",
      image: "/assets/projects/puzzle-key.jpg",
      link: "#",
      liveUrl: ""              // ← جديد: رابط المشروع الحي
    },
    {
      id: 2,
      title: "Tick-Sys",
      subtitle: "IT Ticketing & Service Management",
      type: "Commercial Product",
      tech: "PHP 7.4+ / MySQL",
      status: "On Hold",
      period: "2025 - 2026",
      description: "Built from scratch for maintenance centers that were tracking jobs on paper or in spreadsheets. The system handles the full life of a ticket — from the moment a job comes in to the moment it is closed.",
      features: [
        "Time-based service rules with auto overdue flagging",
        "Role and permissions system",
        "Asset and license tracking",
        "Performance scoring engine for technician bonuses",
        "Two-step login, brute-force protection, audit trail",
        "Instant Telegram notifications for technicians"
      ],
      color: "#f59e0b",
      image: "/assets/projects/tick-sys.jpg",
      link: "#",
      liveUrl: ""              // ← جديد
    },
    {
      id: 3,
      title: "Moussa Mobile Services",
      subtitle: "Business Management System",
      type: "Client Project",
      tech: "PHP / MySQL",
      status: "Live",
      period: "2025 - 2026",
      description: "One system to run an entire business — sales, repairs, stock, suppliers, expenses, and reports. Fourteen connected sections, all working together.",
      features: [
        "14 connected sections working together",
        "Dashboard showing daily income, repair queue, low stock alerts",
        "Cash drawer balance tracking"
      ],
      color: "#10b981",
      image: "/assets/projects/moussa.jpg",
      link: "#",
      liveUrl: ""              // ← جديد
    },
    {
      id: 4,
      title: "Al-Muwafi Office Equipment",
      subtitle: "Business Website",
      type: "Client Project",
      tech: "PHP / HTML / CSS",
      status: "Live",
      period: "2025 - 2026",
      description: "Full business website for a Ricoh office equipment company — product pages, spare parts section, a maintenance request form, and contact details.",
      features: [
        "Product pages and spare parts section",
        "Maintenance request form",
        "Contact details and company info"
      ],
      color: "#3b82f6",
      image: "/assets/projects/almuwafi.jpg",
      link: "#",
      liveUrl: "https://almuwafi.com"   // ← مثال: أضف الرابط الحقيقي
    },
    {
      id: 5,
      title: "Children's Word Search",
      subtitle: "Amazon KDP Book Series",
      type: "Self-Published",
      tech: "Amazon KDP / Publishing",
      status: "Published",
      period: "2025 - 2026",
      description: "Wrote and published a puzzle book series for children on Amazon. Two editions are live. A third is in progress, and Puzzle Key is being built specifically to go with it.",
      features: [
        "Two editions: color and black & white",
        "Third edition in progress",
        "Puzzle Key companion system being built"
      ],
      color: "#ec4899",
      image: "/assets/projects/books.jpg",
      link: "#",
      liveUrl: "https://amazon.com/..."   // ← مثال: رابط Amazon KDP
    }
  ],

  experience: [
    {
      id: 1,
      title: "Computer Maintenance & IT Support",
      company: "Self-Employed",
      location: "Kafr El-Sheikh, Egypt",
      period: "March 2008 - Present",
      duration: "17+ years",
      description: "Built a steady stream of clients — mostly individuals and small shops who called when something stopped working. Hardware failures, viruses, slow machines, software problems — handled whatever came in.",
      achievements: [
        "100+ clients, many returning regularly",
        "Training sessions for first-time computer users including ICDL",
        "Hardware repair and software troubleshooting"
      ],
      icon: "Wrench",
      color: "#3b82f6"
    },
    {
      id: 2,
      title: "IT Specialist",
      company: "Navigator for Agricultural Investment — Al Dahra Agriculture",
      location: "Egypt",
      period: "June 2010 - July 2012",
      duration: "2 years",
      description: "Managed IT needs across several project sites — keeping machines running, maintaining the internal network, and handling data entry for project records.",
      achievements: [
        "Maintained internal network and machines",
        "Handled data entry for project records",
        "Operated and maintained VSAT satellite internet station (HN7740S)"
      ],
      icon: "Satellite",
      color: "#10b981"
    },
    {
      id: 3,
      title: "IT Support & Data Entry",
      company: "Lehaa for Trading and Agricultural Investment",
      location: "Egypt",
      period: "August 2006 - August 2007",
      duration: "1 year",
      description: "Data entry and record-keeping using Microsoft Access, maintained the internal network, and kept the VSAT satellite system running.",
      achievements: [
        "Microsoft Access data management",
        "Internal network maintenance",
        "VSAT satellite system operation",
        "Reports and presentations for business"
      ],
      icon: "Database",
      color: "#f59e0b"
    },
    {
      id: 4,
      title: "Computer Trainer & IT Support",
      company: "Youth Center of Demro — Sidi Salem",
      location: "Kafr El-Sheikh, Egypt",
      period: "August 2001 - July 2006",
      duration: "5 years",
      description: "Taught 100+ students over five years. For most of them this was the first time they had used a computer properly. Started from zero with each group.",
      achievements: [
        "Started from zero with each group",
        "Students learned Office, web browsing, machine maintenance",
        "Handled center's technical needs"
      ],
      icon: "GraduationCap",
      color: "#8b5cf6"
    }
  ],

  skills: {
    development: [
      { name: "AI-assisted Development", level: 90, icon: "Brain" },
      { name: "PHP & MySQL", level: 85, icon: "Code" },
      { name: "Telegram Bot Integration", level: 80, icon: "Bot" },
      { name: "JSON Data Handling", level: 85, icon: "FileJson" },
      { name: "System Planning & Design", level: 88, icon: "Layout" }
    ],
    technical: [
      { name: "Microsoft Office Suite", level: 95, icon: "Monitor" },
      { name: "Database Management (Access, Excel)", level: 90, icon: "Database" },
      { name: "Hardware Repair", level: 92, icon: "Cpu" },
      { name: "LAN Network Setup", level: 85, icon: "Network" },
      { name: "VSAT Satellite Systems", level: 80, icon: "Satellite" }
    ],
    soft: [
      { name: "Self-Management", level: 95, icon: "UserCheck" },
      { name: "Client Communication", level: 90, icon: "MessageCircle" },
      { name: "Technical Teaching", level: 92, icon: "BookOpen" },
      { name: "Problem Solving", level: 93, icon: "Lightbulb" }
    ]
  },

  education: [
    {
      id: 1,
      degree: "Vocational High School Diploma — Industrial Studies",
      school: "Sidi Salem Industrial Vocational High School",
      location: "Kafr El-Sheikh, Egypt",
      year: "Graduated"
    }
  ],

  certifications: [
    {
      id: 1,
      name: "International Computer Driving License (ICDL)",
      date: "September 2009",
      center: "IT Training Center — UNESCO Approved",
      certId: "egy000272989",
      icon: "Award"
    }
  ],

  languages: [
    { name: "Arabic", level: "Native", proficiency: 100 },
    { name: "English", level: "Basic reading and writing", proficiency: 60 }
  ],

  settings: {
    password: "admin123",
    profileImage: "/assets/profile.jpg",
    siteTitle: "Ahmed Hamed | Portfolio",
    theme: "dark",
    animationsEnabled: true
  }
};

export default initialData;
