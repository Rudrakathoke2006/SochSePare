import React from 'react';
import { PRESET_SCENARIOS, PresetScenario } from '@/lib/presets';
import { Briefcase, Rocket, GraduationCap, Home, ShieldAlert, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetScenario) => void;
  selectedPresetId?: string;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  'internship': <Briefcase className="w-4 h-4 text-cyan-400" />,
  'startup-vs-corp': <Rocket className="w-4 h-4 text-purple-400" />,
  'higher-studies': <GraduationCap className="w-4 h-4 text-amber-400" />,
  'buy-vs-rent': <Home className="w-4 h-4 text-emerald-400" />,
  'guardrail-adversarial': <ShieldAlert className="w-4 h-4 text-rose-400" />,
};

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset, selectedPresetId }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
            Instant Test Scenarios (1-Click Evaluation)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Click any card to auto-fill</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PRESET_SCENARIOS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const isGuardrail = preset.id === 'guardrail-adversarial';

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/80 shadow-md shadow-cyan-900/20 ring-1 ring-cyan-500'
                  : isGuardrail
                  ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/80 hover:bg-rose-950/40'
                  : 'bg-dark-card/80 border-dark-border hover:border-slate-600 hover:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    {ICONS_MAP[preset.id] || <Sparkles className="w-4 h-4 text-cyan-400" />}
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {preset.name}
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                    {preset.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.tagline}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Test Input</span>
                <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform font-medium">
                  Load & Audit →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
