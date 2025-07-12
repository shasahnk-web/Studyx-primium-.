
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Video, Users, Clock } from 'lucide-react';

const LiveLecturesSection = () => {
  const handleOpenLivePlayer = () => {
    window.open('https://bhanuyadav.xyz/kgprojects/liveplayer/activelive.php', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white flex items-center justify-center">
            <Video className="w-8 h-8 mr-3 text-red-500" />
            🎥 Live Lectures
          </h2>
          <p className="text-gray-400 text-lg">
            Join live interactive sessions with our expert instructors
          </p>
        </div>

        <Card className="bg-gradient-to-br from-red-900/30 via-red-800/20 to-orange-900/30 border-red-700/50 hover:border-red-600/70 transition-all duration-300">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Live Interactive Classes
              </h3>
              
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Experience real-time learning with our expert faculty. Get instant doubt resolution, 
                participate in live discussions, and stay connected with your batch mates.
              </p>

              <div className="flex items-center justify-center space-x-8 mb-8 text-sm">
                <div className="flex items-center text-green-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Interactive Sessions</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Real-time Doubt Solving</span>
                </div>
                <div className="flex items-center text-purple-400">
                  <Video className="w-4 h-4 mr-2" />
                  <span>HD Quality Streaming</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleOpenLivePlayer}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Live Lecture
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                
                <p className="text-gray-400 text-sm">
                  Click to open the live player in a new window
                </p>
              </div>

              {/* Optional: Embed iframe as alternative */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="bg-gray-800 rounded-lg p-4">
                  <iframe
                    src="https://bhanuyadav.xyz/kgprojects/liveplayer/activelive.php"
                    title="Live Lectures Player"
                    className="w-full h-96 rounded-lg border-0"
                    allow="fullscreen"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LiveLecturesSection;
