
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, Users, Star, Play, BookOpen, FileText, Download } from "lucide-react";

const BatchPage = () => {
  const { batchId } = useParams();
  
  // Mock data - in real app, this would come from Supabase
  const batchData = {
    "jee-2024-batch-1": {
      name: "JEE 2024 - Accelerated Batch",
      description: "Intensive preparation for JEE 2024 with daily live classes and comprehensive study material",
      course: "JEE Main + Advanced",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      fee: 15000,
      subjects: ["Physics", "Chemistry", "Mathematics"],
      students: "2.5K+",
      rating: 4.8,
      lectures: [
        {
          id: "1",
          title: "Introduction to Mechanics",
          subject: "Physics",
          duration: "1h 30m",
          date: "2024-01-15",
          videoUrl: "https://example.com/video1"
        },
        {
          id: "2", 
          title: "Atomic Structure Basics",
          subject: "Chemistry",
          duration: "1h 45m",
          date: "2024-01-16",
          videoUrl: "https://example.com/video2"
        },
        {
          id: "3",
          title: "Limits and Continuity",
          subject: "Mathematics",
          duration: "2h",
          date: "2024-01-17",
          videoUrl: "https://example.com/video3"
        }
      ],
      notes: [
        {
          id: "1",
          title: "Physics Formula Sheet",
          subject: "Physics",
          pdfUrl: "https://example.com/notes1.pdf"
        },
        {
          id: "2",
          title: "Organic Chemistry Notes",
          subject: "Chemistry", 
          pdfUrl: "https://example.com/notes2.pdf"
        }
      ],
      dpps: [
        {
          id: "1",
          title: "Mechanics Practice Problems",
          subject: "Physics",
          pdfUrl: "https://example.com/dpp1.pdf"
        },
        {
          id: "2",
          title: "Calculus Problem Set",
          subject: "Mathematics",
          pdfUrl: "https://example.com/dpp2.pdf"
        }
      ]
    }
  };

  const batch = batchData[batchId as keyof typeof batchData];

  if (!batch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Batch Not Found</h2>
            <p className="text-muted-foreground mb-4">The batch you're looking for doesn't exist.</p>
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
              <span>Back to Courses</span>
            </Link>
            <h1 className="text-xl font-bold text-foreground">StudyX</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Batch Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{batch.course}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{batch.rating}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{batch.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{batch.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{batch.students} students enrolled</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Starts: {new Date(batch.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Ends: {new Date(batch.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {batch.subjects.map((subject) => (
                  <Badge key={subject} variant="outline">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-foreground mb-2">₹{batch.fee.toLocaleString()}</div>
                    <p className="text-muted-foreground">Complete Course</p>
                  </div>
                  <Button className="w-full mb-3">Enroll Now</Button>
                  <Button variant="outline" className="w-full mb-3">Try Free Demo</Button>
                  <div className="text-center text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="lectures" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lectures">Lectures ({batch.lectures.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes ({batch.notes.length})</TabsTrigger>
            <TabsTrigger value="dpps">DPPs ({batch.dpps.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lectures" className="mt-6">
            <div className="grid gap-4">
              {batch.lectures.map((lecture) => (
                <Card key={lecture.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Play className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">{lecture.title}</h3>
                          <Badge variant="outline" className="text-xs">{lecture.subject}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{lecture.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(lecture.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Watch</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-6">
            <div className="grid gap-4">
              {batch.notes.map((note) => (
                <Card key={note.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{note.title}</h3>
                          <Badge variant="outline" className="text-xs mt-1">{note.subject}</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="dpps" className="mt-6">
            <div className="grid gap-4">
              {batch.dpps.map((dpp) => (
                <Card key={dpp.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{dpp.title}</h3>
                          <Badge variant="outline" className="text-xs mt-1">{dpp.subject}</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BatchPage;
