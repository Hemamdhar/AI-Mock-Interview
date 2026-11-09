import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/simulator/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not running: fallback to mock response
    }

    return NextResponse.json({
      id: "sim_" + Math.random().toString(36).substring(2, 9),
      role_id: body.role_id,
      role_title: body.role_title,
      score: body.score,
      total_marks: body.total_marks,
      verdict: body.verdict,
      sections: body.sections || {},
      time_spent_seconds: body.time_spent_seconds || 0,
      created_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to submit simulator assessment." },
      { status: 500 }
    );
  }
}

