"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function login(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: (formData.get("email") as string).trim().toLowerCase(),
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: "Email ou senha incorretos." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
