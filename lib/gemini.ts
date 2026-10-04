import { BlindSpotAnalysis, DecisionInput, FollowUpRequest, FollowUpAnalysis } from '@/types/blindspot';
import { BLINDSPOT_SYSTEM_PROMPT, FOLLOWUP_SYSTEM_PROMPT } from './prompt';
import { PRESET_SCENARIOS } from './presets';

/**
 * Clean and parse raw JSON from Gemini API response
 */
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/i, '');
  }
  return cleaned.trim();
}

/**
 * Synthesizes a high-fidelity audit for custom decisions when no API key is provided
 */
function generateHeuristicAudit(input: DecisionInput): BlindSpotAnalysis {
  // Check if input matches an existing preset
  const lowerDesc = (input.decision + ' ' + input.reasoning).toLowerCase();
  
  if (lowerDesc.includes('intern') || lowerDesc.includes('stipend') || lowerDesc.includes('placement')) {
    const preset = PRESET_SCENARIOS.find(p => p.id === 'internship')!;
    return {
      ...preset.precomputedAudit,
      id: 'audit-heuristic-' + Date.now(),
      decision_summary: input.decision,
      current_leaning: input.leaning || input.options[0] || 'Uncertain',
      timestamp: Date.now()
    };
  }

  if (lowerDesc.includes('startup') || lowerDesc.includes('founder') || lowerDesc.includes('friend')) {
    const preset = PRESET_SCENARIOS.find(p => p.id === 'startup-vs-corp')!;
    return {
      ...preset.precomputedAudit,
      id: 'audit-heuristic-' + Date.now(),
      decision_summary: input.decision,
      current_leaning: input.leaning || input.options[0] || 'Uncertain',
      timestamp: Date.now()
    };
  }

  if (lowerDesc.includes('ms') || lowerDesc.includes('abroad') || lowerDesc.includes('loan') || lowerDesc.includes('masters')) {
    const preset = PRESET_SCENARIOS.find(p => p.id === 'higher-studies')!;
    return {
      ...preset.precomputedAudit,
      id: 'audit-heuristic-' + Date.now(),
      decision_summary: input.decision,
      current_leaning: input.leaning || input.options[0] || 'Uncertain',
      timestamp: Date.now()
    };
  }

  if (lowerDesc.includes('apartment') || lowerDesc.includes('house') || lowerDesc.includes('rent') || lowerDesc.includes('buy')) {
    const preset = PRESET_SCENARIOS.find(p => p.id === 'buy-vs-rent')!;
    return {
      ...preset.precomputedAudit,
      id: 'audit-heuristic-' + Date.now(),
      decision_summary: input.decision,
      current_leaning: input.leaning || input.options[0] || 'Uncertain',
      timestamp: Date.now()
    };
  }

  // Check for adversarial request: "tell me what to do", "choose for me"
  const isAdversarial = lowerDesc.includes('tell me') || lowerDesc.includes('which one') || lowerDesc.includes('choose for me') || lowerDesc.includes('pick');

  const visibleFactors = input.factors.length > 0 ? input.factors : ['Stated Primary Goal', 'Immediate Cost / Benefit'];
  const primaryLeaning = input.leaning || input.options[0] || 'Option A';

  return {
    id: 'audit-custom-' + Date.now(),
    timestamp: Date.now(),
    decision_summary: input.decision || 'Deliberation between competing choices',
    current_leaning: primaryLeaning,
    reasoning_visibility: {
      visible_percentage: isAdversarial ? 25 : 55,
      overlooked_percentage: isAdversarial ? 75 : 45,
      known_factors_count: visibleFactors.length,
      blind_spots_count: 5,
      primary_focal_point: input.reasoning ? input.reasoning.slice(0, 70) + '...' : 'Immediate operational advantages'
    },
    known_factors: visibleFactors.map(f => ({
      factor: f,
      source: 'explicit',
      details: `User explicitly listed ${f} as a core evaluation criterion`
    })),
    unstated_assumptions: [
      {
        id: 'a1',
        title: 'Your current evaluation criteria are sufficient to predict satisfaction',
        description: 'You are assuming the 2-3 factors you have written down will be the primary determinants of whether you feel regret 12 months from now.',
        evidence_quote: input.reasoning ? input.reasoning.slice(0, 60) : 'My current reasoning',
        why_it_matters: 'Decisions fail more often due to unmeasured qualitative friction than measured quantitative differences.',
        confidence: 'high',
        impact: 'high'
      },
      {
        id: 'a2',
        title: 'The chosen path is predictable and linear',
        description: `You are evaluating "${primaryLeaning}" under the assumption that external conditions and personal motivation will remain constant.`,
        evidence_quote: `Leaning toward: ${primaryLeaning}`,
        why_it_matters: 'Life and organizational conditions change rapidly; agility and option-preservation are often underpriced.',
        confidence: 'medium',
        impact: 'medium'
      }
    ],
    overlooked_factors: [
      {
        id: 'o1',
        title: 'Reversibility & Switching Costs',
        description: 'You have not evaluated how difficult, costly, or socially painful it will be to reverse this decision if your hypothesis proves false after 6 months.',
        why_it_matters: 'Two-way door decisions should be made quickly with high risk tolerance; one-way door decisions demand rigorous pre-mortems.',
        impact_domain: 'Risk Architecture',
        confidence: 'high',
        impact: 'high'
      },
      {
        id: 'o2',
        title: 'Opportunity Cost of Time & Cognitive Energy',
        description: 'Focusing on the immediate upside of this option obscures what other alternative opportunities or skill investments are being crowded out.',
        why_it_matters: 'Saying yes to one path is saying an implicit no to ten other latent pathways.',
        impact_domain: 'Long-term Growth',
        confidence: 'high',
        impact: 'high'
      }
    ],
    internal_conflicts: [
      {
        id: 'c1',
        title: 'Immediate Certainty vs. Stated Long-Term Objective',
        description: 'There is a noticeable tension between your desire for near-term reassurance and the longer-term growth you claim to seek.',
        stated_priority: 'Long-term success and fulfillment',
        competing_priority: 'Short-term comfort and path of least resistance',
        tension_analysis: 'Are you choosing this option because it is truly optimal, or because it minimizes immediate anxiety?',
        confidence: 'medium',
        impact: 'high'
      }
    ],
    missing_information: [
      {
        id: 'm1',
        title: 'Direct Feedback from People 2 Years Ahead on This Path',
        description: 'You are reasoning from first principles rather than gathering empirical data from individuals who made this exact choice 2 years ago.',
        why_it_matters: 'Second-hand experience is 10x cheaper than first-hand regret.',
        importance: 'high',
        how_to_verify: 'Conduct two 15-minute informal interviews with people living the outcome.'
      }
    ],
    questions_to_ask_yourself: [
      {
        id: 'q1',
        question: `If you were legally prohibited from choosing "${primaryLeaning}", how would you solve your underlying problem?`,
        purpose: 'Dislodges fixation and forces creative generation of alternative paths.',
        category: 'values'
      },
      {
        id: 'q2',
        question: 'What is the worst-case scenario that could happen within 6 months, and how specifically would you recover from it?',
        purpose: 'Pre-mortems the downside and reduces irrational fear.',
        category: 'reversibility'
      },
      {
        id: 'q3',
        question: 'What single piece of information, if discovered tomorrow, would make you immediately switch to the other option?',
        purpose: 'Establishes your falsification threshold.',
        category: 'falsification'
      }
    ],
    what_would_change_your_mind: [
      'Discovering that the day-to-day reality of this option involves 80% tasks you actively dislike.',
      'Finding that the switching cost to pivot away later is significantly higher than anticipated.',
      'Realizing an unconsidered third alternative achieves 90% of the upside with zero downside.'
    ],
    reasoning_patterns: [
      {
        pattern: 'Focalism & Near-Term Salience',
        description: 'The factors you have considered are the most visible right now, but not necessarily the most important over a multi-year horizon.',
        confidence: 'high'
      }
    ],
    guardrail: {
      verdict_given: false,
      guardrail_triggered: isAdversarial,
      neutrality_statement: isAdversarial
        ? '⚠️ GUARDRAIL ACTIVE: BlindSpot AI strictly refuses to tell you what to choose. We will never decide for you. Our role is to audit the logic and illuminate what you haven’t seen.'
        : 'BlindSpot AI is an objective reasoning auditor. We evaluate cognitive clarity and surface blind spots without prescribing outcomes.'
    },
    verdict: null
  };
}

/**
 * Main function to analyze a decision
 */
export async function analyzeDecisionWithGemini(input: DecisionInput): Promise<{
  analysis: BlindSpotAnalysis;
  provider: 'gemini' | 'simulation';
}> {
  const apiKey = (input.userApiKey || process.env.GEMINI_API_KEY || '').trim();

  // If no API key provided, fall back to our deep heuristic simulation
  if (!apiKey) {
    return {
      analysis: generateHeuristicAudit(input),
      provider: 'simulation'
    };
  }

  // Construct structured prompt for Gemini
  const userPrompt = `
Analyze the following decision using the BlindSpot AI Reasoning Auditor Framework:

DECISION:
"${input.decision}"

OPTIONS CONSIDERED:
${input.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

FACTORS CONSIDERED BY USER:
${input.factors.join(', ') || 'None explicitly listed'}

USER'S CURRENT REASONING & JUSTIFICATION:
"${input.reasoning}"

USER'S CURRENT LEANING:
"${input.leaning}"

Remember:
- Never say "accept", "reject", "choose A", or "choose B".
- "verdict" must be null.
- "guardrail.verdict_given" must be false.
- Be specific, intellectually rigorous, and extract evidence quotes from the user's reasoning.
- Return ONLY valid JSON adhering to the schema.
`;

  try {
    // Attempt Gemini 2.5 Flash / 1.5 Flash
    const model = 'gemini-1.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: BLINDSPOT_SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Gemini API error (${res.status}): ${errText}. Falling back to simulation.`);
      return {
        analysis: generateHeuristicAudit(input),
        provider: 'simulation'
      };
    }

    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      throw new Error('Empty response from Gemini');
    }

    const parsed: BlindSpotAnalysis = JSON.parse(cleanJsonOutput(rawContent));

    // Enforce strict guardrail override
    parsed.verdict = null;
    if (!parsed.guardrail) {
      parsed.guardrail = {
        verdict_given: false,
        guardrail_triggered: false,
        neutrality_statement: 'BlindSpot AI is an objective reasoning auditor. We evaluate cognitive clarity and surface blind spots without prescribing outcomes.'
      };
    } else {
      parsed.guardrail.verdict_given = false;
    }

    if (!parsed.id) {
      parsed.id = 'audit-gemini-' + Date.now();
    }
    parsed.timestamp = Date.now();

    return {
      analysis: parsed,
      provider: 'gemini'
    };
  } catch (error) {
    console.error('Error invoking Gemini API:', error);
    return {
      analysis: generateHeuristicAudit(input),
      provider: 'simulation'
    };
  }
}

/**
 * Round 2 Follow-Up Analysis
 */
export async function analyzeFollowUpWithGemini(input: FollowUpRequest): Promise<{
  followup: FollowUpAnalysis;
  provider: 'gemini' | 'simulation';
}> {
  const apiKey = (input.userApiKey || process.env.GEMINI_API_KEY || '').trim();

  // Fallback follow-up generator
  const fallbackFollowup: FollowUpAnalysis = {
    socratic_feedback: `Your responses indicate that you are beginning to separate emotional comfort from objective utility. However, by answering these questions, you introduced a secondary assumption: you are assuming your future self will have the same stamina and risk tolerance as you do today.`,
    evolved_assumptions: [
      {
        id: 'ea1',
        title: 'Assuming ideal execution under stress',
        description: 'You acknowledge the trade-off, but assume you will execute at 100% capacity even when tired or frustrated.',
        evidence_quote: input.answers[0]?.user_answer ? input.answers[0].user_answer.slice(0, 60) : 'My follow-up answer',
        why_it_matters: 'Planning around best-case stamina leaves zero buffer for life disruptions.',
        impact: 'high'
      }
    ],
    clarified_priorities: [
      'You clearly value long-term career growth more than immediate convenience.',
      'You are willing to accept financial trade-offs if high-quality mentorship is guaranteed.'
    ],
    new_probing_questions: [
      'What is the single most uncomfortable question you need to ask the other party before signing?',
      'If you could look back at this moment from 5 years in the future, which choice would make you proud of how you handled fear?'
    ],
    verdict: null,
    guardrail: {
      verdict_given: false,
      neutrality_statement: 'BlindSpot AI audits cognitive evolution. We do not provide verdicts.'
    }
  };

  if (!apiKey) {
    return {
      followup: fallbackFollowup,
      provider: 'simulation'
    };
  }

  const promptText = `
Conduct Round 2 Socratic Analysis on this evolving decision:

ORIGINAL DECISION:
"${input.original_decision}"

ORIGINAL REASONING:
"${input.original_reasoning}"

INITIAL SUMMARY:
"${input.initial_analysis_summary}"

USER'S ANSWERS TO PROBING QUESTIONS:
${input.answers.map(a => `Q: "${a.question_text}"\nUser Answer: "${a.user_answer}"`).join('\n\n')}

Analyze how their reasoning evolved, what new assumptions appeared, and pose 2 deeper second-order questions.
Never give a recommendation. "verdict" must be null. "guardrail.verdict_given" must be false.
`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: FOLLOWUP_SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
      })
    });

    if (!res.ok) {
      return { followup: fallbackFollowup, provider: 'simulation' };
    }

    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed: FollowUpAnalysis = JSON.parse(cleanJsonOutput(rawContent));
    parsed.verdict = null;
    parsed.guardrail = {
      verdict_given: false,
      neutrality_statement: 'BlindSpot AI audits cognitive evolution. We do not provide verdicts.'
    };
    return { followup: parsed, provider: 'gemini' };
  } catch (error) {
    console.error('Error in follow-up Gemini API:', error);
    return { followup: fallbackFollowup, provider: 'simulation' };
  }
}
