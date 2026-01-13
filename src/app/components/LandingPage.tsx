"use client";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-10 pt-24">
      <div className="w-full max-w-4xl text-center">
        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          AI HACKATHON
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto">
          Compete, Learn, and Innovate with AI Challenges
        </p>
        
        {/* Description */}
        <p className="text-base md:text-lg text-slate-400 mb-12 max-w-xl mx-auto">
          Join the ultimate AI hackathon experience. Test your skills, solve challenging problems, and climb the leaderboard.
        </p>
        
        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-white mb-2">Compete</h3>
            <p className="text-sm text-slate-400">
              Challenge yourself with real-world AI problems
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-sm text-slate-400">
              Monitor your performance on the leaderboard
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Innovate</h3>
            <p className="text-sm text-slate-400">
              Build solutions and showcase your skills
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

