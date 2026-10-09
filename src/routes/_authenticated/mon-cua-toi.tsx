import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { recipeSelect, useImageUrl, type UserRecipe } from "@/lib/session";

export const Route = createFileRoute("/_authenticated/mon-cua-toi")({
  head: () => ({
    meta: [
      { title: "Món của tôi — Bếp Nhà" },
      { name: "description", content: "Quản lý các công thức bạn đã đăng trên Bếp Nhà." },
      { property: "og:title", content: "Món của tôi — Bếp Nhà" },
      { property: "og:description", content: "Quản lý các công thức bạn đã đăng trên Bếp Nhà." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyRecipes,
});

function MyRecipes() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["my_recipes", user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_recipes")
        .select(recipeSelect)
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      return (data as unknown as UserRecipe[]) ?? [];
    },
  });

  async function remove(r: UserRecipe) {
    if (!confirm(`Xóa món "${r.title}"?`)) return;
    const { error } = await supabase.from("user_recipes").delete().eq("id", r.id);
    if (error) return alert("Xóa không được, vui lòng thử lại.");
    if (r.image_path) await supabase.storage.from("recipe-images").remove([r.image_path]);
    qc.invalidateQueries();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold">Món của tôi</h1>
          <Link to="/viet-mon" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            + Viết món mới
          </Link>
        </div>
        {isLoading ? (
          <p className="mt-8 text-muted-foreground">Đang tải...</p>
        ) : data.length === 0 ? (
          <p className="mt-8 text-muted-foreground">Bạn chưa đăng món nào.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {data.map((r) => (
              <Row key={r.id} r={r} onDelete={() => remove(r)} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function Row({ r, onDelete }: { r: UserRecipe; onDelete: () => void }) {
  const img = useImageUrl(r.image_path);
  return (
    <li className="flex items-center gap-4 rounded-xl border bg-card p-3">
      {img ? (
        <img src={img} alt={r.title} className="h-16 w-16 rounded-lg object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary text-3xl">🍲</div>
      )}
      <Link to="/cong-thuc/$id" params={{ id: r.id }} className="min-w-0 flex-1">
        <p className="truncate font-semibold">{r.title}</p>
        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("vi-VN")}</p>
      </Link>
      <Link to="/viet-mon" search={{ id: r.id }} className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm">
        <Pencil className="h-4 w-4" /> Sửa
      </Link>
      <button onClick={onDelete} className="flex items-center gap-1 rounded-full border border-destructive/40 px-3 py-1.5 text-sm text-destructive">
        <Trash2 className="h-4 w-4" /> Xóa
      </button>
    </li>
  );
}
