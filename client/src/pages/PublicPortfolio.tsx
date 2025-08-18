import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
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
import { useParams } from "react-router-dom";

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
  username: string;
  about: About;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  contactLinks: ContactLink[];
  theme: string;
}

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || '';

// Theme configurations
const themes = {
  default: {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-blue-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-blue-600',
    hoverPrimary: 'hover:bg-blue-700',
    gradient: 'from-blue-600 to-blue-800',
    heroGradient: 'from-blue-50 via-indigo-50 to-blue-100',
    heroAccent: 'text-blue-600',
    heroBorder: 'border-blue-200',
    heroHover: 'hover:border-blue-400'
  },
  green: {
    primary: 'bg-green-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-green-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-green-600',
    hoverPrimary: 'hover:bg-green-700',
    gradient: 'from-green-600 to-green-800',
    heroGradient: 'from-green-50 via-emerald-50 to-green-100',
    heroAccent: 'text-green-600',
    heroBorder: 'border-green-200',
    heroHover: 'hover:border-green-400'
  },
  purple: {
    primary: 'bg-purple-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-purple-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-purple-600',
    hoverPrimary: 'hover:bg-purple-700',
    gradient: 'from-purple-600 to-purple-800',
    heroGradient: 'from-purple-50 via-indigo-50 to-purple-100',
    heroAccent: 'text-purple-600',
    heroBorder: 'border-purple-200',
    heroHover: 'hover:border-purple-400'
  },
  orange: {
    primary: 'bg-orange-600',
    secondary: 'bg-gray-800',
    textPrimary: 'text-orange-600',
    textSecondary: 'text-gray-800',
    borderPrimary: 'border-orange-600',
    hoverPrimary: 'hover:bg-orange-700',
    gradient: 'from-orange-600 to-orange-800',
    heroGradient: 'from-orange-50 via-amber-50 to-orange-100',
    heroAccent: 'text-orange-600',
    heroBorder: 'border-orange-200',
    heroHover: 'hover:border-orange-400'
  }
};

const PublicPortfolio = () => {
  const { username } = useParams<{ username: string }>();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    setFirstName("");
    setLastName("");
    setContactEmail("");
    setContactMessage("");
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
       
        const response = await fetch(`${API_BASE_URL}/portfolio/public/${username}`, {
          method: 'GET',
          headers: {
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

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

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
          <p className="text-gray-600 mb-4">This portfolio doesn't exist or is not public.</p>
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
        {/* Hero Section */}
        <section id="about" className={`min-h-screen flex items-center bg-gradient-to-br ${currentTheme.heroGradient}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Profile Picture */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block">
                  <div className={`w-80 h-80 rounded-full overflow-hidden border-4 ${currentTheme.heroBorder} shadow-2xl mx-auto lg:mx-0`}>
                    {portfolioData.about.profilePicture ? (
                      <img
                        src={portfolioData.about.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${currentTheme.heroGradient} flex items-center justify-center`}>
                        <span className={`${currentTheme.heroAccent} text-6xl font-bold`}>
                          {portfolioData.about.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Name, Title, Bio, and Actions */}
              <div className="space-y-8 text-center lg:text-left">
                <div>
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">
                    Hi, I'm{' '}
                    <span className={currentTheme.heroAccent}>
                      {portfolioData.about.name?.split(' ')[0] || 'Your'}
                    </span>
                  </h1>
                  <h2 className="text-2xl text-gray-700 mb-6">
                    {portfolioData.about.title || 'Professional Title'}
                  </h2>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  {portfolioData.about.bio || 'Passionate about creating innovative solutions through code. Currently pursuing my career with hands-on experience and a strong foundation in technology.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className={`${currentTheme.borderPrimary} ${currentTheme.textPrimary} ${currentTheme.hoverPrimary} hover:text-white`}
                    onClick={() => scrollToSection('contact')}
                  >
                    Get In Touch
                  </Button>
                  {portfolioData.about.resume && (
                    <Button 
                      size="lg" 
                      variant="outline"
                      className={`${currentTheme.borderPrimary} ${currentTheme.textPrimary} ${currentTheme.hoverPrimary} hover:text-white`}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      View Resume
                    </Button>
                  )}
                </div>

                {/* Social Media Links */}
                {portfolioData.contactLinks.length > 0 && (
                  <div className="flex justify-center lg:justify-start gap-4 pt-4">
                    {portfolioData.contactLinks.slice(0, 3).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full bg-white border-2 ${currentTheme.heroBorder} flex items-center justify-center ${currentTheme.heroHover} transition-colors`}
                      >
                        {getSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                )}

                {/* Scroll Indicator */}
                <div className="flex justify-center lg:justify-start pt-8">
                  <button
                    onClick={() => scrollToSection('skills')}
                    className={`w-12 h-12 rounded-full bg-white border-2 ${currentTheme.heroBorder} flex items-center justify-center ${currentTheme.heroHover} transition-colors`}
                  >
                    <ChevronDown className={`h-6 w-6 ${currentTheme.heroAccent}`} />
                  </button>
                </div>
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
              <p className="text-lg text-gray-600">I'm always open to discussing new opportunities and collaborations.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {/* Left: Contact details */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Let's Connect</h3>
                <p className="text-gray-600 mb-8">Feel free to reach out through any of the channels below, or send me a message directly.</p>

                <div className="space-y-6">
                  {portfolioData.about.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Mail className={`h-5 w-5 ${currentTheme.textPrimary}`} />
                      </div>
                      <a href={`mailto:${portfolioData.about.email}`} className="text-gray-700 hover:text-gray-900">{portfolioData.about.email}</a>
                    </div>
                  )}

                  {portfolioData.about.phone && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Phone className={`h-5 w-5 ${currentTheme.textPrimary}`} />
                      </div>
                      <span className="text-gray-700">{portfolioData.about.phone}</span>
                    </div>
                  )}

                  {portfolioData.about.location && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <MapPin className={`h-5 w-5 ${currentTheme.textPrimary}`} />
                      </div>
                      <span className="text-gray-700">{portfolioData.about.location}</span>
                    </div>
                  )}
                </div>

                {/* Social buttons */}
                {portfolioData.contactLinks.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-4">
                    {(() => {
                      const linkFor = (name: string) =>
                        portfolioData.contactLinks.find((l) => l.platform.toLowerCase() === name)?.url;
                      const linkedinUrl = linkFor("linkedin");
                      const githubUrl = linkFor("github");
                      return (
                        <>
                          {linkedinUrl && (
                            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="gap-2">
                                <Linkedin className="h-4 w-4" /> LinkedIn
                              </Button>
                            </a>
                          )}
                          {githubUrl && (
                            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="gap-2">
                                <Github className="h-4 w-4" /> GitHub
                              </Button>
                            </a>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Right: Contact form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" className="min-h-[140px]" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Your message here..." />
                    </div>
                    <Button type="submit" className={`${currentTheme.primary} ${currentTheme.hoverPrimary} text-white w-full`}>Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Made with CraftFolio Credit */}
        <footer className="py-8 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">
              Made with ❤️ using{' '}
              <a 
                href="https://craftfolio.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                CraftFolio
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PublicPortfolio;
