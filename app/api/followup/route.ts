import { NextRequest, NextResponse } from 'next/server';
import { FollowUpRequest } from '@/types/blindspot';
import { analyzeFollowUpWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body: FollowUpRequest = await req.json();

    if (!body.original_decision || !body.original_reasoning || !Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json(
        { error: 'Missing required follow-up fields or answers.' },
        { status: 400 }
      );
    }

    const { followup, provider } = await analyzeFollowUpWithGemini(body);

    return NextResponse.json({
      success: true,
      data: followup,
      meta: {
        provider,
        guardrailChecked: true,
        verdictEnforcedNull: followup.verdict === null
      }
    });
  } catch (error: any) {
    console.error('API /api/followup error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during round 2 follow-up audit.',
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}
