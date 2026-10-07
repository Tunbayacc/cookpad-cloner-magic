import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { recipeSelect, useImageUrl, type UserRecipe } from "@/lib/session";

export const Route = createFileRoute("/cong-thuc/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Công thức từ cộng đồng — Bếp Nhà" },
      { name: "description", content: "Công thức nấu ăn do thành viên Bếp Nhà chia sẻ." },
      { property: "og:title", content: "Công thức từ cộng đồng — Bếp Nhà" },
      { property: "og:description", content: "Công thức nấu ăn do thành viên Bếp Nhà chia sẻ." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UserRecipeDetail,
});

function UserRecipeDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["user_recipe", id],
    queryFn: async () => {
      const { data } = await supabase.from("user_recipes").select(recipeSelect).eq("id", id).maybeSingle();
      return (data as unknown as UserRecipe) ?? null;
    },
  });
  const img = useImageUrl(data?.image_path ?? null);

  if (isLoading) return <div className="min-h-screen bg-background"><SiteHeader /><p className="p-10 text-center text-muted-foreground">Đang tải...</p></div>;
  if (!data)
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy món này</h1>
          <Link to="/" className="mt-4 inline-block text-primary">Về trang chủ</Link>
        </div>
      </div>
    );

  const author = data.author;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Về trang chủ</Link>
        {img ? (
          <img src={img} alt={data.title} className="mt-4 h-72 w-full rounded-xl object-cover" />
        ) : (
          <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-secondary text-7xl">🍲</div>
        )}
        <h1 className="mt-6 text-3xl font-extrabold">{data.title}</h1>
        {data.intro && <p className="mt-2 text-muted-foreground">{data.intro}</p>}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {data.time && <span className="rounded-full bg-secondary px-3 py-1">⏱ {data.time}</span>}
          {data.servings && <span className="rounded-full bg-secondary px-3 py-1">🍛 {data.servings}</span>}
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr]">
          <section>
            <h2 className="mb-3 text-lg font-bold">Nguyên liệu</h2>
            <ul className="space-y-2">
              {data.ingredients.map((i, k) => (
                <li key={k} className="flex justify-between gap-4 border-b pb-2 text-sm">
                  <span>{i.name}</span>
                  <span className="whitespace-nowrap text-muted-foreground">{i.amount}</span>
                </li>
              ))}
            </ul>
            {author && (
              <div className="mt-8 rounded-xl border bg-card p-4">
                <h3 className="font-semibold">Người đăng</h3>
                <div className="mt-2 flex items-center gap-3">
                  {author.avatar_url ? (
                    <img src={author.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {author.display_name.charAt(0)}
                    </div>
                  )}
                  <p className="font-medium">{author.display_name}</p>
                </div>
                {author.bio && <p className="mt-3 text-sm text-muted-foreground">{author.bio}</p>}
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 text-lg font-bold">Hướng dẫn nấu</h2>
            <ol className="space-y-4">
              {data.steps.map((s, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{idx + 1}</span>
                  <p className="pt-1 text-sm">{s}</p>
                </li>
              ))}
            </ol>
            {data.tips && (
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                <span className="font-semibold">💡 Mẹo nhỏ: </span>{data.tips}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
