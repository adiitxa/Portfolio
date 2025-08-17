
import { supabase } from "@/integrations/supabase/client";

export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: "adityabgaikwad0012@gmail.com",
      password: "Aditya@00012",
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      }
    });

    if (error) {
      console.error("Error creating admin user:", error);
      return { success: false, error: error.message };
    }

    console.log("Admin user created successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
};
