// AI Stories Page - Real-time AI-generated space weather narratives
'use client';

import AIGeneratedStories from '@/components/AIGeneratedStories';

export default function AIStoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AIGeneratedStories autoRefresh={true} showControls={true} />
      </div>
    </main>
  );
}
