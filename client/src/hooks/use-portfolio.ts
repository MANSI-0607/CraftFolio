import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface ContactLink {
  platform: string;
  url: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  duration: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

interface About {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  resume: string;
  profilePicture: string;
}

interface PortfolioData {
  about: About;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  contactLinks: ContactLink[];
  theme: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const usePortfolio = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    about: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
      resume: '',
      profilePicture: ''
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    contactLinks: [],
    theme: 'default'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio');
      }

      const data = await response.json();
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: "Error loading portfolio",
        description: "Failed to load your portfolio data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save portfolio data
  const savePortfolio = async (data?: PortfolioData) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const portfolioToSave = data || portfolioData;

      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(portfolioToSave)
      });

      if (!response.ok) {
        throw new Error('Failed to save portfolio');
      }

      const savedData = await response.json();
      setPortfolioData(savedData);
      
      toast({
        title: "Portfolio saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: "Error saving portfolio",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update specific section
  const updateSection = (section: keyof PortfolioData, data: any) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Add contact link
  const addContactLink = () => {
    setPortfolioData(prev => ({
      ...prev,
      contactLinks: [
        ...prev.contactLinks,
        { platform: '', url: '' }
      ]
    }));
  };

  // Remove contact link
  const removeContactLink = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      contactLinks: prev.contactLinks.filter((_, i) => i !== index)
    }));
  };

  // Update contact link
  const updateContactLink = (index: number, field: 'platform' | 'url', value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      contactLinks: prev.contactLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  // Load portfolio on mount
  useEffect(() => {
    fetchPortfolio();
  }, []);

  return {
    portfolioData,
    isLoading,
    isSaving,
    fetchPortfolio,
    savePortfolio,
    updateSection,
    addContactLink,
    removeContactLink,
    updateContactLink
  };
};
