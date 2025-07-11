
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Video, FileText, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const courses = [
    {
      id: "pw-courses",
      name: "PW Courses",
      description: "Complete course materials and lectures",
      icon: BookOpen,
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "pw-khazana",
      name: "PW Khazana",
      description: "Treasure of knowledge and resources",
      icon: Award,
      color: "from-green-500 to-teal-600"
    },
    {
      id: "pw-tests",
      name: "PW Tests",
      description: "Practice tests and assessments",
      icon: FileText,
      color: "from-orange-500 to-red-600"
    }
  ];

  const features = [
    {
      icon: Video,
      title: "HD Video Lectures",
      description: "High-quality recorded lectures from expert teachers"
    },
    {
      icon: FileText,
      title: "Study Notes",
      description: "Comprehensive notes for all subjects"
    },
    {
      icon: BookOpen,
      title: "DPP Solutions",
      description: "Daily Practice Problems with detailed solutions"
    },
    {
      icon: Calendar,
      title: "Live Classes",
      description: "Interactive live sessions with teachers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-foreground">StudyX</span>
            </div>
            <Link to="/admin">
              <Button variant="outline">Admin Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Welcome to <span className="text-primary">StudyX</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your comprehensive learning platform with lectures, notes, practice problems, and live classes
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" className="text-lg px-8">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Why Choose StudyX?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Explore Our Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${course.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <course.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {course.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {course.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 StudyX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
