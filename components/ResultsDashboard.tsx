'use client';

import React, { useState } from 'react';
import { BlindSpotAnalysis, DecisionInput } from '@/types/blindspot';
import { BlindSpotMap } from './BlindSpotMap';
import { CoverageMetric } from './CoverageMetric';
import { BlindSpotCard } from './BlindSpotCard';
import { FalsificationSection } from './FalsificationSection';
import { FollowUpSection } from './FollowUpSection';
import { GuardrailNotice } from './GuardrailNotice';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  HelpCircle, 
  Compass, 
  BrainCircuit, 
  Activity,
  Printer
} from 'lucide-react';

interface ResultsDashboardProps {
  analysis: BlindSpotAnalysis;
  originalInput: DecisionInput;
  apiKey?: string;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  analysis,
  originalInput,
  apiKey,
  onReset
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summaryText = `
BLINDSPOT AI — REASONING AUDIT REPORT
Decision: ${analysis.decision_summary}
Reasoning Visibility: ${analysis.reasoning_visibility.visible_percentage}% Visible / ${analysis.reasoning_visibility.overlooked_percentage}% Overlooked

KEY ASSUMPTIONS:
${analysis.unstated_assumptions.map(a => `- ${a.title}: ${a.description}`).join('\n')}

OVERLOOKED FACTORS:
${analysis.overlooked_factors.map(o => `- ${o.title}: ${o.description}`).join('\n')}

QUESTIONS TO CONSIDER:
${analysis.questions_to_ask_yourself.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}

NO-VERDICT GUARANTEE: BlindSpot AI does not recommend choices. It audits reasoning.
`.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Audit Another Decision</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 transition"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Decision Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl">
        <span className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 block mb-1">
          Audited Dilemma
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          {analysis.decision_summary}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
            {originalInput.options.length} Options Considered
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
            {analysis.unstated_assumptions.length} Assumptions Flagged
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
            {analysis.overlooked_factors.length} Overlooked Dimensions
          </span>
        </div>
      </div>

      {/* 1. Strict Guardrail Compliance Seal */}
      <GuardrailNotice guardrail={analysis.guardrail} />

      {/* 2. Reasoning Coverage Ratio Bar */}
      <CoverageMetric
        visibility={analysis.reasoning_visibility}
        currentLeaning={analysis.current_leaning}
      />

      {/* 3. The Visual Blind-Spot Map (Visible vs Hidden) */}
      <BlindSpotMap analysis={analysis} />

      {/* 4. Section 1: Unstated Assumptions (Red Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              1. Unstated Assumptions
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Beliefs treated as facts without proof
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.unstated_assumptions.map((item) => (
            <BlindSpotCard
              key={item.id}
              id={item.id}
              category="assumption"
              title={item.title}
              description={item.description}
              evidenceQuote={item.evidence_quote}
              whyItMatters={item.why_it_matters}
              confidence={item.confidence}
              impact={item.impact}
            />
          ))}
        </div>
      </section>

      {/* 5. Section 2: Overlooked Factors (Amber Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              2. Overlooked Factors
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Relevant dimensions entirely absent from your rationale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.overlooked_factors.map((item) => (
            <BlindSpotCard
              key={item.id}
              id={item.id}
              category="overlooked"
              title={item.title}
              description={item.description}
              whyItMatters={item.why_it_matters}
              confidence={item.confidence}
              impact={item.impact}
            />
          ))}
        </div>
      </section>

      {/* 6. Section 3: Internal Conflicts (Purple Cards) */}
      {analysis.internal_conflicts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">
                3. Internal Conflicts & Tensions
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Where your stated priorities fight actual drivers
            </span>
          </div>

          <div className="space-y-4">
            {analysis.internal_conflicts.map((item) => (
              <BlindSpotCard
                key={item.id}
                id={item.id}
                category="conflict"
                title={item.title}
                description={item.description}
                statedVsActual={{
                  stated: item.stated_priority,
                  actual: item.competing_priority
                }}
                whyItMatters={item.tension_analysis}
                confidence={item.confidence}
                impact={item.impact}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Section 4: Missing Information Checklist (Blue Cards) */}
      {analysis.missing_information.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">
                4. Information You Don&apos;t Have Yet
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Empirical data to gather before locking in
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.missing_information.map((item) => (
              <BlindSpotCard
                key={item.id}
                id={item.id}
                category="missing"
                title={item.title}
                description={item.description}
                whyItMatters={item.why_it_matters}
                impact={item.importance}
                howToVerify={item.how_to_verify}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. Potential Reasoning Patterns */}
      {analysis.reasoning_patterns.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Observed Reasoning Patterns (Cognitive Tendencies)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.reasoning_patterns.map((rp, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <span className="font-bold text-cyan-300 block mb-1">
                  ● {rp.pattern}
                </span>
                <span className="text-slate-400 leading-relaxed block">
                  {rp.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Hero Feature: Probing Questions */}
      <section className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-cyan-800/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
              The Hero Feature
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2 mt-0.5">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
              <span>Questions Worth Asking Yourself</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Designed to test your logic
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-6">
          The goal of a reasoning audit is not to hand you answers, but to arm you with the specific questions that make your thinking harder to deceive.
        </p>

        <div className="space-y-4">
          {analysis.questions_to_ask_yourself.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 relative group hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                  0{idx + 1}
                </span>
                <div className="space-y-1.5 flex-1">
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {q.question}
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-cyan-400">Purpose:</span>
                    <span>{q.purpose}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Falsification Checklist ("What would change your mind?") */}
      <FalsificationSection conditions={analysis.what_would_change_your_mind} />

      {/* 11. Standout Feature: Round 2 Follow-Up Interrogation */}
      <FollowUpSection
        questions={analysis.questions_to_ask_yourself}
        originalDecision={originalInput.decision}
        originalReasoning={originalInput.reasoning}
        initialSummary={analysis.decision_summary}
        apiKey={apiKey}
      />

      {/* Bottom Action Footer */}
      <div className="text-center pt-4 pb-12">
        <button
          onClick={onReset}
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all"
        >
          ← Audit Another Decision
        </button>
      </div>
    </div>
  );
};
