'use client';

import React, { useState } from 'react';
import { RotateCcw, CheckSquare, Square, HelpCircle, ShieldAlert } from 'lucide-react';

interface FalsificationSectionProps {
  conditions: string[];
}

export const FalsificationSection: React.FC<FalsificationSectionProps> = ({ conditions }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
            Falsifiability & Cognitive Flexibility
          </span>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2 mt-0.5">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <span>What Would Change Your Mind?</span>
          </h3>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Intellectual Honesty Check
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
        If a belief cannot be changed by new evidence, it is a dogma, not a reasoned decision.
        The AI has identified the following hypothetical conditions that should logically overturn or weaken your current leaning:
      </p>

      <div className="space-y-3">
        {conditions.map((item, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-xs sm:text-sm ${
                isChecked
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-amber-400 flex-shrink-0"
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </button>
              <div className="flex-1">
                <span className={isChecked ? 'line-through text-slate-400' : 'font-medium'}>
                  {item}
                </span>
                {isChecked && (
                  <span className="block text-[11px] text-amber-400 mt-1 font-mono">
                    ✓ Acknowledged: If this condition is met, you agree to re-evaluate your decision.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center space-x-2 text-[11px] text-slate-400">
        <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Notice:</strong> We are not recommending that you reject your choice. We are surfacing the critical evidence thresholds you need to investigate.
        </span>
      </div>
    </div>
  );
};
