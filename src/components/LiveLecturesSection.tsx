
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Video, Users, Clock, Play, Calendar } from 'lucide-react';

const LiveLecturesSection = () => {
  const handleOpenLivePlayer = () => {
    window.open('https://studyverse-network.netlify.app/studyverse-pw', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white flex items-center justify-center">
            <Video className="w-8 h-8 mr-3 text-red-500" />
            🎥 Live Lectures
          </h2>
          <p className="text-gray-400 text-lg">
            Join live interactive sessions with our expert instructors
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Live Player Card */}
          <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Live Now</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-400">Interactive Live Session</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Live Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Real-time</span>
                </div>
              </div>

              <Button 
                onClick={handleOpenLivePlayer}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Video className="w-4 h-4 mr-2" />
                Join Live Session
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Live Learning Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Interactive Sessions</h4>
                    <p className="text-gray-400 text-sm">Engage with instructors and peers in real-time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Instant Doubt Solving</h4>
                    <p className="text-gray-400 text-sm">Get your questions answered immediately</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">HD Quality</h4>
                    <p className="text-gray-400 text-sm">Crystal clear video and audio streaming</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Scheduled Classes</h4>
                    <p className="text-gray-400 text-sm">Regular timetable for consistent learning</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  View Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embedded Player Card */}
        <Card className="mt-8 bg-gray-800 border-gray-700 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Video className="w-5 h-5 text-red-500" />
              <span>Live Player</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-2">
              <iframe
                src="https://studyverse-network.netlify.app/studyverse-pw"
                title="Live Lectures Player"
                className="w-full h-96 rounded-lg border-0"
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LiveLecturesSection;
