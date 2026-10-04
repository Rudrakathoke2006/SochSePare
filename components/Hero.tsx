import React from 'react';
import { Compass, Sparkles, ShieldAlert, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm }) => {
  return (
    <div className="relative pt-10 pb-8 text-center max-w-4xl mx-auto px-4">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Philosophy Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-medium text-slate-200">The Socratic AI Reasoning Auditor</span>
        <span className="text-slate-500">•</span>
        <span className="text-cyan-400 font-semibold">Not a decision-maker</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
        Don’t outsource your decision. <br />
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
          Audit your thinking.
        </span>
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Most tools try to tell you what to choose. <strong className="text-white">BlindSpot AI</strong> does the opposite: it inspects your logic, surfaces unstated assumptions, reveals overlooked factors, and asks the questions you haven’t asked yourself.
      </p>

      {/* Call to action & Presets hint */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onScrollToForm}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          <span>Audit My Decision</span>
          <ArrowDown className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400 px-3 py-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Strictly guaranteed: <strong>No recommendations</strong></span>
        </div>
      </div>
    </div>
  );
};
