"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createJournal } from "@/app/actions/journal";

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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Create profile
  if (data.user?.id) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username,
    });
    if (profileError) {
      return { error: profileError.message };
    }
    const { error: journalError } = await createJournal({
      name: "My Journal",
      description: "My trading journal",
    });
    if (journalError) {
      return { error: journalError };
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
