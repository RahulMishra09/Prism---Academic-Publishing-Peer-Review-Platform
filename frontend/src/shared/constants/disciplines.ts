// Disciplines matching https://link.springer.com/ "Browse by subject" section exactly
export const DISCIPLINES = [
    { slug: 'biological-sciences', label: 'Biological Sciences', icon: '🔬' },
    { slug: 'business-management', label: 'Business and Management', icon: '📊' },
    { slug: 'chemistry', label: 'Chemistry', icon: '⚗️' },
    { slug: 'computer-science', label: 'Computer Science', icon: '💻' },
    { slug: 'earth-environmental-sciences', label: 'Earth and Environmental Sciences', icon: '🌍' },
    { slug: 'health-sciences', label: 'Health Sciences', icon: '🏥' },
    { slug: 'humanities-social-sciences', label: 'Humanities and Social Sciences', icon: '📜' },
    { slug: 'materials-science', label: 'Materials Science', icon: '⚙️' },
    { slug: 'mathematics', label: 'Mathematics', icon: '∑' },
    { slug: 'physics-astronomy', label: 'Physics and Astronomy', icon: '⚛️' },
    { slug: 'statistics', label: 'Statistics', icon: '📈' },
    { slug: 'technology-engineering', label: 'Technology and Engineering', icon: '🔧' },
    
    // Subcategories / Mega Menu Items
    { slug: 'data', label: 'Data Structures', icon: '🗄️' },
    { slug: 'cancer', label: 'Cancer Research', icon: '🔬' },
    { slug: 'genetics', label: 'Genetics', icon: '🧬' },
    { slug: 'neuroscience', label: 'Neuroscience', icon: '🧠' },
    { slug: 'pharmacology', label: 'Pharmacology', icon: '💊' },
    { slug: 'ai', label: 'Artificial Intelligence', icon: '🤖' },
    { slug: 'software', label: 'Software Engineering', icon: '💻' },
    { slug: 'cybersecurity', label: 'Cybersecurity', icon: '🔒' },
    { slug: 'climate', label: 'Climate Studies', icon: '🌡️' },
    { slug: 'geology', label: 'Geology', icon: '🌋' },
    { slug: 'oceanography', label: 'Oceanography', icon: '🌊' }
] as const;

export type DisciplineSlug = (typeof DISCIPLINES)[number]['slug'];
