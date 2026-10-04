import { NextRequest, NextResponse } from 'next/server';
import { DecisionInput } from '@/types/blindspot';
import { analyzeDecisionWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body: DecisionInput = await req.json();

    if (!body.decision || typeof body.decision !== 'string' || body.decision.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please state the decision you are facing.' },
        { status: 400 }
      );
    }

    if (!body.reasoning || typeof body.reasoning !== 'string' || body.reasoning.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please describe your reasoning or why you are leaning toward an option.' },
        { status: 400 }
      );
    }

    const sanitizedInput: DecisionInput = {
      decision: body.decision.trim(),
      options: Array.isArray(body.options) ? body.options.filter(o => o && o.trim().length > 0) : [],
      factors: Array.isArray(body.factors) ? body.factors.filter(f => f && f.trim().length > 0) : [],
      reasoning: body.reasoning.trim(),
      leaning: (body.leaning || '').trim(),
      userApiKey: (body.userApiKey || '').trim()
    };

    const startTime = Date.now();
    const { analysis, provider } = await analyzeDecisionWithGemini(sanitizedInput);
    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: analysis,
      meta: {
        provider,
        durationMs,
        guardrailChecked: true,
        verdictEnforcedNull: analysis.verdict === null
      }
    });
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during reasoning audit.',
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}
