import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Globe, Palette, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import heroImage from "@/assets/hero-image.jpg";
import portfolioPreview from "@/assets/portfolio-preview.jpg";
import { useAuth } from "@/hooks/use-auth";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
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
              {!isLoading && !isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="hero" size="lg">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button variant="hero" size="lg">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 animate-fade-in">
              Build Your Perfect
              <span className="text-white block mt-2">
                Portfolio in Minutes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
              Create stunning, professional portfolios with AI-powered content generation, 
              beautiful themes, and instant publishing. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              {!isLoading && !isAuthenticated ? (
                <>
                  <Link to="/signup">
                    <Button variant="glass" size="xl" className="group">
                      Start Building Free
                      <Sparkles className="ml-2 h-5 w-5 group-hover:animate-pulse" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => navigate('/dashboard')}
                  >
                    View Examples
                  </Button>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button variant="glass" size="xl" className="group">
                    Go to Dashboard
                    <Sparkles className="ml-2 h-5 w-5 group-hover:animate-pulse" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              See What You Can Create
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Beautiful, professional portfolios that make lasting impressions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <img 
                src={portfolioPreview} 
                alt="Portfolio preview showing a professional website template"
                className="w-full rounded-2xl shadow-strong"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Everything You Need to
              <span className="text-gradient block">Shine Online</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional portfolio creation made simple with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-gradient p-8 rounded-2xl text-center hover:shadow-strong transition-all duration-medium group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-medium">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">AI-Powered Content</h3>
              <p className="text-muted-foreground">
                Let AI craft compelling bios, project descriptions, and content that showcases your expertise perfectly.
              </p>
            </div>

            <div className="card-gradient p-8 rounded-2xl text-center hover:shadow-strong transition-all duration-medium group">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-medium">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Beautiful Themes</h3>
              <p className="text-muted-foreground">
                Choose from professionally designed themes that make your work stand out and impress visitors.
              </p>
            </div>

            <div className="card-gradient p-8 rounded-2xl text-center hover:shadow-strong transition-all duration-medium group">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-medium">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Instant Publishing</h3>
              <p className="text-muted-foreground">
                Publish your portfolio instantly with a custom URL and share it with the world in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Join Thousands of Professionals
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Create your stunning portfolio today and start showcasing your work to the world.
            </p>
            <Link to="/signup">
              <Button variant="glass" size="xl" className="group">
                Start Your Portfolio Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold">CraftFolio</span>
            </div>
            <p className="text-white/60">
              Build beautiful portfolios with AI. © 2024 CraftFolio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;