"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import {
  validateUsername,
  validatePassword,
} from "@/lib/validations/validations";
import { redirect } from "next/navigation";

export async function signUp(
  email: string,
  password: string,
  username: string,
) {
  // Basic validation
  if (!email || !password) {
    return { error: "Email and password required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const normalizedUsername = username.trim().toLowerCase();
  const usernameError = validateUsername(normalizedUsername);
  if (usernameError) return { error: usernameError };

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return { error: error.message };

  // Create profile
  if (data.user?.id) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: normalizedUsername,
    });
    if (profileError) {
      if (profileError.code === "23505")
        return { error: "Username already taken" };
      return { error: "Couldn't create your profile" };
    }
  }

  if (data.session) {
    redirect("/journals");
  }

  redirect("/login?message=Check your email to confirm your account");
}

export async function signIn(email: string, password: string) {
  if (!email || !password) {
    return { error: "Email and password required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/journals");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function changePassword(newPassword: string) {
  await requireUser();

  const validationError = validatePassword(newPassword);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) return { error: error.message };

  // Sign out every other device. This session stays open.
  await supabase.auth.signOut({ scope: "others" });

  return { error: null };
}
