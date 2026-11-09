import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get("guest_id") || "guest_default";
    const roleId = searchParams.get("role_id");

    try {
      const url = new URL(`${BACKEND_URL}/api/v1/simulator/history`);
      url.searchParams.set("guest_id", guestId);
      if (roleId) url.searchParams.set("role_id", roleId);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not running
    }

    return NextResponse.json([]);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch simulator history." },
      { status: 500 }
    );
  }
}

