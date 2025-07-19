import React from 'react';
import { FaBolt, FaBookOpen, FaClock, FaPlayCircle } from 'react-icons/fa';

const StudyXLive: React.FC = () => {
  const liveLectures = [
    {
      id: '68779351ac0f7a2563ec72b2',
      topic: 'Limit, Continuity and Differentiability 11 : Question Practice || NO DPP || Rescheduled @ 06:05 PM',
      startTime: '2025-07-18 12:27:04'
    },
    {
      id: '68492af1e8f7df3f31142782',
      topic: 'Chemical Kinetics 02 : Rate of Reaction || NO DPP',
      startTime: '2025-07-18 12:39:52'
    },
    {
      id: '6879332b51ba0dcd46949fd7',
      topic: 'Quadratic Equations 01 : Identities || Basic of Quadratic Equations || NO DPP',
      startTime: '2025-07-18 12:42:35'
    },
    {
      id: '68317eb12da436329a1dc631',
      topic: 'Trigonometric Functions 07 : Trigo Ratios for 18° & 36° || 2 Extra Formulas - Double Angles || NO DPP',
      startTime: '2025-07-18 12:45:32'
    },
    {
      id: '687933b4087d0116763c0b65',
      topic: 'Biological Classification 02 : Kingdom Monera',
      startTime: '2025-07-18 12:49:17'
    }
  ];

  const handleLectureClick = (batchId: string) => {
    window.location.href = `?batch=${batchId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] to-[#2c5364] text-white font-sans transition-colors duration-400">
      {/* Topbar */}
      <div className="w-full bg-slate-800/90 shadow-md py-3 sticky top-0 z-50 flex items-center justify-center gap-4">
        <span className="text-3xl text-blue-500 mr-2">
          <FaBolt />
        </span>
        <span className="text-xl font-bold tracking-wide">StudyX Live</span>
      </div>

      {/* Live Lectures List */}
      <div className="max-w-2xl mx-auto mt-10 px-4">
        {liveLectures.map((lecture) => (
          <div
            key={lecture.id}
            className="bg-zinc-900/95 rounded-xl mb-6 p-6 flex items-center justify-between cursor-pointer transition-all duration-200 border-2 border-zinc-800 shadow-md hover:bg-slate-800 hover:border-blue-500 hover:-translate-y-1 hover:scale-[1.012] hover:shadow-lg"
            onClick={() => handleLectureClick(lecture.id)}
          >
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold text-blue-500 flex items-center gap-2">
                <FaBookOpen />
                {lecture.topic}
              </span>
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <FaClock />
                Started: {lecture.startTime}
              </span>
            </div>
            <span className="text-2xl text-blue-500 transition-colors duration-200 group-hover:text-white">
              <FaPlayCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyXLive;
