import { supabase } from "./supabase";

export async function authWithGoogle(){
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

