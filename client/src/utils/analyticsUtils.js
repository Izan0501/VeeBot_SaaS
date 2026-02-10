export const normalizeRole = (role) => {
    if (!role) return "Otros";
    const r = role.toLowerCase().trim();

    if (r.includes('full') && r.includes('stack')) return 'Full Stack Dev';
    if (r.includes('front') && r.includes('end')) return 'Frontend Dev';
    if (r.includes('back') && r.includes('end')) return 'Backend Dev';
    if (r.includes('data') && (r.includes('scien') || r.includes('anal'))) return 'Data Scientist';
    if (r.includes('mobile') || r.includes('android') || r.includes('ios')) return 'Mobile Dev';
    if (r.includes('devops') || r.includes('cloud')) return 'DevOps';
    if (r.includes('manager') || r.includes('lead') || r.includes('lider')) return 'Tech Lead / Manager';
    if (r.includes('qa') || r.includes('test')) return 'QA Engineer';

    return role.charAt(0).toUpperCase() + role.slice(1);
};

export const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    try {
        const [datePart] = dateStr.split(' ');
        const [day, month] = datePart.split('/');
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, parseInt(month) - 1, parseInt(day));
    } catch (e) {
        return new Date();
    }
};