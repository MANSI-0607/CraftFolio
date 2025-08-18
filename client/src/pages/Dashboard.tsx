import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderOpen, 
  Mail, 
  Wrench, 
  Eye, 
  Share2, 
  Sparkles,
  Plus,
  Edit3,
  Globe,
  ArrowRight,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { usePortfolioProgress } from "@/hooks/use-portfolio-progress";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { percentage, completedCount, totalCount, sections } = usePortfolioProgress();
  
  const sectionConfig = [
    {
      id: "about",
      title: "About Me",
      description: "Personal information and bio",
      icon: User,
    },
    {
      id: "skills",
      title: "Skills",
      description: "Technical and soft skills",
      icon: Wrench,
    },
    {
      id: "experience",
      title: "Experience",
      description: "Work history and achievements",
      icon: Briefcase,
    },
    {
      id: "education",
      title: "Education",
      description: "Academic background",
      icon: GraduationCap,
    },
    {
      id: "projects",
      title: "Projects",
      description: "Showcase your best work",
      icon: FolderOpen,
    },
    {
      id: "contact",
      title: "Contact",
      description: "Contact information and social links",
      icon: Mail,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-gradient">
                CraftFolio
              </span>
            </div>
                         <div className="flex items-center space-x-4">
               <Button variant="outline" size="sm" onClick={() => navigate('/portfolio-viewer')}>
                 <Eye className="mr-2 h-4 w-4" />
                 Preview
               </Button>
               <Button variant="ghost" size="sm">
                 <Share2 className="mr-2 h-4 w-4" />
                 Share
               </Button>
               <Button variant="ghost" size="sm" onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 Logout
               </Button>
               <div className="w-8 h-8 bg-gradient-secondary rounded-full"></div>
             </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Header */}
         <div className="mb-8">
           <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
             Welcome back, <span className="text-gradient">{user?.username || 'User'}</span>! 👋
           </h1>
           <p className="text-muted-foreground text-lg">
             Continue building your amazing portfolio
           </p>
         </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Portfolio Progress</CardTitle>
                    <CardDescription>Complete all sections to publish your portfolio</CardDescription>
                  </div>
                                     <Badge variant="secondary" className="text-sm">
                     {percentage}% Complete
                   </Badge>
                 </div>
               </CardHeader>
               <CardContent>
                 <Progress value={percentage} className="mb-4" />
                 <div className="flex items-center justify-between text-sm text-muted-foreground">
                   <span>{completedCount} of {totalCount} sections completed</span>
                   <span>{percentage === 100 ? 'Complete!' : 'Keep going!'}</span>
                 </div>
              </CardContent>
            </Card>

            {/* Portfolio Sections */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Portfolio Sections</CardTitle>
                <CardDescription>
                  Complete each section to build your professional portfolio
                </CardDescription>
              </CardHeader>
                             <CardContent className="space-y-4">
                 {sectionConfig.map((sectionConfig) => {
                   const Icon = sectionConfig.icon;
                   const section = sections.find(s => s.id === sectionConfig.id);
                   return (
                     <div
                       key={sectionConfig.id}
                       className="flex items-center justify-between p-4 rounded-lg border hover:shadow-medium transition-all duration-medium group cursor-pointer"
                     >
                       <div className="flex items-center space-x-4">
                         <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                           section?.completed 
                             ? 'bg-gradient-primary text-white' 
                             : 'bg-muted text-muted-foreground'
                         }`}>
                           <Icon className="h-6 w-6" />
                         </div>
                         <div>
                           <div className="flex items-center space-x-2">
                             <h3 className="font-semibold">{sectionConfig.title}</h3>
                             {section?.required && (
                               <Badge variant="outline" className="text-xs">Required</Badge>
                             )}
                             {section?.completed && (
                               <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                 Complete
                               </Badge>
                             )}
                           </div>
                           <p className="text-sm text-muted-foreground">{sectionConfig.description}</p>
                         </div>
                       </div>
                       <Link to="/portfolio-builder">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           {section?.completed ? (
                             <>
                               <Edit3 className="mr-2 h-4 w-4" />
                               Edit
                             </>
                           ) : (
                             <>
                               <Plus className="mr-2 h-4 w-4" />
                               Add
                             </>
                           )}
                         </Button>
                       </Link>
                     </div>
                   );
                 })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="hero" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/portfolio-viewer')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Portfolio
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Suggestions
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/portfolio-builder')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Edit Portfolio
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio URL */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Your Portfolio URL</CardTitle>
                <CardDescription>Share your portfolio with others</CardDescription>
              </CardHeader>
                             <CardContent>
                 <div className="p-3 bg-muted rounded-md mb-3">
                   <p className="text-sm font-mono text-muted-foreground">
                     craftfolio.com/{user?.username || 'your-username'}
                   </p>
                 </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="shadow-soft border-primary/20 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  AI-Powered Features
                </CardTitle>
                <CardDescription>Let AI help you create amazing content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-white/50 border border-primary/10">
                  <h4 className="font-medium text-sm mb-1">Smart Bio Writer</h4>
                  <p className="text-xs text-muted-foreground">Generate compelling personal bios</p>
                </div>
                <div className="p-3 rounded-lg bg-white/50 border border-primary/10">
                  <h4 className="font-medium text-sm mb-1">Image Generation</h4>
                  <p className="text-xs text-muted-foreground">Create professional profile images</p>
                </div>
                <Button variant="premium" size="sm" className="w-full">
                  Try AI Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;