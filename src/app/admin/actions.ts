"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "E-mail ou senha invalidos.",
      };
    }

    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/admin/login",
  });
}
