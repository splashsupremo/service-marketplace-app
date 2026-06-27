import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export interface AdminJwtPayload {
  adminId: string;
  email: string;
  fullName: string;
}

export async function signAdminJwt(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h") // Admin sessions expire after 8 hours
    .sign(secret);
}

export async function verifyAdminJwt(
  token: string
): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminJwtPayload;
  } catch {
    return null;
  }
}