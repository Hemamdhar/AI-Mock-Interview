import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    // Query LeetCode Public GraphQL API
    const graphqlQuery = {
      query: `
        query getUserData($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              realName
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
          recentAcSubmissionList(username: $username, limit: 50) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `,
      variables: { username: cleanUsername },
    };

    const leetcodeRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!leetcodeRes.ok) {
      return NextResponse.json(
        {
          error: `LeetCode API responded with status ${leetcodeRes.status}`,
        },
        { status: 502 }
      );
    }

    const json = await leetcodeRes.json();

    if (!json.data || !json.data.matchedUser) {
      return NextResponse.json(
        {
          error: `LeetCode profile "${cleanUsername}" was not found. Please verify the handle.`,
        },
        { status: 404 }
      );
    }

    const matchedUser = json.data.matchedUser;
    const acSubmissions = matchedUser.submitStats?.acSubmissionNum || [];

    const getCount = (diff: string) => {
      const match = acSubmissions.find(
        (item: { difficulty: string; count: number }) =>
          item.difficulty.toLowerCase() === diff.toLowerCase()
      );
      return match ? match.count : 0;
    };

    const totalSolved = getCount("all");
    const easySolved = getCount("easy");
    const mediumSolved = getCount("medium");
    const hardSolved = getCount("hard");

    const recentSubmissions = (json.data.recentAcSubmissionList || []).map(
      (sub: { id: string; title: string; titleSlug: string; timestamp: string }) => ({
        id: sub.id,
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: sub.timestamp,
      })
    );

    return NextResponse.json({
      success: true,
      username: matchedUser.username,
      realName: matchedUser.profile?.realName || matchedUser.username,
      ranking: matchedUser.profile?.ranking || null,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      recentSubmissions,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("LeetCode sync error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to connect to LeetCode API", details: message },
      { status: 500 }
    );
  }
}
