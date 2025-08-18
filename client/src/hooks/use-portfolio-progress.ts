import { usePortfolio } from './use-portfolio';

export const usePortfolioProgress = () => {
  const { portfolioData } = usePortfolio();

  const calculateProgress = () => {
    const sections = [
      {
        id: 'about',
        completed: !!(portfolioData.about.name && portfolioData.about.title && portfolioData.about.bio),
        required: true
      },
      {
        id: 'skills',
        completed: portfolioData.skills.length > 0,
        required: true
      },
      {
        id: 'experience',
        completed: portfolioData.experience.length > 0 && 
          portfolioData.experience.some(exp => exp.company && exp.position),
        required: true
      },
      {
        id: 'education',
        completed: portfolioData.education.length > 0 && 
          portfolioData.education.some(edu => edu.school && edu.degree),
        required: false
      },
      {
        id: 'projects',
        completed: portfolioData.projects.length > 0 && 
          portfolioData.projects.some(proj => proj.title && proj.description),
        required: true
      },
      {
        id: 'contact',
        completed: !!(portfolioData.about.email || portfolioData.contactLinks.length > 0),
        required: true
      }
    ];

    const requiredSections = sections.filter(section => section.required);
    const completedRequired = requiredSections.filter(section => section.completed).length;
    const totalRequired = requiredSections.length;

    const percentage = Math.round((completedRequired / totalRequired) * 100);
    const completedCount = sections.filter(section => section.completed).length;
    const totalCount = sections.length;

    return {
      percentage,
      completedCount,
      totalCount,
      sections
    };
  };

  return calculateProgress();
};
