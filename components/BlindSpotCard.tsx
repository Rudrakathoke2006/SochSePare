'use client';

import React, { useState } from 'react';
import { SeverityLevel, ConfidenceLevel } from '@/types/blindspot';
import { ChevronDown, ChevronUp, Quote, CheckCircle2, AlertOctagon, EyeOff, ShieldQuestion } from 'lucide-react';

export type TriageStatus = 'unreviewed' | 'considered' | 'irrelevant' | 'critical';

interface BlindSpotCardProps {
  id: string;
  category: 'assumption' | 'overlooked' | 'conflict' | 'missing';
  title: string;
  description: string;
  evidenceQuote?: string;
  whyItMatters: string;
  confidence?: ConfidenceLevel;
  impact?: SeverityLevel;
  statedVsActual?: { stated: string; actual: string };
  howToVerify?: string;
}

export const BlindSpotCard: React.FC<BlindSpotCardProps> = ({
  category,
  title,
  description,
  evidenceQuote,
  whyItMatters,
  confidence = 'high',
  impact = 'high',
  statedVsActual,
  howToVerify
}) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const [triage, setTriage] = useState<TriageStatus>('unreviewed');

  // Styles based on category
  const categoryConfig = {
    assumption: {
      border: 'border-rose-900/40 hover:border-rose-700/60',
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
      icon: <EyeOff className="w-4 h-4 text-rose-400" />,
      label: 'Unstated Assumption'
    },
    overlooked: {
      border: 'border-amber-900/40 hover:border-amber-700/60',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      icon: <AlertOctagon className="w-4 h-4 text-amber-400" />,
      label: 'Overlooked Factor'
    },
    conflict: {
      border: 'border-purple-900/40 hover:border-purple-700/60',
      badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
      icon: <ShieldQuestion className="w-4 h-4 text-purple-400" />,
      label: 'Internal Conflict'
    },
    missing: {
      border: 'border-cyan-900/40 hover:border-cyan-700/60',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
      icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
      label: 'Missing Information'
    }
  }[category];

  const impactColors = {
    high: 'text-rose-400 bg-rose-950/60 border-rose-900',
    medium: 'text-amber-400 bg-amber-950/60 border-amber-900',
    low: 'text-slate-400 bg-slate-900 border-slate-800'
  }[impact];

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 bg-slate-900/70 backdrop-blur-sm border transition-all duration-200 relative ${
        categoryConfig.border
      } ${
        triage === 'considered'
          ? 'opacity-60 bg-slate-950/40 border-slate-800'
          : triage === 'critical'
          ? 'ring-2 ring-rose-500 shadow-xl shadow-rose-950/20'
          : triage === 'irrelevant'
          ? 'opacity-40 line-through'
          : ''
      }`}
    >
      {/* Top Header: Category & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
            {categoryConfig.icon}
          </span>
          <span
            className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${categoryConfig.badgeBg}`}
          >
            {categoryConfig.label}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span
            className={`px-2 py-0.5 rounded-full border uppercase font-semibold ${impactColors}`}
          >
            Impact: {impact}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 uppercase">
            Conf: {confidence}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
        {description}
      </p>

      {/* Stated vs Actual Conflict Comparison (if category is conflict) */}
      {statedVsActual && (
        <div className="my-3 p-3 rounded-xl bg-slate-950/80 border border-purple-900/40 space-y-1.5 text-xs">
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold min-w-[90px]">Stated Desire:</span>
            <span className="text-slate-300">{statedVsActual.stated}</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-rose-400 font-bold min-w-[90px]">Actual Driver:</span>
            <span className="text-slate-300">{statedVsActual.actual}</span>
          </div>
        </div>
      )}

      {/* Why it Matters */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs mb-4">
        <span className="font-bold text-slate-200 block mb-0.5">Why this matters:</span>
        <span className="text-slate-400 leading-relaxed">{whyItMatters}</span>
      </div>

      {/* Verification Path (if missing info) */}
      {howToVerify && (
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 text-xs text-cyan-300 mb-4 flex items-center space-x-2">
          <span className="font-semibold">Action to verify:</span>
          <span className="text-cyan-200">{howToVerify}</span>
        </div>
      )}

      {/* Evidence Traceability Accordion ("Why did you flag this?") */}
      {evidenceQuote && (
        <div className="border-t border-slate-800/80 pt-3 mb-4">
          <button
            type="button"
            onClick={() => setShowEvidence(!showEvidence)}
            className="flex items-center justify-between w-full text-left text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center space-x-1.5 font-medium">
              <Quote className="w-3.5 h-3.5 text-cyan-400" />
              <span>Traceability: Why did the AI flag this in my words?</span>
            </span>
            {showEvidence ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showEvidence && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-cyan-950 text-xs space-y-2 animate-fade-in">
              <div className="text-slate-400">
                <span className="font-semibold text-slate-300">You wrote: </span>
                <span className="italic text-cyan-200 font-mono">
                  &ldquo;{evidenceQuote}&rdquo;
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                The AI identified that your stated logic implies an unverified premise here without providing corroborating facts or risk hedges.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Interactive Triage Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <span className="text-[11px] text-slate-500 font-medium">Your Assessment:</span>
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setTriage(triage === 'considered' ? 'unreviewed' : 'considered')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              triage === 'considered'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ✓ I&apos;ve Considered This
          </button>

          <button
            type="button"
            onClick={() => setTriage(triage === 'critical' ? 'unreviewed' : 'critical')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              triage === 'critical'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-950 text-slate-400 hover:text-rose-300 border border-slate-800'
            }`}
          >
            ⚠️ Critical Blind Spot
          </button>

          <button
            type="button"
            onClick={() => setTriage(triage === 'irrelevant' ? 'unreviewed' : 'irrelevant')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              triage === 'irrelevant'
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800'
            }`}
          >
            Not Relevant
          </button>
        </div>
      </div>
    </div>
  );
};
