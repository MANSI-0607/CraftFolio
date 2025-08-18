import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Sparkles, 
  Plus, 
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Mail,
  Wrench,
  Palette
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePortfolio } from "@/hooks/use-portfolio";
import { generateProfessionalBio, enhanceBioWithAI } from "@/services/aiService";

const PortfolioBuilder = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("about");
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const {
    portfolioData,
    isLoading,
    isSaving,
    savePortfolio,
    updateSection,
    addContactLink,
    removeContactLink,
    updateContactLink
  } = usePortfolio();

  const handleSave = async () => {
    await savePortfolio();
  };

  const generateAIBio = async () => {
    try {
      setIsGeneratingBio(true);
      
      // Check if we have basic information
      if (!portfolioData.about.name || !portfolioData.about.title) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name and professional title first.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for AI generation
      const experienceTexts = portfolioData.experience.map(exp => 
        `${exp.position} at ${exp.company}`
      );
      const educationTexts = portfolioData.education.map(edu => 
        `${edu.degree} from ${edu.school}`
      );

      // Generate bio using Gemini API
      const aiBio = await generateProfessionalBio(
        portfolioData.about.name,
        portfolioData.about.title,
        portfolioData.skills,
        experienceTexts,
        educationTexts
      );
      
      updateSection('about', {
        ...portfolioData.about,
        bio: aiBio
      });
      
      toast({
        title: "AI bio generated!",
        description: "Your professional bio has been enhanced with Gemini AI.",
      });
    } catch (error) {
      console.error('Error generating bio:', error);
      toast({
        title: "Error generating bio",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const sections = [
    { id: "about", title: "About", icon: User },
    { id: "skills", title: "Skills", icon: Wrench },
    { id: "experience", title: "Experience", icon: Briefcase },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "projects", title: "Projects", icon: FolderOpen },
    { id: "contact", title: "Contact", icon: Mail },
    { id: "theme", title: "Theme", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <span className="text-lg font-heading font-semibold">Portfolio Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/portfolio-viewer">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              </Link>
              <Button 
                variant="hero" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Sections</CardTitle>
                <CardDescription>Edit each section of your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {section.title}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs 
              value={activeSection} 
              onValueChange={setActiveSection}
            >
              {/* About Section */}
              <TabsContent value="about">
                <Card className="shadow-soft">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">About Me</CardTitle>
                        <CardDescription>Personal information and professional bio</CardDescription>
                      </div>
                                             <div className="flex gap-2">
                      <Button 
                        variant="premium" 
                        size="sm"
                        onClick={generateAIBio}
                           disabled={isSaving || isGeneratingBio}
                         >
                           <Sparkles className="mr-2 h-4 w-4" />
                           {isGeneratingBio ? "Generating..." : "Generate Bio"}
                         </Button>
                         {portfolioData.about.bio && (
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={async () => {
                               try {
                                 const enhancedBio = await enhanceBioWithAI(portfolioData.about.bio);
                                 updateSection('about', {
                                   ...portfolioData.about,
                                   bio: enhancedBio
                                 });
                                 toast({
                                   title: "Bio enhanced!",
                                   description: "Your bio has been improved with AI.",
                                 });
                               } catch (error) {
                                 console.error('Error enhancing bio:', error);
                                 toast({
                                   title: "Error enhancing bio",
                                   description: error instanceof Error ? error.message : "Please try again later.",
                                   variant: "destructive",
                                 });
                               }
                             }}
                             disabled={isSaving}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                             Enhance
                      </Button>
                         )}
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={portfolioData.about.name}
                          onChange={(e) => updateSection('about', {
                            ...portfolioData.about,
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          value={portfolioData.about.title}
                          onChange={(e) => updateSection('about', {
                            ...portfolioData.about,
                            title: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="space-y-4">
                      <Label>Profile Picture</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                          {portfolioData.about.profilePicture ? (
                            <img
                              src={portfolioData.about.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <User className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">No image</p>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                                                         onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 // Check file size (max 5MB)
                                 const maxSize = 5 * 1024 * 1024; // 5MB
                                 if (file.size > maxSize) {
                                   toast({
                                     title: "File too large",
                                     description: "Please select an image smaller than 5MB.",
                                     variant: "destructive",
                                   });
                                   return;
                                 }
                                 // Compress image before uploading
                                 const compressImage = (file: File): Promise<string> => {
                                   return new Promise((resolve) => {
                                     const canvas = document.createElement('canvas');
                                     const ctx = canvas.getContext('2d');
                                     const img = new Image();
                                     
                                     img.onload = () => {
                                       // Calculate new dimensions (max 800x800)
                                       const maxSize = 800;
                                       let { width, height } = img;
                                       
                                       if (width > height) {
                                         if (width > maxSize) {
                                           height = (height * maxSize) / width;
                                           width = maxSize;
                                         }
                                       } else {
                                         if (height > maxSize) {
                                           width = (width * maxSize) / height;
                                           height = maxSize;
                                         }
                                       }
                                       
                                       canvas.width = width;
                                       canvas.height = height;
                                       
                                       // Draw and compress
                                       ctx?.drawImage(img, 0, 0, width, height);
                                       const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                                       resolve(compressedDataUrl);
                                     };
                                     
                                     img.src = URL.createObjectURL(file);
                                   });
                                 };
                                 
                                 compressImage(file).then((compressedImageUrl) => {
                                   updateSection('about', {
                                     ...portfolioData.about,
                                     profilePicture: compressedImageUrl
                                   });
                                 });
                               }
                             }}
                          />
                              <p className="text-sm text-muted-foreground mt-1">
                             Upload a professional headshot (JPG, PNG, GIF) - Max 5MB. Images will be automatically compressed.
                           </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={portfolioData.about.bio}
                        onChange={(e) => updateSection('about', {
                          ...portfolioData.about,
                          bio: e.target.value
                        })}
                        placeholder="Tell us about yourself, your experience, and what makes you unique..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Upload Resume (PDF)</Label>
                      <Input
                        id="resume"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateSection('about', {
                              ...portfolioData.about,
                              resume: file.name
                            });
                          }
                        }}
                      />
                      {portfolioData.about.resume && (
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {portfolioData.about.resume}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Section */}
              <TabsContent value="skills">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-xl">Skills</CardTitle>
                    <CardDescription>Add your technical and soft skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {portfolioData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => {
                              const newSkills = portfolioData.skills.filter((_, i) => i !== index);
                              updateSection('skills', newSkills);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a new skill..."
                        onKeyDown={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (e.key === "Enter" && target.value.trim()) {
                            updateSection('skills', [...portfolioData.skills, target.value.trim()]);
                            target.value = "";
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousSibling as HTMLInputElement;
                          if (input && input.value.trim()) {
                            updateSection('skills', [...portfolioData.skills, input.value.trim()]);
                            input.value = "";
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Experience Section */}
              <TabsContent value="experience">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-xl">Experience</CardTitle>
                    <CardDescription>Add your work experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {portfolioData.experience.map((exp, index) => (
                      <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Experience {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newExperience = portfolioData.experience.filter((_, i) => i !== index);
                              updateSection('experience', newExperience);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={e => {
                                const updated = [...portfolioData.experience];
                                updated[index].company = e.target.value;
                                updateSection('experience', updated);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={e => {
                                const updated = [...portfolioData.experience];
                                updated[index].position = e.target.value;
                                updateSection('experience', updated);
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              value={exp.duration}
                              onChange={e => {
                                const updated = [...portfolioData.experience];
                                updated[index].duration = e.target.value;
                                updateSection('experience', updated);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              rows={3}
                              value={exp.description}
                              onChange={e => {
                                const updated = [...portfolioData.experience];
                                updated[index].description = e.target.value;
                                updateSection('experience', updated);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newExperience = [
                          ...portfolioData.experience,
                          {
                            id: Date.now().toString(),
                            company: "",
                            position: "",
                            duration: "",
                            description: ""
                          }
                        ];
                        updateSection('experience', newExperience);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Experience
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Section */}
              <TabsContent value="education">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-xl">Education</CardTitle>
                    <CardDescription>Add your academic background</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {portfolioData.education.map((edu, index) => (
                      <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Education {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newEducation = portfolioData.education.filter((_, i) => i !== index);
                              updateSection('education', newEducation);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>School</Label>
                            <Input
                              value={edu.school}
                              onChange={e => {
                                const updated = [...portfolioData.education];
                                updated[index].school = e.target.value;
                                updateSection('education', updated);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={e => {
                                const updated = [...portfolioData.education];
                                updated[index].degree = e.target.value;
                                updateSection('education', updated);
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              value={edu.duration}
                              onChange={e => {
                                const updated = [...portfolioData.education];
                                updated[index].duration = e.target.value;
                                updateSection('education', updated);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              rows={3}
                              value={edu.description}
                              onChange={e => {
                                const updated = [...portfolioData.education];
                                updated[index].description = e.target.value;
                                updateSection('education', updated);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newEducation = [
                          ...portfolioData.education,
                          {
                            id: Date.now().toString(),
                            school: "",
                            degree: "",
                            duration: "",
                            description: ""
                          }
                        ];
                        updateSection('education', newEducation);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>


              {/* Contact Section */}
              <TabsContent value="contact">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-xl">Contact</CardTitle>
                    <CardDescription>Update your contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={portfolioData.about.email}
                          onChange={e => updateSection('about', {
                            ...portfolioData.about,
                            email: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Phone</Label>
                        <Input
                          id="contact-phone"
                          value={portfolioData.about.phone}
                          onChange={e => updateSection('about', {
                            ...portfolioData.about,
                            phone: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-location">Location</Label>
                        <Input
                          id="contact-location"
                          value={portfolioData.about.location}
                          onChange={e => updateSection('about', {
                            ...portfolioData.about,
                            location: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    {/* Dynamic Contact Links */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Social Media & Links</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addContactLink}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Link
                        </Button>
                      </div>
                      
                      {portfolioData.contactLinks.map((link, index) => (
                        <div key={index} className="flex gap-4 items-end">
                          <div className="flex-1">
                            <Label>Platform</Label>
                            <Input
                              placeholder="e.g., LinkedIn, GitHub, Twitter"
                              value={link.platform}
                              onChange={e => updateContactLink(index, 'platform', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Label>URL</Label>
                            <Input
                              placeholder="https://..."
                              value={link.url}
                              onChange={e => updateContactLink(index, 'url', e.target.value)}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContactLink(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Section */}
              <TabsContent value="projects">
                <Card className="shadow-soft">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Projects</CardTitle>
                        <CardDescription>Showcase your best work and achievements</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newProjects = [
                            ...portfolioData.projects,
                            {
                              id: Date.now().toString(),
                              title: "",
                              description: "",
                              technologies: [],
                              link: ""
                            }
                          ];
                          updateSection('projects', newProjects);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {portfolioData.projects.map((project, index) => (
                      <div key={project.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Project {index + 1}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newProjects = portfolioData.projects.filter((_, i) => i !== index);
                              updateSection('projects', newProjects);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input 
                              value={project.title}
                              onChange={e => {
                                const updated = [...portfolioData.projects];
                                updated[index].title = e.target.value;
                                updateSection('projects', updated);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Project Link</Label>
                            <Input 
                              value={project.link}
                              onChange={e => {
                                const updated = [...portfolioData.projects];
                                updated[index].link = e.target.value;
                                updateSection('projects', updated);
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea 
                            rows={3} 
                            value={project.description}
                            onChange={e => {
                              const updated = [...portfolioData.projects];
                              updated[index].description = e.target.value;
                              updateSection('projects', updated);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Technologies</Label>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline">
                                {tech}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-4 w-4 p-0"
                                  onClick={() => {
                                    const updated = [...portfolioData.projects];
                                    updated[index].technologies = updated[index].technologies.filter((_, i) => i !== techIndex);
                                    updateSection('projects', updated);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add technology..."
                              onKeyDown={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (e.key === "Enter" && target.value.trim()) {
                                  const updated = [...portfolioData.projects];
                                  updated[index].technologies = [...updated[index].technologies, target.value.trim()];
                                  updateSection('projects', updated);
                                  target.value = "";
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const input = e.currentTarget.previousSibling as HTMLInputElement;
                                if (input && input.value.trim()) {
                                  const updated = [...portfolioData.projects];
                                  updated[index].technologies = [...updated[index].technologies, input.value.trim()];
                                  updateSection('projects', updated);
                                  input.value = "";
                                }
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

                             {/* Theme Section */}
               <TabsContent value="theme">
                 <Card className="shadow-soft">
                   <CardHeader>
                     <CardTitle className="text-xl">Portfolio Theme</CardTitle>
                     <CardDescription>Choose a color theme for your portfolio</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                         { id: 'default', name: 'Blue', color: 'bg-blue-600', preview: 'bg-gradient-to-r from-blue-600 to-blue-800' },
                         { id: 'green', name: 'Green', color: 'bg-green-600', preview: 'bg-gradient-to-r from-green-600 to-green-800' },
                         { id: 'purple', name: 'Purple', color: 'bg-purple-600', preview: 'bg-gradient-to-r from-purple-600 to-purple-800' },
                         { id: 'orange', name: 'Orange', color: 'bg-orange-600', preview: 'bg-gradient-to-r from-orange-600 to-orange-800' }
                       ].map((theme) => (
                         <div
                           key={theme.id}
                           className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                             portfolioData.theme === theme.id 
                               ? 'border-blue-500 shadow-lg' 
                               : 'border-gray-200 hover:border-gray-300'
                           }`}
                           onClick={() => updateSection('theme', theme.id)}
                         >
                           <div className={`h-20 rounded-t-lg ${theme.preview}`}></div>
                           <div className="p-3 text-center">
                             <p className="font-medium text-sm">{theme.name}</p>
                             {portfolioData.theme === theme.id && (
                               <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                 <div className="w-2 h-2 bg-white rounded-full"></div>
                               </div>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                     
                     <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                       <h4 className="font-medium mb-2">Preview</h4>
                       <p className="text-sm text-gray-600">
                         Your selected theme will be applied to the navigation bar, buttons, and accent colors throughout your portfolio.
                       </p>
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
