import { jwtVerify, SignJWT } from "jose";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/lib/constants";

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET environment variables",
  );
}

const accessToken = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
const refreshToken = new TextEncoder().encode(REFRESH_TOKEN_SECRET);

// Define a type for JWT payload
export type JWTPayload = Record<string, unknown>;

// Create access token (short-lived)
export async function createAccessToken(payload: JWTPayload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(accessToken);
    console.debug("Access token created", { payload });
    return token;
  } catch (error) {
    console.error("Failed to create access token", { error: String(error) });
    throw error;
  }
}

// Create refresh token (long-lived)
export async function createRefreshToken(payload: JWTPayload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(refreshToken);
    console.debug("Refresh token created", { payload });
    return token;
  } catch (error) {
    console.error("Failed to create refresh token", { error: String(error) });
    throw error;
  }
}

// Verify access token
export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, accessToken);
    console.debug("Access token verified", { payload });
    return { payload, valid: true };
  } catch (error) {
    console.warn("Access token verification failed", {
      error: String(error),
      token,
    });
    return { error, valid: false };
  }
}

// Verify refresh token
export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, refreshToken);
    console.debug("Refresh token verified", { payload });
    return { payload, valid: true };
  } catch (error) {
    console.warn("Refresh token verification failed", {
      error: String(error),
      token,
    });
    return { error, valid: false };
  }
}
