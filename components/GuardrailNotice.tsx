import React from 'react';
import { ShieldCheck, ShieldAlert, Award } from 'lucide-react';
import { GuardrailReport } from '@/types/blindspot';

interface GuardrailNoticeProps {
  guardrail: GuardrailReport;
}

export const GuardrailNotice: React.FC<GuardrailNoticeProps> = ({ guardrail }) => {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 border transition-all mb-8 ${
        guardrail.guardrail_triggered
          ? 'bg-rose-950/40 border-rose-800 text-rose-200'
          : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center space-x-2.5">
          {guardrail.guardrail_triggered ? (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          <span className="font-bold text-sm sm:text-base text-white">
            {guardrail.guardrail_triggered
              ? 'Adversarial Request Handled — Verdict Refused'
              : 'Strict No-Verdict Guardrail Active'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-semibold">
            verdict_given: false
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
            verdict: null
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
        {guardrail.neutrality_statement}
      </p>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Architectural Design: Socratic Cognitive Auditor</span>
        <span className="text-emerald-400 font-semibold">100% Decision Agency Preserved</span>
      </div>
    </div>
  );
};
