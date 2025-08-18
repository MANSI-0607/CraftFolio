import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Download,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";

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

// Theme configurations
const themes = {
  default: {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-blue-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-blue-600',
    hoverPrimary: 'hover:bg-blue-700',
    gradient: 'from-blue-600 to-blue-800'
  },
  green: {
    primary: 'bg-green-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-green-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-green-600',
    hoverPrimary: 'hover:bg-green-700',
    gradient: 'from-green-600 to-green-800'
  },
  purple: {
    primary: 'bg-purple-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-purple-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-purple-600',
    hoverPrimary: 'hover:bg-purple-700',
    gradient: 'from-purple-600 to-purple-800'
  },
  orange: {
    primary: 'bg-orange-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-orange-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-orange-600',
    hoverPrimary: 'hover:bg-orange-700',
    gradient: 'from-orange-600 to-orange-800'
  }
};

const PortfolioViewer = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const fetchPortfolio = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'education', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-4">No portfolio data available.</p>
          <Link to="/portfolio-builder">
            <Button>Create Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentTheme = themes[portfolioData.theme as keyof typeof themes] || themes.default;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 ${currentTheme.primary} shadow-lg`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-white font-bold text-xl">
                {portfolioData.about.name || 'Portfolio'}
              </span>
              <div className="hidden md:flex space-x-6">
                {['about', 'skills', 'education', 'experience', 'projects', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-white hover:text-gray-200 transition-colors capitalize ${
                      activeSection === section ? 'font-semibold' : ''
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="text-black border-white hover:bg-white hover:text-gray-500">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-16 w-full z-40 bg-white shadow-md">
        <div className="flex overflow-x-auto space-x-4 px-4 py-2">
          {['about', 'skills', 'education', 'experience', 'projects', 'contact'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                activeSection === section 
                  ? `${currentTheme.primary} text-white` 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Profile Picture & Social Links */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block">
                  <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200 shadow-xl mx-auto lg:mx-0">
                    {portfolioData.about.profilePicture ? (
                      <img
                        src={portfolioData.about.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-4xl font-bold">
                          {portfolioData.about.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  
             
                </div>
              </div>

              {/* Right Column - Name, Title, Bio */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Hello, I'm{' '}
                    <span className={currentTheme.textPrimary}>
                      {portfolioData.about.name || 'Your Name'}!
                    </span>
                  </h1>
                  <h2 className="text-2xl text-gray-600 mb-6">
                    {portfolioData.about.title || 'Professional Title'}
                  </h2>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {portfolioData.about.bio || 'Your professional bio will appear here. Tell visitors about your expertise, experience, and what makes you unique.'}
                </p>

                {portfolioData.about.resume && (
                  <Button 
                    size="lg" 
                    className={`${currentTheme.primary} ${currentTheme.hoverPrimary} text-white`}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    View Resume
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        {portfolioData.skills.length > 0 && (
          <section id="skills" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills</h2>
                <p className="text-lg text-gray-600">Technologies and tools I work with</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {portfolioData.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    className={`px-4 py-2 text-sm font-medium ${currentTheme.primary} text-white`}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education Section */}
        {portfolioData.education.length > 0 && (
          <section id="education" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Education</h2>
                <p className="text-lg text-gray-600">My academic background</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {portfolioData.education.map((edu, index) => (
                  <Card key={edu.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{edu.degree}</CardTitle>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.duration}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{edu.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {portfolioData.experience.length > 0 && (
          <section id="experience" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Experience</h2>
                <p className="text-lg text-gray-600">My professional journey</p>
              </div>
              <div className="space-y-8">
                {portfolioData.experience.map((exp, index) => (
                  <Card key={exp.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{exp.position}</CardTitle>
                          <p className={`text-lg ${currentTheme.textPrimary} font-semibold`}>{exp.company}</p>
                          <p className="text-gray-500">{exp.duration}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {portfolioData.projects.length > 0 && (
          <section id="projects" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Projects</h2>
                <p className="text-lg text-gray-600">Some of my recent work</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {portfolioData.projects.map((project, index) => (
                  <Card key={project.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center ${currentTheme.textPrimary} hover:underline`}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Project
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-lg text-gray-600">Let's work together</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  {portfolioData.about.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className={`h-5 w-5 ${currentTheme.textPrimary}`} />
                      <a 
                        href={`mailto:${portfolioData.about.email}`}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        {portfolioData.about.email}
                      </a>
                    </div>
                  )}
                  
                  {portfolioData.about.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className={`h-5 w-5 ${currentTheme.textPrimary}`} />
                      <span className="text-gray-700">{portfolioData.about.phone}</span>
                    </div>
                  )}
                  
                  {portfolioData.about.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className={`h-5 w-5 ${currentTheme.textPrimary}`} />
                      <span className="text-gray-700">{portfolioData.about.location}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {portfolioData.contactLinks.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Me</h3>
                    <div className="space-y-3">
                      {portfolioData.contactLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-3 ${currentTheme.textPrimary} hover:underline`}
                        >
                          {getSocialIcon(link.platform)}
                          <span>{link.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PortfolioViewer;
