import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { recipes } from "@/data/recipes";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { recipeSelect, useImageUrl, type UserRecipe } from "@/lib/session";
import { recipeImages } from "@/lib/recipe-images";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock3, Search, SlidersHorizontal, Soup, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bếp Nhà — Công thức nấu ăn mỗi ngày" },
      { name: "description", content: "Tìm và chia sẻ công thức nấu ăn gia đình Việt." },
      { property: "og:title", content: "Bếp Nhà — Công thức nấu ăn mỗi ngày" },
      { property: "og:description", content: "Tìm và chia sẻ công thức nấu ăn gia đình Việt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tags = ["Thịt kho", "Canh chua", "Gà rán", "Bánh flan", "Cá kho tộ", "Bún bò", "Chay", "Ăn sáng"];

function CommunityCard({ r }: { r: UserRecipe }) {
  const img = useImageUrl(r.image_path);
  return (
    <Link
      to="/cong-thuc/$id"
      params={{ id: r.id }}
      className="recipe-card"
    >
      {img ? (
        <img src={img} alt={r.title} className="recipe-photo" loading="lazy" />
      ) : (
        <div className="flex aspect-[1.6] items-center justify-center bg-secondary"><Soup className="h-12 w-12 text-primary" /></div>
      )}
      <div className="p-4">
        <h3 className="font-semibold">{r.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {r.author?.display_name ?? "Thành viên"}{r.time ? ` · ${r.time}` : ""}
        </p>
      </div>
    </Link>
  );
}

function Index() {
  const [q, setQ] = useState("");
  const list = recipes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  const { data: community = [] } = useQuery({
    queryKey: ["user_recipes"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_recipes")
        .select(recipeSelect)
        .order("created_at", { ascending: false })
        .limit(30);
      return (data ?? []) as unknown as UserRecipe[];
    },
  });
  const communityList = community.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="home-page min-h-screen text-foreground">
      <SiteHeader>
        <div className="glass-control flex h-10 items-center gap-2 rounded-full px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm món ngon…"
          aria-label="Tìm món ăn"
          className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q && <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setQ("")} aria-label="Xóa tìm kiếm"><X /></Button>}
        </div>
      </SiteHeader>

      <section className="home-cover relative">
        <img src={hero} alt="Bữa cơm gia đình Việt" className="home-cover-image" />
        <div className="home-cover-content">
          <p className="cover-eyebrow">Một chút yêu thương trong từng món ăn</p>
          <h1>Bếp Nhà</h1>
          <p className="mt-4 text-lg">Hôm nay nấu gì?<br />Tìm cảm hứng cho bữa cơm nhà, từ những công thức gần gũi.</p>
          <Button asChild variant="outline" className="glass-control mt-6 w-fit rounded-full border-glass-border text-foreground">
            <Link to="/goi-y">Khám phá từ nguyên liệu <ArrowRight /></Link>
          </Button>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="section-heading"><h2 className="text-lg font-bold">Hôm nay bạn muốn ăn gì?</h2><span className="hidden text-xs text-muted-foreground sm:inline">Từ khóa thịnh hành</span></div>
        <div className="mb-9 flex flex-wrap gap-2">
          {tags.map((t) => (
            <Button
              key={t}
              onClick={() => setQ(t)}
              variant={q === t ? "default" : "outline"}
              className={q === t ? "rounded-full" : "glass-control rounded-full"}
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="section-heading"><div><h2 className="text-2xl font-extrabold">{q ? `Kết quả cho “${q}”` : "Món mới nhất"}</h2><p className="mt-1 text-sm text-muted-foreground">Cảm hứng từ những căn bếp Việt</p></div><SlidersHorizontal className="h-5 w-5 text-muted-foreground" aria-hidden="true" /></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communityList.map((r) => (
            <CommunityCard key={r.id} r={r} />
          ))}
          {list.map((r) => (
            <Link
              key={r.slug}
              to="/mon/$slug"
              params={{ slug: r.slug }}
              className="recipe-card group"
            >
              <img src={recipeImages[r.slug]} alt={r.title} loading="lazy" width={512} height={512} className="recipe-photo" />
              <div className="p-5">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.author}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{r.time}</span><ArrowRight className="h-4 w-4 text-primary" /></div>
              </div>
            </Link>
          ))}
          {list.length === 0 && communityList.length === 0 && <p className="text-muted-foreground">Không tìm thấy món nào.</p>}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 Bếp Nhà
      </footer>
    </div>
  );
}
