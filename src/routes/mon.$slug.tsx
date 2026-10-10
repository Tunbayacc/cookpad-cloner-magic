import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { getRecipe, recipes } from "@/data/recipes";
import { SiteHeader } from "@/components/SiteHeader";
import { FavoriteButton } from "@/components/FavoriteButton";
import { recipeImages } from "@/lib/recipe-images";

export const Route = createFileRoute("/mon/$slug")({
  loader: ({ params }) => {
    const recipe = getRecipe(params.slug);
    if (!recipe) throw notFound();
    return { recipe };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Không tìm thấy món — Bếp Nhà" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { recipe } = loaderData;
    return {
      meta: [
        { title: `${recipe.title} — Bếp Nhà` },
        { name: "description", content: recipe.intro },
        { property: "og:title", content: `${recipe.title} — Bếp Nhà` },
        { property: "og:description", content: recipe.intro },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: RecipeNotFound,
  component: RecipeDetail,
});

function RecipeDetail() {
  const { recipe } = Route.useLoaderData();
  const authorOthers = recipes.filter((r) => r.slug !== recipe.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Về trang chủ
        </Link>

        <img src={recipeImages[recipe.slug]} alt={recipe.title} width={512} height={512} className="mt-4 h-64 w-full rounded-lg object-cover md:h-80" />

        <div className="recipe-summary">
        <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-extrabold">{recipe.title}</h1>
          <FavoriteButton recipeKey={`mon:${recipe.slug}`} />
        </div>
        <p className="mt-2 text-muted-foreground">{recipe.intro}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="glass-control rounded-full px-3 py-1">⏱ {recipe.time}</span>
          <span className="glass-control rounded-full px-3 py-1">🍛 {recipe.servings}</span>
        </div>
        </div>

        <div className="recipe-columns grid gap-8 md:grid-cols-[1fr_2fr]">
          <section>
            <h2 className="mb-3 text-lg font-bold">Nguyên liệu</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((i) => (
                <li key={i.name} className="flex justify-between gap-4 border-b pb-2 text-sm">
                  <span>{i.name}</span>
                  <span className="whitespace-nowrap text-muted-foreground">{i.amount}</span>
                </li>
              ))}
            </ul>

            <div className="glass-surface mt-8 rounded-lg border p-4">
              <h3 className="font-semibold">Người đăng</h3>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {recipe.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{recipe.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {recipe.authorRecipes} công thức
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{recipe.authorBio}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">Hướng dẫn nấu</h2>
            <ol className="space-y-4">
              {recipe.steps.map((s, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <p className="pt-1 text-sm">{s}</p>
                </li>
              ))}
            </ol>

            {recipe.tips && (
              <div className="glass-note mt-6 rounded-lg border p-4 text-sm">
                <span className="font-semibold">💡 Mẹo nhỏ: </span>
                {recipe.tips}
              </div>
            )}
          </section>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold">Công thức khác</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {authorOthers.map((r) => (
              <Link
                key={r.slug}
                to="/mon/$slug"
                params={{ slug: r.slug }}
                className="recipe-card p-4"
              >
                <img src={recipeImages[r.slug]} alt={r.title} loading="lazy" width={512} height={512} className="mb-3 h-28 w-full rounded-lg object-cover" />
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.author} · {r.time}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 Bếp Nhà
      </footer>
    </div>
  );
}

function RecipeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <p className="text-5xl">🍜</p>
      <h1 className="text-2xl font-bold">Không tìm thấy món này</h1>
      <Link to="/" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Về trang chủ
      </Link>
    </div>
  );
}
