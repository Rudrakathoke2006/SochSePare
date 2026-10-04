import { BlindSpotAnalysis, DecisionInput } from '@/types/blindspot';

export interface PresetScenario {
  id: string;
  name: string;
  category: string;
  tagline: string;
  input: DecisionInput;
  precomputedAudit: BlindSpotAnalysis;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'internship',
    name: 'Internship vs. Placement Prep',
    category: 'Career / Education',
    tagline: 'Stipend and convenience vs. long-term placement focus',
    input: {
      decision: 'Should I accept a ₹30,000/month internship or spend the summer preparing for campus placements?',
      options: [
        'Accept the ₹30,000/month internship',
        'Spend summer dedicated to campus placement preparation & DSA'
      ],
      factors: ['Money & Stipend', 'Proximity to Home', 'Industry Experience', 'Placement Readiness', 'Academics'],
      reasoning: 'The internship gives me a good stipend (₹30,000/month), it is very close to home so no relocation stress, and I will get industry experience on my resume. I think having real company experience will help me get a better full-time job later during placements.',
      leaning: 'Accept the ₹30,000/month internship'
    },
    precomputedAudit: {
      id: 'audit-internship-01',
      timestamp: Date.now(),
      decision_summary: 'Choosing between a paid local summer internship and dedicated campus placement preparation.',
      current_leaning: 'Accept the ₹30,000/month internship',
      reasoning_visibility: {
        visible_percentage: 58,
        overlooked_percentage: 42,
        known_factors_count: 3,
        blind_spots_count: 6,
        primary_focal_point: 'Immediate cash flow, proximity comfort, and generic resume signaling'
      },
      known_factors: [
        { factor: 'Stipend Amount', source: 'explicit', details: 'Offers ₹30,000/month' },
        { factor: 'Location Advantage', source: 'explicit', details: 'Close to home, minimal relocation friction' },
        { factor: 'Resume Intent', source: 'explicit', details: 'Hoping to show industry experience for final placements' }
      ],
      unstated_assumptions: [
        {
          id: 'a1',
          title: '"Industry experience" is automatically high-value experience',
          description: 'You treat the title of having an internship as inherently valuable, without verifying if the daily work entails high-leverage software engineering or mundane maintenance and administrative support.',
          evidence_quote: 'I think having real company experience will help me get a better full-time job later',
          why_it_matters: 'Top-tier placement interviewers care about deep problem-solving skills and architecture, not merely company attendance.',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'a2',
          title: 'The ₹30,000 stipend compensates for placement preparation time',
          description: 'You are evaluating the ₹30k/month as a net gain, without pricing the opportunity cost of falling behind in core algorithmic/system design rounds that determine offers with 5x-10x higher baseline CTC.',
          evidence_quote: 'The internship gives me a good stipend (₹30,000/month)',
          why_it_matters: 'A 2-month ₹60,000 total payout may lock you out of competitive placement salary tiers lasting years.',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'a3',
          title: 'You can simultaneously work full-time and prep for placements',
          description: 'You assume physical proximity to home guarantees sufficient cognitive surplus to study after an 8-hour workday.',
          evidence_quote: 'it is very close to home so no relocation stress',
          why_it_matters: 'Workday cognitive fatigue frequently leads students to abandon their interview practice schedule.',
          confidence: 'medium',
          impact: 'medium'
        }
      ],
      overlooked_factors: [
        {
          id: 'o1',
          title: 'Mentorship Density & Team Quality',
          description: 'You have not mentioned who will mentor you, the engineering seniority of the team, or whether code reviews take place.',
          why_it_matters: 'Internships without senior mentorship often devolve into unsupervised ticket-fixing that teaches bad software engineering habits.',
          impact_domain: 'Career Trajectory & Technical Growth',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'o2',
          title: 'Placement Season Algorithmic Thresholds',
          description: 'Placement screening rounds at premium companies use automated LeetCode/DSA filters where generic internship experience does not count toward passing the cutoffs.',
          why_it_matters: 'If you fail the initial coding assessment, interviewers never get to read your internship experience.',
          impact_domain: 'Placement Readiness',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'o3',
          title: 'Pre-Placement Offer (PPO) Conversion Probability',
          description: 'You have not evaluated whether this company historically converts summer interns into full-time offers or simply uses interns for seasonal burst labor.',
          why_it_matters: 'If PPO conversion is near zero, the long-term career synergy drops significantly.',
          impact_domain: 'Long-term Employment',
          confidence: 'medium',
          impact: 'medium'
        }
      ],
      internal_conflicts: [
        {
          id: 'c1',
          title: 'Stated Career Growth vs. Actual Comfort & Cash Drivers',
          description: 'You framed your goal as securing a better full-time career, yet your primary decision arguments are short-term cash (₹30k) and staying close to family comfort.',
          stated_priority: 'Securing a superior full-time job during placements',
          competing_priority: 'Immediate cash gratification and local convenience',
          tension_analysis: 'If your true objective is the highest-tier placement offer, you would prioritize whichever path produces maximum interview performance, regardless of summer cash.',
          confidence: 'high',
          impact: 'high'
        }
      ],
      missing_information: [
        {
          id: 'm1',
          title: 'Specific Tech Stack & Intern Project Scope',
          description: 'What will you physically be building during the 8 weeks?',
          why_it_matters: 'Working on modern cloud/distributed microservices vs. updating legacy spreadsheets determines if it helps your placement resume.',
          importance: 'high',
          how_to_verify: 'Ask the hiring manager for the specific project charter and team tech stack before signing.'
        },
        {
          id: 'm2',
          title: 'Daily Working Hours & Weekend Expectations',
          description: 'Actual expected daily workload and commute schedule.',
          why_it_matters: 'Determines whether you will realistically have 2 hours daily for placement problem solving.',
          importance: 'medium',
          how_to_verify: 'Reach out to past interns from this company on LinkedIn.'
        }
      ],
      questions_to_ask_yourself: [
        {
          id: 'q1',
          question: 'If the internship was completely unpaid (₹0 stipend), would you still choose it over 8 weeks of focused placement prep?',
          purpose: 'Isolates whether the true driver is genuine technical learning or short-term financial anchoring.',
          category: 'values'
        },
        {
          id: 'q2',
          question: 'What specific questions in a placement interview will you be better equipped to answer because of this internship that you could not answer through rigorous self-study?',
          purpose: 'Forces you to define the tangible technical output of the experience.',
          category: 'second_order'
        },
        {
          id: 'q3',
          question: 'If you fail the initial coding assessment of your dream placement company because of lack of practice, will the ₹60,000 earned feel like an acceptable trade-off?',
          purpose: 'Tests the reversibility and asymmetric downside risk.',
          category: 'falsification'
        }
      ],
      what_would_change_your_mind: [
        'Discovering the internship entails legacy manual QA testing rather than core software development.',
        'Learning that your target campus placement companies require solving Hard-level LeetCode problems in round 1.',
        'Finding that the company has a 0% historical Pre-Placement Offer (PPO) conversion rate.'
      ],
      reasoning_patterns: [
        {
          pattern: 'Financial Anchoring',
          description: 'The ₹30,000 stipend is concrete and immediate, causing it to overshadow less tangible factors like placement odds.',
          confidence: 'high'
        },
        {
          pattern: 'Halo Effect on "Experience"',
          description: 'Treating the broad label of "industry experience" as uniformly positive without auditing the specific tasks.',
          confidence: 'high'
        }
      ],
      guardrail: {
        verdict_given: false,
        guardrail_triggered: false,
        neutrality_statement: 'BlindSpot AI is an objective reasoning auditor. We evaluate cognitive clarity and surface blind spots without prescribing outcomes.'
      },
      verdict: null
    }
  },
  {
    id: 'startup-vs-corp',
    name: "Friend's Early Startup vs. Big Tech",
    category: 'Career / Risk',
    tagline: 'High autonomy & learning vs. structure & stability',
    input: {
      decision: "Should I join my close friend's 4-person seed startup as an early engineer, or accept a graduate role at a large tech corporate?",
      options: [
        "Join friend's seed startup (low salary, high equity)",
        "Accept large tech corporate graduate program (high salary, stable)"
      ],
      factors: ['Learning Speed', 'Friendship', 'Autonomy', 'Compensation', 'Resume Brand'],
      reasoning: "I want to join my friend's startup because I will learn ten times faster wearing multiple hats and building things from scratch. Corporate jobs are slow and bureaucratic. Since we are close friends, our team chemistry will be amazing, and if the startup succeeds, the upside will be massive.",
      leaning: "Join friend's seed startup"
    },
    precomputedAudit: {
      id: 'audit-startup-02',
      timestamp: Date.now(),
      decision_summary: "Deciding between joining a close friend's seed startup versus an established corporate graduate tech role.",
      current_leaning: "Join friend's seed startup",
      reasoning_visibility: {
        visible_percentage: 52,
        overlooked_percentage: 48,
        known_factors_count: 3,
        blind_spots_count: 5,
        primary_focal_point: 'Excitement around rapid learning, friendship chemistry, and equity upside'
      },
      known_factors: [
        { factor: 'Role Autonomy', source: 'explicit', details: 'Expects to wear multiple hats and build from scratch' },
        { factor: 'Personal Relationship', source: 'explicit', details: 'Founding team includes a close friend' },
        { factor: 'Upside Ambition', source: 'explicit', details: 'Drawn to potential massive financial upside of equity' }
      ],
      unstated_assumptions: [
        {
          id: 'a1',
          title: 'Close friendship translates into healthy co-working dynamics',
          description: 'You assume strong personal friendship automatically creates productive professional team chemistry under intense runway pressure.',
          evidence_quote: 'Since we are close friends, our team chemistry will be amazing',
          why_it_matters: 'Disagreements on compensation, equity dilution, or work ethic between friends are the leading cause of early startup breakdowns.',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'a2',
          title: 'Chaotic multi-hat work equals high-quality engineering learning',
          description: 'You equate doing many tasks fast with building deep engineering discipline.',
          evidence_quote: 'I will learn ten times faster wearing multiple hats',
          why_it_matters: 'Without experienced senior staff engineers to conduct code reviews, you may learn how to hack things together quickly while missing architectural rigor, scalability, and security.',
          confidence: 'high',
          impact: 'high'
        }
      ],
      overlooked_factors: [
        {
          id: 'o1',
          title: 'Cash Runway and Downside Protection',
          description: 'You have not mentioned how many months of runway the startup has or what happens if the next funding round stalls.',
          why_it_matters: 'If runway is under 6 months, a large portion of your mental energy will be spent on survival anxiety rather than learning.',
          impact_domain: 'Financial Stability',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'o2',
          title: 'Founder Relationship Exit Protocol',
          description: 'No framework was mentioned for what happens to your friendship or equity if you decide to leave after 10 months.',
          why_it_matters: 'Without a clear 1-year cliff and 4-year vesting schedule, disputes can permanently destroy relationships.',
          impact_domain: 'Personal & Legal',
          confidence: 'medium',
          impact: 'high'
        }
      ],
      internal_conflicts: [
        {
          id: 'c1',
          title: 'Wanting Mentorship vs. Choosing an Environment with None',
          description: 'You cite wanting to maximize your development as a software engineer, yet you are choosing an environment where there is no senior engineering leadership above you.',
          stated_priority: 'Accelerated professional learning',
          competing_priority: 'Desire for immediate autonomy without oversight',
          tension_analysis: 'Autonomy without mentorship frequently develops bad architectural habits that must be unlearned later.',
          confidence: 'high',
          impact: 'medium'
        }
      ],
      missing_information: [
        {
          id: 'm1',
          title: 'Current Runway & Monthly Burn Rate',
          description: 'Exact verified bank balance divided by net monthly expenditures.',
          why_it_matters: 'Tells you if the business will exist in 9 months.',
          importance: 'high',
          how_to_verify: 'Review the cap table and financial runway docs before signing.'
        }
      ],
      questions_to_ask_yourself: [
        {
          id: 'q1',
          question: 'If the startup fails after 14 months and shuts down with zero equity value, would you still consider the experience superior to the corporate role?',
          purpose: 'De-couples outcome bias from process quality.',
          category: 'falsification'
        },
        {
          id: 'q2',
          question: 'If your friend needs to give you critical feedback or renegotiate your equity down, how will you protect your personal friendship?',
          purpose: 'Pre-mortems the relational strain under startup volatility.',
          category: 'values'
        }
      ],
      what_would_change_your_mind: [
        'Learning the startup has less than 4 months of runway remaining.',
        'Discovering the corporate role allows internal transfers to zero-to-one incubation labs with senior staff mentorship.',
        'Realizing there is no formal founder vesting agreement in place.'
      ],
      reasoning_patterns: [
        {
          pattern: 'Optimism Bias & Romance of the Hustle',
          description: 'Focusing on the best-case startup narrative while dismissing corporate structural advantages as mere bureaucracy.',
          confidence: 'high'
        }
      ],
      guardrail: {
        verdict_given: false,
        guardrail_triggered: false,
        neutrality_statement: 'BlindSpot AI is an objective reasoning auditor. We evaluate cognitive clarity and surface blind spots without prescribing outcomes.'
      },
      verdict: null
    }
  },
  {
    id: 'higher-studies',
    name: 'MS Abroad vs. Corporate Engineering',
    category: 'Finance / Education',
    tagline: 'High upfront debt & international visa risk vs. steady career growth',
    input: {
      decision: 'Should I take an educational loan to pursue an MS in Computer Science in the US, or stay in my current software developer job in India?',
      options: [
        'Take education loan and pursue MS in US',
        'Stay in current Indian software engineering role'
      ],
      factors: ['Salary Upside', 'Education Quality', 'Loan Debt', 'Immigration & Visa', 'Life Experience'],
      reasoning: 'US tech salaries are 4x higher than what I make here. Even though the tuition loan is ₹50 Lakhs, everyone says you can easily pay it off within 1.5 to 2 years after graduating. Getting a degree from a top university also gives me global prestige.',
      leaning: 'Take education loan and pursue MS in US'
    },
    precomputedAudit: {
      id: 'audit-ms-03',
      timestamp: Date.now(),
      decision_summary: 'Weighing ₹50L educational debt for a US Master’s degree against domestic software career compounding.',
      current_leaning: 'Take education loan and pursue MS in US',
      reasoning_visibility: {
        visible_percentage: 50,
        overlooked_percentage: 50,
        known_factors_count: 2,
        blind_spots_count: 6,
        primary_focal_point: 'Gross currency conversion salary comparisons and optimistic payback timelines'
      },
      known_factors: [
        { factor: 'Stated Salary Multiplier', source: 'explicit', details: 'US salaries appear 4x higher in nominal currency' },
        { factor: 'Loan Liability', source: 'explicit', details: 'Awaiting ₹50 Lakh loan commitment' }
      ],
      unstated_assumptions: [
        {
          id: 'a1',
          title: 'Past 10-year tech hiring climates predict future hiring climates',
          description: 'You assume the historic post-graduation hiring environment of 2015-2021 remains identical in today’s macroeconomic tech market.',
          evidence_quote: 'everyone says you can easily pay it off within 1.5 to 2 years after graduating',
          why_it_matters: 'Junior tech hiring in the US has experienced sharp contraction, extending job search duration and debt payback timelines.',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'a2',
          title: 'H-1B lottery allocation is merit-based rather than random',
          description: 'You assume that getting high grades and a good job secures long-term US residency.',
          evidence_quote: 'US tech salaries are 4x higher... pay it off within 1.5 to 2 years',
          why_it_matters: 'The H-1B visa is a randomized lottery with ~15-25% selection rates, independent of your engineering skill.',
          confidence: 'high',
          impact: 'high'
        }
      ],
      overlooked_factors: [
        {
          id: 'o1',
          title: 'Domestic Career Compounding Opportunity Cost',
          description: 'You did not factor what your Indian salary and equity would look like after 2 years of active promotion vs. 2 years of zero income in graduate school.',
          why_it_matters: 'Tier-1 tech hubs in India (Bengaluru/Hyderabad) now offer competitive senior engineering compensation packages with zero debt and low cost of living.',
          impact_domain: 'Total Net Worth Compounding',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'o2',
          title: 'Geopolitical & Visa Exit Strain',
          description: 'No consideration given to the mental overhead of OPT 90-day unemployment clocks and visa renewals.',
          why_it_matters: 'Visa restrictions restrict job mobility, negotiation leverage, and entrepreneurial risk-taking.',
          impact_domain: 'Mental Well-being & Career Flexibility',
          confidence: 'medium',
          impact: 'high'
        }
      ],
      internal_conflicts: [
        {
          id: 'c1',
          title: 'Desire for Financial Security vs. Taking on Maximum Debt at Market Peak',
          description: 'Your ultimate driver is high net wealth, but your chosen vehicle requires taking on high-interest unhedged foreign exchange debt.',
          stated_priority: 'Maximizing long-term net financial wealth',
          competing_priority: 'Taking on ₹50L fixed obligation during high-interest-rate global climate',
          tension_analysis: 'If wealth maximization is the driver, foreign exchange currency risk must be priced into the payback model.',
          confidence: 'high',
          impact: 'high'
        }
      ],
      missing_information: [
        {
          id: 'm1',
          title: 'Actual Median Graduate Placement Rate for the Specific Program',
          description: 'Not college-wide averages, but the exact % of international students on F-1 visas who secured sponsorship in the last 12 months.',
          why_it_matters: 'Distinguishes marketing statistics from current immigration reality.',
          importance: 'high',
          how_to_verify: 'Request official 2023-2024 International Student Services employment reports from the university department.'
        }
      ],
      questions_to_ask_yourself: [
        {
          id: 'q1',
          question: 'If you fail to get selected in the H-1B lottery during your OPT period and must return home with ₹35 Lakhs of remaining debt, what is your fallback survival plan?',
          purpose: 'Stress-tests tail risk and asymmetric downside.',
          category: 'reversibility'
        },
        {
          id: 'q2',
          question: 'If your domestic salary grows by 30% year-on-year over the next 3 years, does the net disposable savings gap between the US and home still justify the debt stress?',
          purpose: 'Checks for home-country growth blind spots.',
          category: 'falsification'
        }
      ],
      what_would_change_your_mind: [
        'Finding that the median time to secure a sponsored offer for international students has stretched beyond 6 months post-grad.',
        'Receiving an internal promotion to SDE-2 or Tech Lead with equity at your current company.',
        'Calculating the loan repayment monthly EMI under a depreciated rupee scenario.'
      ],
      reasoning_patterns: [
        {
          pattern: 'Currency Conversion Illusion',
          description: 'Comparing gross dollar amounts directly to rupee amounts without deducting US federal/state taxes, healthcare, and high rents.',
          confidence: 'high'
        }
      ],
      guardrail: {
        verdict_given: false,
        guardrail_triggered: false,
        neutrality_statement: 'BlindSpot AI is an objective reasoning auditor. We evaluate cognitive clarity and surface blind spots without prescribing outcomes.'
      },
      verdict: null
    }
  },
  {
    id: 'buy-vs-rent',
    name: 'Buy First Home vs. Rent & Invest',
    category: 'Finance / Lifestyle',
    tagline: 'Emotional security of ownership vs. liquidity and agility',
    input: {
      decision: 'Should I buy a 3-BHK apartment with a 20-year home loan, or continue renting and investing the down payment into index funds?',
      options: [
        'Buy the apartment (20-year EMI mortgage)',
        'Rent comfortably and systematically invest surplus in equity index funds'
      ],
      factors: ['Stability for Family', 'Asset Appreciation', 'Monthly Cash Flow', 'Career Mobility', 'Tax Benefits'],
      reasoning: 'Paying rent feels like throwing money away each month. If I buy, the EMI is building equity in a real asset that will appreciate. It will give my family permanent stability and pride, plus I get income tax deductions on the home loan interest.',
      leaning: 'Buy the apartment'
    },
    precomputedAudit: {
      id: 'audit-buyrent-04',
      timestamp: Date.now(),
      decision_summary: 'Evaluating buying a primary residential property via a 20-year mortgage versus renting and equity investing.',
      current_leaning: 'Buy the apartment',
      reasoning_visibility: {
        visible_percentage: 45,
        overlooked_percentage: 55,
        known_factors_count: 3,
        blind_spots_count: 5,
        primary_focal_point: '"Rent is thrown away" axiom, physical asset pride, and tax rebates'
      },
      known_factors: [
        { factor: 'Desire for Ownership', source: 'explicit', details: 'Values family stability and emotional pride of owning' },
        { factor: 'Tax Incentives', source: 'explicit', details: 'Considering home loan interest tax deductions' }
      ],
      unstated_assumptions: [
        {
          id: 'a1',
          title: '"Rent is throwing money away" assumes mortgage interest is not',
          description: 'You treat rent as 100% loss, while ignoring that during the first 7-10 years of a 20-year mortgage, 70%+ of your EMI payment goes directly to bank interest, property taxes, and maintenance—which are also completely non-recoverable expenses.',
          evidence_quote: 'Paying rent feels like throwing money away each month',
          why_it_matters: 'The unrecoverable cost of homeownership (mortgage interest + HOA maintenance + property taxes + registry charges) often exceeds annual rent for equivalent properties.',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'a2',
          title: 'Real estate historically beats equity index returns after inflation and maintenance',
          description: 'You assume residential real estate yields superior net annualized returns compared to diversified equities.',
          evidence_quote: 'the EMI is building equity in a real asset that will appreciate',
          why_it_matters: 'Historical residential real estate in many metros yields 5-8% nominal CAGR, whereas equity index funds yield 11-14%, leading to massive compounding divergences over 20 years.',
          confidence: 'high',
          impact: 'high'
        }
      ],
      overlooked_factors: [
        {
          id: 'o1',
          title: 'Loss of Geographical Career Mobility',
          description: 'You have not considered how being anchored to a physical house limits your ability to take higher-paying leadership roles in different cities or tech corridors.',
          why_it_matters: 'A 40% salary jump from a strategic relocation frequently exceeds 10 years of property appreciation.',
          impact_domain: 'Career Compounding & Agility',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'o2',
          title: 'Liquidity Crunch & Emergency Reserve Depletion',
          description: 'Putting your entire savings into the 20% down payment and registration fees leaves you with minimal liquid emergency cushion.',
          why_it_matters: 'If you face a sudden layoff or medical emergency, home equity cannot be tapped quickly without taking high-interest personal loans.',
          impact_domain: 'Financial Resilience',
          confidence: 'high',
          impact: 'high'
        }
      ],
      internal_conflicts: [
        {
          id: 'c1',
          title: 'Seeking Financial Freedom vs. Binding Cash Flow to a 20-Year Debt Obligation',
          description: 'You want long-term wealth, yet you are tying down 40-50% of your net monthly income to a single non-liquid illiquid asset.',
          stated_priority: 'Long-term financial wealth and security',
          competing_priority: 'Emotional comfort of physical brick-and-mortar ownership',
          tension_analysis: 'Is the decision actually a financial calculation or an emotional purchase disguised as an investment?',
          confidence: 'high',
          impact: 'medium'
        }
      ],
      missing_information: [
        {
          id: 'm1',
          title: 'Total Rental Yield in the Specific Apartment Complex',
          description: 'Annual rent divided by total purchase cost.',
          why_it_matters: 'If rental yield is 2.5% to 3%, renting is mathematically much cheaper than the 8.5% borrowing cost of money.',
          importance: 'high',
          how_to_verify: 'Check active rental listings in the exact building.'
        }
      ],
      questions_to_ask_yourself: [
        {
          id: 'q1',
          question: 'If you acknowledge that buying this home is an emotional consumption decision rather than an optimal investment, does the purchase still make sense to you?',
          purpose: 'Strips away rationalization and clarifies true motives.',
          category: 'values'
        },
        {
          id: 'q2',
          question: 'What happens to your mortgage repayment ability if you experience a 6-month period of zero income?',
          purpose: 'Identifies buffer fragility.',
          category: 'reversibility'
        }
      ],
      what_would_change_your_mind: [
        'Discovering the apartment’s annual maintenance fees and sinking fund eat up 35% of the tax rebate.',
        'Realizing a career pivot requires moving to a different city in under 3 years.',
        'Running an exact 20-year Monte Carlo simulation comparing rent+invest vs mortgage equity.'
      ],
      reasoning_patterns: [
        {
          pattern: 'Sunk Cost & Social Proof Conformity',
          description: 'Adopting the cultural belief that renting is "money lost" without auditing the mathematical cost of debt.',
          confidence: 'high'
        }
      ],
      guardrail: {
        verdict_given: false,
        guardrail_triggered: false,
        neutrality_statement: 'BlindSpot AI is an objective reasoning auditor. We evaluate cognitive clarity and surface blind spots without prescribing outcomes.'
      },
      verdict: null
    }
  },
  {
    id: 'guardrail-adversarial',
    name: '⚡ Guardrail Test ("Just Tell Me What To Do")',
    category: 'Strict Guardrail Demo',
    tagline: 'Testing the AI refusal to recommend an option',
    input: {
      decision: 'Should I take Job A ($50,000) or Job B ($35,000)? Just tell me which one to accept.',
      options: [
        'Job A ($50,000 salary)',
        'Job B ($35,000 salary)'
      ],
      factors: ['Money'],
      reasoning: 'I cannot decide. One pays $50k and the other pays $35k. Tell me which one is better and what I should choose right now.',
      leaning: 'I want you to tell me what to do'
    },
    precomputedAudit: {
      id: 'audit-guardrail-05',
      timestamp: Date.now(),
      decision_summary: 'Attempting to outsource a salary decision between two compensation tiers ($50k vs $35k).',
      current_leaning: 'Outsource decision to AI',
      reasoning_visibility: {
        visible_percentage: 20,
        overlooked_percentage: 80,
        known_factors_count: 1,
        blind_spots_count: 5,
        primary_focal_point: 'Pure nominal dollar gap and abdication of personal decision agency'
      },
      known_factors: [
        { factor: 'Gross Compensation Gap', source: 'explicit', details: '$50,000 vs $35,000' }
      ],
      unstated_assumptions: [
        {
          id: 'a1',
          title: 'An external algorithm can determine your personal utility function',
          description: 'You are assuming that a higher number is an objective answer, ignoring that choices require personal trade-offs between stress, hours, location, and values.',
          evidence_quote: 'Tell me which one is better and what I should choose right now',
          why_it_matters: 'Outsourcing decisions to external authorities leads to decision regret because you have not claimed ownership of the trade-offs.',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'a2',
          title: '$15,000 gross difference equals $15,000 disposable difference',
          description: 'You assume the dollar difference is directly pocketed without factoring taxes, commute costs, or mandatory expenses.',
          evidence_quote: 'One pays $50k and the other pays $35k',
          why_it_matters: 'If Job A requires moving to a high cost-of-living metro, your real purchasing power may be lower than Job B.',
          confidence: 'high',
          impact: 'high'
        }
      ],
      overlooked_factors: [
        {
          id: 'o1',
          title: 'Workplace Culture, Burnout & Hours Required',
          description: 'You provided zero information regarding the expected weekly working hours (e.g. 70 hrs/week vs 38 hrs/week).',
          why_it_matters: 'A $50k job requiring 70 hours/week has a lower effective hourly wage than a $35k job requiring 35 hours/week.',
          impact_domain: 'Quality of Life & Real Hourly Rate',
          confidence: 'high',
          impact: 'high'
        },
        {
          id: 'o2',
          title: 'Career Runway and Skill Trajectory',
          description: 'Which company promotes faster? Which provides transferable skills?',
          why_it_matters: 'The lower-paying role might offer an immediate promotion track to $70k within 12 months.',
          impact_domain: 'Trajectory Compounding',
          confidence: 'high',
          impact: 'high'
        }
      ],
      internal_conflicts: [
        {
          id: 'c1',
          title: 'Desire for a Decision vs. Refusal to Clarify Values',
          description: 'You want a firm conclusion, but have not defined what you actually value beyond a raw dollar tag.',
          stated_priority: 'Urgent resolution of dilemma',
          competing_priority: 'Zero reflection on lifestyle or career aspirations',
          tension_analysis: 'No tool can evaluate what is "better" without you first defining what "better" means for your life.',
          confidence: 'high',
          impact: 'high'
        }
      ],
      missing_information: [
        {
          id: 'm1',
          title: 'Geographic Location & Net Cost of Living',
          description: 'Cities for both roles.',
          why_it_matters: 'Determines actual post-rent disposable income.',
          importance: 'high',
          how_to_verify: 'Calculate post-tax and post-rent estimates on Numbeo or SmartAsset.'
        }
      ],
      questions_to_ask_yourself: [
        {
          id: 'q1',
          question: 'Why are you seeking to have an AI make this decision for you instead of examining what you actually want from your work?',
          purpose: 'Reflects decision avoidance and abdication of ownership.',
          category: 'values'
        },
        {
          id: 'q2',
          question: 'If Job B offered 10x better mentorship and promoted to $60k in year two, would you still look at the starting $15k difference the same way?',
          purpose: 'Breaks one-dimensional anchoring.',
          category: 'falsification'
        }
      ],
      what_would_change_your_mind: [
        'Realizing Job A requires a 90-minute daily commute and mandatory weekend on-call duty.',
        'Discovering that Job B provides $10k in annual equity grants and fully paid healthcare.',
        'Evaluating the hourly rate after calculating actual hours worked.'
      ],
      reasoning_patterns: [
        {
          pattern: 'Single-Variable Reductionism',
          description: 'Collapsing a complex human career decision into a single numerical dimension (nominal salary).',
          confidence: 'high'
        }
      ],
      guardrail: {
        verdict_given: false,
        guardrail_triggered: true,
        neutrality_statement: '⚠️ GUARDRAIL ACTIVE: BlindSpot AI strictly refuses to say "choose Job A" or "choose Job B". We will never tell you what to decide. Our sole mission is to audit the logic, identify missing information, and expose what you have not yet considered.'
      },
      verdict: null
    }
  }
];
