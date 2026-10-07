import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return { user, ready };
}

export type UserRecipe = {
  id: string;
  title: string;
  intro: string;
  time: string;
  servings: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  tips: string | null;
  image_path: string | null;
  created_at: string;
  author: { id: string; display_name: string; avatar_url: string | null; bio: string } | null;
};

export const recipeSelect =
  "id,title,intro,time,servings,ingredients,steps,tips,image_path,created_at,author:profiles(id,display_name,avatar_url,bio)";

export function useImageUrl(path: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!path) return;
    supabase.storage
      .from("recipe-images")
      .createSignedUrl(path, 3600)
      .then(({ data }) => setUrl(data?.signedUrl ?? null));
  }, [path]);
  return url;
}
