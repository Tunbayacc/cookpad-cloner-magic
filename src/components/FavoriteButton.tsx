import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/session";
import { Heart } from "lucide-react";

/** recipeKey: "mon:<slug>" for sample recipes, "ct:<id>" for member recipes */
export function FavoriteButton({ recipeKey }: { recipeKey: string }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: saved = false } = useQuery({
    queryKey: ["favorite", user?.id, recipeKey],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("favorites").select("id").eq("recipe_key", recipeKey).maybeSingle();
      return !!data;
    },
  });

  async function toggle() {
    if (!user) return navigate({ to: "/auth" });
    setBusy(true);
    if (saved) await supabase.from("favorites").delete().eq("recipe_key", recipeKey).eq("user_id", user.id);
    else await supabase.from("favorites").insert({ user_id: user.id, recipe_key: recipeKey });
    await qc.invalidateQueries({ queryKey: ["favorite"] });
    await qc.invalidateQueries({ queryKey: ["favorites"] });
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`glass-heart inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        saved ? "glass-heart-on" : ""
      }`}
    >
      <Heart className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
      {saved ? "Đã yêu thích" : "Yêu thích"}
    </button>
  );
}
