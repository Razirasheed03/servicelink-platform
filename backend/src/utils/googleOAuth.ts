import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
});

export function getGoogleAuthUrl() {
  const scopes = [
    "openid",
    "profile",
    "email",
  ];

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  return url;
}

export async function getGoogleTokens(code: string) {
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function verifyIdToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });
  const payload = ticket.getPayload();
  return payload;
}