import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminSupabase } from "@/lib/supabase/admin";
import { signAdminJwt } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Look up admin by email
    const { data: admin, error } = await adminSupabase
      .from("admins")
      .select("id, email, password_hash, full_name")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !admin) {
      // Generic message — don't reveal whether email exists
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password against stored hash
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = await signAdminJwt({
      adminId: admin.id,
      email: admin.email,
      fullName: admin.full_name,
    });

    // Set HttpOnly cookie and redirect to dashboard
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", token, {
      httpOnly: true,        // JS cannot read this cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",       // CSRF protection
      maxAge: 60 * 60 * 8,   // 8 hours in seconds
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}