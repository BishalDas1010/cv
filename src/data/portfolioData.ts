export type ProjectCategory = 'All' | 'AI & RAG' | 'IoT & TinyML' | 'Analytics';

export interface SkillItem {
  name: string;
  featured: boolean;
  note: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  subtitle: string;
  items: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  category: Exclude<ProjectCategory, 'All'>;
  organization: string;
  year: string;
  image: string;
  summary: string;
  challenge: string;
  architecture: string;
  impact: { label: string; value: string }[];
  skills: string[];
  repoUrl: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  badge?: string;
  role: string;
  organization: string;
  location?: string;
  description: string;
  highlight?: string;
  type: 'work' | 'education';
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
}

export const PROFILE = {
  brand: 'Bishal',
  fullName: 'Bishal Das',
  headline: 'SOFTWARE ENGINEER',
  greeting: 'Hi, I’m Bishal.',
  role: 'AI, ML & Full-Stack Engineer.',
  currentLabel: 'Education & Research',
  currentOrg: 'ICFAI University, Tripura',
  currentRole: 'B.S. Computer Science & Engineering · CGPA 9.3/10.0',
  location: 'Tripura, India',
  leadCopy:
    'I build end-to-end Machine Learning and RAG pipelines with Python, LangChain, and FastAPI—and deploy TinyML & IoT systems on ESP32.',
  portraitImage: '/src/assets/images/bishal_bright_art_portrait_1795604699868.jpg',
  meFigureImage: '/people/me.png',
  cvUrl: '/assets/aistudio/Bishal_Das_CV_9ec2bbcc.pdf',
  email: 'bishalbishal6659@gmail.com',
  phone: '+91-9366970934',
  githubUrl: 'https://github.com/BishalDas1010',
  linkedinUrl: 'https://linkedin.com/in/biahaldas',
  copyrightYear: '2026',
  disciplineTag: 'ML, RAG & Embedded IoT Systems',
};

export interface CrowdWalker {
  id: string;
  src: string;
  alt: string;
  heightScale: number;
  direction: 1 | -1;
  baseSpeed: number;
  initialProgress: number;
  startDelayMs: number;
  bounceFreq: number;
  bouncePhase: number;
  layer: 'back' | 'front';
  hideOnMobile: boolean;
}

export const CROWD_WALKERS: CrowdWalker[] = [
  { id: 'p1', src: '/people/p1.png', alt: 'Woman wearing glasses and headphones', heightScale: 0.94, direction: 1, baseSpeed: 36, initialProgress: 0.02, startDelayMs: 0, bounceFreq: 6.8, bouncePhase: 0.2, layer: 'back', hideOnMobile: false },
  { id: 'p2', src: '/people/p2.png', alt: 'Bearded man in open overshirt', heightScale: 1.04, direction: -1, baseSpeed: 42, initialProgress: 0.12, startDelayMs: 90, bounceFreq: 7.2, bouncePhase: 1.4, layer: 'front', hideOnMobile: false },
  { id: 'p3', src: '/people/p3.png', alt: 'Smiling elder woman in cardigan', heightScale: 0.92, direction: 1, baseSpeed: 29, initialProgress: 0.22, startDelayMs: 220, bounceFreq: 5.9, bouncePhase: 2.3, layer: 'back', hideOnMobile: false },
  { id: 'p4', src: '/people/p4.png', alt: 'Student with backpack and notebook', heightScale: 0.98, direction: -1, baseSpeed: 46, initialProgress: 0.32, startDelayMs: 60, bounceFreq: 7.5, bouncePhase: 0.9, layer: 'front', hideOnMobile: false },
  { id: 'p5', src: '/people/p5.png', alt: 'Young photographer in beanie with camera', heightScale: 1.02, direction: 1, baseSpeed: 40, initialProgress: 0.42, startDelayMs: 180, bounceFreq: 7.0, bouncePhase: 3.1, layer: 'back', hideOnMobile: true },
  { id: 'p6', src: '/people/p6.png', alt: 'Older gentleman in sweater vest', heightScale: 1.05, direction: -1, baseSpeed: 31, initialProgress: 0.56, startDelayMs: 140, bounceFreq: 6.1, bouncePhase: 1.8, layer: 'front', hideOnMobile: false },
  { id: 'p7', src: '/people/p7.png', alt: 'Woman with bob haircut', heightScale: 0.93, direction: 1, baseSpeed: 44, initialProgress: 0.65, startDelayMs: 280, bounceFreq: 7.4, bouncePhase: 4.0, layer: 'back', hideOnMobile: false },
  { id: 'p8', src: '/people/p8.png', alt: 'Smiling young runner in tank top', heightScale: 0.96, direction: -1, baseSpeed: 50, initialProgress: 0.74, startDelayMs: 110, bounceFreq: 8.0, bouncePhase: 2.7, layer: 'front', hideOnMobile: true },
  { id: 'p9', src: '/people/p9.png', alt: 'Woman with braided hair in kurta', heightScale: 0.95, direction: 1, baseSpeed: 35, initialProgress: 0.82, startDelayMs: 320, bounceFreq: 6.5, bouncePhase: 0.5, layer: 'back', hideOnMobile: false },
  { id: 'p10', src: '/people/p10.png', alt: 'Developer in hoodie checking phone', heightScale: 1.01, direction: -1, baseSpeed: 33, initialProgress: 0.90, startDelayMs: 200, bounceFreq: 6.3, bouncePhase: 3.6, layer: 'front', hideOnMobile: true },
  { id: 'p11', src: '/people/p11.png', alt: 'Reader with glasses holding open book', heightScale: 0.91, direction: 1, baseSpeed: 28, initialProgress: 0.97, startDelayMs: 250, bounceFreq: 5.8, bouncePhase: 2.0, layer: 'back', hideOnMobile: true },
];

export const HERO_METRICS = [
  { value: '9.3 / 10', label: 'B.S. CSE Major CGPA' },
  { value: '2', label: 'Research Internships (BIT & NIT)' },
  { value: '30%', label: 'Water Saved via Smart Irrigation' },
  { value: '88%', label: 'ML Prediction Accuracy' },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'ml-ai',
    title: 'Machine Learning & AI',
    subtitle: 'Deep Learning, Computer Vision, LLMs & RAG Pipelines',
    items: [
      { name: 'Python', featured: true, note: 'Primary language across ML training, RAG pipelines, FastAPI backends, and ETL.' },
      { name: 'TensorFlow', featured: false, note: 'Deep neural networks and TinyML model export for embedded edge inference.' },
      { name: 'PyTorch', featured: false, note: 'Custom CNN architectures, model experimentation, and fine-tuning workflows.' },
      { name: 'Scikit-learn', featured: false, note: 'Activity recognition, anomaly detection, and predictive irrigation modeling.' },
      { name: 'Keras', featured: false, note: 'Rapid sequential and multi-input sensor fusion model prototyping.' },
      { name: 'OpenCV', featured: false, note: 'Image preprocessing, OCR document routing, and visual frame pipelines.' },
      { name: 'MediaPipe', featured: false, note: 'Lightweight real-time pose and landmark detection pipelines.' },
      { name: 'CNN', featured: false, note: 'Convolutional feature extractors for visual and time-series signals.' },
      { name: 'LLMs', featured: true, note: 'Grounded generation with Mistral AI and structured prompt orchestration.' },
      { name: 'LangChain', featured: true, note: 'Document loaders, contextual compression retrieval, and RAG chains.' },
      { name: 'LangGraph', featured: false, note: 'Stateful multi-step agentic workflows and conditional routing.' },
      { name: 'RAG', featured: false, note: 'End-to-end semantic retrieval with ChromaDB vector search.' },
      { name: 'Prompt Engineering', featured: false, note: 'Targeted system prompts for ATS scoring and PDF Q&A accuracy.' },
    ],
  },
  {
    id: 'data-backend',
    title: 'Data Engineering & Backend',
    subtitle: 'Apache Spark, Kafka, ETL, FastAPI & RESTful APIs',
    items: [
      { name: 'Apache Spark', featured: true, note: 'Distributed batch data processing and scalable analytical transformations.' },
      { name: 'PySpark', featured: false, note: 'Python-driven Spark pipelines for structured dataset workflows.' },
      { name: 'Apache Kafka', featured: false, note: 'Event-driven streaming ingestion concepts for real-time pipelines.' },
      { name: 'ETL', featured: false, note: 'End-to-end extract, transform, and load workflows for ML datasets.' },
      { name: 'Stream Processing', featured: false, note: 'Real-time wearable MQTT and Firebase IoT sensor telemetry handling.' },
      { name: 'Pandas', featured: true, note: 'Feature engineering, cleaning, and tabular analytics.' },
      { name: 'NumPy', featured: false, note: 'Vectorized numerical computation for multi-sensor fusion streams.' },
      { name: 'FastAPI', featured: true, note: 'High-speed async REST APIs powering Career-Sync-AI and StudyRAG-AI.' },
      { name: 'Streamlit', featured: false, note: 'Interactive ML dashboards, ATS gap analyzers, and PDF chat interfaces.' },
      { name: 'REST APIs', featured: false, note: 'Clean JSON endpoints connecting models, vector stores, and UIs.' },
      { name: 'JWT Authentication', featured: false, note: 'Stateless token-based user authentication for backend services.' },
    ],
  },
  {
    id: 'languages-cloud',
    title: 'Languages, Cloud & Tools',
    subtitle: 'Systems Languages, AWS, Vector DBs, Docker & Embedded',
    items: [
      { name: 'SQL', featured: true, note: 'Relational querying, schema design, and analytical joins.' },
      { name: 'C++', featured: false, note: 'Embedded firmware and TinyML inference on ESP32 microcontrollers.' },
      { name: 'Java', featured: false, note: 'Object-oriented programming and core software engineering foundations.' },
      { name: 'Kotlin', featured: false, note: 'Modern JVM and mobile-ready application development.' },
      { name: 'Bash', featured: false, note: 'Linux automation scripts, environment setup, and pipeline tooling.' },
      { name: 'AWS (EC2, S3, IAM)', featured: true, note: 'Cloud compute instances, object storage, and role-based access control.' },
      { name: 'PostgreSQL', featured: false, note: 'Production-grade relational data persistence.' },
      { name: 'MySQL', featured: false, note: 'Structured relational storage for web and analytical applications.' },
      { name: 'ChromaDB', featured: true, note: 'Embedded vector database for semantic search across resumes and PDFs.' },
      { name: 'Docker', featured: false, note: 'Containerized reproducible builds for FastAPI and ML services.' },
      { name: 'Git & GitHub', featured: false, note: 'Version control, collaborative branching, and project delivery.' },
      { name: 'Linux', featured: false, note: 'Daily development environment, shell tooling, and server administration.' },
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'career-sync-ai',
    title: 'Career-Sync-AI',
    subtitle: 'AI-Powered ATS Resume Analyzer',
    ctaLabel: 'View project',
    category: 'AI & RAG',
    organization: 'Independent Build',
    year: '2026',
    image: '/src/assets/images/project_resumelens_recruitment_1795603359668.jpg',
    summary:
      'Built a Retrieval-Augmented Generation (RAG) pipeline for resume-job matching using LangChain, ChromaDB, and Mistral AI.',
    challenge:
      'Applicants struggle to gauge true semantic alignment between their resumes and job descriptions, often missing critical skill gaps flagged by automated ATS screening.',
    architecture:
      'Built a RAG matching pipeline in Python using LangChain, ChromaDB embeddings, and Mistral AI, exposed via a FastAPI backend to an interactive Streamlit dashboard for ATS compatibility scores and skill-gap analysis.',
    impact: [
      { label: 'Core LLM', value: 'Mistral AI' },
      { label: 'Vector Store', value: 'ChromaDB' },
      { label: 'Stack', value: 'FastAPI · Streamlit' },
    ],
    skills: ['Python', 'RAG', 'LangChain', 'ChromaDB', 'LLMs', 'FastAPI', 'Streamlit', 'Prompt Engineering'],
    repoUrl: 'https://github.com/BishalDas1010',
  },
  {
    id: 'studyrag-ai',
    title: 'StudyRAG-AI',
    subtitle: 'RAG-Based PDF Q&A Chat App',
    ctaLabel: 'View project',
    category: 'AI & RAG',
    organization: 'Independent Build',
    year: '2026',
    image: '/src/assets/images/project_smartops_workspace_1795603359114.jpg',
    summary:
      'Built a full-stack Retrieval-Augmented Generation (RAG) application for PDF question answering with OCR-based document routing and contextual compression retrieval.',
    challenge:
      'Academic and scanned PDFs mix dense text with embedded images, causing standard chunking pipelines to lose context or hallucinate answers.',
    architecture:
      'Implemented OCR-based document routing paired with LangChain contextual compression retrieval, ChromaDB semantic indexing, a FastAPI backend, and a Streamlit Q&A interface.',
    impact: [
      { label: 'Ingestion', value: 'OCR Routing' },
      { label: 'Retrieval', value: 'Contextual Compression' },
      { label: 'Stack', value: 'LangChain · FastAPI' },
    ],
    skills: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Streamlit', 'RAG', 'OpenCV', 'LLMs'],
    repoUrl: 'https://github.com/BishalDas1010',
  },
  {
    id: 'healthguard',
    title: 'HealthGuard',
    subtitle: 'IoT Health & Activity Monitoring',
    ctaLabel: 'Read case study',
    category: 'IoT & TinyML',
    organization: 'BIT Mesra · Embedded ML',
    year: '2026',
    image: '/src/assets/images/project_workflow_automation_1795603357687.jpg',
    summary:
      'Developed an ESP32-based wearable system to stream real-time sensor data via MQTT for remote health monitoring and ML-driven anomaly detection.',
    challenge:
      'Continuous physiological monitoring requires low-latency telemetry from constrained wearable hardware alongside accurate activity classification and anomaly alerts.',
    architecture:
      'Engineered an ESP32 wearable node streaming multi-sensor readings over MQTT, feeding machine learning models for human activity recognition and physiological anomaly detection.',
    impact: [
      { label: 'Hardware', value: 'ESP32 Wearable' },
      { label: 'Protocol', value: 'Real-Time MQTT' },
      { label: 'Inference', value: 'TinyML Fusion' },
    ],
    skills: ['Python', 'C++', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Stream Processing'],
    repoUrl: 'https://github.com/BishalDas1010',
  },
  {
    id: 'smart-irrigation',
    title: 'Smart Irrigation ML',
    subtitle: 'NIT Silchar · Firebase IoT',
    ctaLabel: 'Read case study',
    category: 'Analytics',
    organization: 'NIT Silchar Research',
    year: '2025',
    image: '/src/assets/images/project_cris_analytics_1795603360005.jpg',
    summary:
      'Developed an ML-based smart irrigation system cutting water usage by 30% at 88% prediction accuracy, backed by sub-second Firebase IoT telemetry.',
    challenge:
      'Conventional timer-based irrigation over-waters crops and wastes resources without reacting to live field moisture and environmental patterns.',
    architecture:
      'Trained Scikit-learn predictive models on environmental sensor streams and integrated a Firebase IoT backend enabling real-time sensor sync with sub-second latency.',
    impact: [
      { label: 'Water usage cut', value: '30%' },
      { label: 'Prediction accuracy', value: '88%' },
      { label: 'Sensor sync latency', value: '< 1s' },
    ],
    skills: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'REST APIs', 'Stream Processing', 'Git & GitHub'],
    repoUrl: 'https://github.com/BishalDas1010',
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'bit-mesra',
    period: 'May 2026 – July 2026',
    badge: 'Research Intern',
    role: 'External Summer Intern – TinyML & Wearable Health Monitoring',
    organization: 'Birla Institute of Technology (BIT), Mesra',
    location: 'Ranchi, Jharkhand',
    description:
      'Built a fusion-based Human Health Monitoring System using TinyML and wearable sensors with ESP-32 for real-time on-device inference.',
    type: 'work',
  },
  {
    id: 'icfai-bsc',
    period: 'August 2024 – May 2027',
    role: 'B.S., Computer Science & Engineering',
    organization: 'ICFAI University, Tripura',
    location: 'Tripura, India',
    description: 'Undergraduate degree in Computer Science & Engineering.',
    highlight: 'Major CGPA 9.3/10.0',
    type: 'education',
  },
  {
    id: 'nit-silchar',
    period: 'June 2025 – July 2025',
    role: 'AI Research Intern',
    organization: 'National Institute of Technology (NIT) Silchar',
    location: 'Silchar, Assam',
    description:
      'Developed an ML smart irrigation system cutting water usage by 30% at 88% accuracy with a sub-second Firebase IoT backend.',
    type: 'work',
  },
  {
    id: 'tit-diploma',
    period: '2021 – 2024',
    role: 'Diploma, Mechanical Engineering',
    organization: 'Tripura Institute of Technology',
    location: 'Tripura, India',
    description: 'Engineering foundation in mechanics, systems, and hardware.',
    highlight: 'CGPA 7.5/10.0',
    type: 'education',
  },
  {
    id: 'konaban-school',
    period: 'Higher Secondary',
    role: 'Higher Secondary (Class XII / X)',
    organization: 'Konaban (West) Class XII School',
    location: 'Konaban, Tripura',
    description: 'Foundational schooling in Sepahijala, Tripura.',
    highlight: '62%',
    type: 'education',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'nit-cert',
    title: 'AI/ML Internship Certificate',
    issuer: 'National Institute of Technology (NIT) Silchar',
  },
  {
    id: 'bit-cert',
    title: 'Project Completion Certificate',
    issuer: 'Birla Institute of Technology, Mesra',
  },
];
