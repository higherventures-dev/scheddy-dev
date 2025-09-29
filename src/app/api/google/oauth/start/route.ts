// import { NextRequest, NextResponse } from "next/server";
// import { google } from "googleapis";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const returnTo = searchParams.get("returnTo") ?? "/dashboard/settings/integrations";

//   const oAuth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID!,
//     process.env.GOOGLE_CLIENT_SECRET!,
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/oauth/callback`
//   );

//   const url = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     include_granted_scopes: true,
//     scope: [
//       "https://www.googleapis.com/auth/calendar",
//       "https://www.googleapis.com/auth/userinfo.email",
//     ],
//     state: encodeURIComponent(returnTo),
//   });

//   return NextResponse.redirect(url);
// }
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get("returnTo") ?? "/dashboard/settings/integrations";

  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const redirectUri = `${base}/api/google/oauth/callback`;

  const oAuth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri
  );

  // Put returnTo into base64url JSON to avoid double-encoding issues
  const state = Buffer.from(JSON.stringify({ returnTo })).toString("base64url");

  const authUrl = oAuth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state,
  });

  return NextResponse.redirect(authUrl);
}
