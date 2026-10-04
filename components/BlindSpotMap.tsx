import React from 'react';
import { BlindSpotAnalysis } from '@/types/blindspot';
import { Eye, EyeOff, GitFork, ArrowDown } from 'lucide-react';

interface BlindSpotMapProps {
  analysis: BlindSpotAnalysis;
}

export const BlindSpotMap: React.FC<BlindSpotMapProps> = ({ analysis }) => {
  const visibleItems = analysis.known_factors.slice(0, 4);
  const hiddenAssumptions = analysis.unstated_assumptions.slice(0, 3);
  const overlookedFactors = analysis.overlooked_factors.slice(0, 3);

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
            Cognitive Visibility Architecture
          </span>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2 mt-0.5">
            <span>Blind-Spot Map: Visible vs. In The Dark</span>
          </h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Visible: {analysis.reasoning_visibility.visible_percentage}%</span>
          </div>
          <div className="flex items-center space-x-1.5 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Overlooked: {analysis.reasoning_visibility.overlooked_percentage}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Map Layout */}
      <div className="relative">
        {/* Center Root Node: The Decision */}
        <div className="flex justify-center mb-6">
          <div className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-center shadow-lg max-w-lg">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">
              The Central Decision
            </span>
            <span className="text-sm font-semibold text-white">
              {analysis.decision_summary}
            </span>
          </div>
        </div>

        {/* Dual Branches Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Left Branch: What You Can See */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-cyan-900/40 relative">
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-800 text-cyan-300">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm tracking-wide">
                WHAT YOU CAN SEE (Visible Rationale)
              </h4>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Explicit factors, stated priorities, and data points you brought to the table:
            </p>

            <div className="space-y-2">
              {visibleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start space-x-2 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-slate-200 block">{item.factor}</span>
                    {item.details && (
                      <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                        {item.details}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Branch: What You May Be Missing */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-rose-900/40 relative">
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-800 text-rose-300">
              <EyeOff className="w-4 h-4 text-rose-400" />
              <h4 className="font-bold text-sm tracking-wide">
                WHAT YOU MAY BE MISSING (The Blind Spots)
              </h4>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Unstated assumptions and dimensions operating in the dark:
            </p>

            <div className="space-y-2">
              {hiddenAssumptions.map((assump) => (
                <div
                  key={assump.id}
                  className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 flex items-start space-x-2 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-medium text-rose-200">{assump.title}</span>
                      <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                        Assumption
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                      {assump.description}
                    </span>
                  </div>
                </div>
              ))}

              {overlookedFactors.slice(0, 2).map((over) => (
                <div
                  key={over.id}
                  className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 flex items-start space-x-2 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-medium text-amber-200">{over.title}</span>
                      <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                        Overlooked
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                      {over.why_it_matters}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
