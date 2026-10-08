import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { recipes } from "@/data/recipes";

export const Route = createFileRoute("/_authenticated/yeu-thich")({
  head: () => ({
    meta: [
      { title: "Món yêu thích — Bếp Nhà" },
      { name: "description", content: "Các công thức bạn đã lưu trên Bếp Nhà." },
      { property: "og:title", content: "Món yêu thích — Bếp Nhà" },
      { property: "og:description", content: "Các công thức bạn đã lưu trên Bếp Nhà." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Favorites,
});

type Item = { key: string; title: string; sub: string; link: { kind: "mon"; slug: string } | { kind: "ct"; id: string } };

function Favorites() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async (): Promise<Item[]> => {
      const { data: favs } = await supabase.from("favorites").select("recipe_key").order("created_at", { ascending: false });
      const keys = (favs ?? []).map((f) => f.recipe_key);
      const ids = keys.filter((k) => k.startsWith("ct:")).map((k) => k.slice(3));
      const { data: rows } = ids.length
        ? await supabase.from("user_recipes").select("id,title,time,author:profiles(display_name)").in("id", ids)
        : { data: [] };
      const items: Item[] = [];
      for (const k of keys) {
        if (k.startsWith("mon:")) {
          const r = recipes.find((x) => x.slug === k.slice(4));
          if (r) items.push({ key: k, title: r.title, sub: `${r.author} · ${r.time}`, link: { kind: "mon", slug: r.slug } });
        } else {
          const r = (rows ?? []).find((x) => x.id === k.slice(3)) as
            | { id: string; title: string; time: string; author: { display_name: string } | null }
            | undefined;
          if (r) items.push({ key: k, title: r.title, sub: `${r.author?.display_name ?? "Thành viên"}${r.time ? ` · ${r.time}` : ""}`, link: { kind: "ct", id: r.id } });
        }
      }
      return items;
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-extrabold">Món yêu thích</h1>
        {isLoading && <p className="text-muted-foreground">Đang tải...</p>}
        {!isLoading && data.length === 0 && (
          <p className="text-muted-foreground">
            Bạn chưa lưu món nào. Bấm "♡ Yêu thích" trên trang chi tiết món để lưu lại.
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((it) => {
            const cls = "overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md";
            const body = (
              <>
                <div className="flex h-32 items-center justify-center bg-secondary text-5xl">🍲</div>
                <div className="p-4">
                  <h3 className="font-semibold">{it.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{it.sub}</p>
                </div>
              </>
            );
            return it.link.kind === "mon" ? (
              <Link key={it.key} to="/mon/$slug" params={{ slug: it.link.slug }} className={cls}>{body}</Link>
            ) : (
              <Link key={it.key} to="/cong-thuc/$id" params={{ id: it.link.id }} className={cls}>{body}</Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
