'use client';

import React, { useState } from 'react';
import { QuestionToConsider, FollowUpAnalysis } from '@/types/blindspot';
import { MessageSquareCode, Sparkles, Send, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface FollowUpSectionProps {
  questions: QuestionToConsider[];
  originalDecision: string;
  originalReasoning: string;
  initialSummary: string;
  apiKey?: string;
}

export const FollowUpSection: React.FC<FollowUpSectionProps> = ({
  questions,
  originalDecision,
  originalReasoning,
  initialSummary,
  apiKey
}) => {
  const topQuestions = questions.slice(0, 2);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [followupResult, setFollowupResult] = useState<FollowUpAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (qId: string, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: text
    }));
  };

  const handleRunFollowUp = async () => {
    const formattedAnswers = topQuestions
      .map(q => ({
        question_id: q.id,
        question_text: q.question,
        user_answer: (answers[q.id] || '').trim()
      }))
      .filter(a => a.user_answer.length > 0);

    if (formattedAnswers.length === 0) {
      setError('Please provide an answer to at least one question to run the second-round audit.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_decision: originalDecision,
          original_reasoning: originalReasoning,
          initial_analysis_summary: initialSummary,
          answers: formattedAnswers,
          userApiKey: apiKey
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to conduct round 2 audit');
      }

      setFollowupResult(data.data);
    } catch (err: any) {
      setError(err?.message || 'Error occurred during follow-up reflection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-cyan-900/40 shadow-2xl mb-8 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
            Iterative Reflection Loop · Round 2
          </span>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2 mt-0.5">
            <MessageSquareCode className="w-5 h-5 text-cyan-400" />
            <span>Go Deeper: Socratic Reasoning Interrogation</span>
          </h3>
        </div>
        <div className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
          Follow-Up Mode Active
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
        Don’t stop at one-shot analysis. Answer 1 or 2 of these probing questions, and BlindSpot AI will inspect the <strong>evolution of your reasoning</strong> to check if your answers resolved the blind spot or introduced new secondary assumptions.
      </p>

      {/* Questions list with answer inputs */}
      <div className="space-y-5 mb-6">
        {topQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-mono uppercase font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Question {idx + 1}
              </span>
              <span className="text-[10px] text-slate-400 italic">
                Purpose: {q.purpose}
              </span>
            </div>

            <p className="text-sm font-semibold text-white leading-snug">
              {q.question}
            </p>

            <textarea
              rows={2}
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="Type your candid reflection here..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed transition-all"
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Run button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleRunFollowUp}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-950/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
              <span>Interrogating Reasoning Evolution...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Challenge My Reasoning Again →</span>
            </>
          )}
        </button>

        <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
          Iterative Cognitive Audit
        </span>
      </div>

      {/* Follow-Up Result Display */}
      {followupResult && (
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 text-xs sm:text-sm leading-relaxed text-purple-200">
            <span className="font-bold text-purple-300 block mb-1 uppercase tracking-wider text-[11px] font-mono">
              ● Socratic Evolution Assessment:
            </span>
            {followupResult.socratic_feedback}
          </div>

          {/* Evolved Assumptions */}
          {followupResult.evolved_assumptions.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-rose-400 mb-3">
                New / Persistent Assumptions Detected in Your Answers
              </h4>
              <div className="space-y-3">
                {followupResult.evolved_assumptions.map((ea) => (
                  <div
                    key={ea.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/50 text-xs space-y-1.5"
                  >
                    <span className="font-bold text-rose-300 block text-sm">
                      {ea.title}
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {ea.description}
                    </p>
                    {ea.evidence_quote && (
                      <div className="text-[11px] text-slate-400 font-mono italic">
                        Quoting your answer: &ldquo;{ea.evidence_quote}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clarified Priorities */}
          {followupResult.clarified_priorities.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-400 mb-3">
                Emerging Value Clarity
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {followupResult.clarified_priorities.map((cp, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{cp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* New Probing Questions */}
          {followupResult.new_probing_questions.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-cyan-400 mb-3">
                Second-Order Probing Questions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {followupResult.new_probing_questions.map((nq, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium"
                  >
                    <span className="text-cyan-400 font-mono block mb-1">
                      Deference Probe 0{i + 1}:
                    </span>
                    {nq}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
