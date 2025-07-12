
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Trophy, Star, Award } from 'lucide-react';

const NextTopperSection = () => {
  const handleClick = () => {
    window.open('https://studyverse-network.netlify.app/', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white flex items-center justify-center">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            🏆 Next Topper
          </h2>
          <p className="text-gray-400 text-lg">
            Join the community of achievers and be the next success story
          </p>
        </div>

        <Card 
          className="bg-gradient-to-br from-yellow-900/30 via-orange-800/20 to-red-900/30 border-yellow-500/50 hover:border-yellow-400/70 transition-all duration-300 cursor-pointer transform hover:scale-105"
          onClick={handleClick}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-orange-900 fill-current" />
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to be the Next Topper?
              </h3>
              
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg">
                Join thousands of successful students who achieved their dreams. 
                Access exclusive study materials, practice tests, and mentorship programs 
                designed to make you the next success story.
              </p>

              <div className="flex items-center justify-center space-x-8 mb-8 text-sm">
                <div className="flex items-center text-yellow-400">
                  <Award className="w-5 h-5 mr-2" />
                  <span>Top Performers</span>
                </div>
                <div className="flex items-center text-orange-400">
                  <Star className="w-5 h-5 mr-2" />
                  <span>Expert Guidance</span>
                </div>
                <div className="flex items-center text-red-400">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span>Success Stories</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full inline-flex items-center space-x-2 font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 shadow-lg">
                <span>Explore Success Network</span>
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NextTopperSection;
