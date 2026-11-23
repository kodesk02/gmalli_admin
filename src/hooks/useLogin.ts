import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { AdminUser } from "@/lib/types";
import { SESSION_KEY } from "./useSession";

interface Credentials {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: Credentials): Promise<AdminUser> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      try {
        const { admin } = await api.get<{ admin: AdminUser }>("/admin/me");
        return admin;
      } catch (err) {
        await supabase.auth.signOut();
        throw err;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_KEY }),
  });
}