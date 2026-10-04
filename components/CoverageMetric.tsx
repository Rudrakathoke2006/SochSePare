import React from 'react';
import { ReasoningVisibility } from '@/types/blindspot';
import { Target, Layers, HelpCircle, AlertTriangle } from 'lucide-react';

interface CoverageMetricProps {
  visibility: ReasoningVisibility;
  currentLeaning: string;
}

export const CoverageMetric: React.FC<CoverageMetricProps> = ({ visibility, currentLeaning }) => {
  return (
    <div className="glass-panel-elevated rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
            Audit Metric
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Reasoning Visibility Ratio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Measures how much of the decision space was addressed in your stated rationale.
          </p>
        </div>

        {currentLeaning && (
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Current Leaning: </span>
            <span className="text-cyan-300 font-semibold">{currentLeaning}</span>
          </div>
        )}
      </div>

      {/* Progress Bar Split */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-cyan-400 flex items-center space-x-1">
            <span>● Visible Reasoning: {visibility.visible_percentage}%</span>
          </span>
          <span className="text-rose-400 flex items-center space-x-1">
            <span>● Unexamined Space: {visibility.overlooked_percentage}%</span>
          </span>
        </div>

        <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-full transition-all duration-1000"
            style={{ width: `${visibility.visible_percentage}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 rounded-r-full transition-all duration-1000"
            style={{ width: `${visibility.overlooked_percentage}%` }}
          />
        </div>
      </div>

      {/* Primary Focal Point Highlight */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start space-x-3 text-xs">
        <Target className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold text-slate-200">Dominant Focal Anchor: </span>
          <span className="text-slate-400">{visibility.primary_focal_point}</span>
        </div>
      </div>
    </div>
  );
};
