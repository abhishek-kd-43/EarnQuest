import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { GeminiAIProvider } from "@/providers/ai/gemini-ai.provider";

const keySaveSchema = z.object({
  apiKeyGemini: z.string().optional().nullable(),
  apiKeyGroq: z.string().optional().nullable(),
  apiKeyOpenRouter: z.string().optional().nullable(),
  action: z.enum(["save", "test"]).optional(),
});

function maskKey(key?: string | null): string | null {
  if (!key || key.length < 8) return null;
  const start = key.slice(0, 6);
  const end = key.slice(-4);
  return `${start}...${end}`;
}

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        apiKeyGemini: null,
        apiKeyGroq: null,
        apiKeyOpenRouter: null,
        isLiveActive: !!process.env.GEMINI_API_KEY,
        engineSource: process.env.GEMINI_API_KEY ? "System Environment Key" : "Built-in Intelligence Engine",
      });
    }

    const profile = await db.userProfile.findUnique({
      where: { userId: session.id },
    });

    const hasGemini = !!(profile?.apiKeyGemini || process.env.GEMINI_API_KEY);

    return NextResponse.json({
      authenticated: true,
      apiKeyGemini: maskKey(profile?.apiKeyGemini),
      apiKeyGroq: maskKey(profile?.apiKeyGroq),
      apiKeyOpenRouter: maskKey(profile?.apiKeyOpenRouter),
      rawGeminiPresent: !!profile?.apiKeyGemini,
      isLiveActive: hasGemini,
      engineSource: profile?.apiKeyGemini
        ? "User Free Google AI Studio Key (Gemini 1.5 Flash)"
        : process.env.GEMINI_API_KEY
        ? "Platform Gemini Key"
        : "EarnQuest Built-in Opportunity Guide",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in to save your personal API keys." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = keySaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { apiKeyGemini, apiKeyGroq, apiKeyOpenRouter, action } = parsed.data;

    // If action is "test", test key without saving
    if (action === "test") {
      if (!apiKeyGemini) {
        return NextResponse.json({ success: false, message: "No Gemini key provided to test." });
      }
      const testResult = await GeminiAIProvider.testApiKey(apiKeyGemini);
      return NextResponse.json(testResult);
    }

    // Update user profile keys
    const updateData: {
      apiKeyGemini?: string | null;
      apiKeyGroq?: string | null;
      apiKeyOpenRouter?: string | null;
    } = {};

    if (apiKeyGemini !== undefined) {
      updateData.apiKeyGemini = apiKeyGemini ? apiKeyGemini.trim() : null;
    }
    if (apiKeyGroq !== undefined) {
      updateData.apiKeyGroq = apiKeyGroq ? apiKeyGroq.trim() : null;
    }
    if (apiKeyOpenRouter !== undefined) {
      updateData.apiKeyOpenRouter = apiKeyOpenRouter ? apiKeyOpenRouter.trim() : null;
    }

    await db.userProfile.update({
      where: { userId: session.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "API keys successfully updated. Live Frontier Guide is now active!",
      maskedGemini: maskKey(updateData.apiKeyGemini),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
