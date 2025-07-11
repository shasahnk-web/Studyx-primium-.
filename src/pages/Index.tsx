
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Play, BookOpen, Users, Star, Clock, Calendar, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const courses = [
    {
      id: "jee-main-advanced",
      title: "JEE Main + Advanced",
      description: "Complete preparation for JEE Main and Advanced with expert faculty",
      image: "/placeholder.svg",
      rating: 4.8,
      students: "2.5L+",
      duration: "2 Years",
      subjects: ["Physics", "Chemistry", "Mathematics"]
    },
    {
      id: "neet-ug",
      title: "NEET UG",
      description: "Comprehensive NEET preparation with previous year analysis",
      image: "/placeholder.svg",
      rating: 4.9,
      students: "3L+",
      duration: "2 Years",
      subjects: ["Physics", "Chemistry", "Biology"]
    },
    {
      id: "class-12-cbse",
      title: "Class 12 CBSE",
      description: "Board exam preparation with conceptual clarity",
      image: "/placeholder.svg",
      rating: 4.7,
      students: "1.8L+",
      duration: "1 Year",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology"]
    },
    {
      id: "class-11-cbse",
      title: "Class 11 CBSE",
      description: "Foundation building for competitive exams and boards",
      image: "/placeholder.svg",
      rating: 4.6,
      students: "1.5L+",
      duration: "1 Year",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology"]
    }
  ];

  const features = [
    {
      icon: <Play className="h-8 w-8 text-primary" />,
      title: "Live Classes",
      description: "Interactive live sessions with top educators"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Study Material",
      description: "Comprehensive notes and practice questions"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Doubt Clearing",
      description: "24/7 doubt resolution by expert mentors"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">StudyX</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="#courses" className="text-foreground hover:text-primary transition-colors">Courses</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline">Login</Button>
              <Button>Sign Up</Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
                <a href="#courses" className="text-foreground hover:text-primary transition-colors">Courses</a>
                <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="outline">Login</Button>
                  <Button>Sign Up</Button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Master Your Studies with
            <span className="text-primary"> StudyX</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of students in their journey to academic excellence with our comprehensive learning platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search courses..." 
                className="pl-10"
              />
            </div>
            <Button size="lg">Get Started</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose StudyX?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the best in online education with our innovative features and expert guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-border">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Popular Courses</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of courses designed by expert educators
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border h-full">
                  <div className="aspect-video bg-muted rounded-t-lg"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.duration}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-foreground">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-muted-foreground mb-3">
                      {course.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.students} students</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.subjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-3xl font-bold text-foreground mb-2">10M+</h4>
              <p className="text-muted-foreground">Students Enrolled</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-foreground mb-2">500+</h4>
              <p className="text-muted-foreground">Expert Teachers</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-foreground mb-2">1000+</h4>
              <p className="text-muted-foreground">Courses Available</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-foreground mb-2">95%</h4>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help you succeed in your academic journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-border">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  +91 98765 43210
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-border">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  support@studyx.com
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-border">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  123 Education Street, Learning City
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">StudyX</h4>
              <p className="text-muted-foreground mb-4">
                Empowering students worldwide with quality education and innovative learning solutions.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Courses</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">JEE Preparation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">NEET Preparation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Board Exams</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Foundation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Support</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Company</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 StudyX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
