'use client';

import React, { useState } from 'react';
import { DecisionInput } from '@/types/blindspot';
import { Plus, X, Search, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const COMMON_FACTORS = [
  'Money & Compensation',
  'Career Trajectory',
  'Learning & Mentorship',
  'Academic Performance',
  'Time & Work-Life Balance',
  'Location & Proximity',
  'Stability & Risk',
  'Prestige & Brand',
  'Autonomy & Freedom',
  'Family & Relationships'
];

interface DecisionFormProps {
  initialValues?: DecisionInput;
  onSubmit: (data: DecisionInput) => void;
  isLoading: boolean;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({ initialValues, onSubmit, isLoading }) => {
  const [decision, setDecision] = useState(initialValues?.decision || '');
  const [options, setOptions] = useState<string[]>(
    initialValues?.options && initialValues.options.length > 0
      ? initialValues.options
      : ['Accept internship', 'Focus on academics / placements']
  );
  const [factors, setFactors] = useState<string[]>(
    initialValues?.factors || ['Money & Compensation', 'Career Trajectory', 'Location & Proximity']
  );
  const [customFactor, setCustomFactor] = useState('');
  const [reasoning, setReasoning] = useState(initialValues?.reasoning || '');
  const [leaning, setLeaning] = useState(initialValues?.leaning || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync when initialValues changes (e.g. from clicking a preset)
  React.useEffect(() => {
    if (initialValues) {
      setDecision(initialValues.decision);
      setOptions(initialValues.options);
      setFactors(initialValues.factors);
      setReasoning(initialValues.reasoning);
      setLeaning(initialValues.leaning);
      setValidationError(null);
    }
  }, [initialValues]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleUpdateOption = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const toggleFactor = (f: string) => {
    if (factors.includes(f)) {
      setFactors(factors.filter(item => item !== f));
    } else {
      setFactors([...factors, f]);
    }
  };

  const handleAddCustomFactor = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customFactor.trim()) {
      e.preventDefault();
      if (!factors.includes(customFactor.trim())) {
        setFactors([...factors, customFactor.trim()]);
      }
      setCustomFactor('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) {
      setValidationError('Please enter the decision you are facing.');
      return;
    }
    if (!reasoning.trim()) {
      setValidationError('Please explain your reasoning or why you are leaning toward an option.');
      return;
    }

    setValidationError(null);
    onSubmit({
      decision: decision.trim(),
      options: options.filter(o => o.trim().length > 0),
      factors,
      reasoning: reasoning.trim(),
      leaning: leaning.trim() || options[0] || ''
    });
  };

  return (
    <form
      id="decision-form"
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto px-4 py-6"
    >
      <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 space-y-7 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Step 1: Decision */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-bold text-cyan-400 mb-2">
            Step 1 · The Decision
          </label>
          <h2 className="text-lg font-semibold text-white mb-2">
            What decision are you facing?
          </h2>
          <input
            type="text"
            required
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="e.g. Should I accept this ₹30k/month internship or focus on placement prep?"
            className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Step 2: Options */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-cyan-400 mb-1">
                Step 2 · The Options
              </label>
              <h2 className="text-lg font-semibold text-white">
                What are the alternatives you are considering?
              </h2>
            </div>
            {options.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add option</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option, idx) => (
              <div key={idx} className="relative">
                <span className="absolute left-3 top-3 text-[11px] font-mono text-slate-500 font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleUpdateOption(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  className="w-full pl-8 pr-8 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="absolute right-2.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: What Matters to You? (Chips) */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-bold text-cyan-400 mb-2">
            Step 3 · Your Visible Factors
          </label>
          <h2 className="text-lg font-semibold text-white mb-1">
            What explicit factors are on your radar?
          </h2>
          <p className="text-xs text-slate-400 mb-3">
            Select the factors you are consciously weighing right now.
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_FACTORS.map((factor) => {
              const isSelected = factors.includes(factor);
              return (
                <button
                  key={factor}
                  type="button"
                  onClick={() => toggleFactor(factor)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {factor}
                </button>
              );
            })}
          </div>

          {/* Add custom factor */}
          <div className="max-w-xs">
            <input
              type="text"
              value={customFactor}
              onChange={(e) => setCustomFactor(e.target.value)}
              onKeyDown={handleAddCustomFactor}
              placeholder="+ Type custom factor & press Enter"
              className="w-full px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Step 4: Your Reasoning (The Core Audit Input) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-cyan-400 mb-1">
                Step 4 · Your Reasoning & Leaning
              </label>
              <h2 className="text-lg font-semibold text-white">
                Why are you leaning one way? What is your logic?
              </h2>
            </div>
            <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
              Crucial for AI Audit
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
            Write naturally. Explain your gut feeling, why you prefer one option, and what you tell yourself to justify it. The AI will audit this text specifically.
          </p>

          <textarea
            required
            rows={4}
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="e.g. The internship gives me a good stipend, it's close to home so no relocation stress, and I'll get industry experience on my resume. I think it will help me get a better job later."
            className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed font-sans transition-all"
          />

          {/* Current Lean Selector */}
          <div className="mt-3 flex items-center space-x-3 text-xs">
            <span className="text-slate-400 font-medium">Current Lean:</span>
            <select
              value={leaning}
              onChange={(e) => setLeaning(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Undecided / Open</option>
              {options.filter(o => o.trim()).map((opt, i) => (
                <option key={i} value={opt}>
                  Leaning toward: {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Error banner */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-cyan-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Auditing Reasoning & Extracting Blind Spots...</span>
              </div>
            ) : (
              <>
                <Search className="w-5 h-5 text-cyan-300" />
                <span>Audit My Reasoning & Reveal Blind Spots</span>
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2 font-mono">
            Guaranteed: The AI will challenge your logic without ever deciding for you.
          </p>
        </div>
      </div>
    </form>
  );
};
