type NavLink = {
    href:string;
    label:string;
}

export const jobSeekerLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/apply/company', label: 'Become a company' },

];

export const employerLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Company Profile' },
    { href: '/support', label: 'Support' },
];

export const adminLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Admin panel' },
    { href: '/support', label: 'Support' },
];


export const employerSidebarLinks:NavLink[] =[
     { href: '/profile', label: 'Company Profile' },
    { href: '/job/create', label: 'Post a Job' },
    { href: '/job/manage', label: 'Manage Jobs' },
    { href: '/job/applications/manage', label: 'Manage Applications' },
   
]

export const jobSeekerSidebarLinks:NavLink[] =[
    { href: '/profile', label: 'Profile' },
    { href: '/job/applied', label: 'Applied Jobs' },
  
]

export const adminSidebarLinks:NavLink[] =[
    { href: '/profile', label: 'Profile' },
    { href: '/job/applied', label: 'Applied Jobs' },
    { href: '/admin/manage/application', label: 'companies applications' },
  
]

export const employmentType = [
    { type: 'Full-Time' },
    { type: 'Part-Time' },
    { type: 'Contract' },
    { type: 'Freelance' },
    { type: 'Internship' },
    { type: 'Remote' },
  ];

  export const levels = [
    { type: 'intern' },
    { type: 'entry-level' },
    { type: 'junior-level' },
    { type: 'senior-level' },
    { type: 'managerial' },
    { type: 'executive' },
  ];

  export const salaryRange = [
    { type: '10-20k' },
    { type: '20-30k' },
    { type: '30-50k' },
    { type: '40-50k' },
    { type: '50-60k' },
    { type: '60-70k' },
    { type: '70-80k' },
    { type: '80-90k' },
    { type: '90-100k' },
    { type: '100-110k' },
    { type: '110-120k' },
    { type: '120-130k' },
    { type: '130-140k' },
    { type: '140-150k' },
    { type: '150-160k' },
  ];