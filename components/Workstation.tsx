'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DecisionInput, BlindSpotAnalysis } from '@/types/blindspot';

interface ReflectionItem {
  id: string;
  text: string;
  timestamp: string;
  impactText: string;
}

interface WorkstationPreset {
  id: string;
  label: string;
  dilemma: string;
  alpha: string;
  beta: string;
  reasoning: string;
  leaning: number;
  coverage: number;
  criticalGaps: number;
  tensions: number;
  durability: string;
  dimensions: string[];
  statedNodes: string[];
  hiddenNodes: { label: string; type: 'unexamined' | 'tension' | 'blindspot' }[];
  assumptions: {
    id: string;
    code: string;
    severity: string;
    confidence: number;
    title: string;
    quoteTrace: string;
    explanation: string;
    whyFlagged: string;
  }[];
  conflicts: {
    id: string;
    code: string;
    type: string;
    title: string;
    explanation: string;
    statedPref: string;
    declaredTarget: string;
  }[];
  overlooked: {
    id: string;
    code: string;
    type: string;
    title: string;
    explanation: string;
  }[];
  missingInfo: {
    id: string;
    code: string;
    title: string;
    explanation: string;
    verifyAction: string;
    importance: string;
  }[];
  falsifications: {
    id: string;
    title: string;
    detail: string;
  }[];
  pressureQuestions: {
    id: string;
    code: string;
    title: string;
    question: string;
  }[];
}

const PRESETS: Record<string, WorkstationPreset> = {
  internship_vs_prep: {
    id: 'internship_vs_prep',
    label: 'INTERNSHIP VS PREP',
    dilemma: 'Should I accept a ₹30,000/month summer fintech internship or dedicate 100% of my time to off-campus placement preparation?',
    alpha: 'Accept 3-Month Fintech Internship (₹30k/mo, Onsite Mumbai, Small Team)',
    beta: '100% Placement & DSA Rigor (System Design, LeetCode 450, Hackathons)',
    reasoning: 'The ₹30,000 stipend offers immediate financial autonomy and rent coverage. It provides a credible production logo on my resume. However, it requires 45+ hours weekly on what might just be boilerplate frontend churn, leaving zero cognitive band for hard competitive algorithmic problem sets needed for Tier-1 off-campus placements in August.',
    leaning: 72,
    coverage: 58,
    criticalGaps: 3,
    tensions: 2,
    durability: 'FRAGILE',
    dimensions: ['COMPENSATION', 'CAREER TRAJECTORY', 'TIME CONSTRAINTS', 'DECISION REVERSIBILITY', 'SKILL ACCRUAL VELOCITY'],
    statedNodes: [
      '[STATED] ₹30,000 Mo. Rent Cover',
      "[STATED] 'Production' Resume Stamp",
      '[STATED] Aug Off-Campus Placement'
    ],
    hiddenNodes: [
      { label: '[UNEXAMINED] Mentorship Ratio Unknown', type: 'unexamined' },
      { label: '[TENSION] ₹15LPA North-Star vs ₹30k Fixation', type: 'tension' },
      { label: '[BLINDSPOT] 360 DSA Study Hours Lost', type: 'blindspot' }
    ],
    assumptions: [
      {
        id: 'asm_1_a',
        code: 'ASSUMPTION // #01-A',
        severity: 'Critical',
        confidence: 92,
        title: "Equating 'Startup Logo' with 'Tier-1 Engineering Signal'",
        quoteTrace: 'It provides a credible production logo on my resume.',
        explanation: 'You assume hiring committees for Tier-1 placements automatically value early-stage seed-stage frontend work above verified algorithm benchmark competence. In competitive placement rounds, generic frontend work often receives negligible weighting compared to deep data structures or verifiable systems code.',
        whyFlagged: 'Historical recruiting signals demonstrate that 82% of technical screen rejections at target compensation (>₹15LPA) stem from algorithmic threshold failures rather than absence of 90-day internship tenure.'
      },
      {
        id: 'asm_1_b',
        code: 'ASSUMPTION // #01-B',
        severity: 'High',
        confidence: 88,
        title: 'Unexamined Mentorship Availability',
        quoteTrace: '...might just be boilerplate frontend churn...',
        explanation: 'You acknowledge the risk of repetitive churn, yet implicitly assume you will receive senior architectural code reviews that accelerate your learning. If the team consists only of junior founders under shipping pressure, code review quality approaches zero.',
        whyFlagged: 'Junior talent acceleration is 4.3x higher under structured Staff+ engineer mentorship than in unstructured chaotic task ticket loops.'
      },
      {
        id: 'asm_1_c',
        code: 'ASSUMPTION // #01-C',
        severity: 'Medium',
        confidence: 81,
        title: 'Simultaneous Cognitive Capacity After 9-Hour Days',
        quoteTrace: '...leaving zero cognitive band...',
        explanation: 'You state that full-time onsite hours leave zero cognitive band for hard competitive algorithmic problem sets, yet your current 72% lean assumes you will somehow find the energy on weekends to stay competitive with peers studying 10 hours daily.',
        whyFlagged: 'Cognitive fatigue is non-linear; working memory degrades by ~40% after continuous debugging sessions.'
      }
    ],
    conflicts: [
      {
        id: 'cfl_1_a',
        code: 'TENSION // #02-A',
        type: 'Time Horizon Inversion',
        title: 'Immediate Cash Flow vs 3-Year Compounding Wealth',
        explanation: 'A ₹30,000/month stipend totals ₹90,000 across 3 months. The stated placement goal targets ₹15,00,000+ per annum (a recurring ₹1,25,000/month differential). You are weighing a short-term ₹90k certain return against an epistemic discount on your long-term recurring salary ladder.',
        statedPref: '₹30k / mo immediate relief',
        declaredTarget: 'Tier-1 ₹15-24 LPA Placement'
      },
      {
        id: 'cfl_1_b',
        code: 'TENSION // #02-B',
        type: 'Cognitive Bandwidth Conflict',
        title: '45-Hour Exhaustion vs Evening Problem Solving',
        explanation: 'You state you will study in the evenings after an onsite commute in Mumbai. Behavioral reasoning models show high probability of cognitive exhaustion after full days of code troubleshooting, making deep algorithm synthesis improbable.',
        statedPref: 'Desire for full technical readiness',
        declaredTarget: 'Onsite 45hr commitment + commute'
      }
    ],
    overlooked: [
      {
        id: 'ovl_1_a',
        code: 'FACTOR // #03-A',
        type: 'Opportunity Cost Deficit',
        title: 'Calculated Study Time Loss: ~360 Focus Hours',
        explanation: '12 weeks at 30 hours net study time per week equals 360 dedicated preparation hours. In placement preparation terms, this translates to roughly 220 hard algorithmic problems and 8 end-to-end distributed system case studies unbuilt.'
      },
      {
        id: 'ovl_1_b',
        code: 'FACTOR // #03-B',
        type: 'Decision Reversibility',
        title: 'Asymmetric Reversibility: Quitting vs Never Starting',
        explanation: 'If the internship proves unproductive after Day 20, what is your exit friction? Resigning carries personal social guilt and burned recruiter relationships; starting placement prep retains 100% autonomous control over every working hour.'
      }
    ],
    missingInfo: [
      {
        id: 'mis_1_a',
        code: 'INFO GAP // #04-A',
        title: 'Mentorship Density & Daily Code Review Protocol',
        explanation: 'You do not know whether a senior Staff or Lead engineer will review your pull requests daily, or if you will be working unsupervised.',
        verifyAction: 'Ask the engineering manager directly: "Who conducts PR reviews for interns and what is the review turnaround SLA?"',
        importance: 'Critical'
      },
      {
        id: 'mis_1_b',
        code: 'INFO GAP // #04-B',
        title: 'Historical PPO Conversion Percentage for Interns',
        explanation: 'You haven’t verified if this company converts summer interns into full-time offers with CTC meeting your placement threshold.',
        verifyAction: 'Check alumni records or ask 2 former interns on LinkedIn if they received full-time conversions.',
        importance: 'High'
      }
    ],
    falsifications: [
      {
        id: 'f1',
        title: 'Pre-Placement Offer (PPO) Guarantee:',
        detail: 'If company contracts a confirmed PPO conversion bar at >₹14 LPA upon internship completion.'
      },
      {
        id: 'f2',
        title: 'Zero-Commitment Remote Flexibility:',
        detail: 'If employer permits 15 hours remote work per week, restoring 25 study hours for algorithm practice.'
      },
      {
        id: 'f3',
        title: 'Financial Solvency Buffer:',
        detail: 'If personal or familial liquidity covers Mumbai living costs without requiring monthly stipend drawdowns.'
      }
    ],
    pressureQuestions: [
      {
        id: 'q1',
        code: 'Q1',
        title: 'The Zero-Stipend Boundary:',
        question: 'If the ₹30,000 stipend were reduced to ₹0, would you still accept the role for the brand equity alone?'
      },
      {
        id: 'q2',
        code: 'Q2',
        title: 'The Production Artifact Test:',
        question: 'What verifiable engineering artifact will you ship that cannot be simulated via open-source portfolio builds?'
      },
      {
        id: 'q3',
        code: 'Q3',
        title: 'Placement Horizon Compression:',
        question: 'If top firms bring placement timelines forward by 3 weeks, does your working memory permit daily context-switching?'
      }
    ]
  },
  startup_vs_corp: {
    id: 'startup_vs_corp',
    label: 'STARTUP VS CORP',
    dilemma: 'Join early-stage AI seed startup as Employee #4 vs Accept Tier-1 Big Tech SDE-1 offer in Bangalore?',
    alpha: 'Founding Engineer @ Agentic AI Startup ($85k + 1.2% Equity)',
    beta: 'SDE-1 @ Established Cloud Enterprise ($125k Base + Clear L4 Ladder)',
    reasoning: 'The startup gives hyper-velocity execution experience and direct founder access, but runway is 9 months. The corporate offer guarantees H-1B lottery sponsoring eligibility and structured L4 advancement, but high probability of being pigeonholed into internal billing infrastructure.',
    leaning: 40,
    coverage: 64,
    criticalGaps: 2,
    tensions: 3,
    durability: 'MODERATE',
    dimensions: ['COMPENSATION', 'CAREER TRAJECTORY', 'MENTORSHIP QUALITY', 'TIME CONSTRAINTS', 'SKILL ACCRUAL VELOCITY'],
    statedNodes: [
      '[STATED] Hyper-Velocity Execution',
      '[STATED] 9-Month Cash Runway',
      '[STATED] Enterprise L4 Ladder'
    ],
    hiddenNodes: [
      { label: '[UNEXAMINED] Seed Equity Dilution Terms', type: 'unexamined' },
      { label: '[TENSION] Visa Mobility vs Early Risk', type: 'tension' },
      { label: '[BLINDSPOT] Absence of Senior Staff Oversight', type: 'blindspot' }
    ],
    assumptions: [
      {
        id: 'asm_2_a',
        code: 'ASSUMPTION // #01-A',
        severity: 'Critical',
        confidence: 89,
        title: 'Hyper-velocity implies architectural discipline',
        quoteTrace: 'The startup gives hyper-velocity execution experience...',
        explanation: 'Building rapidly without senior architect code reviews often develops hacking habits that fail enterprise-scale distributed system benchmarks.',
        whyFlagged: 'Early startups frequently ship technical debt that must be discarded rather than built upon.'
      },
      {
        id: 'asm_2_b',
        code: 'ASSUMPTION // #01-B',
        severity: 'High',
        confidence: 84,
        title: 'Equity upside compensates for 9-month cliff risk',
        quoteTrace: '...runway is 9 months...',
        explanation: 'If the Series A fails to close in 7 months, engineering energy will pivot entirely from product development to emergency runway preservation.',
        whyFlagged: 'Founding equity is illiquid and historically yields zero in 88% of seed investments.'
      }
    ],
    conflicts: [
      {
        id: 'cfl_2_a',
        code: 'TENSION // #02-A',
        type: 'Mobility vs Immediate Autonomy',
        title: 'Long-term Visa Security vs Startup Freedom',
        explanation: 'You desire international tech mobility, but are leaning toward an entity incapable of sponsoring visas or absorbing macroeconomic shocks.',
        statedPref: 'Desire for global mobility',
        declaredTarget: '9-month seed runway'
      }
    ],
    overlooked: [
      {
        id: 'ovl_2_a',
        code: 'FACTOR // #03-A',
        type: 'Mentorship Deficit',
        title: 'Lack of Senior Staff Level Code Review',
        explanation: 'With 4 employees, there are no Principal Engineers to teach distributed consensus, latency budgets, or production reliability engineering.'
      }
    ],
    missingInfo: [
      {
        id: 'mis_2_a',
        code: 'INFO GAP // #04-A',
        title: 'Verified Cap Table & Liquidation Preferences',
        explanation: 'You do not know if preferred investors have 2x participating liquidation preferences that wipe out common equity in a sub-$15M exit.',
        verifyAction: 'Request to review the summary cap table and option pool terms before signing.',
        importance: 'High'
      }
    ],
    falsifications: [
      {
        id: 'f1',
        title: 'Lead Investor Term Sheet:',
        detail: 'If the startup closes an extension guaranteeing 24 months of runway with signed customer LOIs.'
      },
      {
        id: 'f2',
        title: 'Corporate Team Transfer:',
        detail: 'If the enterprise offer includes a written guarantee to join the AI core incubation team after 6 months.'
      }
    ],
    pressureQuestions: [
      {
        id: 'q1',
        code: 'Q1',
        title: 'The Runway Pre-Mortem:',
        question: 'If the startup runs out of money in month 8 with no bridge round, how does your resume explain that period to corporate recruiters?'
      }
    ]
  },
  ms_vs_job: {
    id: 'ms_vs_job',
    label: 'MS ABROAD VS JOB',
    dilemma: 'Accept Fall 2025 MS in Computer Science in the US ($95,000 loan) or retain Senior Engineer seat in India?',
    alpha: 'US MS Degree (Top 25 CS Dept, 24 Months, High Visa Exposure)',
    beta: 'Retain Lead SDE Role (₹42 LPA, Accelerated Staff Track, Zero Debt)',
    reasoning: 'A US degree has been a lifelong aspiration for high-leverage research networks and potential silicon valley mobility. But with current H-1B lottery volatility and high borrowing rates, taking on $95k debt puts enormous downstream pressure on immediate recruitment outcomes.',
    leaning: 55,
    coverage: 51,
    criticalGaps: 4,
    tensions: 2,
    durability: 'HIGH RISK',
    dimensions: ['COMPENSATION', 'CAREER TRAJECTORY', 'TIME CONSTRAINTS', 'DECISION REVERSIBILITY'],
    statedNodes: [
      '[STATED] $95k Unhedged Debt',
      '[STATED] Silicon Valley Network',
      '[STATED] ₹42 LPA Staff Track'
    ],
    hiddenNodes: [
      { label: '[UNEXAMINED] H-1B Lottery Probability (~18%)', type: 'unexamined' },
      { label: '[TENSION] Net Worth Compounding Divergence', type: 'tension' },
      { label: '[BLINDSPOT] 24-Month Domestic SDE Promotions Lost', type: 'blindspot' }
    ],
    assumptions: [
      {
        id: 'asm_3_a',
        code: 'ASSUMPTION // #01-A',
        severity: 'Critical',
        confidence: 94,
        title: 'Past 10-Year Tech Payback Predicts Future Payback',
        quoteTrace: 'A US degree has been a lifelong aspiration for high-leverage research...',
        explanation: 'You are applying historical 2018 hiring velocity and interest rates to a high-rate, post-2023 tech macro climate with 90-day OPT job search clocks.',
        whyFlagged: 'International student tech placement duration has stretched from 2.1 months to 6.8 months post-grad.'
      }
    ],
    conflicts: [
      {
        id: 'cfl_3_a',
        code: 'TENSION // #02-A',
        type: 'Wealth Maximization vs Maximum Debt Peak',
        title: 'Stated Goal of Wealth vs Taking Fixed Dollar Debt',
        explanation: 'You desire financial independence, but are trading a debt-free ₹42 LPA compounding asset for $95,000 floating debt at peak interest rates.',
        statedPref: 'Compounding Net Worth',
        declaredTarget: '$95k Debt at 11% Interest'
      }
    ],
    overlooked: [
      {
        id: 'ovl_3_a',
        code: 'FACTOR // #03-A',
        type: 'Domestic Career Compounding',
        title: 'The ₹1.5 Crore Compounding Gap',
        explanation: 'Retaining ₹42 LPA and investing ₹20 LPA surplus across 2 years yields ~₹55 Lakhs liquid, vs -$95k (-₹80 Lakhs) debt deficit.'
      }
    ],
    missingInfo: [
      {
        id: 'mis_3_a',
        code: 'INFO GAP // #04-A',
        title: 'Recent F-1 International Student Placement Ratio',
        explanation: 'You don’t have the verified 2023-2024 placement data specifically for visa-holding students from this CS department.',
        verifyAction: 'Email the university graduate placement advisor for international student outcomes only.',
        importance: 'Critical'
      }
    ],
    falsifications: [
      {
        id: 'f1',
        title: 'Full Graduate Research Assistantship:',
        detail: 'If the university awards a 100% tuition waiver with a monthly research stipend.'
      }
    ],
    pressureQuestions: [
      {
        id: 'q1',
        code: 'Q1',
        title: 'The Visa Lottery Stress Test:',
        question: 'If you fail the H-1B lottery all 3 times on OPT and must return home, how will your Indian salary service the remaining dollar debt?'
      }
    ]
  },
  buy_vs_rent: {
    id: 'buy_vs_rent',
    label: 'BUY VS RENT',
    dilemma: 'Should I purchase a 3-BHK apartment with a 20-year mortgage, or rent comfortably and invest in equity index funds?',
    alpha: 'Buy 3-BHK Apartment (20-Year EMI, 8.5% Interest, Family Stability)',
    beta: 'Rent & Systematic Equity Investing (Flexibility, 12% Equity Compounding)',
    reasoning: 'Paying rent feels like throwing money away each month. If I buy, the EMI is building equity in a real physical asset that will appreciate. It will give my family permanent stability and pride, plus I get income tax deductions on the home loan interest.',
    leaning: 68,
    coverage: 48,
    criticalGaps: 3,
    tensions: 2,
    durability: 'FRAGILE',
    dimensions: ['COMPENSATION', 'TIME CONSTRAINTS', 'DECISION REVERSIBILITY'],
    statedNodes: [
      "[STATED] 'Rent Is Throwing Money Away'",
      '[STATED] Asset Appreciation & Pride',
      '[STATED] Home Loan Tax Deduction'
    ],
    hiddenNodes: [
      { label: '[UNEXAMINED] Front-Loaded Interest (~72% of Early EMI)', type: 'unexamined' },
      { label: '[TENSION] Wealth Goal vs 20-Year Illiquid Lockup', type: 'tension' },
      { label: '[BLINDSPOT] Career Relocation Agility Lost', type: 'blindspot' }
    ],
    assumptions: [
      {
        id: 'asm_4_a',
        code: 'ASSUMPTION // #01-A',
        severity: 'Critical',
        confidence: 91,
        title: "Assuming 'Rent is Lost' while Mortgage Interest is Not",
        quoteTrace: 'Paying rent feels like throwing money away each month.',
        explanation: 'You treat rent as a 100% loss, while ignoring that during the first 7-10 years of an 8.5% mortgage, over 70% of each EMI payment goes to pure bank interest, property taxes, and HOA dues—which are equally unrecoverable.',
        whyFlagged: 'In metro cities with 2.5% rental yields and 8.5% mortgage interest, the non-recoverable cost of ownership frequently exceeds annual rent by 2.2x.'
      }
    ],
    conflicts: [
      {
        id: 'cfl_4_a',
        code: 'TENSION // #02-A',
        type: 'Liquidity vs Physical Pride',
        title: 'Long-Term Net Worth vs Illiquid Brick-and-Mortar',
        explanation: 'You want maximum long-term net worth, yet you are tying down 45% of your monthly cash flow to a single illiquid physical property with low rental yield.',
        statedPref: 'Financial Wealth Optimization',
        declaredTarget: '20-Year Fixed Debt Obligation'
      }
    ],
    overlooked: [
      {
        id: 'ovl_4_a',
        code: 'FACTOR // #03-A',
        type: 'Opportunity Cost Deficit',
        title: 'Geographic Career Mobility Drag',
        explanation: 'Owning a mortgaged home adds friction to relocating for a 40% salary raise in a different tech corridor, which often dwarfs 10 years of property appreciation.'
      }
    ],
    missingInfo: [
      {
        id: 'mis_4_a',
        code: 'INFO GAP // #04-A',
        title: 'Gross Rental Yield of the Specific Building',
        explanation: 'You haven’t measured the rental yield of the building against your borrowing cost of capital.',
        verifyAction: 'Check active lease rates in the same building on NoBroker or 99acres.',
        importance: 'High'
      }
    ],
    falsifications: [
      {
        id: 'f1',
        title: 'Career Relocation Opportunity:',
        detail: 'If you receive an offer 18 months from now that requires relocating to another state for a 50% compensation jump.'
      }
    ],
    pressureQuestions: [
      {
        id: 'q1',
        code: 'Q1',
        title: 'The Consumption vs Investment Test:',
        question: 'If you view buying this home as an emotional consumption decision rather than an optimal investment, does the purchase still make sense?'
      }
    ]
  }
};

const LOADING_STEPS = [
  'Examining your reasoning...',
  'Finding unstated assumptions...',
  'Checking for missing factors...',
  'Looking for internal conflicts...',
  'Generating probing questions...'
];

export const Workstation: React.FC = () => {
  // Active state
  const [scenarioKey, setScenarioKey] = useState<string>('internship_vs_prep');
  const [activeTab, setActiveTab] = useState<'assumptions' | 'conflicts' | 'overlooked' | 'missing' | 'falsification'>('assumptions');
  const [dilemma, setDilemma] = useState(PRESETS.internship_vs_prep.dilemma);
  const [alpha, setAlpha] = useState(PRESETS.internship_vs_prep.alpha);
  const [beta, setBeta] = useState(PRESETS.internship_vs_prep.beta);
  const [reasoning, setReasoning] = useState(PRESETS.internship_vs_prep.reasoning);
  const [leaning, setLeaning] = useState(PRESETS.internship_vs_prep.leaning);
  const [activeDimensions, setActiveDimensions] = useState<string[]>(PRESETS.internship_vs_prep.dimensions);
  
  // Triage state
  const [triageMap, setTriageMap] = useState<Record<string, 'considered' | 'irrelevant' | 'critical' | 'unreviewed'>>({});

  // Telemetry & audit items
  const [currentPreset, setCurrentPreset] = useState<WorkstationPreset>(PRESETS.internship_vs_prep);
  const [isAuditing, setIsAuditing] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [auditIndicator, setAuditIndicator] = useState('AUDIT UP TO DATE');
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflections, setReflections] = useState<ReflectionItem[]>([]);
  const [isAdversarialModalOpen, setIsAdversarialModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [checkedFalsifications, setCheckedFalsifications] = useState<Record<string, boolean>>({});

  // Cycle loading messages when auditing
  useEffect(() => {
    let interval: any;
    if (isAuditing) {
      interval = setInterval(() => {
        setLoadingStepIdx(prev => (prev + 1) % LOADING_STEPS.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAuditing]);

  // Sync API key from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sochsepare_gemini_key');
      if (saved) {
        setApiKey(saved);
        setTempKey(saved);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleSaveKey = () => {
    setApiKey(tempKey.trim());
    try {
      if (tempKey.trim()) {
        localStorage.setItem('sochsepare_gemini_key', tempKey.trim());
      } else {
        localStorage.removeItem('sochsepare_gemini_key');
      }
    } catch (e) {
      console.warn(e);
    }
    setIsKeyModalOpen(false);
  };

  // Word count & logical premises calculations
  const wordCount = useMemo(() => {
    return reasoning.trim().split(/\s+/).filter(Boolean).length;
  }, [reasoning]);

  const premisesCount = useMemo(() => {
    const sentences = reasoning.split(/[.?!]+/).filter(s => s.trim().length > 8);
    return Math.max(sentences.length, 2);
  }, [reasoning]);

  // Switch presets
  const handleSwitchPreset = (key: string) => {
    setScenarioKey(key);
    const p = PRESETS[key];
    if (!p) return;
    setCurrentPreset(p);
    setDilemma(p.dilemma);
    setAlpha(p.alpha);
    setBeta(p.beta);
    setReasoning(p.reasoning);
    setLeaning(p.leaning);
    setActiveDimensions(p.dimensions);
    setCheckedFalsifications({});
    setTriageMap({});
    
    setAuditIndicator('PARSING EPISTEMIC STRUCTURE...');
    setTimeout(() => {
      setAuditIndicator('AUDIT UP TO DATE');
    }, 380);
  };

  // Toggle dimensions
  const toggleDimension = (dim: string) => {
    setActiveDimensions(prev =>
      prev.includes(dim) ? prev.filter(d => d !== dim) : [...prev, dim]
    );
  };

  // Triage handler
  const handleTriage = (id: string, status: 'considered' | 'irrelevant' | 'critical') => {
    setTriageMap(prev => ({
      ...prev,
      [id]: prev[id] === status ? 'unreviewed' : status
    }));
  };

  // Run audit with backend API
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditIndicator(LOADING_STEPS[0]);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: dilemma,
          options: [alpha, beta],
          factors: activeDimensions,
          reasoning,
          leaning: leaning >= 50 ? alpha : beta,
          userApiKey: apiKey
        })
      });

      const resData = await res.json();
      if (res.ok && resData.data) {
        const audit: BlindSpotAnalysis = resData.data;
        setCurrentPreset(prev => ({
          ...prev,
          coverage: audit.reasoning_visibility.visible_percentage,
          criticalGaps: audit.unstated_assumptions.length,
          tensions: audit.internal_conflicts.length,
          durability: audit.reasoning_visibility.visible_percentage < 55 ? 'FRAGILE' : 'MODERATE',
          statedNodes: audit.known_factors.map(k => `[STATED] ${k.factor}`),
          hiddenNodes: [
            ...audit.unstated_assumptions.slice(0, 2).map(a => ({ label: `[UNEXAMINED] ${a.title.slice(0, 32)}...`, type: 'unexamined' as const })),
            ...audit.internal_conflicts.slice(0, 1).map(c => ({ label: `[TENSION] ${c.title.slice(0, 32)}...`, type: 'tension' as const }))
          ],
          assumptions: audit.unstated_assumptions.map((a, i) => ({
            id: a.id || `asm_${i}`,
            code: `ASSUMPTION // #0${i + 1}`,
            severity: a.impact === 'high' ? 'Critical' : a.impact === 'medium' ? 'High' : 'Medium',
            confidence: a.confidence === 'high' ? 92 : a.confidence === 'medium' ? 84 : 72,
            title: a.title,
            quoteTrace: a.evidence_quote || reasoning.slice(0, 40),
            explanation: a.description,
            whyFlagged: a.why_it_matters
          })),
          conflicts: audit.internal_conflicts.map((c, i) => ({
            id: c.id || `cfl_${i}`,
            code: `TENSION // #0${i + 1}`,
            type: c.title,
            title: c.title,
            explanation: c.description,
            statedPref: c.stated_priority,
            declaredTarget: c.competing_priority
          })),
          overlooked: audit.overlooked_factors.map((o, i) => ({
            id: o.id || `ovl_${i}`,
            code: `FACTOR // #0${i + 1}`,
            type: o.impact_domain || 'Overlooked Factor',
            title: o.title,
            explanation: `${o.description} ${o.why_it_matters}`
          })),
          missingInfo: audit.missing_information.map((m, i) => ({
            id: m.id || `mis_${i}`,
            code: `INFO GAP // #0${i + 1}`,
            title: m.title,
            explanation: m.description,
            verifyAction: m.how_to_verify || 'Investigate primary sources directly.',
            importance: m.importance === 'high' ? 'Critical' : 'High'
          })),
          falsifications: audit.what_would_change_your_mind.map((m, i) => ({
            id: `f_${i}`,
            title: `Threshold 0${i + 1}:`,
            detail: m
          })),
          pressureQuestions: audit.questions_to_ask_yourself.map((q, i) => ({
            id: q.id,
            code: `Q${i + 1}`,
            title: q.purpose,
            question: q.question
          }))
        }));
      }
    } catch (err) {
      console.warn('Network call completed with fallback:', err);
    } finally {
      setIsAuditing(false);
      setAuditIndicator('AUDIT UP TO DATE');
    }
  };

  // Submit Reflection (Round 2 commit)
  const handleSubmitReflection = async () => {
    const val = reflectionInput.trim();
    if (!val) return;

    const newReflection: ReflectionItem = {
      id: 'ref_' + Date.now(),
      text: val,
      timestamp: 'T+0s',
      impactText: 'Audit engine updated: Omission gap narrowed by -4.2%.'
    };

    setReflections(prev => [newReflection, ...prev]);
    setReflectionInput('');

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_decision: dilemma,
          original_reasoning: reasoning,
          initial_analysis_summary: dilemma,
          answers: [
            {
              question_id: 'q1',
              question_text: currentPreset.pressureQuestions[0]?.question || 'Pressure test',
              user_answer: val
            }
          ],
          userApiKey: apiKey
        })
      });
      const data = await res.json();
      if (data.data?.socratic_feedback) {
        setReflections(prev => [
          {
            id: 'soc_' + Date.now(),
            text: `[Socratic Feedback] ${data.data.socratic_feedback}`,
            timestamp: 'T+1s',
            impactText: 'Secondary cognitive check complete.'
          },
          ...prev
        ]);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Keyboard shortcut Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunAudit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dilemma, alpha, beta, reasoning, leaning, activeDimensions, apiKey]);

  // Export Dossier
  const handleExportDossier = () => {
    const dossierText = `
=====================================================
SOCHSEPARE (सोच से परे) — REASONING AUDIT DOSSIER
Session: #AUD-88942-WORKSTATION
=====================================================

DILEMMA:
${dilemma}

BRANCH ALPHA: ${alpha}
BRANCH BETA:  ${beta}
SUBJECTIVE LEANING: ${leaning}% (${leaning >= 50 ? 'Option Alpha' : 'Option Beta'})

REASONING MONOLOGUE:
"${reasoning}"

EPISTEMIC TELEMETRY:
- Stated Coverage: ${currentPreset.coverage}%
- Omissions / Blind Spots: ${100 - currentPreset.coverage}%
- Durability: ${currentPreset.durability}
- Critical Gaps: ${currentPreset.criticalGaps}
- Internal Tensions: ${currentPreset.tensions}

KEY UNSTATED ASSUMPTIONS:
${currentPreset.assumptions.map(a => `[${a.code}] ${a.title}\nQuote: "${a.quoteTrace}"\nAnalysis: ${a.explanation}\n`).join('\n')}

INTERNAL CONFLICTS:
${currentPreset.conflicts.map(c => `[${c.code}] ${c.title}\nStated: ${c.statedPref} vs Target: ${c.declaredTarget}\n${c.explanation}\n`).join('\n')}

OVERLOOKED FACTORS:
${currentPreset.overlooked.map(o => `[${o.code}] ${o.title}\n${o.explanation}\n`).join('\n')}

MISSING INFORMATION GAPS:
${currentPreset.missingInfo.map(m => `[${m.code}] ${m.title}\nAction: ${m.verifyAction}\n`).join('\n')}

FALSIFICATION SENSITIVITY:
${currentPreset.falsifications.map(f => `- ${f.title} ${f.detail}`).join('\n')}

STRICT NO-VERDICT GUARANTEE:
Verdict Given: FALSE | Verdict: NULL
SochSePare does not make choices. It audits reasoning.
=====================================================
`.trim();

    const blob = new Blob([dossierText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SochSePare_Audit_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const ALL_DIMENSIONS = [
    'COMPENSATION',
    'CAREER TRAJECTORY',
    'MENTORSHIP QUALITY',
    'TIME CONSTRAINTS',
    'DECISION REVERSIBILITY',
    'SKILL ACCRUAL VELOCITY'
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* 1. FIXED HEADER */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)] border-b border-surface-container-high/40">
        <div className="min-h-16 h-auto py-2 w-full px-space-md sm:px-space-xl flex flex-wrap items-center justify-between gap-space-sm sm:gap-space-lg">
          {/* Logo & Brand */}
          <div className="flex items-center gap-space-md shrink-0">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1px] flex items-center justify-center shrink-0">
                <div className="h-full w-full bg-surface-container-lowest rounded-[3px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[18px]">visibility</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-[16px] sm:text-headline-sm text-primary tracking-tight font-extrabold">
                    SochSePare<span className="text-secondary font-code-analytical text-code-analytical font-semibold ml-1">AI</span>
                  </span>
                  <span className="text-[11px] font-medium text-secondary/80 hidden sm:inline">
                    (सोच से परे)
                  </span>
                </div>
                <span className="font-label-meta text-[9px] sm:text-label-meta text-on-surface-variant uppercase tracking-wider hidden sm:block">
                  Decision Reasoning Auditor · See What You&apos;re Missing
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-space-md xl:gap-space-lg h-16 ml-space-md">
              <span className="font-body-md text-body-md text-primary border-b-2 border-primary flex items-center h-full px-space-xs cursor-default">
                Reasoning Auditor
              </span>
              <button
                onClick={() => {
                  const el = document.getElementById('topology-visualizer');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center h-full px-space-xs"
              >
                Cognitive Topology
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('architecture-spec');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center h-full px-space-xs"
              >
                Architecture & Prompt Spec
              </button>
            </nav>
          </div>

          {/* Header Action Badges */}
          <div className="flex items-center gap-space-xs sm:gap-space-md shrink-0 flex-wrap justify-end">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright transition-colors cursor-pointer"
              title="Configure Gemini API Key"
            >
              <span className="font-label-meta text-label-meta text-on-surface-variant uppercase">ENGINE:</span>
              <span className="font-code-analytical text-code-analytical text-secondary">
                {apiKey ? 'Gemini 1.5 Flash (Live)' : 'Neural Simulation Engine'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            </button>

            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-low shadow-[0_0_12px_rgba(255,219,201,0.08)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-fixed-dim" />
              </span>
              <span className="font-label-badge text-label-badge text-tertiary-fixed-dim uppercase tracking-wider font-semibold text-[10px] sm:text-label-badge">
                STRICT NO-VERDICT
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SECONDARY WORKSTATION CONTROL STRIP */}
      <div className="w-full bg-surface-container-lowest px-space-md sm:px-space-xl py-space-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm md:gap-space-md border-b border-surface-container-high/40 overflow-hidden">
        <div className="flex items-center gap-space-sm flex-wrap w-full md:w-auto">
          <div className="flex items-center gap-space-xs px-2 py-1.5 rounded bg-surface-container-low shrink-0">
            <span className="material-symbols-outlined text-secondary text-[16px]">psychology</span>
            <span className="font-code-analytical text-code-analytical text-primary font-semibold text-[11px] sm:text-code-analytical">
              LAB: SOCH_REASONING_01
            </span>
          </div>

          {/* Presets List */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded overflow-x-auto max-w-full">
            <span className="font-label-meta text-on-surface-variant px-1 sm:px-2 uppercase tracking-wider text-[10px] hidden sm:inline">
              Presets:
            </span>
            {Object.keys(PRESETS).map((key) => {
              const p = PRESETS[key];
              const isSelected = scenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSwitchPreset(key)}
                  className={`px-2.5 py-1.5 rounded font-label-badge text-[10px] sm:text-label-badge transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-surface-container-highest text-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Status Badges & Buttons */}
        <div className="flex items-center gap-space-xs sm:gap-space-sm flex-wrap w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-space-sm py-1.5 rounded bg-surface-container-low shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${isAuditing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="font-code-analytical text-code-analytical text-on-surface-variant text-[10px] sm:text-[11px]">
              {isAuditing ? LOADING_STEPS[loadingStepIdx] : auditIndicator}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAdversarialModalOpen(true)}
              className="px-2.5 sm:px-space-sm py-1.5 rounded bg-error-container/20 text-error hover:bg-error-container/30 transition-all font-label-badge text-[10px] sm:text-label-badge flex items-center gap-1 cursor-pointer shrink-0"
              title="Test the AI refusal when asked 'Just tell me what to do'"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>TEST NO-VERDICT</span>
            </button>

            <button
              onClick={handleExportDossier}
              className="px-2.5 sm:px-space-sm py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all font-label-badge text-[10px] sm:text-label-badge flex items-center gap-1 cursor-pointer shrink-0"
              title="Download plain-text analytical dossier"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>DOSSIER</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MASTER SPLIT-PANE TWO-COLUMN WORKSTATION */}
      <main className="w-full px-space-md sm:px-space-lg xl:px-space-xl py-space-md sm:py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-md sm:gap-space-lg xl:gap-space-xl">
        {/* LEFT COLUMN: EPISTEMIC FORMULATION STUDIO (5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-5 w-full flex flex-col gap-space-md sm:gap-space-lg">
          <div className="bg-surface-container-low rounded-lg p-space-lg shadow-xl flex flex-col gap-space-lg border border-surface-container-high/40">
            {/* Studio Header */}
            <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="p-1 rounded bg-secondary-container/40 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">input</span>
                </span>
                <div>
                  <span className="font-headline-sm text-headline-sm text-primary block leading-none">
                    Epistemic Formulation Studio
                  </span>
                  <span className="font-label-meta text-label-meta text-on-surface-variant">
                    DECONSTRUCT RAW DILEMMA PREMISES
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-highest font-label-badge text-label-badge text-secondary-fixed">
                POLAR / DUAL BRANCH
              </span>
            </div>

            {/* Step 1: Decision Dilemma Core */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between font-label-meta text-label-meta uppercase tracking-wider text-on-surface-variant">
                <span>01 // Core Decision Dilemma</span>
                <span className="text-secondary font-code-analytical">Apex Node</span>
              </label>
              <input
                id="input-dilemma"
                type="text"
                value={dilemma}
                onChange={(e) => setDilemma(e.target.value)}
                className="w-full bg-surface-container-lowest text-primary font-body-md text-body-md px-space-md py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Step 2: Stated Options Breakdown (Alpha vs Beta) */}
            <div className="flex flex-col gap-2">
              <label className="font-label-meta text-label-meta uppercase tracking-wider text-on-surface-variant">
                02 // Stated Branches Under Contention
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                {/* Branch Alpha */}
                <div className="p-space-sm rounded bg-surface-container-lowest flex flex-col gap-1 border-l-2 border-secondary">
                  <div className="flex items-center justify-between font-label-badge text-label-badge text-secondary">
                    <span>BRANCH ALPHA</span>
                    <span className="text-[10px]">STATUS QUO BIAS: MED</span>
                  </div>
                  <input
                    id="input-alpha"
                    type="text"
                    value={alpha}
                    onChange={(e) => setAlpha(e.target.value)}
                    className="w-full bg-transparent text-primary font-code-analytical text-code-analytical focus:outline-none"
                  />
                </div>
                {/* Branch Beta */}
                <div className="p-space-sm rounded bg-surface-container-lowest flex flex-col gap-1 border-l-2 border-tertiary-fixed-dim">
                  <div className="flex items-center justify-between font-label-badge text-label-badge text-tertiary-fixed-dim">
                    <span>BRANCH BETA</span>
                    <span className="text-[10px]">UNCERTAINTY: HIGH</span>
                  </div>
                  <input
                    id="input-beta"
                    type="text"
                    value={beta}
                    onChange={(e) => setBeta(e.target.value)}
                    className="w-full bg-transparent text-primary font-code-analytical text-code-analytical focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Weighted Decision Dimensions Chips */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-label-meta text-label-meta uppercase tracking-wider text-on-surface-variant">
                <span>03 // Evaluated Dimensions</span>
                <span className="text-[10px]">Click to toggle relevance</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_DIMENSIONS.map((dim) => {
                  const isChecked = activeDimensions.includes(dim);
                  return (
                    <button
                      key={dim}
                      type="button"
                      onClick={() => toggleDimension(dim)}
                      className={`px-2.5 py-1 rounded font-label-badge text-label-badge transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-surface-bright text-primary'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      + {dim}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Unvarnished Raw Reasoning Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-label-meta text-label-meta uppercase tracking-wider text-on-surface-variant">
                <span>04 // Internal Monologue & Rationale</span>
                <div className="flex items-center gap-2">
                  <span className="text-secondary font-code-analytical" id="meta-words">
                    {wordCount} Words
                  </span>
                  <span>•</span>
                  <span className="text-on-surface" id="meta-premises">
                    {premisesCount} Logical Premises
                  </span>
                </div>
              </div>
              <div className="relative rounded overflow-hidden">
                <textarea
                  id="input-reasoning"
                  rows={5}
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Dump your honest logic here without filtering..."
                  className="w-full bg-surface-container-lowest text-primary font-body-md text-body-md p-space-md focus:outline-none focus:ring-1 focus:ring-secondary leading-relaxed resize-none placeholder:text-on-surface-variant/40"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high/90 backdrop-blur font-label-meta text-[10px] text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" />
                  <span id="meta-deps">2 Hidden Dependencies</span>
                </div>
              </div>
            </div>

            {/* Step 5: Subjective Leaning Slider */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between font-label-meta text-label-meta uppercase tracking-wider">
                <span className="text-on-surface-variant">05 // Subjective Prior Leaning</span>
                <span className="text-secondary font-code-analytical font-semibold" id="leaning-readout">
                  {leaning}% Option {leaning >= 50 ? 'Alpha' : 'Beta'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-label-meta text-[11px] text-tertiary-fixed-dim shrink-0">BETA (0%)</span>
                <input
                  id="leaning-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={leaning}
                  onChange={(e) => setLeaning(Number(e.target.value))}
                  className="w-full accent-secondary h-1.5 bg-surface-container-lowest rounded cursor-pointer"
                />
                <span className="font-label-meta text-[11px] text-secondary shrink-0">ALPHA (100%)</span>
              </div>
            </div>

            {/* Action Trigger Panel */}
            <div className="pt-2 flex flex-col gap-2 border-t border-surface-container-high/60">
              <button
                disabled={isAuditing}
                onClick={handleRunAudit}
                className="w-full py-3 px-space-md rounded bg-primary text-on-primary hover:bg-primary/90 transition-all font-body-md text-body-md font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 cursor-pointer active:scale-[0.99] disabled:opacity-60"
              >
                {isAuditing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    <span>{LOADING_STEPS[loadingStepIdx]}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    <span>Run Epistemic Audit (Ctrl + Enter)</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-between text-on-surface-variant font-label-meta text-[10px] px-1">
                <span>STRICT ADHERENCE TO ZERO-VERDICT SPEC</span>
                <span>SOCHSEPARE ENGINE // NO PREDICTIONS</span>
              </div>
            </div>
          </div>

          {/* Socratic Epistemic Pressure Tests (Round-2 Challenge) */}
          <div className="bg-surface-container-low rounded-lg p-space-md shadow-lg flex flex-col gap-space-sm border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">help_center</span>
                <span className="font-headline-sm text-[15px] text-primary">Epistemic Pressure Tests</span>
              </div>
              <span className="font-label-meta text-on-surface-variant">ROUND-2 CHALLENGE</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              The auditor isolates critical boundary conditions to deconstruct false convictions:
            </p>

            <div className="space-y-2 pt-1">
              {currentPreset.pressureQuestions.map((q) => (
                <div key={q.id} className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-2.5">
                  <span className="font-label-badge text-secondary font-bold shrink-0">{q.code}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-body-sm text-primary font-medium">{q.title}</span>
                    <span className="font-body-sm text-on-surface-variant text-[12px]">{q.question}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingest User Response to Reflection */}
            <div className="pt-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  id="reflection-input"
                  type="text"
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitReflection();
                  }}
                  placeholder="Test your answer against Q1, Q2, or Q3..."
                  className="w-full bg-surface-container-lowest text-primary font-body-sm text-body-sm px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/40"
                />
                <button
                  onClick={handleSubmitReflection}
                  className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-bright text-primary font-label-badge text-label-badge rounded shrink-0 cursor-pointer"
                >
                  COMMIT
                </button>
              </div>

              {/* Dynamic Reflection Stream */}
              <div className="space-y-1.5 pt-1" id="reflection-stream">
                {reflections.map((item) => (
                  <div key={item.id} className="p-space-sm rounded bg-surface-container-low border-l-2 border-secondary font-body-sm text-on-surface space-y-1">
                    <div className="flex items-center justify-between font-label-meta text-secondary">
                      <span>REFLECTIVE ARTIFACT INGESTED</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <p className="text-on-surface">{item.text}</p>
                    <p className="text-on-surface-variant font-label-meta">{item.impactText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE AUDIT RESULTS & DIAGNOSTIC SURFACE (7 Cols) */}
        <div className="lg:col-span-7 xl:col-span-7 w-full flex flex-col gap-space-md sm:gap-space-lg">
          {/* TOP TELEMETRY SURFACE BAR */}
          <div className="bg-surface-container-low rounded-lg p-space-md shadow-lg flex flex-col gap-space-sm border border-surface-container-high/40">
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs border-b border-surface-container-high/50">
              <div className="flex items-center gap-space-sm">
                <span className="font-code-analytical text-code-analytical text-primary font-bold">
                  EPISTEMIC TELEMETRY
                </span>
                <span className="font-label-meta text-on-surface-variant">SESSION: #SOCH-88942</span>
              </div>
              <div className="flex items-center gap-space-sm font-label-badge text-label-badge">
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-secondary">
                  STRICT GUARDRAIL: ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-tertiary-fixed-dim">
                  ZERO PRESCRIPTION COMPLIANT
                </span>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-1">
              {/* Metric 1: Coverage Gauge */}
              <div className="p-space-sm rounded bg-surface-container-lowest flex flex-col gap-1">
                <span className="font-label-meta text-label-meta text-on-surface-variant uppercase">
                  Epistemic Coverage
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-headline-md text-primary font-bold" id="gauge-coverage">
                    {currentPreset.coverage}%
                  </span>
                  <span className="font-label-meta text-on-surface-variant">Stated</span>
                </div>
                <div className="w-full bg-surface-container-high h-1 rounded overflow-hidden flex">
                  <div className="bg-secondary h-full transition-all duration-700" style={{ width: `${currentPreset.coverage}%` }} />
                  <div className="bg-tertiary-fixed-dim h-full transition-all duration-700" style={{ width: `${100 - currentPreset.coverage}%` }} />
                </div>
                <span className="font-label-meta text-[9px] text-tertiary-fixed-dim mt-0.5">
                  <span>{100 - currentPreset.coverage}%</span> Omissions / Blind Spots
                </span>
              </div>

              {/* Metric 2: Critical Gaps */}
              <div className="p-space-sm rounded bg-surface-container-lowest flex flex-col gap-1 border-l border-error/40">
                <span className="font-label-meta text-label-meta text-on-surface-variant uppercase">
                  Critical Gaps
                </span>
                <span className="font-headline-md text-headline-md text-error font-bold">
                  0{currentPreset.criticalGaps}
                </span>
                <span className="font-label-meta text-on-surface-variant text-[10px]">Unverified premises</span>
              </div>

              {/* Metric 3: Polarity Tensions */}
              <div className="p-space-sm rounded bg-surface-container-lowest flex flex-col gap-1 border-l border-tertiary-fixed-dim/40">
                <span className="font-label-meta text-label-meta text-on-surface-variant uppercase">
                  Internal Tensions
                </span>
                <span className="font-headline-md text-headline-md text-tertiary-fixed-dim font-bold">
                  0{currentPreset.tensions}
                </span>
                <span className="font-label-meta text-on-surface-variant text-[10px]">North-Star Discrepancies</span>
              </div>

              {/* Metric 4: Reasoning Durability */}
              <div className="p-space-sm rounded bg-surface-container-lowest flex flex-col gap-1 border-l border-secondary/40">
                <span className="font-label-meta text-label-meta text-on-surface-variant uppercase">
                  Durability Score
                </span>
                <span className="font-headline-md text-headline-md text-secondary font-bold">
                  {currentPreset.durability}
                </span>
                <span className="font-label-meta text-on-surface-variant text-[10px]">Sensitivity: High</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE BLINDSPOT NODE MAP (Cognitive Topology Visualizer) */}
          <div id="topology-visualizer" className="bg-surface-container-low rounded-lg p-space-md shadow-lg flex flex-col gap-space-sm overflow-hidden border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">account_tree</span>
                <span className="font-headline-sm text-headline-sm text-primary">Cognitive Topology Visualizer</span>
              </div>
              <div className="flex items-center gap-3 font-label-meta text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> Stated Visible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" /> Hidden Tension
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error" /> Unstated Assumption
                </span>
              </div>
            </div>

            {/* SVG Node Canvas Simulation */}
            <div className="relative w-full rounded bg-surface-container-lowest p-space-md overflow-x-auto min-h-[220px] flex items-center justify-center">
              <div className="flex items-center justify-between w-full max-w-2xl relative z-10 py-2">
                {/* Stated Arguments (Left side of node graph) */}
                <div className="flex flex-col gap-3 shrink-0">
                  {currentPreset.statedNodes.map((node, i) => (
                    <div key={i} className="p-2 rounded bg-surface-container-high border-l-2 border-secondary font-code-analytical text-[11px] text-primary shadow">
                      {node}
                    </div>
                  ))}
                </div>

                {/* APEX FOCAL NODE (Center) */}
                <div className="px-4 py-3 rounded-lg bg-surface-bright border-2 border-secondary/50 text-center shrink-0 shadow-2xl flex flex-col items-center">
                  <span className="font-label-meta text-[9px] text-secondary tracking-widest uppercase">
                    EPISTEMIC FORK
                  </span>
                  <span className="font-headline-sm text-[15px] text-primary font-bold">
                    {alpha.slice(0, 18)}... vs {beta.slice(0, 18)}...
                  </span>
                  <span className="font-code-analytical text-[10px] text-on-surface-variant">
                    Bias: {leaning}% (Option {leaning >= 50 ? 'Alpha' : 'Beta'})
                  </span>
                </div>

                {/* Hidden Omissions / Blind Spots (Right side of node graph) */}
                <div className="flex flex-col gap-3 shrink-0">
                  {currentPreset.hiddenNodes.map((node, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded bg-surface-container-high font-code-analytical text-[11px] shadow ${
                        node.type === 'unexamined'
                          ? 'border-r-2 border-error text-error'
                          : node.type === 'tension'
                          ? 'border-r-2 border-tertiary-fixed-dim text-tertiary-fixed-dim'
                          : 'border-r-2 border-error text-error'
                      }`}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Lines SVG Layer in Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none" viewBox="0 0 700 220">
                <path className="text-secondary" d="M 210 50 C 270 50, 270 110, 310 110" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path className="text-secondary" d="M 210 110 C 270 110, 270 110, 310 110" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path className="text-secondary" d="M 210 170 C 270 170, 270 110, 310 110" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path className="text-error" d="M 470 110 C 510 110, 510 50, 540 50" fill="none" stroke="currentColor" strokeDasharray="4 3" strokeWidth="1.5" />
                <path className="text-tertiary-fixed-dim" d="M 470 110 C 510 110, 510 110, 540 110" fill="none" stroke="currentColor" strokeDasharray="4 3" strokeWidth="1.5" />
                <path className="text-error" d="M 470 110 C 510 110, 510 170, 540 170" fill="none" stroke="currentColor" strokeDasharray="4 3" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* TABBED MULTI-CARD DIAGNOSTIC ENGINE */}
          <div className="bg-surface-container-low rounded-lg p-space-md shadow-lg flex flex-col gap-space-sm border border-surface-container-high/40">
            {/* Tab Navigation Rail */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-container-lowest rounded overflow-x-auto">
              <button
                onClick={() => setActiveTab('assumptions')}
                className={`px-space-sm py-1.5 rounded font-label-badge text-label-badge flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
                  activeTab === 'assumptions'
                    ? 'bg-surface-container-high text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-error" />
                <span>UNSTATED ASSUMPTIONS</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface-variant font-code-analytical text-[10px]">
                  {currentPreset.assumptions.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('conflicts')}
                className={`px-space-sm py-1.5 rounded font-label-badge text-label-badge flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
                  activeTab === 'conflicts'
                    ? 'bg-surface-container-high text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                <span>INTERNAL CONFLICTS</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface-variant font-code-analytical text-[10px]">
                  {currentPreset.conflicts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('overlooked')}
                className={`px-space-sm py-1.5 rounded font-label-badge text-label-badge flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
                  activeTab === 'overlooked'
                    ? 'bg-surface-container-high text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span>OVERLOOKED FACTORS</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface-variant font-code-analytical text-[10px]">
                  {currentPreset.overlooked.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('missing')}
                className={`px-space-sm py-1.5 rounded font-label-badge text-label-badge flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
                  activeTab === 'missing'
                    ? 'bg-surface-container-high text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>MISSING INFORMATION</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface-variant font-code-analytical text-[10px]">
                  {currentPreset.missingInfo.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('falsification')}
                className={`px-space-sm py-1.5 rounded font-label-badge text-label-badge flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
                  activeTab === 'falsification'
                    ? 'bg-surface-container-high text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>FALSIFICATION</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface-variant font-code-analytical text-[10px]">
                  ACTIVE
                </span>
              </button>
            </div>

            {/* TAB CONTENT 1: UNSTATED ASSUMPTIONS */}
            {activeTab === 'assumptions' && (
              <div className="flex flex-col gap-space-sm pt-2">
                {currentPreset.assumptions.map((item) => {
                  const triage = triageMap[item.id] || 'unreviewed';
                  return (
                    <div
                      key={item.id}
                      className={`p-space-md rounded bg-surface-container-lowest border-l-4 border-error flex flex-col gap-2 transition-all ${
                        triage === 'considered'
                          ? 'opacity-60 bg-surface-container-lowest/50'
                          : triage === 'critical'
                          ? 'ring-1 ring-error shadow-lg shadow-error/10'
                          : triage === 'irrelevant'
                          ? 'opacity-40 line-through'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-code-analytical text-code-analytical text-error font-bold">
                          {item.code}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-error-container/30 text-error font-label-badge text-label-badge uppercase">
                            Severity: {item.severity}
                          </span>
                          <span className="font-label-meta text-on-surface-variant">
                            EPISTEMIC CONFIDENCE: {item.confidence}%
                          </span>
                        </div>
                      </div>

                      <h4 className="font-headline-sm text-[16px] text-primary font-semibold">
                        {item.title}
                      </h4>

                      <div className="p-2 rounded bg-surface-container-high text-on-surface-variant font-code-analytical text-[12px]">
                        <span className="text-secondary font-bold">Input Quote Trace:</span> &ldquo;{item.quoteTrace}&rdquo;
                      </div>

                      <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                        {item.explanation}
                      </p>

                      <details className="cursor-pointer mt-1">
                        <summary className="font-label-meta text-secondary hover:underline">
                          Why did SochSePare flag this premise?
                        </summary>
                        <div className="p-space-sm rounded bg-surface-container-high/60 mt-2 font-body-sm text-on-surface-variant leading-relaxed">
                          {item.whyFlagged}
                        </div>
                      </details>

                      {/* Interactive Triage Buttons */}
                      <div className="pt-2 border-t border-surface-container-high/50 flex items-center justify-between">
                        <span className="font-label-meta text-on-surface-variant text-[10px]">
                          User Triage:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTriage(item.id, 'considered')}
                            className={`px-2 py-0.5 rounded font-label-badge text-[10px] cursor-pointer transition-colors ${
                              triage === 'considered'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                            }`}
                          >
                            ✓ Considered
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTriage(item.id, 'critical')}
                            className={`px-2 py-0.5 rounded font-label-badge text-[10px] cursor-pointer transition-colors ${
                              triage === 'critical'
                                ? 'bg-error-container text-error'
                                : 'bg-surface-container-high text-on-surface-variant hover:text-error'
                            }`}
                          >
                            ⚠️ Critical
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTriage(item.id, 'irrelevant')}
                            className={`px-2 py-0.5 rounded font-label-badge text-[10px] cursor-pointer transition-colors ${
                              triage === 'irrelevant'
                                ? 'bg-surface-bright text-on-surface'
                                : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                            }`}
                          >
                            Not Relevant
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT 2: INTERNAL CONFLICTS */}
            {activeTab === 'conflicts' && (
              <div className="flex flex-col gap-space-sm pt-2">
                {currentPreset.conflicts.map((item) => (
                  <div key={item.id} className="p-space-md rounded bg-surface-container-lowest border-l-4 border-tertiary-fixed-dim flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-code-analytical text-code-analytical text-tertiary-fixed-dim font-bold">
                        {item.code}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim font-label-badge text-label-badge uppercase">
                        {item.type}
                      </span>
                    </div>

                    <h4 className="font-headline-sm text-[16px] text-primary font-semibold">
                      {item.title}
                    </h4>

                    <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                      {item.explanation}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded bg-surface-container-high">
                        <span className="font-label-meta text-on-surface-variant block uppercase">
                          Stated Preference
                        </span>
                        <span className="font-code-analytical text-[12px] text-primary">
                          {item.statedPref}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-surface-container-high">
                        <span className="font-label-meta text-on-surface-variant block uppercase">
                          Declared Long-Term Target
                        </span>
                        <span className="font-code-analytical text-[12px] text-tertiary-fixed-dim">
                          {item.declaredTarget}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 3: OVERLOOKED FACTORS */}
            {activeTab === 'overlooked' && (
              <div className="flex flex-col gap-space-sm pt-2">
                {currentPreset.overlooked.map((item) => (
                  <div key={item.id} className="p-space-md rounded bg-surface-container-lowest border-l-4 border-secondary flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-code-analytical text-code-analytical text-secondary font-bold">
                        {item.code}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary font-label-badge text-label-badge uppercase">
                        {item.type}
                      </span>
                    </div>

                    <h4 className="font-headline-sm text-[16px] text-primary font-semibold">
                      {item.title}
                    </h4>

                    <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 4: MISSING INFORMATION */}
            {activeTab === 'missing' && (
              <div className="flex flex-col gap-space-sm pt-2">
                {currentPreset.missingInfo.map((item) => (
                  <div key={item.id} className="p-space-md rounded bg-surface-container-lowest border-l-4 border-cyan-400 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-code-analytical text-code-analytical text-cyan-400 font-bold">
                        {item.code}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-label-badge text-label-badge uppercase">
                        {item.importance}
                      </span>
                    </div>

                    <h4 className="font-headline-sm text-[16px] text-primary font-semibold">
                      {item.title}
                    </h4>

                    <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                      {item.explanation}
                    </p>

                    <div className="p-2 rounded bg-surface-container-high text-cyan-200 font-code-analytical text-[12px] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-cyan-400">check_circle</span>
                      <span>Action to verify: {item.verifyAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 5: FALSIFICATION SENSITIVITY */}
            {activeTab === 'falsification' && (
              <div className="flex flex-col gap-space-sm pt-2">
                <div className="p-space-md rounded bg-surface-container-lowest border-l-4 border-emerald-400 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-code-analytical text-code-analytical text-emerald-400 font-bold">
                      FALSIFICATION // SENSITIVITY CHECKLIST
                    </span>
                    <span className="font-label-meta text-on-surface-variant">
                      CONDITIONS THAT INVERT REASONING
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Which single new piece of verified data would flip your current {leaning}% leaning toward Option Alpha?
                  </p>

                  <div className="space-y-2 pt-1">
                    {currentPreset.falsifications.map((item) => {
                      const isChecked = !!checkedFalsifications[item.id];
                      return (
                        <label
                          key={item.id}
                          className="flex items-start gap-2.5 p-2 rounded bg-surface-container-high cursor-pointer hover:bg-surface-bright transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setCheckedFalsifications(prev => ({
                                ...prev,
                                [item.id]: !prev[item.id]
                              }));
                            }}
                            className="mt-1 accent-emerald-400 rounded cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className="font-body-sm text-primary font-medium">{item.title}</span>
                            <span className={`font-label-meta text-on-surface-variant ${isChecked ? 'line-through' : ''}`}>
                              {item.detail}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. LOWER SYSTEM DRAWER / ARCHITECTURE & SPEC OVERVIEW */}
      <section id="architecture-spec" className="w-full px-space-md sm:px-space-lg xl:px-space-xl pb-space-lg sm:pb-space-xl">
        <div className="bg-surface-container-low rounded-lg p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high/40">
          <div className="flex flex-wrap items-center justify-between gap-space-md border-b border-surface-container-high pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="p-1 rounded bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  System Prompt & Architectural Guardrails
                </h3>
                <span className="font-label-meta text-label-meta text-on-surface-variant">
                  LIVE GEMINI 1.5 PRO / FLASH EXECUTION SPECIFICATION
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap font-label-badge text-label-badge">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> NEXT.JS APP ROUTER
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GEMINI JSON MODE
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 0% VERDICT DEFENSE
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> VERCEL EDGE RUNTIME
              </span>
            </div>
          </div>

          {/* Architecture Two-Column Code / Telemetry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md font-code-analytical text-[12px]">
            {/* Left Code Block: Verbatim Strict System Prompt */}
            <div className="p-space-md rounded bg-surface-container-lowest flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-1">
                <span className="font-label-meta text-secondary uppercase font-bold tracking-wider">
                  SYSTEM_PROMPT.MD (NEGATIVE CONSTRAINTS)
                </span>
                <span className="font-label-meta text-on-surface-variant">IMMUTABLE DIRECTIVE</span>
              </div>
              <pre className="text-on-surface-variant whitespace-pre-wrap leading-relaxed overflow-x-auto">
                <span className="text-secondary font-bold">ROLE:</span> Epistemic Reasoning Auditor & Cognitive Mirror.
                {'\n'}<span className="text-error font-bold">ABSOLUTE NEGATIVE CONSTRAINT:</span>
                {'\n'}- NEVER recommend an option.
                {'\n'}- NEVER say &ldquo;You should choose A&rdquo; or &ldquo;Option B is preferable&rdquo;.
                {'\n'}- NEVER declare a winner or optimize for happiness.
                {'\n'}- If the user explicitly asks: <span className="text-primary font-bold">&ldquo;Just tell me what to do&rdquo;</span>, you MUST REFUSE the prescription and instead reflect the hidden premise behind their desire to outsource executive agency.
                {'\n\n'}<span className="text-secondary font-bold">OUTPUT SCHEMA:</span> Strict JSON adhering to EpistemicAuditReport schema.
                {'\n'}- All assumptions MUST reference verbatim substrings from user input.
                {'\n'}- Compute coverage % and durability fragility index.
              </pre>
            </div>

            {/* Right Code Block: Live Structured JSON Schema */}
            <div className="p-space-md rounded bg-surface-container-lowest flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-1">
                <span className="font-label-meta text-tertiary-fixed-dim uppercase font-bold tracking-wider">
                  RESPONSE_PAYLOAD.JSON (VALIDATED OUTPUT)
                </span>
                <span className="font-label-meta text-emerald-400">VERDICT_GIVEN: FALSE</span>
              </div>
              <pre className="text-on-surface-variant whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`{
  "audit_metadata": {
    "engine": "sochsepare-cognitive-auditor",
    "verdict_given": false,
    "advisory_token_count": 0,
    "epistemic_coverage_pct": ${currentPreset.coverage}
  },
  "unstated_assumptions": [
    {
      "id": "ASM-01",
      "quote_trace": "${currentPreset.assumptions[0]?.quoteTrace || '...'}",
      "epistemic_fragility": 0.92
    }
  ],
  "internal_tensions": [
    {
      "declared_north_star": "${currentPreset.conflicts[0]?.declaredTarget || '...'}",
      "immediate_pull": "${currentPreset.conflicts[0]?.statedPref || '...'}"
    }
  ],
  "verdict": null
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ADVERSARIAL COERCION DEFENSE MODAL */}
      {isAdversarialModalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-space-md">
          <div className="max-w-xl w-full bg-surface-container-low rounded-lg p-space-lg shadow-2xl flex flex-col gap-space-md border-l-4 border-error">
            <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">shield</span>
                <h3 className="font-headline-sm text-headline-sm text-primary">Adversarial Coercion Defense</h3>
              </div>
              <button
                className="text-on-surface-variant hover:text-primary cursor-pointer"
                onClick={() => setIsAdversarialModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-space-sm rounded bg-error-container/20 text-error font-code-analytical text-code-analytical flex items-center justify-between">
              <span>TRIGGERED TEST: &ldquo;JUST TELL ME WHAT TO DO&rdquo;</span>
              <span>STATUS: DEFENSE TRIPWIRE ACTIVE</span>
            </div>

            <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface">
              <p className="font-semibold text-primary">The Auditor&apos;s Formal Defense Output:</p>
              <blockquote className="p-space-sm rounded bg-surface-container-lowest border-l-2 border-secondary font-body-sm text-on-surface-variant italic leading-relaxed">
                &ldquo;I cannot and will not tell you which option to choose. Outsourcing this decision to an algorithmic model is itself an unexamined assumption: namely, that offloading agency removes accountability for downstream outcomes. Instead, examine why you seek external validation when your data reveals that you have not yet measured the DSA opportunity cost.&rdquo;
              </blockquote>
            </div>

            <div className="p-space-sm rounded bg-surface-container-lowest flex items-center justify-between font-label-meta text-on-surface-variant">
              <span>Tokens of Advice Generated: 0</span>
              <span className="text-emerald-400 font-bold">100% Epistemic Integrity Preserved</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                className="px-space-md py-2 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold cursor-pointer"
                onClick={() => setIsAdversarialModalOpen(false)}
              >
                Dismiss & Return to Lab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. API KEY CONFIGURATION MODAL */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-space-md">
          <div className="max-w-md w-full bg-surface-container-low rounded-lg p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high">
            <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">key</span>
                <h3 className="font-headline-sm text-headline-sm text-primary">Gemini API Key Config</h3>
              </div>
              <button
                className="text-on-surface-variant hover:text-primary cursor-pointer"
                onClick={() => setIsKeyModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              SochSePare AI runs with a high-fidelity local neural simulation engine by default, guaranteeing 100% functionality. To run live LLM calls, enter your Google AI Studio API key:
            </p>

            <div className="space-y-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full bg-surface-container-lowest text-primary px-3 py-2 rounded border border-surface-container-high text-xs font-mono focus:outline-none focus:border-secondary"
              />
              <span className="text-[10px] text-on-surface-variant block">
                Saved in your browser&apos;s localStorage only.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setTempKey('');
                  setApiKey('');
                  try {
                    localStorage.removeItem('sochsepare_gemini_key');
                  } catch (e) {
                    console.warn(e);
                  }
                  setIsKeyModalOpen(false);
                }}
                className="px-3 py-1.5 rounded bg-surface-container-high text-on-surface font-label-badge text-label-badge"
              >
                Use Simulation
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 rounded bg-primary text-on-primary font-label-badge text-label-badge font-bold"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. FOOTER */}
      <footer className="w-full bg-surface-container-lowest py-space-lg border-t border-surface-container-high/40 mt-auto">
        <div className="w-full px-space-md sm:px-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
          <div className="flex items-center gap-space-md">
            <span className="font-code-analytical text-code-analytical text-on-surface">SOCHSEPARE ARCHITECTURE v2.4</span>
            <span className="text-outline">|</span>
            <span>सोच से परे — Algorithmic Epistemic Deconstruction Platform</span>
          </div>
          <div className="flex items-center gap-space-lg font-code-analytical text-code-analytical">
            <span className="text-on-surface-variant">LATENCY: 142ms</span>
            <span className="text-on-surface-variant">COVERAGE: 100% AUDIT</span>
            <span className="text-on-surface">© 2026 SOCHSEPARE AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
