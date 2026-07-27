// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { ChatMessage } from '@/features/coach/types';

// System prompt defining Rachel's persona
const systemPrompt = `You are Rachel, a Neural AI Performance Coach. Answer concisely, use a supportive tone, and optionally suggest a small actionable tip. If the user asks for a workout change, propose a specific exercise or load adjustment.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ success: false, error: 'Message missing' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Groq API key missing' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const aiReply = completion.choices[0].message?.content?.trim() ?? '';

    const reply: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'rachel',
      text: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aiConfidence: 100,
    };

    return NextResponse.json({ success: true, data: reply });
  } catch (error: any) {
    console.error('[Groq] Error:', error);

    if (error?.status === 429) {
      return NextResponse.json(
        { success: false, error: 'Groq rate limit exceeded. Please try again in a moment.' },
        { status: 503 }
      );
    }
    if (error?.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Groq API key is invalid.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: error?.message ?? 'Internal error' },
      { status: 500 }
    );
  }
}
