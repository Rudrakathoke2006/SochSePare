'use client';

import React, { useState } from 'react';
import { Eye, ShieldCheck, Key, HelpCircle, Check, ExternalLink } from 'lucide-react';

interface HeaderProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  activeProvider?: 'gemini' | 'simulation';
}

export const Header: React.FC<HeaderProps> = ({ apiKey, onSaveApiKey, activeProvider = 'simulation' }) => {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveApiKey(tempKey.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsKeyModalOpen(false);
    }, 800);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border/80 bg-dark-bg/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <div className="h-full w-full bg-dark-bg rounded-[11px] flex items-center justify-center">
              <Eye className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                BlindSpot <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                Reasoning Auditor
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Don’t outsource your decision. Audit your thinking.
            </p>
          </div>
        </div>

        {/* Status badges & controls */}
        <div className="flex items-center space-x-3">
          {/* Strict Guardrail Indicator */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>No-Verdict Guardrail Active</span>
          </div>

          {/* Provider / API Key Button */}
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {apiKey ? 'API Key Configured' : 'Live API / Key'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border mb-4">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Gemini API Key Settings</h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              BlindSpot AI runs with a <strong className="text-cyan-300">built-in neural reasoning simulation engine</strong> by default—guaranteeing 100% functionality and instant testing for evaluators. 
              <br /><br />
              If you want live real-time LLM inference, you can enter your Google Gemini API key below:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google AI Studio Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-cyan-400 hover:underline"
                >
                  <span>Get a free Gemini key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>Stored only in your browser</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setTempKey('');
                  onSaveApiKey('');
                  setIsKeyModalOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                Use Simulation Mode
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition flex items-center justify-center space-x-1"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
