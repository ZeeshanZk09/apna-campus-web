import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

/**
 * Generate a new TOTP secret for a user.
 */
export function generate2FASecret(email: string) {
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer: "apna-campus",
    label: email,
    secret,
  });
  return { secret, otpauthUrl };
}

/**
 * Generate a QR code data URL from an otpauth URL.
 */
export async function generateQRCode(otpauthUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (err) {
    console.error("Error generating QR code", err);
    throw new Error("Could not generate QR code");
  }
}

/**
 * Verify a TOTP token against a secret.
 * @param token - The 6-digit TOTP code from the authenticator app
 * @param secret - The user's stored TOTP secret
 * @returns boolean — true if the token is valid
 */
export function verify2FAToken(token: string, secret: string): boolean {
  const result = verifySync({ token, secret });
  return result.valid === true;
}

/**
 * Generate backup codes (cryptographically weak — for demo only).
 */
export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}
