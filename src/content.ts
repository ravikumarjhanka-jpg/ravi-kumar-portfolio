// Single source of truth for every word on the site (v3, virtual guide).
// Every claim comes from Ravi Kumar's resume (Resume_Ravi.pdf). Edit here and rebuild.
// Rule: no invented clients, metrics, revenue, percentages, titles or qualifications.
// Items marked REVIEW are reasonable groupings of resume lines that Ravi should confirm.

export const profile = {
  name: 'Ravi Kumar',
  title: 'Group Vice President – Finance',
  employer: 'Miles Education',
  employerLogo: '', // e.g. 'brand/miles-education.svg' once the official logo is supplied
  credential: 'Chartered Accountant',
  location: 'Bengaluru, India',
  email: 'ravikumarjhankal@gmail.com',
  phone: '+91 9901851754',
  phoneHref: '+919901851754',
  linkedin: 'https://www.linkedin.com/in/ravikumar-8579b236',
  resume: 'Ravi_Kumar_Resume.pdf',
  summary:
    'Chartered Accountant and Global Finance Leader with 15+ years of experience across Financial Controllership, Strategic FP&A, Business Finance, GCC Operations and Finance Transformation.',
  annotations: ['Strategy', 'Finance', 'Transformation', 'Global Growth'],
};

export const intro = {
  line1: 'Hello, I’m Ravi Kumar.',
  line2: 'Explore my journey in finance leadership, transformation and global operations.',
  listen:
    'Hello, I’m Ravi Kumar, Group Vice President of Finance at Miles Education. I’m a Chartered Accountant with over fifteen years across financial controllership, strategic F P and A, business finance, G C C operations and finance transformation. Explore my journey in finance leadership, transformation and global operations.',
};

export const nav = [
  { id: 'home', label: 'Home', avatar: 'greeting' },
  { id: 'about', label: 'About', avatar: 'about' },
  { id: 'experience', label: 'Experience', avatar: 'experience' },
  { id: 'expertise', label: 'Expertise', avatar: 'skills' },
  { id: 'achievements', label: 'Achievements', avatar: 'achievement' },
  { id: 'transformation', label: 'Finance Transformation', avatar: 'presenting' },
  { id: 'education', label: 'Education', avatar: 'education' },
  { id: 'contact', label: 'Contact', avatar: 'contact' },
] as const;

export const kpis = [
  { value: 15, prefix: '', suffix: '+', label: 'Years Experience', note: 'Since March 2011' },
  { value: 17, prefix: '', suffix: '', label: 'Entities Managed', note: 'Miles Education group' },
  { value: 3, prefix: '', suffix: '', label: 'Geographies', note: 'India • US • Middle East' },
  { value: 25, prefix: '', suffix: '+', label: 'Finance Professionals Led', note: 'Grant Thornton Bharat' },
  { value: 456, prefix: 'US$', suffix: 'M', label: 'NASDAQ SPAC Transaction', note: 'Listing readiness' },
];

export const about = {
  title: ['Finance Leader.', 'Transformation Enabler.', 'Trusted Business Partner.'],
  text: [
    'Ravi is a Chartered Accountant and senior finance leader. As Group Vice President – Finance at Miles Education he owns group finance across 17 entities in India, the US and the Middle East, and works as a CFO-equivalent partner to the CEO and board.',
    'His career runs from a decade of audit and internal controls at Grant Thornton, through FP&A and IPO readiness at Aris Global and a US$456M NASDAQ SPAC at Grant Thornton Bharat, to running a multi-entity finance function today.',
  ],
  areas: ['Financial Controllership', 'Strategic FP&A', 'Business Finance', 'GCC Operations', 'BOT Models', 'Finance Transformation', 'Multi-entity operations', 'Treasury', 'Governance', 'Automation'],
};

export const experience = [
  {
    org: 'Miles Education', role: 'Group Vice President – Finance', period: 'Oct 2024 – Present', current: true,
    summary: 'Owns the complete group finance function and serves as CFO-equivalent to the CEO and board.',
    highlights: ['Group finance leadership', 'Financial planning', 'Budgeting', 'Multi-entity reporting', '17 entities', 'Three geographies', 'CEO / board collaboration', 'Capital allocation', 'Investor reporting', 'Treasury', 'Working capital', 'MIS dashboards', 'FP&A', 'Zoho ERP implementation', 'Finance automation', 'Cross-border taxation', 'Transfer pricing'],
  },
  {
    org: 'Grant Thornton Bharat LLP', role: 'Associate Director', period: 'May 2023 – Oct 2024',
    summary: 'Led 25+ finance professionals across global reporting frameworks and steered NASDAQ listing readiness via SPAC merger.',
    highlights: ['Leadership of 25+ finance professionals', 'IFRS', 'Ind AS', 'US GAAP', 'SFRS', 'UK GAAP', 'NASDAQ / SPAC readiness', 'SEC readiness', 'ASC 606', 'ESOP accounting', 'SaaS revenue', 'Cross-border structuring', 'Transfer pricing'],
  },
  {
    org: 'Aris Global', role: 'Head of Department – Finance', period: 'Oct 2021 – May 2023',
    summary: 'Partnered with the CEO, CFO and board on M&A, IPO readiness and fundraising, and owned FP&A.',
    highlights: ['CEO / CFO / board partnership', 'M&A', 'IPO readiness', 'Fundraising', 'Strategic finance', 'FP&A', 'Forecasting', 'Scenario modelling', 'Global finance operations', 'Finance workflow automation (40% less manual effort)'],
  },
  {
    org: 'Grant Thornton LLP', role: 'Management Consultant (Trainee)', period: 'Mar 2011 – Nov 2021',
    summary: 'Managed statutory audit engagements for clients with budgets above INR 500 Cr.',
    highlights: ['Audit', 'Assurance', 'Financial reporting', 'Internal controls', 'Revenue recognition', 'Lease accounting', 'ESOPs', 'Risk assessment'],
  },
];

export const expertise = [
  { name: 'Financial Planning & Analysis', note: 'Budgeting, forecasting, variance and scenario models' },
  { name: 'Controllership', note: 'Multi-entity close, reporting and compliance' },
  { name: 'US GAAP', note: 'Aris Global, Grant Thornton Bharat' },
  { name: 'IFRS', note: 'Global reporting engagements' },
  { name: 'Ind AS', note: 'Indian reporting framework' },
  { name: 'ASC 606', note: 'Revenue recognition, including SaaS' },
  { name: 'Multi-entity Consolidation', note: '17 entities across three geographies' },
  { name: 'IPO Readiness', note: 'NASDAQ, SPAC and SEC readiness' },
  { name: 'M&A Advisory', note: 'With the CEO, CFO and board at Aris Global' },
  { name: 'ERP Implementation', note: 'End-to-end finance system rollout' },
  { name: 'Zoho ERP', note: 'Procurement, sales, payroll and banking' },
  { name: 'Transfer Pricing', note: 'Documentation and cross-border structuring' },
  { name: 'Audit Management', note: 'Statutory audits above INR 500 Cr' },
  { name: 'Internal Controls', note: 'Revenue, leases and ESOPs' },
  { name: 'Board Reporting', note: 'Board-level MIS and investor reporting' },
];

export const commandCenter = [
  { key: 'strategic', title: 'Strategic Finance', items: ['FP&A', 'Forecasting', 'Scenario Planning', 'Capital Allocation'], viz: 'line' },
  { key: 'global', title: 'Global Finance', items: ['India', 'United States', 'Middle East'], viz: 'regions' },
  { key: 'reporting', title: 'Reporting', items: ['MIS', 'Board Reporting', 'Consolidation'], viz: 'consolidate' },
  { key: 'transformation', title: 'Transformation', items: ['Zoho ERP', 'Automation', 'Process Improvement'], viz: 'pipeline' },
  { key: 'governance', title: 'Governance', items: ['Internal Controls', 'Compliance', 'Transfer Pricing'], viz: 'checks' },
] as const;

export const achievements = [
  { title: 'US$456M NASDAQ SPAC Transaction', text: 'Managed listing readiness for an e-commerce client, owning accounting, SEC readiness and end-to-end compliance.', where: 'Grant Thornton Bharat LLP', icon: 'deal' },
  { title: 'Zoho ERP Transformation', text: 'Drove end-to-end Zoho ERP implementation across procurement, sales, payroll and banking for real-time visibility.', where: 'Miles Education', icon: 'erp' },
  { title: 'Finance Automation', text: 'Automated finance workflows, reducing manual effort by 40% and accelerating close cycles.', where: 'Aris Global', icon: 'auto' },
  { title: 'Multi-Entity Finance', text: 'Owns planning, budgeting and reporting across 17 entities spanning three geographies.', where: 'Miles Education', icon: 'entities' },
  { title: 'Global Reporting', text: 'Delivered reporting under IFRS, Ind AS, US GAAP, SFRS and UK GAAP.', where: 'Grant Thornton Bharat LLP', icon: 'globe' },
  { title: 'Treasury & Working Capital', text: 'Led treasury and working capital strategy to enhance liquidity ratios and support expansion plans.', where: 'Miles Education', icon: 'treasury' },
  { title: 'SEC / IPO Readiness', text: 'SEC and listing readiness for a SPAC merger, and IPO readiness with the board at Aris Global.', where: 'Grant Thornton Bharat · Aris Global', icon: 'ipo' },
  { title: 'MIS Dashboard Development', text: 'Designed and deployed MIS dashboards for real-time financial visibility, improving the monthly close cycle.', where: 'Miles Education', icon: 'mis' },
  { title: 'Team Leadership', text: 'Led and mentored 25+ finance professionals, and rebuilt a finance team with KPIs and accountability.', where: 'Grant Thornton Bharat · Miles Education', icon: 'team' },
];

export const transformation = {
  title: 'Turning Finance Into Strategic Impact',
  stages: [
    { name: 'Financial complexity', text: 'Many entities, three countries, several reporting frameworks.' },
    { name: 'Standardised processes', text: 'One way of planning, closing and reporting across the group.' },
    { name: 'ERP & Automation', text: 'Zoho ERP across procurement, sales, payroll and banking, plus workflow automation.' },
    { name: 'Real-time MIS', text: 'Dashboards that give leadership live financial visibility.' },
    { name: 'Stronger controls', text: 'Internal controls, compliance and transfer pricing documentation.' },
    { name: 'Better decisions', text: 'Variance analysis and scenario models for the CEO and board.' },
    { name: 'Scalable growth', text: 'Treasury and working capital strategy that supports expansion.' },
  ],
};

export const globalOps = {
  label: 'Finance Leadership Across 3 Geographies',
  regions: [
    { code: 'IN', name: 'India', lon: 77.6, lat: 12.97, note: 'Base · Bengaluru' },
    { code: 'US', name: 'United States', lon: -98, lat: 39, note: 'US entities · US GAAP' },
    { code: 'ME', name: 'Middle East', lon: 50, lat: 25, note: 'Regional entities' },
  ],
};

export const leadership = [
  { title: 'Strategic Thinker', text: 'Works with the CEO and board on growth strategy, capital allocation and investor reporting.' },
  { title: 'People Leader', text: 'Led and mentored 25+ finance professionals, and mentors junior team members on technical accounting, modelling and audit.' },
  { title: 'Transformation Driver', text: 'Championed finance automation and an end-to-end Zoho ERP implementation.' },
  { title: 'Problem Solver', text: 'Automated finance workflows at Aris Global, cutting manual effort by 40% and speeding up close.' },
  { title: 'Governance Focus', text: 'Built internal controls and kept statutory compliance and vendor governance tight across geographies.' },
  { title: 'Growth Enabler', text: 'Led treasury and working capital strategy to support expansion plans.' },
];

export const education = [
  { title: 'Chartered Accountant – Finance', org: 'Institute of Chartered Accountants of India', year: '2017' },
  { title: 'B.Com – Commerce', org: 'Vijaya College, Bangalore', year: '2009' },
];

export const contact = {
  title: 'Let’s Connect',
  text: 'For finance leadership, transformation, governance or board conversations.',
  topics: ['Finance leadership role', 'Advisory or board conversation', 'Speaking or mentoring', 'Recruiter enquiry', 'Other'],
};

// Ask Ravi: predefined answers from the resume. Keys drive the local matcher.
export const askRavi = {
  questions: [
    { q: 'Tell me about Ravi', id: 'about' },
    { q: 'What is his FP&A experience?', id: 'fpa' },
    { q: 'What is his finance transformation experience?', id: 'transform' },
    { q: 'What is his GCC experience?', id: 'gcc' },
    { q: 'What ERP work has he led?', id: 'erp' },
    { q: 'What is his IPO/SPAC experience?', id: 'ipo' },
    { q: 'What accounting frameworks does he know?', id: 'frameworks' },
    { q: 'What teams has he managed?', id: 'teams' },
    { q: 'What is his current role?', id: 'role' },
    { q: 'How can I contact him?', id: 'contact' },
  ],
  answers: {
    about: { keys: ['about', 'who', 'tell me', 'ravi', 'introduce', 'background'], a: 'I’m a Chartered Accountant with 15+ years across financial controllership, strategic FP&A, business finance, GCC operations, BOT models and finance transformation. Today I’m Group Vice President – Finance at Miles Education.' },
    fpa: { keys: ['fp&a', 'fpa', 'planning', 'budget', 'forecast', 'variance', 'scenario', 'model'], a: 'I built FP&A frameworks, variance analysis models and board-level MIS at Miles Education. At Aris Global I owned FP&A, including budgeting, forecasting, variance analysis and scenario modelling, to advise on margin improvement and deal structuring.' },
    transform: { keys: ['transform', 'automation', 'automate', 'process', 'improve', 'digital'], a: 'I championed finance automation and an end-to-end Zoho ERP implementation at Miles Education. At Aris Global, automating finance workflows reduced manual effort by 40% and accelerated close cycles. I have also delivered SAP-integrated Power BI analytics.' },
    gcc: { keys: ['gcc', 'global capability', 'bot', 'build operate', 'centre', 'center'], a: 'GCC operations and BOT models are part of my core expertise, including GCC operations setup. I’m happy to walk through the details in a conversation.' },
    erp: { keys: ['erp', 'zoho', 'sap', 'system', 'power bi'], a: 'I drove the end-to-end Zoho ERP implementation at Miles Education across procurement, sales, payroll and banking for real-time visibility. I have also delivered SAP-integrated Power BI analytics.' },
    ipo: { keys: ['ipo', 'spac', 'sec', 'nasdaq', 'listing', 'public', '456', 'merger', 'transaction', 'deal'], a: 'At Grant Thornton Bharat I steered NASDAQ listing readiness for an e-commerce client via SPAC merger, part of a US$456M transaction, owning accounting, SEC readiness and compliance. At Aris Global I partnered with the board on IPO readiness and fundraising.' },
    frameworks: { keys: ['framework', 'standard', 'gaap', 'ifrs', 'ind as', 'asc', 'sfrs', 'uk gaap', 'accounting'], a: 'US GAAP, IFRS, Ind AS and ASC 606, plus SFRS and UK GAAP from client engagements. I’ve also handled technical accounting for ESOPs, leases, SaaS revenue and asset capitalization.' },
    teams: { keys: ['team', 'manage', 'led', 'lead', 'people', 'mentor'], a: 'At Grant Thornton Bharat I led and mentored teams of 25+ finance professionals. At Miles Education I rebuilt the finance team with KPIs and accountability systems, and I mentor junior team members on technical accounting, modelling and audit.' },
    role: { keys: ['current', 'role', 'now', 'today', 'miles', 'job', 'position'], a: 'I’m Group Vice President – Finance at Miles Education. I own group finance across 17 entities in India, the US and the Middle East and work with the CEO and board on growth strategy, capital allocation and investor reporting.' },
    contact: { keys: ['contact', 'email', 'phone', 'reach', 'call', 'linkedin', 'connect'], a: 'Email ravikumarjhankal@gmail.com, call +91 9901851754, or connect on LinkedIn. I’m based in Bengaluru, India.' },
  } as Record<string, { keys: string[]; a: string }>,
  fallback: 'I can answer questions about my background, FP&A, finance transformation, GCC work, ERP, IPO and SPAC experience, accounting frameworks, teams, my current role and how to reach me.',
};

// What the avatar says aloud when a visitor points at an item. First person, resume facts only.
// Order matches the arrays above. Every line is pre-recorded (public/voice/), see scripts/voice-lines.ts.
export const say = {
  experience: [
    'Since October 2024 I’ve been Group Vice President of Finance at Miles Education. I own the complete group finance function and work as a CFO-equivalent partner to the CEO and board.',
    'From May 2023 to October 2024 I was Associate Director at Grant Thornton Bharat. I led 25+ finance professionals and steered NASDAQ listing readiness through a SPAC merger.',
    'From October 2021 to May 2023 I was Head of Department for Finance at Aris Global. I partnered with the CEO, CFO and board on M&A, IPO readiness and fundraising, and owned FP&A.',
    'From March 2011 to November 2021 I was at Grant Thornton, managing statutory audit engagements for clients with budgets above INR 500 Cr.',
  ],
  expertise: [
    'Financial planning and analysis: budgeting, forecasting, variance analysis and scenario models.',
    'Controllership: multi-entity close, reporting and compliance.',
    'US GAAP, which I worked with at Aris Global and Grant Thornton Bharat.',
    'IFRS, across my global reporting engagements.',
    'Ind AS, the Indian reporting framework.',
    'ASC 606 revenue recognition, including SaaS revenue.',
    'Multi-entity consolidation across 17 entities in three geographies.',
    'IPO readiness, including NASDAQ, SPAC and SEC readiness.',
    'M&A advisory, working with the CEO, CFO and board at Aris Global.',
    'ERP implementation: an end-to-end finance system rollout.',
    'Zoho ERP across procurement, sales, payroll and banking.',
    'Transfer pricing documentation and cross-border structuring.',
    'Audit management, including statutory audits for clients with budgets above INR 500 Cr.',
    'Internal controls over revenue, leases and ESOPs.',
    'Board reporting: board-level MIS and investor reporting.',
  ],
  achievements: [
    'At Grant Thornton Bharat I managed listing readiness on a US$456M NASDAQ SPAC transaction for an e-commerce client, owning accounting, SEC readiness and compliance.',
    'At Miles Education I drove the end-to-end Zoho ERP implementation across procurement, sales, payroll and banking for real-time visibility.',
    'At Aris Global I automated finance workflows, reducing manual effort by 40% and accelerating close cycles.',
    'At Miles Education I own planning, budgeting and reporting across 17 entities spanning three geographies.',
    'I’ve delivered reporting under IFRS, Ind AS, US GAAP, SFRS and UK GAAP.',
    'I led treasury and working capital strategy at Miles Education to strengthen liquidity and support expansion.',
    'I handled SEC and listing readiness for a SPAC merger, and IPO readiness with the board at Aris Global.',
    'I designed and deployed MIS dashboards for real-time financial visibility, improving the monthly close cycle.',
    'I’ve led and mentored 25+ finance professionals, and rebuilt a finance team with KPIs and accountability.',
  ],
  command: [
    'Strategic finance: FP&A, forecasting, scenario planning and capital allocation.',
    'Global finance across India, the United States and the Middle East.',
    'Reporting: MIS, board reporting and consolidation.',
    'Transformation: Zoho ERP, automation and process improvement.',
    'Governance: internal controls, compliance and transfer pricing.',
  ],
  leadership: [
    'As a strategic thinker, I work with the CEO and board on growth strategy, capital allocation and investor reporting.',
    'As a people leader, I’ve led and mentored 25+ finance professionals, and I mentor junior team members on technical accounting, modelling and audit.',
    'As a transformation driver, I championed finance automation and an end-to-end Zoho ERP implementation.',
    'As a problem solver, I automated finance workflows at Aris Global, cutting manual effort by 40% and speeding up close.',
    'On governance, I built internal controls and kept statutory compliance and vendor governance tight across geographies.',
    'As a growth enabler, I led treasury and working capital strategy to support expansion plans.',
  ],
  education: [
    'I qualified as a Chartered Accountant with the Institute of Chartered Accountants of India in 2017.',
    'I earned my Bachelor of Commerce from Vijaya College, Bangalore, in 2009.',
  ],
  kpis: [
    '15+ years in finance, since March 2011.',
    '17 entities managed across the Miles Education group.',
    'Three geographies: India, the United States and the Middle East.',
    'I led 25+ finance professionals at Grant Thornton Bharat.',
    'Listing readiness on a US$456M NASDAQ SPAC transaction.',
  ],
  stage: (i: number) => `Stage ${i + 1}, ${transformation.stages[i].name}. ${transformation.stages[i].text}`,
  resume: 'Download my resume as a PDF.',
  idcard: 'This is my ID card. Tap it to flip and see my credentials and contact details.',
  linkedin: 'Connect with me on LinkedIn.',
  contactMe: 'Let’s connect. You can email me, call me, or send a message right here.',
  command_head: 'These are the five areas I run as group finance. The charts are illustrative, not company data.',
  global_head: 'Finance leadership across India, the United States and the Middle East. Drag the globe to explore.',
  leadership_head: 'For me, leadership goes beyond the numbers: people, governance and growth.',
};
