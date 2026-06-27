import { headers } from "next/headers";

export interface AdminSession {
  adminId: string;
  email: string;
  fullName: string;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const headersList = await headers();

  const adminId = headersList.get("x-admin-id");
  const email = headersList.get("x-admin-email");
  const fullName = headersList.get("x-admin-name");

  if (!adminId || !email || !fullName) return null;

  return { adminId, email, fullName };
}