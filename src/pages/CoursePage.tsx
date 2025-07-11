
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Users, Star, Play, BookOpen, FileText } from "lucide-react";

const CoursePage = () => {
  const { courseId } = useParams();
  
  // Mock data - in real app, this would come from Supabase
  const courseData = {
    "jee-main-advanced": {
      title: "JEE Main + Advanced",
      description: "Complete preparation for JEE Main and Advanced with expert faculty and comprehensive study material",
      image: "/placeholder.svg",
      rating: 4.8,
      students: "2.5L+",
      duration: "2 Years",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      batches: [
        {
          id: "jee-2024-batch-1",
          name: "JEE 2024 - Accelerated Batch",
          description: "Intensive preparation for JEE 2024 with daily live classes",
          startDate: "2024-01-15",
          endDate: "2024-12-31",
          fee: 15000,
          subjects: ["Physics", "Chemistry", "Mathematics"],
          image: "/placeholder.svg"
        },
        {
          id: "jee-2024-batch-2",
          name: "JEE 2024 - Foundation Batch",
          description: "Strong foundation building for JEE aspirants",
          startDate: "2024-02-01",
          endDate: "2024-12-31",
          fee: 12000,
          subjects: ["Physics", "Chemistry", "Mathematics"],
          image: "/placeholder.svg"
        }
      ]
    },
    "neet-ug": {
      title: "NEET UG",
      description: "Comprehensive NEET preparation with previous year analysis and expert guidance",
      image: "/placeholder.svg",
      rating: 4.9,
      students: "3L+",
      duration: "2 Years",
      subjects: ["Physics", "Chemistry", "Biology"],
      batches: [
        {
          id: "neet-2024-batch-1",
          name: "NEET 2024 - Target Batch",
          description: "Focused preparation for NEET 2024 with regular tests",
          startDate: "2024-01-20",
          endDate: "2024-12-31",
          fee: 14000,
          subjects: ["Physics", "Chemistry", "Biology"],
          image: "/placeholder.svg"
        }
      ]
    }
  };

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h2>
            <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Go Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-foreground">StudyX</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.duration}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{course.rating}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{course.students} students enrolled</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{course.duration} duration</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.subjects.map((subject) => (
                  <Badge key={subject} variant="outline">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="aspect-video bg-muted rounded-lg mb-4"></div>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Play className="h-5 w-5 text-primary mr-2" />
                      <span className="font-semibold text-foreground">Preview Course</span>
                    </div>
                  </div>
                  <Button className="w-full mb-3">Enroll Now</Button>
                  <Button variant="outline" className="w-full">Download Brochure</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Available Batches */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6">Available Batches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.batches.map((batch) => (
              <Link key={batch.id} to={`/batch/${batch.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border h-full">
                  <div className="aspect-video bg-muted rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-foreground">{batch.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {batch.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Starts: {new Date(batch.startDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">₹{batch.fee.toLocaleString()}</span>
                        <Badge variant="secondary">
                          {batch.subjects.length} Subjects
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {batch.subjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Course Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Play className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-foreground">Live Classes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Interactive live sessions with expert faculty and real-time doubt resolution
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <BookOpen className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-foreground">Study Material</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Comprehensive notes, practice questions, and previous year papers
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <FileText className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-foreground">Mock Tests</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Regular mock tests with detailed analysis and performance tracking
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
